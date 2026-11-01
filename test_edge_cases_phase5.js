if (process.env.CYBERLAB_TEST_ISOLATED !== '1') { console.error('Use npm test or node scripts/test-isolated.js test_edge_cases_phase5.js'); process.exit(1); }
// ============================================================================
// BANC DE TESTS DE ROBUSTESSE & CAS LIMITES — PHASE 5
// CyberRange PRO : Durcissement Sécurité, Anti-CSRF, Rate Limiting, Confinement & Intégrité
// ============================================================================

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { spawn } = require('node:child_process');
const { MemoryRateLimiter } = require('./platform/rate_limiter');
const updater = require('./updater');

const BASE_URL = `http://127.0.0.1:${process.env.PORT}`;

async function isServerUp() {
  try {
    const res = await fetch(`${BASE_URL}/api/version`, { signal: AbortSignal.timeout(1000) });
    return res.ok;
  } catch {
    return false;
  }
}

async function ensureServerRunning() {
  if (await isServerUp()) { throw new Error('Test port already occupied; refusing to reuse a server.');
    console.log('[TEST] Serveur CyberLab déjà actif sur port 3333.');
    return null;
  }

  console.log('[TEST] Démarrage automatique du serveur CyberLab...');
  let stderrOutput = '';
  const server = spawn(process.execPath, ['server.js'], { cwd: __dirname });
  server.stdout.on('data', d => process.stdout.write(d));
  server.stderr.on('data', d => { stderrOutput += d.toString(); process.stderr.write(d); });

  const start = Date.now();
  while (Date.now() - start < 12000) {
    if (server.exitCode !== null) {
      throw new Error(`Serveur crashé avec code ${server.exitCode}.\n${stderrOutput}`);
    }
    await new Promise(r => setTimeout(r, 400));
    if (await isServerUp()) return server;
  }
  throw new Error('Connexion impossible au serveur CyberLab après 12s.');
}

async function runEdgeCases() {
  console.log('[TEST] Démarrage des tests cas limites & robustesse Phase 5...');

  // --------------------------------------------------------------------------
  // 1. Tests Cas Limites du Rate Limiter en Mémoire
  // --------------------------------------------------------------------------
  console.log('1. Tests cas limites du Rate Limiter (isolation, expiration, multi-IP)...');
  const customLimiter = new MemoryRateLimiter({ windowMs: 1000, max: 3 });

  // 3 requêtes consécutives autorisées
  assert(!customLimiter.check('ip1:/test').limited, 'Req 1 ok');
  assert(!customLimiter.check('ip1:/test').limited, 'Req 2 ok');
  assert(!customLimiter.check('ip1:/test').limited, 'Req 3 ok');

  // 4ème requête rejetée
  const limitCheck = customLimiter.check('ip1:/test');
  assert(limitCheck.limited === true, 'Req 4 rate limited');
  assert(limitCheck.retryAfter >= 1, 'Retry-after is positive number');

  // Clé différente (autre IP) non affectée
  assert(!customLimiter.check('ip2:/test').limited, 'Different IP is not rate limited');

  // Reset explicite
  customLimiter.reset('ip1:/test');
  assert(!customLimiter.check('ip1:/test').limited, 'Reset clears rate limit for key');

  // Test expiration après écoulement de la fenêtre
  const fastLimiter = new MemoryRateLimiter({ windowMs: 200, max: 2 });
  fastLimiter.check('clientA');
  fastLimiter.check('clientA');
  assert(fastLimiter.check('clientA').limited, 'Client limited at threshold');
  await new Promise(r => setTimeout(r, 250));
  assert(!fastLimiter.check('clientA').limited, 'Limit cleared after window elapsed');
  console.log('✔ Rate Limiter testé sous toutes les conditions de bord.');

  // --------------------------------------------------------------------------
  // 2. Tests Cas Limites Anti-CSRF
  // --------------------------------------------------------------------------
  console.log('2. Tests cas limites Anti-CSRF (jetons expirés, malformés, vides)...');
  // Jeton vide
  const resEmptyToken = await fetch(`${BASE_URL}/api/reset-profile`, {
    method: 'POST',
    headers: { 'X-CSRF-Token': '' }
  });
  assert(resEmptyToken.status === 403, 'Empty token rejected with 403');

  // Whitespace only
  const resWhitespaceToken = await fetch(`${BASE_URL}/api/reset-profile`, {
    method: 'POST',
    headers: { 'X-CSRF-Token': '     ' }
  });
  assert(resWhitespaceToken.status === 403, 'Whitespace token rejected with 403');

  // Token trop long / SQL injection attempt
  const resSqliToken = await fetch(`${BASE_URL}/api/reset-profile`, {
    method: 'POST',
    headers: { 'X-CSRF-Token': "' OR '1'='1" }
  });
  assert(resSqliToken.status === 403, 'SQLi attempt as token rejected with 403');

  // Cross-origin attempt with Origin header from an untrusted origin
  const resCrossOriginToken = await fetch(`${BASE_URL}/api/csrf-token`, {
    headers: { 'Origin': 'https://evil-hacker.com' }
  });
  assert(resCrossOriginToken.status === 403, 'Foreign Origin on /api/csrf-token rejected with 403 Forbidden');

  // Cross-origin state modification attempt
  const validCsrfForTest = (await fetch(`${BASE_URL}/api/csrf-token`).then(r => r.json())).csrfToken;
  const resCrossOriginReset = await fetch(`${BASE_URL}/api/reset-profile`, {
    method: 'POST',
    headers: {
      'X-CSRF-Token': validCsrfForTest,
      'Origin': 'https://evil-hacker.com'
    }
  });
  assert(resCrossOriginReset.status === 403, 'Cross-origin state alteration rejected with 403 Forbidden');

  // Génération de jeton valide
  const csrf1 = (await fetch(`${BASE_URL}/api/csrf-token`).then(r => r.json())).csrfToken;
  assert(typeof csrf1 === 'string' && csrf1.length === 64, 'Token is 64-char hex');
  console.log('✔ Sécurité Anti-CSRF validée sur tous les vecteurs de contournement.');

  // --------------------------------------------------------------------------
  // 3. Tests Cas Limites Confinement & Path Traversal sur Téléchargements
  // --------------------------------------------------------------------------
  console.log('3. Tests cas limites Path Traversal (%2e, null byte, backslashes, escape)...');

  const attackVectors = [
    '/targets/training/download/network/net-01-wireshark-ftp/..',
    '/targets/training/download/network/net-01-wireshark-ftp/../..',
    '/targets/training/download/network/net-01-wireshark-ftp/%2e%2e/%2e%2e',
    '/targets/training/download/network/net-01-wireshark-ftp/..%2f..%2fserver.js',
    '/targets/training/download/network/net-01-wireshark-ftp/%2e%2e%2f..%2fcyberrange.db',
    '/targets/training/download/network/net-01-wireshark-ftp/..\\..\\server.js',
    '/targets/training/download/network/net-01-wireshark-ftp/%252e%252e/%252e%252e/server.js',
    '/targets/training/download/network/net-01-wireshark-ftp/%2e%2e%5cserver.js',
    '/targets/training/download/network/net-01-wireshark-ftp/ftp_session_capture.pcap%00.txt',
    '/targets/training/download/network/../server.js',
    '/targets/training/download/..%2f..%2f..%2fetc%2fpasswd'
  ];

  for (const vec of attackVectors) {
    const res = await fetch(`${BASE_URL}${vec}`);
    assert(res.status === 404 || res.status === 400 || res.status === 403, `Attack vector ${vec} rejected (got ${res.status})`);
  }
  console.log('✔ 11 vecteurs d\'attaque Path Traversal bloqués sans concession.');

  // --------------------------------------------------------------------------
  // 4. Tests Cas Limites Intégrité SHA-256 dans updater.js
  // --------------------------------------------------------------------------
  console.log('4. Tests cas limites Intégrité SHA-256 (fichiers inexistants, hash partiel)...');

  // Fichier inexistant
  let missingFileCaught = false;
  try {
    updater.computeFileSha256('ghost_non_existent_file_xyz.zip');
  } catch (e) {
    missingFileCaught = true;
  }
  assert(missingFileCaught, 'Missing file properly throws error');

  // Case-insensitivity test (les hashs hex majuscules ou minuscules doivent correspondre)
  const realHash = updater.computeFileSha256('package.json');
  const upperHash = realHash.toUpperCase();
  const verifyUpper = updater.verifyZipIntegrity('package.json', upperHash);
  assert(verifyUpper.toLowerCase() === realHash.toLowerCase(), 'Case-insensitive SHA-256 validation passes');
  console.log('✔ Contrôles d\'intégrité SHA-256 éprouvés.');

  // --------------------------------------------------------------------------
  // 5. Tests Portabilité & Scripts Bash
  // --------------------------------------------------------------------------
  console.log('5. Tests conformité syntaxique des scripts Bash...');
  const startSh = fs.readFileSync('start.sh', 'utf8');
  assert(startSh.startsWith('#!/usr/bin/env bash'), 'start.sh has portable bash shebang');
  assert(startSh.includes('cd "$(dirname "${BASH_SOURCE[0]}")"'), 'start.sh safely locks project directory');
  assert(startSh.includes('node -v'), 'start.sh checks node version');
  assert(startSh.includes('xdg-open') && startSh.includes('open '), 'start.sh handles Linux and macOS');

  const updateSh = fs.readFileSync('update.sh', 'utf8');
  assert(updateSh.startsWith('#!/usr/bin/env bash'), 'update.sh has portable bash shebang');
  assert(updateSh.includes('cd "$(dirname "${BASH_SOURCE[0]}")"'), 'update.sh safely locks project directory');
  assert(updateSh.includes('updater.js apply'), 'update.sh calls updater.js apply');

  // Vérification des droits exécutables dans le catalogue Git
  const { execSync } = require('child_process');
  // The sandbox has no .git directory. Verify the shipped scripts themselves.
  if (process.platform !== 'win32') {
    assert(fs.statSync('start.sh').mode & 0o111, 'start.sh is executable');
    assert(fs.statSync('update.sh').mode & 0o111, 'update.sh is executable');
  }
  console.log('✔ Scripts de démarrage et mise à jour multiplateforme validés.');

  console.log('========================================================================');
  console.log('🎉 TOUS LES TESTS DE ROBUSTESSE ET CAS LIMITES DE LA PHASE 5 SONT AU VERT !');
  console.log('========================================================================');
}

let ownedServer;
process.on('exit', () => { if (ownedServer) ownedServer.kill(); });
ensureServerRunning().then(server => { ownedServer = server; return runEdgeCases(); }).then(() => {
  process.exit(0);
}).catch(err => {
  console.error('FAILED:', err);
  process.exit(1);
});

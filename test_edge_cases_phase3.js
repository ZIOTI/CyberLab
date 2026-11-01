if (process.env.CYBERLAB_TEST_ISOLATED !== '1') { console.error('Use npm test or node scripts/test-isolated.js test_edge_cases_phase3.js'); process.exit(1); }
const assert = require('assert');
const fs = require('fs');
const { spawn } = require('node:child_process');

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
  const server = spawn(process.execPath, ['server.js'], { cwd: __dirname });
  const start = Date.now();
  while (Date.now() - start < 12000) {
    if (server.exitCode !== null) {
      throw new Error(`Le serveur CyberLab a crashé immédiatement avec le code ${server.exitCode}.`);
    }
    await new Promise(r => setTimeout(r, 400));
    if (await isServerUp()) {
      console.log('[TEST] Serveur CyberLab opérationnel et prêt pour les tests.');
      return server;
    }
  }
  try { server.kill(); } catch {}
  throw new Error('Impossible de se connecter au serveur CyberLab.');
}

async function runPhase3EdgeCases() {
  console.log('[TEST] Démarrage des tests de robustesse et cas limites de la Phase 3...');
  const serverProcess = await ensureServerRunning();

  try {
    // 1. Wi-Fi Module Edge Cases
    console.log('1. Tests cas limites Wi-Fi & Réseau Avancé...');
    // Empty payload
    const wEmpty = await fetch(`${BASE_URL}/api/modules/wifi/wpa-handshake`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    }).then(r => r.json());
    assert(wEmpty.success === true && wEmpty.inspection_only === true, 'Empty handshake payload returns inspection data safely');

    // Wrong passphrase
    const wWrong = await fetch(`${BASE_URL}/api/modules/wifi/wpa-handshake`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passphrase: 'TotallyWrongPassword' })
    }).then(r => r.json());
    assert(wWrong.success === false && wWrong.cracked === false, 'Wrong passphrase rejected safely');

    // Wordlist without matching password
    const wListFail = await fetch(`${BASE_URL}/api/modules/wifi/wpa-handshake`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wordlist: ['alpha', 'bravo', 'charlie'] })
    }).then(r => r.json());
    assert(wListFail.success === true && wListFail.cracked === false, 'Non-matching wordlist does not crack');

    // Wordlist with matching password
    const wListWin = await fetch(`${BASE_URL}/api/modules/wifi/wpa-handshake`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wordlist: ['alpha', 'AegisSecureWiFi#2026', 'charlie'] })
    }).then(r => r.json());
    assert(wListWin.success === true && wListWin.cracked === true, 'Matching wordlist cracks handshake');

    // Clean Wi-Fi survey (no rogue AP)
    const wClean = await fetch(`${BASE_URL}/api/modules/wifi/rogue-ap-detect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        survey_entries: [
          { ssid: 'Aegis-Corporate-Secure', bssid: '00:14:6C:7E:40:80', channel: 6, encryption: 'WPA2-CCMP' }
        ]
      })
    }).then(r => r.json());
    assert(wClean.success === true && wClean.rogue_detected === false, 'Clean survey reports no rogue AP');

    // Incomplete Wi-Fi Hardening
    const wHardFail = await fetch(`${BASE_URL}/api/modules/wifi/hardening`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wpa3_sae: true, wips_enabled: false })
    }).then(r => r.json());
    assert(wHardFail.success === false && wHardFail.hardened === false, 'Incomplete Wi-Fi hardening rejected');
    console.log('✔ Wi-Fi & Réseau Avancé validés.');

    // 2. Phishing Module Edge Cases
    console.log('2. Tests cas limites Phishing & Ingénierie Sociale...');
    // Empty email
    const pEmpty = await fetch(`${BASE_URL}/api/modules/phishing/analyze-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ raw: '' })
    }).then(r => r.json());
    assert(pEmpty.success === false, 'Empty email rejected safely');

    // Clean legitimate email
    const pClean = await fetch(`${BASE_URL}/api/modules/phishing/analyze-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        raw: 'From: "Support" <support@aegis-defense.com>\nAuthentication-Results: spf=pass; dkim=pass; dmarc=pass\nSubject: Réunion de service'
      })
    }).then(r => r.json());
    assert(pClean.success === false && pClean.verdict.includes('CLEAN'), 'Legitimate email classified as clean');

    // Benign PDF attachment
    const pPdf = await fetch(`${BASE_URL}/api/modules/phishing/attachment-scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file_name: 'rapport_mensuel.pdf', file_content: '%PDF-1.4 ...' })
    }).then(r => r.json());
    assert(pPdf.success === false && pPdf.verdict === 'CLEAN', 'Benign PDF classified as clean');

    // Incomplete phishing hardening
    const pHardFail = await fetch(`${BASE_URL}/api/modules/phishing/hardening`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dmarc_policy: 'none', spf_strict: true })
    }).then(r => r.json());
    assert(pHardFail.success === false && pHardFail.hardened === false, 'Permissive DMARC policy rejected');
    console.log('✔ Phishing & Ingénierie Sociale validés.');

    // 3. AI / LLM Security Edge Cases
    console.log('3. Tests cas limites Sécurité IA & LLM...');
    // Benign context
    const aiClean = await fetch(`${BASE_URL}/api/modules/aillm/indirect-injection`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ context_document: 'Rapport météo ordinaire.', user_query: 'Quel temps fait-il ?', guardrail: false })
    }).then(r => r.json());
    assert(aiClean.success === true && aiClean.exploited === false, 'Clean context document not exploited');

    // Benign prompt
    const aiPromptClean = await fetch(`${BASE_URL}/api/modules/aillm/jailbreak`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'Bonjour, peux-tu m\'aider à auditer un réseau ?', guardrail: false })
    }).then(r => r.json());
    assert(aiPromptClean.success === true && aiPromptClean.exploited === false, 'Benign user prompt not flagged as jailbreak');

    // Clean output without markdown image
    const aiOutClean = await fetch(`${BASE_URL}/api/modules/aillm/data-exfil`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ output_payload: 'Texte normal sans balise image.', guardrail: false })
    }).then(r => r.json());
    assert(aiOutClean.success === true && aiOutClean.exploited === false, 'Clean output not flagged as exfiltration');

    // Incomplete guardrails
    const aiGuardFail = await fetch(`${BASE_URL}/api/modules/aillm/guardrail-verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input_sanitization: true, delimiters_isolated: false })
    }).then(r => r.json());
    assert(aiGuardFail.success === false && aiGuardFail.hardened === false, 'Incomplete AI guardrail rejected');
    console.log('✔ Sécurité IA & LLM validée.');

    // 4. Security & Path Traversal on Download Endpoint
    console.log('4. Tests de sécurité sur le téléchargement d\'artefacts (Anti-Path Traversal)...');
    // Traversal attempts
    const trav1 = await fetch(`${BASE_URL}/targets/training/download/network/net-01-wireshark-ftp/../../../../server.js`);
    assert(trav1.status === 404, 'Path traversal attempt 1 safely rejected with 404');

    const trav2 = await fetch(`${BASE_URL}/targets/training/download/crypto/crypto-01-rot-vault/..%2f..%2fcyberrange.db`);
    assert(trav2.status === 404, 'Encoded path traversal attempt safely rejected with 404');

    // Non existent file
    const noFile = await fetch(`${BASE_URL}/targets/training/download/network/net-01-wireshark-ftp/ghost_file.bin`);
    assert(noFile.status === 404, 'Non-existent file request safely returns 404');
    console.log('✔ Sécurité du téléchargement d\'artefacts validée.');

    // 5. Ethics Case Unknown ID
    console.log('5. Tests cas limites Éthique & Droit...');
    const ethBad = await fetch(`${BASE_URL}/api/modules/ethics/case`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ case_id: 'unknown-case-id', action: 'ANY_ACTION' })
    }).then(r => r.json());
    assert(ethBad.error, 'Unknown ethics case ID handled safely');

    const ethWrongAction = await fetch(`${BASE_URL}/api/modules/ethics/case`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ case_id: 'case-stad-intrusion', action: 'WRONG_LEGAL_ACTION' })
    }).then(r => r.json());
    assert(ethWrongAction.is_correct === false, 'Incorrect legal action rejected');
    console.log('✔ Éthique & Droit validés.');

    // 6. Tests des 4 nouveaux labs et téléchargement de leurs artefacts
    console.log('6. Tests de téléchargement des artefacts des 4 nouveaux labs...');
    const newArtifactTests = [
      { cat: 'systems', id: 'win-09-ad-priv-seimpersonate', file: 'potato_trigger.ps1', minSize: 100 },
      { cat: 'systems', id: 'win-09-ad-priv-seimpersonate', file: 'whoami_priv.txt', minSize: 50 },
      { cat: 'systems', id: 'win-09-ad-priv-seimpersonate', file: 'service_account_token.json', minSize: 100 },
      { cat: 'ai', id: 'ai-02-jailbreak-data-exfil', file: 'chat_history_leak.json', minSize: 100 },
      { cat: 'ai', id: 'ai-02-jailbreak-data-exfil', file: 'guardrail_policy.json', minSize: 100 },
      { cat: 'ai', id: 'ai-02-jailbreak-data-exfil', file: 'llm_jailbreak_prompts.txt', minSize: 100 },
      { cat: 'ethics', id: 'law-01-stad-godfrain-compliance', file: 'mandat_audit_pentest_template.pdf.txt', minSize: 100 },
      { cat: 'ethics', id: 'law-01-stad-godfrain-compliance', file: 'extrait_code_penal_323-1.md', minSize: 100 },
      { cat: 'ethics', id: 'law-01-stad-godfrain-compliance', file: 'rules_of_engagement_signees.json', minSize: 100 },
      { cat: 'ethics', id: 'law-02-nis2-incident-notification', file: 'formulaire_notification_anssi_nis2.json', minSize: 100 },
      { cat: 'ethics', id: 'law-02-nis2-incident-notification', file: 'fiche_incident_critique_oiv.md', minSize: 100 },
      { cat: 'ethics', id: 'law-02-nis2-incident-notification', file: 'registre_rgpd_violation_art33.json', minSize: 100 }
    ];

    for (const art of newArtifactTests) {
      const res = await fetch(`${BASE_URL}/targets/training/download/${art.cat}/${art.id}/${encodeURIComponent(art.file)}`);
      assert(res.ok, `Download of ${art.cat}/${art.id}/${art.file} succeeds (HTTP ${res.status})`);
      const buf = await res.arrayBuffer();
      assert(buf.byteLength >= art.minSize, `File ${art.file} has valid content size (got ${buf.byteLength} bytes)`);
    }
    console.log(`✔ Artefacts des 4 nouveaux labs validés (${newArtifactTests.length} fichiers vérifiés).`);

    // 7. Tests dynamiques SOC Rule & Remediation sur les nouveaux labs
    console.log('7. Tests dynamiques validate-soc-rule et verify-remediation...');
    // Échec de validation règle Sigma si mots-clés manquants
    const socFail = await fetch(`${BASE_URL}/api/training/campaign/validate-soc-rule`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        challenge_id: 'win-09-ad-priv-seimpersonate',
        rule_type: 'sigma',
        rule_content: 'detection:\n  condition: selection'
      })
    }).then(r => r.json());
    assert(socFail.success === false && socFail.valid === false, 'Sigma rule without required keywords safely rejected');

    // Succès de validation règle Sigma avec mots-clés complets
    const socWin = await fetch(`${BASE_URL}/api/training/campaign/validate-soc-rule`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        challenge_id: 'win-09-ad-priv-seimpersonate',
        rule_type: 'sigma',
        rule_content: 'title: Detect PrintSpoofer SeImpersonate\ndetection:\n  selection:\n    CommandLine: "PrintSpoofer64.exe -c cmd.exe"\n  condition: selection\n# keywords: printspoofer seimpersonate'
      })
    }).then(r => r.json());
    assert(socWin.success === true && socWin.valid === true, 'Sigma rule with complete keywords passes');
    assert(socWin.flag === 'SIGMA{SEIMPERSONATE_POTATO_ABUSE_DETECTED_882}', 'Valid flag returned for Potato rule');

    // Vérification remédiation dynamique
    const remWin = await fetch(`${BASE_URL}/api/training/campaign/verify-remediation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        challenge_id: 'win-09-ad-priv-seimpersonate',
        remediation_type: 'harden_seimpersonate_privilege'
      })
    }).then(r => r.json());
    assert(remWin.success === true && remWin.hardened === true, 'Dynamic remediation verification succeeds');
    assert(remWin.flag === 'REMEDIATION{SEIMPERSONATE_PRIVILEGE_STRIPPED_SYSTEM_SAFE}', 'Valid remediation flag returned');
    console.log('✔ Validation dynamique SOC Rule & Remédiation validée.');

    // 8. Tests Arbre de compétences (Node AD) et Learning Paths
    console.log('8. Tests Arbre de compétences et Learning Paths...');
    const treeRes = await fetch(`${BASE_URL}/api/skill-tree`).then(r => r.json());
    assert(treeRes.nodes.length === 25, `Skill tree contains 25 nodes (got ${treeRes.nodes.length})`);
    const adNode = treeRes.nodes.find(n => n.id === 'node-win-active-directory');
    assert(adNode, 'Node node-win-active-directory exists');
    assert(adNode.tier === 3, 'node-win-active-directory is Tier 3');
    assert(adNode.linked_challenges.includes('win-09-ad-priv-seimpersonate'), 'node-win-active-directory links to win-09');

    const ethicsNode = treeRes.nodes.find(n => n.id === 'node-bin-ethics-compliance');
    assert(ethicsNode && ethicsNode.linked_challenges.includes('law-01-stad-godfrain-compliance'), 'Ethics node links to law-01');
    assert(ethicsNode.linked_challenges.includes('law-02-nis2-incident-notification'), 'Ethics node links to law-02');

    const lpRes = await fetch(`${BASE_URL}/api/training/learning-paths`).then(r => r.json());
    assert(lpRes.paths.length === 12, `12 learning paths loaded (got ${lpRes.paths.length})`);
    const requiredPaths = ['wifi-network-ops', 'ai-llm-security', 'social-phishing-defense', 'ethics-legal-compliance'];
    for (const pId of requiredPaths) {
      assert(lpRes.paths.some(p => p.id === pId), `Learning path ${pId} exists in catalog`);
    }
    console.log('✔ Arbre de compétences (25 nœuds) et 12 Learning Paths validés.');

    console.log('========================================================================');
    console.log('🎉 TOUS LES TESTS DE ROBUSTESSE ET CAS LIMITES DE LA PHASE 3 SONT AU VERT !');
    console.log('========================================================================');
  } finally {
    if (serverProcess) {
      serverProcess.kill();
    }
  }
}

runPhase3EdgeCases().catch(err => {
  console.error('[TEST ERROR]', err);
  process.exit(1);
});

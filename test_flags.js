if (process.env.CYBERLAB_TEST_ISOLATED !== '1') {
  console.error('Use npm test or node scripts/test-isolated.js test_flags.js');
  process.exit(1);
}
// ============================================================================
// AUTOMATED TEST SUITE: COMPLETE VALIDATION OF EVERY CHALLENGE FLAG & REAL LABS
// Tests 100% of challenges (148+), flags, flexible formats, free hints, and real apps
// ============================================================================

const assert = require('assert');
const { spawn } = require('node:child_process');
const { DatabaseSync } = require('node:sqlite');
const TrainingManager = require('./platform/training_manager');

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
  if (await isServerUp()) {
    throw new Error('Test port already occupied; refusing to reuse a server.');
  }

  console.log('[TEST] Démarrage automatique du serveur CyberLab...');
  let stderrOutput = '';
  const server = spawn(process.execPath, ['server.js'], { cwd: __dirname });
  server.stdout.on('data', d => process.stdout.write(d));
  server.stderr.on('data', d => { stderrOutput += d.toString(); process.stderr.write(d); });

  const start = Date.now();
  while (Date.now() - start < 15000) {
    if (server.exitCode !== null) {
      throw new Error(`Serveur crashé avec code ${server.exitCode}.\n${stderrOutput}`);
    }
    await new Promise(r => setTimeout(r, 400));
    if (await isServerUp()) return server;
  }
  throw new Error('Connexion impossible au serveur CyberLab après 15s.');
}

async function runFlagsTest() {
  console.log('[TEST] Démarrage de la suite de validation exhaustive de TOUS les flags...');

  // 1. Charger le catalogue complet
  const catRes = await fetch(`${BASE_URL}/api/training/catalog`);
  assert(catRes.ok, 'Catalog API returns 200');
  const catData = await catRes.json();
  const challenges = catData.challenges || [];
  console.log(`[TEST] Catalogue chargé : ${challenges.length} challenges découverts.`);
  assert(challenges.length >= 148, `Expected at least 148 challenges, got ${challenges.length}`);

  // 2. Tester les 5 Flagship Learning Paths parmi les 12 parcours
  const lpRes = await fetch(`${BASE_URL}/api/training/learning-paths`);
  assert(lpRes.ok, 'Learning paths API returns 200');
  const lpData = await lpRes.json();
  assert(lpData.paths && lpData.paths.length === 12, `Expected 12 learning paths loaded, got ${lpData.paths ? lpData.paths.length : 0}`);
  const pathIds = lpData.paths.map(p => p.id);
  assert(pathIds.includes('web-beginner'), 'Web Pentest Flagship present');
  assert(pathIds.includes('soc-forensics'), 'SOC & Blue Team Flagship present');
  assert(pathIds.includes('crypto-osint-core'), 'OSINT Flagship present');
  assert(pathIds.includes('ad-enterprise'), 'Active Directory Red Team Flagship present');
  assert(pathIds.includes('master-boot2root'), 'Real Attack Labs & Boot2Root Flagship present');
  console.log('✔ 5 Flagship Career Tracks verified in 12 Learning Paths.');

  // 3. Tester les applications Real Attack Labs multi-pages (via portal et direct targets)
  const realApps = [
    { name: 'PayShield FinTech', url: `${BASE_URL}/portal/real-attack/fintech/`, directUrl: `${BASE_URL}/targets/training/real-01-fintech-gateway/`, checks: ['PayShield', 'transfers', 'audit-logs'] },
    { name: 'MedHealth EHR Clinic', url: `${BASE_URL}/portal/real-attack/medhealth/`, directUrl: `${BASE_URL}/targets/training/real-02-medhealth-ehr/`, checks: ['MedHealth', 'radiology', 'prescriptions'] },
    { name: 'CyberCorp ERP Industrial', url: `${BASE_URL}/portal/real-attack/cybercorp/`, directUrl: `${BASE_URL}/targets/training/real-03-cybercorp-erp/`, checks: ['CyberCorp', 'firmware', 'diagnostics'] },
    { name: 'AeroSpace Telemetry Ground', url: `${BASE_URL}/portal/real-attack/aerospace/`, directUrl: `${BASE_URL}/targets/training/real-04-aerospace-telemetry/`, checks: ['AeroSpace', 'orbital', 'uplink'] }
  ];

  for (const app of realApps) {
    const res = await fetch(app.url);
    assert.strictEqual(res.status, 200, `Real app ${app.name} returned status 200 on portal`);
    const body = await res.text();
    for (const check of app.checks) {
      assert(body.toLowerCase().includes(check.toLowerCase()), `Real app ${app.name} contains ${check}`);
    }

    const directRes = await fetch(app.directUrl);
    assert.strictEqual(directRes.status, 200, `Real app ${app.name} returned status 200 on direct target URL: ${app.directUrl}`);
  }
  console.log('✔ 4 Multi-page Real Attack Labs verified accessible via portal and direct target routes.');

  // 4. Tester le système d'indices 100% gratuits
  const hintRes = await fetch(`${BASE_URL}/api/training/unlock-hint`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ challenge_id: 'real-01-fintech-gateway', hint_index: 0 })
  });
  assert(hintRes.ok, 'Unlock hint returns 200');
  const hintData = await hintRes.json();
  assert(hintData.success === true, 'Unlock hint success is true');
  assert.strictEqual(hintData.cost, 0, 'Hints are 100% free with cost = 0');
  assert(hintData.hint && hintData.hint.length > 5, 'Free progressive hint content returned');
  console.log('✔ Progressive hints 100% free (cost: 0) verified.');

  // 4.5 Charger les données sources de la base locale SQLite
  const db = new DatabaseSync('cyberrange.db');
  const dbRows = db.prepare('SELECT id, category, tasks_json FROM training_challenges').all();
  db.close();

  const tm = new TrainingManager(null);
  const challengeMap = new Map();
  for (const r of dbRows) {
    challengeMap.set(r.id, {
      category: r.category,
      tasks: JSON.parse(r.tasks_json || '[]')
    });
  }

  // 5. Tester CHAQUE défi et valider TOUS les flags
  console.log(`[TEST] Test et validation de tous les flags sur l'ensemble des ${challenges.length} défis...`);
  let testedFlagsCount = 0;
  let passedFlagsCount = 0;

  for (let i = 0; i < challenges.length; i++) {
    const chMeta = challenges[i];
    const roomRes = await fetch(`${BASE_URL}/api/training/challenge/${chMeta.id}`);
    assert(roomRes.ok, `Room detail ${chMeta.id} returns 200`);
    const roomData = await roomRes.json();
    const room = roomData.room || roomData.challenge || roomData;

    assert(room.tasks && room.tasks.length > 0, `Challenge ${chMeta.id} has valid tasks`);

    const dbCh = challengeMap.get(chMeta.id);

    for (const task of room.tasks) {
      const dbTask = dbCh ? dbCh.tasks.find(t => (t.id === task.id || (String(t.id).replace(/^task-/, 't') === String(task.id).replace(/^task-/, 't')))) : null;
      const canonicalFlag = (dbTask && (dbTask.flag || dbTask.canonical_flag)) || '';
      assert(canonicalFlag && canonicalFlag.length > 0, `Task ${task.id} in ${chMeta.id} has canonical flag in database`);

      const isCampaign = (chMeta.category === 'campaign' || chMeta.category === 'Campaign' || chMeta.id.startsWith('aegis-box-'));
      const isDynamic = isCampaign && (canonicalFlag.startsWith('AEGIS{') || canonicalFlag.startsWith('CHIMERA{') || canonicalFlag.startsWith('FLAG{'));

      let flagToSubmit = isDynamic
        ? tm.generateDynamicFlag(chMeta.id, task.id, canonicalFlag, 'current_player')
        : canonicalFlag;

      testedFlagsCount++;

      // 5.1 Test Exact Flag Submission
      const submitRes = await fetch(`${BASE_URL}/api/training/submit-flag`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challenge_id: chMeta.id,
          task_id: task.id,
          flag: flagToSubmit
        })
      });

      if (!submitRes.ok) {
        const errText = await submitRes.text();
        console.error(`[SUBMIT FAIL] ${chMeta.id}/${task.id} HTTP ${submitRes.status}: ${errText}`);
      }
      assert(submitRes.ok, `Submit flag for ${chMeta.id}/${task.id} returned HTTP 200 (status: ${submitRes.status})`);
      const submitData = await submitRes.json();
      assert(submitData.success === true, `Submit flag success for ${chMeta.id}/${task.id}: ${JSON.stringify(submitData)}`);
      assert(submitData.correct === true || submitData.is_correct === true, `Flag validated for ${chMeta.id}/${task.id}: ${flagToSubmit}`);
      passedFlagsCount++;

      // 5.2 Test Flexible Formatting sur le premier task de chaque défi (whitespace, lowercase)
      if (task.id === room.tasks[0].id) {
        const flexibleFlag = `   ${flagToSubmit.toLowerCase()}   `;
        const flexRes = await fetch(`${BASE_URL}/api/training/submit-flag`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            challenge_id: chMeta.id,
            task_id: task.id,
            flag: flexibleFlag
          })
        });
        const flexData = await flexRes.json();
        assert(flexData.success === true && (flexData.correct === true || flexData.is_correct === true), `Flexible flag formatting accepted for ${chMeta.id}`);
      }
    }

    if ((i + 1) % 25 === 0 || i === challenges.length - 1) {
      console.log(`  [PROGRESS] Validé ${i + 1}/${challenges.length} défis (${passedFlagsCount} flags validés avec succès)...`);
    }
  }

  // 6. Test de sécurité & Rejet strict des faux flags (y compris faux flags DEFENSE)
  const fakeDefenseRes = await fetch(`${BASE_URL}/api/training/submit-flag`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      challenge_id: challenges[0].id,
      task_id: challenges[0].tasks ? challenges[0].tasks[0].id : 't1',
      flag: 'DEFENSE{INVALID_HARDENING_FLAG_XYZ}'
    })
  });
  const fakeDefenseData = await fakeDefenseRes.json();
  assert(fakeDefenseData.correct === false || fakeDefenseData.is_correct === false, 'Fake DEFENSE flag was properly rejected (no wildcard bypass)');
  console.log('✔ Negative test: Fake DEFENSE flag correctly rejected.');

  const badRes = await fetch(`${BASE_URL}/api/training/submit-flag`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      challenge_id: challenges[0].id,
      task_id: 't1',
      flag: 'WRONG_INVALID_FLAG_12345'
    })
  });
  const badData = await badRes.json();
  assert(badData.success === false || badData.correct === false, 'Bad flag rejected');
  assert(badData.message && badData.message.length > 10, 'Clear error message returned on incorrect flag');
  console.log('✔ Clear error message on incorrect flag submission verified.');

  console.log(`\n============================================================================`);
  console.log(`✔ SUCCÈS TOTAL : 100% des défis (${challenges.length}/${challenges.length}) et ${testedFlagsCount} flags validés sans aucune erreur !`);
  console.log(`============================================================================\n`);
}

async function main() {
  let server = null;
  try {
    server = await ensureServerRunning();
    await runFlagsTest();
    console.log('[TEST] test_flags.js terminé avec succès !');
    process.exit(0);
  } catch (err) {
    console.error('[TEST ERROR]', err);
    process.exit(1);
  } finally {
    if (server) {
      try { server.kill(); } catch {}
    }
  }
}

main();

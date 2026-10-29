const assert = require('assert');
const fs = require('fs');

async function testAll() {
  console.log('[TEST] Demarrage de la suite de validation CyberLab (Mode Pro + Checkpoints)...');

  // 1. Test Home page
  const home = await fetch('http://localhost:3333/').then(r => r.text());
  assert(home.includes('CYBERRANGE PRO'), 'Home page title check');
  console.log('✔ Home page test PASSED');

  // 2. Test robots.txt
  const robots = await fetch('http://localhost:3333/robots.txt').then(r => r.text());
  assert(robots.includes('CYBER{HTTP_GET_ROBOTS_TXT_FOUND}'), 'robots.txt check');
  console.log('✔ robots.txt test PASSED');

  // 3. Test user progress API
  const prog = await fetch('http://localhost:3333/api/user-progress').then(r => r.json());
  assert(prog.hearts === 5, 'User progress hearts check');
  console.log('✔ user progress test PASSED');

  // 4. Test flags validation across regular levels
  const sampleFlags = [
    { id: 'm1-l1', answer: 'operator' },
    { id: 'm1-l2', answer: '/home/operator' },
    { id: 'm1-l16', answer: 'CYBER{LINUX_NAVIGATOR_LEVEL_COMPLETED}' },
    { id: 'm2-l1', answer: '127.0.0.1' },
    { id: 'm2-l12', answer: 'CYBER{HTTP_GET_ROBOTS_TXT_FOUND}' },
    { id: 'm3-l1', answer: 'CyberDefense Systems' },
    { id: 'm3-l10', answer: 'KEY{JWT_SECRET_SIGN_KEY_AEGIS_99}' },
    { id: 'm4-l4', answer: 'CYBER{IDOR_DIRECT_OBJECT_FINANCIAL_LEAK}' },
    { id: 'm4-l10', answer: 'CYBER{JWT_ALG_NONE_SIGNATURE_BYPASS_SUCCESS}' },
    { id: 'm5-l3', answer: 'CYBER{COMMAND_INJECTION_IFS_WILDCARD_BYPASS}' },
    { id: 'm5-l8', answer: 'CYBER{SUID_BINARY_GTFOBINS_EUID_ZERO_ROOT}' },
    { id: 'm5-l9', answer: 'CYBER{M5_BOSS_ROOT_COMPROMISE_FINAL_FLAG}' }
  ];

  for (const sf of sampleFlags) {
    const res = await fetch('http://localhost:3333/api/verify-answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ level_id: sf.id, answer: sf.answer })
    }).then(r => r.json());
    assert(res.is_correct === true, 'Flag check for ' + sf.id);
  }
  console.log('✔ 12 Regular Levels across all 5 tracks PASSED');

  // 5. Test 5 Mid-Module Checkpoint Evaluations
  const checkpointFlags = [
    { id: 'm1-mid', answer: 'CYBER{LINUX_MID_EVAL_FORENSIC_MASTERED}' },
    { id: 'm2-mid', answer: 'CYBER{NET_MID_EVAL_RECON_HEADER_AUTHORIZED}' },
    { id: 'm3-mid', answer: 'FLAG{SQL_MID_EVAL_CRM_UNLOCKED_8821}' },
    { id: 'm4-mid', answer: 'CYBER{CLIENT_MID_EVAL_IDOR_SESSION_PWNED}' },
    { id: 'm5-mid', answer: 'CYBER{SERVER_MID_EVAL_COMMAND_CHAIN_PWNED}' }
  ];

  for (const cf of checkpointFlags) {
    const res = await fetch('http://localhost:3333/api/verify-answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ level_id: cf.id, answer: cf.answer })
    }).then(r => r.json());
    assert(res.is_correct === true, 'Checkpoint flag check for ' + cf.id);
  }
  console.log('✔ 5 Mid-Module Checkpoint Evaluations PASSED');

  // 6. Test Endpoint M2 Mid-Module Audit: /api/network/audit-eval
  const unauthAudit = await fetch('http://localhost:3333/api/network/audit-eval');
  assert(unauthAudit.status === 403, 'Unauthorized audit-eval check');
  const authAudit = await fetch('http://localhost:3333/api/network/audit-eval', {
    headers: { 'X-Security-Scan': 'enabled' }
  }).then(r => r.json());
  assert(authAudit.token === 'CYBER{NET_MID_EVAL_RECON_HEADER_AUTHORIZED}', 'Authorized audit-eval token check');
  console.log('✔ M2-MID Audit Header API test PASSED');

  // 7. Test CRM SQLi search with ' OR 1=1 -- returning VIP record
  const crmInjection = await fetch("http://localhost:3333/targets/api/crm/search?q=%27%20OR%201=1%20--").then(r => r.json());
  assert(crmInjection.results && crmInjection.results.length >= 4, 'CRM injection row count check');
  const vipRecord = crmInjection.results.find(r => r.confidential_memo && r.confidential_memo.includes('FLAG{SQL_MID_EVAL_CRM_UNLOCKED_8821}'));
  assert(vipRecord, 'CRM VIP Record found check');
  console.log('✔ M3-MID CRM SQLi VIP record test PASSED');

  // 8. Test Invoices IDOR endpoint for id 1 (Presidential invoice)
  const invPres = await fetch('http://localhost:3333/targets/api/invoices?id=1').then(r => r.json());
  assert(invPres.clearing_code === 'CYBER{CLIENT_MID_EVAL_IDOR_SESSION_PWNED}', 'IDOR presidential invoice check');
  console.log('✔ M4-MID IDOR Presidential invoice test PASSED');

  // 9. Test Diagnostic Ping RCE with ${IFS}
  const pingRce = await fetch('http://localhost:3333/targets/api/network/diagnostics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ host: '127.0.0.1;cat${IFS}/etc/passwd' })
  }).then(r => r.json());
  assert(pingRce.output && pingRce.output.includes('CYBER{SERVER_MID_EVAL_COMMAND_CHAIN_PWNED}'), 'Ping RCE ${IFS} check');
  console.log('✔ M5-MID Ping RCE with ${IFS} test PASSED');

  // 10. Test JWT alg none
  const jwt = await fetch('http://localhost:3333/targets/api/v2/auth-check', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJ1c2VyIjoiYWRtaW4iLCJyb2xlIjoiYWRtaW4ifQ.' }
  }).then(r => r.json());
  assert(jwt.status === 'authenticated', 'JWT alg none check');
  console.log('✔ JWT alg none target API test PASSED');

  // 11. Test Quiz Options Distribution in challenges.js
  const content = fs.readFileSync('public/js/challenges.js', 'utf8');
  const levels = JSON.parse(content.match(/window\.CYBER_LEVELS = (\[[\s\S]*?\]);\n\nwindow\.CYBER_BADGES/)[1]);
  assert(levels.length === 66, 'Total levels count check: expected 66, got ' + levels.length);
  const dist = { 0: 0, 1: 0, 2: 0, 3: 0 };
  levels.forEach(lvl => {
    if (lvl.microCard && lvl.microCard.quickQuiz) {
      const idx = lvl.microCard.quickQuiz.options.findIndex(o => o.isCorrect);
      dist[idx] = (dist[idx] || 0) + 1;
    }
  });
  console.log('✔ Quiz options distribution across 66 levels:', dist);
  // Ensure that option 0 does not hold > 50% of the answers (it's around ~25%)
  assert(dist[0] < levels.length * 0.4, 'Quiz distribution not biased to option 0');
  assert(dist[1] > 5 && dist[2] > 5 && dist[3] > 5, 'Every option index A, B, C, D is well represented');
  console.log('✔ Quiz Options Shuffling validation PASSED');

  // 12. Test Auto-Update API Endpoints
  const verData = await fetch('http://localhost:3333/api/version').then(r => r.json());
  assert(verData.version === '1.0.0', 'Version check');
  assert(verData.owner.toLowerCase() === 'zioti', 'Owner check');
  console.log('✔ API /api/version test PASSED (v' + verData.version + ' repo: ' + verData.owner + '/' + verData.repo + ')');

  const checkData = await fetch('http://localhost:3333/api/check-update').then(r => r.json());
  assert(typeof checkData.updateAvailable === 'boolean', 'Check update returns updateAvailable boolean');
  console.log('✔ API /api/check-update test PASSED');

  console.log('========================================================================');
  console.log('🎉 100% DES 12 SUITES DE VALIDATION SONT AU VERT ! TOUT FONCTIONNE !');
  console.log('========================================================================');
}

testAll().catch(e => {
  console.error('TEST FAILED:', e);
  process.exit(1);
});
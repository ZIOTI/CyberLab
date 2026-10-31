const assert = require('assert');
const fs = require('fs');
const { spawn } = require('node:child_process');
const TrainingManager = require('./platform/training_manager');

const BASE_URL = 'http://127.0.0.1:3333';

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
    console.log('[TEST] Serveur CyberLab déjà actif sur port 3333.');
    return null;
  }

  console.log('[TEST] Démarrage automatique du serveur CyberLab...');
  let stderrOutput = '';
  const server = spawn(process.execPath, ['server.js'], {
    cwd: __dirname
  });

  server.stdout.on('data', d => process.stdout.write(d));
  server.stderr.on('data', d => {
    stderrOutput += d.toString();
    process.stderr.write(d);
  });

  const start = Date.now();
  while (Date.now() - start < 12000) {
    if (server.exitCode !== null) {
      throw new Error(`Le serveur CyberLab a crashé immédiatement avec le code ${server.exitCode}.\nStderr: ${stderrOutput}`);
    }
    await new Promise(r => setTimeout(r, 400));
    if (await isServerUp()) {
      console.log('[TEST] Serveur CyberLab opérationnel et prêt pour les tests.');
      return server;
    }
  }

  try { server.kill(); } catch {}
  throw new Error('Impossible de se connecter au serveur CyberLab après 12 secondes.\nStderr: ' + stderrOutput);
}

async function testAll() {
  console.log('[TEST] Demarrage de la suite de validation CyberLab (Mode Pro + Checkpoints)...');

  // 1. Test Home page
  const home = await fetch(`${BASE_URL}/`).then(r => r.text());
  assert(home.includes('CYBERRANGE PRO'), 'Home page title check');
  console.log('✔ Home page test PASSED');

  // 2. Test robots.txt
  const robots = await fetch(`${BASE_URL}/robots.txt`).then(r => r.text());
  assert(robots.includes('CYBER{HTTP_GET_ROBOTS_TXT_FOUND}'), 'robots.txt check');
  console.log('✔ robots.txt test PASSED');

  // 3. Test user progress API
  const prog = await fetch(`${BASE_URL}/api/user-progress`).then(r => r.json());
  assert(typeof prog.hearts === 'number' && prog.hearts >= 0, 'User progress hearts check');
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
    const res = await fetch(`${BASE_URL}/api/verify-answer`, {
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
    const res = await fetch(`${BASE_URL}/api/verify-answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ level_id: cf.id, answer: cf.answer })
    }).then(r => r.json());
    assert(res.is_correct === true, 'Checkpoint flag check for ' + cf.id);
  }
  console.log('✔ 5 Mid-Module Checkpoint Evaluations PASSED');

  // 6. Test Endpoint M2 Mid-Module Audit: /api/network/audit-eval
  const unauthAudit = await fetch(`${BASE_URL}/api/network/audit-eval`);
  assert(unauthAudit.status === 403, 'Unauthorized audit-eval check');
  const authAudit = await fetch(`${BASE_URL}/api/network/audit-eval`, {
    headers: { 'X-Security-Scan': 'enabled' }
  }).then(r => r.json());
  assert(authAudit.token === 'CYBER{NET_MID_EVAL_RECON_HEADER_AUTHORIZED}', 'Authorized audit-eval token check');
  console.log('✔ M2-MID Audit Header API test PASSED');

  // 7. Test CRM SQLi search with ' OR 1=1 -- returning VIP record
  const crmInjection = await fetch(`${BASE_URL}/targets/api/crm/search?q=%27%20OR%201=1%20--`).then(r => r.json());
  assert(crmInjection.results && crmInjection.results.length >= 4, 'CRM injection row count check');
  const vipRecord = crmInjection.results.find(r => r.confidential_memo && r.confidential_memo.includes('FLAG{SQL_MID_EVAL_CRM_UNLOCKED_8821}'));
  assert(vipRecord, 'CRM VIP Record found check');
  console.log('✔ M3-MID CRM SQLi VIP record test PASSED');

  // 8. Test Invoices IDOR endpoint for id 1 (Presidential invoice)
  const invPres = await fetch(`${BASE_URL}/targets/api/invoices?id=1`).then(r => r.json());
  assert(invPres.clearing_code === 'CYBER{CLIENT_MID_EVAL_IDOR_SESSION_PWNED}', 'IDOR presidential invoice check');
  console.log('✔ M4-MID IDOR Presidential invoice test PASSED');

  // 9. Test Diagnostic Ping RCE with ${IFS}
  const pingRce = await fetch(`${BASE_URL}/targets/api/network/diagnostics`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ host: '127.0.0.1;cat${IFS}/etc/passwd' })
  }).then(r => r.json());
  assert(pingRce.output && pingRce.output.includes('CYBER{SERVER_MID_EVAL_COMMAND_CHAIN_PWNED}'), 'Ping RCE ${IFS} check');
  console.log('✔ M5-MID Ping RCE with ${IFS} test PASSED');

  // 10. Test JWT alg none
  const jwt = await fetch(`${BASE_URL}/targets/api/v2/auth-check`, {
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
  assert(dist[0] < levels.length * 0.4, 'Quiz distribution not biased to option 0');
  assert(dist[1] > 5 && dist[2] > 5 && dist[3] > 5, 'Every option index A, B, C, D is well represented');
  console.log('✔ Quiz Options Shuffling validation PASSED');

  // 12. Test Auto-Update API Endpoints
  const verData = await fetch(`${BASE_URL}/api/version`).then(r => r.json());
  assert(verData.version, 'Version field exists');
  assert(verData.owner.toLowerCase() === 'zioti', 'Owner check');
  console.log('✔ API /api/version test PASSED (v' + verData.version + ' repo: ' + verData.owner + '/' + verData.repo + ')');

  const checkData = await fetch(`${BASE_URL}/api/check-update`).then(r => r.json());
  assert(typeof checkData.updateAvailable === 'boolean', 'Check update returns updateAvailable boolean');
  console.log('✔ API /api/check-update test PASSED');

  // 13. Test Zone d'Entraînement (Training Hub, 100 Labs, Room API, Flag Submission & Writeup)
  const catData = await fetch(`${BASE_URL}/api/training/catalog`).then(r => r.json());
  assert(catData.success === true, 'Catalog response success');
  assert(catData.challenges && catData.challenges.length >= 100, 'All 100 challenges present in catalog');
  console.log('✔ API /api/training/catalog test PASSED (Full ' + catData.challenges.length + ' challenges loaded)');

  const lpData = await fetch(`${BASE_URL}/api/training/learning-paths`).then(r => r.json());
  assert(lpData.success === true, 'Learning paths success');
  assert(lpData.paths && lpData.paths.length >= 8, 'At least 8 learning paths present');
  console.log('✔ API /api/training/learning-paths test PASSED (' + lpData.paths.length + ' paths loaded)');

  // Test Room detail & downloadable files
  const roomData = await fetch(`${BASE_URL}/api/training/challenge/net-01-wireshark-ftp`).then(r => r.json());
  assert(roomData.success === true, 'Room detail success');
  assert(roomData.room.tasks.length >= 2, 'net-01 has valid tasks');
  assert(roomData.room.downloadable_files.length > 0, 'net-01 has downloadable pcap');
  console.log('✔ API /api/training/challenge/:id test PASSED with downloadable files');

  // Test Instance start/renew/stop
  const instStart = await fetch(`${BASE_URL}/api/training/instance/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ challenge_id: 'web-01-robots' })
  }).then(r => r.json());
  assert(instStart.success === true, 'Instance started');
  assert(instStart.instance.virtual_ip, 'Virtual IP assigned');

  const instStop = await fetch(`${BASE_URL}/api/training/instance/stop`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ challenge_id: 'web-01-robots' })
  }).then(r => r.json());
  assert(instStop.success === true, 'Instance stopped');
  console.log('✔ Training Instance lifecycle (Start/Stop) test PASSED');

  // 14. Test Lifecycle Instance Reset API
  const instReset = await fetch(`${BASE_URL}/api/training/instance/reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ challenge_id: 'web-01-robots' })
  }).then(r => r.json());
  assert(instReset.success === true, 'Instance reset success');
  assert(instReset.instance.virtual_ip, 'Virtual IP preserved or renewed');
  await fetch(`${BASE_URL}/api/training/instance/stop`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ challenge_id: 'web-01-robots' })
  });
  console.log('✔ Training Instance lifecycle Reset API test PASSED');

  // 15. Test Syntax of all Frontend Scripts & Vendorized xterm.js
  const { execSync } = require('node:child_process');
  const frontendScripts = [
    'public/vendor/xterm/xterm.js',
    'public/vendor/xterm/addon-fit.js',
    'public/js/icons.js',
    'public/js/audio.js',
    'public/js/terminal.js',
    'public/js/sandbox.js',
    'public/js/challenges.js',
    'public/js/training.js',
    'public/js/app.js',
    'public/js/devtools.js',
    'public/js/visual_models.js'
  ];
  for (const scriptPath of frontendScripts) {
    assert(fs.existsSync(scriptPath), `File exists: ${scriptPath}`);
    execSync(`node -c "${scriptPath}"`);
  }
  console.log(`✔ Frontend & Vendor scripts syntax validation PASSED (${frontendScripts.length} scripts verified)`);

  // 16. Test Database Security & Target Isolation (cyberrange.db vs targets.db)
  const { DatabaseSync } = require('node:sqlite');
  assert(fs.existsSync('targets.db'), 'targets.db database file exists');
  assert(fs.existsSync('cyberrange.db'), 'cyberrange.db database file exists');

  const targetsDbCheck = new DatabaseSync('targets.db');
  const targetTables = targetsDbCheck.prepare("SELECT name FROM sqlite_master WHERE type='table'").all().map(t => t.name);
  assert(targetTables.includes('crm_customers'), 'targets.db contains crm_customers');
  assert(targetTables.includes('crm_accounts'), 'targets.db contains crm_accounts');
  assert(targetTables.includes('system_telemetry'), 'targets.db contains system_telemetry');
  assert(targetTables.includes('admin_credentials_vault'), 'targets.db contains admin_credentials_vault');

  const cyberDbCheck = new DatabaseSync('cyberrange.db');
  const cyberTables = cyberDbCheck.prepare("SELECT name FROM sqlite_master WHERE type='table'").all().map(t => t.name);
  assert(cyberTables.includes('user_state'), 'cyberrange.db contains user_state');
  assert(!cyberTables.includes('crm_customers'), 'cyberrange.db does NOT contain vulnerable crm_customers');
  assert(!cyberTables.includes('crm_accounts'), 'cyberrange.db does NOT contain vulnerable crm_accounts');
  console.log('✔ Database Security & Isolation (cyberrange.db vs targets.db) PASSED');

  // 17. Test VFS & VirtualShellBackend (30+ commands, POSIX permissions, Privesc)
  const { VirtualFileSystem, VirtualShellBackend, CyberTerminal } = require('./public/js/terminal.js');
  const testVfs = new VirtualFileSystem();
  assert(testVfs.getNode('/bin'), 'VFS contains /bin');
  assert(testVfs.getNode('/etc'), 'VFS contains /etc');
  assert(testVfs.getNode('/var/log'), 'VFS contains /var/log');
  assert(testVfs.getNode('/opt'), 'VFS contains /opt');
  assert(testVfs.getNode('/home/operator'), 'VFS contains /home/operator');
  assert(testVfs.getNode('/root'), 'VFS contains /root');
  assert(testVfs.getNode('/tmp'), 'VFS contains /tmp');

  const backend = new VirtualShellBackend(testVfs);

  // Test permissions POSIX (read /root denied to operator)
  assert.throws(() => {
    testVfs.readFile('/root/root.txt', 'operator', 1001);
  }, /Permission denied/, 'Operator cannot read /root/root.txt directly');

  // Test basic commands
  let out = await backend.execute('whoami');
  assert(out.stdout.trim() === 'operator', 'whoami returns operator');

  out = await backend.execute('id');
  assert(out.stdout.includes('uid=1001(operator)'), 'id returns uid=1001');

  out = await backend.execute('pwd');
  assert(out.stdout.trim() === '/home/operator', 'pwd returns /home/operator');

  out = await backend.execute('ls -la');
  assert(out.stdout.includes('notes.txt') && out.stdout.includes('user.txt'), 'ls lists directory contents');

  out = await backend.execute('cat notes.txt');
  assert(out.stdout.includes('BIENVENUE DANS TON LAB CYBER'), 'cat notes.txt reads content');

  out = await backend.execute('cat notes.txt | grep BIENVENUE');
  assert(out.stdout.includes('BIENVENUE'), 'pipeline with grep filters output');

  out = await backend.execute('mkdir test_dir');
  assert(testVfs.getNode('/home/operator/test_dir'), 'mkdir creates directory');

  out = await backend.execute('touch test_dir/test_file.txt');
  assert(testVfs.getNode('/home/operator/test_dir/test_file.txt'), 'touch creates file');

  out = await backend.execute('sudo -l');
  assert(out.stdout.includes('/usr/bin/find'), 'sudo -l lists allowed commands');

  // Test sudo isolation (sudo whoami executes as root without escalating caller session)
  out = await backend.execute('sudo whoami');
  assert(out.stdout.trim() === 'root', 'sudo whoami returns root');
  assert(backend.isRoot === false && backend.user === 'operator', 'caller session remains operator after sudo');

  // Test POSIX write denial to unprivileged operator
  out = await backend.execute('echo pwned > /root/unauthorized.txt');
  assert(out.exitCode !== 0 && out.stderr.includes('Permission denied'), 'operator cannot write to /root');

  // Test POSIX chmod denial on files not owned by operator
  out = await backend.execute('chmod 777 /root/root.txt');
  assert(out.exitCode !== 0 && out.stderr.includes('Operation not permitted'), 'operator cannot chmod files owned by root');

  // Test stderr retention and exit code on missing file
  out = await backend.execute('cat /home/operator/nonexistent.txt');
  assert(out.exitCode !== 0 && out.stderr.includes('No such file or directory'), 'stderr retained on missing file');

  // Test ls on file operand
  out = await backend.execute('ls notes.txt');
  assert(out.stdout.trim() === 'notes.txt' && out.exitCode === 0, 'ls on file outputs file name');

  // Test command chaining (&&, ||)
  out = await backend.execute('echo alpha && echo beta');
  assert(out.stdout.includes('alpha') && out.stdout.includes('beta'), '&& executes both successful commands');

  out = await backend.execute('cat nonexistent_file || echo fallback');
  assert(out.stdout.includes('fallback'), '|| executes fallback on error');

  // Test Tab autocompletion for commands and filenames
  const cmdCompletions = await backend.getCompletions('who');
  assert(cmdCompletions.includes('whoami'), 'tab autocompletion matches whoami');

  const fileCompletions = await backend.getCompletions('cat n');
  assert(fileCompletions.includes('notes.txt'), 'tab autocompletion matches notes.txt');

  // Test GTFOBins Privilege Escalation (find SUID / sudo)
  out = await backend.execute('find . -exec /bin/sh \\;');
  assert(backend.isRoot === true && backend.eUID === 0, 'Privilege escalation to root succeeded');

  out = await backend.execute('whoami');
  assert(out.stdout.trim() === 'root', 'whoami returns root after privesc');

  out = await backend.execute('cat /root/root.txt');
  assert(out.stdout.includes('CYBERLAB{LINUX_CAP_SETUID_PYTHON3_ROOT_SHELL}'), 'Root can read /root/root.txt');

  // Test CyberTerminal instantiation in headless mode, challenge flag preservation and tutorial
  const mockContainer = {
    innerHTML: '',
    appendChild: () => {},
    addEventListener: () => {}
  };
  const termInstance = new CyberTerminal(mockContainer, {
    challenge: {
      id: 'test-challenge',
      title: 'Test Suite Challenge',
      tasks: [
        { id: 't1', title: 'User Task', canonical_flag: 'FLAG{TEST_USER_SUITE}' },
        { id: 't2', title: 'Root Task', canonical_flag: 'FLAG{TEST_ROOT_SUITE}' }
      ]
    }
  });
  assert(typeof termInstance.runCommand === 'function', 'CyberTerminal runCommand API available');
  assert(typeof termInstance.reset === 'function', 'CyberTerminal reset API available');

  // Verify challenge flags applied
  let termOut = await termInstance.runCommand('cat user.txt');
  assert(termOut.stdout.includes('FLAG{TEST_USER_SUITE}'), 'CyberTerminal applies user challenge flag');

  // Verify reset restores challenge flags and does not crash in headless mode
  termInstance.reset();
  termOut = await termInstance.runCommand('cat user.txt');
  assert(termOut.stdout.includes('FLAG{TEST_USER_SUITE}'), 'CyberTerminal reset preserves challenge flags');

  // Verify beginner tutorial step advances
  assert(termInstance.tutorialStep === 1, 'tutorial starts at step 1');
  termInstance.advanceTutorial('whoami');
  assert(termInstance.tutorialStep === 2, 'tutorial advances to step 2 after whoami');

  console.log('✔ VFS, VirtualShellBackend (30+ commands, POSIX, GTFOBins) & CyberTerminal PASSED');

  // 18. Test Campaign Mode "Opération Aegis & Chimera" (Saison 1) & Full Attack/Defense Loop
  console.log('[TEST] Démarrage de la Suite 18 : Campagne Saison 1 & Boucle Attaque / Défense...');

  // 18.1 Test Campaign Season 1 Metadata API
  const campaignSeasonRes = await fetch(`${BASE_URL}/api/training/campaign/season-1`);
  assert(campaignSeasonRes.ok, 'Campaign Season 1 API returns 200');
  const campaignSeason = await campaignSeasonRes.json();
  assert(campaignSeason.success === true, 'Campaign season success is true');
  assert(campaignSeason.season.number === 1, 'Season number is 1');
  assert(campaignSeason.season.name.includes('Aegis & Chimera'), 'Season name contains Aegis & Chimera');
  assert(Array.isArray(campaignSeason.characters) && campaignSeason.characters.length >= 3, 'Season has at least 3 characters');
  assert(campaignSeason.characters.some(c => c.name.includes('Elena Vance')), 'Elena Vance character present');
  assert(campaignSeason.characters.some(c => c.name.includes('Viktor K.')), 'Viktor K. character present');
  assert(campaignSeason.characters.some(c => c.name.includes('Marcus Cole')), 'Marcus Cole character present');
  assert(campaignSeason.acts.length === 3, 'Campaign has exactly 3 acts');
  assert(campaignSeason.boxes.length === 3, 'Campaign has exactly 3 boxes');
  assert(campaignSeason.stats.total_tasks === 18, 'Campaign has 18 total tasks');
  assert(campaignSeason.stats.offense_tasks === 9, 'Campaign has 9 offense tasks');
  assert(campaignSeason.stats.defense_tasks === 9, 'Campaign has 9 defense tasks');
  console.log('✔ 18.1 Campaign Season 1 Metadata API PASSED');

  // 18.2 Test Daily Mission API
  const dailyRes = await fetch(`${BASE_URL}/api/training/daily-mission`);
  assert(dailyRes.ok, 'Daily mission API returns 200');
  const dailyData = await dailyRes.json();
  assert(dailyData.success === true, 'Daily mission success is true');
  assert(dailyData.xp_multiplier === 1.5, 'Daily mission multiplier is 1.5x');
  assert(dailyData.challenge && dailyData.challenge.id, 'Daily mission contains valid challenge');
  console.log('✔ 18.2 Daily Mission API PASSED');

  // 18.3 Box 1 (Acte I Gatekeeper) Solvability End-to-End & Anti-Cheat Validation
  const box1RoomRes = await fetch(`${BASE_URL}/api/training/challenge/aegis-box-01-perimeter`);
  assert(box1RoomRes.ok, 'Box 1 room loaded');
  const box1Room = await box1RoomRes.json();
  assert(box1Room.room.act === 1, 'Box 1 is Acte 1');
  assert(box1Room.room.downloadable_files.some(f => f.name.includes('chimera_beacon.pcap')), 'Box 1 has pcap artifact');
  assert(box1Room.room.downloadable_files.some(f => f.name.includes('gatekeeper_config.json')), 'Box 1 has config artifact');

  // Start Box 1 instance
  const box1StartRes = await fetch(`${BASE_URL}/api/training/instance/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ challenge_id: 'aegis-box-01-perimeter' })
  });
  assert(box1StartRes.ok, 'Box 1 instance started');
  const box1Start = await box1StartRes.json();
  assert(box1Start.vfs_injection && box1Start.vfs_injection['/home/operator/user.txt'], 'Box 1 injects dynamic user flag');
  assert(box1Start.vfs_injection['/root/root.txt'], 'Box 1 injects dynamic root flag');
  assert(box1Start.vfs_injection['/usr/local/bin/aegis-sync'], 'Box 1 injects SUID aegis-sync');

  // Box 1 Target Portal endpoints check
  const b1Status = await fetch(`${BASE_URL}/portal/api/status`).then(r => r.json());
  assert(b1Status.status === 'AEGIS_PERIMETER_SECURE', 'Gatekeeper portal status is OK');
  const b1Exchange = await fetch(`${BASE_URL}/portal/api/exchange`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'handshake' })
  }).then(r => r.json());
  assert(b1Exchange.session_token === 'gatekeeper_token_v1', 'Gatekeeper exchange returns recon token');

  // Box 1 Task 1: Recon flag
  const b1t1 = await fetch(`${BASE_URL}/api/training/submit-flag`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ challenge_id: 'aegis-box-01-perimeter', task_id: 't1', flag: 'gatekeeper_token_v1' })
  }).then(r => r.json());
  assert(b1t1.success === true && (b1t1.correct || b1t1.is_correct), 'Box 1 Task 1 solved');

  // Anti-Cheat Check 1: Static canonical flag MUST be rejected
  const b1t2Static = await fetch(`${BASE_URL}/api/training/submit-flag`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ challenge_id: 'aegis-box-01-perimeter', task_id: 't2', flag: 'AEGIS{GATEKEEPER_USER_BREACH}' })
  });
  const b1t2StaticData = await b1t2Static.json();
  assert(b1t2StaticData.success === false && b1t2StaticData.error.includes('statique refusé'), 'Anti-cheat rejects static writeup flag');

  // Anti-Cheat Check 2: Flag from another player MUST be rejected
  const b1t2Cheater = await fetch(`${BASE_URL}/api/training/submit-flag`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ challenge_id: 'aegis-box-01-perimeter', task_id: 't2', flag: 'AEGIS{FLAG_FROM_OTHER_PLAYER_XYZ}' })
  }).then(r => r.json());
  assert(b1t2Cheater.success === false, 'Anti-cheat rejects invalid/other player flag');

  // Anti-Cheat Check 2b: Real dynamic flag generated for player A submitted by player B MUST be rejected
  const b1t2CrossPlayer = await fetch(`${BASE_URL}/api/training/submit-flag`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ challenge_id: 'aegis-box-01-perimeter', task_id: 't2', flag: box1Start.vfs_injection['/home/operator/user.txt'].content.trim(), player_id: 'intruder_bob' })
  }).then(r => r.json());
  assert(b1t2CrossPlayer.success === false, 'Anti-cheat strictly rejects valid flag from another player ID');

  // Anti-Cheat Check 2c: Dynamic flag with UTF-8 player ID generated and verified
  const utf8Player = 'opérateur_français_éèà';
  const tmForFlag = new TrainingManager(null);
  const utf8Flag = tmForFlag.generateDynamicFlag('aegis-box-01-perimeter', 't2', 'AEGIS{GATEKEEPER_USER_BREACH}', utf8Player);
  const b1t2Utf8 = await fetch(`${BASE_URL}/api/training/submit-flag`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ challenge_id: 'aegis-box-01-perimeter', task_id: 't2', flag: utf8Flag, player_id: utf8Player })
  }).then(r => r.json());
  assert(b1t2Utf8.success === true && (b1t2Utf8.correct || b1t2Utf8.is_correct), 'Dynamic flag verification with UTF-8 player ID succeeds');

  // Box 1 Task 2: Real dynamic user flag from instance injection
  const dynamicUserFlagBox1 = box1Start.vfs_injection['/home/operator/user.txt'].content.trim();
  const b1t2 = await fetch(`${BASE_URL}/api/training/submit-flag`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ challenge_id: 'aegis-box-01-perimeter', task_id: 't2', flag: dynamicUserFlagBox1 })
  }).then(r => r.json());
  assert(b1t2.success === true && (b1t2.correct || b1t2.is_correct), 'Box 1 Task 2 dynamic user flag solved');

  // Box 1 Task 3: Real dynamic root flag from instance injection
  const dynamicRootFlagBox1 = box1Start.vfs_injection['/root/root.txt'].content.trim();
  const b1t3 = await fetch(`${BASE_URL}/api/training/submit-flag`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ challenge_id: 'aegis-box-01-perimeter', task_id: 't3', flag: dynamicRootFlagBox1 })
  }).then(r => r.json());
  assert(b1t3.success === true && (b1t3.correct || b1t3.is_correct), 'Box 1 Task 3 dynamic root flag solved');

  // Box 1 Task 4: SOC Investigation (198.51.100.42 from Nginx log)
  const b1t4 = await fetch(`${BASE_URL}/api/training/submit-flag`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ challenge_id: 'aegis-box-01-perimeter', task_id: 't4', flag: '198.51.100.42' })
  }).then(r => r.json());
  assert(b1t4.success === true && (b1t4.correct || b1t4.is_correct), 'Box 1 Task 4 SOC log analysis solved');

  // Box 1 Task 5 Negative test: Dummy rule must be rejected
  const b1t5Dummy = await fetch(`${BASE_URL}/api/training/campaign/validate-soc-rule`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ challenge_id: 'aegis-box-01-perimeter', rule_type: 'sigma', rule_content: 'invalid dummy text' })
  }).then(r => r.json());
  assert(b1t5Dummy.success === false && b1t5Dummy.valid === false, 'Box 1 Task 5 invalid Sigma rule rejected');

  // Box 1 Task 5: Sigma Detection Rule validation
  const sigmaRuleContent = `title: Aegis Sync SUID Abuse\nstatus: experimental\nlogsource:\n  category: process_creation\ndetection:\n  selection:\n    Image|endswith: '/aegis-sync'\n  condition: selection`;
  const b1t5 = await fetch(`${BASE_URL}/api/training/campaign/validate-soc-rule`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ challenge_id: 'aegis-box-01-perimeter', rule_type: 'sigma', rule_content: sigmaRuleContent })
  }).then(r => r.json());
  assert(b1t5.success === true && b1t5.valid === true, 'Box 1 Task 5 Sigma rule validated');

  // Box 1 Task 6 Negative test: Vulnerable VFS state (SUID still present) must be rejected
  const b1VfsVuln = [
    { path: '/usr/local/bin/aegis-sync', type: 'file', permissions: '4755', suid: true, owner: 'root', group: 'root' }
  ];
  const b1t6Vuln = await fetch(`${BASE_URL}/api/training/campaign/verify-remediation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ challenge_id: 'aegis-box-01-perimeter', remediation_type: 'strip_suid', vfs_state: b1VfsVuln })
  }).then(r => r.json());
  assert(b1t6Vuln.success === false && b1t6Vuln.hardened === false, 'Box 1 Task 6 vulnerable VFS state with SUID rejected');

  // Box 1 Task 6: Remediation (chmod 0755 to strip SUID from aegis-sync)
  const b1VfsHardened = [
    { path: '/usr/local/bin/aegis-sync', type: 'file', permissions: '0755', suid: false, owner: 'root', group: 'root' }
  ];
  const b1t6 = await fetch(`${BASE_URL}/api/training/campaign/verify-remediation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ challenge_id: 'aegis-box-01-perimeter', remediation_type: 'strip_suid', vfs_state: b1VfsHardened })
  }).then(r => r.json());
  assert(b1t6.success === true && b1t6.hardened === true, 'Box 1 Task 6 system remediation verified');
  console.log('✔ 18.3 Box 1 (Acte I) Complete Solvability & Anti-Cheat PASSED');

  // 18.4 Box 2 (Acte II Core Nexus) Solvability End-to-End
  // Task 1: Artifact analysis from pcap (Viktor password)
  const b2t1 = await fetch(`${BASE_URL}/api/training/submit-flag`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ challenge_id: 'aegis-box-02-internal', task_id: 't1', flag: 'V!kt0r_Ch1m3ra_P4ss#2026' })
  }).then(r => r.json());
  assert(b2t1.success === true && (b2t1.correct || b2t1.is_correct), 'Box 2 Task 1 pcap password decoded');

  // Start Box 2 instance
  const box2StartRes = await fetch(`${BASE_URL}/api/training/instance/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ challenge_id: 'aegis-box-02-internal' })
  });
  assert(box2StartRes.ok, 'Box 2 instance started');
  const box2Start = await box2StartRes.json();

  // Test Box 2 Target endpoint
  const b2AuthCheck = await fetch(`${BASE_URL}/nexus/api/auth-check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: 'V!kt0r_Ch1m3ra_P4ss#2026' })
  }).then(r => r.json());
  assert(b2AuthCheck.authenticated === true, 'Nexus target auth endpoint passed');

  // Box 2 Task 2: User flag
  const dynamicUserFlagBox2 = box2Start.vfs_injection['/home/operator/user.txt'].content.trim();
  const b2t2 = await fetch(`${BASE_URL}/api/training/submit-flag`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ challenge_id: 'aegis-box-02-internal', task_id: 't2', flag: dynamicUserFlagBox2 })
  }).then(r => r.json());
  assert(b2t2.success === true && (b2t2.correct || b2t2.is_correct), 'Box 2 Task 2 dynamic user flag solved');

  // Box 2 Task 3: Root flag
  const dynamicRootFlagBox2 = box2Start.vfs_injection['/root/root.txt'].content.trim();
  const b2t3 = await fetch(`${BASE_URL}/api/training/submit-flag`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ challenge_id: 'aegis-box-02-internal', task_id: 't3', flag: dynamicRootFlagBox2 })
  }).then(r => r.json());
  assert(b2t3.success === true && (b2t3.correct || b2t3.is_correct), 'Box 2 Task 3 dynamic root flag solved');

  // Box 2 Task 4: SOC Forensics (chimera_implant_cron.sh)
  const b2t4 = await fetch(`${BASE_URL}/api/training/submit-flag`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ challenge_id: 'aegis-box-02-internal', task_id: 't4', flag: 'chimera_implant_cron.sh' })
  }).then(r => r.json());
  assert(b2t4.success === true && (b2t4.correct || b2t4.is_correct), 'Box 2 Task 4 SOC forensic script identified');

  // Box 2 Task 5 Negative test: Incomplete Sigma rule without detection section
  const b2t5Invalid = await fetch(`${BASE_URL}/api/training/campaign/validate-soc-rule`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ challenge_id: 'aegis-box-02-internal', rule_type: 'sigma', rule_content: 'title: Incomplete Rule\nstatus: experimental' })
  }).then(r => r.json());
  assert(b2t5Invalid.success === false && b2t5Invalid.valid === false, 'Box 2 Task 5 incomplete Sigma rule rejected');

  // Box 2 Task 5: Sigma Detection Rule validation
  const sigmaCronRule = `title: Cron Tampering Detected\nstatus: experimental\nlogsource:\n  category: file_event\ndetection:\n  selection:\n    TargetFilename|startswith: '/opt/maintenance/'\n  condition: selection`;
  const b2t5 = await fetch(`${BASE_URL}/api/training/campaign/validate-soc-rule`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ challenge_id: 'aegis-box-02-internal', rule_type: 'sigma', rule_content: sigmaCronRule })
  }).then(r => r.json());
  assert(b2t5.success === true && b2t5.valid === true, 'Box 2 Task 5 Sigma cron rule validated');

  // Box 2 Task 6 Negative test: World-writable backup script must be rejected
  const b2VfsVuln = [
    { path: '/opt/maintenance/aegis-backup.sh', type: 'file', permissions: '0777', owner: 'root', group: 'root' }
  ];
  const b2t6Vuln = await fetch(`${BASE_URL}/api/training/campaign/verify-remediation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ challenge_id: 'aegis-box-02-internal', remediation_type: 'cron_permissions', vfs_state: b2VfsVuln })
  }).then(r => r.json());
  assert(b2t6Vuln.success === false && b2t6Vuln.hardened === false, 'Box 2 Task 6 world-writable script rejected');

  // Box 2 Task 6: Remediation (chmod 0700 on backup.sh and delete implant)
  const b2VfsHardened = [
    { path: '/opt/maintenance/aegis-backup.sh', type: 'file', permissions: '0700', owner: 'root', group: 'root' }
  ];
  const b2t6 = await fetch(`${BASE_URL}/api/training/campaign/verify-remediation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ challenge_id: 'aegis-box-02-internal', remediation_type: 'cron_permissions', vfs_state: b2VfsHardened })
  }).then(r => r.json());
  assert(b2t6.success === true && b2t6.hardened === true, 'Box 2 Task 6 remediation verified');
  console.log('✔ 18.4 Box 2 (Acte II) Complete Solvability PASSED');

  // 18.5 Box 3 (Acte III Shadow Vault) Solvability End-to-End
  // Task 1: Artifact key from nexus_auth.sql
  const b3t1 = await fetch(`${BASE_URL}/api/training/submit-flag`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ challenge_id: 'aegis-box-03-vault', task_id: 't1', flag: 'VAULT_CIPHER_KEY_AEGIS_99' })
  }).then(r => r.json());
  assert(b3t1.success === true && (b3t1.correct || b3t1.is_correct), 'Box 3 Task 1 cipher key solved');

  // Start Box 3 instance
  const box3StartRes = await fetch(`${BASE_URL}/api/training/instance/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ challenge_id: 'aegis-box-03-vault' })
  });
  assert(box3StartRes.ok, 'Box 3 instance started');
  const box3Start = await box3StartRes.json();

  // Test Box 3 Target endpoint
  const b3CipherCheck = await fetch(`${BASE_URL}/vault/api/cipher`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: 'VAULT_CIPHER_KEY_AEGIS_99' })
  }).then(r => r.json());
  assert(b3CipherCheck.status === 'VAULT_UNLOCKED', 'Vault target endpoint unlocked');

  // Box 3 Task 2: User flag
  const dynamicUserFlagBox3 = box3Start.vfs_injection['/home/operator/user.txt'].content.trim();
  const b3t2 = await fetch(`${BASE_URL}/api/training/submit-flag`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ challenge_id: 'aegis-box-03-vault', task_id: 't2', flag: dynamicUserFlagBox3 })
  }).then(r => r.json());
  assert(b3t2.success === true && (b3t2.correct || b3t2.is_correct), 'Box 3 Task 2 dynamic user flag solved');

  // Box 3 Task 3: Root flag
  const dynamicRootFlagBox3 = box3Start.vfs_injection['/root/root.txt'].content.trim();
  const b3t3 = await fetch(`${BASE_URL}/api/training/submit-flag`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ challenge_id: 'aegis-box-03-vault', task_id: 't3', flag: dynamicRootFlagBox3 })
  }).then(r => r.json());
  assert(b3t3.success === true && (b3t3.correct || b3t3.is_correct), 'Box 3 Task 3 dynamic root flag solved');

  // Box 3 Task 4: Suricata IDS SOC Investigation (beacon-alpha.chimera-apt.net)
  const b3t4 = await fetch(`${BASE_URL}/api/training/submit-flag`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ challenge_id: 'aegis-box-03-vault', task_id: 't4', flag: 'beacon-alpha.chimera-apt.net' })
  }).then(r => r.json());
  assert(b3t4.success === true && (b3t4.correct || b3t4.is_correct), 'Box 3 Task 4 Suricata C2 domain identified');

  // Box 3 Task 5 Negative test: Invalid YARA rule without strings/condition
  const b3t5Invalid = await fetch(`${BASE_URL}/api/training/campaign/validate-soc-rule`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ challenge_id: 'aegis-box-03-vault', rule_type: 'yara', rule_content: 'rule Dummy { condition: false }' })
  }).then(r => r.json());
  assert(b3t5Invalid.success === false && b3t5Invalid.valid === false, 'Box 3 Task 5 invalid YARA rule rejected');

  // Box 3 Task 5: YARA Signature Rule validation
  const yaraRule = `rule Chimera_ShadowDropper { strings: $magic = "CHIMERA_IMPLANT_V1" condition: $magic }`;
  const b3t5 = await fetch(`${BASE_URL}/api/training/campaign/validate-soc-rule`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ challenge_id: 'aegis-box-03-vault', rule_type: 'yara', rule_content: yaraRule })
  }).then(r => r.json());
  assert(b3t5.success === true && b3t5.valid === true, 'Box 3 Task 5 YARA signature validated');

  // Box 3 Task 6 Negative test: Permissive firewall without DROP must be rejected
  const b3VfsVuln = [
    { path: '/etc/iptables.rules', type: 'file', permissions: '0644', content: '-A OUTPUT -j ACCEPT' }
  ];
  const b3t6Vuln = await fetch(`${BASE_URL}/api/training/campaign/verify-remediation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ challenge_id: 'aegis-box-03-vault', remediation_type: 'isolate_c2', vfs_state: b3VfsVuln })
  }).then(r => r.json());
  assert(b3t6Vuln.success === false && b3t6Vuln.hardened === false, 'Box 3 Task 6 permissive firewall without DROP rejected');

  // Box 3 Task 6: Remediation (delete implant and install iptables firewall rule)
  const b3VfsHardened = [
    { path: '/etc/iptables.rules', type: 'file', permissions: '0644', content: '-A OUTPUT -p tcp --dport 9090 -j DROP\n-A OUTPUT -d beacon-alpha.chimera-apt.net -j DROP' }
  ];
  const b3t6 = await fetch(`${BASE_URL}/api/training/campaign/verify-remediation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ challenge_id: 'aegis-box-03-vault', remediation_type: 'isolate_c2', vfs_state: b3VfsHardened })
  }).then(r => r.json());
  assert(b3t6.success === true && b3t6.hardened === true, 'Box 3 Task 6 C2 isolation and cleanup verified');
  console.log('✔ 18.5 Box 3 (Acte III) Complete Solvability PASSED');

  // 18.5b Campaign Season 1 Global Completion & Stats Verification
  const seasonStatsRes = await fetch(`${BASE_URL}/api/training/campaign/season/1`).then(r => r.json());
  assert(seasonStatsRes.success === true, 'Campaign season 1 query succeeds');
  const cStats = seasonStatsRes.stats;
  assert(cStats.total_boxes === 3, 'Total campaign boxes is 3');
  assert(cStats.offense_completed === 9, 'All 9 offensive tasks completed');
  assert(cStats.defense_completed === 9, 'All 9 defensive tasks completed');
  assert(cStats.offensive_completion_pct === 100, 'Offensive completion is 100%');
  assert(cStats.defensive_completion_pct === 100, 'Defensive completion is 100%');

  // Verify all 3 boxes are marked completed
  const completedBoxes = seasonStatsRes.boxes.filter(b => b.is_completed === true);
  assert(completedBoxes.length === 3, 'All 3 boxes have is_completed === true');
  const fullySecuredBoxes = seasonStatsRes.boxes.filter(b => b.defensive_status === 'fully_secured');
  assert(fullySecuredBoxes.length === 3, 'All 3 boxes have defensive_status === fully_secured');
  const rootPwnedBoxes = seasonStatsRes.boxes.filter(b => b.offensive_status === 'root_pwned');
  assert(rootPwnedBoxes.length === 3, 'All 3 boxes have offensive_status === root_pwned');
  console.log('✔ 18.5b Campaign Season 1 100% Completion & Dual Gauges PASSED');

  // 18.6 Virtual Terminal & VFS Execution Integration
  const campaignVfs = new VirtualFileSystem();
  campaignVfs.applyChallenge({
    id: 'aegis-box-01-perimeter',
    vfs_injection: box1Start.vfs_injection
  });
  const campaignBackend = new VirtualShellBackend(campaignVfs);
  const syncNode = campaignVfs.getNode('/usr/local/bin/aegis-sync');
  assert(syncNode && syncNode.suid === true, 'aegis-sync has SUID bit set in VFS');

  // Execute SUID binary as operator
  let suidRun = await campaignBackend.execute('/usr/local/bin/aegis-sync');
  assert(suidRun.stdout.includes('Élévation eUID=0 (root) réussie'), 'Executing aegis-sync elevates to root');
  assert(campaignBackend.isRoot === true && campaignBackend.eUID === 0, 'Backend is root after SUID execution');

  // Read dynamic root flag from within terminal
  let catRoot = await campaignBackend.execute('cat /root/root.txt');
  assert(catRoot.stdout.includes(dynamicRootFlagBox1), 'Terminal cat reads dynamic root flag');

  // Operator chmods aegis-sync to 0755
  await campaignBackend.execute('chmod 0755 /usr/local/bin/aegis-sync');
  assert(syncNode.suid === false && syncNode.permissions === '0755', 'chmod 0755 removes SUID bit from node');

  console.log('✔ 18.6 Virtual Terminal & VFS Execution Integration PASSED');

  console.log('========================================================================');
  console.log('🎉 100% DES 18 SUITES DE VALIDATION SONT AU VERT ! TOUT FONCTIONNE !');
  console.log('========================================================================');
}

async function main() {
  let serverProcess = null;
  try {
    serverProcess = await ensureServerRunning();
    await testAll();
  } finally {
    if (serverProcess) {
      console.log('[TEST] Arrêt du serveur CyberLab...');
      try { serverProcess.kill(); } catch {}
    }
  }
  process.exit(0);
}

main().catch(e => {
  console.log('::error::' + (e.stack || e.message));
  console.error('TEST FAILED:', e);
  process.exit(1);
});

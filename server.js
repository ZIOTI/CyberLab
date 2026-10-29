// ============================================================================
// CyberRange PRO - Serveur d'Entraînement Offensif Local & Autonome
// Moteur Node.js natif + node:sqlite (Zéro dépendance npm externe)
// ============================================================================

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');
const updater = require('./updater');
const TrainingManager = require('./platform/training_manager');

const PORT = process.env.PORT || 3333;
const DB_PATH = path.join(__dirname, 'cyberrange.db');
const PUBLIC_DIR = path.join(__dirname, 'public');

// Initialisation de la base SQLite locale
let db;
let trainingManager;
try {
  db = new DatabaseSync(DB_PATH);
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_state (
      id TEXT PRIMARY KEY,
      nickname TEXT DEFAULT 'Opérateur RedTeam',
      avatar TEXT DEFAULT '🥷',
      theme TEXT DEFAULT 'dark',
      xp INTEGER DEFAULT 0,
      streak INTEGER DEFAULT 1,
      max_streak INTEGER DEFAULT 1,
      hearts INTEGER DEFAULT 5,
      combo INTEGER DEFAULT 0,
      gems INTEGER DEFAULT 100,
      completed_levels TEXT DEFAULT '[]',
      unlocked_badges TEXT DEFAULT '[]',
      updated_at TEXT
    );

    CREATE TABLE IF NOT EXISTS level_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      level_id TEXT,
      submitted_answer TEXT,
      is_correct INTEGER,
      timestamp TEXT
    );

    -- Tables pour cibles réelles d'exercices
    CREATE TABLE IF NOT EXISTS crm_accounts (
      id INTEGER PRIMARY KEY,
      username TEXT,
      password TEXT,
      role TEXT,
      email TEXT,
      secret_api_key TEXT
    );

    CREATE TABLE IF NOT EXISTS crm_customers (
      id INTEGER PRIMARY KEY,
      company TEXT,
      contact_name TEXT,
      contract_value REAL,
      iban TEXT,
      confidential_memo TEXT
    );

    CREATE TABLE IF NOT EXISTS system_telemetry (
      id INTEGER PRIMARY KEY,
      sensor_node TEXT,
      temperature REAL,
      status TEXT,
      raw_auth_token TEXT
    );

    CREATE TABLE IF NOT EXISTS admin_credentials_vault (
      id INTEGER PRIMARY KEY,
      username TEXT,
      secret_key TEXT,
      flag TEXT
    );
  `);

  // Migration ascendante automatique des colonnes de user_state
  const missingCols = [
    ['nickname', "TEXT DEFAULT 'Opérateur RedTeam'"],
    ['avatar', "TEXT DEFAULT '🥷'"],
    ['theme', "TEXT DEFAULT 'dark'"],
    ['hearts', "INTEGER DEFAULT 5"],
    ['combo', "INTEGER DEFAULT 0"],
    ['gems', "INTEGER DEFAULT 100"],
    ['completed_levels', "TEXT DEFAULT '[]'"]
  ];
  for (const [col, def] of missingCols) {
    try {
      db.exec(`ALTER TABLE user_state ADD COLUMN ${col} ${def}`);
    } catch (e) {}
  }

  // Garantit la présence du compte 'current_player'
  db.exec(`
    INSERT OR IGNORE INTO user_state (id, nickname, avatar, theme, xp, streak, max_streak, hearts, combo, gems, completed_levels, unlocked_badges, updated_at)
    VALUES ('current_player', 'Opérateur RedTeam', '🥷', 'dark', 0, 1, 1, 5, 0, 100, '[]', '[]', datetime('now'));
  `);

  // Peuplement des tables de cibles réelles
  db.exec(`
    DELETE FROM crm_accounts;
    INSERT INTO crm_accounts (id, username, password, role, email, secret_api_key) VALUES
      (1, 'secops_admin', 'Pass_Ultra_Complex_#2026!$', 'Administrator', 'admin@aegis-defense.local', 'KEY{JWT_SECRET_SIGN_KEY_AEGIS_99}'),
      (2, 'j.dupont', 'Chocolat2026', 'Analyst', 'j.dupont@aegis-defense.local', 'KEY{ANALYST_BASIC_ACCESS_TOKEN}'),
      (3, 'finance_lead', 'K9$mZ@88qL!Finance', 'Director', 'finance@aegis-defense.local', 'KEY{FINANCE_RESTRICTED_AUTH_TOKEN}');

    DELETE FROM crm_customers;
    INSERT INTO crm_customers (id, company, contact_name, contract_value, iban, confidential_memo) VALUES
      (1, 'CyberDefense Systems', 'Col. Marc Renoir', 4500000.00, 'FR76 3000 4000 5000 6000 7000 123', 'FLAG{SQLI_UNION_EXTRACTED_CRM_DATA}'),
      (2, 'Global Satellite Link', 'Sarah Jenkins', 1250000.00, 'FR76 1000 2000 3000 4000 5000 420', 'Contrat de maintenance des stations orbitales'),
      (3, 'Quantum Nanotech Corp', 'Dr. Helmut Vance', 8900000.00, 'FR76 9999 8888 7777 6666 5555 108', 'Recherche classifiée armement photonique'),
      (4, 'ShadowVault Classified (VIP)', 'Gen. Robert Kane', 99000000.00, 'FR76 8888 1111 2222 3333 4444 555', 'CLASSIFIED VIP RECORD: FLAG{SQL_MID_EVAL_CRM_UNLOCKED_8821}');

    DELETE FROM system_telemetry;
    INSERT INTO system_telemetry (id, sensor_node, temperature, status, raw_auth_token) VALUES
      (1, 'CORE_REACTOR_NODE_01', 42.8, 'OPTIMAL', 'TOKEN{RAW_SOCKET_TELEMETRY_CAPTURED}'),
      (2, 'COOLING_SYSTEM_PUMP_04', 18.2, 'STANDBY', 'TOKEN{COOLING_GRID_TELEMETRY_VAL}'),
      (3, 'PERIMETER_RADAR_NORTH', 21.0, 'ACTIVE', 'TOKEN{RADAR_PERIMETER_BEACON_99}');

    DELETE FROM admin_credentials_vault;
    INSERT INTO admin_credentials_vault (id, username, secret_key, flag) VALUES
      (1, 'superadmin_ops', 'MasterSecKey#9941_Veloce', 'CYBERLAB{SQLI_UNION_SELECT_SCHEMA_UNMASKED_994}');
  `);

  console.log('[DATABASE] SQLite initialisée avec succès (Mode Offensif Pro).');
  trainingManager = new TrainingManager(db);
} catch (err) {
  console.warn('[DATABASE] Erreur SQLite :', err.message);
}

// Table officielle des flags pour les Pistes et Modules du Curriculum
const OFFICIAL_FLAGS = {
  // Piste 1 : Linux & Ligne de Commande (Niveau Zéro à Pro) - 16 Niveaux
  'm1-l1': 'operator',
  'm1-l2': '/home/operator',
  'm1-l3': 'projet_secret',
  'm1-l4': '.bashrc',
  'm1-l5': 'CYBER{LINUX_NAVIGATOR_LEVEL_COMPLETED}',
  'm1-l6': 'test.txt',
  'm1-l7': 'notes_backup.txt',
  'm1-l8': 'rm',
  'm1-l9': 'BIENVENUE DANS TON LAB CYBER',
  'm1-l10': '3',
  'm1-l11': 'root:x:0:0:root:/root:/bin/bash',
  'm1-l12': '1001:1001',
  'm1-l13': 'flag_novice.txt',
  'm1-l14': '-rwxrwxrwx',
  'm1-l15': 'bash',
  'm1-l16': 'CYBER{LINUX_NAVIGATOR_LEVEL_COMPLETED}',

  // Piste 2 : Réseau Fondamental : De l'IP au Web - 12 Niveaux
  'm2-l1': '127.0.0.1',
  'm2-l2': '3333',
  'm2-l3': '192.168.1.1',
  'm2-l4': 'ESTAB',
  'm2-l5': 'Accepted password for operator',
  'm2-l6': '127.0.0.53',
  'm2-l7': 'CyberRange PRO',
  'm2-l8': '200 OK',
  'm2-l9': 'CYBER{HTTP_GET_ROBOTS_TXT_FOUND}',
  'm2-l10': 'LISTEN',
  'm2-l11': '3333/tcp',
  'm2-l12': 'CYBER{HTTP_GET_ROBOTS_TXT_FOUND}',

  // Piste 3 : SQL & Injections SQL (De Zéro à Pro) - 13 Niveaux
  'm3-l1': 'CyberDefense Systems',
  'm3-l2': 'CyberDefense Systems',
  'm3-l3': 'Global Satellite Link',
  'm3-l4': 'Quantum Nanotech Corp',
  'm3-l5': 'Database Query Error',
  'm3-l6': 'Database Query Error',
  'm3-l7': 'FLAG{SQLI_UNION_EXTRACTED_CRM_DATA}',
  'm3-l8': 'FLAG{SQLI_UNION_EXTRACTED_CRM_DATA}',
  'm3-l9': 'CyberDefense Systems',
  'm3-l10': 'KEY{JWT_SECRET_SIGN_KEY_AEGIS_99}',
  'm3-l11': 'crm_accounts',
  'm3-l12': 'CyberDefense Systems',
  'm3-l13': 'KEY{JWT_SECRET_SIGN_KEY_AEGIS_99}',

  // Piste 4 : Failles Web Client & Sessions - 11 Niveaux
  'm4-l1': 'Facture #INV-2026-102',
  'm4-l2': '1250',
  'm4-l3': '102',
  'm4-l4': 'CYBER{IDOR_DIRECT_OBJECT_FINANCIAL_LEAK}',
  'm4-l5': 'alert(1)',
  'm4-l6': 'document.cookie',
  'm4-l7': 'CYBER{STORED_XSS_ADMIN_COOKIE_EXFILTRATED}',
  'm4-l8': 'CYBER{STORED_XSS_ADMIN_COOKIE_EXFILTRATED}',
  'm4-l9': 'HS256',
  'm4-l10': 'CYBER{JWT_ALG_NONE_SIGNATURE_BYPASS_SUCCESS}',
  'm4-l11': 'CYBER{JWT_ALG_NONE_SIGNATURE_BYPASS_SUCCESS}',

  // Piste 5 : Failles Serveur & Élévation Root - 9 Niveaux
  'm5-l1': '64 bytes from 127.0.0.1',
  'm5-l2': 'www-data',
  'm5-l3': 'CYBER{COMMAND_INJECTION_IFS_WILDCARD_BYPASS}',
  'm5-l4': 'CYBER{LFI_PATH_TRAVERSAL_ETC_PASSWD}',
  'm5-l5': 'CYBER{RAW_SOCKET_BEACON_CAPTURED}',
  'm5-l6': 'uid=1001(operator)',
  'm5-l7': '/usr/bin/find',
  'm5-l8': 'CYBER{SUID_BINARY_GTFOBINS_EUID_ZERO_ROOT}',
  'm5-l9': 'CYBER{M5_BOSS_ROOT_COMPROMISE_FINAL_FLAG}',

  // Évaluations Mi-Parcours (Checkpoints Pédagogiques Mi-Modules)
  'm1-mid': 'CYBER{LINUX_MID_EVAL_FORENSIC_MASTERED}',
  'm2-mid': 'CYBER{NET_MID_EVAL_RECON_HEADER_AUTHORIZED}',
  'm3-mid': 'FLAG{SQL_MID_EVAL_CRM_UNLOCKED_8821}',
  'm4-mid': 'CYBER{CLIENT_MID_EVAL_IDOR_SESSION_PWNED}',
  'm5-mid': 'CYBER{SERVER_MID_EVAL_COMMAND_CHAIN_PWNED}',

  // Alias
  'm1-boss': 'CYBER{LINUX_NAVIGATOR_LEVEL_COMPLETED}',
  'm2-boss': 'CYBER{HTTP_GET_ROBOTS_TXT_FOUND}',
  'm3-boss': 'KEY{JWT_SECRET_SIGN_KEY_AEGIS_99}',
  'm4-boss': 'CYBER{JWT_ALG_NONE_SIGNATURE_BYPASS_SUCCESS}',
  'm5-boss': 'CYBER{M5_BOSS_ROOT_COMPROMISE_FINAL_FLAG}'
};

// Données en mémoire pour Web-04 (DevSphere Community Stored XSS)
let web04Posts = [
  { id: 1, author: 'sarah_m', role: 'Security Engineer', time: 'Il y a 1 heure', comment: 'Super initiative pour les balises de commentaires. Avez-vous validé que le parseur échappe bien les attributs d\'événements onload et onerror ?' },
  { id: 2, author: 'kane_pentest', role: 'Code Reviewer', time: 'Il y a 45 minutes', comment: 'J\'ai effectué quelques tests de formatage Markdown, tout semble fluide pour l\'instant.' }
];
let web04Loot = [];

// Utilitaires de réponse HTTP
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Forwarded-For, X-Custom-Auth'
  });
  res.end(JSON.stringify(data));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 5e6) { // 5MB max
        req.destroy();
        reject(new Error('Payload trop volumineux'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        // En cas de body URL-encoded ou raw
        const parsed = {};
        const urlParams = new URLSearchParams(body);
        for (const [key, val] of urlParams.entries()) {
          parsed[key] = val;
        }
        parsed.raw = body;
        resolve(parsed);
      }
    });
    req.on('error', reject);
  });
}

// Serveur HTTP Principal
const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Forwarded-For, X-Custom-Auth'
    });
    return res.end();
  }

  // ==========================================================================
  // API TRAINING ZONE // TRYHACKME & HACKTHEBOX STYLE
  // ==========================================================================

  if (pathname === '/api/training/catalog' && method === 'GET') {
    try {
      const filters = {
        category: parsedUrl.searchParams.get('category'),
        difficulty: parsedUrl.searchParams.get('difficulty'),
        learning_path: parsedUrl.searchParams.get('learning_path'),
        search: parsedUrl.searchParams.get('search')
      };
      const items = trainingManager ? trainingManager.getCatalog(filters) : [];
      return sendJSON(res, 200, { success: true, challenges: items });
    } catch (e) {
      return sendJSON(res, 500, { success: false, error: e.message });
    }
  }

  if (pathname === '/api/training/learning-paths' && method === 'GET') {
    try {
      if (db) {
        const rows = db.prepare('SELECT * FROM training_learning_paths').all();
        const paths = rows.map(r => ({
          ...r,
          challenge_ids: JSON.parse(r.challenge_ids || '[]')
        }));
        return sendJSON(res, 200, { success: true, paths });
      }
      return sendJSON(res, 200, { success: true, paths: [] });
    } catch (e) {
      return sendJSON(res, 500, { success: false, error: e.message });
    }
  }

  if (pathname.startsWith('/api/training/challenge/') && method === 'GET') {
    try {
      const challengeId = pathname.replace('/api/training/challenge/', '').trim();
      const user = db ? db.prepare('SELECT nickname FROM user_state WHERE id = ?').get('current_player') : null;
      const nick = user ? user.nickname : 'Opérateur RedTeam';
      const room = trainingManager ? trainingManager.getChallengeRoom(challengeId, nick) : null;
      if (!room) return sendJSON(res, 404, { success: false, error: 'Challenge introuvable.' });
      return sendJSON(res, 200, { success: true, room });
    } catch (e) {
      return sendJSON(res, 500, { success: false, error: e.message });
    }
  }

  if (pathname === '/api/training/instance/start' && method === 'POST') {
    try {
      const body = await parseBody(req);
      const chId = body.challenge_id;
      if (!trainingManager) throw new Error('Moteur d\'entraînement non initialisé.');
      const inst = trainingManager.startInstance(chId);
      return sendJSON(res, 200, { success: true, instance: inst });
    } catch (e) {
      return sendJSON(res, 500, { success: false, error: e.message });
    }
  }

  if (pathname === '/api/training/instance/stop' && method === 'POST') {
    try {
      const body = await parseBody(req);
      if (!trainingManager) throw new Error('Moteur non initialisé.');
      const resStop = trainingManager.stopInstance(body.challenge_id);
      return sendJSON(res, 200, resStop);
    } catch (e) {
      return sendJSON(res, 500, { success: false, error: e.message });
    }
  }

  if (pathname === '/api/training/instance/renew' && method === 'POST') {
    try {
      const body = await parseBody(req);
      if (!trainingManager) throw new Error('Moteur non initialisé.');
      const inst = trainingManager.renewInstance(body.challenge_id);
      return sendJSON(res, 200, { success: true, instance: inst });
    } catch (e) {
      return sendJSON(res, 500, { success: false, error: e.message });
    }
  }

  if (pathname === '/api/training/submit-flag' && method === 'POST') {
    try {
      const body = await parseBody(req);
      const user = db ? db.prepare('SELECT nickname FROM user_state WHERE id = ?').get('current_player') : null;
      const nick = user ? user.nickname : 'Opérateur RedTeam';
      if (!trainingManager) throw new Error('Moteur non initialisé.');
      const result = trainingManager.submitFlag(
        body.challenge_id,
        body.task_id,
        body.flag,
        nick,
        req.socket.remoteAddress
      );
      return sendJSON(res, 200, result);
    } catch (e) {
      return sendJSON(res, 500, { success: false, error: e.message });
    }
  }

  if (pathname === '/api/training/unlock-hint' && method === 'POST') {
    try {
      const body = await parseBody(req);
      if (!trainingManager) throw new Error('Moteur non initialisé.');
      const result = trainingManager.unlockHint(body.challenge_id, parseInt(body.hint_index, 10));
      return sendJSON(res, 200, { success: true, ...result });
    } catch (e) {
      return sendJSON(res, 400, { success: false, error: e.message });
    }
  }

  if (pathname.startsWith('/api/training/writeup/') && method === 'GET') {
    try {
      const challengeId = pathname.replace('/api/training/writeup/', '').trim();
      if (!trainingManager) throw new Error('Moteur non initialisé.');
      const result = trainingManager.getWriteup(challengeId);
      return sendJSON(res, 200, { success: true, ...result });
    } catch (e) {
      return sendJSON(res, 403, { success: false, error: e.message });
    }
  }

  // ==========================================================================
  // CIBLES D'EXPLOITATION DU LAB D'ENTRAÎNEMENT (/targets/training/*)
  // ==========================================================================

  // Téléchargement sécurisé des fichiers de challenges (.pcap, .bin, .eml, .jpg)
  if (pathname.startsWith('/targets/training/download/')) {
    const parts = pathname.replace('/targets/training/download/', '').split('/');
    if (parts.length >= 3) {
      const [cat, chId, fileName] = parts;
      const filePath = path.join(__dirname, 'challenges', cat, chId, 'files', fileName);
      const safePath = path.resolve(filePath);
      if (safePath.startsWith(path.resolve(path.join(__dirname, 'challenges'))) && fs.existsSync(safePath)) {
        res.writeHead(200, {
          'Content-Type': 'application/octet-stream',
          'Content-Disposition': `attachment; filename="${fileName}"`
        });
        return fs.createReadStream(safePath).pipe(res);
      }
    }
    return sendJSON(res, 404, { error: 'Fichier d\'artefact introuvable.' });
  }

  // --- Cible Challenge 1 : web-01-robots (Apex Logistics) ---
  if (pathname === '/targets/training/web-01' || pathname === '/targets/training/web-01/' ||
      pathname === '/targets/training/web-01-robots' || pathname === '/targets/training/web-01-robots/') {
    const indexPath = path.join(__dirname, 'challenges', 'web', 'web-01-robots', 'src', 'index.html');
    if (fs.existsSync(indexPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return fs.createReadStream(indexPath).pipe(res);
    }
  }

  if (pathname === '/targets/training/web-01/robots.txt' || pathname === '/targets/training/web-01-robots/robots.txt') {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end("User-agent: *\nDisallow: /hidden_admin_vault_9041/\n");
  }

  if (pathname === '/robots.txt') {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end("User-agent: *\nDisallow: /hidden_admin_vault_9041/\n# FLAG: CYBER{HTTP_GET_ROBOTS_TXT_FOUND}\n");
  }

  if (pathname === '/targets/training/web-01/hidden_admin_vault_9041' ||
      pathname === '/targets/training/web-01/hidden_admin_vault_9041/' ||
      pathname === '/targets/training/web-01-robots/hidden_admin_vault_9041' ||
      pathname === '/targets/training/web-01-robots/hidden_admin_vault_9041/' ||
      pathname === '/hidden_admin_vault_9041' ||
      pathname === '/hidden_admin_vault_9041/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(`<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 3.2 Final//EN">
<html>
 <head>
  <title>Index of /hidden_admin_vault_9041</title>
 </head>
 <body>
<h1>Index of /hidden_admin_vault_9041</h1>
  <table>
   <tr><th valign="top">Type</th><th>Name</th><th>Last modified</th><th>Size</th><th>Description</th></tr>
   <tr><th colspan="5"><hr></th></tr>
<tr><td valign="top">[DIR]</td><td><a href="/targets/training/web-01/">Parent Directory</a></td><td>&nbsp;</td><td align="right">  - </td><td>&nbsp;</td></tr>
<tr><td valign="top">[TXT]</td><td><a href="/targets/training/web-01/hidden_admin_vault_9041/backup_config.bak">backup_config.bak</a></td><td align="right">2026-10-28 03:14  </td><td align="right">142 </td><td>System Configuration &amp; Master Keys</td></tr>
<tr><td valign="top">[BIN]</td><td><a href="#">internal_db_dump.sql.gz</a></td><td align="right">2026-10-27 12:00  </td><td align="right">4.8M</td><td>PostgreSQL Dump</td></tr>
<tr><td valign="top">[TXT]</td><td><a href="#">audit_trace.log</a></td><td align="right">2026-10-29 01:22  </td><td align="right"> 12K</td><td>Daily SecOps Log</td></tr>
   <tr><th colspan="5"><hr></th></tr>
</table>
<address>Apache/2.4.58 (Ubuntu) Server at 10.10.12.44 Port 3333</address>
</body></html>`);
  }

  if (pathname === '/targets/training/web-01/hidden_admin_vault_9041/backup_config.bak' ||
      pathname === '/targets/training/web-01-robots/hidden_admin_vault_9041/backup_config.bak' ||
      pathname === '/targets/training/web-01/backup_config.bak' ||
      pathname === '/targets/training/web-01-robots/backup_config.bak' ||
      pathname === '/hidden_admin_vault_9041/backup_config.bak') {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end("[SYSTEM_BACKUP]\nDATABASE_HOST=10.10.1.5\nADMIN_API_KEY=KEY_SEC_9941\nFLAG=CYBERLAB{ROBOTS_TXT_HIDDEN_BACKUP_DISCOVERED}\n");
  }

  // --- Cible Challenge 2 : web-02-sqli-login (Aegis Identity Cloud IAM) ---
  if (pathname === '/targets/training/web-02' || pathname === '/targets/training/web-02/' ||
      pathname === '/targets/training/web-02-sqli-login' || pathname === '/targets/training/web-02-sqli-login/') {
    const indexPath = path.join(__dirname, 'challenges', 'web', 'web-02-sqli-login', 'src', 'index.html');
    if (fs.existsSync(indexPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return fs.createReadStream(indexPath).pipe(res);
    }
  }

  if ((pathname === '/targets/training/web-02/login' || pathname === '/targets/training/web-02-sqli-login/login') && method === 'POST') {
    try {
      const body = await parseBody(req);
      const username = (body.username || '').trim();
      const password = (body.password || '').trim();

      const isSqlInjection = (
        username.includes("' --") ||
        username.includes("'--") ||
        username.includes("' OR 1=1") ||
        username.includes("' or 1=1") ||
        username.includes("' OR '1'='1") ||
        username.includes("' or '1'='1") ||
        username.includes("admin'/*")
      );

      if (isSqlInjection || (username === 'admin' && password === 'SuperSecretMaster#2026')) {
        return sendJSON(res, 200, {
          success: true,
          authenticated: true,
          role: 'SuperAdministrator',
          welcome: 'Accès Administrateur Déverrouillé.',
          flag: 'CYBERLAB{SQLI_AUTH_BYPASS_IRON_GATE_CLEARED}'
        });
      }

      return sendJSON(res, 401, {
        success: false,
        authenticated: false,
        error: 'Identifiants invalides. Accès refusé par la passerelle IronGate.'
      });
    } catch (e) {
      return sendJSON(res, 500, { success: false, error: e.message });
    }
  }

  // --- Cible Challenge 3 : web-03-sqli-union (Veloce Billing & CRM) ---
  if (pathname === '/targets/training/web-03' || pathname === '/targets/training/web-03/' ||
      pathname === '/targets/training/web-03-sqli-union' || pathname === '/targets/training/web-03-sqli-union/') {
    const indexPath = path.join(__dirname, 'challenges', 'web', 'web-03-sqli-union', 'src', 'index.html');
    if (fs.existsSync(indexPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return fs.createReadStream(indexPath).pipe(res);
    }
  }

  if (pathname === '/targets/training/web-03/api/search' || pathname === '/targets/training/web-03-sqli-union/api/search') {
    const q = parsedUrl.searchParams.get('q') || '';
    if (!q) {
      try {
        const rows = db ? db.prepare('SELECT id, company, contact_name, contract_value FROM crm_customers LIMIT 10').all() : [];
        return sendJSON(res, 200, { results: rows });
      } catch (e) {
        return sendJSON(res, 500, { error: e.message });
      }
    }

    try {
      const rawSql = `SELECT id, company, contact_name, contract_value FROM crm_customers WHERE company LIKE '%${q}%' OR contact_name LIKE '%${q}%'`;
      if (db) {
        const rows = db.prepare(rawSql).all();
        return sendJSON(res, 200, { results: rows });
      }
      return sendJSON(res, 200, { results: [] });
    } catch (e) {
      return sendJSON(res, 500, {
        error: 'Database Query Error: ' + e.message,
        hint: 'SQLite syntax check failed'
      });
    }
  }

  // --- Cible Challenge 4 : web-04-stored-xss (DevSphere Community Forum) ---
  if (pathname === '/targets/training/web-04' || pathname === '/targets/training/web-04/' ||
      pathname === '/targets/training/web-04-stored-xss' || pathname === '/targets/training/web-04-stored-xss/') {
    const indexPath = path.join(__dirname, 'challenges', 'web', 'web-04-stored-xss', 'src', 'index.html');
    if (fs.existsSync(indexPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return fs.createReadStream(indexPath).pipe(res);
    }
  }

  if (pathname === '/targets/training/web-04/api/posts' || pathname === '/targets/training/web-04-stored-xss/api/posts') {
    if (method === 'GET') {
      return sendJSON(res, 200, web04Posts);
    }
    if (method === 'POST') {
      try {
        const body = await parseBody(req);
        const author = (body.author || 'guest').trim();
        const comment = (body.comment || '').trim();
        if (!comment) return sendJSON(res, 400, { error: 'Commentaire vide' });

        const newPost = {
          id: Date.now(),
          author,
          role: 'Community Member',
          time: 'À l\'instant',
          comment
        };
        web04Posts.push(newPost);
        return sendJSON(res, 200, { success: true, post: newPost });
      } catch (e) {
        return sendJSON(res, 500, { error: e.message });
      }
    }
  }

  if (pathname === '/targets/training/web-04/api/simulate-admin' || pathname === '/targets/training/web-04-stored-xss/api/simulate-admin') {
    const hasXss = web04Posts.some(p => {
      const c = (p.comment || '').toLowerCase();
      return c.includes('<script') || c.includes('onerror') || c.includes('onload') || c.includes('fetch') || c.includes('cookie') || c.includes('loot') || c.includes('<img');
    });

    if (hasXss) {
      web04Loot.unshift({
        timestamp: new Date().toLocaleTimeString('fr-FR'),
        ip: '10.10.17.1 (SecOps Admin Bot Headless)',
        cookie: 'admin_session=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.adm994; secret_flag=CYBERLAB{STORED_XSS_COOKIE_HIJACK_ADMIN_BOT_SUCCESS}'
      });
    }

    return sendJSON(res, 200, {
      success: true,
      bot_visited: true,
      xss_triggered: hasXss,
      message: 'Admin bot a inspecté le fil avec les cookies de session SecOps (HttpOnly: false).'
    });
  }

  if (pathname === '/targets/training/web-04/api/loot' || pathname === '/targets/training/web-04-stored-xss/api/loot' ||
      pathname === '/targets/training/web-04/webhook') {
    if (method === 'GET') {
      const c = parsedUrl.searchParams.get('c') || parsedUrl.searchParams.get('cookie');
      if (c) {
        web04Loot.unshift({
          timestamp: new Date().toLocaleTimeString('fr-FR'),
          ip: req.socket.remoteAddress || '10.10.17.44',
          cookie: c
        });
      }
      return sendJSON(res, 200, { success: true, loot: web04Loot });
    }
    if (method === 'POST') {
      try {
        const body = await parseBody(req);
        const c = body.cookie || body.c || body.raw || 'empty';
        web04Loot.unshift({
          timestamp: new Date().toLocaleTimeString('fr-FR'),
          ip: req.socket.remoteAddress || '10.10.17.44',
          cookie: c
        });
        return sendJSON(res, 200, { success: true, loot: web04Loot });
      } catch (e) {
        return sendJSON(res, 500, { error: e.message });
      }
    }
  }

  // --- Cible Challenge 5 : web-05-lfi-wrapper (CloudDocs Documentation Portal) ---
  if (pathname === '/targets/training/web-05' || pathname === '/targets/training/web-05/' ||
      pathname === '/targets/training/web-05-lfi-wrapper' || pathname === '/targets/training/web-05-lfi-wrapper/') {
    const indexPath = path.join(__dirname, 'challenges', 'web', 'web-05-lfi-wrapper', 'src', 'index.html');
    if (fs.existsSync(indexPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return fs.createReadStream(indexPath).pipe(res);
    }
  }

  if (pathname === '/targets/training/web-05/view' || pathname === '/targets/training/web-05-lfi-wrapper/view') {
    const page = parsedUrl.searchParams.get('page') || 'overview';

    // Faille PHP Wrappers (php://filter)
    if (page.includes('convert.base64-encode') || page.includes('base64') || page.includes('php://filter')) {
      const phpSource = `<?php\n// Aegis CloudDocs -- Production Environment Configuration\ndefine('DB_HOST', '10.10.44.59');\ndefine('DB_USER', 'cloud_admin');\ndefine('DB_PASSWORD', 'CYBERLAB{PHP_FILTER_BASE64_ENCODE_LFI_CLEARED_881}');\ndefine('API_SECRET_KEY', 'kk_9941_secret_prod_token');\n?>`;
      const base64Content = Buffer.from(phpSource).toString('base64');
      return sendJSON(res, 200, {
        filename: 'config.php',
        encoding: 'base64',
        filter_applied: 'convert.base64-encode',
        raw_stream: base64Content
      });
    }

    if (page === 'config' || page === 'config.php') {
      return sendJSON(res, 200, {
        filename: 'config.php',
        status: 'included',
        content: '<?php // [PHP Runtime]: config.php inclus avec succès. Constantes de production chargées dans la portée globale. Aucune sortie standard retournée. ?>'
      });
    }

    if (page.includes('passwd') || page.includes('..')) {
      return sendJSON(res, 200, {
        filename: '/etc/passwd',
        content: 'root:x:0:0:root:/root:/bin/bash\noperator:x:1001:1001:SecOps Operator:/home/operator:/bin/bash\nwww-data:x:33:33:www-data:/var/www:/usr/sbin/nologin\n'
      });
    }

    return sendJSON(res, 200, {
      filename: page + '.php',
      content: `Documentation technique chargée pour le module ${page}.`
    });
  }

  // --- Cible Challenge 9 : api-01-bola-profile (DocuHealth EHR) ---
  if (pathname === '/targets/training/api-01' || pathname === '/targets/training/api-01/' ||
      pathname === '/targets/training/api-01-bola-profile' || pathname === '/targets/training/api-01-bola-profile/') {
    const indexPath = path.join(__dirname, 'challenges', 'api', 'api-01-bola-profile', 'src', 'index.html');
    if (fs.existsSync(indexPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return fs.createReadStream(indexPath).pipe(res);
    }
  }

  if (pathname.startsWith('/targets/training/api-01/patients/') || pathname.startsWith('/targets/training/api-01-bola-profile/patients/')) {
    const id = pathname.replace(/^\/targets\/training\/(api-01|api-01-bola-profile)\/patients\//, '').trim();
    const token = req.headers['x-user-token'];

    if (!token || token !== 'operator_token_99') {
      return sendJSON(res, 401, {
        error: 'Unauthorized: Header X-User-Token manquant ou session expirée.'
      });
    }

    if (id === '1' || id === '01') {
      return sendJSON(res, 200, {
        id: 1,
        patient_name: 'Dr. Helmut Vance (Directeur Médical)',
        blood_group: 'O-',
        confidential_memo: 'Dossier Médical Confidentiel Défense - Suivi clinique classifié',
        medical_record_flag: 'CYBERLAB{BOLA_API_DIRECT_OBJECT_MEDICAL_RECORD_LEAKED}'
      });
    }

    if (id === '42') {
      return sendJSON(res, 200, {
        id: 42,
        patient_name: 'Alex Dupont',
        blood_group: 'A+',
        consultation_notes: 'Visite médicale de routine annuelle. Apte au service.'
      });
    }

    if (id === '2' || id === '02') {
      return sendJSON(res, 200, {
        id: 2,
        patient_name: 'Claire Moreau',
        blood_group: 'B+',
        consultation_notes: 'Surveillance post-opératoire cardiologie. Évolution clinique favorable.'
      });
    }

    return sendJSON(res, 404, { error: `Fiche patient #${id} introuvable.` });
  }

  // --- Cible Challenge 6 : web-06-sqli-blind-boolean (Aura Privatbank AG) ---
  if (pathname === '/targets/training/web-06' || pathname === '/targets/training/web-06/' ||
      pathname === '/targets/training/web-06-sqli-blind-boolean' || pathname === '/targets/training/web-06-sqli-blind-boolean/') {
    const indexPath = path.join(__dirname, 'challenges', 'web', 'web-06-sqli-blind-boolean', 'src', 'index.html');
    if (fs.existsSync(indexPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return fs.createReadStream(indexPath).pipe(res);
    }
  }

  if (pathname === '/targets/training/web-06/api/check' || pathname === '/targets/training/web-06-sqli-blind-boolean/api/check') {
    const rawId = parsedUrl.searchParams.get('id') || '';
    const flagValue = "CYBERLAB{BOOLEAN_BLIND_SQLI_BINARY_SEARCH_WIN}";
    
    // Évaluation booléenne simplifiée pour la simulation
    let isTrue = false;
    const lower = rawId.toLowerCase();

    if (rawId === '1042' || rawId.includes('1042 and 1=1') || rawId.includes('1042 and true')) {
      isTrue = true;
    } else if (rawId.includes('1=2') || rawId.includes('and false') || rawId.includes('1=0')) {
      isTrue = false;
    } else if (lower.includes('substr') || lower.includes('substring')) {
      // Extraction de la condition
      if (lower.includes("'c'") || lower.includes('"c"') || lower.includes("='c'") || lower.includes("= 'c'")) {
        isTrue = true;
      } else {
        isTrue = false;
      }
    } else if (rawId.startsWith('1042')) {
      isTrue = true;
    }

    if (isTrue) {
      return sendJSON(res, 200, {
        status: 'active',
        client_name: 'Privatbank Mandat #1042',
        tier: 'Ultra-High-Net-Worth VIP',
        message: 'Dossier de gestion de fortune certifié conforme.',
        flag: flagValue
      });
    } else {
      return sendJSON(res, 200, {
        status: 'not_found',
        message: 'Aucun compte actif ne correspond à cette référence confidentielle.'
      });
    }
  }

  // --- Cible Challenge 7 : web-07-reflected-xss (Skyline Riviera Luxury Real Estate) ---
  if (pathname === '/targets/training/web-07' || pathname === '/targets/training/web-07/' ||
      pathname === '/targets/training/web-07-reflected-xss' || pathname === '/targets/training/web-07-reflected-xss/') {
    const indexPath = path.join(__dirname, 'challenges', 'web', 'web-07-reflected-xss', 'src', 'index.html');
    if (fs.existsSync(indexPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return fs.createReadStream(indexPath).pipe(res);
    }
  }

  // --- Cible Challenge 8 : web-08-csrf-bank (Novus Pay NeoBank) ---
  if (pathname === '/targets/training/web-08' || pathname === '/targets/training/web-08/' ||
      pathname === '/targets/training/web-08-csrf-bank' || pathname === '/targets/training/web-08-csrf-bank/') {
    const indexPath = path.join(__dirname, 'challenges', 'web', 'web-08-csrf-bank', 'src', 'index.html');
    if (fs.existsSync(indexPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return fs.createReadStream(indexPath).pipe(res);
    }
  }

  if (pathname === '/targets/training/web-08/api/transfer' || pathname === '/targets/training/web-08-csrf-bank/api/transfer') {
    return sendJSON(res, 200, {
      success: true,
      message: 'Virement SEPA instantané de fonds exécuté sans vérification anti-CSRF.',
      flag: 'CYBERLAB{CSRF_SAME_SITE_NONE_TRANSFER_PWNED}'
    });
  }

  // --- Cible Challenge 9 : web-09-path-traversal (AeroCloud Ops Flight Dispatch) ---
  if (pathname === '/targets/training/web-09' || pathname === '/targets/training/web-09/' ||
      pathname === '/targets/training/web-09-path-traversal' || pathname === '/targets/training/web-09-path-traversal/') {
    const indexPath = path.join(__dirname, 'challenges', 'web', 'web-09-path-traversal', 'src', 'index.html');
    if (fs.existsSync(indexPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return fs.createReadStream(indexPath).pipe(res);
    }
  }

  if (pathname === '/targets/training/web-09/api/download' || pathname === '/targets/training/web-09-path-traversal/api/download') {
    const filePath = parsedUrl.searchParams.get('file') || '';
    if (filePath.includes('passwd')) {
      res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end("root:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\naerops:x:1001:1001:AeroCloud Dispatch Operator:/home/aerops:/bin/bash\nFLAG=CYBERLAB{PATH_TRAVERSAL_PASSWD_DOWNLOAD_CONFIRMED}\n");
    }
    if (filePath.includes('flag')) {
      res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end("CYBERLAB{PATH_TRAVERSAL_PASSWD_DOWNLOAD_CONFIRMED}\n");
    }
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end(`[AEROCLOUD CARGO INVOICE]\nFLIGHT=AF9021 (CDG-JFK)\nCARGO_WEIGHT=42,500 KG\nHANDLING_FEE=14,200.00 EUR\nSTATUS=CLEARED\n`);
  }

  // --- Cible Challenge 10 : web-10-upload-bypass (PixelForge 3D Avatar Studio) ---
  if (pathname === '/targets/training/web-10' || pathname === '/targets/training/web-10/' ||
      pathname === '/targets/training/web-10-upload-bypass' || pathname === '/targets/training/web-10-upload-bypass/') {
    const indexPath = path.join(__dirname, 'challenges', 'web', 'web-10-upload-bypass', 'src', 'index.html');
    if (fs.existsSync(indexPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return fs.createReadStream(indexPath).pipe(res);
    }
  }

  if (pathname === '/targets/training/web-10/api/upload' || pathname === '/targets/training/web-10-upload-bypass/api/upload') {
    return sendJSON(res, 200, {
      success: true,
      saved_path: '/var/www/pixelforge/uploads/avatars/shell.php5',
      url: '/targets/training/web-10/uploads/shell.php5',
      execution_output: 'uid=33(www-data) gid=33(www-data) groups=33(www-data)\nLinux pixelforge-srv 6.8.0-31-generic #31-Ubuntu SMP x86_64\nFLAG=CYBERLAB{FILE_UPLOAD_EXTENSION_BYPASS_PHP5_EXECUTED}'
    });
  }

  // --- ROUTEUR GÉNÉRIQUE POUR TOUTES LES AUTRES CIBLES DU LAB (/targets/training/:id/*) ---
  if (pathname.startsWith('/targets/training/')) {
    const sub = pathname.replace('/targets/training/', '');
    const chId = sub.split('/')[0];
    if (chId) {
      // Chercher dans challenges/*/<chId>/src/index.html
      const categories = ['web', 'api', 'osint', 'crypto', 'forensics', 'network', 'linux', 'reverse', 'pwn', 'cloud', 'social', 'blue'];
      for (const cat of categories) {
        const candidate = path.join(__dirname, 'challenges', cat, chId, 'src', 'index.html');
        if (fs.existsSync(candidate)) {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          return fs.createReadStream(candidate).pipe(res);
        }
      }
    }
  }

  // ==========================================================================
  // API AUTO-UPDATE & GITHUB RELEASES (UI/UX PRO MAX & DATA RETENTION)
  // ==========================================================================

  if (pathname === '/api/version' && method === 'GET') {
    const config = updater.getPackageConfig();
    return sendJSON(res, 200, {
      version: config.version,
      owner: config.owner,
      repo: config.repo
    });
  }

  if (pathname === '/api/check-update' && method === 'GET') {
    try {
      const updateInfo = await updater.checkForUpdates();
      return sendJSON(res, 200, updateInfo);
    } catch (err) {
      return sendJSON(res, 200, {
        updateAvailable: false,
        error: err.message,
        offline: true
      });
    }
  }

  if (pathname === '/api/apply-update' && method === 'POST') {
    try {
      const force = req.url.includes('force=true');
      const result = await updater.applyUpdate(force);
      sendJSON(res, 200, result);

      if (result.success && !result.alreadyUpToDate) {
        // Redémarrage automatique du serveur uniquement si de nouveaux fichiers ont été déployés
        setTimeout(() => {
          console.log('[*] Redémarrage automatique du serveur suite à la mise à jour...');
          try {
            if (!process.env.CYBERRANGE_SUPERVISOR) {
              const { spawn } = require('node:child_process');
              const child = spawn(process.execPath, [path.join(__dirname, 'server.js')], {
                detached: true,
                stdio: 'ignore',
                cwd: __dirname
              });
              child.unref();
            }
          } catch (e) {
            console.warn('[!] Erreur respawn autonome :', e.message);
          }
          try { server.close(); } catch (e) {}
          process.exit(42);
        }, 1000);
      }
      return;
    } catch (err) {
      return sendJSON(res, 500, { success: false, error: err.message });
    }
  }

  // ==========================================================================
  // API DUOLINGO : PROGRESSION, STREAKS, VIES & STATS
  // ==========================================================================

  if (pathname === '/api/user-progress' && method === 'GET') {
    try {
      if (db) {
        const row = db.prepare('SELECT * FROM user_state WHERE id = ?').get('current_player');
        if (row) {
          return sendJSON(res, 200, {
            nickname: row.nickname,
            avatar: row.avatar,
            theme: row.theme || 'dark',
            xp: row.xp,
            streak: row.streak,
            max_streak: row.max_streak,
            hearts: row.hearts !== undefined ? row.hearts : 5,
            combo: row.combo || 0,
            gems: row.gems,
            completed_levels: JSON.parse(row.completed_levels || '[]'),
            unlocked_badges: JSON.parse(row.unlocked_badges || '[]')
          });
        }
      }
      return sendJSON(res, 200, {
        nickname: 'Opérateur RedTeam',
        avatar: '🥷',
        theme: 'dark',
        xp: 0,
        streak: 1,
        max_streak: 1,
        hearts: 5,
        combo: 0,
        gems: 100,
        completed_levels: [],
        unlocked_badges: []
      });
    } catch (err) {
      return sendJSON(res, 500, { error: err.message });
    }
  }

  if (pathname === '/api/user-progress' && method === 'POST') {
    try {
      const data = await parseBody(req);
      const nickname = (data.nickname || 'Opérateur RedTeam').trim();
      const avatar = (data.avatar || '🥷').trim();
      const theme = data.theme || 'dark';
      const xp = parseInt(data.xp, 10) || 0;
      const streak = parseInt(data.streak, 10) || 1;
      const maxStreak = parseInt(data.max_streak, 10) || streak;
      const hearts = data.hearts !== undefined ? parseInt(data.hearts, 10) : 5;
      const combo = parseInt(data.combo, 10) || 0;
      const gems = parseInt(data.gems, 10) || 100;
      const completed = JSON.stringify(data.completed_levels || []);
      const badges = JSON.stringify(data.unlocked_badges || []);
      const now = new Date().toISOString();

      if (db) {
        db.prepare(`
          INSERT INTO user_state (id, nickname, avatar, theme, xp, streak, max_streak, hearts, combo, gems, completed_levels, unlocked_badges, updated_at)
          VALUES ('current_player', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            nickname = excluded.nickname,
            avatar = excluded.avatar,
            theme = excluded.theme,
            xp = excluded.xp,
            streak = excluded.streak,
            max_streak = excluded.max_streak,
            hearts = excluded.hearts,
            combo = excluded.combo,
            gems = excluded.gems,
            completed_levels = excluded.completed_levels,
            unlocked_badges = excluded.unlocked_badges,
            updated_at = excluded.updated_at
        `).run(nickname, avatar, theme, xp, streak, maxStreak, hearts, combo, gems, completed, badges, now);
      }

      return sendJSON(res, 200, { success: true });
    } catch (err) {
      return sendJSON(res, 500, { error: err.message });
    }
  }

  if (pathname === '/api/verify-answer' && method === 'POST') {
    try {
      const body = await parseBody(req);
      const levelId = (body.level_id || '').trim();
      const submitted = (body.answer || '').trim();

      const expected = OFFICIAL_FLAGS[levelId];
      let isCorrect = expected && (
        expected.toLowerCase() === submitted.toLowerCase() ||
        submitted.toLowerCase().includes(expected.toLowerCase())
      );
      if (!isCorrect && (levelId === 'm4-mid' || levelId === 'm4-l4')) {
        isCorrect = submitted.includes('CYBER{CLIENT_MID_EVAL_IDOR_SESSION_PWNED}') || submitted.includes('CYBER{IDOR_DIRECT_OBJECT_FINANCIAL_LEAK}');
      }

      if (db) {
        db.prepare('INSERT INTO level_logs (level_id, submitted_answer, is_correct, timestamp) VALUES (?, ?, ?, ?)')
          .run(levelId, submitted, isCorrect ? 1 : 0, new Date().toISOString());
      }

      return sendJSON(res, 200, {
        is_correct: !!isCorrect,
        level_id: levelId
      });
    } catch (err) {
      return sendJSON(res, 500, { error: err.message });
    }
  }

  if (pathname === '/api/reset-profile' && method === 'POST') {
    try {
      if (db) {
        db.prepare('DELETE FROM user_state WHERE id = ?').run('current_player');
        db.prepare('DELETE FROM level_logs').run();
      }
      return sendJSON(res, 200, { success: true, message: 'Profil réinitialisé.' });
    } catch (err) {
      return sendJSON(res, 500, { error: err.message });
    }
  }

  // ==========================================================================
  // CIBLES D'EXPLOITATION RÉELLES SANS ASSISTANCE (API / TARGETS)
  // ==========================================================================

  // --- Endpoint M2-MID : Audit Réseau & Diagnostic d'En-têtes ---
  if (pathname === '/api/network/audit-eval') {
    const scanHeader = req.headers['x-security-scan'];
    const auth = req.headers['authorization'];
    if (scanHeader === 'enabled' || auth) {
      return sendJSON(res, 200, {
        audit: 'AUTHORIZED',
        status: 'SECURITY_PASSED',
        token: OFFICIAL_FLAGS['m2-mid'],
        scope: 'INFRASTRUCTURE_MIDPOINT_CHECKPOINT'
      });
    }
    return sendJSON(res, 403, {
      error: 'Forbidden: Header X-Security-Scan: enabled requis pour valider l\'audit.'
    });
  }

  // --- Cible M1-L2 : Abus Hop-by-Hop & Reverse Proxy Bypass ---
  if (pathname === '/targets/api/internal/telemetry') {
    const connectionHeader = (req.headers['connection'] || '').toLowerCase();
    const forwarded = req.headers['x-forwarded-for'];

    if (connectionHeader.includes('x-forwarded-for') || forwarded === '127.0.0.1') {
      return sendJSON(res, 200, {
        status: 'authorized',
        node: 'TELEMETRY_CORE_GATEWAY',
        gateway_version: 'RFC9112-compliant v2.4',
        data: {
          uptime: '42 days',
          active_workers: 12,
          master_flag: OFFICIAL_FLAGS['m1-l2']
        }
      });
    } else {
      return sendJSON(res, 403, {
        error: 'Forbidden: Accès restreint au sous-réseau interne (127.0.0.1).',
        client_ip: req.socket.remoteAddress,
        headers_received: req.headers
      });
    }
  }

  // --- Cible M3-L1 : CRM Aegis (Vraie SQLi UNION sur base SQLite) ---
  if (pathname === '/targets/api/crm/search') {
    const q = parsedUrl.searchParams.get('q') || '';
    if (!q) {
      return sendJSON(res, 200, { results: [] });
    }

    try {
      const rawSql = `SELECT id, company, contact_name, contract_value, iban, confidential_memo FROM crm_customers WHERE company LIKE '%${q}%' OR contact_name LIKE '%${q}%'`;
      if (db) {
        const rows = db.prepare(rawSql).all();
        return sendJSON(res, 200, { results: rows, executed_query_dbg: false });
      }
      return sendJSON(res, 200, { results: [] });
    } catch (e) {
      return sendJSON(res, 500, {
        error: 'Database Query Error: ' + e.message,
        hint: 'SQLite syntax check failed'
      });
    }
  }

  // --- Cible M5 : Outil Diagnostic Ping (Command Injection) ---
  if (pathname === '/targets/api/network/diagnostics' && method === 'POST') {
    try {
      const data = await parseBody(req);
      const targetHost = (data.host || '').trim();

      if (targetHost.includes('whoami')) {
        return sendJSON(res, 200, {
          output: `PING 127.0.0.1 (127.0.0.1) 56(84) bytes of data.\n64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.03 ms\nwww-data\n`
        });
      }

      if (targetHost.includes('/dev/tcp')) {
        return sendJSON(res, 200, {
          output: `[+] Connected to /dev/tcp listener\n[+] Beacon captured: CYBER{RAW_SOCKET_BEACON_CAPTURED}\n`
        });
      }

      if (targetHost.includes('$IFS') || targetHost.includes('${IFS}') || targetHost.includes('cat') || targetHost.includes('passwd')) {
        return sendJSON(res, 200, {
          output: `PING 127.0.0.1 (127.0.0.1) 56(84) bytes of data.\n64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.042 ms\nroot:x:0:0:root:/root:/bin/bash\noperator:x:1001:1001:SecOps Operator:/home/operator:/bin/bash\nFLAG_SYS: CYBER{COMMAND_INJECTION_IFS_WILDCARD_BYPASS}\nCHECKPOINT_FLAG: CYBER{SERVER_MID_EVAL_COMMAND_CHAIN_PWNED}\n`
        });
      }

      if (targetHost.includes(' ') && !targetHost.includes('$IFS')) {
        return sendJSON(res, 400, {
          error: 'WAF Security Alert: Caractère interdit détecté ([ESPACE]). Filtre anti-RCE actif.'
        });
      }

      return sendJSON(res, 200, {
        output: `PING ${targetHost} 56(84) bytes of data.\n64 bytes from ${targetHost}: icmp_seq=1 ttl=64 time=1.23 ms\n--- ${targetHost} ping statistics ---\n1 packets transmitted, 1 received, 0% packet loss.`
      });
    } catch (e) {
      return sendJSON(res, 500, { error: e.message });
    }
  }

  // --- Cible M3-L3 : Visualiseur de Documents (LFI) ---
  if (pathname === '/targets/api/documents/read') {
    const file = parsedUrl.searchParams.get('file') || '';
    if (!file) {
      return sendJSON(res, 400, { error: 'Paramètre file manquant.' });
    }

    if (file.includes('php://filter') || file.includes('..') || file.includes('secret') || file.includes('.env')) {
      const encodedPayload = Buffer.from(`APP_ENV=production\nDATABASE_URL=sqlite:///var/db/aegis.db\nMASTER_ENCRYPTION_KEY=${OFFICIAL_FLAGS['m3-l3']}\n`).toString('base64');
      return sendJSON(res, 200, {
        filename: file,
        encoding: 'base64',
        content: encodedPayload
      });
    }

    return sendJSON(res, 200, {
      filename: file,
      content: 'Documentation standard : Notice technique de conformité ISO 27001.'
    });
  }

  // --- Cible M3-L4 : Aperçu d'URL (SSRF) ---
  if (pathname === '/targets/api/preview' && method === 'POST') {
    try {
      const data = await parseBody(req);
      const url = (data.url || '').trim();

      if (url.includes('localhost') || url.includes('127.0.0.1')) {
        return sendJSON(res, 403, { error: 'Security Policy: Les requêtes vers localhost sont interdites.' });
      }

      if (url.includes('169.254.169.254') || url.includes('0x7f000001') || url.includes('2130706433') || url.includes('017700000001')) {
        return sendJSON(res, 200, {
          title: 'Instance Metadata Service (IMDSv1)',
          http_status: 200,
          content: `{\n  "Code": "Success",\n  "LastUpdated": "2026-10-27T08:00:00Z",\n  "Type": "AWS-HMAC",\n  "AccessKeyId": "ASIAQEXAMPLEREDTEAM",\n  "SecretAccessKey": "${OFFICIAL_FLAGS['m3-l4']}",\n  "Token": "IQoJb3JpZ2luX2VjEJr..."\n}`
        });
      }

      return sendJSON(res, 200, {
        title: 'Preview Externe',
        http_status: 200,
        content: 'Simulation du scraper web : contenu externe public récupéré avec succès.'
      });
    } catch (e) {
      return sendJSON(res, 500, { error: e.message });
    }
  }

  // --- Cible M4-L2 : Validation JWT avec faille "alg: none" ---
  if (pathname === '/targets/api/v2/auth-check' && method === 'POST') {
    try {
      const authHeader = req.headers['authorization'] || '';
      if (!authHeader.startsWith('Bearer ')) {
        return sendJSON(res, 401, { error: 'Token manquant dans Authorization header' });
      }

      const token = authHeader.replace('Bearer ', '').trim();
      const parts = token.split('.');
      if (parts.length < 2) {
        return sendJSON(res, 400, { error: 'Format JWT invalide' });
      }

      const headerRaw = Buffer.from(parts[0], 'base64').toString('utf-8');
      const payloadRaw = Buffer.from(parts[1], 'base64').toString('utf-8');

      const header = JSON.parse(headerRaw);
      const payload = JSON.parse(payloadRaw);

      if ((header.alg || '').toLowerCase() === 'none') {
        if (payload.role === 'admin' || payload.role === 'secops_admin' || payload.admin === true) {
          return sendJSON(res, 200, {
            status: 'authenticated',
            role: payload.role || 'admin',
            message: 'Privilèges élevés accordés avec succès.',
            secret_flag: OFFICIAL_FLAGS['m4-l10'] || 'CYBER{JWT_ALG_NONE_SIGNATURE_BYPASS_SUCCESS}'
          });
        }
      }

      return sendJSON(res, 403, {
        status: 'denied',
        error: 'Rôle non autorisé pour accéder aux données sensibles SecOps.',
        current_role: payload.role || 'guest'
      });
    } catch (e) {
      return sendJSON(res, 500, { error: 'Erreur traitement token : ' + e.message });
    }
  }

  // --- Cible M4-L3 : Facturation IDOR ---
  if (pathname === '/targets/api/invoices') {
    const id = parsedUrl.searchParams.get('id');
    if (!id) {
      return sendJSON(res, 400, { error: 'Paramètre id manquant' });
    }

    if (id === '1' || id === '001') {
      return sendJSON(res, 200, {
        invoice_id: 'INV-2026-001',
        client: 'Conseil de Surveillance & Présidence Aegis',
        amount: '12,500,000.00 EUR',
        clearing_code: OFFICIAL_FLAGS['m4-mid'],
        financial_code: OFFICIAL_FLAGS['m4-l4'] || 'CYBER{IDOR_DIRECT_OBJECT_FINANCIAL_LEAK}',
        confidentiality: 'SECRET DEFENSE / RESTREINT'
      });
    }

    return sendJSON(res, 200, {
      invoice_id: 'INV-2026-' + id,
      client: 'Fournisseur Maintenance Informatique Standard',
      amount: '450.00 EUR',
      clearing_code: 'REGULAR_TRANS_092',
      confidentiality: 'PUBLIC'
    });
  }

  // ==========================================================================
  // SERVEUR DE FICHIERS STATIQUES (/public)
  // ==========================================================================

  let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);

  const safePath = path.resolve(filePath);
  if (!safePath.startsWith(path.resolve(PUBLIC_DIR))) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('403 Forbidden');
  }

  fs.stat(safePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(`
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <title>404 - Ressource Introuvable | CyberRange</title>
          <style>
            body { background: #070a12; color: #f43f5e; font-family: monospace; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
            .box { background: #0f172a; padding: 30px; border-radius: 16px; border: 2px solid #e11d48; text-align: center; max-width: 500px; }
            a { color: #38bdf8; text-decoration: none; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="box">
            <h2>[404 NOT FOUND]</h2>
            <p>La ressource demandée <code>${pathname}</code> n'existe pas sur le serveur.</p>
            <p><a href="/">← Retour au QG CyberRange</a></p>
          </div>
        </body>
        </html>
      `);
    }

    const ext = path.extname(safePath).toLowerCase();
    const mimeTypes = {
      '.html': 'text/html; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.js': 'application/javascript; charset=utf-8',
      '.json': 'application/json; charset=utf-8',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon'
    };

    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });

    const stream = fs.createReadStream(safePath);
    stream.pipe(res);
  });
});

let retryCount = 0;
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    retryCount++;
    console.warn(`[!] Port ${PORT} temporairement occupé (TIME_WAIT). Tentative ${retryCount}/5 dans 1s...`);
    if (retryCount <= 5) {
      setTimeout(() => {
        try { server.close(); } catch (e) {}
        server.listen(PORT, '127.0.0.1');
      }, 1000);
    } else {
      console.error(`[FATAL] Impossible d'ouvrir le port ${PORT} après 5 tentatives.`);
      process.exit(1);
    }
  } else {
    console.error('[!] Erreur serveur HTTP :', err);
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`=================================================================`);
  console.log(`🚀 [CYBERRANGE PRO] Serveur opérationnel sur http://127.0.0.1:${PORT}`);
  console.log(`🛡️  5 Modules d'élite, 5 Boss Fights, Cibles réelles prêtes.`);
  console.log(`=================================================================`);
});

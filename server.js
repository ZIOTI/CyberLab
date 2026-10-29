// ============================================================================
// CyberRange PRO - Serveur d'Entraînement Offensif Local & Autonome
// Moteur Node.js natif + node:sqlite (Zéro dépendance npm externe)
// ============================================================================

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');
const updater = require('./updater');

const PORT = process.env.PORT || 3333;
const DB_PATH = path.join(__dirname, 'cyberrange.db');
const PUBLIC_DIR = path.join(__dirname, 'public');

// Initialisation de la base SQLite locale
let db;
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
  `);

  console.log('[DATABASE] SQLite initialisée avec succès (Mode Offensif Pro).');
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
      const result = await updater.applyUpdate();
      sendJSON(res, 200, result);
      // Redémarrage automatique du serveur après 1.5s (code 42 capturé par start.bat)
      setTimeout(() => {
        console.log('[*] Redémarrage automatique du serveur suite à la mise à jour...');
        process.exit(42);
      }, 1500);
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

server.listen(PORT, () => {
  console.log(`=================================================================`);
  console.log(`🚀 [CYBERRANGE PRO] Serveur opérationnel sur http://localhost:${PORT}`);
  console.log(`🛡️  5 Modules d'élite, 5 Boss Fights, Cibles réelles prêtes.`);
  console.log(`=================================================================`);
});

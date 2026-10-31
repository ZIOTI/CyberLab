// ============================================================================
// CYBERLAB TRAINING PLATFORM - TRAINING MANAGER & ORCHESTRATION ENGINE
// Architecture Haute Fidélité : Gestion des Labs, Instances Docker & Fallback,
// Progression TryHackMe, Flags Dynamiques HMAC et Sécurité Locale.
// ============================================================================

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { exec } = require('node:child_process');

const CHALLENGES_ROOT = path.join(__dirname, '..', 'challenges');
const HMAC_SECRET = 'CYBERLAB_SUPER_SECRET_SALT_2026_REDTEAM';

class TrainingManager {
  constructor(db) {
    this.db = db;
    this.instances = new Map(); // Empreinte mémoire des instances actives
    this.initTables();
    this.startGarbageCollector();
  }

  // 1. Initialisation des Tables SQLite pour la Zone Entraînement
  initTables() {
    if (!this.db) return;

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS training_challenges (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        difficulty TEXT NOT NULL,
        points INTEGER NOT NULL,
        duration_min INTEGER DEFAULT 45,
        learning_path TEXT,
        author TEXT DEFAULT 'CyberLab RedOps',
        tags TEXT DEFAULT '[]',
        prerequisites TEXT DEFAULT '[]',
        recommended_tools TEXT DEFAULT '[]',
        narrative_story TEXT,
        tasks_json TEXT NOT NULL,
        hints_json TEXT DEFAULT '[]',
        writeup_markdown TEXT,
        target_port INTEGER,
        virtual_ip TEXT,
        target_os TEXT DEFAULT 'Linux',
        machine_type TEXT DEFAULT 'room',
        organization TEXT DEFAULT 'CyberLab Target',
        cve TEXT,
        rating REAL DEFAULT 4.9,
        solves INTEGER DEFAULT 1200,
        monogram TEXT,
        created_at TEXT
      );

      CREATE TABLE IF NOT EXISTS training_learning_paths (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        icon TEXT NOT NULL,
        difficulty TEXT NOT NULL,
        challenge_ids TEXT DEFAULT '[]',
        badge_reward TEXT
      );

      CREATE TABLE IF NOT EXISTS training_user_progress (
        challenge_id TEXT PRIMARY KEY,
        status TEXT DEFAULT 'not_started',
        tasks_completed TEXT DEFAULT '[]',
        unlocked_hints TEXT DEFAULT '[]',
        writeup_unlocked INTEGER DEFAULT 0,
        attempts_count INTEGER DEFAULT 0,
        points_earned INTEGER DEFAULT 0,
        solved_at TEXT,
        updated_at TEXT
      );

      CREATE TABLE IF NOT EXISTS training_instances (
        id TEXT PRIMARY KEY,
        challenge_id TEXT NOT NULL,
        container_id TEXT,
        virtual_ip TEXT,
        assigned_port INTEGER,
        started_at TEXT,
        expires_at TEXT,
        status TEXT DEFAULT 'running'
      );

      CREATE TABLE IF NOT EXISTS training_submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        challenge_id TEXT NOT NULL,
        task_id TEXT,
        submitted_flag TEXT NOT NULL,
        is_correct INTEGER NOT NULL,
        ip_address TEXT,
        timestamp TEXT
      );
    `);

    // Migration transparente des colonnes pour bases existantes
    const extraCols = [
      'target_os TEXT DEFAULT "Linux"',
      'machine_type TEXT DEFAULT "room"',
      'organization TEXT DEFAULT "CyberLab Target"',
      'cve TEXT',
      'rating REAL DEFAULT 4.9',
      'solves INTEGER DEFAULT 1200',
      'monogram TEXT'
    ];
    for (const col of extraCols) {
      try {
        this.db.exec(`ALTER TABLE training_challenges ADD COLUMN ${col};`);
      } catch (e) {}
    }

    // Synchronisation automatique des challenges sur disque vers la base
    this.syncChallengesFromDisk();
    this.seedLearningPaths();
  }

  // 2. Génération de Flag Dynamique unique par joueur (Anti-Triche)
  generateDynamicFlag(challengeId, canonicalFlag, playerNickname = 'Opérateur RedTeam') {
    if (!canonicalFlag) return 'CYBERLAB{DEFAULT_FLAG}';
    
    // Si le flag est déjà au format CYBERLAB{...}, on dérive une signature unique
    const cleanNick = (playerNickname || 'Player').toLowerCase().trim();
    const hash = crypto.createHmac('sha256', HMAC_SECRET)
      .update(`${challengeId}:${cleanNick}`)
      .digest('hex')
      .slice(0, 8);

    // Extraction du préfixe signifiant
    const match = canonicalFlag.match(/^([A-Z0-9_]+)\{([\s\S]+)\}$/);
    if (match) {
      const prefix = match[1];
      const body = match[2];
      return `${prefix}{${body}_${hash}}`;
    }
    return `CYBERLAB{${canonicalFlag}_${hash}}`;
  }

  // 3. Synchronisation de tous les challenges définis dans /challenges vers SQLite
  syncChallengesFromDisk() {
    if (!fs.existsSync(CHALLENGES_ROOT)) return;

    const categories = fs.readdirSync(CHALLENGES_ROOT, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name);

    for (const cat of categories) {
      const catDir = path.join(CHALLENGES_ROOT, cat);
      const challengeDirs = fs.readdirSync(catDir, { withFileTypes: true })
        .filter(d => d.isDirectory())
        .map(d => d.name);

      for (const chId of challengeDirs) {
        const chPath = path.join(catDir, chId);
        const metaPath = path.join(chPath, 'meta.json');
        const tasksPath = path.join(chPath, 'tasks.json');
        const hintsPath = path.join(chPath, 'hints.json');
        const writeupPath = path.join(chPath, 'writeup.md');

        if (!fs.existsSync(metaPath)) continue;

        try {
          const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
          const tasks = fs.existsSync(tasksPath) ? JSON.parse(fs.readFileSync(tasksPath, 'utf8')) : [];
          const hints = fs.existsSync(hintsPath) ? JSON.parse(fs.readFileSync(hintsPath, 'utf8')) : [];
          const writeup = fs.existsSync(writeupPath) ? fs.readFileSync(writeupPath, 'utf8') : 'Writeup en cours de rédaction.';

          const stmt = this.db.prepare(`
            INSERT INTO training_challenges (
              id, title, category, difficulty, points, duration_min, learning_path, author,
              tags, prerequisites, recommended_tools, narrative_story, tasks_json, hints_json,
              writeup_markdown, target_port, virtual_ip, target_os, machine_type, organization, cve, rating, solves, monogram, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
              title = excluded.title,
              category = excluded.category,
              difficulty = excluded.difficulty,
              points = excluded.points,
              duration_min = excluded.duration_min,
              learning_path = excluded.learning_path,
              author = excluded.author,
              tags = excluded.tags,
              prerequisites = excluded.prerequisites,
              recommended_tools = excluded.recommended_tools,
              narrative_story = excluded.narrative_story,
              tasks_json = excluded.tasks_json,
              hints_json = excluded.hints_json,
              writeup_markdown = excluded.writeup_markdown,
              target_port = excluded.target_port,
              virtual_ip = excluded.virtual_ip,
              target_os = excluded.target_os,
              machine_type = excluded.machine_type,
              organization = excluded.organization,
              cve = excluded.cve,
              rating = excluded.rating,
              solves = excluded.solves,
              monogram = excluded.monogram
          `);

          stmt.run(
            meta.id || chId,
            meta.title || chId,
            meta.category || cat,
            meta.difficulty || 'beginner',
            meta.points || 100,
            meta.duration_min || 45,
            meta.learning_path || null,
            meta.author || 'CyberLab RedOps',
            JSON.stringify(meta.tags || []),
            JSON.stringify(meta.prerequisites || []),
            JSON.stringify(meta.recommended_tools || []),
            meta.narrative_story || '',
            JSON.stringify(tasks),
            JSON.stringify(hints),
            writeup,
            meta.target_port || 80,
            meta.virtual_ip || '10.10.10.10',
            meta.target_os || 'Linux',
            meta.machine_type || 'room',
            meta.organization || 'CyberLab Target',
            meta.cve || null,
            meta.rating || 4.9,
            meta.solves || 1200,
            meta.monogram || (meta.id || chId).substring(0, 4).toUpperCase(),
            new Date().toISOString()
          );
        } catch (e) {
          console.warn(`[TRAINING] Erreur chargement challenge ${chId}:`, e.message);
        }
      }
    }
  }

  // 4. Seeding des Learning Paths (Parcours d'Apprentissage TryHackMe)
  seedLearningPaths() {
    const paths = [
      {
        id: 'web-beginner',
        title: 'Fondations Web Pentesting',
        description: 'Apprends à explorer les vulnérabilités du Web moderne : SQLi, XSS, wrappers LFI et contournements d\'auth.',
        icon: 'globe',
        difficulty: 'beginner',
        challenge_ids: ['web-01-robots', 'web-02-sqli-login', 'web-03-sqli-union', 'web-04-stored-xss', 'web-05-lfi-wrapper'],
        badge_reward: 'Web Novice Investigator'
      },
      {
        id: 'soc-forensics',
        title: 'Analyste SOC & Investigations Numériques',
        description: 'Maîtrise la détection d\'intrusions, l\'analyse de captures de trafic réseau et la reconstruction d\'artefacts corrompus.',
        icon: 'shield',
        difficulty: 'easy',
        challenge_ids: ['net-01-wireshark-ftp', 'forensics-01-magic-bytes', 'forensics-02-pcap-http', 'blue-01-auth-log-brute'],
        badge_reward: 'Blue Sentinel Specialist'
      },
      {
        id: 'crypto-osint-core',
        title: 'Cryptanalyse & Renseignement Ouvert (OSINT)',
        description: 'Passe au crible les traces numériques, métadonnées géographiques et chiffrements historiques ou cassés.',
        icon: 'search',
        difficulty: 'beginner',
        challenge_ids: ['osint-01-exif-trace', 'crypto-01-rot-vault', 'crypto-02-xor-cracker', 'phish-01-ceo-fraud'],
        badge_reward: 'Shadow Intelligence Agent'
      },
      {
        id: 'systems-reversing',
        title: 'Systèmes Linux & Rétro-Ingénierie Binaire',
        description: 'Exploite les configurations imprudentes de privilèges et dissèque la logique interne des exécutables.',
        icon: 'terminal',
        difficulty: 'easy',
        challenge_ids: ['linux-01-suid-bash', 'rev-01-js-packer', 'linux-02-cron-wildcard', 'api-01-bola-profile'],
        badge_reward: 'Binary Navigator Pro'
      },
      {
        id: 'pwn-binary',
        title: 'Exploitation Binaire & Pwn d\'Élite',
        description: 'Maîtrise les dépassements de tampon, ret2libc, ROP chains x64 et la corruption de tas (Heap UAF/Fastbins).',
        icon: 'cpu',
        difficulty: 'hard',
        challenge_ids: ['pwn-01-bof-stack-simple', 'pwn-02-ret2libc-x86', 'pwn-03-format-string', 'pwn-04-rop-x64-execve', 'pwn-05-heap-uaf'],
        badge_reward: 'Binary Exploit Architect'
      },
      {
        id: 'ad-enterprise',
        title: 'Attaque d\'Active Directory & Mouvement Latéral',
        description: 'Infiltre des domaines Windows : AS-REP Roasting, Kerberoasting, DCSync, abus de GPO et élévation de privilèges.',
        icon: 'server',
        difficulty: 'intermediate',
        challenge_ids: ['win-01-ad-asrep', 'win-02-ad-kerberoast', 'win-03-ad-dcsync', 'win-04-unquoted-service-path', 'win-05-ad-gpo-abuse'],
        badge_reward: 'Domain Master Operator'
      },
      {
        id: 'cloud-container',
        title: 'Sécurité Cloud, Conteneurs & Évasion',
        description: 'Explore les buckets S3/GCS fuyants, évasions de socket Docker, élévations RBAC Kubernetes et rôles IAM cross-account.',
        icon: 'layers',
        difficulty: 'hard',
        challenge_ids: ['cloud-01-s3-open-bucket', 'cloud-02-git-history-leak', 'cloud-03-docker-socket-escape', 'cloud-04-k8s-service-account', 'cloud-05-aws-iam-role-assumption'],
        badge_reward: 'Cloud Defense Specialist'
      },
      {
        id: 'master-boot2root',
        title: 'Certification Master Boot2Root // Insane',
        description: 'Scénarios multi-machines complets en chaîne de compromission : DMZ, pivoting, privesc Linux/Windows et Vault.',
        icon: 'target',
        difficulty: 'insane',
        challenge_ids: ['b2r-01-enterprise-alpha', 'b2r-02-shadow-corp-dmz', 'b2r-03-the-master-vault', 'linux-07-kernel-dirty-pipe', 'web-25-java-spring4shell'],
        badge_reward: 'CyberRange Master Cert 2026'
      }
    ];

    const stmt = this.db.prepare(`
      INSERT INTO training_learning_paths (id, title, description, icon, difficulty, challenge_ids, badge_reward)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        title = excluded.title,
        description = excluded.description,
        icon = excluded.icon,
        difficulty = excluded.difficulty,
        challenge_ids = excluded.challenge_ids,
        badge_reward = excluded.badge_reward
    `);

    for (const p of paths) {
      stmt.run(p.id, p.title, p.description, p.icon, p.difficulty, JSON.stringify(p.challenge_ids), p.badge_reward);
    }
  }

  // 5. Récupération du catalogue avec filtres & statut joueur
  getCatalog(filters = {}) {
    let sql = 'SELECT * FROM training_challenges WHERE 1=1';
    const params = [];

    if (filters.category && filters.category !== 'all') {
      sql += ' AND category = ?';
      params.push(filters.category);
    }

    if (filters.difficulty && filters.difficulty !== 'all') {
      sql += ' AND difficulty = ?';
      params.push(filters.difficulty);
    }

    if (filters.learning_path && filters.learning_path !== 'all') {
      sql += ' AND learning_path = ?';
      params.push(filters.learning_path);
    }

    if (filters.search) {
      sql += ' AND (title LIKE ? OR tags LIKE ? OR narrative_story LIKE ?)';
      const term = `%${filters.search.trim()}%`;
      params.push(term, term, term);
    }

    sql += ' ORDER BY points ASC, id ASC';

    const rows = this.db.prepare(sql).all(...params);

    // Injection de la progression du joueur pour chaque challenge
    const progressList = this.db.prepare('SELECT * FROM training_user_progress').all();
    const progressMap = new Map();
    progressList.forEach(p => progressMap.set(p.challenge_id, p));

    return rows.map(r => {
      const prog = progressMap.get(r.id) || { status: 'not_started', tasks_completed: '[]', points_earned: 0 };
      const tasks = JSON.parse(r.tasks_json || '[]');
      const completedTasks = JSON.parse(prog.tasks_completed || '[]');

      return {
        id: r.id,
        title: r.title,
        category: r.category,
        difficulty: r.difficulty,
        points: r.points,
        duration_min: r.duration_min,
        learning_path: r.learning_path,
        author: r.author,
        tags: JSON.parse(r.tags || '[]'),
        recommended_tools: JSON.parse(r.recommended_tools || '[]'),
        task_count: tasks.length,
        completed_task_count: completedTasks.length,
        status: prog.status,
        points_earned: prog.points_earned || 0,
        target_os: r.target_os || 'Linux',
        machine_type: r.machine_type || 'room',
        organization: r.organization || 'CyberLab Target',
        cve: r.cve || null,
        rating: r.rating || 4.9,
        solves: r.solves || 1200,
        monogram: r.monogram || r.id.substring(0, 4).toUpperCase()
      };
    });
  }

  // 6. Récupération des détails complets d'un challenge pour la vue Room
  getChallengeRoom(challengeId, playerNickname = 'Opérateur RedTeam') {
    const ch = this.db.prepare('SELECT * FROM training_challenges WHERE id = ?').get(challengeId);
    if (!ch) return null;

    const prog = this.db.prepare('SELECT * FROM training_user_progress WHERE challenge_id = ?').get(challengeId) || {
      status: 'not_started',
      tasks_completed: '[]',
      unlocked_hints: '[]',
      writeup_unlocked: 0,
      points_earned: 0
    };

    const tasks = JSON.parse(ch.tasks_json || '[]');
    const hints = JSON.parse(ch.hints_json || '[]');
    const completedTasks = new Set(JSON.parse(prog.tasks_completed || '[]'));
    const unlockedHints = new Set(JSON.parse(prog.unlocked_hints || '[]'));

    // Sécurisation des flags : on ne renvoie JAMAIS les flags bruts au client
    const safeTasks = tasks.map(t => ({
      id: t.id,
      title: t.title,
      description: t.description,
      points: t.points || 0,
      is_completed: completedTasks.has(t.id),
      requires_flag: !!t.flag || !!t.canonical_flag,
      task_type: t.task_type || 'flag'
    }));

    // Masquage du texte des indices non débloqués
    const safeHints = hints.map((h, idx) => ({
      index: idx,
      title: h.title || `Indice n°${idx + 1}`,
      cost: h.cost || 10,
      is_unlocked: unlockedHints.has(idx),
      content: unlockedHints.has(idx) ? h.content : null
    }));

    // Vérification d'une instance active pour ce challenge
    const instance = this.getInstance(challengeId);

    // Détection des fichiers téléchargeables dans challenges/*/:challengeId/files
    let downloadableFiles = [];
    try {
      const categories = fs.readdirSync(CHALLENGES_ROOT);
      for (const cat of categories) {
        const filesPath = path.join(CHALLENGES_ROOT, cat, ch.id, 'files');
        if (fs.existsSync(filesPath)) {
          const files = fs.readdirSync(filesPath);
          downloadableFiles = files.map(f => {
            const stat = fs.statSync(path.join(filesPath, f));
            const sizeKb = Math.round(stat.size / 1024);
            return {
              name: f,
              url: `/targets/training/download/${cat}/${ch.id}/${f}`,
              size: sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} Mo` : `${sizeKb || 1} Ko`
            };
          });
          break;
        }
      }
    } catch (_) {}

    return {
      id: ch.id,
      title: ch.title,
      category: ch.category,
      difficulty: ch.difficulty,
      points: ch.points,
      duration_min: ch.duration_min,
      learning_path: ch.learning_path,
      author: ch.author,
      tags: JSON.parse(ch.tags || '[]'),
      prerequisites: JSON.parse(ch.prerequisites || '[]'),
      recommended_tools: JSON.parse(ch.recommended_tools || '[]'),
      narrative_story: ch.narrative_story,
      tasks: safeTasks,
      hints: safeHints,
      downloadable_files: downloadableFiles,
      writeup_unlocked: prog.writeup_unlocked === 1,
      status: prog.status,
      points_earned: prog.points_earned || 0,
      instance: instance,
      target_os: ch.target_os || 'Linux',
      machine_type: ch.machine_type || 'room',
      organization: ch.organization || 'CyberLab Target',
      cve: ch.cve || null,
      rating: ch.rating || 4.9,
      solves: ch.solves || 1200,
      monogram: ch.monogram || ch.id.substring(0, 4).toUpperCase()
    };
  }

  // 7. Cycle de vie des machines de challenge (Start, Stop, Renew)
  startInstance(challengeId) {
    const ch = this.db.prepare('SELECT * FROM training_challenges WHERE id = ?').get(challengeId);
    if (!ch) throw new Error('Challenge introuvable.');

    // Si une instance existe déjà et n'est pas expirée, on la réutilise
    const existing = this.getInstance(challengeId);
    if (existing && existing.status === 'running') {
      return existing;
    }

    const instanceId = 'inst_' + crypto.randomBytes(6).toString('hex');
    const now = Date.now();
    const expiresAt = new Date(now + 60 * 60 * 1000).toISOString(); // 60 minutes
    const startedAt = new Date(now).toISOString();

    // Assignation d'une IP interne réaliste dans le sous-réseau du lab (10.10.X.Y)
    const octet3 = 10 + Math.floor(Math.random() * 50);
    const octet4 = 2 + Math.floor(Math.random() * 250);
    const virtualIp = `10.10.${octet3}.${octet4}`;

    // Port d'accès local sur la machine hôte
    const assignedPort = ch.target_port || (4000 + Math.floor(Math.random() * 2000));

    const instanceData = {
      id: instanceId,
      challenge_id: challengeId,
      container_id: 'container_' + instanceId,
      virtual_ip: virtualIp,
      assigned_port: assignedPort,
      started_at: startedAt,
      expires_at: expiresAt,
      status: 'running'
    };

    // Sauvegarde en base et cache mémoire
    this.db.prepare(`
      INSERT INTO training_instances (id, challenge_id, container_id, virtual_ip, assigned_port, started_at, expires_at, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        virtual_ip = excluded.virtual_ip,
        assigned_port = excluded.assigned_port,
        expires_at = excluded.expires_at,
        status = excluded.status
    `).run(instanceId, challengeId, instanceData.container_id, virtualIp, assignedPort, startedAt, expiresAt, 'running');

    this.instances.set(challengeId, instanceData);
    return this.getInstance(challengeId);
  }

  stopInstance(challengeId) {
    this.db.prepare('UPDATE training_instances SET status = ? WHERE challenge_id = ?').run('stopped', challengeId);
    this.instances.delete(challengeId);
    return { success: true, message: 'Machine arrêtée avec succès.' };
  }

  renewInstance(challengeId) {
    const inst = this.getInstance(challengeId);
    if (!inst || inst.status !== 'running') {
      throw new Error('Aucune machine en cours d\'exécution pour ce challenge.');
    }

    const currentExpire = new Date(inst.expires_at).getTime();
    const newExpire = new Date(Math.min(Date.now() + 2 * 60 * 60 * 1000, currentExpire + 15 * 60 * 1000)).toISOString();

    this.db.prepare('UPDATE training_instances SET expires_at = ? WHERE challenge_id = ?').run(newExpire, challengeId);
    inst.expires_at = newExpire;
    this.instances.set(challengeId, inst);

    return this.getInstance(challengeId);
  }

  getInstance(challengeId) {
    const row = this.db.prepare('SELECT * FROM training_instances WHERE challenge_id = ? AND status = ? ORDER BY started_at DESC LIMIT 1').get(challengeId, 'running');
    if (!row) return null;

    const expiresTime = new Date(row.expires_at).getTime();
    const remainingSeconds = Math.max(0, Math.floor((expiresTime - Date.now()) / 1000));

    if (remainingSeconds <= 0) {
      this.stopInstance(challengeId);
      return null;
    }

    return {
      id: row.id,
      challenge_id: row.challenge_id,
      virtual_ip: row.virtual_ip,
      assigned_port: row.assigned_port,
      started_at: row.started_at,
      expires_at: row.expires_at,
      remaining_seconds: remainingSeconds,
      status: 'running'
    };
  }

  // 8. Soumission et validation de flag (avec support canonique et dynamique)
  submitFlag(challengeId, taskId, submittedFlag, playerNickname = 'Opérateur RedTeam', ipAddress = '127.0.0.1') {
    const ch = this.db.prepare('SELECT * FROM training_challenges WHERE id = ?').get(challengeId);
    if (!ch) throw new Error('Challenge introuvable.');

    const tasks = JSON.parse(ch.tasks_json || '[]');
    const task = tasks.find(t => t.id === taskId);
    if (!task) throw new Error('Tâche introuvable.');

    const cleanSubmitted = (submittedFlag || '').trim();
    const canonicalFlag = (task.flag || task.canonical_flag || '').trim();
    const dynamicFlag = this.generateDynamicFlag(challengeId, canonicalFlag, playerNickname);

    // Vérification de validité (support du flag canonique ou du flag dynamique de joueur)
    const isCorrect = canonicalFlag && (
      cleanSubmitted === canonicalFlag ||
      cleanSubmitted === dynamicFlag ||
      cleanSubmitted.toLowerCase() === canonicalFlag.toLowerCase() ||
      cleanSubmitted.toLowerCase() === dynamicFlag.toLowerCase()
    );

    // Journalisation de la soumission
    this.db.prepare(`
      INSERT INTO training_submissions (challenge_id, task_id, submitted_flag, is_correct, ip_address, timestamp)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(challengeId, taskId, cleanSubmitted, isCorrect ? 1 : 0, ipAddress, new Date().toISOString());

    // Récupération de la progression actuelle
    let prog = this.db.prepare('SELECT * FROM training_user_progress WHERE challenge_id = ?').get(challengeId);
    if (!prog) {
      prog = {
        challenge_id: challengeId,
        status: 'in_progress',
        tasks_completed: '[]',
        unlocked_hints: '[]',
        writeup_unlocked: 0,
        attempts_count: 0,
        points_earned: 0,
        solved_at: null,
        updated_at: new Date().toISOString()
      };
    }

    const completedTasks = new Set(JSON.parse(prog.tasks_completed || '[]'));
    let pointsAwarded = 0;
    let challengeNewlySolved = false;

    if (isCorrect) {
      if (!completedTasks.has(taskId)) {
        completedTasks.add(taskId);
        pointsAwarded = task.points || Math.round(ch.points / tasks.length);
      }

      const allSolved = tasks.every(t => completedTasks.has(t.id));
      const status = allSolved ? 'solved' : 'in_progress';
      const solvedAt = allSolved && !prog.solved_at ? new Date().toISOString() : prog.solved_at;

      if (allSolved && prog.status !== 'solved') {
        challengeNewlySolved = true;
      }

      const newPointsEarned = (prog.points_earned || 0) + pointsAwarded;

      this.db.prepare(`
        INSERT INTO training_user_progress (challenge_id, status, tasks_completed, unlocked_hints, writeup_unlocked, attempts_count, points_earned, solved_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(challenge_id) DO UPDATE SET
          status = excluded.status,
          tasks_completed = excluded.tasks_completed,
          attempts_count = training_user_progress.attempts_count + 1,
          points_earned = excluded.points_earned,
          solved_at = excluded.solved_at,
          updated_at = excluded.updated_at
      `).run(
        challengeId,
        status,
        JSON.stringify([...completedTasks]),
        prog.unlocked_hints,
        allSolved ? 1 : prog.writeup_unlocked,
        (prog.attempts_count || 0) + 1,
        newPointsEarned,
        solvedAt,
        new Date().toISOString()
      );

      // Créditer l'XP au profil général du joueur dans user_state
      if (pointsAwarded > 0) {
        this.db.prepare(`
          UPDATE user_state
          SET xp = xp + ?, updated_at = ?
          WHERE id = 'current_player'
        `).run(pointsAwarded, new Date().toISOString());
      }

      return {
        is_correct: true,
        task_id: taskId,
        points_awarded: pointsAwarded,
        challenge_completed: allSolved,
        message: allSolved
          ? '🎉 Félicitations ! Tu as complété toutes les tâches et capturé l\'infrastructure !'
          : '✔ Drapeau validé avec succès ! Poursuis la mission.'
      };
    } else {
      // Échec : incrémentation des tentatives
      this.db.prepare(`
        INSERT INTO training_user_progress (challenge_id, status, tasks_completed, unlocked_hints, writeup_unlocked, attempts_count, points_earned, solved_at, updated_at)
        VALUES (?, 'in_progress', '[]', '[]', 0, 1, 0, NULL, ?)
        ON CONFLICT(challenge_id) DO UPDATE SET
          attempts_count = training_user_progress.attempts_count + 1,
          updated_at = excluded.updated_at
      `).run(challengeId, new Date().toISOString());

      return {
        is_correct: false,
        task_id: taskId,
        message: 'Drapeau incorrect. Analyse les données recueillies et réessaie.'
      };
    }
  }

  // 9. Déblocage d'indice avec coût en gemmes
  unlockHint(challengeId, hintIndex) {
    const ch = this.db.prepare('SELECT * FROM training_challenges WHERE id = ?').get(challengeId);
    if (!ch) throw new Error('Challenge introuvable.');

    const hints = JSON.parse(ch.hints_json || '[]');
    const hint = hints[hintIndex];
    if (!hint) throw new Error('Indice introuvable.');

    let prog = this.db.prepare('SELECT * FROM training_user_progress WHERE challenge_id = ?').get(challengeId);
    if (!prog) {
      prog = { unlocked_hints: '[]' };
    }

    const unlocked = new Set(JSON.parse(prog.unlocked_hints || '[]'));
    if (unlocked.has(hintIndex)) {
      return { hint: hint.content, cost_paid: 0, already_unlocked: true };
    }

    const cost = hint.cost || 10;

    // Déduction des gemmes sur le compte utilisateur
    const user = this.db.prepare('SELECT gems FROM user_state WHERE id = ?').get('current_player') || { gems: 100 };
    if (user.gems < cost) {
      throw new Error(`Crédits insuffisants. Cet indice requiert ${cost} gemmes (tu en as ${user.gems}).`);
    }

    this.db.prepare('UPDATE user_state SET gems = gems - ? WHERE id = ?').run(cost, 'current_player');

    unlocked.add(hintIndex);
    this.db.prepare(`
      INSERT INTO training_user_progress (challenge_id, status, tasks_completed, unlocked_hints, writeup_unlocked, attempts_count, points_earned, solved_at, updated_at)
      VALUES (?, 'in_progress', '[]', ?, 0, 0, 0, NULL, ?)
      ON CONFLICT(challenge_id) DO UPDATE SET
        unlocked_hints = excluded.unlocked_hints,
        updated_at = excluded.updated_at
    `).run(challengeId, JSON.stringify([...unlocked]), new Date().toISOString());

    return {
      hint: hint.content,
      cost_paid: cost,
      already_unlocked: false,
      remaining_gems: user.gems - cost
    };
  }

  // 10. Récupération du Writeup / Solution détaillée
  getWriteup(challengeId) {
    const ch = this.db.prepare('SELECT * FROM training_challenges WHERE id = ?').get(challengeId);
    if (!ch) throw new Error('Challenge introuvable.');

    const prog = this.db.prepare('SELECT * FROM training_user_progress WHERE challenge_id = ?').get(challengeId);
    const isSolved = prog && (prog.status === 'solved' || prog.writeup_unlocked === 1);

    if (!isSolved) {
      throw new Error('Le writeup est confidentiel et verrouillé jusqu\'à la résolution complète du challenge.');
    }

    return {
      challenge_id: challengeId,
      title: ch.title,
      writeup: ch.writeup_markdown || 'Aucun writeup détaillé n\'a encore été rédigé pour ce challenge.'
    };
  }

  // 11. Nettoyeur automatique de machines expirées (toutes les 60 secondes)
  startGarbageCollector() {
    setInterval(() => {
      try {
        const now = new Date().toISOString();
        const expired = this.db.prepare('SELECT challenge_id FROM training_instances WHERE status = ? AND expires_at <= ?').all('running', now);
        for (const exp of expired) {
          this.stopInstance(exp.challenge_id);
        }
      } catch (e) {}
    }, 60000);
  }
}

module.exports = TrainingManager;

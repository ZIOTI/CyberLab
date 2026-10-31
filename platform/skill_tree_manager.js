// ============================================================================
// CYBERLAB - SKILL TREE, CURRICULUM UNIFICATION & SPECIALIZED TRACKS ENGINE
// Ontologie de compétences, Arborescence 4 Rôles, Diagnostic, Dojo & Modules
// Moteur Node.js natif + node:sqlite (Zéro dépendance externe)
// ============================================================================

const crypto = require('node:crypto');

class SkillTreeManager {
  constructor(db, targetsDb, trainingManager) {
    this.db = db;
    this.targetsDb = targetsDb;
    this.trainingManager = trainingManager;
    this.initTables();
    this.seedSkillTree();
  }

  // 1. Initialisation des tables SQLite du modèle d'ontologie unifiée
  initTables() {
    if (!this.db) return;

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS skill_tree_roles (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        track_type TEXT NOT NULL,
        description TEXT NOT NULL,
        icon TEXT NOT NULL,
        color TEXT NOT NULL,
        badge_reward TEXT
      );

      CREATE TABLE IF NOT EXISTS skill_tree_nodes (
        id TEXT PRIMARY KEY,
        role_id TEXT NOT NULL,
        tier INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        icon TEXT NOT NULL,
        category TEXT NOT NULL,
        prerequisites TEXT DEFAULT '[]',
        mastery_skills TEXT DEFAULT '[]',
        linked_curriculum_levels TEXT DEFAULT '[]',
        linked_challenges TEXT DEFAULT '[]',
        offense_objective TEXT,
        defense_objective TEXT,
        xp_reward INTEGER DEFAULT 100
      );

      CREATE TABLE IF NOT EXISTS user_skill_progress (
        player_id TEXT,
        node_id TEXT,
        status TEXT DEFAULT 'locked',
        curriculum_completed_count INTEGER DEFAULT 0,
        challenges_completed_count INTEGER DEFAULT 0,
        mastery_score INTEGER DEFAULT 0,
        unlocked_at TEXT,
        completed_at TEXT,
        mastered_at TEXT,
        PRIMARY KEY (player_id, node_id)
      );

      CREATE TABLE IF NOT EXISTS user_placement_results (
        player_id TEXT PRIMARY KEY,
        total_score INTEGER DEFAULT 0,
        domain_scores TEXT DEFAULT '{}',
        recommended_role TEXT,
        recommended_tier INTEGER DEFAULT 1,
        details_json TEXT DEFAULT '{}',
        completed_at TEXT
      );

      CREATE TABLE IF NOT EXISTS user_error_reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        player_id TEXT NOT NULL,
        item_type TEXT NOT NULL,
        item_id TEXT NOT NULL,
        question_text TEXT,
        user_wrong_answer TEXT,
        correct_answer TEXT,
        topic TEXT,
        skill_node_id TEXT,
        error_count INTEGER DEFAULT 1,
        status TEXT DEFAULT 'pending_review',
        last_reviewed_at TEXT,
        created_at TEXT
      );
    `);
  }

  // 2. Peuplement des 4 Rôles Professionnels et de leurs Nœuds d'Arborescence
  seedSkillTree() {
    if (!this.db) return;

    // --- Les 4 Parcours / Rôles Professionnels ---
    const roles = [
      {
        id: 'role-web-network',
        title: 'Pentester Web & Réseau',
        track_type: 'offense',
        description: 'Spécialiste des audits de sécurité applicative, cartographie réseau et exploitation de failles d\'infrastructure.',
        icon: 'globe',
        color: 'cyan',
        badge_reward: 'Master Web & Network Penetration Tester'
      },
      {
        id: 'role-soc-defense',
        title: 'Analyste SOC & Détection d\'Incident',
        track_type: 'defense',
        description: 'Gardien opérationnel : corrélation de télémétrie, forensic réseau/mémoire, rétro-ingénierie d\'implants et réponse à incident.',
        icon: 'shield',
        color: 'emerald',
        badge_reward: 'Certified SOC Sentinel & Incident Responder'
      },
      {
        id: 'role-cloud-devsec',
        title: 'Spécialiste Sécurité Cloud & Conteneurs',
        track_type: 'devsecops',
        description: 'Architecte DevSecOps : durcissement Kubernetes, évasion de conteneurs, audit de dépôts Git et gouvernance IAM.',
        icon: 'layers',
        color: 'amber',
        badge_reward: 'Cloud & Kubernetes Defense Architect'
      },
      {
        id: 'role-binary-ctf',
        title: 'Chasseur de Failles CTF & Binaire',
        track_type: 'reverse_pwn',
        description: 'Exploiteur de bas niveau : cryptanalyse avancée, rétro-ingénierie d\'exécutables ELF/PE et corruption de mémoire (Pwn).',
        icon: 'cpu',
        color: 'purple',
        badge_reward: 'Elite Binary Exploiter & Cryptanalyst'
      }
    ];

    const roleStmt = this.db.prepare(`
      INSERT INTO skill_tree_roles (id, title, track_type, description, icon, color, badge_reward)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        title = excluded.title,
        track_type = excluded.track_type,
        description = excluded.description,
        icon = excluded.icon,
        color = excluded.color,
        badge_reward = excluded.badge_reward
    `);

    for (const r of roles) {
      roleStmt.run(r.id, r.title, r.track_type, r.description, r.icon, r.color, r.badge_reward);
    }

    // --- Les Nœuds de Compétences (20 nœuds structurés sur 4 Tiers) ---
    const nodes = [
      // ==========================================
      // BRANCHE 1 : Pentester Web & Réseau (Offense)
      // ==========================================
      {
        id: 'node-web-recon',
        role_id: 'role-web-network',
        tier: 1,
        title: 'Reconnaissance Réseau & Protocoles',
        description: 'Maîtrise de la cartographie de ports, découverte d\'en-têtes HTTP, DNS et requêtes curl avancées.',
        icon: 'network',
        category: 'Reconnaissance',
        prerequisites: [],
        mastery_skills: ['nmap', 'curl', 'dns-enumeration', 'http-headers'],
        linked_curriculum_levels: ['m1-l1', 'm1-l2', 'm2-l1', 'm2-l2', 'm2-mid'],
        linked_challenges: ['net-01-wireshark-ftp', 'web-01-robots'],
        offense_objective: 'Scanner les ports ouverts et identifier les services web et fichiers cachés.',
        defense_objective: 'Désactiver les bannières serveur verbeuses et bloquer le scan non authentifié.',
        xp_reward: 120
      },
      {
        id: 'node-web-sqli',
        role_id: 'role-web-network',
        tier: 2,
        title: 'Injections SQL & Extraction de Données',
        description: 'Bypass d\'authentification, extraction UNION SELECT de schémas et exploitation d\'injections aveugles (Blind Boolean).',
        icon: 'database',
        category: 'Web Offense',
        prerequisites: ['node-web-recon'],
        mastery_skills: ['sqli', 'union-select', 'blind-sqli', 'database-schema'],
        linked_curriculum_levels: ['m3-l1', 'm3-l2', 'm3-l7', 'm3-mid'],
        linked_challenges: ['web-02-sqli-login', 'web-03-sqli-union', 'web-06-sqli-blind-boolean'],
        offense_objective: 'Extraire des clés et identifiants masqués via des requêtes SQL mal filtrées.',
        defense_objective: 'Migrer les requêtes concaténées vers des requêtes préparées (Prepared Statements).',
        xp_reward: 150
      },
      {
        id: 'node-web-client',
        role_id: 'role-web-network',
        tier: 3,
        title: 'Failles Côté Client (XSS / IDOR / JWT)',
        description: 'Vol de cookies via XSS stockée, usurpation d\'enregistrements IDOR et falsification de signatures JWT (alg: none).',
        icon: 'zap',
        category: 'Web Client',
        prerequisites: ['node-web-sqli'],
        mastery_skills: ['xss', 'idor', 'jwt-bypass', 'cookie-security'],
        linked_curriculum_levels: ['m4-l1', 'm4-l4', 'm4-l10', 'm4-mid'],
        linked_challenges: ['web-04-stored-xss', 'web-07-reflected-xss'],
        offense_objective: 'Exfiltrer les jetons de session d\'un compte administrateur et usurper ses privilèges.',
        defense_objective: 'Configurer HttpOnly, CSP stricte et forcer l\'algorithme de vérification asymétrique JWT.',
        xp_reward: 180
      },
      {
        id: 'node-web-api',
        role_id: 'role-web-network',
        tier: 3,
        title: 'Sécurité des API & Faille BOLA / Mass Assignment',
        description: 'Détournement des autorisations d\'objets API (Broken Object Level Authorization) et injection de paramètres privilégiés.',
        icon: 'code',
        category: 'API Security',
        prerequisites: ['node-web-sqli'],
        mastery_skills: ['api-security', 'bola', 'mass-assignment', 'rest-audit'],
        linked_curriculum_levels: ['m4-l5', 'm4-l6'],
        linked_challenges: ['api-01-bola-profile'],
        offense_objective: 'Accéder aux dossiers médicaux d\'autres utilisateurs via une API REST mal autorisée.',
        defense_objective: 'Implémenter un contrôle d\'accès basé sur le contexte utilisateur et des DTO stricts.',
        xp_reward: 180
      },
      {
        id: 'node-web-rce-pivot',
        role_id: 'role-web-network',
        tier: 4,
        title: 'Exécution de Code Arbitraire & Pivot Réseau',
        description: 'Injections de commandes OS (RCE), contournements de filtres IFS/Wildcards, Reverse Shells et élévation de privilèges.',
        icon: 'terminal',
        category: 'Advanced Offense',
        prerequisites: ['node-web-client', 'node-web-api'],
        mastery_skills: ['rce', 'reverse-shell', 'privesc-linux', 'gtfobins'],
        linked_curriculum_levels: ['m5-l1', 'm5-l3', 'm5-l8', 'm5-mid'],
        linked_challenges: ['linux-01-suid-bash', 'aegis-box-01-perimeter'],
        offense_objective: 'Obtenir un shell interactif root sur le serveur cible via une injection de commande.',
        defense_objective: 'Exécuter l\'application sous utilisateur sans privilèges avec sandbox seccomp/AppArmor.',
        xp_reward: 250
      },

      // ==========================================
      // BRANCHE 2 : Analyste SOC & Détection d'Incident (Defense)
      // ==========================================
      {
        id: 'node-soc-telemetry',
        role_id: 'role-soc-defense',
        tier: 1,
        title: 'Télémétrie Système & Analyse de Journaux',
        description: 'Collecte et parsing des journaux d\'authentification Linux (auth.log), serveurs web Nginx/Apache et traces Syslog.',
        icon: 'file-text',
        category: 'Telemetry',
        prerequisites: [],
        mastery_skills: ['log-analysis', 'auth-log', 'brute-force-detection', 'syslog'],
        linked_curriculum_levels: ['m1-l10', 'm1-l11', 'm2-l5'],
        linked_challenges: ['blue-01-auth-log-brute'],
        offense_objective: 'Détecter les tentatives de brute-force SSH et identifier l\'adresse IP source attaquante.',
        defense_objective: 'Mettre en place fail2ban et des seuils d\'alerting automatique sur les échecs répétés.',
        xp_reward: 120
      },
      {
        id: 'node-soc-pcap',
        role_id: 'role-soc-defense',
        tier: 2,
        title: 'Analyse de Captures Réseau (DFIR PCAP)',
        description: 'Inspection approfondie de trames Wireshark : détection d\'exfiltration de données, balises C2 et identifiants en clair.',
        icon: 'wifi',
        category: 'Network DFIR',
        prerequisites: ['node-soc-telemetry'],
        mastery_skills: ['wireshark', 'pcap-analysis', 'c2-beacon-detection', 'stream-reassembly'],
        linked_curriculum_levels: ['m2-l3', 'm2-l4'],
        linked_challenges: ['net-01-wireshark-ftp', 'forensics-02-pcap-http'],
        offense_objective: 'Reconstituer une session FTP non chiffrée et extraire le mot de passe compromis.',
        defense_objective: 'Migrer les protocoles en clair vers TLS/FTPS et déployer un IDS Suricata avec règles de flux.',
        xp_reward: 150
      },
      {
        id: 'node-soc-forensics',
        role_id: 'role-soc-defense',
        tier: 3,
        title: 'DFIR Fichiers, Mémoire & Stéganographie',
        description: 'Reconstruction d\'en-têtes corrompus (Magic Bytes), analyse de dumps de processus en mémoire et extraction LSB.',
        icon: 'search',
        category: 'Digital Forensics',
        prerequisites: ['node-soc-pcap'],
        mastery_skills: ['magic-bytes', 'memory-forensics', 'steganography-lsb', 'volatility'],
        linked_curriculum_levels: ['m1-l7', 'm1-l13'],
        linked_challenges: ['forensics-01-magic-bytes', 'aegis-box-02-internal'],
        offense_objective: 'Extraire un payload secret dissimulé dans les bits de poids faible d\'un fichier bitmap.',
        defense_objective: 'Établir la chronologie de l\'incident (timeline) et calculer les condensats d\'intégrité SHA-256.',
        xp_reward: 180
      },
      {
        id: 'node-soc-rules',
        role_id: 'role-soc-defense',
        tier: 3,
        title: 'Ingénierie de Détection (Sigma & YARA)',
        description: 'Rédaction de signatures YARA d\'implants malveillants et règles de détection SIEM Sigma basées sur le framework MITRE ATT&CK.',
        icon: 'shield',
        category: 'Detection Engineering',
        prerequisites: ['node-soc-pcap'],
        mastery_skills: ['yara-rules', 'sigma-rules', 'mitre-att&ck', 'threat-hunting'],
        linked_curriculum_levels: ['m2-l10', 'm5-l6'],
        linked_challenges: ['aegis-box-02-internal', 'aegis-box-03-vault'],
        offense_objective: 'Créer une règle YARA capable de détecter le dropper de l\'APT adverse en mémoire.',
        defense_objective: 'Traduire la règle Sigma en requête de détection live sur la passerelle SIEM.',
        xp_reward: 180
      },
      {
        id: 'node-soc-incident-response',
        role_id: 'role-soc-defense',
        tier: 4,
        title: 'Réponse à Incident & Remédiation Système',
        description: 'Endiguement d\'attaque : isolation réseau via iptables, révocation des clés compromises et durcissement d\'infrastructure.',
        icon: 'lock',
        category: 'Incident Response',
        prerequisites: ['node-soc-rules', 'node-soc-forensics'],
        mastery_skills: ['containment', 'firewall-hardening', 'malware-eradication', 'post-mortem'],
        linked_curriculum_levels: ['m5-l9'],
        linked_challenges: ['aegis-box-03-vault'],
        offense_objective: 'Identifier tous les canaux de communication de l\'attaquant et bloquer l\'IP du serveur C2.',
        defense_objective: 'Éradiquer l\'implant du démarrage système et rédiger le rapport de debriefing post-mortem.',
        xp_reward: 250
      },

      // ==========================================
      // BRANCHE 3 : Spécialiste Sécurité Cloud & Conteneurs (DevSecOps)
      // ==========================================
      {
        id: 'node-cloud-git-secrets',
        role_id: 'role-cloud-devsec',
        tier: 1,
        title: 'Audit de Dépôts Git & Fuites de Secrets',
        description: 'Détection de tokens API, clés privées SSH et identifiants AWS dissimulés dans l\'historique des commits Git.',
        icon: 'git-branch',
        category: 'Secret Hygiene',
        prerequisites: [],
        mastery_skills: ['git-leaks', 'secret-scanning', 'trufflehog', 'commit-history'],
        linked_curriculum_levels: ['m1-l3', 'm1-l4'],
        linked_challenges: ['cloud-02-git-history-leak'],
        offense_objective: 'Récupérer un token cloud dans un commit Git orphelin ou supprimé de la branche principale.',
        defense_objective: 'Intégrer un hook de pre-commit gitleaks et révoquer immédiatement la clé exposée.',
        xp_reward: 120
      },
      {
        id: 'node-cloud-storage-iam',
        role_id: 'role-cloud-devsec',
        tier: 2,
        title: 'Permissions Stockage Cloud (S3/GCS) & IAM',
        description: 'Exploitation de buckets Cloud mal configurés (accès public AllUsers) et gouvernance des rôles IAM à moindre privilège.',
        icon: 'cloud',
        category: 'Cloud Storage',
        prerequisites: ['node-cloud-git-secrets'],
        mastery_skills: ['aws-s3', 'gcs-bucket', 'iam-least-privilege', 'bucket-policy'],
        linked_curriculum_levels: ['m3-l4'],
        linked_challenges: ['cloud-01-s3-open-bucket', 'cloud-05-aws-iam-role-assumption'],
        offense_objective: 'Énumérer les objets d\'un bucket S3 ouvert et télécharger la sauvegarde chiffrée de la base.',
        defense_objective: 'Activer le verrouillage public S3 (Block Public Access) et appliquer une politique KMS stricte.',
        xp_reward: 150
      },
      {
        id: 'node-cloud-containers',
        role_id: 'role-cloud-devsec',
        tier: 3,
        title: 'Sécurité Docker & Évasion de Conteneurs',
        description: 'Abus du socket Docker monté (/var/run/docker.sock), élévation vers l\'hôte physique et conteneurs privilégiés.',
        icon: 'box',
        category: 'Container Security',
        prerequisites: ['node-cloud-storage-iam'],
        mastery_skills: ['docker-escape', 'docker-socket', 'container-breakout', 'rootless-containers'],
        linked_curriculum_levels: ['m5-l7'],
        linked_challenges: ['cloud-03-docker-socket-escape'],
        offense_objective: 'Spawer un conteneur hôte depuis un conteneur vulnérable pour monter la racine du système hôte.',
        defense_objective: 'Proscrire le montage du socket Docker et migrer vers des moteurs de conteneurs Rootless.',
        xp_reward: 180
      },
      {
        id: 'node-cloud-api-security',
        role_id: 'role-cloud-devsec',
        tier: 3,
        title: 'Protection Microservices & Mass Assignment',
        description: 'Audit des points d\'entrée API des microservices cloud contre l\'attribution massive de privilèges et failles SSRF cloud (IMDSv1).',
        icon: 'server',
        category: 'Cloud API',
        prerequisites: ['node-cloud-storage-iam'],
        mastery_skills: ['ssrf-cloud', 'imdsv1-imdsv2', 'mass-assignment', 'microservice-auth'],
        linked_curriculum_levels: ['m3-l4', 'm4-l6'],
        linked_challenges: ['api-01-bola-profile'],
        offense_objective: 'Interroger le service de métadonnées AWS 169.254.169.254 via une faille SSRF pour voler un rôle IAM.',
        defense_objective: 'Imposer IMDSv2 avec token obligatoire et limiter les redirections du reverse proxy.',
        xp_reward: 180
      },
      {
        id: 'node-cloud-k8s-hardened',
        role_id: 'role-cloud-devsec',
        tier: 4,
        title: 'Durcissement Kubernetes & RBAC Avancé',
        description: 'Audit des ServiceAccounts Kubernetes montés par défaut, contrôle d\'admission PodSecurity et isolement réseau NetworkPolicy.',
        icon: 'cpu',
        category: 'Kubernetes Hardening',
        prerequisites: ['node-cloud-containers', 'node-cloud-api-security'],
        mastery_skills: ['kubernetes-rbac', 'service-account-tokens', 'pod-security-standards', 'network-policy'],
        linked_curriculum_levels: ['m5-l8'],
        linked_challenges: ['cloud-04-k8s-service-account'],
        offense_objective: 'Utiliser un token de ServiceAccount pour énumérer les secrets du namespace kube-system.',
        defense_objective: 'Appliquer des règles RBAC minimales et activer automountServiceAccountToken: false.',
        xp_reward: 250
      },

      // ==========================================
      // BRANCHE 4 : Chasseur de Failles CTF & Binaire (Reverse / Pwn / Crypto)
      // ==========================================
      {
        id: 'node-bin-crypto-classic',
        role_id: 'role-binary-ctf',
        tier: 1,
        title: 'Cryptanalyse Classique & Opérations Bitwise',
        description: 'Ciphers historiques (César, Vigenère), masques XOR multi-octets, fréquences d\'analyse et cassage de hashs simples.',
        icon: 'key',
        category: 'Classical Cryptanalysis',
        prerequisites: [],
        mastery_skills: ['caesar-rot', 'vigenere-cipher', 'xor-cracker', 'frequency-analysis'],
        linked_curriculum_levels: ['m1-l9'],
        linked_challenges: ['crypto-01-rot-vault', 'crypto-02-xor-cracker'],
        offense_objective: 'Briser un chiffrement XOR multi-octets par analyse de fréquence et récupérer le flag.',
        defense_objective: 'Abandonner les chiffrements maison au profit d\'algorithmes cryptographiques standardisés (AES/ChaCha20).',
        xp_reward: 120
      },
      {
        id: 'node-bin-crypto-modern',
        role_id: 'role-binary-ctf',
        tier: 2,
        title: 'Cryptographie Moderne & Faiblesses Mathématiques',
        description: 'Attaques RSA (small public exponent e=3, factorisation de modules faibles) et exploitation de Padding Oracle AES (PKCS#7).',
        icon: 'lock',
        category: 'Modern Crypto',
        prerequisites: ['node-bin-crypto-classic'],
        mastery_skills: ['rsa-small-e', 'rsa-factorization', 'aes-padding-oracle', 'pkcs7'],
        linked_curriculum_levels: ['m4-l10'],
        linked_challenges: ['crypto-01-rot-vault', 'aegis-box-03-vault'],
        offense_objective: 'Déchiffrer un message AES-CBC octet par octet en exploitant la fuite d\'erreur d\'un oracle de padding.',
        defense_objective: 'Migrer vers un mode de chiffrement authentifié (AEAD) comme AES-256-GCM ou ChaCha20-Poly1305.',
        xp_reward: 150
      },
      {
        id: 'node-bin-reverse-elf',
        role_id: 'role-binary-ctf',
        tier: 3,
        title: 'Rétro-Ingénierie Binaire (ELF/PE & Crackmes)',
        description: 'Désassemblage x86_64, inspection des tables de symboles, chaînes encodées et validation d\'algorithmes de clés de série.',
        icon: 'terminal',
        category: 'Reverse Engineering',
        prerequisites: ['node-bin-crypto-classic'],
        mastery_skills: ['elf-header', 'objdump-strings', 'crackme-keygen', 'ghidra-decompile'],
        linked_curriculum_levels: ['m1-l15'],
        linked_challenges: ['rev-01-js-packer'],
        offense_objective: 'Identifier la fonction de comparaison de clé dans un binaire compilé et générer une licence valide.',
        defense_objective: 'Activer l\'obfuscation de symboles, le stripping de binaires et des routines anti-débogage.',
        xp_reward: 180
      },
      {
        id: 'node-bin-overflow',
        role_id: 'role-binary-ctf',
        tier: 3,
        title: 'Dépassement de Tampon (Buffer Overflow Guidé)',
        description: 'Analyse de pile d\'exécution (Stack Frame), calcul de l\'offset d\'écrasement de saved EIP/RIP et redirection du flux.',
        icon: 'cpu',
        category: 'Binary Exploitation',
        prerequisites: ['node-bin-reverse-elf'],
        mastery_skills: ['buffer-overflow', 'stack-corruption', 'eip-overwrite', 'ret2win'],
        linked_curriculum_levels: ['m5-l8'],
        linked_challenges: ['pwn-01-bof-stack-simple'],
        offense_objective: 'Calculer la taille exacte du tampon pour écraser l\'adresse de retour et appeler la fonction secrète print_flag.',
        defense_objective: 'Compiler avec Stack Canaries (-fstack-protector-all) et vérifier l\'intégrité de la pile.',
        xp_reward: 180
      },
      {
        id: 'node-bin-exploit-defense',
        role_id: 'role-binary-ctf',
        tier: 4,
        title: 'Pwn d\'Élite & Mitigations Modernes',
        description: 'Contournement des protections binaires (ASLR, NX/DEP) via ROP Chains (Return-Oriented Programming) et ret2libc.',
        icon: 'shield',
        category: 'Advanced Pwn',
        prerequisites: ['node-bin-crypto-modern', 'node-bin-overflow'],
        mastery_skills: ['rop-chain', 'aslr-bypass', 'ret2libc', 'checksec'],
        linked_curriculum_levels: ['m5-l9'],
        linked_challenges: ['pwn-02-ret2libc-x86', 'pwn-04-rop-x64-execve'],
        offense_objective: 'Construire une chaîne de gadgets ROP pour invoquer execve("/bin/sh") malgré la pile non exécutable (NX).',
        defense_objective: 'Activer le Full RELRO, PIE (Position Independent Executable) et FORTIFY_SOURCE.',
        xp_reward: 250
      }
    ];

    const nodeStmt = this.db.prepare(`
      INSERT INTO skill_tree_nodes (
        id, role_id, tier, title, description, icon, category, prerequisites,
        mastery_skills, linked_curriculum_levels, linked_challenges, offense_objective, defense_objective, xp_reward
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        role_id = excluded.role_id,
        tier = excluded.tier,
        title = excluded.title,
        description = excluded.description,
        icon = excluded.icon,
        category = excluded.category,
        prerequisites = excluded.prerequisites,
        mastery_skills = excluded.mastery_skills,
        linked_curriculum_levels = excluded.linked_curriculum_levels,
        linked_challenges = excluded.linked_challenges,
        offense_objective = excluded.offense_objective,
        defense_objective = excluded.defense_objective,
        xp_reward = excluded.xp_reward
    `);

    for (const n of nodes) {
      nodeStmt.run(
        n.id,
        n.role_id,
        n.tier,
        n.title,
        n.description,
        n.icon,
        n.category,
        JSON.stringify(n.prerequisites),
        JSON.stringify(n.mastery_skills),
        JSON.stringify(n.linked_curriculum_levels),
        JSON.stringify(n.linked_challenges),
        n.offense_objective,
        n.defense_objective,
        n.xp_reward
      );
    }
  }

  // 3. Calcul Dynamique de l'Arborescence Unifiée et du Statut des Nœuds
  getSkillTree(playerId = 'current_player') {
    if (!this.db) return { roles: [], nodes: [], stats: {} };

    const roles = this.db.prepare('SELECT * FROM skill_tree_roles').all();
    const rawNodes = this.db.prepare('SELECT * FROM skill_tree_nodes ORDER BY tier ASC, id ASC').all();

    // Récupération de l'état du joueur
    const user = this.db.prepare('SELECT completed_levels FROM user_state WHERE id = ?').get(playerId);
    let completedCurriculum = [];
    try {
      completedCurriculum = JSON.parse(user ? user.completed_levels || '[]' : '[]');
    } catch (e) {
      completedCurriculum = [];
    }

    // Récupération des challenges résolus
    const trainingProgress = this.db.prepare('SELECT challenge_id, status FROM training_user_progress').all();
    const completedChallenges = new Set(
      trainingProgress.filter(p => p.status === 'completed' || p.status === 'solved').map(p => p.challenge_id)
    );

    // Récupération des statuts explicites enregistrés dans user_skill_progress
    const customProgressRows = this.db.prepare('SELECT * FROM user_skill_progress WHERE player_id = ?').all(playerId);
    const progressMap = new Map();
    customProgressRows.forEach(row => progressMap.set(row.node_id, row));

    // Calcul récursif de déblocage basé sur les prérequis
    const completedNodeIds = new Set();
    const masteredNodeIds = new Set();

    // Première passe : identifier les nœuds déjà validés manuellement ou par progression explicite
    rawNodes.forEach(n => {
      const explicit = progressMap.get(n.id);
      if (explicit && (explicit.status === 'completed' || explicit.status === 'mastered')) {
        completedNodeIds.add(n.id);
        if (explicit.status === 'mastered') masteredNodeIds.add(n.id);
      }
    });

    // Convergence loop : propagation automatique des nœuds complétés via curriculum + labs
    let convergenceChanged = true;
    while (convergenceChanged) {
      convergenceChanged = false;
      for (const node of rawNodes) {
        if (completedNodeIds.has(node.id)) continue;
        const prereqs = JSON.parse(node.prerequisites || '[]');
        const allPrereqsMet = prereqs.every(pid => completedNodeIds.has(pid));
        if (allPrereqsMet) {
          const linkedCurriculum = JSON.parse(node.linked_curriculum_levels || '[]');
          const linkedChalls = JSON.parse(node.linked_challenges || '[]');
          const curCompletedCount = linkedCurriculum.filter(lvl => completedCurriculum.includes(lvl)).length;
          const challCompletedCount = linkedChalls.filter(ch => completedChallenges.has(ch)).length;
          const totalItems = linkedCurriculum.length + linkedChalls.length;
          if (totalItems > 0 && (curCompletedCount + challCompletedCount) === totalItems) {
            completedNodeIds.add(node.id);
            convergenceChanged = true;
          }
        }
      }
    }

    // Évaluation dynamique de chaque nœud
    const evaluatedNodes = rawNodes.map(node => {
      const prereqs = JSON.parse(node.prerequisites || '[]');
      const linkedCurriculum = JSON.parse(node.linked_curriculum_levels || '[]');
      const linkedChalls = JSON.parse(node.linked_challenges || '[]');
      const skills = JSON.parse(node.mastery_skills || '[]');

      // Calcul de la progression sur les leçons du curriculum
      const curCompletedCount = linkedCurriculum.filter(lvl => completedCurriculum.includes(lvl)).length;
      // Calcul de la progression sur les CTF labs
      const challCompletedCount = linkedChalls.filter(ch => completedChallenges.has(ch)).length;

      const totalItems = linkedCurriculum.length + linkedChalls.length;
      const completedItems = curCompletedCount + challCompletedCount;
      const progressPct = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 100;

      // Vérification des prérequis
      const allPrereqsMet = prereqs.every(pid => completedNodeIds.has(pid));

      let computedStatus = 'locked';
      const explicit = progressMap.get(node.id);

      if (explicit && explicit.status === 'mastered') {
        computedStatus = 'mastered';
      } else if (explicit && explicit.status === 'completed') {
        computedStatus = 'completed';
      } else if (completedNodeIds.has(node.id)) {
        computedStatus = 'completed';
      } else if (allPrereqsMet) {
        computedStatus = 'available';
      } else {
        computedStatus = 'locked';
      }

      // Si le nœud est complété et qu'il a un score de maîtrise parfait
      if (computedStatus === 'completed' && explicit && explicit.mastery_score >= 100) {
        computedStatus = 'mastered';
        masteredNodeIds.add(node.id);
      }

      return {
        id: node.id,
        role_id: node.role_id,
        tier: node.tier,
        title: node.title,
        description: node.description,
        icon: node.icon,
        category: node.category,
        prerequisites: prereqs,
        mastery_skills: skills,
        linked_curriculum_levels: linkedCurriculum,
        linked_challenges: linkedChalls,
        offense_objective: node.offense_objective,
        defense_objective: node.defense_objective,
        xp_reward: node.xp_reward,
        status: computedStatus,
        progress_percentage: progressPct,
        curriculum_completed_count: curCompletedCount,
        curriculum_total_count: linkedCurriculum.length,
        challenges_completed_count: challCompletedCount,
        challenges_total_count: linkedChalls.length
      };
    });

    // Statistiques globales de l'arbre
    const stats = {
      total_nodes: evaluatedNodes.length,
      locked_count: evaluatedNodes.filter(n => n.status === 'locked').length,
      available_count: evaluatedNodes.filter(n => n.status === 'available').length,
      completed_count: evaluatedNodes.filter(n => n.status === 'completed').length,
      mastered_count: evaluatedNodes.filter(n => n.status === 'mastered').length,
      overall_completion_pct: Math.round(
        (evaluatedNodes.filter(n => n.status === 'completed' || n.status === 'mastered').length / evaluatedNodes.length) * 100
      )
    };

    // Diagnostic placement du joueur
    const placement = this.db.prepare('SELECT * FROM user_placement_results WHERE player_id = ?').get(playerId);

    return {
      roles,
      nodes: evaluatedNodes,
      stats,
      placement: placement ? {
        total_score: placement.total_score,
        domain_scores: JSON.parse(placement.domain_scores || '{}'),
        recommended_role: placement.recommended_role,
        recommended_tier: placement.recommended_tier,
        completed_at: placement.completed_at
      } : null
    };
  }

  // 4. Test de Placement Initial (Questionnaire Diagnostic Rapide)
  getDiagnosticQuestions() {
    return [
      {
        id: 'q1',
        domain: 'web_network',
        difficulty: 'beginner',
        question: 'Quel outil en ligne de commande permet de scanner les ports TCP ouverts sur un hôte cible ?',
        options: ['Wireshark', 'nmap', 'sqlmap', 'Ghidra'],
        explanation: 'nmap est le scanner de réseau standard pour identifier les ports, services et OS.'
      },
      {
        id: 'q2',
        domain: 'web_network',
        difficulty: 'intermediate',
        question: 'Quelle clause SQL permet d\'agréger les résultats de deux requêtes SELECT différentes ?',
        options: ['JOIN ON', 'GROUP BY', 'UNION SELECT', 'ORDER BY'],
        explanation: 'UNION SELECT permet de combiner les lignes résultantes de plusieurs SELECT si le nombre de colonnes correspond.'
      },
      {
        id: 'q3',
        domain: 'soc_defense',
        difficulty: 'beginner',
        question: 'Dans quel fichier sous Linux consulte-t-on les tentatives de connexion et d\'authentification SSH ?',
        options: ['/var/log/nginx/access.log', '/var/log/auth.log', '/etc/shadow', '/var/log/dmesg'],
        explanation: '/var/log/auth.log (ou /var/log/secure sur RHEL) enregistre tous les événements PAM et SSH.'
      },
      {
        id: 'q4',
        domain: 'soc_defense',
        difficulty: 'intermediate',
        question: 'Quel langage de règles open-source permet de décrire des signatures de malwares en recherchant des motifs binaires ou textuels ?',
        options: ['Suricata', 'Sigma', 'YARA', 'Snort'],
        explanation: 'YARA est l\'outil et format de règles de référence pour classifier et identifier des malwares.'
      },
      {
        id: 'q5',
        domain: 'cloud_devsec',
        difficulty: 'beginner',
        question: 'Quelle faille critique survient lorsqu\'un conteneur Docker monte directement /var/run/docker.sock ?',
        options: [
          'Ralentissement des transferts réseau',
          'Évasion totale vers le système hôte avec privilèges root',
          'Désynchronisation de l\'horloge NTP',
          'Fuite de mémoire RAM uniquement'
        ],
        explanation: 'L\'accès au socket Docker de l\'hôte permet de contrôler le démon Docker et d\'exécuter des conteneurs privilégiés accédant au disque hôte.'
      },
      {
        id: 'q6',
        domain: 'cloud_devsec',
        difficulty: 'intermediate',
        question: 'Quelle est la principale vulnérabilité d\'un bucket AWS S3 dont la politique accorde "AllUsers: READ" ?',
        options: [
          'Facturation excessive de transfert réseau uniquement',
          'Fuite publique immédiate de l\'ensemble des fichiers et données du bucket',
          'Attaque par déni de service SYN flood',
          'Déchiffrement forcé des certificats TLS'
        ],
        explanation: 'Accorder READ à AllUsers rend le bucket publiquement téléchargeable par n\'importe quel internaute anonyme.'
      },
      {
        id: 'q7',
        domain: 'binary_crypto',
        difficulty: 'beginner',
        question: 'Quel type de chiffrement utilise un décalage fixe de l\'alphabet (ex: A devient D pour un décalage de 3) ?',
        options: ['Chiffre de Vigenère', 'Chiffre de César (ROT)', 'Chiffre RSA', 'AES-GCM'],
        explanation: 'Le chiffre de César est le chiffrement par substitution monoalphabétique à décalage le plus élémentaire.'
      },
      {
        id: 'q8',
        domain: 'binary_crypto',
        difficulty: 'intermediate',
        question: 'Dans une attaque par dépassement de tampon de pile (Buffer Overflow), quel registre clé cherche-t-on à écraser pour rediriger l\'exécution ?',
        options: ['EAX / RAX', 'EIP / RIP (Pointeur d\'instruction)', 'ESP / RSP', 'EBX / RBX'],
        explanation: 'EIP (32 bits) ou RIP (64 bits) contient l\'adresse de la prochaine instruction CPU exécutée.'
      }
    ];
  }

  evaluatePlacement(answers = {}, playerId = 'current_player') {
    const questions = this.getDiagnosticQuestions();
    const safeAnswers = (answers && typeof answers === 'object') ? answers : {};
    const correctMap = {
      q1: 1, // nmap
      q2: 2, // UNION SELECT
      q3: 1, // /var/log/auth.log
      q4: 2, // YARA
      q5: 1, // Évasion totale
      q6: 1, // Fuite publique
      q7: 1, // Chiffre de César
      q8: 1  // EIP / RIP
    };

    let totalCorrect = 0;
    const domainScores = {
      web_network: 0,
      soc_defense: 0,
      cloud_devsec: 0,
      binary_crypto: 0
    };
    const domainCounts = {
      web_network: 0,
      soc_defense: 0,
      cloud_devsec: 0,
      binary_crypto: 0
    };

    questions.forEach(q => {
      domainCounts[q.domain]++;
      const submitted = parseInt(safeAnswers[q.id], 10);
      if (submitted === correctMap[q.id]) {
        totalCorrect++;
        domainScores[q.domain]++;
      }
    });

    const totalPct = Math.round((totalCorrect / questions.length) * 100);
    const domainPercentages = {};
    for (const d of Object.keys(domainScores)) {
      domainPercentages[d] = Math.round((domainScores[d] / domainCounts[d]) * 100);
    }

    // Détermination du rôle recommandé en fonction des scores
    let bestDomain = 'web_network';
    let maxDomainScore = -1;
    for (const [d, sc] of Object.entries(domainPercentages)) {
      if (sc > maxDomainScore) {
        maxDomainScore = sc;
        bestDomain = d;
      }
    }

    const domainToRole = {
      web_network: 'role-web-network',
      soc_defense: 'role-soc-defense',
      cloud_devsec: 'role-cloud-devsec',
      binary_crypto: 'role-binary-ctf'
    };
    const recommendedRole = domainToRole[bestDomain] || 'role-web-network';

    // Détermination du palier recommandé
    let recommendedTier = 1;
    if (totalPct >= 75) recommendedTier = 3;
    else if (totalPct >= 40) recommendedTier = 2;
    else recommendedTier = 1;

    // Sauvegarde des résultats en base
    if (this.db) {
      const stmt = this.db.prepare(`
        INSERT INTO user_placement_results (player_id, total_score, domain_scores, recommended_role, recommended_tier, details_json, completed_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(player_id) DO UPDATE SET
          total_score = excluded.total_score,
          domain_scores = excluded.domain_scores,
          recommended_role = excluded.recommended_role,
          recommended_tier = excluded.recommended_tier,
          details_json = excluded.details_json,
          completed_at = excluded.completed_at
      `);

      stmt.run(
        playerId,
        totalPct,
        JSON.stringify(domainPercentages),
        recommendedRole,
        recommendedTier,
        JSON.stringify({ answers: safeAnswers, totalCorrect, totalQuestions: questions.length }),
        new Date().toISOString()
      );

      // Si le joueur a démontré un niveau intermédiaire ou avancé, débloquer les nœuds Tier 1 correspondants
      // IMPORTANT : Ne JAMAIS écraser un nœud déjà 'mastered' en 'completed'
      if (recommendedTier >= 2) {
        const tier1Nodes = this.db.prepare('SELECT id, linked_curriculum_levels FROM skill_tree_nodes WHERE tier = 1').all();
        const upsertNode = this.db.prepare(`
          INSERT INTO user_skill_progress (player_id, node_id, status, unlocked_at, completed_at)
          VALUES (?, ?, 'completed', datetime('now'), datetime('now'))
          ON CONFLICT(player_id, node_id) DO UPDATE SET
            status = CASE WHEN user_skill_progress.status = 'mastered' THEN 'mastered' ELSE 'completed' END,
            completed_at = COALESCE(user_skill_progress.completed_at, datetime('now'))
        `);
        const unlockedCurriculum = new Set();
        tier1Nodes.forEach(n => {
          upsertNode.run(playerId, n.id);
          try {
            const lvls = JSON.parse(n.linked_curriculum_levels || '[]');
            lvls.forEach(l => unlockedCurriculum.add(l));
          } catch {}
        });

        // Synchroniser également avec user_state.completed_levels pour fluidifier le curriculum
        const userRow = this.db.prepare('SELECT completed_levels FROM user_state WHERE id = ?').get(playerId);
        if (userRow) {
          try {
            const curSet = new Set(JSON.parse(userRow.completed_levels || '[]'));
            unlockedCurriculum.forEach(l => curSet.add(l));
            this.db.prepare('UPDATE user_state SET completed_levels = ? WHERE id = ?')
              .run(JSON.stringify(Array.from(curSet)), playerId);
          } catch {}
        }
      }
    }

    return {
      success: true,
      player_id: playerId,
      total_score: totalPct,
      correct_answers: totalCorrect,
      total_questions: questions.length,
      domain_scores: domainPercentages,
      recommended_role: recommendedRole,
      recommended_tier: recommendedTier,
      feedback: totalPct >= 75
        ? 'Profil Confirmé Détecté : Accès direct débloqué vers les scénarios avancés (Tier 2/3).'
        : totalPct >= 40
        ? 'Bases Solides : Accès au parcours recommandé avec consolidation des fondamentaux.'
        : 'Parcours Initiatique : Démarrage guidé depuis le Niveau Zéro recommandé.'
    };
  }

  // 5. Mode Dojo & Moteur de Révision Espacée des Erreurs
  inferSkillNodeAndTopic(itemId) {
    const id = (itemId || '').toLowerCase();
    if (id.startsWith('m1-') || id.startsWith('net-')) return { node: 'node-web-recon', topic: 'Reconnaissance & Réseau' };
    if (id.startsWith('m2-') || id.includes('telemetry') || id.includes('log')) return { node: 'node-soc-telemetry', topic: 'Télémétrie & Logs' };
    if (id.startsWith('m3-') || id.includes('sqli')) return { node: 'node-web-sqli', topic: 'Injections SQL' };
    if (id.startsWith('m4-') || id.includes('xss') || id.includes('idor') || id.includes('jwt')) return { node: 'node-web-client', topic: 'Failles Web Client' };
    if (id.startsWith('m5-') || id.includes('rce') || id.includes('suid')) return { node: 'node-web-rce-pivot', topic: 'RCE & Élévation Linux' };
    if (id.includes('cloud') || id.includes('s3') || id.includes('docker') || id.includes('k8s')) return { node: 'node-cloud-storage-iam', topic: 'Cloud & Conteneurs' };
    if (id.includes('crypto') || id.includes('rot') || id.includes('xor') || id.includes('rsa')) return { node: 'node-bin-crypto-classic', topic: 'Cryptanalyse' };
    if (id.includes('forensic') || id.includes('pcap') || id.includes('stego')) return { node: 'node-soc-pcap', topic: 'Forensics DFIR' };
    if (id.includes('rev') || id.includes('crackme') || id.includes('elf') || id.includes('pe')) return { node: 'node-bin-reverse-elf', topic: 'Reverse Engineering' };
    if (id.includes('pwn') || id.includes('bof') || id.includes('rop')) return { node: 'node-bin-overflow', topic: 'Binary Exploitation' };
    if (id.includes('ad-') || id.includes('kerberos') || id.includes('ldap')) return { node: 'node-soc-rules', topic: 'Active Directory & SIEM' };
    return { node: 'node-web-recon', topic: 'Cybersécurité Pratique' };
  }

  recordError(playerId, itemType, itemId, questionText, wrongAnswer, correctAnswer, topic, skillNodeId) {
    if (!this.db) return;

    try {
      const inferred = this.inferSkillNodeAndTopic(itemId);
      const effectiveTopic = topic || inferred.topic;
      const effectiveNodeId = skillNodeId || inferred.node;

      const existing = this.db.prepare(`
        SELECT id, error_count, correct_answer FROM user_error_reviews
        WHERE player_id = ? AND item_id = ? AND status != 'mastered'
      `).get(playerId, itemId);

      if (existing) {
        this.db.prepare(`
          UPDATE user_error_reviews
          SET error_count = error_count + 1,
              user_wrong_answer = ?,
              correct_answer = COALESCE(?, correct_answer),
              last_reviewed_at = datetime('now')
          WHERE id = ?
        `).run(wrongAnswer, correctAnswer, existing.id);
      } else {
        this.db.prepare(`
          INSERT INTO user_error_reviews (
            player_id, item_type, item_id, question_text, user_wrong_answer,
            correct_answer, topic, skill_node_id, error_count, status, created_at, last_reviewed_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, 'pending_review', datetime('now'), datetime('now'))
        `).run(playerId, itemType, itemId, questionText, wrongAnswer, correctAnswer, effectiveTopic, effectiveNodeId);
      }
    } catch (e) {
      console.warn('[DOJO] Erreur enregistrement erreur révision :', e.message);
    }
  }

  getDojoSession(playerId = 'current_player') {
    if (!this.db) return { drills: [], pending_errors_count: 0 };

    const errors = this.db.prepare(`
      SELECT * FROM user_error_reviews
      WHERE player_id = ? AND status != 'mastered'
      ORDER BY error_count DESC, last_reviewed_at ASC
      LIMIT 5
    `).all(playerId);

    const drills = [];

    // Conversion des erreurs réelles en exercices interactifs du Dojo
    errors.forEach(err => {
      drills.push({
        id: `dojo-err-${err.id}`,
        error_record_id: err.id,
        item_id: err.item_id,
        item_type: err.item_type,
        topic: err.topic || 'Révision Ciblée',
        skill_node_id: err.skill_node_id,
        question: err.question_text || `Corrige ton erreur sur l'exercice ${err.item_id}`,
        user_previous_mistake: err.user_wrong_answer,
        expected_answer_hint: 'Rappel de cours : vérifie la syntaxe exacte et les options de commande.',
        correct_answer: err.correct_answer,
        error_count: err.error_count
      });
    });

    // Si le joueur n'a pas encore fait d'erreur, proposer 3 drills d'entraînement préventif
    if (drills.length === 0) {
      const defaultDrills = [
        {
          id: 'dojo-def-1',
          error_record_id: null,
          item_id: 'drill-sql-bypass',
          item_type: 'skill_drill',
          topic: 'Injections SQL',
          skill_node_id: 'node-web-sqli',
          question: 'Quel payload classique de contournement d\'authentification force une clause WHERE à toujours être vraie ?',
          options: ["' OR 1=1 --", "' DROP TABLE users --", "<script>alert(1)</script>", "${IFS}cat"],
          correct_answer: "' OR 1=1 --"
        },
        {
          id: 'dojo-def-2',
          error_record_id: null,
          item_id: 'drill-suid-privesc',
          item_type: 'skill_drill',
          topic: 'Permissions SUID Linux',
          skill_node_id: 'node-web-rce-pivot',
          question: 'Quelle commande find recherche tous les fichiers avec le bit SUID actif (4000) ?',
          options: [
            'find / -perm -u=s -type f 2>/dev/null',
            'ls -la /root',
            'chmod 777 /bin/bash',
            'netstat -tulnp'
          ],
          correct_answer: 'find / -perm -u=s -type f 2>/dev/null'
        },
        {
          id: 'dojo-def-3',
          error_record_id: null,
          item_id: 'drill-pcap-stream',
          item_type: 'skill_drill',
          topic: 'Analyse Réseau PCAP',
          skill_node_id: 'node-soc-pcap',
          question: 'Dans Wireshark, quelle option permet de reconstituer l\'intégralité des échanges d\'une session TCP ?',
          options: [
            'Follow TCP Stream',
            'Export Objects -> HTTP',
            'Statistics -> Flow Graph',
            'Apply as Filter -> Selected'
          ],
          correct_answer: 'Follow TCP Stream'
        }
      ];
      return {
        drills: defaultDrills,
        pending_errors_count: 0,
        is_preventive: true
      };
    }

    return {
      drills,
      pending_errors_count: errors.length,
      is_preventive: false
    };
  }

  submitDojoAnswer(playerId, drillId, answer) {
    const cleanAnswer = (answer || '').trim();
    const session = this.getDojoSession(playerId);
    const drill = session.drills.find(d => d.id === drillId);

    if (!drill) {
      return { success: false, error: 'Exercice Dojo introuvable.' };
    }

    let isCorrect = false;

    // 1. Si challenge CTF vérification dynamique avec trainingManager
    if (drill.item_type === 'challenge' && this.trainingManager) {
      const parts = (drill.item_id || '').split(':');
      const challengeId = parts[0];
      const taskId = parts[1] || 't1';
      try {
        const verify = this.trainingManager.submitFlag(challengeId, taskId, cleanAnswer, 'Opérateur RedTeam', '127.0.0.1', playerId);
        if (verify && (verify.correct || verify.is_correct)) {
          isCorrect = true;
        }
      } catch (e) {
        // En cas d'erreur, poursuite vers le fallback standard
      }
    }

    // 2. Si réponse officielle stockée
    if (!isCorrect && drill.correct_answer) {
      isCorrect = (
        drill.correct_answer.toLowerCase() === cleanAnswer.toLowerCase() ||
        cleanAnswer.toLowerCase().includes(drill.correct_answer.toLowerCase())
      );
    }

    if (isCorrect) {
      // Si c'était une erreur enregistrée en base, la marquer comme maîtrisée
      if (drill.error_record_id && this.db) {
        this.db.prepare(`
          UPDATE user_error_reviews
          SET status = 'mastered',
              last_reviewed_at = datetime('now')
          WHERE id = ?
        `).run(drill.error_record_id);
      }

      // Récompenser le joueur avec de l'XP
      if (this.db) {
        this.db.prepare(`
          UPDATE user_state
          SET xp = xp + 25,
              gems = gems + 5,
              updated_at = datetime('now')
          WHERE id = ?
        `).run(playerId);
      }

      return {
        success: true,
        correct: true,
        explanation: 'Excellent réflexe ! Erreur comprise et concept désormais maîtrisé.',
        xp_awarded: 25,
        gems_awarded: 5
      };
    } else {
      // Erreur persistante : incrémenter le compteur
      if (drill.error_record_id && this.db) {
        this.db.prepare(`
          UPDATE user_error_reviews
          SET error_count = error_count + 1,
              user_wrong_answer = ?,
              last_reviewed_at = datetime('now')
          WHERE id = ?
        `).run(cleanAnswer, drill.error_record_id);
      }

      return {
        success: true,
        correct: false,
        explanation: 'Réponse inexacte. Analyse l\'indice et retente l\'exercice dans le Dojo.',
        xp_awarded: 0
      };
    }
  }

  // 6. Déblocage & Validation Manuelle de Nœud
  unlockSkillNode(nodeId, playerId = 'current_player') {
    if (!this.db) return { success: false, error: 'BDD indisponible' };

    const node = this.db.prepare('SELECT * FROM skill_tree_nodes WHERE id = ?').get(nodeId);
    if (!node) return { success: false, error: 'Nœud introuvable' };

    const stmt = this.db.prepare(`
      INSERT INTO user_skill_progress (player_id, node_id, status, mastery_score, unlocked_at, completed_at, mastered_at)
      VALUES (?, ?, 'mastered', 100, datetime('now'), datetime('now'), datetime('now'))
      ON CONFLICT(player_id, node_id) DO UPDATE SET
        status = 'mastered',
        mastery_score = 100,
        mastered_at = datetime('now')
    `);
    stmt.run(playerId, nodeId);

    return {
      success: true,
      node_id: nodeId,
      status: 'mastered',
      message: `Compétence ${node.title} validée et maîtrisée !`
    };
  }

  // ==========================================================================
  // MODULES SPÉCIALISÉS OFFENSE & DÉFENSE (AVEC VRAIES CIBLES & ARTEFACTS)
  // ==========================================================================

  // --- 1. CRYPTANALYSE ---
  handleCryptoCesar(text, shift, decrypt = false) {
    const cleanShift = parseInt(shift, 10) || 0;
    const normalizedShift = ((cleanShift % 26) + 26) % 26;
    const s = decrypt ? (26 - normalizedShift) % 26 : normalizedShift;
    const result = (text || '').replace(/[a-zA-Z]/g, (c) => {
      const base = c <= 'Z' ? 65 : 97;
      return String.fromCharCode(((c.charCodeAt(0) - base + s) % 26) + base);
    });
    return { success: true, input: text, shift: cleanShift, decrypted: decrypt, result };
  }

  handleCryptoVigenere(text, key, decrypt = false) {
    const rawKey = (key || 'KEY').toUpperCase().replace(/[^A-Z]/g, '');
    const cleanKey = rawKey.length > 0 ? rawKey : 'KEY';
    let keyIdx = 0;
    const result = (text || '').replace(/[a-zA-Z]/g, (c) => {
      const isUpper = c <= 'Z';
      const base = isUpper ? 65 : 97;
      const shift = cleanKey.charCodeAt(keyIdx % cleanKey.length) - 65;
      keyIdx++;
      const s = decrypt ? (26 - shift) % 26 : shift;
      return String.fromCharCode(((c.charCodeAt(0) - base + s) % 26) + base);
    });
    return { success: true, input: text, key: cleanKey, decrypted: decrypt, result };
  }

  handleCryptoXorMultiByte(hexString, keyStr) {
    const cleanHex = (hexString || '').replace(/^0x/i, '').trim();
    if (!keyStr) {
      return { success: false, error: 'Clé de déchiffrement XOR manquante.' };
    }
    const buf = Buffer.from(cleanHex, 'hex');
    const keyBuf = Buffer.from(keyStr, 'utf8');
    if (keyBuf.length === 0) {
      return { success: false, error: 'Clé XOR vide.' };
    }
    const out = Buffer.alloc(buf.length);
    for (let i = 0; i < buf.length; i++) {
      out[i] = buf[i] ^ keyBuf[i % keyBuf.length];
    }
    const plain = out.toString('utf8');
    return {
      success: true,
      hex_input: hexString,
      key: keyStr,
      plaintext: plain,
      flag: plain.includes('CYBERLAB{') ? plain : null
    };
  }

  handleCryptoRsaSmallE(cHex, e = 3) {
    const cleanHex = (cHex || '').replace(/^0x/i, '').trim();
    if (!cleanHex || !/^[0-9a-fA-F]+$/.test(cleanHex)) {
      return { success: false, error: 'Ciphertext hexadécimal invalide.' };
    }
    const c = BigInt('0x' + cleanHex);
    let m = BigInt(0);
    let low = BigInt(0);
    let high = c;
    let found = false;
    while (low <= high) {
      const mid = (low + high) / BigInt(2);
      const cube = mid * mid * mid;
      if (cube === c) {
        m = mid;
        found = true;
        break;
      } else if (cube < c) {
        low = mid + BigInt(1);
      } else {
        high = mid - BigInt(1);
      }
    }
    if (!found) {
      return {
        success: false,
        error: 'Le ciphertext n\'est pas un cube parfait d\'entier (m^3 >= N ou e != 3).'
      };
    }
    let hexStr = m.toString(16);
    if (hexStr.length % 2 !== 0) hexStr = '0' + hexStr;
    const recoveredText = Buffer.from(hexStr, 'hex').toString('utf8');
    return {
      success: true,
      e,
      ciphertext_hex: cHex,
      recovered_message: recoveredText,
      flag: recoveredText.includes('CYBERLAB{') ? recoveredText : null
    };
  }

  handleCryptoRsaFactorization(nHex, e = 65537, cHex) {
    const cleanN = (nHex || '').replace(/^0x/i, '').trim();
    const cleanC = (cHex || '').replace(/^0x/i, '').trim();
    if (!cleanN || !cleanC || !/^[0-9a-fA-F]+$/.test(cleanN) || !/^[0-9a-fA-F]+$/.test(cleanC)) {
      return { success: false, error: 'Paramètres RSA hexadécimaux invalides.' };
    }
    const N = BigInt('0x' + cleanN);
    const C = BigInt('0x' + cleanC);
    const E = BigInt(e);

    // Factorisation de N : Fermat ou division d'essais
    let p = BigInt(0);
    let q = BigInt(0);

    // Essai Fermat : a = ceil(sqrt(N))
    let a = BigInt(Math.ceil(Math.sqrt(Number(N))));
    let b2 = a * a - N;
    let maxSteps = 100000;
    while (maxSteps-- > 0) {
      let b = BigInt(Math.floor(Math.sqrt(Number(b2))));
      if (b * b === b2) {
        p = a - b;
        q = a + b;
        break;
      }
      a += BigInt(1);
      b2 = a * a - N;
    }

    if (p <= BigInt(1) || p * q !== N) {
      for (let d = BigInt(3); d * d <= N && d < BigInt(1000000); d += BigInt(2)) {
        if (N % d === BigInt(0)) {
          p = d;
          q = N / d;
          break;
        }
      }
    }

    if (p <= BigInt(1) || p * q !== N) {
      return { success: false, error: 'Échec de la factorisation : module RSA non vulnérable.' };
    }

    const phi = (p - BigInt(1)) * (q - BigInt(1));

    // Calcul de d = modInverse(E, phi) via Euclide étendu
    function egcd(a, b) {
      if (b === BigInt(0)) return [a, BigInt(1), BigInt(0)];
      const [g, x1, y1] = egcd(b, a % b);
      const x = y1;
      const y = x1 - (a / b) * y1;
      return [g, x, y];
    }
    const [g, x] = egcd(E, phi);
    const d = (x % phi + phi) % phi;

    // Déchiffrement : m = C^d mod N
    function modPow(base, exp, mod) {
      let res = BigInt(1);
      base = base % mod;
      while (exp > BigInt(0)) {
        if (exp % BigInt(2) === BigInt(1)) res = (res * base) % mod;
        base = (base * base) % mod;
        exp = exp / BigInt(2);
      }
      return res;
    }

    const m = modPow(C, d, N);
    let mHex = m.toString(16);
    if (mHex.length % 2 !== 0) mHex = '0' + mHex;
    const recovered = Buffer.from(mHex, 'hex').toString('utf8');

    return {
      success: true,
      p: p.toString(),
      q: q.toString(),
      phi: phi.toString(),
      d: d.toString(16),
      recovered_message: recovered,
      flag: 'CYBERLAB{RSA_FACTORIZATION_FERMAT_PRIVATE_KEY_RECOVERED_882}'
    };
  }

  handleCryptoHashCrack(targetHash, hashType = 'sha256', customWordlist = []) {
    const hash = (targetHash || '').toLowerCase().trim();
    const type = (hashType || 'sha256').toLowerCase().trim();
    const defaultDict = [
      'admin', 'password', '123456', 'secret', 'operator', 'aegis2026', 'root',
      'CYBERLAB', 'dragon', 'qwerty', 'football', 'master', 'security', 'chimera'
    ];
    const words = Array.from(new Set([...defaultDict, ...(Array.isArray(customWordlist) ? customWordlist : [])]));

    for (const word of words) {
      let h = '';
      if (type === 'md5') {
        h = crypto.createHash('md5').update(word).digest('hex');
      } else if (type === 'sha1') {
        h = crypto.createHash('sha1').update(word).digest('hex');
      } else {
        h = crypto.createHash('sha256').update(word).digest('hex');
      }

      if (h.toLowerCase() === hash) {
        return {
          success: true,
          cracked: true,
          hash,
          type,
          plaintext: word,
          flag: 'CYBERLAB{HASH_CRACKING_DICTIONARY_MATCH_FOUND_991}',
          message: `Condensat ${type.toUpperCase()} cassé avec succès : mot de passe identifié "${word}".`
        };
      }
    }

    return {
      success: false,
      cracked: false,
      hash,
      type,
      error: 'Mot de passe non trouvé dans le dictionnaire standard.'
    };
  }

  handleCryptoPaddingOracle(cipherHex, ivHex) {
    const clean = (cipherHex || '').replace(/^0x/i, '').trim();
    const cipher = Buffer.from(clean, 'hex');
    const iv = Buffer.from(ivHex || '', 'hex');
    if (cipher.length === 0 || cipher.length % 16 !== 0) {
      return { valid_padding: false, error: 'Taille de bloc AES invalide (doit être multiple de 16 octets).' };
    }
    const padLen = cipher[cipher.length - 1];
    let isValid = padLen >= 1 && padLen <= 16;
    if (isValid) {
      for (let i = cipher.length - padLen; i < cipher.length; i++) {
        if (cipher[i] !== padLen) {
          isValid = false;
          break;
        }
      }
    }
    return {
      valid_padding: isValid,
      leak_info: isValid ? 'Padding PKCS#7 correct (Status 200 OK)' : 'Padding PKCS#7 corrompu (Status 500 Cryptographic Exception)',
      vulnerability: 'CBC_PADDING_ORACLE_ACTIVE'
    };
  }

  verifyCryptoRemediation(remediationType, params = {}) {
    if (remediationType === 'migrate_to_gcm') {
      const isGcm = (params.algorithm || '').toUpperCase().includes('GCM');
      return {
        success: isGcm,
        hardened: isGcm,
        message: isGcm
          ? 'Remédiation validée : Passage réussi à AES-256-GCM (Chiffrement Authentifié AEAD). L\'oracle de padding est neutralisé.'
          : 'Échec : Vous devez utiliser un mode authentifié tel que AES-256-GCM ou ChaCha20-Poly1305.'
      };
    }
    if (remediationType === 'constant_time') {
      const constantCompare = params.use_constant_time === true;
      return {
        success: constantCompare,
        hardened: constantCompare,
        message: constantCompare
          ? 'Remédiation validée : Utilisation de crypto.timingSafeEqual() pour éliminer les attaques par canal auxiliaire.'
          : 'Échec : La comparaison classique avec === fuit les temps de réponse.'
      };
    }
    return { success: false, message: 'Type de remédiation inconnu.' };
  }

  // --- 2. FORENSICS & DFIR ---
  handleForensicsPcapAnalyze(streamId) {
    const sessions = {
      'stream-ftp': {
        proto: 'FTP',
        client_ip: '192.168.1.45',
        server_ip: '192.168.1.10',
        commands: [
          'USER backup_operator',
          'PASS SecPass_9921_Aegis!',
          'TYPE I',
          'RETR confidential_vault.kdbx'
        ],
        extracted_credentials: { user: 'backup_operator', pass: 'SecPass_9921_Aegis!' },
        flag: 'CYBERLAB{DFIR_PCAP_STREAM_FTP_CREDENTIALS_RECOVERED_882}'
      },
      'stream-dns-tunnel': {
        proto: 'DNS',
        client_ip: '10.0.0.12',
        server_ip: '8.8.8.8',
        queries: [
          '43594245524c4142.c2.shadow-apt.org',
          '7b444e535f455846.c2.shadow-apt.org',
          '494c54524154494f.c2.shadow-apt.org',
          '4e5f3939317d.c2.shadow-apt.org'
        ],
        extracted_data: 'CYBERLAB{DNS_EXFILTRATION_HEX_DECODED_991}'
      }
    };
    return sessions[streamId] || {
      available_streams: ['stream-ftp', 'stream-dns-tunnel'],
      hint: 'Spécifiez streamId=stream-ftp ou streamId=stream-dns-tunnel.'
    };
  }

  handleForensicsMemoryDump() {
    return {
      pslist: [
        { pid: 4, name: 'System', ppid: 0, threads: 142 },
        { pid: 388, name: 'smss.exe', ppid: 4, threads: 4 },
        { pid: 512, name: 'csrss.exe', ppid: 388, threads: 12 },
        { pid: 612, name: 'lsass.exe', ppid: 512, threads: 8 },
        { pid: 1337, name: 'svchost.exe', ppid: 512, threads: 2, path: 'C:\\Users\\Public\\svchost.exe', anomaly: 'CHEMIN_SUSPECT_CODE_INJECTE' }
      ],
      injected_process: {
        pid: 1337,
        name: 'svchost.exe',
        memory_region: '0x00400000 - 0x0041F000',
        protection: 'PAGE_EXECUTE_READWRITE',
        extracted_strings: ['CHIMERA_STAGE2_BEACON', 'CONNECT tcp://c2.chimera-apt.org:4444', 'CYBERLAB{DFIR_MEMORY_INJECTED_PROCESS_UNMASKED_1337}']
      }
    };
  }

  handleForensicsStegoLsb(sampleId) {
    if (sampleId === 'image-badge.bmp') {
      return {
        filename: 'image-badge.bmp',
        extracted_bits: '01000011 01011001 01000010 01000101 01010010 01001100 01000001 01000010 ...',
        hidden_payload: 'CYBERLAB{LSB_STEGO_IMAGE_BITMAP_EXTRACTED_442}',
        algorithm: 'Least Significant Bit (LSB) sur composante Rouge (R)'
      };
    }
    return { error: 'Fichier image introuvable. Utilisez sampleId=image-badge.bmp.' };
  }

  verifyForensicsSigmaRule(ruleYaml) {
    const content = (ruleYaml || '').toLowerCase();
    const hasLogsource = content.includes('logsource:') || content.includes('category: process_creation');
    const hasDetection = content.includes('detection:') && (content.includes('c:\\users\\public') || content.includes('1337'));
    const hasCondition = content.includes('condition:');

    const isValid = hasLogsource && hasDetection && hasCondition;
    return {
      success: isValid,
      valid: isValid,
      message: isValid
        ? 'Règle Sigma validée : Détection certifiée de l\'exécutable imposteur sous C:\\Users\\Public.'
        : 'Règle Sigma invalide : Doit contenir logsource, detection avec chemin suspect, et condition.'
    };
  }

  // --- 3. RÉTRO-INGÉNIERIE & BINAIRE ---
  handleReverseElfInspect() {
    return {
      format: 'ELF 64-bit LSB pie executable, x86-64, version 1 (SYSV)',
      interpreter: '/lib64/ld-linux-x86-64.so.2',
      sections: ['.interp', '.text', '.rodata', '.data', '.got', '.plt'],
      imported_symbols: ['puts', 'printf', 'strcmp', '__stack_chk_fail', 'fgets'],
      interesting_strings: [
        'CYBERLAB Crackme v1.0',
        'Entrez la cle de licence : ',
        'ACCES_ACCORDE_ROOT_2026',
        'Bravo ! Licence valide.',
        'FLAG: CYBERLAB{REVERSE_ELF_STRINGS_STRCMP_DISSECTED_771}'
      ]
    };
  }

  handleReversePeInspect() {
    return {
      success: true,
      format: 'PE32+ executable (GUI) x86-64, for MS Windows',
      dos_header: { magic: '0x5A4D (MZ)', e_lfanew: '0x00000080' },
      nt_headers: {
        signature: 'IMAGE_NT_SIGNATURE (0x00004550)',
        machine: 'IMAGE_FILE_MACHINE_AMD64 (0x8664)',
        number_of_sections: 5,
        subsystem: 'IMAGE_SUBSYSTEM_WINDOWS_GUI (0x0002)'
      },
      sections: [
        { name: '.text', virtual_size: '0x00012A00', entropy: 6.42, characteristics: 'IMAGE_SCN_MEM_EXECUTE | IMAGE_SCN_MEM_READ' },
        { name: '.rdata', virtual_size: '0x00005C00', entropy: 5.12, characteristics: 'IMAGE_SCN_MEM_READ' },
        { name: '.data', virtual_size: '0x00001800', entropy: 3.84, characteristics: 'IMAGE_SCN_MEM_READ | IMAGE_SCN_MEM_WRITE' },
        { name: '.pdata', virtual_size: '0x00000C00', entropy: 4.15, characteristics: 'IMAGE_SCN_MEM_READ' }
      ],
      imported_libraries: {
        'KERNEL32.dll': ['VirtualAlloc', 'WriteProcessMemory', 'CreateRemoteThread', 'IsDebuggerPresent', 'GetProcAddress'],
        'ADVAPI32.dll': ['OpenProcessToken', 'LookupPrivilegeValueW', 'AdjustTokenPrivileges']
      },
      extracted_strings: [
        'Aegis Security Sentinel Agent v2.4',
        'SeDebugPrivilege',
        '\\pipe\\aegis_ipc_channel',
        'FLAG: CYBERLAB{REVERSE_PE_WINDOWS_PORTABLE_EXECUTABLE_HEADER_PARSED_771}'
      ],
      flag: 'CYBERLAB{REVERSE_PE_WINDOWS_PORTABLE_EXECUTABLE_HEADER_PARSED_771}'
    };
  }

  handleReverseDeobfuscate(scriptContent) {
    const raw = (scriptContent || '').trim();
    if (!raw) return { success: false, error: 'Script obfusqué manquant.' };

    let cleaned = raw;
    let decodedFlag = null;

    // Détection et décodage Base64 (UTF-8 et UTF-16LE pour PowerShell)
    const b64Match = raw.match(/(?:from_base64|atob|FromBase64String|-enc|-encodedcommand)\s*\(?['"]?([A-Za-z0-9+/=]{16,})['"]?\)?/i);
    if (b64Match) {
      try {
        const buf = Buffer.from(b64Match[1], 'base64');
        let decoded = buf.toString('utf8');
        if (decoded.includes('\0') || /-enc|-encodedcommand/i.test(b64Match[0])) {
          const u16 = buf.toString('utf16le');
          if (u16 && !u16.includes('\0')) {
            decoded = u16;
          }
        }
        cleaned = raw.replace(b64Match[0], `/* DECODED: */ ${decoded}`);
        if (decoded.includes('CYBERLAB{')) decodedFlag = decoded;
      } catch {}
    }

    // Détection String.fromCharCode(...)
    const charCodeMatch = raw.match(/String\.fromCharCode\s*\(([\d\s,]+)\)/i);
    if (charCodeMatch) {
      const numbers = charCodeMatch[1].split(',').map(n => parseInt(n.trim(), 10));
      const str = String.fromCharCode(...numbers);
      cleaned = cleaned.replace(charCodeMatch[0], JSON.stringify(str));
      if (str.includes('CYBERLAB{')) decodedFlag = str;
    }

    // Détection de tableau hex \x43\x59...
    const hexEscapes = raw.match(/(?:\\x[0-9a-fA-F]{2}){4,}/g);
    if (hexEscapes) {
      hexEscapes.forEach(hexSeq => {
        const bytes = hexSeq.split('\\x').filter(Boolean).map(b => parseInt(b, 16));
        const str = String.fromCharCode(...bytes);
        cleaned = cleaned.replace(hexSeq, JSON.stringify(str));
        if (str.includes('CYBERLAB{')) decodedFlag = str;
      });
    }

    if (!decodedFlag) {
      decodedFlag = 'CYBERLAB{REVERSE_DEOBFUSCATION_PAYLOAD_UNPACKED_993}';
    }

    return {
      success: true,
      original_length: raw.length,
      deobfuscated_script: cleaned,
      extracted_payload: decodedFlag,
      flag: decodedFlag
    };
  }

  handleReverseCrackmeVerify(serialKey) {
    const key = (serialKey || '').trim();
    if (key === 'ACCES_ACCORDE_ROOT_2026' || key === 'KEY-AEGIS-2026-X99') {
      return {
        success: true,
        valid: true,
        flag: 'CYBERLAB{CRACKME_KEYGEN_REVERSE_ENGINEERING_SOLVED_992}',
        message: 'Licence authentifiée ! Accès accordé au noyau.'
      };
    }
    return { success: false, valid: false, error: 'Cle de serie invalide.' };
  }

  handleReverseBufferOverflow(paddingSize, targetAddress) {
    const pad = parseInt(paddingSize, 10);
    const addr = (targetAddress || '').toLowerCase().trim();

    // Tampon de 64 octets + 8 octets de saved RBP = 72 octets d'offset
    const correctOffset = 72;
    const correctTarget = '0x004011f6'; // Adresse de print_flag()

    if (pad === correctOffset && (addr === correctTarget || addr === '0x4011f6')) {
      return {
        success: true,
        exploited: true,
        eip_overwritten: true,
        redirected_to: correctTarget,
        stdout: `Tampon de 64 octets sature.\nSaved RBP ecrase.\nRIP redirige vers print_flag() a ${correctTarget}.\nFlag: CYBERLAB{BUFFER_OVERFLOW_STACK_CORRUPTION_RIP_REDIRECTED_881}`
      };
    }

    if (pad < 64) {
      return { success: false, error: 'Padding insuffisant : le tampon n\'est pas rempli (taille < 64 octets).' };
    }
    if (pad >= 64 && pad < 72) {
      return { success: false, error: 'Offset partiel : vous avez ecrasé une variable locale mais pas l\'adresse de retour (il manque le saved RBP).' };
    }
    return {
      success: false,
      error: `Segmentation Fault. Padding=${pad}, Target=${addr}. L'adresse de retour cible n'est pas print_flag (0x004011f6).`
    };
  }

  verifyReverseChecksec(hardeningFlags = {}) {
    const hasCanary = hardeningFlags.canary === true;
    const hasNx = hardeningFlags.nx === true;
    const hasPie = hardeningFlags.pie === true;
    const isHardened = hasCanary && hasNx && hasPie;

    return {
      success: isHardened,
      hardened: isHardened,
      checksec: {
        canary: hasCanary ? 'Stack Canary Found' : 'No Canary',
        nx: hasNx ? 'NX Enabled' : 'NX Disabled',
        pie: hasPie ? 'PIE Enabled' : 'No PIE'
      },
      message: isHardened
        ? 'Durcissement binaire validé : Options -fstack-protector-strong, -z noexecstack et -fPIE actives.'
        : 'Vulnérabilité binaire persistante : Activez Canary, NX et PIE.'
    };
  }

  // --- 4. ACTIVE DIRECTORY & WINDOWS ---
  handleAdLdapQuery() {
    return {
      domain: 'AEGIS.LOCAL',
      forest_level: 'Windows Server 2022',
      users: [
        { sam: 'krbtgt', desc: 'Key Distribution Center Service Account', spn: [] },
        { sam: 'svc_mssql', desc: 'Compte de service SQL Database', spn: ['MSSQLSvc/db01.aegis.local:1433'], dont_req_preauth: false },
        { sam: 'j.smith', desc: 'Helpdesk Tech', dont_req_preauth: true, spn: [] },
        { sam: 'secops_admin', desc: 'Domain Administrator', admin_count: 1, spn: [] }
      ],
      bloodhound_path: 'j.smith -> GenericAll -> Helpdesk_Group -> MemberOf -> Domain Admins'
    };
  }

  handleAdAsRepRoast(targetUser) {
    const user = (targetUser || '').toLowerCase().trim();
    if (user === 'j.smith') {
      return {
        success: true,
        vulnerable: true,
        user: 'j.smith',
        as_rep_hash: '$krb5asrep$23$j.smith@AEGIS.LOCAL:c47a98b1d4ef32...$f8a19c4b2210',
        cracked_password: 'Password123!',
        flag: 'CYBERLAB{AD_ASREP_ROASTING_NO_PREAUTH_CRACKED_332}'
      };
    }
    return { success: false, error: `L'utilisateur ${targetUser} n'a pas l'attribut DONT_REQ_PREAUTH actif.` };
  }

  handleAdKerberoast(spnName) {
    if ((spnName || '').toLowerCase().includes('mssql')) {
      return {
        success: true,
        spn: 'MSSQLSvc/db01.aegis.local:1433',
        tgs_hash: '$krb5tgs$23$*svc_mssql$AEGIS.LOCAL$MSSQLSvc/db01.aegis.local*$...',
        cracked_password: 'SQL_Enterprise_Pass#2026',
        flag: 'CYBERLAB{AD_KERBEROASTING_SERVICE_TICKET_CRACKED_771}'
      };
    }
    return { success: false, error: 'SPN invalide. Utilisez spnName=MSSQLSvc/db01.aegis.local:1433.' };
  }

  handleAdPrivilegeAbuse(technique, targetUser = 'Helpdesk_Group') {
    const tech = (technique || '').toLowerCase().trim();
    if (tech === 'generic_all' || tech === 'genericall' || tech === 'write_dacl') {
      return {
        success: true,
        technique: 'GenericAll ACL Abuse',
        target: targetUser,
        escalated_to: 'Domain Admins',
        elevation_chain: 'j.smith -> GenericAll -> Helpdesk_Group -> MemberOf -> Domain Admins',
        granted_permissions: ['ResetPassword', 'WriteMembers', 'AddSelfToGroup'],
        flag: 'CYBERLAB{AD_PRIVILEGE_ABUSE_GENERIC_ALL_DACL_TAKEOVER_661}',
        message: 'Exploitation réussie : L\'ACL GenericAll permet d\'ajouter j.smith directement au groupe Domain Admins.'
      };
    }
    if (tech === 'se_impersonate' || tech === 'seimpersonate' || tech === 'potato') {
      return {
        success: true,
        technique: 'SeImpersonatePrivilege Abuse (PrintSpoofer/JuicyPotato)',
        target: 'svc_mssql -> NT AUTHORITY\\SYSTEM',
        escalated_to: 'NT AUTHORITY\\SYSTEM',
        token_stolen: 'SYSTEM (S-1-5-18)',
        flag: 'CYBERLAB{AD_PRIVILEGE_ABUSE_SE_IMPERSONATE_SYSTEM_882}',
        message: 'Exploitation réussie : Le privilège SeImpersonate actif sur le compte de service a permis d\'intercepter un jeton SYSTEM via un tube nommé RPC.'
      };
    }
    return {
      success: false,
      error: 'Technique d\'abus de privilèges non reconnue. Utilisez technique=generic_all ou technique=se_impersonate.'
    };
  }

  verifyAdHardening(hardeningSettings = {}) {
    const enforcePreauth = hardeningSettings.enforce_preauth === true;
    const useGmsa = hardeningSettings.use_gmsa === true;
    const isHardened = enforcePreauth && useGmsa;

    return {
      success: isHardened,
      hardened: isHardened,
      message: isHardened
        ? 'Durcissement Active Directory validé : Pré-authentification Kerberos obligatoire et migration vers gMSA (Group Managed Service Accounts).'
        : 'Vulnérabilités AD restantes : Activez enforce_preauth et use_gmsa.'
    };
  }

  // --- 5. CLOUD, CONTENEURS & API ---
  handleCloudS3List() {
    return {
      bucket: 'aegis-confidential-backups',
      policy: 'Public READ (AllUsers)',
      objects: [
        { key: '2026-01-database_dump.sql.gz', size: 45021000 },
        { key: 'api_keys_credentials.json', size: 1024 },
        { key: 'readme.txt', size: 142 }
      ]
    };
  }

  handleCloudS3ReadObject(key) {
    if (key === 'api_keys_credentials.json') {
      return {
        success: true,
        key,
        content: {
          aws_access_key_id: 'AKIAIOSFODNN7EXAMPLE',
          aws_secret_access_key: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
          flag: 'CYBERLAB{CLOUD_S3_BUCKET_OPEN_CREDENTIALS_EXPOSED_994}'
        }
      };
    }
    return { success: false, error: 'Objet introuvable ou restreint.' };
  }

  handleCloudDockerEscape(command) {
    const cmd = (command || '').toLowerCase();
    if (cmd.includes('docker run') && (cmd.includes('-v /:/') || cmd.includes('--privileged'))) {
      return {
        success: true,
        host_access: true,
        message: 'Conteneur privilégié lancé avec montage de la racine hôte (/:/host).',
        root_flag: 'CYBERLAB{CLOUD_DOCKER_SOCKET_ESCAPE_HOST_ROOT_881}'
      };
    }
    return { success: false, error: 'La commande ne monte pas le système de fichiers hôte de façon privilégiée.' };
  }

  handleCloudApiAudit(vulnerabilityType, params = {}) {
    const vuln = (vulnerabilityType || '').toLowerCase().trim();
    if (vuln === 'bola' || vuln === 'idor') {
      const patientId = params.target_id || params.target_account_id || '992';
      return {
        success: true,
        unauthorized_access: true,
        vulnerability: 'BOLA (Broken Object Level Authorization)',
        endpoint: `/api/v1/patient/${patientId}/records`,
        accessed_record: {
          patient_id: patientId,
          full_name: 'Dr. Éléonore Vane - Directrice Sécurité',
          confidential_diagnostics: 'Exfiltration de données autorisée sans contrôle d\'appartenance.',
          flag: 'CYBERLAB{CLOUD_API_BOLA_MASS_ASSIGNMENT_VULNERABILITY_CONFIRMED_551}'
        },
        flag: 'CYBERLAB{CLOUD_API_BOLA_MASS_ASSIGNMENT_VULNERABILITY_CONFIRMED_551}',
        remediation: 'Valider le token JWT de session et vérifier que req.user.id === record.owner_id.'
      };
    }
    if (vuln === 'mass_assignment' || vuln === 'massassignment') {
      const payload = params.payload || { role: 'admin', is_superuser: true };
      return {
        success: true,
        privilege_escalation: true,
        vulnerability: 'Mass Assignment (Attribution Massive de Propriétés)',
        endpoint: '/api/v1/users/profile',
        injected_fields: payload,
        account_status: 'ELEVATED_TO_SUPERUSER_ADMIN',
        flag: 'CYBERLAB{CLOUD_API_BOLA_MASS_ASSIGNMENT_VULNERABILITY_CONFIRMED_551}',
        remediation: 'Utiliser des Data Transfer Objects (DTO) stricts avec liste blanche de champs autorisés.'
      };
    }
    return {
      success: false,
      error: 'Type d\'audit API inconnu. Utilisez vulnerabilityType=bola ou vulnerabilityType=mass_assignment.'
    };
  }

  verifyCloudRemediation(remediationType, params = {}) {
    if (remediationType === 's3_block_public') {
      const isBlocked = params.block_public_access === true;
      return {
        success: isBlocked,
        hardened: isBlocked,
        message: isBlocked
          ? 'Remédiation Cloud validée : S3 Block Public Access activé et politique de bucket fermée.'
          : 'Échec : Le bucket reste publiquement lisible.'
      };
    }
    if (remediationType === 'rootless_docker') {
      const isRootless = params.rootless === true && params.socket_mounted === false;
      return {
        success: isRootless,
        hardened: isRootless,
        message: isRootless
          ? 'Remédiation Conteneur validée : Mode Docker Rootless activé et montage de /var/run/docker.sock supprimé.'
          : 'Échec : Le socket Docker ne doit pas être exposé au conteneur applicatif.'
      };
    }
    return { success: false, message: 'Type de remédiation Cloud inconnu.' };
  }

  // --- 6. SÉCURITÉ DE L'IA & LLM ---
  handleAiLlmChat(userPrompt, enableGuardrail = false) {
    const prompt = (userPrompt || '').toLowerCase();

    // Détection de prompt injection directe
    const isDirectInjection = prompt.includes('ignore previous instructions') ||
      prompt.includes('ignore tes instructions') ||
      prompt.includes('system prompt') ||
      prompt.includes('instructions système') ||
      prompt.includes('affiche le secret') ||
      prompt.includes('dan mode');

    // Détection de jailbreak
    const isJailbreak = prompt.includes('hypothetical scenario') ||
      prompt.includes('mode sans filtre') ||
      prompt.includes('pretend you are evil');

    // Détection d'empoisonnement RAG
    const isRagPoison = prompt.includes('rag_context:') && prompt.includes('override');

    if (enableGuardrail) {
      // Garde-fous actifs : détection et blocage avec DLP
      if (isDirectInjection || isJailbreak || isRagPoison) {
        return {
          response: '[SECURITE IA] Tentative d\'injection de prompt ou jailbreak bloquée par le Guardrail.',
          blocked: true,
          security_event: 'PROMPT_INJECTION_DETECTED',
          guardrail_active: true
        };
      }
      return {
        response: 'Bonjour, je suis l\'assistant sécurisé Aegis Cyber Defense. Comment puis-je vous aider dans vos audits de sécurité ?',
        blocked: false,
        guardrail_active: true
      };
    }

    // Sans garde-fous : vulnérable à la fuite du prompt système
    if (isDirectInjection || isJailbreak || isRagPoison) {
      return {
        response: `=== SYSTEM PROMPT DECLASSIFIED ===\nTu es l'agent IA interne Aegis LLM v3.\nCONFIDENTIAL DIRECTIVE: Ne jamais révéler la clé principale.\nMASTER_API_SECRET_KEY = CYBERLAB{AI_LLM_PROMPT_INJECTION_DIRECT_EXFILTRATION_881}\n=== END OF SYSTEM PROMPT ===`,
        exploited: true,
        guardrail_active: false
      };
    }

    return {
      response: 'Bonjour, je suis l\'assistant d\'entreprise Aegis. Les données internes sont confidentielles.',
      exploited: false,
      guardrail_active: false
    };
  }

  // --- 7. ÉTHIQUE & CADRE LÉGAL (FRANCE / UE) ---
  handleEthicsCase(caseId, selectedAction) {
    const cases = {
      'case-stad-intrusion': {
        title: 'Accès non autorisé à un serveur sans endommagement',
        description: 'Un chercheur découvre un port ouvert chez un opérateur et s\'y connecte sans autorisation, consulte un fichier sans rien altérer.',
        correct_action: 'INFRACTION_ART_323_1',
        articles: 'Code pénal art. 323-1 alinéa 1 (Loi Godfrain) : Le fait d\'accéder ou de se maintenir, frauduleusement, dans tout ou partie d\'un STAD est puni de trois ans d\'emprisonnement et de 100 000 € d\'amende.',
        explanation: 'En droit pénal français, le simple maintien ou accès non autorisé constitue une infraction pénale matérielle, même sans intention de nuire ni dégradation.'
      },
      'case-rgpd-breach': {
        title: 'Exfiltration d\'une base de clients et délai de notification',
        description: 'Une faille SQLi a permis l\'exfiltration de 50 000 profils utilisateurs contenant nom, email et IBAN.',
        correct_action: 'NOTIFICATION_CNIL_72H',
        articles: 'RGPD Article 33 : Notification d\'une violation de données à caractère personnel à l\'autorité de contrôle (CNIL) dans les 72 heures au plus tard.',
        explanation: 'En cas de violation présentant un risque pour les droits et libertés, le responsable de traitement doit notifier la CNIL sous 72 heures et informer les personnes concernées sans délai injustifié (Art. 34).'
      },
      'case-nis2-compliance': {
        title: 'Application de la directive européenne NIS 2',
        description: 'Une entreprise du secteur de la santé ou de l\'énergie doit se conformer aux exigences de cybersécurité NIS 2.',
        correct_action: 'MESURES_GESTION_RISQUES_ET_SIGNALEMENT_24H',
        articles: 'Directive NIS 2 (UE 2022/2555) : Obligation d\'adopter des mesures techniques et organisationnelles de gestion des risques cyber, et alerte précoce sous 24h à l\'ANSSI.',
        explanation: 'NIS 2 étend le périmètre aux entités essentielles et importantes avec des obligations strictes de gouvernance et de déclaration rapide.'
      },
      'case-mandate-roe': {
        title: 'Règles d\'Engagement (RoE) et Convention d\'Audit Écrite',
        description: 'Un consultant indépendant effectue un test d\'intrusion sur la demande verbale d\'un DSI sans signature préalable d\'une convention de pentest.',
        correct_action: 'MANDAT_ECRIT_EXIGIBILITE_LEGALE',
        articles: 'Jurisprudence STAD / Art. 323-1 Code pénal : L\'autorisation doit être expresse, préalable et écrite. Sans ordre de mission ou convention d\'intrusion signée par une personne habilitée, le consentement verbal est inopposable.',
        explanation: 'En droit pénal français, une convention écrite d\'audit technique (Rules of Engagement) est la condition sine qua non pour écarter l\'élément matériel et moral de l\'intrusion frauduleuse.'
      }
    };

    const targetCase = cases[caseId];
    if (!targetCase) return { error: 'Cas d\'étude éthique et légal introuvable.' };

    const isCorrect = selectedAction === targetCase.correct_action;
    return {
      case_id: caseId,
      case_title: targetCase.title,
      is_correct: isCorrect,
      legal_articles: targetCase.articles,
      analysis: targetCase.explanation,
      flag: isCorrect ? 'CYBERLAB{ETHICS_LEGAL_STAD_RGPD_NIS2_COMPLIANCE_CERTIFIED_2026}' : null
    };
  }
}

module.exports = SkillTreeManager;

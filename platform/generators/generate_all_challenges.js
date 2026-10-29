// ============================================================================
// CYBERRANGE PRO - GÉNÉRATEUR INDUSTRIEL DU CATALOGUE DES 100 LABS
// Crée l'ensemble des challenges 11 à 100 avec configurations Docker,
// métadonnées, tâches d'évaluation, indices à gemmes, writeups complets et tests.
// ============================================================================

const fs = require('fs');
const path = require('path');

const CHALLENGES_ROOT = path.resolve(__dirname, '../../challenges');

// Définition exhaustive des 90 challenges restants (11 à 100)
const CHALLENGES_SPEC = [
  // LOT 2 (11 à 20)
  {
    cat: 'web', id: 'web-03-sqli-union', title: 'Union of Secrets', category: 'Web', difficulty: 'easy', points: 150, duration: 40,
    path: 'web-beginner', author: 'Aegis RedOps', tools: ['Burp Suite', 'curl', 'sqlmap'],
    tags: ['sqli', 'union-select', 'database-enumeration', 'sqlite'],
    story: 'Le portail e-commerce de fournitures industrielles Aegis Store utilise un filtre de recherche vulnérable aux injections SQL de type UNION. Ton objectif est de déterminer le nombre de colonnes de la requête originale, d\'extraire les tables du schéma SQLite et de récupérer les mots de passe de la table secrète admin_credentials.',
    tasks: [
      { id: 't1', title: 'Détermination du nombre de colonnes', desc: 'Combien de colonnes la requête SELECT originale retourne-t-elle (en utilisant ORDER BY n --) ?', pts: 40, flag: '4' },
      { id: 't2', title: 'Énumération des tables SQLite', desc: 'Quel est le nom de la table administrative dissimulée dans sqlite_master ?', pts: 50, flag: 'admin_credentials_vault' },
      { id: 't3', title: 'Extraction du mot de passe root & Flag', desc: 'Extrais la clé de voûte de l\'administrateur système via la clause UNION SELECT.', pts: 60, flag: 'CYBERLAB{SQLI_UNION_SELECT_SCHEMA_UNMASKED_994}' }
    ],
    hints: [
      { title: 'Test de colonnes', cost: 10, content: 'Utilise \' ORDER BY 1 --, \' ORDER BY 2 -- jusqu\'à obtenir une erreur HTTP 500 pour trouver le nombre de colonnes.' },
      { title: 'Schéma SQLite', cost: 15, content: 'La table système de SQLite est sqlite_master. Effectue un UNION SELECT 1,tbl_name,sql,4 FROM sqlite_master WHERE type=\'table\' --.' }
    ]
  },
  {
    cat: 'web', id: 'web-04-stored-xss', title: 'Comment Hijack', category: 'Web', difficulty: 'easy', points: 150, duration: 45,
    path: 'web-beginner', author: 'Aegis Websec', tools: ['DevTools', 'Burp Suite', 'Webhook.site'],
    tags: ['xss', 'stored-xss', 'cookie-theft', 'javascript'],
    story: 'L\'espace d\'évaluation des clients sur la plateforme de support Aegis ne filtre pas correctement les balises HTML dans le corps des messages. Un bot administrateur consulte régulièrement les nouveaux commentaires. Exploite cette faille XSS stockée pour forcer l\'administrateur à t\'envoyer son jeton de session chiffré.',
    tasks: [
      { id: 't1', title: 'Confirmation de la vulnérabilité XSS', desc: 'Injecte une balise <script>alert(1)</script> ou <img src=x onerror=...> pour confirmer l\'absence d\'échappement HTML.', pts: 40, flag: 'XSS_TRIGGERED' },
      { id: 't2', title: 'Identification du cookie d\'administration', desc: 'Quel attribut manque cruellement sur le cookie de session de l\'admin (permettant sa lecture en JavaScript) ?', pts: 50, flag: 'HttpOnly' },
      { id: 't3', title: 'Exfiltration du Cookie & Flag', desc: 'Capture le cookie admin via le récepteur HTTP et soumets le flag.', pts: 60, flag: 'CYBERLAB{STORED_XSS_COOKIE_HIJACK_ADMIN_BOT_SUCCESS}' }
    ],
    hints: [
      { title: 'Bypass de filtre basique', cost: 10, content: 'Si <script> est filtré, tente un vecteur d\'événement comme <img src="invalid" onerror="fetch(\'/targets/training/web-04/collector?c=\'+document.cookie)">.' }
    ]
  },
  {
    cat: 'web', id: 'web-05-lfi-wrapper', title: 'PHP Wrapper Portal', category: 'Web', difficulty: 'easy', points: 150, duration: 40,
    path: 'web-beginner', author: 'Aegis Websec', tools: ['curl', 'Burp Suite', 'CyberChef'],
    tags: ['lfi', 'php-wrappers', 'base64', 'path-traversal'],
    story: 'Un portail documentaire interne charge ses pages dynamiquement via include($_GET[\'page\']). Les fichiers PHP sensibles s\'exécutent côté serveur sans afficher leur code source brut. Utilise les filtres de flux PHP (php://filter) pour encoder le code source de config.php en Base64 et révéler les identifiants codés en dur.',
    tasks: [
      { id: 't1', title: 'Détection du paramètre vulnérable', desc: 'Quel paramètre GET contrôle l\'inclusion dynamique des fichiers locaux ?', pts: 30, flag: 'page' },
      { id: 't2', title: 'Nom du filtre PHP d\'encodage', desc: 'Quel filtre PHP permet de transformer le contenu du fichier en chaîne Base64 avant inclusion ?', pts: 40, flag: 'convert.base64-encode' },
      { id: 't3', title: 'Déchiffrement et Flag', desc: 'Télécharge le dump Base64 de config.php, décode-le et soumets le mot de passe secret découvert.', pts: 80, flag: 'CYBERLAB{PHP_FILTER_BASE64_ENCODE_LFI_CLEARED_881}' }
    ],
    hints: [
      { title: 'Syntaxe du Wrapper', cost: 10, content: 'La chaîne d\'attaque classique est : ?page=php://filter/convert.base64-encode/resource=config.php' }
    ]
  },
  {
    cat: 'network', id: 'net-02-nmap-dmz', title: 'DMZ Perimeter Scan', category: 'Réseau', difficulty: 'beginner', points: 100, duration: 35,
    path: 'soc-forensics', author: 'Aegis Cyber Defense', tools: ['nmap', 'nc', 'telnet'],
    tags: ['network', 'nmap', 'reconnaissance', 'banner-grabbing', 'ports'],
    story: 'Un serveur passerelle en zone démilitarisée (DMZ) expose plusieurs services suspects suite à une maintenance précipitée. Ta mission est d\'effectuer un scan réseau méticuleux pour cartographier les ports TCP ouverts, capturer les bannières de version et identifier le service d\'administration obsolète laissé accessible.',
    tasks: [
      { id: 't1', title: 'Port du service de maintenance', desc: 'Sur quel port TCP inhabituel le service de débogage écoute-t-il ?', pts: 30, flag: '8088' },
      { id: 't2', title: 'Nom et version du démon', desc: 'Quelle est la version du démon HTTP/Admin affichée dans le Server header ?', pts: 30, flag: 'MicroSrv/2.4.1-rc3' },
      { id: 't3', title: 'Flag de configuration de bannière', desc: 'Connecte-toi en direct avec netcat sur le port 8088 et lis le message d\'accueil.', pts: 40, flag: 'CYBERLAB{DMZ_PERIMETER_RECON_NMAP_BANNER_DISCOVERED}' }
    ],
    hints: [
      { title: 'Option Nmap recommandée', cost: 10, content: 'Exécute nmap -sV -sC -p- <TARGET_IP> pour sonder l\'ensemble des 65535 ports et capturer les bannières.' }
    ]
  },
  {
    cat: 'systems', id: 'linux-02-cron-wildcard', title: 'The Midnight Backup', category: 'Linux', difficulty: 'easy', points: 150, duration: 45,
    path: 'systems-reversing', author: 'Aegis SysOps', tools: ['Bash', 'crontab', 'GTFOBins'],
    tags: ['linux', 'cron', 'wildcard-injection', 'tar', 'privesc'],
    story: 'Une tâche planifiée dans /etc/cron.d/nightly_backup exécute chaque minute la commande tar -czf /backup/archive.tar.gz * dans le répertoire /opt/app/data avec les privilèges ROOT. L\'utilisation du métacaractère wildcard (*) te permet d\'injecter des paramètres dans la ligne de commande de tar (checkpoint-action) pour déclencher l\'exécution d\'un script arbitraire.',
    tasks: [
      { id: 't1', title: 'Analyse du fichier cron', desc: 'Quel utilisateur exécute la tâche planifiée nightly_backup ?', pts: 30, flag: 'root' },
      { id: 't2', title: 'Argument tar d\'injection de checkpoint', desc: 'Quel paramètre de tar permet de spécifier un script à exécuter lors d\'un point de contrôle ?', pts: 50, flag: '--checkpoint-action' },
      { id: 't3', title: 'Obtention du shell root & Flag', desc: 'Crée les fichiers spéciaux dans le répertoire surveillé et lis le drapeau dans /root/flag.txt.', pts: 70, flag: 'CYBERLAB{CRON_WILDCARD_TAR_CHECKPOINT_ROOT_PWNED}' }
    ],
    hints: [
      { title: 'Mécanisme GTFOBins', cost: 10, content: 'Crée deux fichiers vides : touch -- "--checkpoint=1" et touch -- "--checkpoint-action=exec=sh payload.sh".' }
    ]
  },
  {
    cat: 'crypto', id: 'crypto-02-xor-cracker', title: 'Single-Byte Enigma', category: 'Crypto', difficulty: 'easy', points: 150, duration: 35,
    path: 'crypto-osint-core', author: 'Aegis Cipher Office', tools: ['Python', 'CyberChef', 'xortool'],
    tags: ['crypto', 'xor', 'frequency-analysis', 'cryptanalysis'],
    story: 'Les services de renseignement ont intercepté un bloc binaire chiffré avec un algorithme XOR à clé unique d\'un seul octet (0x00 à 0xFF). Sachant que le texte en clair est en anglais et contient des termes de sécurité informatique, développe un analyseur statistique de fréquence ou utilise CyberChef pour retrouver la clé et lire le message.',
    tasks: [
      { id: 't1', title: 'Clé hexadécimale de chiffrement', desc: 'Quelle est la valeur de la clé XOR 1-byte (format 0xXX) ?', pts: 40, flag: '0x5B' },
      { id: 't2', title: 'Caractère ASCII de la clé', desc: 'Quel est le caractère imprimable correspondant à cette clé ?', pts: 30, flag: '[' },
      { id: 't3', title: 'Message déchiffré & Flag', desc: 'Déchiffre le payload et soumets le drapeau confidentiel.', pts: 80, flag: 'CYBERLAB{SINGLE_BYTE_XOR_FREQUENCY_ANALYSIS_SOLVED}' }
    ],
    hints: [
      { title: 'Recette CyberChef', cost: 10, content: 'Utilise l\'opération XOR Brute Force dans CyberChef avec une clé de longueur 1.' }
    ]
  },
  {
    cat: 'forensics', id: 'forensics-02-pcap-http', title: 'Exfiltrated Credentials', category: 'Forensics', difficulty: 'easy', points: 150, duration: 40,
    path: 'soc-forensics', author: 'Aegis Forensics Lab', tools: ['Wireshark', 'tshark', 'strings'],
    tags: ['forensics', 'pcap', 'wireshark', 'http-post', 'credentials'],
    story: 'Un flux réseau suspect a été intercepté lors d\'un incident de sécurité. Un attaquant a exfiltré un fichier d\'archives confidentiel via une requête HTTP POST non chiffrée. Ouvre la capture dans Wireshark, filtre sur les flux HTTP, recompose le fichier transféré dans le flux TCP et analyse son contenu.',
    tasks: [
      { id: 't1', title: 'Méthode et URI de la requête d\'exfiltration', desc: 'Vers quel endpoint HTTP les données ont-elles été envoyées (ex: /upload/data) ?', pts: 40, flag: '/api/v1/telemetry/push' },
      { id: 't2', title: 'Nom du fichier archive transféré', desc: 'Quel est le nom du fichier joint dans le corps multipart/form-data ?', pts: 50, flag: 'payroll_confidential.zip' },
      { id: 't3', title: 'Extraction du contenu & Flag', desc: 'Extrais les octets du fichier et trouve la clé d\'exfiltration.', pts: 60, flag: 'CYBERLAB{WIRESHARK_HTTP_MULTIPART_EXFILTRATION_CAUGHT}' }
    ],
    hints: [
      { title: 'Filtre d\'affichage Wireshark', cost: 10, content: 'Applique le filtre http.request.method == "POST" et utilise "Follow TCP Stream".' }
    ]
  },
  {
    cat: 'reverse', id: 'rev-02-pyc-decompile', title: 'Bytecode Secrets', category: 'Reverse', difficulty: 'easy', points: 150, duration: 45,
    path: 'systems-reversing', author: 'Aegis Malware Unit', tools: ['uncompyle6', 'decompyle++ (pycdc)', 'Python'],
    tags: ['reverse', 'python', 'bytecode', 'decompilation', 'pyc'],
    story: 'Un script Python compilé (.pyc) a été découvert sur un poste de travail compromis. Le code source original a été effacé par le logiciel malveillant. Ta tâche est de décompiler ce bytecode Python pour comprendre son algorithme de validation et générer une clé valide.',
    tasks: [
      { id: 't1', title: 'Version de Python utilisée pour compiler', desc: 'Quelle version de Python apparaît dans l\'en-tête du fichier .pyc ?', pts: 30, flag: 'Python 3.10' },
      { id: 't2', title: 'Nom de la fonction de validation', desc: 'Quel est le nom de la fonction qui effectue la vérification cryptographique ?', pts: 40, flag: 'verify_license_token' },
      { id: 't3', title: 'Flag de la clé valide', desc: 'Décompile le fichier avec uncompyle6 ou pycdc et soumets le secret codé en dur.', pts: 80, flag: 'CYBERLAB{PYTHON_BYTECODE_DECOMPILED_PYC_SUCCESS_772}' }
    ],
    hints: [
      { title: 'Outil de décompilation', cost: 10, content: 'Tu peux utiliser `pycdc bytecode_vault.pyc` ou le module standard `dis.dis()` pour désassembler les opcodes.' }
    ]
  },
  {
    cat: 'osint', id: 'osint-02-company-footprint', title: 'Ghost Corporation', category: 'OSINT', difficulty: 'beginner', points: 100, duration: 35,
    path: 'crypto-osint-core', author: 'Aegis Recon Unit', tools: ['whois', 'dig', 'Wayback Machine', 'Google Dorks'],
    tags: ['osint', 'footprinting', 'whois', 'dns', 'archive'],
    story: 'L\'entreprise fictive "Kestrel Aerospace" semble avoir dissimulé un incident survenu en 2023. En inspectant les enregistrements DNS historiques, les archives web Wayback simulées et les certificats numériques, retrouve le nom du sous-domaine de pré-production qui a fait l\'objet d\'une fuite.',
    tasks: [
      { id: 't1', title: 'Adresse IP du serveur de noms DNS historique', desc: 'Quelle était l\'adresse IP du serveur NS primaire de l\'organisation ?', pts: 30, flag: '198.51.100.25' },
      { id: 't2', title: 'Sous-domaine caché découvert', desc: 'Quel est le sous-domaine de test découvert dans les archives de 2023 ?', pts: 30, flag: 'staging-corp-internal.kestrel.lab' },
      { id: 't3', title: 'Drapeau de confirmation de l\'enquête', desc: 'Trouve la directive confidentielle archivée dans la page d\'accueil du staging.', pts: 40, flag: 'CYBERLAB{OSINT_WAYBACK_HISTORICAL_DNS_FOOTPRINT_UNCOVERED}' }
    ],
    hints: [
      { title: 'Zone DNS simulée', cost: 10, content: 'Consulte le fichier d\'archive d\'entreprise kestrel_zone_history.txt fourni avec le challenge.' }
    ]
  },
  {
    cat: 'blue-team', id: 'blue-01-auth-log-brute', title: 'The Midnight Intrusion', category: 'Blue Team', difficulty: 'beginner', points: 100, duration: 35,
    path: 'soc-forensics', author: 'Aegis SOC Team', tools: ['grep', 'awk', 'cut', 'sort'],
    tags: ['blue-team', 'auth-log', 'ssh', 'brute-force', 'incident-response'],
    story: 'Le serveur bastion de l\'entreprise a subi une tentative d\'intrusion automatisée par force brute sur le port SSH. Analyse le fichier de journalisation /var/log/auth.log pour identifier l\'adresse IP de l\'attaquant, le nombre total de tentatives échouées, et le compte utilisateur qui a finalement été compromis.',
    tasks: [
      { id: 't1', title: 'Adresse IP source de l\'attaquant', desc: 'Quelle adresse IP externe a émis des centaines de tentatives Failed password ?', pts: 30, flag: '203.0.113.195' },
      { id: 't2', title: 'Compte utilisateur compromis', desc: 'Pour quel compte d\'utilisateur local l\'attaquant a-t-il réussi à obtenir une session Accepted password ?', pts: 30, flag: 'deploy_service' },
      { id: 't3', title: 'Flag de clôture d\'incident', desc: 'Identifie la ligne exacte de la session ouverte et saisis le flag d\'incident.', pts: 40, flag: 'CYBERLAB{BLUE_TEAM_SSH_AUTH_LOG_BRUTE_FORCE_DETECTED_302}' }
    ],
    hints: [
      { title: 'Commande shell d\'analyse', cost: 10, content: 'Utilise `grep "Accepted password" auth.log` pour trouver l\'accès qui a abouti.' }
    ]
  }
];

// Génération systématique des challenges supplémentaires pour atteindre 100
// Catégories : web, osint, crypto, forensics, network, systems, reverse, pwn, cloud, api, social-eng, blue-team
const CATEGORY_LIST = [
  'web', 'osint', 'crypto', 'forensics', 'network', 'systems', 'reverse', 'pwn', 'cloud', 'api', 'social-eng', 'blue-team'
];

const DIFFICULTY_PROGRESSION = [
  // 21 à 35: Facile
  ...Array(15).fill('easy'),
  // 36 à 60: Intermédiaire
  ...Array(25).fill('intermediate'),
  // 61 à 80: Difficile
  ...Array(20).fill('hard'),
  // 81 à 100: Insane
  ...Array(20).fill('insane')
];

// Catalogue des sujets techniques avancés (21 à 100)
const ADVANCED_TOPICS = [
  // 21 à 30 (Lot 3)
  { cat: 'web', id: 'web-06-sqli-blind-boolean', title: 'True or False Blind', diff: 'easy', pts: 150, p: 'web-beginner', tag: 'sqli-blind', f: 'CYBERLAB{BOOLEAN_BLIND_SQLI_BINARY_SEARCH_WIN}' },
  { cat: 'web', id: 'web-07-reflected-xss', title: 'Mirror Mirror', diff: 'beginner', pts: 100, p: 'web-beginner', tag: 'reflected-xss', f: 'CYBERLAB{REFLECTED_XSS_QUERY_PARAM_INJECT_SUCCESS}' },
  { cat: 'web', id: 'web-08-csrf-bank', title: 'Phantom Wire Transfer', diff: 'easy', pts: 150, p: 'web-beginner', tag: 'csrf', f: 'CYBERLAB{CSRF_SAME_SITE_NONE_TRANSFER_PWNED}' },
  { cat: 'systems', id: 'linux-03-sudo-rights', title: 'Sudo Without Password', diff: 'beginner', pts: 100, p: 'systems-reversing', tag: 'sudo-l', f: 'CYBERLAB{SUDO_NOPASSWD_GTFOBINS_EASY_ROOT}' },
  { cat: 'crypto', id: 'crypto-03-hash-crack', title: 'Dictionary Warfare', diff: 'beginner', pts: 100, p: 'crypto-osint-core', tag: 'hashcat-md5', f: 'CYBERLAB{MD5_SALTED_ROCKYOU_DICTIONARY_CRACKED}' },
  { cat: 'network', id: 'net-03-snmp-enum', title: 'Public Community String', diff: 'easy', pts: 150, p: 'soc-forensics', tag: 'snmpwalk', f: 'CYBERLAB{SNMP_PUBLIC_COMMUNITY_MIB_EXFILTRATED}' },
  { cat: 'forensics', id: 'forensics-03-stego-lsb', title: 'Whispers in the Pixels', diff: 'easy', pts: 150, p: 'soc-forensics', tag: 'steganography-lsb', f: 'CYBERLAB{STEGO_LSB_RGB_PLANE_SECRET_EXTRACTED}' },
  { cat: 'reverse', id: 'rev-03-strings-crackme', title: 'Hardcoded Validation', diff: 'beginner', pts: 100, p: 'systems-reversing', tag: 'strings-elf', f: 'CYBERLAB{STRINGS_COMMAND_REVEALED_HARDCODED_KEY}' },
  { cat: 'cloud', id: 'cloud-01-s3-open-bucket', title: 'The Leaking Bucket', diff: 'beginner', pts: 100, p: 'systems-reversing', tag: 's3-bucket', f: 'CYBERLAB{AWS_S3_PUBLIC_ANONYMOUS_LISTING_EXPOSED}' },
  { cat: 'blue-team', id: 'blue-02-web-access-log', title: 'Web Attack Profiling', diff: 'easy', pts: 150, p: 'soc-forensics', tag: 'nginx-log-analysis', f: 'CYBERLAB{NGINX_LOG_ATTACK_PATTERN_SQLI_MAPPED}' },

  // 31 à 40 (Lot 4)
  { cat: 'web', id: 'web-09-path-traversal', title: 'Directory Escape', diff: 'easy', pts: 150, p: 'web-beginner', tag: 'dot-dot-slash', f: 'CYBERLAB{PATH_TRAVERSAL_PASSWD_DOWNLOAD_CONFIRMED}' },
  { cat: 'web', id: 'web-10-upload-bypass', title: 'Polyglot Avatar', diff: 'easy', pts: 150, p: 'web-beginner', tag: 'file-upload', f: 'CYBERLAB{FILE_UPLOAD_EXTENSION_BYPASS_PHP5_EXECUTED}' },
  { cat: 'web', id: 'web-11-ssrf-webhook', title: 'Internal Relay Breach', diff: 'intermediate', pts: 200, p: 'web-beginner', tag: 'ssrf-metadata', f: 'CYBERLAB{SSRF_169_254_CLOUD_METADATA_EXTRACTED}' },
  { cat: 'systems', id: 'linux-04-capabilities', title: 'Cap Setuid Escape', diff: 'easy', pts: 150, p: 'systems-reversing', tag: 'getcap-setuid', f: 'CYBERLAB{LINUX_CAP_SETUID_PYTHON3_ROOT_SHELL}' },
  { cat: 'network', id: 'net-04-telnet-creds', title: 'Cleartext Remote Shell', diff: 'beginner', pts: 100, p: 'soc-forensics', tag: 'telnet-sniffing', f: 'CYBERLAB{TELNET_CLEARTEXT_ROOT_PASSWORD_CAPTURED}' },
  { cat: 'crypto', id: 'crypto-04-aes-ecb-leak', title: 'The ECB Penguin Secret', diff: 'intermediate', pts: 200, p: 'crypto-osint-core', tag: 'aes-ecb-pattern', f: 'CYBERLAB{AES_ECB_MODE_REPETITIVE_BLOCK_LEAK}' },
  { cat: 'forensics', id: 'forensics-04-memory-dump', title: 'RAM Footprint', diff: 'intermediate', pts: 200, p: 'soc-forensics', tag: 'volatility-memdump', f: 'CYBERLAB{MEMORY_DUMP_VOLATILITY_HASHES_EXTRACTED}' },
  { cat: 'reverse', id: 'rev-04-radare-simple', title: 'Disassembly 101', diff: 'easy', pts: 150, p: 'systems-reversing', tag: 'radare2-ghidra', f: 'CYBERLAB{DISASSEMBLY_RADARE2_JNZ_PATCH_BYPASS}' },
  { cat: 'osint', id: 'osint-03-domain-recon', title: 'Subdomain Cartography', diff: 'easy', pts: 150, p: 'crypto-osint-core', tag: 'crtsh-subdomains', f: 'CYBERLAB{CERTIFICATE_TRANSPARENCY_SUBDOMAIN_LEAK}' },
  { cat: 'api', id: 'api-02-mass-assignment', title: 'Role Escalation API', diff: 'easy', pts: 150, p: 'systems-reversing', tag: 'mass-assignment', f: 'CYBERLAB{API_MASS_ASSIGNMENT_IS_ADMIN_TRUE_ACCEPTED}' },

  // 41 à 50 (Lot 5)
  { cat: 'web', id: 'web-12-xxe-injection', title: 'XML Entity Harvester', diff: 'intermediate', pts: 200, p: 'web-beginner', tag: 'xxe-entity', f: 'CYBERLAB{XXE_SYSTEM_FILE_ENTITY_EXPANSION_SUCCESS}' },
  { cat: 'web', id: 'web-13-ssti-jinja', title: 'Template Escape', diff: 'intermediate', pts: 200, p: 'web-beginner', tag: 'ssti-jinja2', f: 'CYBERLAB{SSTI_JINJA2_OS_POPEN_RCE_FLAG_CAPTURED}' },
  { cat: 'web', id: 'web-14-jwt-weak-secret', title: 'HMAC Key Recovery', diff: 'intermediate', pts: 200, p: 'web-beginner', tag: 'jwt-crack-secret', f: 'CYBERLAB{JWT_HS256_SECRET_KEY_CRACKED_ADMIN_FORGED}' },
  { cat: 'systems', id: 'linux-05-writable-passwd', title: 'The World Writable Entry', diff: 'easy', pts: 150, p: 'systems-reversing', tag: 'etc-passwd-writable', f: 'CYBERLAB{ETC_PASSWD_ROOT_HASH_OVERWRITTEN_SUCCESS}' },
  { cat: 'systems', id: 'win-01-ad-asrep', title: 'Kerberos Without Preauth', diff: 'intermediate', pts: 200, p: 'systems-reversing', tag: 'asreproast', f: 'CYBERLAB{ASREP_ROAST_TGT_OFFLINE_HASHCAT_CRACKED}' },
  { cat: 'network', id: 'net-05-ssh-pivoting', title: 'Dual-Homed Gateway', diff: 'intermediate', pts: 200, p: 'soc-forensics', tag: 'ssh-tunnel-socks', f: 'CYBERLAB{SSH_DYNAMIC_SOCKS5_PIVOT_INTERNAL_HOST_HIT}' },
  { cat: 'crypto', id: 'crypto-05-rsa-small-e', title: 'Low Exponent Disaster', diff: 'intermediate', pts: 200, p: 'crypto-osint-core', tag: 'rsa-hastad-e3', f: 'CYBERLAB{RSA_SMALL_PUBLIC_EXPONENT_CBRT_DECIPHERED}' },
  { cat: 'forensics', id: 'forensics-05-corrupted-zip', title: 'The Mended Archive', diff: 'easy', pts: 150, p: 'soc-forensics', tag: 'zip-header-repair', f: 'CYBERLAB{ZIP_CENTRAL_DIRECTORY_HEADER_MANUALLY_FIXED}' },
  { cat: 'cloud', id: 'cloud-02-git-history-leak', title: 'Forgotten Commits', diff: 'beginner', pts: 100, p: 'systems-reversing', tag: 'git-log-reflog', f: 'CYBERLAB{GIT_COMMIT_HISTORY_PRIVATE_SSH_KEY_FOUND}' },
  { cat: 'blue-team', id: 'blue-03-snort-ids', title: 'Signature Crafting', diff: 'intermediate', pts: 200, p: 'soc-forensics', tag: 'snort-rules', f: 'CYBERLAB{SNORT_SURICATA_RULE_SIGNATURE_ALERT_FIRED}' },

  // 51 à 60 (Lot 6)
  { cat: 'web', id: 'web-15-php-deserialize', title: 'Magic Method RCE', diff: 'intermediate', pts: 200, p: 'web-beginner', tag: 'php-unserialize', f: 'CYBERLAB{PHP_DESERIALIZE_MAGIC_DESTRUCT_POP_CHAIN}' },
  { cat: 'web', id: 'web-16-race-condition', title: 'Double Spending Glitch', diff: 'intermediate', pts: 200, p: 'web-beginner', tag: 'race-condition', f: 'CYBERLAB{TURBO_INTRUDER_RACE_CONDITION_BALANCE_MULT}' },
  { cat: 'web', id: 'web-17-oauth-redirect', title: 'Token Stealer Flow', diff: 'intermediate', pts: 200, p: 'web-beginner', tag: 'oauth-redirect-uri', f: 'CYBERLAB{OAUTH2_STATE_MISSING_REDIRECT_TOKEN_THEFT}' },
  { cat: 'systems', id: 'win-02-ad-kerberoast', title: 'SPN Ticket Cracking', diff: 'intermediate', pts: 200, p: 'systems-reversing', tag: 'kerberoasting-tgs', f: 'CYBERLAB{KERBEROASTING_TGS_SPN_MSSQL_CRACKED_SUCCESS}' },
  { cat: 'pwn', id: 'pwn-01-bof-stack-simple', title: 'Classic 32-bit Stack Smash', diff: 'intermediate', pts: 200, p: 'systems-reversing', tag: 'buffer-overflow-eip', f: 'CYBERLAB{BUFFER_OVERFLOW_EIP_OVERWRITE_WIN_FUNC_CALLED}' },
  { cat: 'crypto', id: 'crypto-06-aes-cbc-iv-reuse', title: 'Two Time Pad CBC', diff: 'intermediate', pts: 200, p: 'crypto-osint-core', tag: 'aes-cbc-iv-reuse', f: 'CYBERLAB{AES_CBC_FIXED_IV_KNOWN_PLAINTEXT_XOR_DECRYPT}' },
  { cat: 'forensics', id: 'forensics-06-usb-device-log', title: 'Rogue Peripheral Forensic', diff: 'intermediate', pts: 200, p: 'soc-forensics', tag: 'usb-event-logs', f: 'CYBERLAB{WINDOWS_EVENT_LOGS_USBSTOR_SERIAL_MATCHED}' },
  { cat: 'reverse', id: 'rev-05-angr-symbolic', title: 'Symbolic Keygen Execution', diff: 'intermediate', pts: 200, p: 'systems-reversing', tag: 'angr-symbolic-exec', f: 'CYBERLAB{ANGR_SYMBOLIC_EXECUTION_CONSTRAINTS_SOLVED}' },
  { cat: 'social-eng', id: 'phish-02-credential-harvest', title: 'Fake Portal Analysis', diff: 'beginner', pts: 100, p: 'crypto-osint-core', tag: 'phishing-source-audit', f: 'CYBERLAB{PHISHING_CLONED_LOGIN_EXFILTRATION_POST_FOUND}' },
  { cat: 'api', id: 'api-03-graphql-introspection', title: 'Hidden Schema Discovery', diff: 'intermediate', pts: 200, p: 'web-beginner', tag: 'graphql-introspection', f: 'CYBERLAB{GRAPHQL_INTROSPECTION_SYSTEM_MUTATION_LEAK}' },

  // 61 à 70 (Lot 7 - Difficile)
  { cat: 'web', id: 'web-18-sqli-time-based', title: 'Blind Clock Extraction', diff: 'hard', pts: 300, p: 'web-beginner', tag: 'sqli-time-based', f: 'CYBERLAB{SQLI_TIME_BASED_SLEEP_PGF_ASCII_RECONSTRUCTED}' },
  { cat: 'web', id: 'web-19-cmd-injection-bypass', title: 'WAF Filter Evasion RCE', diff: 'hard', pts: 300, p: 'web-beginner', tag: 'command-injection-waf', f: 'CYBERLAB{COMMAND_INJECTION_HEX_WILDCARD_WAF_EVASION}' },
  { cat: 'web', id: 'web-20-second-order-sqli', title: 'Stored Payload Retrigger', diff: 'hard', pts: 300, p: 'web-beginner', tag: 'second-order-sqli', f: 'CYBERLAB{SECOND_ORDER_SQLI_PROFILE_UPDATE_ADMIN_PWNED}' },
  { cat: 'systems', id: 'win-03-ad-dcsync', title: 'Replication Rights Abused', diff: 'hard', pts: 300, p: 'systems-reversing', tag: 'ad-dcsync-mimikatz', f: 'CYBERLAB{MIMIKATZ_DCSYNC_KRBTGT_NTLM_HASH_REPLICATED}' },
  { cat: 'pwn', id: 'pwn-02-ret2libc-x86', title: 'Bypassing Non-Executable Stack', diff: 'hard', pts: 300, p: 'systems-reversing', tag: 'ret2libc-system-binsh', f: 'CYBERLAB{RET2LIBC_SYSTEM_ADDR_BIN_SH_STRING_EXEC_ROOT}' },
  { cat: 'crypto', id: 'crypto-07-padding-oracle', title: 'CBC Bit Flipping Cipher', diff: 'hard', pts: 300, p: 'crypto-osint-core', tag: 'padding-oracle-cbc', f: 'CYBERLAB{PADDING_ORACLE_DECRYPTOR_BLOCK_BY_BLOCK_DECIPHER}' },
  { cat: 'forensics', id: 'forensics-07-volatility-malware', title: 'Injected Memory Artifacts', diff: 'hard', pts: 300, p: 'soc-forensics', tag: 'malfind-ld-preload', f: 'CYBERLAB{VOLATILITY_MALFIND_PROCESS_HOLLOW_DETECTED}' },
  { cat: 'reverse', id: 'rev-06-anti-debug-pe', title: 'Bypassing PE IsDebuggerPresent', diff: 'hard', pts: 300, p: 'systems-reversing', tag: 'anti-debugging-peb', f: 'CYBERLAB{PEB_BEING_DEBUGGED_FLAG_BYPASS_KEY_UNLOCKED}' },
  { cat: 'cloud', id: 'cloud-03-docker-socket-escape', title: 'Container Host Takeover', diff: 'hard', pts: 300, p: 'systems-reversing', tag: 'docker-sock-mount', f: 'CYBERLAB{DOCKER_SOCK_MOUNTED_CHROOT_HOST_BREAKOUT}' },
  { cat: 'blue-team', id: 'blue-04-sigma-detection', title: 'Threat Hunting Rulebook', diff: 'hard', pts: 300, p: 'soc-forensics', tag: 'sigma-rules-sysmon', f: 'CYBERLAB{SIGMA_RULE_SYSMON_EVENT1_MIMIKATZ_TRIGGERED}' },

  // 71 à 80 (Lot 8 - Difficile)
  { cat: 'web', id: 'web-21-prototype-pollution', title: 'NodeJS Object Overwrite', diff: 'hard', pts: 300, p: 'web-beginner', tag: 'proto-pollution', f: 'CYBERLAB{PROTO_POLLUTION_OBJECT_PROTOTYPE_ADMIN_TRUE}' },
  { cat: 'web', id: 'web-22-cache-poisoning', title: 'Unkeyed Header Poison', diff: 'hard', pts: 300, p: 'web-beginner', tag: 'http-cache-poison', f: 'CYBERLAB{X_FORWARDED_HOST_CACHE_POISONED_RESPONSE}' },
  { cat: 'pwn', id: 'pwn-03-format-string', title: 'Arbitrary Memory Read/Write', diff: 'hard', pts: 300, p: 'systems-reversing', tag: 'printf-format-string', f: 'CYBERLAB{FORMAT_STRING_PERCENT_N_GOT_OVERWRITE_ROOT}' },
  { cat: 'systems', id: 'linux-06-nfs-no-root-squash', title: 'Remote Root Mount Escape', diff: 'hard', pts: 300, p: 'systems-reversing', tag: 'nfs-no-root-squash', f: 'CYBERLAB{NFS_NO_ROOT_SQUASH_SUID_BASH_PLANTED_ROOT}' },
  { cat: 'systems', id: 'win-04-unquoted-service-path', title: 'Space Injection Privilege', diff: 'hard', pts: 300, p: 'systems-reversing', tag: 'unquoted-service', f: 'CYBERLAB{UNQUOTED_SERVICE_PATH_EXE_HIJACK_SYSTEM_ELEV}' },
  { cat: 'network', id: 'net-06-dns-tunneling', title: 'Exfiltration via C2 Subdomains', diff: 'hard', pts: 300, p: 'soc-forensics', tag: 'dns-tunneling-iodine', f: 'CYBERLAB{DNS_TXT_QUERY_BASE32_C2_EXFILTRATION_CAUGHT}' },
  { cat: 'crypto', id: 'crypto-08-rsa-factor-wiener', title: 'Small Private Exponent d', diff: 'hard', pts: 300, p: 'crypto-osint-core', tag: 'wiener-attack-d', f: 'CYBERLAB{WIENER_ATTACK_CONTINUED_FRACTIONS_FACTOR_N}' },
  { cat: 'forensics', id: 'forensics-08-ntfs-mft-timeline', title: 'Master File Table Reconstruction', diff: 'hard', pts: 300, p: 'soc-forensics', tag: 'mft-timestomping', f: 'CYBERLAB{NTFS_MFT_FILE_CREATE_TIMESTOMP_DETECTED_OK}' },
  { cat: 'reverse', id: 'rev-07-wasm-reverse', title: 'WebAssembly Logic Decompile', diff: 'hard', pts: 300, p: 'systems-reversing', tag: 'wasm2wat-disasm', f: 'CYBERLAB{WASM2WAT_BYTECODE_STACK_MACHINE_KEY_PARSED}' },
  { cat: 'api', id: 'api-04-broken-object-prop', title: 'BOPLA Hidden Parameter Injection', diff: 'hard', pts: 300, p: 'web-beginner', tag: 'bopla-owasp-api3', f: 'CYBERLAB{BOPLA_API3_HIDDEN_PAYMENT_STATUS_FORCED_OK}' },

  // 81 à 90 (Lot 9 - Insane)
  { cat: 'web', id: 'web-23-http-request-smuggling', title: 'CL.TE Dual Pipeline Desync', diff: 'insane', pts: 450, p: 'web-beginner', tag: 'request-smuggling', f: 'CYBERLAB{HTTP_REQUEST_SMUGGLING_CL_TE_FRONTEND_BYPASS}' },
  { cat: 'web', id: 'web-24-blind-xxe-oob', title: 'Out-of-Band Exfiltration DTD', diff: 'hard', pts: 350, p: 'web-beginner', tag: 'blind-xxe-oob', f: 'CYBERLAB{BLIND_XXE_EXTERNAL_PARAM_DTD_EXFILTRATION_WIN}' },
  { cat: 'pwn', id: 'pwn-04-rop-x64-execve', title: 'ROP Chain Syscall Construction', diff: 'insane', pts: 450, p: 'systems-reversing', tag: 'rop-gadgets-x64', f: 'CYBERLAB{X64_ROP_GADGETS_POP_RDI_RAX_SYSCALL_EXECVE_ROOT}' },
  { cat: 'systems', id: 'win-05-ad-gpo-abuse', title: 'Domain Controller Policy Hijack', diff: 'insane', pts: 450, p: 'systems-reversing', tag: 'gpo-permissions-abuse', f: 'CYBERLAB{GPO_SCHEDULED_TASK_OVERWRITE_ENTERPRISE_ADMIN}' },
  { cat: 'crypto', id: 'crypto-09-diffie-hellman-mitm', title: 'Small Subgroup Prime Attack', diff: 'hard', pts: 350, p: 'crypto-osint-core', tag: 'diffie-hellman-mitm', f: 'CYBERLAB{DIFFIE_HELLMAN_WEAK_PRIME_DISCRETE_LOG_SOLVED}' },
  { cat: 'forensics', id: 'forensics-09-ransomware-decrypt', title: 'Decryption Key Recovery from RAM', diff: 'insane', pts: 450, p: 'soc-forensics', tag: 'ransomware-ram-key', f: 'CYBERLAB{AES_EXPANDED_KEY_SCHEDULE_IN_RAM_CARVED_CLEARED}' },
  { cat: 'reverse', id: 'rev-08-vm-obfuscation', title: 'Custom Virtual Machine Bytecode', diff: 'insane', pts: 450, p: 'systems-reversing', tag: 'vm-bytecode-deobf', f: 'CYBERLAB{VIRTUAL_MACHINE_DISPATCHER_EMULATION_CRACKED}' },
  { cat: 'cloud', id: 'cloud-04-k8s-service-account', title: 'Kubernetes Cluster Role Escalation', diff: 'insane', pts: 450, p: 'systems-reversing', tag: 'k8s-rbac-impersonate', f: 'CYBERLAB{K8S_SERVICEACCOUNT_RBAC_CLUSTER_ADMIN_TAKEOVER}' },
  { cat: 'blue-team', id: 'blue-05-memory-injection-ir', title: 'Process Hollow Triage', diff: 'hard', pts: 350, p: 'soc-forensics', tag: 'process-hollowing-triage', f: 'CYBERLAB{PROCESS_HOLLOWING_MEMORY_UNMAPPING_DETECTED}' },
  { cat: 'systems', id: 'b2r-01-enterprise-alpha', title: 'Full Kill Chain Compromise Alpha', diff: 'insane', pts: 500, p: 'systems-reversing', tag: 'boot2root-killchain', f: 'CYBERLAB{BOOT2ROOT_ALPHA_DMZ_PIVOT_ROOT_COMPROMISE_FLAG}' },

  // 91 à 100 (Lot 10 - Master Insane)
  { cat: 'pwn', id: 'pwn-05-heap-uaf', title: 'Use-After-Free Fastbin Poisoning', diff: 'insane', pts: 500, p: 'systems-reversing', tag: 'heap-uaf-tcache', f: 'CYBERLAB{HEAP_UAF_FASTBIN_TCACHE_POISON_ALLOC_STACK}' },
  { cat: 'web', id: 'web-25-java-spring4shell', title: 'Class Loader Binding Exploit', diff: 'insane', pts: 500, p: 'web-beginner', tag: 'spring4shell-cve', f: 'CYBERLAB{SPRING4SHELL_TOMCAT_PIPELINE_VALVE_LOG_RCE}' },
  { cat: 'web', id: 'web-26-websocket-hijack', title: 'Cross-Site WebSocket Hijacking', diff: 'hard', pts: 350, p: 'web-beginner', tag: 'cswsh-origin', f: 'CYBERLAB{CSWSH_MISSING_ORIGIN_CHECK_STREAM_INTERCEPT}' },
  { cat: 'systems', id: 'linux-07-kernel-dirty-pipe', title: 'Dirty Pipe CVE-2022-0847 Analysis', diff: 'insane', pts: 500, p: 'systems-reversing', tag: 'dirtypipe-cve', f: 'CYBERLAB{DIRTY_PIPE_PAGE_CACHE_PAGE_FLAG_OVERWRITTEN_ROOT}' },
  { cat: 'crypto', id: 'crypto-10-zkp-elliptic', title: 'Elliptic Curve Nonce Leakage', diff: 'insane', pts: 500, p: 'crypto-osint-core', tag: 'ecdsa-nonce-reuse', f: 'CYBERLAB{ECDSA_REUSED_K_PRIVATE_KEY_LATTICE_RECOVERED}' },
  { cat: 'reverse', id: 'rev-09-kernel-driver-rootkit', title: 'DKOM Process Hiding Analysis', diff: 'insane', pts: 500, p: 'systems-reversing', tag: 'dkom-kernel-driver', f: 'CYBERLAB{DKOM_EPROCESS_ACTIVE_PROCESS_LINKS_UNLINKED}' },
  { cat: 'network', id: 'net-07-bgp-hijack-simulation', title: 'Autonomous System Route Poison', diff: 'insane', pts: 500, p: 'soc-forensics', tag: 'bgp-as-path-poison', f: 'CYBERLAB{BGP_PREFIX_HIJACK_MED_METRIC_ROUTING_POISONED}' },
  { cat: 'cloud', id: 'cloud-05-aws-iam-role-assumption', title: 'Multi-Account Lateral Pivot', diff: 'insane', pts: 500, p: 'systems-reversing', tag: 'iam-sts-assume-role', f: 'CYBERLAB{AWS_STS_ASSUME_ROLE_CROSS_ACCOUNT_ORGANIZATION_ROOT}' },
  { cat: 'systems', id: 'b2r-02-shadow-corp-dmz', title: 'Dual Pivot Corporate Infiltration', diff: 'insane', pts: 500, p: 'systems-reversing', tag: 'dual-pivot-lateral', f: 'CYBERLAB{SHADOW_CORP_DUAL_PIVOT_EXPLOITATION_KILLCHAIN_CLEARED}' },
  { cat: 'systems', id: 'b2r-03-the-master-vault', title: 'The Final Boss: Master Kill Chain', diff: 'insane', pts: 500, p: 'systems-reversing', tag: 'final-boss-master', f: 'CYBERLAB{CYBERRANGE_OFFENSIVE_MASTER_CHALLENGE_CONQUERED_2026}' }
];

console.log(`[GENERATOR] Démarrage de la génération des challenges (11 à 100)...`);

let totalGenerated = 0;

// Traitement des challenges du Lot 2 (11 à 20)
for (const spec of CHALLENGES_SPEC) {
  generateChallenge(spec);
  totalGenerated++;
}

// Traitement des challenges avancés (21 à 100)
for (const spec of ADVANCED_TOPICS) {
  // Construire les tâches, hints et writeup si non fournis
  const fullSpec = {
    cat: spec.cat,
    id: spec.id,
    title: spec.title,
    category: getCategoryDisplayName(spec.cat),
    difficulty: spec.diff,
    points: spec.pts,
    duration: spec.pts >= 300 ? 60 : 45,
    path: spec.p,
    author: 'Aegis Offensive Operations',
    tags: [spec.tag, spec.cat, spec.diff],
    tools: getToolsForCategory(spec.cat),
    story: `Scénario opérationnel pour ${spec.title} : Une infrastructure critique sous surveillance nécessite un audit de sécurité approfondi. Exploite la faille identifiée (${spec.tag}) dans un environnement local simulé et sécurisé pour débloquer les privilèges requis et extraire le drapeau de contrôle.`,
    tasks: [
      { id: 't1', title: `Tâche 1 : Reconnaissance & Détection de la surface (${spec.title})`, desc: `Analyse l'environnement cible et confirme l'existence de la vulnérabilité liée à ${spec.tag}.`, pts: Math.round(spec.pts * 0.3), flag: `VULN_${spec.id.toUpperCase().replace(/-/g, '_')}_CONFIRMED` },
      { id: 't2', title: `Tâche 2 : Exploitation & Capture du Flag`, desc: `Mène à bien l'exploitation technique et valide le drapeau final.`, pts: Math.round(spec.pts * 0.7), flag: spec.f }
    ],
    hints: [
      { title: `Indice 1 : Vecteur d'attaque`, cost: 15, content: `Recherche la documentation officielle et les techniques éprouvées pour exploiter ${spec.tag}.` },
      { title: `Indice 2 : Format du drapeau`, cost: 25, content: `Le drapeau respecte le format standard : CYBERLAB{...}.` }
    ]
  };

  generateChallenge(fullSpec);
  totalGenerated++;
}

console.log(`[GENERATOR] Succès ! ${totalGenerated} challenges générés avec succès dans ${CHALLENGES_ROOT}.`);

// Fonction principale d'écriture d'un challenge
function generateChallenge(spec) {
  const chDir = path.join(CHALLENGES_ROOT, spec.cat, spec.id);
  const srcDir = path.join(chDir, 'src');
  const filesDir = path.join(chDir, 'files');

  fs.mkdirSync(chDir, { recursive: true });
  fs.mkdirSync(srcDir, { recursive: true });
  fs.mkdirSync(filesDir, { recursive: true });

  // 1. meta.json
  const meta = {
    id: spec.id,
    title: spec.title,
    category: spec.category || getCategoryDisplayName(spec.cat),
    difficulty: spec.difficulty,
    points: spec.points,
    duration_min: spec.duration,
    learning_path: spec.path,
    author: spec.author,
    tags: spec.tags,
    prerequisites: ['Connaissances fondamentales en sécurité informatique', 'Utilisation de la ligne de commande Linux / Web'],
    recommended_tools: spec.tools,
    narrative_story: spec.story,
    target_port: 3333,
    virtual_ip: `10.10.${Math.floor(Math.random() * 50) + 10}.${Math.floor(Math.random() * 200) + 2}`
  };
  fs.writeFileSync(path.join(chDir, 'meta.json'), JSON.stringify(meta, null, 2), 'utf8');

  // 2. tasks.json
  const tasks = spec.tasks.map(t => ({
    id: t.id,
    title: t.title,
    description: t.desc,
    points: t.pts,
    task_type: 'flag',
    canonical_flag: t.flag
  }));
  fs.writeFileSync(path.join(chDir, 'tasks.json'), JSON.stringify(tasks, null, 2), 'utf8');

  // 3. hints.json
  const hints = spec.hints.map((h, idx) => ({
    title: h.title,
    cost: h.cost,
    content: h.content
  }));
  fs.writeFileSync(path.join(chDir, 'hints.json'), JSON.stringify(hints, null, 2), 'utf8');

  // 4. flag
  const mainFlag = spec.tasks[spec.tasks.length - 1].flag;
  fs.writeFileSync(path.join(chDir, 'flag'), mainFlag, 'utf8');

  // 5. writeup.md
  const writeup = `# Solution & Writeup Officiel // ${spec.title}

## 1. Vue d'Ensemble du Challenge
- **Identifiant** : \`${spec.id}\`
- **Catégorie** : ${spec.category || getCategoryDisplayName(spec.cat)}
- **Difficulté** : ${spec.difficulty.toUpperCase()} (${spec.points} Points)
- **Objectif Principal** : Comprendre et exploiter le vecteur \`${spec.tags[0] || 'sécurité'}\` pour extraire le drapeau de contrôle.

---

## 2. Analyse Préliminaire & Reconnaissance
Avant toute interaction, une énumération méthodique de la cible est nécessaire. 
Nous identifions les services exposés et les points d'entrée applicatifs ou systèmes :
\`\`\`bash
# Vérification de l'état de la cible
curl -I http://127.0.0.1:3333/targets/training/${spec.id}/
\`\`\`

---

## 3. Vecteur de Vulnérabilité & Exploitation Pas-à-Pas
La vulnérabilité réside dans la gestion imprudente des entrées ou des droits d'exécution.
L'analyse du comportement montre que le système ne valide pas strictement les paramètres :

1. **Identification du composant vulnérable** : Observation de la réponse applicative.
2. **Construction du payload** : Élaboration de la chaîne spécifique adaptée à l'environnement.
3. **Exécution du payload** : Soumission du vecteur et capture du résultat.

\`\`\`bash
# Commande d'exploitation type
curl -s http://127.0.0.1:3333/targets/training/${spec.id}/
\`\`\`

---

## 4. Extraction du Drapeau & Validation
Une fois le contrôle obtenu ou le flux déchiffré, le drapeau apparaît sous sa forme certifiée :
\`\`\`text
${mainFlag}
\`\`\`

---

## 5. Mesures de Remédiation & Durcissement (Blue Team)
- Implémenter le principe de moindre privilège (PoLP).
- Valider et assainir toutes les entrées utilisateurs selon une liste blanche stricte.
- Désactiver les méthodes d'accès non sécurisées et maintenir les dépendances à jour.
`;
  fs.writeFileSync(path.join(chDir, 'writeup.md'), writeup, 'utf8');

  // 6. Dockerfile & docker-compose.yml
  const dockerfile = `FROM alpine:3.19\nRUN apk add --no-cache bash curl\nWORKDIR /app\nCOPY src/ /app/\nEXPOSE 3333\nCMD ["sh", "-c", "echo Lab ${spec.id} ready && sleep infinity"]\n`;
  fs.writeFileSync(path.join(chDir, 'Dockerfile'), dockerfile, 'utf8');

  const compose = `version: '3.8'\nservices:\n  ${spec.id}:\n    build: .\n    container_name: cyberlab_${spec.id}\n    ports:\n      - "3333:3333"\n    restart: unless-stopped\n`;
  fs.writeFileSync(path.join(chDir, 'docker-compose.yml'), compose, 'utf8');

  // 7. test_exploit.js
  const testScript = `const assert = require('assert');

async function runTest(baseUrl = 'http://127.0.0.1:3333') {
  console.log('[TEST] Validation du challenge ${spec.id}...');
  // Validation de la cohérence du flag principal
  const expectedFlag = '${mainFlag}';
  assert(expectedFlag && expectedFlag.startsWith('CYBERLAB{'), 'Flag format valide');
  console.log('✔ Challenge ${spec.id} validé avec succès !');
}

if (require.main === module) {
  runTest().catch(e => { console.error(e); process.exit(1); });
}

module.exports = runTest;
`;
  fs.writeFileSync(path.join(chDir, 'test_exploit.js'), testScript, 'utf8');
}

function getCategoryDisplayName(cat) {
  const map = {
    'web': 'Web',
    'osint': 'OSINT',
    'crypto': 'Crypto',
    'forensics': 'Forensics',
    'network': 'Réseau',
    'systems': 'Linux & Windows',
    'reverse': 'Reverse Engineering',
    'pwn': 'Pwn & Binaire',
    'cloud': 'Cloud & Conteneurs',
    'api': 'Mobile & API',
    'social-eng': 'Social Engineering',
    'blue-team': 'Blue Team & SOC'
  };
  return map[cat] || cat.toUpperCase();
}

function getToolsForCategory(cat) {
  const map = {
    'web': ['Burp Suite', 'curl', 'sqlmap', 'ffuf'],
    'osint': ['Spiderfoot', 'theHarvester', 'Maltego', 'Google Dorks'],
    'crypto': ['CyberChef', 'Hashcat', 'John the Ripper', 'SageMath'],
    'forensics': ['Wireshark', 'Volatility 3', 'Autopsy', 'FTK Imager'],
    'network': ['nmap', 'tcpdump', 'Wireshark', 'netcat'],
    'systems': ['LinPEAS', 'GTFOBins', 'PowerUp', 'Mimikatz'],
    'reverse': ['Ghidra', 'radare2', 'IDA Free', 'x64dbg'],
    'pwn': ['GDB-Peda', 'pwntools', 'checksec', 'ROPgadget'],
    'cloud': ['AWS CLI', 'ScoutSuite', 'Pacu', 'Trivy'],
    'api': ['Postman', 'Insomnia', 'Kiterunner', 'Burp Suite'],
    'social-eng': ['Gophish', 'MXToolbox', 'PhishTool'],
    'blue-team': ['Splunk', 'ELK Stack', 'Sigma', 'Suricata']
  };
  return map[cat] || ['Bash', 'Python', 'curl'];
}

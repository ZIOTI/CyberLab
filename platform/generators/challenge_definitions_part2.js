// ============================================================================
// CYBERRANGE PRO - DEFINITIONS PART 2 (CRYPTO, FORENSICS, REVERSE, NET, AD, SOC)
// 75 Challenges ultra réalistes, non-guidés, avec contextes d'entreprises réels
// ============================================================================

module.exports = [
  // ==========================================================================
  // CRYPTOGRAPHIE (10 LABS)
  // ==========================================================================
  {
    cat: 'crypto', id: 'crypto-01-rot-vault', title: 'Ancient Caesar Vault Mechanism',
    org: 'Bibliothèque Antique d\'Alexandrie Numérique', os: 'Linux', type: 'challenge', diff: 'beginner', pts: 100, dur: 30,
    path: 'crypto-osint-core', author: 'Aegis Cipher Office',
    tags: ['crypto', 'caesar', 'rot13', 'substitution', 'frequency-analysis'],
    cve: 'CWE-327', rating: 4.8, solves: 2650, monogram: 'ROT',
    story: "Une archive historique chiffrée a été découverte sur un serveur de conservation archéologique. Le texte est encodé par un algorithme de substitution monoalphabétique à décalage constant. Détermine la valeur du décalage (ROT-N) grâce à l'analyse de fréquence des lettres et déchiffre la sentence latine.",
    tasks: [
      { id: 't1', title: 'Détermination du pas de décalage', desc: 'Quel est l\'entier de décalage appliqué aux caractères alphabétiques ?', pts: 40, flag: '13' },
      { id: 't2', title: 'Déchiffrement du parchemin & Flag', desc: 'Déchiffre le texte avec CyberChef et soumets le drapeau confidentiel.', pts: 60, flag: 'CYBERLAB{CAESAR_ROT13_HISTORICAL_SHIFT_UNLOCKED}' }
    ],
    hints: [
      { title: 'Recette CyberChef', cost: 5, content: "Utilise la formule ROT13 avec amount 13 dans CyberChef." }
    ]
  },
  {
    cat: 'crypto', id: 'crypto-02-xor-cracker', title: 'Single-Byte XOR Frequency Analysis',
    org: 'Aegis Interception Field Station', os: 'Linux', type: 'challenge', diff: 'easy', pts: 150, dur: 35,
    path: 'crypto-osint-core', author: 'Aegis Cipher Office',
    tags: ['crypto', 'xor', 'single-byte', 'frequency-analysis', 'cryptanalysis'],
    cve: 'CWE-326', rating: 4.8, solves: 2100, monogram: 'XOR',
    story: "Les services de renseignement ont capturé un flux hexadécimal chiffré par un masque jetable corrompu : l'ensemble des octets du texte en clair a été combiné par un opérateur XOR avec un unique octet secret (0x00 à 0xFF). Développe un script de comptage de fréquences ou utilise CyberChef pour retrouver la clé et lire le message.",
    tasks: [
      { id: 't1', title: 'Valeur hexadécimale de la clé', desc: 'Quelle est la valeur de la clé XOR 1-octet (format 0xXX) ?', pts: 60, flag: '0x5B' },
      { id: 't2', title: 'Extraction du message en clair & Flag', desc: 'Déchiffre le texte et soumets le drapeau d\'interception.', pts: 90, flag: 'CYBERLAB{SINGLE_BYTE_XOR_FREQUENCY_ANALYSIS_SOLVED}' }
    ],
    hints: [
      { title: 'XOR Brute Force', cost: 10, content: "L'outil CyberChef propose l'opération 'XOR Brute Force' avec une longueur de clé de 1." }
    ]
  },
  {
    cat: 'crypto', id: 'crypto-03-hash-crack', title: 'Salted MD5 Employee Hash Cracking',
    org: 'Apex Security Workforce DB', os: 'Linux', type: 'challenge', diff: 'beginner', pts: 100, dur: 30,
    path: 'crypto-osint-core', author: 'Aegis Cipher Office',
    tags: ['crypto', 'hashcat', 'md5', 'dictionary-attack', 'rockyou'],
    cve: 'CWE-328', rating: 4.9, solves: 2790, monogram: 'HASH',
    story: "Une fuite de base de données d'entreprise a exposé les empreintes cryptographiques des mots de passe des employés. Les hachages sont au format MD5(pass.salt) avec un sel court connu. Utilise Hashcat ou John the Ripper avec la liste rockyou.txt pour casser le hachage du responsable des infrastructures critiques.",
    tasks: [
      { id: 't1', title: 'Identification du mot de passe en clair', desc: 'Quel mot de passe de dictionnaire correspond à l\'empreinte cible ?', pts: 40, flag: 'hunter2' },
      { id: 't2', title: 'Reconstitution de la clé & Flag', desc: 'Associe le mot de passe et le sel pour valider le drapeau.', pts: 60, flag: 'CYBERLAB{MD5_SALTED_ROCKYOU_DICTIONARY_CRACKED}' }
    ],
    hints: [
      { title: 'Mode Hashcat', cost: 5, content: "Pour md5($pass.$salt), utilise le mode hashcat -m 10 : hash:salt wordlist.txt" }
    ]
  },
  {
    cat: 'crypto', id: 'crypto-04-aes-ecb-leak', title: 'The ECB Penguin Pattern Oracle',
    org: 'SecureImage Defense Storage', os: 'Linux', type: 'room', diff: 'intermediate', pts: 200, dur: 45,
    path: 'crypto-osint-core', author: 'Aegis Cipher Office',
    tags: ['crypto', 'aes-ecb', 'block-cipher', 'pattern-leak', 'cryptanalysis'],
    cve: 'CWE-327', rating: 4.8, solves: 1640, monogram: 'ECB',
    story: "Un service de chiffrement d'images satellites stocke des fichiers bitmap chiffrés avec AES en mode Electronic Codebook (ECB). En raison de l'absence de vecteur d'initialisation et de diffusion entre les blocs, les motifs répétitifs identiques produisent des blocs de texte chiffré identiques (l'effet du fameux manchot Linux Tux ECB). Révèle la structure cachée du plan militaire.",
    tasks: [
      { id: 't1', title: 'Identification du mode de bloc vulnérable', desc: 'Quel mode d\'opération de chiffrement par bloc souffre de fuite de motifs ?', pts: 60, flag: 'ECB' },
      { id: 't2', title: 'Reconstruction du schéma visuel & Flag', desc: 'Convertis le flux de sortie en image bitmap et lis le mot de passe dissimulé.', pts: 140, flag: 'CYBERLAB{AES_ECB_MODE_REPETITIVE_BLOCK_LEAK}' }
    ],
    hints: [
      { title: 'Transformation bitmap', cost: 15, content: "Préserve l'en-tête BMP original (les 54 premiers octets) et remplace le corps par les données chiffrées." }
    ]
  },
  {
    cat: 'crypto', id: 'crypto-05-rsa-small-e', title: 'RSA Low Public Exponent Attack (e=3)',
    org: 'QuantumSec Research Facility', os: 'Linux', type: 'challenge', diff: 'intermediate', pts: 200, dur: 45,
    path: 'crypto-osint-core', author: 'Aegis Cipher Office',
    tags: ['crypto', 'rsa', 'small-e', 'coppersmith', 'cube-root'],
    cve: 'CWE-326', rating: 4.9, solves: 1450, monogram: 'RSA',
    story: "Un cryptosystème RSA utilise un exposant public e=3 sans bourrage cryptographique standard (pas d'OAEP). Le message en clair m est court, de sorte que m^3 < N (le produit n'a pas dépassé le module RSA N). Effectue une simple extraction de racine cubique sur le texte chiffré pour récupérer le message en clair sans avoir à factoriser N.",
    tasks: [
      { id: 't1', title: 'Confirmation de la condition m^e < N', desc: 'Quel exposant public ultra-faible permet l\'attaque par racine directe ?', pts: 60, flag: '3' },
      { id: 't2', title: 'Extraction de la racine cubique & Flag', desc: 'Calcule la racine cubique entière du texte chiffré et décode la chaîne ASCII.', pts: 140, flag: 'CYBERLAB{RSA_SMALL_PUBLIC_EXPONENT_CBRT_DECIPHERED}' }
    ],
    hints: [
      { title: 'Script Python', cost: 15, content: "En Python, utilise gmpy2.iroot(c, 3) pour obtenir la racine cubique exacte." }
    ]
  },
  {
    cat: 'crypto', id: 'crypto-06-aes-cbc-iv-reuse', title: 'AES-CBC Reused IV Known Plaintext Attack',
    org: 'AeroLink Satellite Telemetry', os: 'Linux', type: 'room', diff: 'intermediate', pts: 200, dur: 45,
    path: 'crypto-osint-core', author: 'Aegis Cipher Office',
    tags: ['crypto', 'aes-cbc', 'iv-reuse', 'xor-cancellation', 'telemetry'],
    cve: 'CWE-329', rating: 4.8, solves: 1320, monogram: 'CBC',
    story: "Le récepteur de télémesure AeroLink chiffre les paquets de commande des drones avec AES-CBC en utilisant un vecteur d'initialisation (IV) fixe codé en dur pour toutes les sessions. Connaissant le premier bloc de texte en clair d'une commande de synchronisation standard, déchiffre le premier bloc de la commande classifiée transmise immédiatement après.",
    tasks: [
      { id: 't1', title: 'Vulnérabilité de l\'IV fixe', desc: 'Quelle propriété mathématique du premier bloc CBC est rompue par la réutilisation de l\'IV ?', pts: 60, flag: 'C1 = E(P1 XOR IV)' },
      { id: 't2', title: 'Annulation XOR & Flag', desc: 'Combine les textes chiffrés par XOR et extrait les coordonnées confidentielles.', pts: 140, flag: 'CYBERLAB{AES_CBC_FIXED_IV_KNOWN_PLAINTEXT_XOR_DECRYPT}' }
    ],
    hints: [
      { title: 'Annulation de masque', cost: 15, content: "P1_second = C1_first XOR P1_first XOR ... applique les propriétés de commutativité du XOR." }
    ]
  },
  {
    cat: 'crypto', id: 'crypto-07-padding-oracle', title: 'Automated CBC Padding Oracle Decryption',
    org: 'SecureVault Enterprise Micro-API', os: 'Linux', type: 'room', diff: 'hard', pts: 300, dur: 60,
    path: 'crypto-osint-core', author: 'Aegis Cipher Office',
    tags: ['crypto', 'padding-oracle', 'cbc', 'pkcs7', 'vaudenay'],
    cve: 'CWE-388', rating: 4.9, solves: 890, monogram: 'ORACLE',
    story: "L'API de chiffrement de cookies de SecureVault renvoie un message HTTP 500 'Invalid Padding' lorsque le bourrage PKCS#7 est corrompu, et HTTP 200 lorsqu'il est valide. En manipulant octet par octet le bloc précédent du texte chiffré (attaque de Vaudenay), interroge l'oracle pour déchiffrer l'intégralité du jeton sans posséder la clé secrète.",
    tasks: [
      { id: 't1', title: 'Détection de l\'oracle de bourrage PKCS#7', desc: 'Quel statut HTTP signale une erreur de déchiffrement liée au padding ?', pts: 70, flag: '500' },
      { id: 't2', title: 'Déchiffrement du premier octet intermédiaire', desc: 'Quelle valeur hexadécimale de padding cible-t-on au premier tour de boucle ?', pts: 80, flag: '0x01' },
      { id: 't3', title: 'Déchiffrement complet & Flag', desc: 'Exécute padbuster ou un script Python dédié et récupère le jeton maître.', pts: 150, flag: 'CYBERLAB{PADDING_ORACLE_DECRYPTOR_BLOCK_BY_BLOCK_DECIPHER}' }
    ],
    hints: [
      { title: 'Outil PadBuster', cost: 20, content: "padbuster http://localhost:3333/... token 16 -encoding 0" }
    ]
  },
  {
    cat: 'crypto', id: 'crypto-08-rsa-factor-wiener', title: 'Wiener Continued Fractions Attack on RSA',
    org: 'Aegis Cryptographic Labs', os: 'Linux', type: 'challenge', diff: 'hard', pts: 300, dur: 55,
    path: 'crypto-osint-core', author: 'Aegis Cipher Office',
    tags: ['crypto', 'rsa', 'wiener-attack', 'continued-fractions', 'small-d'],
    cve: 'CWE-326', rating: 4.9, solves: 760, monogram: 'WIEN',
    story: "Pour accélérer les signatures cryptographiques de ses serveurs, un ingénieur a sélectionné un exposant privé d très court (d < (1/3) * N^(1/4)). Grâce au théorème de Wiener basé sur le développement en fractions continues de e/N, retrouve l'exposant privé d et factorise le module RSA N pour déchiffrer la clé de chiffrement.",
    tasks: [
      { id: 't1', title: 'Condition de l\'attaque de Wiener', desc: 'Quelle approximation relie l\'exposant public e, la clé privée d et le module N ?', pts: 80, flag: 'e/N ~ k/d' },
      { id: 't2', title: 'Factorisation du module N', desc: 'Retrouve les facteurs premiers p et q via l\'algorithme des fractions continues.', pts: 100, flag: 'FACTOR_N_SUCCESS' },
      { id: 't3', title: 'Déchiffrement du secret d\'État & Flag', desc: 'Reconstitue la clé privée RSA et valide le drapeau.', pts: 120, flag: 'CYBERLAB{WIENER_ATTACK_CONTINUED_FRACTIONS_FACTOR_N}' }
    ],
    hints: [
      { title: 'Bibliothèque SageMath / Python', cost: 20, content: "Cherche l'implémentation de WienerAttack en Python sur GitHub pour extraire d instantanément." }
    ]
  },
  {
    cat: 'crypto', id: 'crypto-09-diffie-hellman-mitm', title: 'Diffie-Hellman Small Subgroup Prime MITM',
    org: 'Telecom Nexus Core Switch', os: 'Linux', type: 'room', diff: 'hard', pts: 350, dur: 60,
    path: 'crypto-osint-core', author: 'Aegis Cipher Office',
    tags: ['crypto', 'diffie-hellman', 'mitm', 'discrete-log', 'pohlig-hellman'],
    cve: 'CWE-326', rating: 4.8, solves: 680, monogram: 'DH',
    story: "Deux serveurs de télécommunication négocient une clé de session via le protocole Diffie-Hellman en utilisant un nombre premier p non sécurisé : l'ordre du groupe p-1 se décompose en une multitude de petits facteurs premiers friables. En interceptant l'échange de clés, applique l'algorithme de Pohlig-Hellman pour résoudre le problème du logarithme discret en quelques secondes.",
    tasks: [
      { id: 't1', title: 'Analyse de la friabilité de p-1', desc: 'Combien de facteurs premiers composent le sous-groupe friable de p-1 ?', pts: 80, flag: '8' },
      { id: 't2', title: 'Résolution du logarithme discret', desc: 'Quelle méthode d\'algèbre modulaire résout le logarithme discret dans les petits sous-groupes ?', pts: 120, flag: 'Pohlig-Hellman' },
      { id: 't3', title: 'Reconstruction du secret partagé & Flag', desc: 'Calcule la clé secrète partagée g^(ab) mod p et déchiffre le message.', pts: 150, flag: 'CYBERLAB{DIFFIE_HELLMAN_WEAK_PRIME_DISCRETE_LOG_SOLVED}' }
    ],
    hints: [
      { title: 'SageMath discrete_log', cost: 20, content: "En SageMath : discrete_log(A, g, algorithm='pohlig_hellman')" }
    ]
  },
  {
    cat: 'crypto', id: 'crypto-10-zkp-elliptic', title: 'ECDSA Reused Nonce Private Key Recovery',
    org: 'Blockchain Core Validator Gateway', os: 'Linux', type: 'challenge', diff: 'insane', pts: 500, dur: 75,
    path: 'crypto-osint-core', author: 'Aegis Cipher Office',
    tags: ['crypto', 'ecdsa', 'secp256k1', 'nonce-reuse', 'elliptic-curve'],
    cve: 'CWE-326', rating: 5.0, solves: 490, monogram: 'ECDSA',
    story: "Un validateur de transactions blockchain signe deux messages distincts (m1 et m2) avec le même nonce aléatoire k en utilisant l'algorithme ECDSA sur la courbe secp256k1 (la faille historique qui a compromis le système de signature PlayStation 3). En soustrayant les deux équations de signature (s1 - s2), calcule la valeur de k, puis déduis la clé privée maîtresse du validateur.",
    tasks: [
      { id: 't1', title: 'Détection de la réutilisation de k (r1 == r2)', desc: 'Quel composant de la paire de signature (r, s) est identique sur les deux signatures ?', pts: 100, flag: 'r' },
      { id: 't2', title: 'Calcul du nonce éphémère k', desc: 'Quelle formule modulaire permet de retrouver k à partir de (z1 - z2) / (s1 - s2) ?', pts: 150, flag: 'k = (z1 - z2) / (s1 - s2) mod n' },
      { id: 't3', title: 'Extraction de la clé privée secrète & Root Flag', desc: 'Calcule la clé privée d = (s*k - z) * r^(-1) mod n et valide le drapeau.', pts: 250, flag: 'CYBERLAB{ECDSA_REUSED_K_PRIVATE_KEY_LATTICE_RECOVERED}' }
    ],
    hints: [
      { title: 'Arithmétique modulaire', cost: 25, content: "Calcule l'inverse modulaire avec pow(s1 - s2, -1, n) en Python 3.8+." }
    ]
  },

  // ==========================================================================
  // FORENSICS & MÉMOIRE (10 LABS)
  // ==========================================================================
  {
    cat: 'forensics', id: 'forensics-01-magic-bytes', title: 'Corrupted File Header & Magic Bytes Repair',
    org: 'Digital Evidence Forensic Archive', os: 'Linux', type: 'challenge', diff: 'beginner', pts: 100, dur: 30,
    path: 'soc-forensics', author: 'Aegis Forensics Lab',
    tags: ['forensics', 'magic-bytes', 'hex-editor', 'png-repair', 'file-signature'],
    cve: 'CWE-434', rating: 4.8, solves: 2820, monogram: 'HEX',
    story: "Un cybercriminel a tenté de détruire une preuve en écrasant les premiers octets (Magic Bytes) d'une image confidentielle avec des octets nuls (00 00 00 00). Utilise un éditeur hexadécimal (HxD, bless ou hexedit) pour restaurer la signature officielle du format PNG (89 50 4E 47 0D 0A 1A 0A) et visualiser la preuve.",
    tasks: [
      { id: 't1', title: 'Identification des octets magiques PNG', desc: 'Quelle est la séquence hexadécimale officielle des 8 premiers octets d\'un fichier PNG ?', pts: 40, flag: '89504E470D0A1A0A' },
      { id: 't2', title: 'Réparation du fichier & Flag', desc: 'Répare l\'en-tête, ouvre l\'image réparée et saisis le drapeau écrit dessus.', pts: 60, flag: 'CYBERLAB{MAGIC_BYTES_PNG_HEADER_RESTORED_SUCCESS_918}' }
    ],
    hints: [
      { title: 'Éditeur hexadécimal', cost: 5, content: "Ouvre le fichier dans CyberChef, utilise l'opération 'To Hex', modifie les 8 premiers octets et 'From Hex'." }
    ]
  },
  {
    cat: 'forensics', id: 'forensics-02-pcap-http', title: 'Wireshark Unencrypted Credential Stream',
    org: 'Enterprise SOC Network Surveillance', os: 'Linux', type: 'room', diff: 'easy', pts: 150, dur: 35,
    path: 'soc-forensics', author: 'Aegis Forensics Lab',
    tags: ['forensics', 'pcap', 'wireshark', 'http-post', 'credentials'],
    cve: 'CWE-319', rating: 4.9, solves: 2410, monogram: 'PCAP',
    story: "Lors d'un incident de sécurité, la sonde réseau a enregistré un fichier de capture de paquets (.pcap). Un attaquant a exfiltré un fichier d'archives confidentiel via une requête HTTP POST non chiffrée. Ouvre la capture dans Wireshark, applique des filtres d'affichage sur les requêtes HTTP, suis le flux TCP (Follow TCP Stream) et recompose le fichier transféré.",
    tasks: [
      { id: 't1', title: 'Endpoint cible de l\'exfiltration', desc: 'Vers quel chemin d\'URL la requête POST a-t-elle été émise ?', pts: 40, flag: '/api/v1/telemetry/push' },
      { id: 't2', title: 'Nom du fichier joint', desc: 'Quel est le nom de l\'archive transmise dans le corps multipart/form-data ?', pts: 50, flag: 'payroll_confidential.zip' },
      { id: 't3', title: 'Extraction de la pièce jointe & Flag', desc: 'Extrais les octets bruts du fichier et valide le drapeau.', pts: 60, flag: 'CYBERLAB{WIRESHARK_HTTP_MULTIPART_EXFILTRATION_CAUGHT}' }
    ],
    hints: [
      { title: 'Filtre Wireshark', cost: 10, content: "http.request.method == \"POST\" puis clic droit -> Follow -> TCP Stream." }
    ]
  },
  {
    cat: 'forensics', id: 'forensics-03-stego-lsb', title: 'Whispers in the Pixels LSB Steganography',
    org: 'Covert Operations Surveillance', os: 'Linux', type: 'challenge', diff: 'easy', pts: 150, dur: 35,
    path: 'soc-forensics', author: 'Aegis Forensics Lab',
    tags: ['forensics', 'steganography', 'lsb', 'zsteg', 'hidden-message'],
    cve: 'CWE-312', rating: 4.8, solves: 1980, monogram: 'STEGO',
    story: "Un agent double a dissimulé des coordonnées d'exfiltration dans les bits de poids faible (Least Significant Bit - LSB) des plans de couleurs rouge, vert et bleu d'une image apparemment anodine. Utilise l'outil zsteg, StegSolve ou un script Python avec Pillow pour extraire le texte caché dans le canal RGB.",
    tasks: [
      { id: 't1', title: 'Canal stéganographique utilisé', desc: 'Quel plan de couleur et ordre de bit contient la chaîne cachée (ex: b1,rgb,lsb) ?', pts: 60, flag: 'b1,rgb,lsb,xy' },
      { id: 't2', title: 'Extraction de la charge utile & Flag', desc: 'Extrais le texte secret et soumets le drapeau.', pts: 90, flag: 'CYBERLAB{STEGO_LSB_RGB_PLANE_SECRET_EXTRACTED}' }
    ],
    hints: [
      { title: 'Outil zsteg', cost: 10, content: "Exécute simplement : zsteg -a image.png pour tester l'ensemble des combinaisons LSB." }
    ]
  },
  {
    cat: 'forensics', id: 'forensics-04-memory-dump', title: 'RAM Footprint Memory Analysis (Volatility 3)',
    org: 'Incident Response Blue Cell', os: 'Linux', type: 'room', diff: 'intermediate', pts: 200, dur: 50,
    path: 'soc-forensics', author: 'Aegis Forensics Lab',
    tags: ['forensics', 'volatility', 'memory-dump', 'lsass', 'malfind'],
    cve: 'CWE-200', rating: 4.9, solves: 1520, monogram: 'RAM',
    story: "Une machine compromise a fait l'objet d'une acquisition de mémoire vive complète (dump brut de 512 Mo). Utilise le framework forensique Volatility 3 pour lister les processus en cours d'exécution au moment du crash (windows.pslist), identifier le processus injecté suspect et extraire les commandes passées dans la console cmd.",
    tasks: [
      { id: 't1', title: 'PID du processus malveillant injecté', desc: 'Quel processus anormal n\'a pas de processus parent valide ?', pts: 60, flag: '3844' },
      { id: 't2', title: 'Nom du fichier binaire exécuté', desc: 'Quel exécutable a été invoqué depuis le répertoire AppData\\Local\\Temp ?', pts: 60, flag: 'beacon_x64.exe' },
      { id: 't3', title: 'Extraction de la commande & Flag', desc: 'Extrais l\'historique des commandes avec windows.cmdline et valide le drapeau.', pts: 80, flag: 'CYBERLAB{MEMORY_DUMP_VOLATILITY_HASHES_EXTRACTED}' }
    ],
    hints: [
      { title: 'Commandes Volatility 3', cost: 15, content: "python3 vol.py -f dump.raw windows.pslist et windows.cmdline" }
    ]
  },
  {
    cat: 'forensics', id: 'forensics-05-corrupted-zip', title: 'The Mended Central Directory Archive',
    org: 'SecOps Incident Response Unit', os: 'Linux', type: 'challenge', diff: 'easy', pts: 150, dur: 40,
    path: 'soc-forensics', author: 'Aegis Forensics Lab',
    tags: ['forensics', 'zip-repair', 'central-directory', 'hex-carving', 'pkzip'],
    cve: 'CWE-20', rating: 4.8, solves: 1840, monogram: 'ZIP',
    story: "Une archive ZIP contenant des journaux d'audit a été endommagée : l'enregistrement de fin de répertoire central (End of Central Directory Record - EOCD) a été corrompu par un outil d'effacement sécurisé. Reconstruis les signatures PK\\x01\\x02 et PK\\x05\\x06 à l'aide de zipdetails ou d'un script Python pour réparer l'archive et décompresser le fichier secret.",
    tasks: [
      { id: 't1', title: 'Signature hexadécimale du Central Directory', desc: 'Quels sont les 4 octets de la signature de début d\'en-tête de fichier local ZIP ?', pts: 50, flag: '504B0304' },
      { id: 't2', title: 'Réparation et extraction du document & Flag', desc: 'Répare l\'archive, décompresse report.pdf et saisis le drapeau.', pts: 100, flag: 'CYBERLAB{ZIP_CENTRAL_DIRECTORY_HEADER_MANUALLY_FIXED}' }
    ],
    hints: [
      { title: 'Outil de réparation', cost: 10, content: "Utilise zip -FF archive_corrompue.zip --out reparee.zip sous Linux." }
    ]
  },
  {
    cat: 'forensics', id: 'forensics-06-usb-device-log', title: 'Rogue Peripheral Windows Event Log Forensics',
    org: 'Internal Affairs Security Division', os: 'Windows', type: 'room', diff: 'intermediate', pts: 200, dur: 45,
    path: 'soc-forensics', author: 'Aegis Forensics Lab',
    tags: ['forensics', 'event-logs', 'evtx', 'usb-forensics', 'registry'],
    cve: 'CWE-284', rating: 4.8, solves: 1470, monogram: 'EVTX',
    story: "Une fuite de données par support physique a eu lieu dans une salle sécurisée. Analyse le journal d'événements Windows Microsoft-Windows-Storage-ClassPnp/Operational.evtx ainsi que les ruches de registre SYSTEM pour retrouver le fabricant, le numéro de série unique et l'heure exacte de connexion de la clé USB pirate.",
    tasks: [
      { id: 't1', title: 'Numéro de série de la clé USB malveillante', desc: 'Quel est le numéro de série unique de la clé USB branchée à 14h22 ?', pts: 60, flag: 'AA04012700013149' },
      { id: 't2', title: 'Identifiant du fabricant (VID/PID)', desc: 'Quel est l\'identifiant matériel VID de l\'appareil ?', pts: 60, flag: 'VID_0781' },
      { id: 't3', title: 'Clôture de l\'investigation & Flag', desc: 'Confirme le nom de volume attribué et soumets le drapeau officiel.', pts: 80, flag: 'CYBERLAB{WINDOWS_EVENT_LOGS_USBSTOR_SERIAL_MATCHED}' }
    ],
    hints: [
      { title: 'Parser EVTX', cost: 15, content: "Utilise python-evtx ou l'Observateur d'événements Windows pour filtrer sur l'Event ID 1001." }
    ]
  },
  {
    cat: 'forensics', id: 'forensics-07-volatility-malware', title: 'Process Hollowing & DLL Injection Triage',
    org: 'Cyber Defense Operations Center', os: 'Windows', type: 'room', diff: 'hard', pts: 300, dur: 60,
    path: 'soc-forensics', author: 'Aegis Forensics Lab',
    tags: ['forensics', 'volatility', 'process-hollowing', 'dll-injection', 'malfind'],
    cve: 'CWE-200', rating: 4.9, solves: 890, monogram: 'HOLLOW',
    story: "Un malware furtif a utilisé la technique du 'Process Hollowing' : il a démarré une instance légitime de svchost.exe en état suspendu, vidé son espace mémoire, et y a injecté un exécutable de télécommande hostile (C2). Utilise le plugin malfind de Volatility pour détecter les pages mémoires allouées avec les permissions PAGE_EXECUTE_READWRITE et extraire le binaire injecté.",
    tasks: [
      { id: 't1', title: 'Détection des pages RWX suspectes', desc: 'Quel processus système légitime contient des allocations mémoire PAGE_EXECUTE_READWRITE ?', pts: 70, flag: 'svchost.exe' },
      { id: 't2', title: 'Extraction de l\'exécutable PE injecté', desc: 'Quel est le hash SHA256 de la charge utile extraite par malfind ?', pts: 90, flag: 'DUMP_PE_EXTRACTED' },
      { id: 't3', title: 'Configuration du C2 & Flag', desc: 'Trouve l\'adresse IP de commande et contrôle dans le binaire extrait et valide le drapeau.', pts: 140, flag: 'CYBERLAB{VOLATILITY_MALFIND_PROCESS_HOLLOW_DETECTED}' }
    ],
    hints: [
      { title: 'Plugin Malfind', cost: 20, content: "python3 vol.py -f dump.raw windows.malfind --dump pour extraire les injectés sur disque." }
    ]
  },
  {
    cat: 'forensics', id: 'forensics-08-ntfs-mft-timeline', title: 'Master File Table ($MFT) Timestomp Reconstruction',
    org: 'DFIR Forensic Examination Squad', os: 'Windows', type: 'room', diff: 'hard', pts: 300, dur: 60,
    path: 'soc-forensics', author: 'Aegis Forensics Lab',
    tags: ['forensics', 'mft', 'ntfs', 'timestomping', 'timeline'],
    cve: 'CWE-200', rating: 4.9, solves: 810, monogram: 'MFT',
    story: "L'attaquant a modifié les horodatages standards ($STANDARD_INFORMATION) d'un script malveillant pour faire croire qu'il datait de l'installation initiale de Windows (Timestomping). En analysant le fichier de métadonnées du système de fichiers NTFS ($MFT) avec mftdump, compare les attributs $STANDARD_INFORMATION avec les attributs non modifiables $FILE_NAME pour prouver la manipulation chronologique.",
    tasks: [
      { id: 't1', title: 'Attribut NTFS résistant au timestomping basique', desc: 'Quel attribut NTFS conserve généralement l\'horodatage réel lors d\'un timestomp standard ?', pts: 80, flag: '$FILE_NAME' },
      { id: 't2', title: 'Date réelle de création du script hostile', desc: 'Quel jour exact le fichier malveillant a-t-il été créé (format YYYY-MM-DD) ?', pts: 90, flag: '2026-10-14' },
      { id: 't3', title: 'Validation forensique & Flag', desc: 'Identifie le nom originel du fichier avant renommage et saisis le drapeau.', pts: 130, flag: 'CYBERLAB{NTFS_MFT_FILE_CREATE_TIMESTOMP_DETECTED_OK}' }
    ],
    hints: [
      { title: 'Outil Analyse MFT', cost: 20, content: "Utilise analyzeMFT.py ou MFTECmd de Eric Zimmerman pour générer un fichier CSV chronologique." }
    ]
  },
  {
    cat: 'forensics', id: 'forensics-09-ransomware-decrypt', title: 'Ransomware Master Key Recovery from Volatile RAM',
    org: 'Cyber Crisis Emergency Response Team', os: 'Windows', type: 'machine', diff: 'insane', pts: 450, dur: 75,
    path: 'soc-forensics', author: 'Aegis Forensics Lab',
    tags: ['forensics', 'ransomware', 'aes-key-schedule', 'volatility', 'incident-response'],
    cve: 'CWE-312', rating: 5.0, solves: 510, monogram: 'CRYPT',
    story: "Une attaque par rançongiciel a chiffré les bases de données d'un centre hospitalier avec AES-256. L'ordinateur de supervision a été gelé avant son extinction, préservant la mémoire vive de l'attaque. En utilisant le plugin aeskeyfind pour scanner les structures de tables de clés étendues (Key Schedule) dans le dump mémoire, extrais la clé AES-256 et déchiffre les fichiers vitaux sans payer la rançon.",
    tasks: [
      { id: 't1', title: 'Localisation de la clé AES dans l\'espace mémoire', desc: 'Quel outil spécialisé recherche l\'expansion de clé AES dans un dump brut ?', pts: 100, flag: 'aeskeyfind' },
      { id: 't2', title: 'Extraction de la clé AES 256 bits (User Flag)', desc: 'Extrais la clé de 64 caractères hexadécimaux et déchiffre le premier fichier.', pts: 150, flag: 'CYBERLAB{user_ransomware_aes_256_key_carved_success}' },
      { id: 't3', title: 'Restauration complète de la base de données & Root Flag', desc: 'Restaure l\'archive des dossiers médicaux et capture le drapeau de libération.', pts: 200, flag: 'CYBERLAB{AES_EXPANDED_KEY_SCHEDULE_IN_RAM_CARVED_CLEARED}' }
    ],
    hints: [
      { title: 'Outil aeskeyfind', cost: 25, content: "aeskeyfind -v -t 256 memory.raw listera toutes les clés AES-256 candidates trouvées." }
    ]
  },
  {
    cat: 'forensics', id: 'forensics-10-volatility-lsass-dump', title: 'Cobalt Strike Beacon In-Memory LSASS Carving',
    org: 'National Banking Network Defense', os: 'Windows', type: 'machine', diff: 'insane', pts: 500, dur: 80,
    path: 'soc-forensics', author: 'Aegis Forensics Lab',
    tags: ['forensics', 'cobalt-strike', 'lsass', 'mimikatz', 'threat-hunting'],
    cve: 'CWE-200', rating: 5.0, solves: 470, monogram: 'COBALT',
    story: "Une équipe APT a déployé un implant Cobalt Strike Beacon dans un processus Windows pour déverser les secrets du Local Security Authority Subsystem Service (LSASS.exe). Analyse le dump mémoire de 1 Go avec Volatility, reconstitue la configuration complète du Beacon (Watermark, C2 Domains, Public Key, Sleep Time) et débloque le drapeau de contre-mesure d'élite.",
    tasks: [
      { id: 't1', title: 'Identification du Watermark Cobalt Strike', desc: 'Quel est l\'identifiant de licence (Watermark) extrait de la configuration du Beacon ?', pts: 100, flag: '135486920' },
      { id: 't2', title: 'Domaine de commande et contrôle (C2) (User Flag)', desc: 'Vers quel domaine externe le Beacon émet-il ses balises HTTP ?', pts: 150, flag: 'CYBERLAB{user_cobalt_strike_c2_domain_identified}' },
      { id: 't3', title: 'Extraction des secrets de session & Root Flag', desc: 'Extrais le ticket de session et débloque le drapeau souverain.', pts: 250, flag: 'CYBERLAB{COBALT_STRIKE_BEACON_CONFIG_LSASS_EXTRACTED_2026}' }
    ],
    hints: [
      { title: 'Parser Cobalt Strike', cost: 25, content: "Utilise le script Python cobaltstrikescan ou 1768.py pour analyser les configurations C2 en mémoire." }
    ]
  },

  // ==========================================================================
  // REVERSE ENGINEERING (10 LABS)
  // ==========================================================================
  {
    cat: 'reverse', id: 'rev-01-js-packer', title: 'Obfuscated JavaScript Loader Deobfuscation',
    org: 'FinTech Web Application Defense', os: 'Linux', type: 'challenge', diff: 'beginner', pts: 100, dur: 30,
    path: 'systems-reversing', author: 'Aegis Malware Unit',
    tags: ['reverse', 'javascript', 'deobfuscation', 'js-packer', 'ast'],
    cve: 'CWE-312', rating: 4.8, solves: 2680, monogram: 'JS',
    story: "Un script client de vérification de licence a été obfusqué avec un compresseur JS Packer et un tableau de chaînes chiffrées par décalage. Utilise les outils de développement Chrome, un déobfuscateur AST ou une exécution pas-à-pas dans un bac à sable Node.js sécurisé pour nettoyer le code et trouver le mot de passe secret de validation.",
    tasks: [
      { id: 't1', title: 'Nom du tableau de chaînes obfusqué', desc: 'Quelle variable globale contient le dictionnaire de chaînes encodées ?', pts: 40, flag: '_0x4e21' },
      { id: 't2', title: 'Clé secrète de licence & Flag', desc: 'Reconstitue la fonction de déchiffrement et soumets la clé de licence découverte.', pts: 60, flag: 'CYBERLAB{JAVASCRIPT_DEOBFUSCATION_PACKER_CRACKED_SUCCESS}' }
    ],
    hints: [
      { title: 'Déobfuscateur en ligne', cost: 5, content: "Utilise deobfuscate.io ou un formateur de code (Beautifier) combiné avec console.log()." }
    ]
  },
  {
    cat: 'reverse', id: 'rev-02-pyc-decompile', title: 'Python Bytecode Decompilation (pyc)',
    org: 'CyberDyne Automation Scripts', os: 'Linux', type: 'challenge', diff: 'easy', pts: 150, dur: 35,
    path: 'systems-reversing', author: 'Aegis Malware Unit',
    tags: ['reverse', 'python', 'pyc', 'decompilation', 'uncompyle6'],
    cve: 'CWE-312', rating: 4.9, solves: 2210, monogram: 'PYC',
    story: "Un script de gestionnaire de licences Python compilé (.pyc) a été récupéré sur un serveur sans ses fichiers sources .py d'origine. Utilise decompyle++ (pycdc) ou le module disassemble de Python pour décompiler le bytecode, comprendre l'algorithme de calcul du numéro de série et générer une clé valide.",
    tasks: [
      { id: 't1', title: 'Version de Python dans l\'en-tête du fichier', desc: 'Quelle version de Python a produit ce fichier compilé ?', pts: 40, flag: 'Python 3.10' },
      { id: 't2', title: 'Nom de la fonction de contrôle', desc: 'Quelle fonction vérifie la conformité de la clé d\'accès ?', pts: 50, flag: 'verify_license_token' },
      { id: 't3', title: 'Clé valide & Flag', desc: 'Déchiffre la clé codée en dur et valide le drapeau.', pts: 60, flag: 'CYBERLAB{PYTHON_BYTECODE_DECOMPILED_PYC_SUCCESS_772}' }
    ],
    hints: [
      { title: 'Outil pycdc', cost: 10, content: "pycdc license_check.pyc ou uncompyle6 pour reconstituer le code Python propre." }
    ]
  },
  {
    cat: 'reverse', id: 'rev-03-strings-crackme', title: 'ELF Binary Hardcoded Validation Crackme',
    org: 'Aegis Binary Analysis Unit', os: 'Linux', type: 'challenge', diff: 'beginner', pts: 100, dur: 30,
    path: 'systems-reversing', author: 'Aegis Malware Unit',
    tags: ['reverse', 'elf', 'strings', 'crackme', 'binary'],
    cve: 'CWE-312', rating: 4.8, solves: 2840, monogram: 'ELF',
    story: "Un exécutable Linux ELF x86_64 demande un mot de passe d'activation. L'ingénieur novice a stocké la clé de validation directement en clair dans la section de données en lecture seule (.rodata) du binaire. Utilise l'utilitaire strings ou l'explorateur Ghidra pour extraire la chaîne secrète sans exécuter le fichier.",
    tasks: [
      { id: 't1', title: 'Extraction des chaînes imprimables', desc: 'Quelle commande Linux permet de lister les chaînes de texte d\'un binaire ?', pts: 40, flag: 'strings' },
      { id: 't2', title: 'Validation du mot de passe & Flag', desc: 'Passe le mot de passe en argument au binaire et capture le drapeau.', pts: 60, flag: 'CYBERLAB{STRINGS_COMMAND_REVEALED_HARDCODED_KEY}' }
    ],
    hints: [
      { title: 'Commande strings', cost: 5, content: "strings ./crackme | grep -i 'key\\|flag\\|pass'" }
    ]
  },
  {
    cat: 'reverse', id: 'rev-04-radare-simple', title: 'Ghidra / Radare2 Disassembly & Branch Patching',
    org: 'SecureSoftware Validation Suite', os: 'Linux', type: 'challenge', diff: 'easy', pts: 150, dur: 40,
    path: 'systems-reversing', author: 'Aegis Malware Unit',
    tags: ['reverse', 'ghidra', 'radare2', 'assembly', 'patching'],
    cve: 'CWE-287', rating: 4.9, solves: 1780, monogram: 'R2',
    story: "Un binaire de protection logicielle effectue une comparaison complexe entre l'entrée utilisateur et une valeur calculée, suivie d'un saut conditionnel jne (Jump if Not Equal) vers un échec. Utilise Ghidra ou Radare2 pour désassembler la fonction principale (main), repérer l'instruction de saut conditionnel et la patcher en nop (0x90) ou jmp inconditionnel.",
    tasks: [
      { id: 't1', title: 'Adresse de l\'instruction de saut conditionnel', desc: 'Quelle est l\'adresse mémoire de l\'instruction jne incriminée ?', pts: 50, flag: '0x00401142' },
      { id: 't2', title: 'Opcode de remplacement NOP', desc: 'Quel octet hexadécimal correspond à l\'instruction No-Operation (NOP) en x86 ?', pts: 40, flag: '0x90' },
      { id: 't3', title: 'Exécution du binaire patché & Flag', desc: 'Patche le fichier, exécute-le et soumets le drapeau de victoire.', pts: 60, flag: 'CYBERLAB{DISASSEMBLY_RADARE2_JNZ_PATCH_BYPASS}' }
    ],
    hints: [
      { title: 'Radare2 écriture', cost: 10, content: "r2 -w ./binary puis s 0x00401142 et wa nop" }
    ]
  },
  {
    cat: 'reverse', id: 'rev-05-angr-symbolic', title: 'Angr Symbolic Execution Crackme Solver',
    org: 'Automated Vulnerability Research Lab', os: 'Linux', type: 'room', diff: 'intermediate', pts: 200, dur: 50,
    path: 'systems-reversing', author: 'Aegis Malware Unit',
    tags: ['reverse', 'angr', 'symbolic-execution', 'smt-solver', 'python'],
    cve: 'CWE-20', rating: 4.9, solves: 1380, monogram: 'ANGR',
    story: "Ce binaire crackme applique une suite de 40 équations non linéaires entremêlées sur chaque caractère du mot de passe. L'analyse manuelle prendrait des semaines. Utilise le framework d'exécution symbolique Angr en Python pour explorer automatiquement l'arbre des chemins d'exécution (SimulationManager), trouver l'adresse de la branche 'SUCCESS' et résoudre les contraintes mathématiques du flag.",
    tasks: [
      { id: 't1', title: 'Adresse du bloc de base gagnant (FIND)', desc: 'Quelle est l\'adresse mémoire du bloc affichant \'Access Granted\' ?', pts: 60, flag: '0x401280' },
      { id: 't2', title: 'Adresse du bloc de base perdant (AVOID)', desc: 'Quelle est l\'adresse du bloc affichant \'Invalid Key\' ?', pts: 60, flag: '0x4012a4' },
      { id: 't3', title: 'Résolution par Angr & Flag', desc: 'Exécute le script Angr et soumets la chaîne trouvée par le solveur Z3.', pts: 80, flag: 'CYBERLAB{ANGR_SYMBOLIC_EXECUTION_CONSTRAINTS_SOLVED}' }
    ],
    hints: [
      { title: 'Script Angr', cost: 15, content: "simgr = proj.factory.simulation_manager(); simgr.explore(find=0x401280, avoid=0x4012a4)" }
    ]
  },
  {
    cat: 'reverse', id: 'rev-06-anti-debug-pe', title: 'Bypassing PE IsDebuggerPresent & PEB Detection',
    org: 'FinTech Desktop Security Core', os: 'Windows', type: 'room', diff: 'hard', pts: 300, dur: 60,
    path: 'systems-reversing', author: 'Aegis Malware Unit',
    tags: ['reverse', 'anti-debugging', 'peb', 'isdebuggerpresent', 'x64dbg'],
    cve: 'CWE-20', rating: 4.9, solves: 870, monogram: 'PEB',
    story: "Un agent Windows PE intègre des techniques sophistiquées d'anti-débogage : appel à l'API IsDebuggerPresent(), inspection manuelle du champ BeingDebugged dans le Process Environment Block (PEB) à fs:[0x30], et mesure du temps avec rdtsc pour détecter les points d'arrêt. Utilise x64dbg avec le plugin ScyllaHide pour contourner ces défenses et déchiffrer la charge utile.",
    tasks: [
      { id: 't1', title: 'Structure Windows contenant le drapeau BeingDebugged', desc: 'Quelle structure interne de processus Windows est ciblée par fs:[0x30] ?', pts: 80, flag: 'PEB' },
      { id: 't2', title: 'Instruction x86 de mesure des cycles processeur', desc: 'Quelle instruction assembleur mesure le nombre de cycles CPU (détection de pas-à-pas) ?', pts: 80, flag: 'rdtsc' },
      { id: 't3', title: 'Contournement et extraction & Flag', desc: 'Pose un point d\'arrêt matériel après les contrôles et extrais le drapeau.', pts: 140, flag: 'CYBERLAB{PEB_BEING_DEBUGGED_FLAG_BYPASS_KEY_UNLOCKED}' }
    ],
    hints: [
      { title: 'Plugin ScyllaHide', cost: 20, content: "Active ScyllaHide dans x64dbg pour intercepter automatiquement les vérifications du PEB." }
    ]
  },
  {
    cat: 'reverse', id: 'rev-07-wasm-reverse', title: 'WebAssembly (WASM) Stack Machine Reversal',
    org: 'NextGen Browser Security Systems', os: 'Linux', type: 'room', diff: 'hard', pts: 300, dur: 55,
    path: 'systems-reversing', author: 'Aegis Malware Unit',
    tags: ['reverse', 'wasm', 'webassembly', 'wasm2wat', 'bytecode'],
    cve: 'CWE-20', rating: 4.8, solves: 780, monogram: 'WASM',
    story: "Une application web bancaire délègue la vérification du code PIN à un module binaire WebAssembly (.wasm) compilé depuis Rust. Convertis le binaire WASM en format texte WebAssembly (.wat) avec l'outil wasm2wat du toolkit WABT, analyse les opcodes de pile (i32.const, i32.xor, i32.eqz) et reconstitue l'algorithme de hachage secret.",
    tasks: [
      { id: 't1', title: 'Outil de conversion binaire vers texte WASM', desc: 'Quel utilitaire de la suite WABT transforme un fichier .wasm en code .wat lisible ?', pts: 70, flag: 'wasm2wat' },
      { id: 't2', title: 'Nom de la fonction de validation exportée', desc: 'Quelle fonction est déclarée dans la section (export "...") du module WASM ?', pts: 80, flag: 'validate_pin' },
      { id: 't3', title: 'Reconstitution du PIN & Flag', desc: 'Retrouve la valeur secrète du PIN et soumets le drapeau de validation.', pts: 150, flag: 'CYBERLAB{WASM2WAT_BYTECODE_STACK_MACHINE_KEY_PARSED}' }
    ],
    hints: [
      { title: 'Outil wasm2wat', cost: 20, content: "wasm2wat validator.wasm -o validator.wat puis inspecte les instructions de la fonction exportée." }
    ]
  },
  {
    cat: 'reverse', id: 'rev-08-vm-obfuscation', title: 'Custom Virtual Machine Bytecode Dispatcher',
    org: 'Commercial DRM Licensing Core', os: 'Linux', type: 'machine', diff: 'insane', pts: 450, dur: 80,
    path: 'systems-reversing', author: 'Aegis Malware Unit',
    tags: ['reverse', 'vm-obfuscation', 'virtual-machine', 'bytecode', 'dispatcher'],
    cve: 'CWE-20', rating: 5.0, solves: 480, monogram: 'VM',
    story: "Le binaire intègre un moteur de machine virtuelle personnalisée (VM-based Obfuscation) avec un dispatcheur d'opcodes sur boucle switch-case. Les instructions x86 natives ont été traduites dans un bytecode propriétaire non documenté opérant sur des registres virtuels (V_REG0 à V_REG7). Écris un émulateur ou un désassembleur pour cartographier les 12 opcodes de la VM et extraire la clé de licence.",
    tasks: [
      { id: 't1', title: 'Repérage de la table des pointeurs de fonction (Jump Table)', desc: 'Combien d\'opcodes virtuels sont pris en charge par la boucle de dispatch ?', pts: 100, flag: '12' },
      { id: 't2', title: 'Désassemblage du bytecode propriétaire (User Flag)', desc: 'Reconstitue la suite d\'instructions de la VM et obtiens le premier secret.', pts: 150, flag: 'CYBERLAB{user_vm_bytecode_dispatcher_emulated_step}' },
      { id: 't3', title: 'Extraction de la clé maîtresse & Root Flag', desc: 'Inverse l\'algorithme de contrôle de la VM et capture le drapeau souverain.', pts: 200, flag: 'CYBERLAB{VIRTUAL_MACHINE_DISPATCHER_EMULATION_CRACKED}' }
    ],
    hints: [
      { title: 'Repérage de la boucle VM', cost: 25, content: "Localise la boucle contenant : opcode = bytecode[pc++]; switch(opcode) { case 0x01: ... }" }
    ]
  },
  {
    cat: 'reverse', id: 'rev-09-kernel-driver-rootkit', title: 'DKOM Process Hiding Kernel Driver Analysis',
    org: 'Advanced Malware Research Center', os: 'Windows', type: 'machine', diff: 'insane', pts: 500, dur: 85,
    path: 'systems-reversing', author: 'Aegis Malware Unit',
    tags: ['reverse', 'rootkit', 'dkom', 'kernel-driver', 'windbg'],
    cve: 'CWE-200', rating: 5.0, solves: 430, monogram: 'DKOM',
    story: "Un pilote de noyau malveillant (.sys) pour Windows x64 applique la technique de manipulation directe d'objets du noyau (Direct Kernel Object Manipulation - DKOM). En modifiant les pointeurs de la liste doublement chaînée ActiveProcessLinks dans la structure EPROCESS, le rootkit rend un processus totalement invisible à la commande Tasklist et au gestionnaire des tâches. Analyse le pilote sous Ghidra / WinDbg pour neutraliser le rootkit.",
    tasks: [
      { id: 't1', title: 'Structure système ciblée par le rootkit', desc: 'Quelle structure interne de processus Windows est modifiée dans l\'espace noyau ?', pts: 100, flag: 'EPROCESS' },
      { id: 't2', title: 'Champ de liste doublement chaînée modifié (User Flag)', desc: 'Quel membre de la structure EPROCESS est déchaîné pour masquer le processus ?', pts: 150, flag: 'ActiveProcessLinks' },
      { id: 't3', title: 'Neutralisation du pilote & Root Flag', desc: 'Restaure la cohérence de la liste chaînée et capture le drapeau système.', pts: 250, flag: 'CYBERLAB{DKOM_EPROCESS_ACTIVE_PROCESS_LINKS_UNLINKED}' }
    ],
    hints: [
      { title: 'Structure EPROCESS', cost: 25, content: "Dans WinDbg : dt nt!_EPROCESS ActiveProcessLinks pour observer le décalage (offset)." }
    ]
  },
  {
    cat: 'reverse', id: 'rev-10-golang-stripped-binary', title: 'Stripped Go Binary Symbol Reconstruction',
    org: 'Modern Cloud Native Malware Lab', os: 'Linux', type: 'machine', diff: 'insane', pts: 500, dur: 80,
    path: 'systems-reversing', author: 'Aegis Malware Unit',
    tags: ['reverse', 'golang', 'stripped', 'pclntab', 'ghidra'],
    cve: 'CWE-20', rating: 5.0, solves: 450, monogram: 'GO',
    story: "Un binaire compilé en Go 1.21 a été débarrassé de tous ses symboles standards (stripped binaire). La convention d'appel inhabituelle de Go et l'absence de tables de symboles standard compliquent le désassemblage. En analysant la table interne pclntab (PC-Line Table) propre au runtime Go, restaure les noms de fonctions, les délimiteurs de paquets et la fonction principale main.main() pour identifier l'implant malveillant.",
    tasks: [
      { id: 't1', title: 'Table interne du runtime Go contenant les symboles', desc: 'Quelle table de métadonnées interne Go permet de récupérer les noms de fonctions ?', pts: 100, flag: 'pclntab' },
      { id: 't2', title: 'Nom de la fonction d\'exfiltration principale (User Flag)', desc: 'Quelle fonction dans le package main déclenche l\'appel réseau ?', pts: 150, flag: 'main.exfiltrateCredentials' },
      { id: 't3', title: 'Déchiffrement des flux & Root Flag', desc: 'Extrais la clé de session et valide le drapeau de contrôle.', pts: 250, flag: 'CYBERLAB{GOLANG_STRIPPED_PCLNTAB_FUNCTIONS_RESTORED_2026}' }
    ],
    hints: [
      { title: 'Script Ghidra Go', cost: 25, content: "Utilise le script Ghidra go_entry.py ou GoReSym pour restaurer l'intégralité des symboles automatiquement." }
    ]
  },

  // ==========================================================================
  // RÉSEAU & INFRASTRUCTURE (8 LABS)
  // ==========================================================================
  {
    cat: 'network', id: 'net-01-wireshark-ftp', title: 'Cleartext FTP Session Sniffing',
    org: 'Legacy Datacenter Storage Link', os: 'Linux', type: 'challenge', diff: 'beginner', pts: 100, dur: 30,
    path: 'soc-forensics', author: 'Aegis Network Squad',
    tags: ['network', 'wireshark', 'ftp', 'cleartext', 'sniffing'],
    cve: 'CWE-319', rating: 4.8, solves: 2890, monogram: 'FTP',
    story: "Le protocole de transfert de fichiers FTP transmet les identifiants et les données en clair sur le réseau (port 21). Dans une capture de trafic réseau réalisée sur le commutateur central, filtre sur le trafic FTP pour retrouver le nom d'utilisateur, le mot de passe de l'administrateur et le fichier confidentiel téléchargé.",
    tasks: [
      { id: 't1', title: 'Nom d\'utilisateur transmis en clair', desc: 'Quel utilisateur s\'est connecté via la commande USER ?', pts: 40, flag: 'ftp_admin' },
      { id: 't2', title: 'Mot de passe et Flag de contrôle', desc: 'Identifie le mot de passe envoyé avec PASS et capture le drapeau.', pts: 60, flag: 'CYBERLAB{WIRESHARK_FTP_CLEARTEXT_PASSWORD_DISCOVERED}' }
    ],
    hints: [
      { title: 'Filtre Wireshark', cost: 5, content: "Applique le filtre ftp ou ftp-data dans la barre de recherche Wireshark." }
    ]
  },
  {
    cat: 'network', id: 'net-02-nmap-dmz', title: 'DMZ Perimeter Port Scanning & Banner Grabbing',
    org: 'Aegis Cyber Defense DMZ Gateway', os: 'Linux', type: 'room', diff: 'beginner', pts: 100, dur: 35,
    path: 'soc-forensics', author: 'Aegis Cyber Defense',
    tags: ['network', 'nmap', 'reconnaissance', 'banner-grabbing', 'ports'],
    cve: 'CWE-200', rating: 4.8, solves: 2710, monogram: 'NMAP',
    story: "Un serveur passerelle en zone démilitarisée (DMZ) expose plusieurs services suspects suite à une maintenance précipitée. Effectue un scan réseau méthodique avec Nmap pour cartographier les ports TCP ouverts, capturer les bannières de version (-sV) et identifier le service de débogage obsolète laissé ouvert.",
    tasks: [
      { id: 't1', title: 'Port du service de maintenance', desc: 'Sur quel port TCP inhabituel le service de débogage écoute-t-il ?', pts: 30, flag: '8088' },
      { id: 't2', title: 'Nom et version du démon', desc: 'Quelle est la version du démon affichée dans le Server header ?', pts: 30, flag: 'MicroSrv/2.4.1-rc3' },
      { id: 't3', title: 'Bannière de maintenance & Flag', desc: 'Connecte-toi avec Netcat sur le port 8088 et lis le message d\'accueil.', pts: 40, flag: 'CYBERLAB{DMZ_PERIMETER_RECON_NMAP_BANNER_DISCOVERED}' }
    ],
    hints: [
      { title: 'Scan complet', cost: 5, content: "nmap -p- -sV -sC <TARGET_IP> pour analyser l'ensemble des 65535 ports." }
    ]
  },
  {
    cat: 'network', id: 'net-03-snmp-enum', title: 'SNMP Public Community String Reconnaissance',
    org: 'Enterprise Core Switch Fabric', os: 'Linux', type: 'room', diff: 'easy', pts: 150, dur: 40,
    path: 'soc-forensics', author: 'Aegis Network Squad',
    tags: ['network', 'snmp', 'snmpwalk', 'mib', 'reconnaissance'],
    cve: 'CWE-200', rating: 4.8, solves: 2190, monogram: 'SNMP',
    story: "Le routeur de cœur de réseau exécute un agent SNMPv2c configuré avec la chaîne de communauté par défaut 'public' accessible en lecture seule. Utilise snmpwalk pour parcourir l'arbre MIB (Management Information Base), lister les interfaces réseau, les tables de routage, les comptes d'utilisateurs et extraire le mot de passe d'administration stocké dans le champ sysContact.",
    tasks: [
      { id: 't1', title: 'Chaîne de communauté par défaut', desc: 'Quelle chaîne de communauté SNMP classique autorise la lecture sans mot de passe ?', pts: 40, flag: 'public' },
      { id: 't2', title: 'Extraction du contact système (sysContact)', desc: 'Quelle information confidentielle est consignée dans l\'OID 1.3.6.1.2.1.1.4.0 ?', pts: 50, flag: 'admin@aegis.lab' },
      { id: 't3', title: 'Extraction de la MIB complète & Flag', desc: 'Parcours l\'ensemble de l\'arbre MIB et soumets le drapeau dissimulé.', pts: 60, flag: 'CYBERLAB{SNMP_PUBLIC_COMMUNITY_MIB_EXFILTRATED}' }
    ],
    hints: [
      { title: 'Commande snmpwalk', cost: 10, content: "snmpwalk -v2c -c public <TARGET_IP> 1.3.6.1" }
    ]
  },
  {
    cat: 'network', id: 'net-04-telnet-creds', title: 'Cleartext Telnet Remote Shell Capture',
    org: 'Legacy SCADA RTU Gateway', os: 'Linux', type: 'challenge', diff: 'beginner', pts: 100, dur: 30,
    path: 'soc-forensics', author: 'Aegis Network Squad',
    tags: ['network', 'telnet', 'cleartext', 'wireshark', 'credentials'],
    cve: 'CWE-319', rating: 4.8, solves: 2640, monogram: 'TEL',
    story: "Un équipement de contrôle industriel (RTU) est administré via une session Telnet non chiffrée sur le port 23. Dans la capture réseau fournie, analyse le flux TCP interactif caractère par caractère pour reconstituer les identifiants de session et le mot de passe de commande de la turbine.",
    tasks: [
      { id: 't1', title: 'Compte administrateur Telnet', desc: 'Quel utilisateur s\'est authentifié sur le terminal distant ?', pts: 40, flag: 'scada_operator' },
      { id: 't2', title: 'Mot de passe de session & Flag', desc: 'Reconstitue la chaîne envoyée lors du prompt Password: et valide le drapeau.', pts: 60, flag: 'CYBERLAB{TELNET_CLEARTEXT_ROOT_PASSWORD_CAPTURED}' }
    ],
    hints: [
      { title: 'Reconstitution TCP', cost: 5, content: "Dans Wireshark, filtre sur telnet et fais 'Follow TCP Stream' pour voir les commandes tapées." }
    ]
  },
  {
    cat: 'network', id: 'net-05-ssh-pivoting', title: 'Dual-Homed Gateway Dynamic SOCKS5 Pivot',
    org: 'SecOps Perimeter DMZ', os: 'Linux', type: 'room', diff: 'intermediate', pts: 200, dur: 50,
    path: 'soc-forensics', author: 'Aegis Network Squad',
    tags: ['network', 'ssh-tunnel', 'pivoting', 'socks5', 'proxychains'],
    cve: 'CWE-284', rating: 4.9, solves: 1530, monogram: 'PIVOT',
    story: "Tu as obtenu un accès SSH valide sur une machine passerelle possédant deux interfaces réseau : eth0 (réseau externe accessible) et eth1 (réseau interne confidentiel 172.16.10.0/24). Monte un tunnel SOCKS5 dynamique avec ssh -D 1080 et utilise proxychains pour scanner le sous-réseau interne masqué et exploiter le serveur de base de données interne.",
    tasks: [
      { id: 't1', title: 'Argument SSH de tunnel dynamique', desc: 'Quelle option SSH configure un proxy SOCKS5 local dynamique ?', pts: 50, flag: '-D' },
      { id: 't2', title: 'Découverte de l\'hôte interne caché', desc: 'Quelle adresse IP dans le sous-réseau 172.16.10.0/24 répond sur le port 3306 ?', pts: 60, flag: '172.16.10.45' },
      { id: 't3', title: 'Extraction de la base de données & Flag', desc: 'Connecte-toi via le tunnel et capture le drapeau de voûte.', pts: 90, flag: 'CYBERLAB{SSH_DYNAMIC_SOCKS5_PIVOT_INTERNAL_HOST_HIT}' }
    ],
    hints: [
      { title: 'Commande Proxychains', cost: 15, content: "Configure socks5 127.0.0.1 1080 dans /etc/proxychains4.conf et lance proxychains nmap -sT ..." }
    ]
  },
  {
    cat: 'network', id: 'net-06-dns-tunneling', title: 'Covert Data Exfiltration via DNS TXT Queries',
    org: 'Covert Cyber Threat Surveillance', os: 'Linux', type: 'room', diff: 'hard', pts: 300, dur: 60,
    path: 'soc-forensics', author: 'Aegis Network Squad',
    tags: ['network', 'dns-tunneling', 'iodine', 'covert-channel', 'exfiltration'],
    cve: 'CWE-319', rating: 4.9, solves: 890, monogram: 'DNS',
    story: "Un logiciel espion contourne les pare-feu de sortie en encodant les documents volés en Base32/Base64 dans les sous-domaines de requêtes DNS (ex: <données>.c2.attacker.com) et reçoit des commandes via les enregistrements DNS TXT (DNS Tunneling). Analyse la capture de requêtes DNS volumineuses, décode les préfixes de requêtes et reconstitue le fichier exfiltré.",
    tasks: [
      { id: 't1', title: 'Type de requête DNS transportant la charge utile', desc: 'Quel type d\'enregistrement DNS (A, TXT, CNAME) renvoie les blocs de réponse ?', pts: 70, flag: 'TXT' },
      { id: 't2', title: 'Nom de domaine de commandement (C2)', desc: 'Quel domaine de premier niveau reçoit les sous-domaines volumineux ?', pts: 80, flag: 'tunnel.c2-command.org' },
      { id: 't3', title: 'Reconstitution du fichier & Flag', desc: 'Concatène les fragments de chaînes et soumets le drapeau volé.', pts: 150, flag: 'CYBERLAB{DNS_TXT_QUERY_BASE32_C2_EXFILTRATION_CAUGHT}' }
    ],
    hints: [
      { title: 'Script tshark', cost: 20, content: "tshark -r dns.pcap -T fields -e dns.qry.name | cut -d'.' -f1 | base64 -d" }
    ]
  },
  {
    cat: 'network', id: 'net-07-bgp-hijack-simulation', title: 'Autonomous System BGP Prefix Hijack Simulation',
    org: 'Global Internet Exchange Point', os: 'Linux', type: 'machine', diff: 'insane', pts: 500, dur: 80,
    path: 'soc-forensics', author: 'Aegis Network Squad',
    tags: ['network', 'bgp', 'routing-attack', 'autonomous-system', 'prefix-hijack'],
    cve: 'CWE-284', rating: 5.0, solves: 420, monogram: 'BGP',
    story: "Dans un environnement de routage inter-domaines BGP (Border Gateway Protocol) virtualisé avec FRRouting (FRR), simule un détournement de préfixe BGP (BGP Hijacking) : annonce un préfixe plus spécifique (/24 au lieu de /22) avec un chemin AS plus court pour forcer les routeurs d'échange à rediriger l'intégralité du trafic d'un réseau bancaire vers ton routeur d'interception.",
    tasks: [
      { id: 't1', title: 'Règle de sélection de route BGP prépondérante', desc: 'Quelle règle de table de routage IP donne priorité au préfixe le plus précis ?', pts: 100, flag: 'Longest Prefix Match' },
      { id: 't2', title: 'Annonce du préfixe pirate (User Flag)', desc: 'Émets la mise à jour BGP UPDATE avec le préfixe /24 et obtiens le premier accès.', pts: 150, flag: 'CYBERLAB{user_bgp_route_injection_traffic_diverted}' },
      { id: 't3', title: 'Interception des transactions & Root Flag', desc: 'Capture les communications interceptées et valide le drapeau souverain.', pts: 250, flag: 'CYBERLAB{BGP_PREFIX_HIJACK_MED_METRIC_ROUTING_POISONED}' }
    ],
    hints: [
      { title: 'Configuration FRR', cost: 25, content: "Dans vtysh : router bgp 65001; address-family ipv4 unicast; network 198.51.100.0/24" }
    ]
  },
  {
    cat: 'network', id: 'net-08-scada-modbus-injection', title: 'SCADA Modbus Industrial Protocol Injection',
    org: 'National Water Treatment Facility', os: 'Linux', type: 'machine', diff: 'insane', pts: 500, dur: 75,
    path: 'soc-forensics', author: 'Aegis Network Squad',
    tags: ['network', 'scada', 'modbus', 'ics', 'ot-security'],
    cve: 'CWE-284', rating: 5.0, solves: 460, monogram: 'MODBUS',
    story: "Le contrôleur logique programmable (PLC) de la station de pompage utilise le protocole industriel Modbus TCP (port 502) sans authentification ni chiffrement. En forgeant des trames Modbus directes (Function Code 0x05 : Write Single Coil ou Function Code 0x06 : Write Single Register), manipule les registres des vannes d'urgence pour provoquer un arrêt d'urgence et extraire le flag de supervision.",
    tasks: [
      { id: 't1', title: 'Code de fonction Modbus pour forcer un registre', desc: 'Quel code de fonction hexadécimal Modbus écrit dans un registre de maintien ?', pts: 100, flag: '0x06' },
      { id: 't2', title: 'Modification de la vanne de pression (User Flag)', desc: 'Passe la valeur du registre 0x0020 à 1 et obtiens l\'état d\'alerte.', pts: 150, flag: 'CYBERLAB{user_modbus_plc_coil_override_success}' },
      { id: 't3', title: 'Contrôle de la console SCADA & Root Flag', desc: 'Prends le contrôle du serveur maître et valide le drapeau de sécurité.', pts: 250, flag: 'CYBERLAB{SCADA_MODBUS_TCP_UNAUTH_COIL_OVERRIDE_ROOT}' }
    ],
    hints: [
      { title: 'Bibliothèque Python', cost: 25, content: "Utilise la bibliothèque pymodbus pour écrire directement dans les registres du PLC." }
    ]
  }
];

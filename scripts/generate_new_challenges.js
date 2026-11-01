// ============================================================================
// GENERATOR FOR NEW ADVANCED CYBERLAB CHALLENGES
// Covers: OSINT, Real Attack Labs (multi-page), Purple Team, Blue Team, Red Team
// Levels: Débutant, Facile, Moyen, Difficile, Expert, Pro
// All challenges include Attack & Defense ("Comment s'en protéger") tasks and free hints.
// ============================================================================

const fs = require('node:fs');
const path = require('node:path');

const CHALLENGES_ROOT = path.join(__dirname, '..', 'challenges');

const newChallenges = [
  // --------------------------------------------------------------------------
  // 1. OSINT CHALLENGES
  // --------------------------------------------------------------------------
  {
    category: 'osint',
    dir: 'osint-04-social-footprint',
    meta: {
      id: 'osint-04-social-footprint',
      title: 'Digital Footprint & Pseudonym Correlation',
      organization: 'Vanguard Cyber Intelligence',
      category: 'OSINT & Recon',
      target_os: 'Linux',
      machine_type: 'challenge',
      difficulty: 'easy',
      points: 90,
      duration_min: 25,
      learning_path: 'path-04-osint-intelligence',
      author: 'Vanguard Threat Desk',
      tags: ['osint', 'footprint', 'username-recon', 'cross-platform', 'threat-profiling'],
      cve: 'CWE-200',
      rating: 4.9,
      solves: 1420,
      monogram: 'FOOT',
      prerequisites: ['Méthodologie de renseignement en sources ouvertes (OSINT)', 'Recherche d\'identifiants numériques et corrélation de profils'],
      recommended_tools: ['WhatsMyName', 'Sherlock', 'Blackbird', 'Maigret', 'Google Dorks'],
      narrative_story: 'Un acteur malveillant opérant sous le pseudonyme "v01d_ph4nt0m" a diffusé un extrait de code interne. Les enquêteurs doivent recouper les traces numériques laissées par ce pseudonyme sur différentes plateformes (dépôts de code, profils techniques, forums) pour identifier son adresse de contact secrète et neutraliser la menace.',
      target_port: 3333,
      virtual_ip: '10.10.71.12'
    },
    tasks: [
      {
        id: 't1',
        title: 'Corrélation de pseudonyme & Dépôt Git',
        description: 'Retrouvez le dépôt public lié au pseudonyme "v01d_ph4nt0m" et identifiez le commit contenant la clé de contact.',
        points: 30,
        task_type: 'flag',
        canonical_flag: 'CTF{OSINT_GIT_COMMIT_AUTHOR_LOCATED}'
      },
      {
        id: 't2',
        title: 'Extraction de l\'empreinte PGP & E-mail masqué',
        description: 'Analysez les commits du développeur et extrayez l\'adresse e-mail dissimulée dans les métadonnées.',
        points: 30,
        task_type: 'flag',
        canonical_flag: 'phantom_ops_2026@proton.me'
      },
      {
        id: 't3',
        title: 'Comment s\'en protéger (Défense OPSEC & Neutralisation)',
        description: 'Appliquez les bonnes pratiques d\'OPSEC et de compartmentalisation pour supprimer les métadonnées sensibles exposées publiquement.',
        points: 30,
        task_type: 'flag',
        is_defense: true,
        canonical_flag: 'DEFENSE{OPSEC_IDENTITY_COMPARTMENTALIZED_OK}'
      }
    ],
    hints: [
      {
        title: 'Piste méthodologique Git',
        content: 'Examinez l\'historique des commits avec git log --format="fuller" pour révéler l\'auteur réel et le committer distinct.'
      },
      {
        title: 'Recherche de pseudonyme',
        content: 'L\'outil Maigret ou WhatsMyName permet d\'interroger plus de 500 plateformes simultanément.'
      }
    ],
    writeup: `# Solution Détaillée // Digital Footprint & Pseudonym Correlation

## 1. Méthodologie OSINT
Le pseudonyme \`v01d_ph4nt0m\` est renseigné dans l'outil d'investigation. L'analyse des plateformes de versioning révèle un compte actif.

## 2. Extraction des métadonnées
L'inspection du log Git fournit l'adresse e-mail réelle non masquée :
\`\`\`bash
git log -n 1 --pretty=format:"%ae"
# phantom_ops_2026@proton.me
\`\`\`

## 3. Section Défense & Mesures Protectrices
- Nettoyer l'historique des commits avec \`git filter-repo\` ou BFG Repo-Cleaner avant publication.
- Activer l'option GitHub "Keep my email addresses private" et configurer la signature GPG des commits.`
  },

  {
    category: 'osint',
    dir: 'osint-05-darkweb-leak',
    meta: {
      id: 'osint-05-darkweb-leak',
      title: 'Dark Web Breach Triage & Credential Cache',
      organization: 'Cyber Defense CERT Coordination',
      category: 'OSINT & Recon',
      target_os: 'Linux',
      machine_type: 'challenge',
      difficulty: 'intermediate',
      points: 120,
      duration_min: 35,
      learning_path: 'path-04-osint-intelligence',
      author: 'Aegis Threat Intel',
      tags: ['osint', 'darkweb', 'credential-leak', 'threat-hunting', 'passwords'],
      cve: 'CWE-522',
      rating: 4.8,
      solves: 1180,
      monogram: 'LEAK',
      prerequisites: ['Analyse de dumps de données', 'Détection de hachages et corrélation de comptes compromis'],
      recommended_tools: ['HaveIBeenPwned API', 'DeHashed', 'Tor Browser', 'Hashcat'],
      narrative_story: 'Un pastebin du Dark Web contient une archive chiffrée issue d\'une fuite chez un sous-traitant critique. L\'analyste de cyber-renseignement doit trier les entrées, identifier le compte ayant des privilèges administratifs et récupérer le hash compromis avant sa réutilisation.',
      target_port: 3333,
      virtual_ip: '10.10.71.18'
    },
    tasks: [
      {
        id: 't1',
        title: 'Identification du compte VIP compromis',
        description: 'Analysez l\'extrait de dump et identifiez le compte ayant le rôle "Domain-Admin" infiltré.',
        points: 40,
        task_type: 'flag',
        canonical_flag: 'CTF{OSINT_DARKWEB_ADMIN_ACCOUNT_SPOTTED}'
      },
      {
        id: 't2',
        title: 'Cassage de hachage NTLM fuité',
        description: 'Retrouvez le mot de passe en clair correspondant au hash NTLM 8846f7eaee8fb117ad06bdd830b7586c.',
        points: 40,
        task_type: 'flag',
        canonical_flag: 'Password123!'
      },
      {
        id: 't3',
        title: 'Comment s\'en protéger (Défense & Détection)',
        description: 'Mettez en place la surveillance continue des identifiants d\'entreprise sur le Dark Web et imposez le MFA FIDO2.',
        points: 40,
        task_type: 'flag',
        is_defense: true,
        canonical_flag: 'DEFENSE{MFA_FIDO2_CREDENTIAL_SURVEILLANCE_ENFORCED}'
      }
    ],
    hints: [
      {
        title: 'Recherche de motif dans le dump',
        content: 'Filtrez le fichier avec grep -i "domain admin" ou grep -i "admin" pour isoler les lignes critiques.'
      },
      {
        title: 'Déchiffrement NTLM',
        content: 'Ce hash NTLM standard est répertorié dans les tables de hachage publiques ou cassable instantanément avec Rockyou.'
      }
    ],
    writeup: `# Solution Détaillée // Dark Web Breach Triage

## 1. Analyse du dump
Un filtrage ciblé sur les privilèges révèle l'administrateur compromis :
\`\`\`bash
grep "Domain-Admin" leak_dump.txt
\`\`\`

## 2. Déchiffrement du hash
Le hash \`8846f7eaee8fb117ad06bdd830b7586c\` correspond à \`Password123!\`.

## 3. Remédiation & Protection
- Révoquer immédiatement les sessions actives et forcer la réinitialisation du mot de passe.
- Déployer l'authentification multi-facteurs résistante au phishing (FIDO2 / WebAuthn).`
  },

  {
    category: 'osint',
    dir: 'osint-06-flight-marine-tracking',
    meta: {
      id: 'osint-06-flight-marine-tracking',
      title: 'Geoint Flight Radar & Maritime AIS Intercept',
      organization: 'Maritime & Aviation Border Security',
      category: 'OSINT & Recon',
      target_os: 'Linux',
      machine_type: 'challenge',
      difficulty: 'hard',
      points: 180,
      duration_min: 45,
      learning_path: 'path-04-osint-intelligence',
      author: 'Cyber Intercept Command',
      tags: ['osint', 'geoint', 'ads-b', 'ais', 'radar-tracking'],
      cve: 'CWE-200',
      rating: 4.9,
      solves: 740,
      monogram: 'AERO',
      prerequisites: ['Protocoles ADS-B / Mode-S et AIS maritime', 'Tracés de routes et recoupement de transpondeurs'],
      recommended_tools: ['FlightRadar24', 'ADS-B Exchange', 'MarineTraffic', 'VesselFinder', 'CyberChef'],
      narrative_story: 'Un cargo sous pavillon de complaisance a désactivé son transpondeur AIS à proximité d\'eaux territoriales protégées, au moment précis où un vol privé atterrissait sur un aérodrome côtier adjacent. Corrèle les télémétries de vol ADS-B et les traces maritimes pour identifier le navire et le callsign de l\'aéronef.',
      target_port: 3333,
      virtual_ip: '10.10.71.24'
    },
    tasks: [
      {
        id: 't1',
        title: 'Identification du transpondeur ADS-B de l\'aéronef',
        description: 'Quel est l\'indicatif (callsign) de l\'aéronef privé ayant effectué l\'approche côtière ?',
        points: 60,
        task_type: 'flag',
        canonical_flag: 'CTF{OSINT_AERO_CALLSIGN_SKY_VIP_404}'
      },
      {
        id: 't2',
        title: 'Numéro MMSI du navire suspect',
        description: 'Retrouvez le code MMSI unique à 9 chiffres du cargo ayant coupé ses émissions radio.',
        points: 60,
        task_type: 'flag',
        canonical_flag: '228394000'
      },
      {
        id: 't3',
        title: 'Comment s\'en protéger (Défense Radionavigation & Surveillance)',
        description: 'Déployez un système de surveillance radar passif et d\'imagerie satellite SAR pour combler les zones d\'ombre de transpondeurs.',
        points: 60,
        task_type: 'flag',
        is_defense: true,
        canonical_flag: 'DEFENSE{SAR_RADAR_SATELLITE_FUSION_DEPLOYED}'
      }
    ],
    hints: [
      {
        title: 'Recoupement des coordonnées géographiques',
        content: 'Filtrez le fichier JSON sur la bounding box maritime (latitude 43.1 à 43.4 N, longitude 5.2 à 5.6 E).'
      },
      {
        title: 'Format MMSI',
        content: 'Le numéro MMSI comporte 9 chiffres et commence par le MID national (228 pour la France).'
      }
    ],
    writeup: `# Solution Détaillée // Flight Radar & Maritime AIS Intercept

## 1. Décodage ADS-B
L'analyse des trames Mode-S révèle le callsign d'affaires \`SKY_VIP_404\`.

## 2. Corrélation maritime AIS
Le navire \`MMSI 228394000\` s'est arrêté à la même coordonnée temporelle.

## 3. Mesures défensives
- Déploiement de radars côtiers optiques et SAR indépendants des déclarations volontaires AIS.`
  },

  {
    category: 'osint',
    dir: 'osint-07-corporate-dns-recon',
    meta: {
      id: 'osint-07-corporate-dns-recon',
      title: 'Global Shadow IT & Certificate Transparency Recon',
      organization: 'Titanium Financial Group',
      category: 'OSINT & Recon',
      target_os: 'Linux',
      machine_type: 'challenge',
      difficulty: 'expert',
      points: 240,
      duration_min: 50,
      learning_path: 'path-04-osint-intelligence',
      author: 'Titanium RedOps',
      tags: ['osint', 'dns', 'shadow-it', 'crt.sh', 'recon', 'subdomains'],
      cve: 'CWE-200',
      rating: 4.9,
      solves: 430,
      monogram: 'SHAD',
      prerequisites: ['Journaux Certificate Transparency (CT)', 'Énumération DNS passive et détection de Cloud Assets'],
      recommended_tools: ['Amass', 'Sublist3r', 'crt.sh', 'dnsx', 'shodan'],
      narrative_story: 'Titanium Financial Group a migré ses passerelles bancaires vers le cloud. Cependant, d\'anciens serveurs de staging et des buckets de pré-production oubliés par les équipes de développement sont restés indexés dans les journaux publics de Certificate Transparency. Cartographie l\'infrastructure fantôme et découvre le sous-domaine secret exposé.',
      target_port: 3333,
      virtual_ip: '10.10.71.30'
    },
    tasks: [
      {
        id: 't1',
        title: 'Découverte du sous-domaine interne masqué',
        description: 'Trouvez le nom de domaine complet (FQDN) du serveur de staging interne révélé par crt.sh.',
        points: 80,
        task_type: 'flag',
        canonical_flag: 'dev-gateway-alpha.staging.titanium-bank.internal'
      },
      {
        id: 't2',
        title: 'Extraction du bucket Cloud S3 exposé',
        description: 'Quel bucket public de télémétrie est référencé dans les enregistrements CNAME du sous-domaine ?',
        points: 80,
        task_type: 'flag',
        canonical_flag: 'CTF{OSINT_SHADOW_BUCKET_TITANIUM_LEAK_991}'
      },
      {
        id: 't3',
        title: 'Comment s\'en protéger (Gouvernance Cloud & Détection ASM)',
        description: 'Mettez en place un inventaire Attack Surface Management (ASM) continu et révoquez les certificats de pré-production obsolètes.',
        points: 80,
        task_type: 'flag',
        is_defense: true,
        canonical_flag: 'DEFENSE{ASM_CONTINUOUS_SURFACE_MONITORING_ACTIVE}'
      }
    ],
    hints: [
      {
        title: 'Exploration crt.sh',
        content: 'Interrogez les certificats délivrés avec l\'empreinte %.titanium-bank.% pour lister tous les FQDN historiques.'
      },
      {
        title: 'CNAME Inspection',
        content: 'Utilisez dig +trace ou host -t CNAME sur le domaine identifié pour remonter jusqu\'à l\'alias de stockage S3.'
      }
    ],
    writeup: `# Solution Détaillée // Global Shadow IT Recon

## 1. Requête Certificate Transparency
La consultation de \`crt.sh/?q=%.titanium-bank.%\` met en évidence le domaine oublié :
\`dev-gateway-alpha.staging.titanium-bank.internal\`.

## 2. Découverte de bucket S3
La résolution DNS CNAME pointe vers \`titanium-leak-991.s3.amazonaws.com\`.

## 3. Remédiation
- Supprimer les enregistrements DNS orphelins (protection contre le Subdomain Takeover).
- Bloquer l'accès public au niveau organisationnel via AWS S3 Block Public Access.`
  },

  // --------------------------------------------------------------------------
  // 2. REAL ATTACK LABS (MULTI-PAGE INTERACTIVE WEBSITES)
  // --------------------------------------------------------------------------
  {
    category: 'web',
    dir: 'real-01-fintech-gateway',
    meta: {
      id: 'real-01-fintech-gateway',
      title: 'PayShield FinTech Real Attack Lab',
      organization: 'PayShield Global Payments (Zurich)',
      category: 'Web & APIs',
      target_os: 'Linux',
      machine_type: 'room',
      difficulty: 'intermediate',
      points: 150,
      duration_min: 40,
      learning_path: 'path-05-redteam-labs',
      author: 'FinTech RedOps Unit',
      tags: ['real-attack', 'fintech', 'business-logic', 'idor', 'banking', 'multi-page'],
      cve: 'CWE-840',
      rating: 4.9,
      solves: 980,
      monogram: 'BANK',
      prerequisites: ['Audit d\'applications financières multi-pages', 'Logique métier et manipulations de requêtes'],
      recommended_tools: ['Burp Suite', 'Postman', 'curl', 'Firefox DevTools'],
      narrative_story: 'PayShield héberge une plateforme de virement bancaire multi-pages comprenant une page d\'accueil, un portail d\'authentification, un tableau de bord des soldes, une interface d\'exécution de virements et un journal d\'audit des transactions. Une faille de validation logique permet aux attaquants de manipuler les montants transférés pour créditer des comptes sans autorisation.',
      target_port: 3333,
      virtual_ip: '10.10.82.15'
    },
    tasks: [
      {
        id: 't1',
        title: 'Exploration du portail & Découverte de l\'API de virement',
        description: 'Explorez le site multi-pages /targets/training/real-01-fintech/ et identifiez l\'endpoint d\'exécution des transactions.',
        points: 40,
        task_type: 'flag',
        canonical_flag: 'CTF{FINTECH_TRANSFER_ENDPOINT_ENUMERATED}'
      },
      {
        id: 't2',
        title: 'Exploitation du montant négatif (Negative Balance Flaw)',
        description: 'Exécutez un virement avec un montant négatif pour inverser la transaction et siphonner les fonds du compte réservé.',
        points: 60,
        task_type: 'flag',
        canonical_flag: 'CTF{REAL_FINTECH_BALANCE_MANIPULATION_PWN}'
      },
      {
        id: 't3',
        title: 'Comment s\'en protéger (Validation Stricte & Transactions ACID)',
        description: 'Appliquez la validation stricte de montant positif et l\'isolation de transaction avec idempotence dans le contrôleur backend.',
        points: 50,
        task_type: 'flag',
        is_defense: true,
        canonical_flag: 'DEFENSE{FINTECH_ACID_POSITIVE_CHECK_ENFORCED}'
      }
    ],
    hints: [
      {
        title: 'Navigation multi-pages',
        content: 'Accédez à /targets/training/real-01-fintech/ et parcourez les onglets "Dashboard", "Transfers" et "Audit".'
      },
      {
        title: 'Injection de montant',
        content: 'Testez une valeur négative (ex: -50000) dans le champ montant pour vérifier si le serveur décrémente la cible au lieu de votre compte.'
      }
    ],
    writeup: `# Solution Détaillée // PayShield FinTech Real Attack Lab

## 1. Découverte de l'application multi-pages
Le site comporte 5 pages :
- \`/targets/training/real-01-fintech/\` (Accueil)
- \`/targets/training/real-01-fintech/login\` (Connexion)
- \`/targets/training/real-01-fintech/dashboard\` (Solde)
- \`/targets/training/real-01-fintech/transfers\` (Formulaire de virement)
- \`/targets/training/real-01-fintech/audit-logs\` (Audit)

## 2. Exploitation de la logique métier
L'API \`POST /targets/training/real-01-fintech/api/transfer\` ne vérifie pas \`amount > 0\`. L'envoi d'un montant négatif soustrait de la cible et crédite l'attaquant, déclenchant le flag :
\`CTF{REAL_FINTECH_BALANCE_MANIPULATION_PWN}\`.

## 3. Remédiation & Protection
- Validation stricte serveur : \`if (amount <= 0 || !Number.isInteger(amount)) throw new Error('Montant invalide');\`
- Mise en place d'un système de double validation (4-eyes principle) pour les montants élevés.`
  },

  {
    category: 'web',
    dir: 'real-02-medhealth-ehr',
    meta: {
      id: 'real-02-medhealth-ehr',
      title: 'MedHealth Clinic Electronic Health Records Portal',
      organization: 'Hôpital Métropolitain de Santé',
      category: 'Web & APIs',
      target_os: 'Linux',
      machine_type: 'room',
      difficulty: 'hard',
      points: 180,
      duration_min: 45,
      learning_path: 'path-05-redteam-labs',
      author: 'Healthcare CyberOps',
      tags: ['real-attack', 'health', 'idor', 'hipaa', 'patient-records', 'multi-page'],
      cve: 'CWE-639',
      rating: 4.8,
      solves: 620,
      monogram: 'MED',
      prerequisites: ['Sécurité des données de santé (HDS / HIPAA)', 'Attaques IDOR et élévation horizontale de privilèges'],
      recommended_tools: ['Burp Suite', 'curl', 'Firefox DevTools'],
      narrative_story: 'MedHealth opère un portail hospitalier complet comprenant l\'accueil public, la prise de rendez-vous, l\'espace patient, les résultats de radiologie et les prescriptions médicales. Un contrôle d\'accès déficient sur les identifiants de dossier patient (IDOR) expose les dossiers médicaux confidentiels des personnalités politiques.',
      target_port: 3333,
      virtual_ip: '10.10.82.20'
    },
    tasks: [
      {
        id: 't1',
        title: 'Reconnaissance de l\'espace patient multi-pages',
        description: 'Connectez-vous avec le compte de test et identifiez le paramètre d\'accès au dossier médical.',
        points: 50,
        task_type: 'flag',
        canonical_flag: 'CTF{MEDHEALTH_PATIENT_PARAM_IDENTIFIED}'
      },
      {
        id: 't2',
        title: 'Exploitation IDOR sur le dossier VIP de la présidence',
        description: 'Exfiltrez le dossier patient confidentiel #9001 et récupérez le diagnostic protégé.',
        points: 70,
        task_type: 'flag',
        canonical_flag: 'CTF{REAL_MEDHEALTH_PATIENT_RECORDS_EXFIL}'
      },
      {
        id: 't3',
        title: 'Comment s\'en protéger (Contrôle d\'Accès Basé sur les Attributs ABAC)',
        description: 'Implémentez la vérification systématique de propriété de ressource (Session User ID == Resource Owner ID) avant tout affichage.',
        points: 60,
        task_type: 'flag',
        is_defense: true,
        canonical_flag: 'DEFENSE{ABAC_PATIENT_RECORD_AUTHORIZATION_VERIFIED}'
      }
    ],
    hints: [
      {
        title: 'Structure d\'URL',
        content: 'Observez la requête émise lors de la consultation d\'une prescription : /targets/training/real-02-medhealth/api/patient?id=102.'
      },
      {
        title: 'Cible d\'attaque',
        content: 'Modifiez l\'identifiant id vers 9001 pour afficher le dossier présidentiel restreint.'
      }
    ],
    writeup: `# Solution Détaillée // MedHealth Clinic EHR Portal

## 1. Découverte de l'application
Le site hospitalier propose plusieurs sections :
- \`/targets/training/real-02-medhealth/\` (Accueil clinique)
- \`/targets/training/real-02-medhealth/portal\` (Connexion patient)
- \`/targets/training/real-02-medhealth/prescriptions\` (Ordonnances)
- \`/targets/training/real-02-medhealth/radiology\` (Radiologies)

## 2. Exploitation IDOR
La requête \`GET /targets/training/real-02-medhealth/api/patient?id=9001\` ne valide pas la session de l'utilisateur connecté et retourne le dossier secret avec le flag :
\`CTF{REAL_MEDHEALTH_PATIENT_RECORDS_EXFIL}\`.

## 3. Remédiation & Protection
- Utiliser des UUID v4 aléatoires au lieu d'ID numériques séquentiels.
- Valider systématiquement que le patient connecté est bien l'ayant-droit du dossier demandé.`
  },

  {
    category: 'web',
    dir: 'real-03-cybercorp-erp',
    meta: {
      id: 'real-03-cybercorp-erp',
      title: 'CyberCorp Global Industrial Supply Chain ERP',
      organization: 'CyberCorp Manufacturing Inc.',
      category: 'Web & APIs',
      target_os: 'Linux',
      machine_type: 'room',
      difficulty: 'expert',
      points: 220,
      duration_min: 55,
      learning_path: 'path-05-redteam-labs',
      author: 'RedOps Industrial Taskforce',
      tags: ['real-attack', 'erp', 'file-upload', 'mime-bypass', 'webshell', 'multi-page'],
      cve: 'CWE-434',
      rating: 4.9,
      solves: 390,
      monogram: 'CORP',
      prerequisites: ['Contournement de filtres d\'upload de fichiers', 'Téléversement de code exécutable et RCE'],
      recommended_tools: ['Burp Suite', 'Weevely', 'curl', 'Netcat'],
      narrative_story: 'CyberCorp gère sa chaîne logistique usine à l\'aide d\'un portail ERP complet comportant la gestion des stocks, la facturation fournisseurs, le diagnostic d\'automates et la mise à jour des firmwares. Un filtre d\'extension de fichier mal conçu sur le module firmware permet d\'injecter un script exécutable pour obtenir un shell sur le serveur de production.',
      target_port: 3333,
      virtual_ip: '10.10.82.28'
    },
    tasks: [
      {
        id: 't1',
        title: 'Reconnaissance du module de téléversement de firmware',
        description: 'Identifiez le formulaire d\'upload de firmware et découvrez les extensions officiellement acceptées.',
        points: 60,
        task_type: 'flag',
        canonical_flag: 'CTF{CYBERCORP_FIRMWARE_UPLOAD_LOCATED}'
      },
      {
        id: 't2',
        title: 'Contournement de filtre & Téléversement de payload',
        description: 'Bypassez le filtre d\'extension (double extension ou null-byte) pour exécuter une commande système et lire le flag maître.',
        points: 80,
        task_type: 'flag',
        canonical_flag: 'CTF{REAL_CYBERCORP_SUPPLY_CHAIN_RCE}'
      },
      {
        id: 't3',
        title: 'Comment s\'en protéger (Stockage Déconnecté & Liste Blanche Stricte)',
        description: 'Configurez le stockage des uploads en dehors de la racine web avec renommage aléatoire et vérification des magic bytes.',
        points: 80,
        task_type: 'flag',
        is_defense: true,
        canonical_flag: 'DEFENSE{SECURE_FILE_UPLOAD_OFF_ROOT_ENFORCED}'
      }
    ],
    hints: [
      {
        title: 'Exploration de l\'ERP',
        content: 'Accédez à la page /targets/training/real-03-cybercorp/firmware-upload.'
      },
      {
        title: 'Extension tolérée',
        content: 'Le serveur vérifie si le nom de fichier se termine par .bin mais accepte les fichiers contenant .php.bin ou une validation MIME falsifiée.'
      }
    ],
    writeup: `# Solution Détaillée // CyberCorp ERP Supply Chain

## 1. Analyse de l'application
L'ERP comprend :
- \`/targets/training/real-03-cybercorp/\` (Tableau de bord)
- \`/targets/training/real-03-cybercorp/inventory\` (Inventaire)
- \`/targets/training/real-03-cybercorp/firmware-upload\` (Upload firmware)
- \`/targets/training/real-03-cybercorp/system-diagnostics\` (Diagnostics système)

## 2. Exploitation de l'upload
En envoyant un payload nommé \`update.php.bin\` avec \`Content-Type: application/octet-stream\`, le serveur enregistre le fichier et permet son exécution via le serveur web, retournant le flag :
\`CTF{REAL_CYBERCORP_SUPPLY_CHAIN_RCE}\`.

## 3. Remédiation & Protection
- Renommer les fichiers téléversés avec un identifiant aléatoire (UUID).
- Servir les fichiers statiques depuis un domaine dédié sans exécution de scripts (ex: S3 sans droits d'exécution).`
  },

  {
    category: 'web',
    dir: 'real-04-aerospace-telemetry',
    meta: {
      id: 'real-04-aerospace-telemetry',
      title: 'AeroSpace Telemetry & Satellite Uplink Control',
      organization: 'AeroSpace Orbital Operations',
      category: 'Web & APIs',
      target_os: 'Linux',
      machine_type: 'room',
      difficulty: 'pro',
      points: 300,
      duration_min: 60,
      learning_path: 'path-05-redteam-labs',
      author: 'AeroSpace RedOps',
      tags: ['real-attack', 'aerospace', 'command-injection', 'scada', 'satellite', 'multi-page'],
      cve: 'CWE-78',
      rating: 5.0,
      solves: 210,
      monogram: 'SAT',
      prerequisites: ['Injections de commandes OS complexes', 'Bypass de sanitization WAF et élévation de privilèges'],
      recommended_tools: ['Burp Suite', 'curl', 'Netcat', 'Linux Shell'],
      narrative_story: 'Le centre spatial opère une station de contrôle satellite multi-pages comportant la télémétrie orbitale, l\'alignement des antennes paraboliques, le journal de liaison montante (uplink) et l\'outil de diagnostic réseau ping/traceroute. Une injection de commande dans le paramètre d\'adresse IP de l\'antenne permet d\'exécuter du code avec les privilèges root sur la console de contrôle orbitale.',
      target_port: 3333,
      virtual_ip: '10.10.82.35'
    },
    tasks: [
      {
        id: 't1',
        title: 'Reconnaissance de la console de liaison montante',
        description: 'Explorez la console multi-pages /targets/training/real-04-aerospace/ et découvrez l\'outil de diagnostic d\'antenne.',
        points: 80,
        task_type: 'flag',
        canonical_flag: 'CTF{AEROSPACE_UPLINK_DIAGNOSTICS_LOCATED}'
      },
      {
        id: 't2',
        title: 'Injection de commande aveugle & Prise de contrôle root',
        description: 'Injectez une commande arbitraire via le paramètre antenna_ip en contournant les espaces avec ${IFS} pour capturer le flag root.',
        points: 120,
        task_type: 'flag',
        canonical_flag: 'CTF{REAL_AEROSPACE_SCADA_OVERRIDE_ROOT}'
      },
      {
        id: 't3',
        title: 'Comment s\'en protéger (API POSIX Sans Shell & Isolation Confinée)',
        description: 'Bannissez l\'appel à system() ou exec() avec shell = true et remplacez par execFile() avec tableau d\'arguments stricts.',
        points: 100,
        task_type: 'flag',
        is_defense: true,
        canonical_flag: 'DEFENSE{EXECFILE_SAFE_ARG_ARRAY_ISOLATION_OK}'
      }
    ],
    hints: [
      {
        title: 'Pages de la station',
        content: 'Accédez à /targets/training/real-04-aerospace/uplink-gateway pour trouver le formulaire de test réseau.'
      },
      {
        title: 'Bypass d\'espaces',
        content: 'Si les espaces sont bloqués par le filtre WAF, utilisez ${IFS} ou la redirection <.'
      }
    ],
    writeup: `# Solution Détaillée // AeroSpace Telemetry & Satellite Uplink

## 1. Découverte de l'application
Le site comprend :
- \`/targets/training/real-04-aerospace/\` (Accueil station)
- \`/targets/training/real-04-aerospace/orbital-telemetry\` (Télémétrie)
- \`/targets/training/real-04-aerospace/uplink-gateway\` (Passerelle liaison montante)

## 2. Exploitation de la commande injection
La commande est vulnérable :
\`\`\`bash
curl -X POST /targets/training/real-04-aerospace/api/diag -d "host=127.0.0.1;cat\${IFS}/root/root.txt"
\`\`\`
Ce qui retourne le flag maître :
\`CTF{REAL_AEROSPACE_SCADA_OVERRIDE_ROOT}\`.

## 3. Remédiation & Protection
- Remplacer \`child_process.exec()\` par \`child_process.execFile('ping', ['-c', '3', host])\`.
- Exécuter le processus avec un utilisateur non privilégié restreint dans un conteneur non-root.`
  },

  // --------------------------------------------------------------------------
  // 3. PURPLE TEAM & ACTIVE DEFENSE
  // --------------------------------------------------------------------------
  {
    category: 'blue-team',
    dir: 'purple-01-canary-deception',
    meta: {
      id: 'purple-01-canary-deception',
      title: 'Canary Tokens & Honeypot Deception Defense',
      organization: 'Aegis Active Cyber Defense',
      category: 'Blue Team & SOC',
      target_os: 'Linux',
      machine_type: 'room',
      difficulty: 'easy',
      points: 100,
      duration_min: 30,
      learning_path: 'path-03-soc-defense',
      author: 'Aegis Purple Taskforce',
      tags: ['purple-team', 'canarytoken', 'honeypot', 'deception', 'early-detection'],
      cve: 'CWE-200',
      rating: 4.9,
      solves: 1250,
      monogram: 'CANR',
      prerequisites: ['Principes de déception cyber (Deception Technology)', 'Déploiement de tokens piégés et alerte SIEM'],
      recommended_tools: ['Canarytokens.org', 'Wireshark', 'curl', 'Splunk'],
      narrative_story: 'Dans le cadre d\'une posture de défense active Purple Team, l\'équipe sécurité a disséminé des clés API factices (Canarytokens) dans des fichiers de configuration abandonnés. Lorsqu\'un attaquant exfiltre et tente d\'utiliser le token, une alerte immédiate est transmise au SOC avec l\'IP source et le User-Agent.',
      target_port: 3333,
      virtual_ip: '10.10.93.10'
    },
    tasks: [
      {
        id: 't1',
        title: 'Localisation de la clé canarytoken factice',
        description: 'Analysez le fichier config.json abandonné et extrayez la clé d\'API piégée.',
        points: 40,
        task_type: 'flag',
        canonical_flag: 'CTF{PURPLE_CANARY_TOKEN_DISCOVERED}'
      },
      {
        id: 't2',
        title: 'Déclenchement du piège & Détection SOC',
        description: 'Émettez une requête avec le canarytoken pour vérifier que la détection se déclenche en temps réel.',
        points: 30,
        task_type: 'flag',
        canonical_flag: 'CTF{PURPLE_CANARY_TOKEN_TRIPWIRE_TRIGGERED}'
      },
      {
        id: 't3',
        title: 'Comment s\'en protéger (Stratégie de Leurre & Neutralisation Rapide)',
        description: 'Configurez la révocation automatisée et le blacklisting IP dès la première interaction avec un canarytoken.',
        points: 30,
        task_type: 'flag',
        is_defense: true,
        canonical_flag: 'DEFENSE{DECEPTION_AUTO_ISOLATION_WORKFLOW_ACTIVE}'
      }
    ],
    hints: [
      {
        title: 'Inspection du fichier',
        content: 'Vérifiez les variables d\'environnement et fichiers d\'exemple dans /home/operator/app_config.json.'
      },
      {
        title: 'Test d\'utilisation',
        content: 'Envoyez un en-tête Authorization: Bearer CANARY_... vers le webhook d\'authentification.'
      }
    ],
    writeup: `# Solution Détaillée // Canary Tokens Deception Defense

## 1. Localisation du token
Le fichier de configuration contient un jeton spécifique \`canary_aegis_sec_99\`.

## 2. Déclenchement de l'alerte
L'utilisation de la clé déclenche immédiatement le webhook de supervision SOC :
\`CTF{PURPLE_CANARY_TOKEN_TRIPWIRE_TRIGGERED}\`.

## 3. Posture Purple Team
- Intégrer des faux fichiers de mots de passe, des entrées DNS dormantes et des tokens AWS factices pour détecter les mouvements latéraux précocement.`
  },

  {
    category: 'blue-team',
    dir: 'purple-02-bas-credential-dump',
    meta: {
      id: 'purple-02-bas-credential-dump',
      title: 'Breach & Attack Simulation: LSASS Memory Dump vs Sysmon',
      organization: 'Defensive Cyber Operations Command',
      category: 'Blue Team & SOC',
      target_os: 'Windows',
      machine_type: 'room',
      difficulty: 'intermediate',
      points: 140,
      duration_min: 35,
      learning_path: 'path-03-soc-defense',
      author: 'Aegis Blue/Red Core',
      tags: ['purple-team', 'lsass', 'sysmon', 'event-id-10', 'mimikatz', 'credential-access'],
      cve: 'CWE-522',
      rating: 4.8,
      solves: 910,
      monogram: 'LSAS',
      prerequisites: ['Fonctionnement de LSASS sous Windows', 'Télémétrie Sysmon Event ID 10 (ProcessAccess)'],
      recommended_tools: ['ProcDump', 'Mimikatz', 'Sysmon', 'Sigma CLI'],
      narrative_story: 'Le groupe Red Team simule une extraction de credentials en vidant la mémoire de LSASS à l\'aide de ProcDump. L\'analyste Blue Team doit vérifier que la configuration Sysmon génère bien un événement ID 10 avec le niveau d\'accès 0x1FFFFF, et formaliser la règle de détection Sigma correspondante.',
      target_port: 3333,
      virtual_ip: '10.10.93.20'
    },
    tasks: [
      {
        id: 't1',
        title: 'Identification de l\'événement Sysmon ProcessAccess',
        description: 'Quel numéro d\'Event ID Sysmon signale l\'accès à la mémoire d\'un processus sensible par un tiers ?',
        points: 40,
        task_type: 'flag',
        canonical_flag: '10'
      },
      {
        id: 't2',
        title: 'Validation de la signature d\'accès mémoire LSASS',
        description: 'Vérifiez la détection de la tentative de dump et récupérez le flag de détection validé.',
        points: 50,
        task_type: 'flag',
        canonical_flag: 'CTF{PURPLE_LSASS_DUMP_DETECTION_CONFIRMED}'
      },
      {
        id: 't3',
        title: 'Comment s\'en protéger (Activer LSA Protection RunAsPPL & Credential Guard)',
        description: 'Activez RunAsPPL (Protected Process Light) dans le registre Windows pour interdire tout dump de LSASS par des processus non-signés.',
        points: 50,
        task_type: 'flag',
        is_defense: true,
        canonical_flag: 'DEFENSE{LSA_PROTECTION_RUNASPPL_ENABLED_OK}'
      }
    ],
    hints: [
      {
        title: 'Event ID Sysmon',
        content: 'Sysmon Event ID 1 correspond à ProcessCreation, 3 à NetworkConnect, et 10 à ProcessAccess.'
      },
      {
        title: 'Mesure de protection Windows',
        content: 'La clé de registre HKLM\\SYSTEM\\CurrentControlSet\\Control\\Lsa\\RunAsPPL = 1 active la protection matérielle.'
      }
    ],
    writeup: `# Solution Détaillée // LSASS Memory Dump vs Sysmon

## 1. Télémétrie Sysmon
L'accès à LSASS génère un événement \`Event ID 10\` avec \`TargetImage = C:\\Windows\\System32\\lsass.exe\`.

## 2. Détection
La règle Sigma corrèle le droit d'accès \`0x1FFFFF\` ou \`0x1010\` et alerte le SOC :
\`CTF{PURPLE_LSASS_DUMP_DETECTION_CONFIRMED}\`.

## 3. Durcissement & Protection
- Activer Credential Guard et LSA Protection :
\`\`\`powershell
Set-ItemProperty -Path 'HKLM:\\SYSTEM\\CurrentControlSet\\Control\\Lsa' -Name 'RunAsPPL' -Value 1 -Type DWord
\`\`\``
  },

  {
    category: 'blue-team',
    dir: 'purple-03-kerberoast-detection',
    meta: {
      id: 'purple-03-kerberoast-detection',
      title: 'Kerberoasting Attack & Kerberos Ticket Event 4769 Audit',
      organization: 'Active Directory Security Ops',
      category: 'Blue Team & SOC',
      target_os: 'Windows',
      machine_type: 'room',
      difficulty: 'hard',
      points: 180,
      duration_min: 45,
      learning_path: 'path-03-soc-defense',
      author: 'AD Defense Specialists',
      tags: ['purple-team', 'active-directory', 'kerberoast', 'event-4769', 'rc4-encryption'],
      cve: 'CWE-287',
      rating: 4.9,
      solves: 640,
      monogram: 'KERB',
      prerequisites: ['Architecture Active Directory Kerberos TGS', 'Journal de sécurité Windows Event 4769 et chiffrement RC4 (0x17)'],
      recommended_tools: ['Rubeus', 'Impacket', 'Splunk', 'GetUserSPNs.py'],
      narrative_story: 'Une attaque Kerberoasting est simulée par l\'équipe offensive pour extraire les tickets TGS de comptes de service (SPN). L\'équipe Blue Team doit surveiller les requêtes de tickets de service chiffrées en RC4 (TicketOptions 0x40810000 et TicketEncryptionType 0x17) dans le journal d\'événements 4769 pour détecter la tentative d\'exfiltration.',
      target_port: 3333,
      virtual_ip: '10.10.93.30'
    },
    tasks: [
      {
        id: 't1',
        title: 'Identification du type de chiffrement faible RC4',
        description: 'Quelle valeur hexadécimale représente le chiffrement RC4-HMAC dans l\'événement Kerberos 4769 ?',
        points: 50,
        task_type: 'flag',
        canonical_flag: '0x17'
      },
      {
        id: 't2',
        title: 'Validation de l\'alerte d\'attaque Kerberoasting',
        description: 'Capturez l\'événement de demande anormale de ticket TGS et validez la détection SOC.',
        points: 70,
        task_type: 'flag',
        canonical_flag: 'CTF{PURPLE_KERBEROAST_RC4_ANOMALY_HUNTED}'
      },
      {
        id: 't3',
        title: 'Comment s\'en protéger (Comptes gMSA & Désactivation de RC4)',
        description: 'Migrez les comptes de service vers des Group Managed Service Accounts (gMSA) à mot de passe aléatoire de 128 caractères et forcez AES-256.',
        points: 60,
        task_type: 'flag',
        is_defense: true,
        canonical_flag: 'DEFENSE{GMSA_ACCOUNTS_AES256_ONLY_ENFORCED}'
      }
    ],
    hints: [
      {
        title: 'Valeur de chiffrement',
        content: 'Les types de chiffrement Kerberos sont : 0x12 pour AES256-CTS-HMAC-SHA1-96, 0x11 pour AES128, et 0x17 pour RC4-HMAC.'
      },
      {
        title: 'Solution définitive',
        content: 'Les comptes gMSA gérés automatiquement par Active Directory rendent le cassage hors ligne impossible.'
      }
    ],
    writeup: `# Solution Détaillée // Kerberoasting & Event 4769 Audit

## 1. Mécanisme d'attaque
L'attaquant demande un TGS avec \`GetUserSPNs.py\`. Le contrôleur de domaine émet l'Event ID 4769 avec \`TicketEncryptionType: 0x17\`.

## 2. Détection
La règle SIEM détecte une volumétrie anormale de demandes TGS avec chiffrement RC4 en un court intervalle de temps :
\`CTF{PURPLE_KERBEROAST_RC4_ANOMALY_HUNTED}\`.

## 3. Mesures correctives
- Remplacer les comptes de service traditionnels par des comptes de service gérés de groupe (gMSA).
- Désactiver le support du chiffrement RC4 au niveau du domaine Kerberos.`
  },

  {
    category: 'blue-team',
    dir: 'purple-04-active-mitigation-c2',
    meta: {
      id: 'purple-04-active-mitigation-c2',
      title: 'Automated C2 Beacon Hunting & Active Network BGP Shunning',
      organization: 'National Cyber Security Response',
      category: 'Blue Team & SOC',
      target_os: 'Linux',
      machine_type: 'room',
      difficulty: 'pro',
      points: 250,
      duration_min: 55,
      learning_path: 'path-03-soc-defense',
      author: 'Purple Defense Command',
      tags: ['purple-team', 'c2-hunting', 'beaconing', 'bgp-shunning', 'suricata', 'automated-defense'],
      cve: 'CWE-693',
      rating: 5.0,
      solves: 290,
      monogram: 'C2BG',
      prerequisites: ['Analyse de jitter et périodicité de balises C2 (Beaconing)', 'Réponse à incident automatisée (SOAR) et filtrage réseau dynamique'],
      recommended_tools: ['RITA', 'Zeek', 'Suricata', 'iptables', 'BGP Flowspec'],
      narrative_story: 'Une balise C2 avancée émet des requêtes HTTP à intervalles réguliers avec un jitter de 10% vers une adresse IP hostile. L\'analyste Purple Team doit calculer la périodicité du trafic sortant à l\'aide de Zeek/Suricata et déclencher un playbook SOAR de null-routing réseau pour neutraliser l\'exfiltration en temps réel.',
      target_port: 3333,
      virtual_ip: '10.10.93.40'
    },
    tasks: [
      {
        id: 't1',
        title: 'Calcul de l\'intervalle moyen de balisage C2',
        description: 'Analysez les timestamps des requêtes dans le log et déterminez l\'intervalle moyen de balisage en secondes (ex: 45s).',
        points: 70,
        task_type: 'flag',
        canonical_flag: '45s'
      },
      {
        id: 't2',
        title: 'Neutralisation active de l\'IP C2 ennemie',
        description: 'Appliquez le bannissement réseau dynamique et récupérez la preuve de scellement de la passerelle.',
        points: 90,
        task_type: 'flag',
        canonical_flag: 'CTF{PURPLE_C2_BEACON_HUNT_AUTOMATED_BLOCK}'
      },
      {
        id: 't3',
        title: 'Comment s\'en protéger (Inspection TLS & Proxy Sortant Restreint)',
        description: 'Déployez un proxy d\'interception TLS avec détection de catégories inconnues et réputation de domaine en temps réel.',
        points: 90,
        task_type: 'flag',
        is_defense: true,
        canonical_flag: 'DEFENSE{TLS_INSPECTION_EGRESS_PROXY_ENFORCED}'
      }
    ],
    hints: [
      {
        title: 'Calcul d\'intervalle',
        content: 'Différenciez les timestamps successifs des requêtes POST /beacon dans le journal réseau.'
      },
      {
        title: 'Action de blocage',
        content: 'Exécutez la règle iptables -A OUTPUT -d 198.51.100.99 -j DROP pour valider l\'isolement.'
      }
    ],
    writeup: `# Solution Détaillée // Automated C2 Beacon Hunting

## 1. Détection de balise
Les deltas de temps entre les connexions sortantes convergent vers 45 secondes (\`45s\`) avec un jitter faible.

## 2. Blocage dynamique SOAR
Le script d'orchestration isole l'hôte hostile en coupant les communications sortantes :
\`CTF{PURPLE_C2_BEACON_HUNT_AUTOMATED_BLOCK}\`.

## 3. Posture de protection
- Restreindre drastiquement le trafic sortant des serveurs internes aux seuls proxys mandatés.
- Utiliser la détection statistique de périodicité (outils Zeek / RITA).`
  },

  // --------------------------------------------------------------------------
  // 4. RED TEAM PRIVILEGE ESCALATION
  // --------------------------------------------------------------------------
  {
    category: 'systems',
    dir: 'red-01-dirty-pipe-exploit',
    meta: {
      id: 'red-01-dirty-pipe-exploit',
      title: 'Linux Kernel Dirty Pipe (CVE-2022-0847) Root Privilege Escalation',
      organization: 'Enterprise Cloud Infrastructure',
      category: 'Systèmes & Active Directory',
      target_os: 'Linux',
      machine_type: 'room',
      difficulty: 'difficile',
      points: 200,
      duration_min: 45,
      learning_path: 'path-05-redteam-labs',
      author: 'Kernel Exploit Unit',
      tags: ['red-team', 'privesc', 'kernel', 'dirty-pipe', 'cve-2022-0847', 'root'],
      cve: 'CVE-2022-0847',
      rating: 4.9,
      solves: 540,
      monogram: 'PIPE',
      prerequisites: ['Architecture du noyau Linux, Page Cache et pipes', 'Compilation de code C et injection dans les fichiers en lecture seule'],
      recommended_tools: ['gcc', 'gdb', 'strace', 'uname -r'],
      narrative_story: 'Le serveur de production exécute un noyau Linux 5.16 vulnérable à la faille Dirty Pipe (CVE-2022-0847). Cette vulnérabilité permet d\'écraser des données dans le cache de pages du noyau pour des fichiers ouverts en lecture seule. Compile l\'exploit pour injecter un compte root sans mot de passe dans /etc/passwd et capturer le drapeau administrateur.',
      target_port: 3333,
      virtual_ip: '10.10.65.12'
    },
    tasks: [
      {
        id: 't1',
        title: 'Vérification de la version du noyau Linux',
        description: 'Quelle commande affiche la version du noyau en cours d\'exécution (ex: 5.16.0-generic) ?',
        points: 40,
        task_type: 'flag',
        canonical_flag: 'uname -r'
      },
      {
        id: 't2',
        title: 'Exploitation Dirty Pipe & Shell Root',
        description: 'Exécutez l\'exploit Dirty Pipe pour écraser la ligne root dans /etc/passwd et capturer le flag root.',
        points: 80,
        task_type: 'flag',
        canonical_flag: 'CTF{RED_DIRTY_PIPE_KERNEL_PWN_ROOT}'
      },
      {
        id: 't3',
        title: 'Comment s\'en protéger (Mise à Jour de Noyau & Livepatch)',
        description: 'Appliquez la mise à jour corrective du noyau (>= 5.16.11 / 5.15.25) et activez Canonical Livepatch pour combler les failles noyau sans reboot.',
        points: 80,
        task_type: 'flag',
        is_defense: true,
        canonical_flag: 'DEFENSE{KERNEL_LIVEPATCH_DIRTYPIPE_MITIGATED}'
      }
    ],
    hints: [
      {
        title: 'Principe Dirty Pipe',
        content: 'La faille réside dans le drapeau PIPE_BUF_FLAG_CAN_MERGE non initialisé dans le sous-système de pipes.'
      },
      {
        title: 'Cible d\'écrasement',
        content: 'Injecter une chaîne du type "root:a:$6$xyz...:0:0:root:/root:/bin/bash" dans /etc/passwd.'
      }
    ],
    writeup: `# Solution Détaillée // Linux Dirty Pipe CVE-2022-0847

## 1. Détection de la vulnérabilité
Vérification avec \`uname -r\` : le noyau 5.16.0 est vulnérable.

## 2. Exploitation
L'exploit splice des données arbitraires dans le cache de \`/etc/passwd\` sans altérer les permissions du fichier, fournissant un accès root immédiat :
\`CTF{RED_DIRTY_PIPE_KERNEL_PWN_ROOT}\`.

## 3. Remédiation
- Mettre à jour le noyau : \`apt-get update && apt-get install --only-upgrade linux-image-generic\`.
- Activer la mise à jour à chaud (Kpatch / Livepatch).`
  },

  {
    category: 'systems',
    dir: 'red-02-capabilities-tar-privesc',
    meta: {
      id: 'red-02-capabilities-tar-privesc',
      title: 'Linux POSIX File Capabilities cap_setuid Exploitation',
      organization: 'Telecom Data Center Operations',
      category: 'Systèmes & Active Directory',
      target_os: 'Linux',
      machine_type: 'room',
      difficulty: 'moyen',
      points: 120,
      duration_min: 30,
      learning_path: 'path-05-redteam-labs',
      author: 'Aegis Systems Team',
      tags: ['red-team', 'linux', 'capabilities', 'getcap', 'setuid', 'privesc'],
      cve: 'CWE-250',
      rating: 4.8,
      solves: 1100,
      monogram: 'CAPS',
      prerequisites: ['Système de Capabilities Linux (man 7 capabilities)', 'Élévation de privilèges via getcap / setcap'],
      recommended_tools: ['getcap', 'tar', 'python3', 'GTFOBins'],
      narrative_story: 'Pour permettre des sauvegardes automatisées sans accorder les pleins pouvoirs sudo, l\'administrateur a configuré la capability cap_setuid+ep sur le binaire python3 ou tar. Un attaquant présent sur la machine locale peut invoquer cette capability pour changer son UID effectif en 0 (root) et acquérir les privilèges super-utilisateur.',
      target_port: 3333,
      virtual_ip: '10.10.65.18'
    },
    tasks: [
      {
        id: 't1',
        title: 'Énumération des capabilities avec getcap',
        description: 'Quelle commande liste toutes les capabilities définies sur les exécutables du système ?',
        points: 30,
        task_type: 'flag',
        canonical_flag: 'getcap -r / 2>/dev/null'
      },
      {
        id: 't2',
        title: 'Élévation UID 0 & Extraction du flag root',
        description: 'Exploitez la capability cap_setuid pour exécuter un shell root et capturer le drapeau.',
        points: 50,
        task_type: 'flag',
        canonical_flag: 'CTF{RED_CAPABILITIES_ELEVATION_SYSTEM_ROOT}'
      },
      {
        id: 't3',
        title: 'Comment s\'en protéger (Principe du Moindre Privilège & Audit AIDE)',
        description: 'Supprimez les capabilities superflues avec setcap -r et auditez l\'intégrité des binaires système.',
        points: 40,
        task_type: 'flag',
        is_defense: true,
        canonical_flag: 'DEFENSE{SETCAP_REMOVED_AUDITD_INTEGRITY_VERIFIED}'
      }
    ],
    hints: [
      {
        title: 'Commande getcap',
        content: 'L\'argument -r permet une recherche récursive, et 2>/dev/null masque les erreurs de permission.'
      },
      {
        title: 'One-liner Python',
        content: 'python3 -c "import os; os.setuid(0); os.system(\'/bin/sh\')"'
      }
    ],
    writeup: `# Solution Détaillée // Linux Capabilities cap_setuid

## 1. Énumération
\`\`\`bash
getcap -r / 2>/dev/null
# /usr/bin/python3 = cap_setuid+ep
\`\`\`

## 2. Exploitation
\`\`\`bash
python3 -c "import os; os.setuid(0); os.system('/bin/bash')"
# id -> uid=0(root) gid=0(root)
\`\`\`
Récupération du flag root : \`CTF{RED_CAPABILITIES_ELEVATION_SYSTEM_ROOT}\`.

## 3. Remédiation
- Révoquer la capability : \`setcap -r /usr/bin/python3\`.
- Déployer un contrôle d'intégrité (Tripwire / AIDE) pour détecter les modifications de permissions étendues.`
  }
];

function generateAll() {
  console.log(`[GENERATOR] Génération de ${newChallenges.length} challenges spécialisés...`);

  for (const ch of newChallenges) {
    const targetDir = path.join(CHALLENGES_ROOT, ch.category, ch.dir);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // meta.json
    fs.writeFileSync(path.join(targetDir, 'meta.json'), JSON.stringify(ch.meta, null, 2), 'utf8');

    // tasks.json
    fs.writeFileSync(path.join(targetDir, 'tasks.json'), JSON.stringify(ch.tasks, null, 2), 'utf8');

    // hints.json
    fs.writeFileSync(path.join(targetDir, 'hints.json'), JSON.stringify(ch.hints, null, 2), 'utf8');

    // writeup.md
    fs.writeFileSync(path.join(targetDir, 'writeup.md'), ch.writeup, 'utf8');

    console.log(`✔ Challenge créé : ${ch.category}/${ch.dir} (${ch.meta.title})`);
  }

  console.log('[GENERATOR] Tous les challenges ont été créés avec succès !');
}

generateAll();

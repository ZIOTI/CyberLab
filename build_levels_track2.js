// Curriculum Track 2: Réseau Fondamental : De l'IP au Web (Niveau Zéro à Pro) - 12 Levels
module.exports = [
  // 1. Qu'est-ce qu'une Adresse IP ?
  {
    id: 'm2-l1',
    unitId: 'm2',
    title: "1. Qu'est-ce qu'une Adresse IP ?",
    icon: '🌐',
    xp: 35,
    lessonSlides: [
      {
        title: "L'Adresse Postale du Monde Numérique",
        bullets: [
          "Pour que deux ordinateurs puissent s'échanger des messages sur Internet, ils ont besoin d'une adresse unique : c'est l'**Adresse IP** (Internet Protocol).",
          "En version classique (**IPv4**), une adresse IP est une suite de 4 nombres compris entre 0 et 255 séparés par des points (ex: `192.168.1.42` ou `8.8.8.8`).",
          "Sans adresse IP, aucun paquet de données ne pourrait trouver son destinataire."
        ]
      },
      {
        title: "IP Publique vs IP Privée & Localhost",
        bullets: [
          "Une **IP Publique** est visible sur tout Internet (ton adresse de box ou d'un serveur web public).",
          "Une **IP Privée** n'est accessible qu'à l'intérieur de ta maison ou de l'entreprise (souvent en `192.168.x.x` ou `10.x.x.x`).",
          "L'adresse spéciale `127.0.0.1` (appelée **localhost** ou boucle locale) désigne toujours **ton propre ordinateur**. C'est un miroir numérique !"
        ],
        syntaxBox: {
          command: "cat /etc/hosts",
          description: "Affiche la table locale de correspondance entre noms et adresses IP.",
          example: "127.0.0.1 localhost aegis.local"
        }
      }
    ],
    microCard: {
      svgVisual: `
        <svg viewBox="0 0 400 120" class="w-full h-full">
          <rect x="30" y="30" width="130" height="60" rx="8" fill="#0f172a" stroke="#06b6d4" stroke-width="2"/>
          <text x="95" y="55" fill="#38bdf8" font-size="12" font-family="monospace" text-anchor="middle" font-weight="bold">127.0.0.1</text>
          <text x="95" y="75" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">Localhost (Moi-même)</text>
          <path d="M 170 60 L 220 60" stroke="#10b981" stroke-width="2"/>
          <rect x="230" y="30" width="140" height="60" rx="8" fill="#0f172a" stroke="#10b981" stroke-width="2"/>
          <text x="300" y="55" fill="#34d399" font-size="12" font-family="monospace" text-anchor="middle" font-weight="bold">192.168.1.42</text>
          <text x="300" y="75" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">IP Réseau Privé</text>
        </svg>
      `,
      codeSnippet: {
        language: 'bash',
        lines: [
          { num: 1, text: "# Inspecte la table locale de résolution des adresses IP :" },
          { num: 2, text: "operator@cyberlab:~$ cat /etc/hosts", isCritical: true, note: "127.0.0.1 représente toujours l'adresse de bouclage local (localhost)" },
          { num: 3, text: "127.0.0.1 localhost aegis.local" }
        ],
        prompt: "Clique sur la commande qui affiche la configuration des adresses IP locales :"
      },
      tokenPuzzle: {
        instruction: "Tape la commande pour inspecter le fichier d'adresses IP /etc/hosts :",
        tokens: ["cat", "/etc/hosts", "ls", "ping"],
        correctOrder: ["cat", "/etc/hosts"]
      },
      quickQuiz: {
        prompt: "Quelle adresse IPv4 désigne universellement la boucle locale (localhost / soi-même) ?",
        options: [
          { text: "127.0.0.1 (l'adresse de bouclage locale / loopback).", isCorrect: true, debrief: "Exact ! Tout paquet envoyé vers 127.0.0.1 reste sur la machine locale sans passer par le câble physique." },
          { text: "192.168.1.1 (l'adresse par défaut de la passerelle / box).", isCorrect: false, debrief: "Faux. C'est l'adresse typique du routeur local." },
          { text: "8.8.8.8 (le serveur DNS public de Google).", isCorrect: false, debrief: "Faux. 8.8.8.8 est un serveur DNS externe de Google." },
          { text: "255.255.255.255 (l'adresse de diffusion broadcast).", isCorrect: false, debrief: "Faux. C'est le broadcast réseau universel." }
        ]
      }
    },
    challenge: {
      type: 'terminal',
      instructions: "Dans le terminal, tape 'cat /etc/hosts'. Repère l'adresse IP associée à localhost et soumets sa valeur exacte !",
      flag: '127.0.0.1'
    }
  },

  // 2. Qu'est-ce qu'un Port Réseau ?
  {
    id: 'm2-l2',
    unitId: 'm2',
    title: "2. Qu'est-ce qu'un Port Réseau ?",
    icon: '🚪',
    xp: 35,
    lessonSlides: [
      {
        title: "L'Analogie de l'Immeuble et des Appartements",
        bullets: [
          "Si l'adresse IP est l'adresse de l'immeuble, le **Port Réseau** est le numéro d'appartement ou la porte d'entrée spécifique.",
          "Une machine peut exécuter en même temps un serveur web, un serveur d'e-mails et un serveur de jeu. Comment l'ordinateur sait-il à qui donner le message ?",
          "Grâce au numéro de port ! Les numéros vont de **0 à 65535**."
        ]
      },
      {
        title: "Les Ports Célèbres à Connaître Par Cœur",
        bullets: [
          "• **Port 80** : Serveur Web non chiffré (HTTP).",
          "• **Port 443** : Serveur Web sécurisé et chiffré (HTTPS).",
          "• **Port 22** : Prise de contrôle à distance sécurisée en ligne de commande (SSH).",
          "• **Port 53** : Résolution de noms de domaine (DNS).",
          "• **Port 3306** : Base de données MySQL.",
          "Notre labo local tourne actuellement sur le port spécial **3333** !"
        ],
        syntaxBox: {
          command: "ss -tuln",
          description: "Liste tous les ports réseau en écoute sur l'ordinateur local.",
          example: "tcp LISTEN 0 128 0.0.0.0:3333"
        }
      }
    ],
    microCard: {
      svgVisual: `
        <svg viewBox="0 0 400 120" class="w-full h-full">
          <rect x="25" y="25" width="80" height="70" rx="6" fill="#0f172a" stroke="#06b6d4" stroke-width="2"/>
          <text x="65" y="55" fill="#38bdf8" font-size="12" font-family="monospace" text-anchor="middle" font-weight="bold">:80</text>
          <text x="65" y="75" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">HTTP</text>
          <rect x="120" y="25" width="80" height="70" rx="6" fill="#0f172a" stroke="#10b981" stroke-width="2"/>
          <text x="160" y="55" fill="#34d399" font-size="12" font-family="monospace" text-anchor="middle" font-weight="bold">:443</text>
          <text x="160" y="75" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">HTTPS</text>
          <rect x="215" y="25" width="80" height="70" rx="6" fill="#0f172a" stroke="#3b82f6" stroke-width="2"/>
          <text x="255" y="55" fill="#60a5fa" font-size="12" font-family="monospace" text-anchor="middle" font-weight="bold">:22</text>
          <text x="255" y="75" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">SSH</text>
          <rect x="310" y="25" width="75" height="70" rx="6" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>
          <text x="347" y="55" fill="#fbbf24" font-size="12" font-family="monospace" text-anchor="middle" font-weight="bold">:3333</text>
          <text x="347" y="75" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">CyberLab</text>
        </svg>
      `,
      codeSnippet: {
        language: 'bash',
        lines: [
          { num: 1, text: "# Liste les services réseau actifs et leurs ports d'écoute :" },
          { num: 2, text: "operator@cyberlab:~$ ss -tuln", isCritical: true, note: "ss -tuln révèle que le serveur web CyberLab écoute sur le port 3333" },
          { num: 3, text: "Netid State  Recv-Q Send-Q Local Address:Port Peer Address:Port" },
          { num: 4, text: "tcp   LISTEN 0      128          0.0.0.0:3333     0.0.0.0:*" }
        ],
        prompt: "Clique sur la commande qui énumère les ports en écoute sur la machine :"
      },
      tokenPuzzle: {
        instruction: "Tape la commande pour lister les ports TCP en écoute sous forme numérique :",
        tokens: ["ss", "-tuln", "ping", "curl"],
        correctOrder: ["ss", "-tuln"]
      },
      quickQuiz: {
        prompt: "Quel est le numéro de port standard réservé mondialement au protocole web chiffré HTTPS ?",
        options: [
          { text: "Le port 443.", isCorrect: true, debrief: "Exact ! Le port 80 est réservé au HTTP non chiffré, et le port 443 au HTTPS sécurisé par TLS." },
          { text: "Le port 22.", isCorrect: false, debrief: "Faux. Le port 22 est le port d'administration SSH." },
          { text: "Le port 21.", isCorrect: false, debrief: "Faux. Le port 21 est réservé aux transferts de fichiers FTP." },
          { text: "Le port 53.", isCorrect: false, debrief: "Faux. Le port 53 est utilisé par le protocole DNS." }
        ]
      }
    },
    challenge: {
      type: 'terminal',
      instructions: "Dans le terminal, tape 'ss -tuln' pour repérer le port sur lequel tourne notre serveur local. Soumets ce numéro de port (4 chiffres) !",
      flag: '3333'
    }
  },

  // 3. Tester la Connectivité avec ping (ICMP)
  {
    id: 'm2-l3',
    unitId: 'm2',
    title: "3. Tester la Connectivité : ping & ICMP",
    icon: '📡',
    xp: 35,
    lessonSlides: [
      {
        title: "Le Sonar du Réseau : ping",
        bullets: [
          "Comme un sous-marin qui émet un son sous l'eau et écoute son écho pour repérer les obstacles, la commande `ping` envoie un paquet de test vers une adresse IP.",
          "Ce protocole s'appelle **ICMP** (Internet Control Message Protocol).",
          "Si la machine cible est allumée et connectée, elle renvoie immédiatement un paquet réponse (*Echo Reply*)."
        ]
      },
      {
        title: "Mesurer la Latence et le TTL",
        bullets: [
          "Le ping mesure le temps d'aller-retour en millisecondes (**ms**). Plus le chiffre est petit, plus la connexion est rapide.",
          "Le **TTL** (Time To Live) indique le nombre maximum de routeurs que le paquet peut traverser avant de mourir (souvent 64 sous Linux ou 128 sous Windows).",
          "C'est la toute première commande qu'un administrateur ou pentesteur tape pour vérifier si une cible est vivante."
        ],
        syntaxBox: {
          command: "ping -c 3 192.168.1.1",
          description: "Envoie 3 paquets de test vers la passerelle locale.",
          example: "64 bytes from 192.168.1.1: icmp_seq=1 ttl=64 time=0.84 ms"
        }
      }
    ],
    microCard: {
      svgVisual: `
        <svg viewBox="0 0 400 120" class="w-full h-full">
          <rect x="30" y="30" width="110" height="60" rx="8" fill="#0f172a" stroke="#06b6d4" stroke-width="2"/>
          <text x="85" y="65" fill="#38bdf8" font-size="12" font-family="monospace" text-anchor="middle">Moi</text>
          <path d="M 150 50 L 250 50" stroke="#10b981" stroke-width="2" marker-end="url(#arrow)"/>
          <text x="200" y="42" fill="#34d399" font-size="9" font-family="monospace" text-anchor="middle">Echo Request ➔</text>
          <path d="M 250 75 L 150 75" stroke="#f59e0b" stroke-width="2" stroke-dasharray="3"/>
          <text x="200" y="90" fill="#fbbf24" font-size="9" font-family="monospace" text-anchor="middle">⬅ Echo Reply (0.8ms)</text>
          <rect x="260" y="30" width="110" height="60" rx="8" fill="#0f172a" stroke="#10b981" stroke-width="2"/>
          <text x="315" y="65" fill="#34d399" font-size="12" font-family="monospace" text-anchor="middle">Cible</text>
        </svg>
      `,
      codeSnippet: {
        language: 'bash',
        lines: [
          { num: 1, text: "# Teste la connectivité vers la passerelle réseau locale :" },
          { num: 2, text: "operator@cyberlab:~$ ping -c 1 192.168.1.1", isCritical: true, note: "ping vérifie si l'adresse IP cible répond aux requêtes d'écho ICMP" },
          { num: 3, text: "64 bytes from 192.168.1.1: icmp_seq=1 ttl=64 time=0.42 ms" }
        ],
        prompt: "Clique sur la commande qui envoie un paquet de test ping ICMP :"
      },
      tokenPuzzle: {
        instruction: "Tape la commande pour tester la connectivité vers 192.168.1.1 :",
        tokens: ["ping", "192.168.1.1", "whoami", "cat"],
        correctOrder: ["ping", "192.168.1.1"]
      },
      quickQuiz: {
        prompt: "Quel protocole réseau fondamental sous-jacent est utilisé par la commande 'ping' ?",
        options: [
          { text: "ICMP (Internet Control Message Protocol).", isCorrect: true, debrief: "Exact ! ICMP sert aux diagnostics d'erreurs et de connectivité." },
          { text: "HTTP (Hypertext Transfer Protocol).", isCorrect: false, debrief: "Faux. HTTP est un protocole de haut niveau pour les pages web." },
          { text: "FTP (File Transfer Protocol).", isCorrect: false, debrief: "Faux. FTP sert aux transferts de fichiers." },
          { text: "SSH (Secure Shell).", isCorrect: false, debrief: "Faux. SSH sert à la connexion distante sécurisée." }
        ]
      }
    },
    challenge: {
      type: 'terminal',
      instructions: "Dans le terminal, tape 'ping 192.168.1.1' pour tester la connexion vers la passerelle. Soumets l'adresse IP cible testée !",
      flag: '192.168.1.1'
    }
  },

  // 4. TCP vs UDP : Fiabilité vs Vitesse
  {
    id: 'm2-l4',
    unitId: 'm2',
    title: "4. TCP vs UDP : Fiabilité vs Vitesse",
    icon: '⚖️',
    xp: 40,
    lessonSlides: [
      {
        title: "Les Deux Grands Protocoles de Transport",
        bullets: [
          "Au-dessus de l'adresse IP, les données doivent être acheminées selon deux philosophies radicalement opposées : **TCP** ou **UDP**.",
          "Chaque application choisit son camp selon qu'elle privilégie la fiabilité absolue ou la vitesse pure."
        ]
      },
      {
        title: "TCP : Le Recommandé avec Accusé de Réception",
        bullets: [
          "**TCP** (Transmission Control Protocol) vérifie que chaque paquet arrive sans erreur et dans le bon ordre.",
          "Si un paquet est perdu, TCP le renvoie automatiquement !",
          "Utilisé pour le Web (HTTP/HTTPS), les fichiers et les e-mails où pas un seul octet ne doit manquer."
        ]
      },
      {
        title: "UDP : La Diffusion Sans Contrôle",
        bullets: [
          "**UDP** (User Datagram Protocol) tire les paquets à toute vitesse sans jamais vérifier s'ils sont arrivés.",
          "Aucun accusé de réception, aucune garantie : si un paquet saute, tant pis !",
          "Utilisé pour le streaming vidéo en direct, les jeux vidéo en ligne et les requêtes DNS rapides."
        ]
      }
    ],
    microCard: {
      svgVisual: `
        <svg viewBox="0 0 400 120" class="w-full h-full">
          <rect x="25" y="25" width="165" height="70" rx="8" fill="#0f172a" stroke="#06b6d4" stroke-width="2"/>
          <text x="107" y="50" fill="#38bdf8" font-size="12" font-family="monospace" text-anchor="middle" font-weight="bold">TCP (Fiable)</text>
          <text x="107" y="70" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">Accusé de réception (ACK)</text>
          <text x="107" y="85" fill="#34d399" font-size="9" font-family="monospace" text-anchor="middle">Web, SSH, Fichiers</text>
          <rect x="210" y="25" width="165" height="70" rx="8" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>
          <text x="292" y="50" fill="#fbbf24" font-size="12" font-family="monospace" text-anchor="middle" font-weight="bold">UDP (Rapide)</text>
          <text x="292" y="70" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">Tir continu sans contrôle</text>
          <text x="292" y="85" fill="#f87171" font-size="9" font-family="monospace" text-anchor="middle">Jeux, Streaming, DNS</text>
        </svg>
      `,
      codeSnippet: {
        language: 'bash',
        lines: [
          { num: 1, text: "# Observe les sockets TCP actuellement connectés au système :" },
          { num: 2, text: "operator@cyberlab:~$ ss -t", isCritical: true, note: "ss -t filtre spécifiquement les connexions TCP établies" },
          { num: 3, text: "State      Recv-Q Send-Q Local Address:Port Peer Address:Port" },
          { num: 4, text: "ESTAB      0      0      127.0.0.1:3333     127.0.0.1:48210" }
        ],
        prompt: "Clique sur la commande qui filtre uniquement les connexions TCP :"
      },
      tokenPuzzle: {
        instruction: "Tape la commande ss pour afficher l'état des connexions TCP :",
        tokens: ["ss", "-t", "ping", "whoami"],
        correctOrder: ["ss", "-t"]
      },
      quickQuiz: {
        prompt: "Pourquoi les jeux vidéo compétitifs en ligne et le streaming utilisent-ils massivement le protocole UDP plutôt que TCP ?",
        options: [
          { text: "Parce qu'UDP n'attend pas d'accusé de réception, offrant une latence minimale indispensable au temps réel.", isCorrect: true, debrief: "Exact ! Mieux vaut perdre une image d'un dixième de seconde que geler le jeu en attendant un renvoi." },
          { text: "Parce qu'UDP chiffre les paquets avec un certificat SSL matériel.", isCorrect: false, debrief: "Faux. UDP ne propose aucun chiffrement par lui-même." },
          { text: "Parce que TCP est interdit par la loi sur les serveurs de jeux.", isCorrect: false, debrief: "Faux. TCP est un standard ouvert utilisable par n'importe qui." },
          { text: "Parce qu'UDP ne nécessite aucune carte réseau pour fonctionner.", isCorrect: false, debrief: "Faux. Tout protocole réseau nécessite du matériel réseau." }
        ]
      }
    },
    challenge: {
      type: 'terminal',
      instructions: "Dans le terminal, tape 'ss -t' pour inspecter les connexions TCP. Soumets l'état de connexion affiché dans la première colonne (ex: ESTAB) !",
      flag: 'ESTAB'
    }
  },

  // 5. Le Handshake TCP à 3 Voies
  {
    id: 'm2-l5',
    unitId: 'm2',
    title: "5. Le Handshake TCP à 3 Voies (SYN/ACK)",
    icon: '🤝',
    xp: 40,
    lessonSlides: [
      {
        title: "La Poignée de Main Initiale",
        bullets: [
          "Avant qu'un navigateur puisse demander la moindre page web ou échanger le moindre octet avec un serveur en TCP, les deux machines doivent impérativement faire connaissance.",
          "C'est la célèbre **poignée de main en 3 étapes** (**3-Way Handshake**)."
        ]
      },
      {
        title: "Les 3 Étapes Cruciales du Handshake",
        bullets: [
          "1. **SYN** (Synchronize) : Le client dit au serveur *Bonjour, je veux me connecter avec le numéro de séquence X*.",
          "2. **SYN-ACK** : Le serveur répond *Bonjour, j'accepte ta demande (ACK X+1), et voici mon propre numéro de séquence Y*.",
          "3. **ACK** (Acknowledge) : Le client valide *Bien reçu (ACK Y+1), la connexion est ouverte !*.",
          "Une fois ce rituel terminé, la connexion passe à l'état `ESTABLISHED`."
        ]
      }
    ],
    microCard: {
      svgVisual: `
        <svg viewBox="0 0 400 120" class="w-full h-full">
          <rect x="25" y="20" width="80" height="80" rx="8" fill="#0f172a" stroke="#06b6d4" stroke-width="2"/>
          <text x="65" y="65" fill="#38bdf8" font-size="12" font-family="monospace" text-anchor="middle">Client</text>
          <path d="M 115 35 L 275 45" stroke="#38bdf8" stroke-width="2"/>
          <text x="195" y="32" fill="#38bdf8" font-size="9" font-family="monospace" text-anchor="middle">1. SYN [seq=100] ➔</text>
          <path d="M 275 60 L 115 70" stroke="#f59e0b" stroke-width="2"/>
          <text x="195" y="62" fill="#fbbf24" font-size="9" font-family="monospace" text-anchor="middle">⬅ 2. SYN-ACK [ack=101, seq=500]</text>
          <path d="M 115 85 L 275 95" stroke="#10b981" stroke-width="2"/>
          <text x="195" y="92" fill="#34d399" font-size="9" font-family="monospace" text-anchor="middle">3. ACK [ack=501] ➔</text>
          <rect x="285" y="20" width="80" height="80" rx="8" fill="#0f172a" stroke="#10b981" stroke-width="2"/>
          <text x="325" y="65" fill="#34d399" font-size="12" font-family="monospace" text-anchor="middle">Serveur</text>
        </svg>
      `,
      codeSnippet: {
        language: 'bash',
        lines: [
          { num: 1, text: "# Déroulement d'une négociation TCP réussie :" },
          { num: 2, text: "Client  ➔ Serveur : [SYN]     Seq=0" },
          { num: 3, text: "Serveur ➔ Client  : [SYN,ACK] Seq=0 Ack=1", isCritical: true, note: "Le serveur confirme la demande de connexion du client" },
          { num: 4, text: "Client  ➔ Serveur : [ACK]     Seq=1 Ack=1 (Connexion ESTABLISHED)" }
        ],
        prompt: "Clique sur le paquet dans lequel le serveur répond favorablement à la demande :"
      },
      tokenPuzzle: {
        instruction: "Ordonne chronologiquement les 3 étapes de la poignée de main TCP :",
        tokens: ["SYN", "SYN-ACK", "ACK", "FIN"],
        correctOrder: ["SYN", "SYN-ACK", "ACK"]
      },
      quickQuiz: {
        prompt: "Quel paquet le serveur envoie-t-il au client en réponse au premier paquet SYN lors du handshake TCP ?",
        options: [
          { text: "Un paquet SYN-ACK (accusé de réception combiné à sa propre demande de synchronisation).", isCorrect: true, debrief: "Exact ! Le serveur synchronise son propre numéro de séquence tout en accusant réception du client." },
          { text: "Un paquet FIN-RST (fermeture de port d'urgence).", isCorrect: false, debrief: "Faux. RST sert à refuser la connexion." },
          { text: "Un paquet ICMP Ping Echo.", isCorrect: false, debrief: "Faux. ICMP est un protocole distinct de TCP." },
          { text: "Une clé privée SSH chiffrée.", isCorrect: false, debrief: "Faux. Le handshake TCP précède toute couche applicative SSH ou TLS." }
        ]
      }
    },
    challenge: {
      type: 'terminal',
      instructions: "Dans le terminal, tape 'cat /var/log/auth.log' pour repérer l'événement d'authentification SSH établi suite au handshake. Soumets la première phrase de réussite (Accepted password for operator) !",
      flag: 'Accepted password for operator'
    }
  },

  // 6. Le Système DNS : L'Annuaire du Web
  {
    id: 'm2-l6',
    unitId: 'm2',
    title: "6. L'Annuaire du Web : Le Système DNS",
    icon: '📖',
    xp: 40,
    lessonSlides: [
      {
        title: "Pourquoi le DNS Existe-t-il ?",
        bullets: [
          "Les humains sont très doués pour retenir des noms comme `google.com` ou `cyberlab.local`.",
          "Les machines, en revanche, ne comprennent que des adresses IP binaires (comme `142.250.179.206`).",
          "Le **DNS** (Domain Name System) est l'annuaire universel d'Internet qui traduit automatiquement un nom de domaine en adresse IP."
        ]
      },
      {
        title: "Comment Interroger le DNS : dig & resolv.conf",
        bullets: [
          "Le fichier `/etc/resolv.conf` contient l'adresse IP du serveur DNS que ton ordinateur consulte à chaque fois que tu navigues.",
          "Les outils en ligne de commande `dig` ou `nslookup` permettent d'interroger directement un serveur DNS pour lui demander l'IP d'un site.",
          "Exemple : `dig google.com` renvoie un enregistrement de type **A** (adresse IPv4)."
        ],
        syntaxBox: {
          command: "cat /etc/resolv.conf",
          description: "Affiche le serveur de noms (nameserver) configuré sur la machine.",
          example: "nameserver 127.0.0.53"
        }
      }
    ],
    microCard: {
      svgVisual: `
        <svg viewBox="0 0 400 120" class="w-full h-full">
          <rect x="25" y="30" width="110" height="60" rx="8" fill="#0f172a" stroke="#06b6d4" stroke-width="2"/>
          <text x="80" y="55" fill="#38bdf8" font-size="11" font-family="monospace" text-anchor="middle">google.com</text>
          <text x="80" y="75" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">Nom de domaine</text>
          <path d="M 145 60 L 245 60" stroke="#f59e0b" stroke-width="2"/>
          <text x="195" y="50" fill="#fbbf24" font-size="10" font-family="monospace" text-anchor="middle">DNS Lookup</text>
          <rect x="255" y="30" width="120" height="60" rx="8" fill="#0f172a" stroke="#10b981" stroke-width="2"/>
          <text x="315" y="55" fill="#34d399" font-size="11" font-family="monospace" text-anchor="middle">142.250.179.206</text>
          <text x="315" y="75" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">Adresse IP Cible</text>
        </svg>
      `,
      codeSnippet: {
        language: 'bash',
        lines: [
          { num: 1, text: "# Découvre quel serveur DNS est interrogé par le système :" },
          { num: 2, text: "operator@cyberlab:~$ cat /etc/resolv.conf", isCritical: true, note: "nameserver indique l'adresse du résolveur DNS local" },
          { num: 3, text: "nameserver 127.0.0.53" },
          { num: 4, text: "search aegis.local" }
        ],
        prompt: "Clique sur la commande qui révèle le fichier de configuration DNS :"
      },
      tokenPuzzle: {
        instruction: "Tape la commande pour afficher la configuration du résolveur DNS :",
        tokens: ["cat", "/etc/resolv.conf", "ping", "whoami"],
        correctOrder: ["cat", "/etc/resolv.conf"]
      },
      quickQuiz: {
        prompt: "Quel est le rôle principal du système DNS sur Internet ?",
        options: [
          { text: "Traduire des noms de domaines compréhensibles par les humains en adresses IP utilisables par les machines.", isCorrect: true, debrief: "Bravo ! C'est la fonction fondamentale de l'annuaire DNS." },
          { text: "Accélérer la vitesse de calcul du processeur central de l'ordinateur.", isCorrect: false, debrief: "Faux. Le DNS est un protocole réseau, pas une accélération CPU." },
          { text: "Sauvegarder l'ensemble des fichiers personnels dans le cloud.", isCorrect: false, debrief: "Faux. C'est le rôle des services de sauvegarde." },
          { text: "Bloquer physiquement les virus sur le disque dur.", isCorrect: false, debrief: "Faux. C'est le travail de l'antivirus / EDR." }
        ]
      }
    },
    challenge: {
      type: 'terminal',
      instructions: "Dans le terminal, tape 'cat /etc/resolv.conf'. Repère l'adresse IP du nameserver configuré et soumets-la !",
      flag: '127.0.0.53'
    }
  },

  // 7. Le Protocole HTTP sous le Capot
  {
    id: 'm2-l7',
    unitId: 'm2',
    title: "7. Le Protocole HTTP sous le Capot",
    icon: '📄',
    xp: 40,
    lessonSlides: [
      {
        title: "HTTP : Du Texte Brut et Rien d'Autre",
        bullets: [
          "Chaque page web que tu visites est demandée via le protocole **HTTP** (Hypertext Transfer Protocol).",
          "Sous le capot, HTTP n'a rien de mystique : c'est simplement du **texte brut en anglais** envoyé sur le port 80 ou 443.",
          "Une requête HTTP commence par une ligne de commande contenant un **Verbe** (méthode), un **Chemin** et une version."
        ]
      },
      {
        title: "Les Verbes et les En-Têtes (Headers)",
        bullets: [
          "• `GET /index.html HTTP/1.1` : demande au serveur de renvoyer la page d'accueil.",
          "• `POST /login HTTP/1.1` : envoie des données (comme un formulaire d'identifiant et mot de passe).",
          "• `Host: cyberlab.local` : en-tête obligatoire qui précise quel site web on veut sur ce serveur.",
          "• `User-Agent: Mozilla/...` : informe le serveur du type de navigateur utilisé."
        ]
      }
    ],
    microCard: {
      svgVisual: `
        <svg viewBox="0 0 400 120" class="w-full h-full">
          <rect x="25" y="20" width="350" height="80" rx="8" fill="#030712" stroke="#06b6d4" stroke-width="2"/>
          <text x="40" y="45" fill="#38bdf8" font-size="11" font-family="monospace" font-weight="bold">GET / HTTP/1.1</text>
          <text x="40" y="65" fill="#94a3b8" font-size="10" font-family="monospace">Host: localhost:3333</text>
          <text x="40" y="82" fill="#94a3b8" font-size="10" font-family="monospace">User-Agent: curl/8.5.0</text>
        </svg>
      `,
      codeSnippet: {
        language: 'bash',
        lines: [
          { num: 1, text: "# Exécute une requête HTTP directe vers le serveur local :" },
          { num: 2, text: "operator@cyberlab:~$ curl http://localhost:3333/", isCritical: true, note: "curl émet une véritable requête GET HTTP brute" },
          { num: 3, text: "<!DOCTYPE html><html><head><title>CyberRange PRO</title>..." }
        ],
        prompt: "Clique sur la commande curl qui envoie une requête HTTP GET :"
      },
      tokenPuzzle: {
        instruction: "Tape la commande curl pour interroger la racine de notre serveur local :",
        tokens: ["curl", "http://localhost:3333/", "cat", "whoami"],
        correctOrder: ["curl", "http://localhost:3333/"]
      },
      quickQuiz: {
        prompt: "Quel verbe (méthode) HTTP est standardisé pour demander la consultation d'une ressource sans modifier le serveur ?",
        options: [
          { text: "GET (méthode standard de consultation et de récupération de données).", isCorrect: true, debrief: "Exact ! GET sert à consulter, tandis que POST ou PUT envoient des modifications." },
          { text: "DELETE (méthode de suppression définitive).", isCorrect: false, debrief: "Faux. DELETE demande la suppression de la ressource." },
          { text: "CONNECT (méthode de tunnelisation de socket).", isCorrect: false, debrief: "Faux. CONNECT sert aux proxies SSL/TLS." },
          { text: "PURGE (méthode de purge de cache).", isCorrect: false, debrief: "Faux. Ce n'est pas un verbe HTTP standard de base." }
        ]
      }
    },
    challenge: {
      type: 'terminal',
      instructions: "Dans le terminal, tape 'curl http://localhost:3333/'. Repère le titre HTML de l'application dans la balise <title> et soumets son contenu exact (CyberRange PRO) !",
      flag: 'CyberRange PRO'
    }
  },

  // 8. Les Codes de Statut HTTP
  {
    id: 'm2-l8',
    unitId: 'm2',
    title: "8. Les Codes de Statut HTTP",
    icon: '🚦',
    xp: 40,
    lessonSlides: [
      {
        title: "La Réponse du Serveur : Les Codes à 3 Chiffres",
        bullets: [
          "Quand un serveur répond à ta requête HTTP, la toute première ligne contient un **code de statut à trois chiffres** qui résume le sort de ta demande.",
          "Ces codes sont classés en 5 grandes familles logiques selon leur premier chiffre."
        ]
      },
      {
        title: "Les Grandes Familles de Codes",
        bullets: [
          "• **2xx (Succès)** : `200 OK` (Tout s'est déroulé parfaitement, voici le document).",
          "• **3xx (Redirection)** : `301 Moved Permanently` (La page a déménagé vers une nouvelle URL).",
          "• **4xx (Erreur Client)** : `403 Forbidden` (Tu n'as pas le droit), `404 Not Found` (La page demandée n'existe pas).",
          "• **5xx (Erreur Serveur)** : `500 Internal Server Error` (Le code backend a planté suite à un bug ou une injection) !"
        ],
        syntaxBox: {
          command: "curl -I http://localhost:3333/",
          description: "Envoie une requête HEAD pour afficher uniquement les en-têtes et le code de statut HTTP.",
          example: "HTTP/1.1 200 OK"
        }
      }
    ],
    microCard: {
      svgVisual: `
        <svg viewBox="0 0 400 120" class="w-full h-full">
          <rect x="25" y="30" width="80" height="60" rx="8" fill="#0f172a" stroke="#10b981" stroke-width="2"/>
          <text x="65" y="55" fill="#34d399" font-size="12" font-family="monospace" text-anchor="middle" font-weight="bold">200 OK</text>
          <text x="65" y="75" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">Succès</text>
          <rect x="115" y="30" width="80" height="60" rx="8" fill="#0f172a" stroke="#3b82f6" stroke-width="2"/>
          <text x="155" y="55" fill="#60a5fa" font-size="12" font-family="monospace" text-anchor="middle" font-weight="bold">301 Move</text>
          <text x="155" y="75" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">Redirection</text>
          <rect x="205" y="30" width="80" height="60" rx="8" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>
          <text x="245" y="55" fill="#fbbf24" font-size="12" font-family="monospace" text-anchor="middle" font-weight="bold">404 Lost</text>
          <text x="245" y="75" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">Non trouvé</text>
          <rect x="295" y="30" width="80" height="60" rx="8" fill="#0f172a" stroke="#f43f5e" stroke-width="2"/>
          <text x="335" y="55" fill="#f87171" font-size="12" font-family="monospace" text-anchor="middle" font-weight="bold">500 Crash</text>
          <text x="335" y="75" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">Bug Serveur</text>
        </svg>
      `,
      codeSnippet: {
        language: 'bash',
        lines: [
          { num: 1, text: "# Affiche uniquement les en-têtes HTTP de la réponse :" },
          { num: 2, text: "operator@cyberlab:~$ curl -I http://localhost:3333/", isCritical: true, note: "L'option -I envoie une requête HEAD pour obtenir le code de statut" },
          { num: 3, text: "HTTP/1.1 200 OK" },
          { num: 4, text: "Content-Type: text/html; charset=utf-8" }
        ],
        prompt: "Clique sur la commande qui inspecte les en-têtes et le code de statut :"
      },
      tokenPuzzle: {
        instruction: "Tape la commande curl avec option -I pour inspecter les en-têtes du serveur :",
        tokens: ["curl", "-I", "http://localhost:3333/", "cat"],
        correctOrder: ["curl", "-I", "http://localhost:3333/"]
      },
      quickQuiz: {
        prompt: "Quelle famille de codes de statut HTTP indique que le serveur a rencontré une erreur interne ou a planté ?",
        options: [
          { text: "La famille 5xx (ex: 500 Internal Server Error, 502 Bad Gateway).", isCorrect: true, debrief: "Exact ! 5xx signifie que la faute incombe au serveur distant." },
          { text: "La famille 2xx (Succès).", isCorrect: false, debrief: "Faux. 2xx signifie que tout a parfaitement fonctionné." },
          { text: "La famille 3xx (Redirection).", isCorrect: false, debrief: "Faux. 3xx indique une redirection vers une autre adresse." },
          { text: "La famille 1xx (Information préliminaire).", isCorrect: false, debrief: "Faux. 1xx indique un statut intermédiaire purement informatif." }
        ]
      }
    },
    challenge: {
      type: 'terminal',
      instructions: "Dans le terminal, tape 'curl -I http://localhost:3333/'. Soumets le code et le message de statut exact retourné (ex: 200 OK) !",
      flag: '200 OK'
    }
  },

  // ★ CHECKPOINT ÉVALUATION MI-PARCOURS TRACK 2 ★
  {
    id: 'm2-mid',
    unitId: 'm2',
    title: "ÉVALUATION MI-PARCOURS : RECONNAISSANCE RÉSEAU & AUDIT D'EN-TÊTES",
    icon: '🛡️',
    isCheckpoint: true,
    xp: 75,
    lessonSlides: [
      {
        title: "AUDIT D'INFRASTRUCTURE : Passerelle Interne Restreinte",
        bullets: [
          "Le département infrastructure a déployé un micro-service de diagnostic interne sur le port 3333 : `/api/network/audit-eval`.",
          "Pour empêcher les accès non autorisés, le service bloque toute requête HTTP standard qui ne contient pas l'en-tête de scan d'audit de conformité.",
          "Cette épreuve récapitule : connectivité IP, ports d'écoute, requêtes HTTP, manipulation des en-têtes et analyse de réponses brutes."
        ]
      },
      {
        title: "Consignes de la Mission d'Audit (Sans Guidage)",
        bullets: [
          "1. Analyse le point d'accès d'évaluation d'infrastructure : `http://127.0.0.1:3333/api/network/audit-eval`.",
          "2. Forge une requête `curl` en lui passant l'en-tête d'audit requis : `-H \"X-Security-Scan: enabled\"`.",
          "3. Analyse la réponse JSON retournée par le serveur et soumets le token de conformité officiel !"
        ]
      }
    ],
    microCard: {
      svgVisual: `
        <svg viewBox="0 0 500 130" class="w-full h-full">
          <rect width="500" height="130" rx="12" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>
          <circle cx="65" cy="65" r="32" fill="#f59e0b" fill-opacity="0.15" stroke="#f59e0b" stroke-width="2"/>
          <text x="65" y="74" fill="#f59e0b" font-size="28" text-anchor="middle">🛡️</text>
          <text x="120" y="45" fill="#f8fafc" font-size="14" font-family="monospace" font-weight="bold">CHECKPOINT RÉSEAU MI-PARCOURS</text>
          <text x="120" y="70" fill="#94a3b8" font-size="11" font-family="monospace">Cible : http://127.0.0.1:3333/api/network/audit-eval</text>
          <rect x="120" y="85" width="350" height="26" rx="6" fill="#1e293b" stroke="#334155"/>
          <text x="130" y="102" fill="#f59e0b" font-size="11" font-family="monospace">Condition : En-tête X-Security-Scan: enabled</text>
        </svg>
      `,
      codeSnippet: {
        language: 'bash',
        lines: [
          { num: 1, text: "# Audit réseau : injection d'en-tête d'autorisation personnalisé" },
          { num: 2, text: "operator@cyberlab:~$ curl -H 'X-Security-Scan: enabled' http://127.0.0.1:3333/api/network/audit-eval", isCritical: true, note: "L'option -H permet de transmettre des en-têtes personnalisés au serveur" },
          { num: 3, text: '{"audit":"AUTHORIZED","status":"SECURITY_PASSED","token":"CYBER{NET_MID_EVAL_RECON_HEADER_AUTHORIZED}"}' }
        ],
        prompt: "Clique sur la ligne curl qui transmet l'en-tête d'audit pour franchir la restriction du serveur :"
      },
      tokenPuzzle: {
        instruction: "Reconstitue la commande curl avec l'en-tête d'audit pour interroger la passerelle :",
        tokens: ["curl", "-H", "'X-Security-Scan: enabled'", "http://127.0.0.1:3333/api/network/audit-eval", "ping"],
        correctOrder: ["curl", "-H", "'X-Security-Scan: enabled'", "http://127.0.0.1:3333/api/network/audit-eval"]
      },
      quickQuiz: {
        prompt: "Quelle option de la commande 'curl' permet d'ajouter un en-tête HTTP arbitraire à une requête ?",
        options: [
          { text: "L'option -H (Header), permettant de spécifier 'Nom-Entete: Valeur'.", isCorrect: true, debrief: "Exact ! curl -H 'Header: Value' est la syntaxe standard pour forger des en-têtes HTTP." },
          { text: "L'option -X (qui sert en réalité à changer le verbe HTTP, ex: -X POST).", isCorrect: false, debrief: "Faux. -X définit la méthode HTTP (GET, POST, PUT), pas les en-têtes." },
          { text: "L'option -d (Data, utilisée pour le corps de requête).", isCorrect: false, debrief: "Faux. -d envoie les données de payload dans le body." },
          { text: "L'option -u (Username, pour l'authentification HTTP basique).", isCorrect: false, debrief: "Faux. -u gère le couple utilisateur:mot-de-passe en Base64." }
        ]
      }
    },
    challenge: {
      type: 'terminal',
      instructions: "Dans le terminal, utilise 'curl' avec l'en-tête 'X-Security-Scan: enabled' pour interroger 'http://127.0.0.1:3333/api/network/audit-eval'. Soumets la valeur du TOKEN retourné !",
      flag: 'CYBER{NET_MID_EVAL_RECON_HEADER_AUTHORIZED}'
    }
  },

  // 9. Le Couteau Suisse Réseau : curl en Ligne de Commande
  {
    id: 'm2-l9',
    unitId: 'm2',
    title: "9. Le Couteau Suisse Réseau : curl",
    icon: '🧰',
    xp: 45,
    lessonSlides: [
      {
        title: "L'Outil le Plus Utilisé au Monde : curl",
        bullets: [
          "`curl` (Client URL) est un outil universel présent sur tous les systèmes Linux et Windows pour transférer des données via une multitude de protocoles.",
          "Contrairement à un navigateur qui télécharge des images et exécute du JavaScript, `curl` récupère le **contenu brut sans fioriture**.",
          "C'est l'arme absolue pour inspecter des réponses d'API et tester des requêtes HTTP personnalisées."
        ]
      },
      {
        title: "La Recherche du Fichier robots.txt",
        bullets: [
          "Sur le web, presque tous les sites possèdent un fichier spécial nommé `/robots.txt`.",
          "Ce fichier indique aux moteurs de recherche (Google, Bing) quels dossiers ils ne doivent pas indexer.",
          "Pour un pentesteur, c'est une mine d'or : les administrateurs y listent souvent les répertoires secrets qu'ils veulent cacher au public !"
        ],
        syntaxBox: {
          command: "curl http://localhost:3333/robots.txt",
          description: "Télécharge et affiche le fichier robots.txt du serveur local.",
          example: "User-agent: * Disallow: /admin FLAG=CYBER{...}"
        }
      }
    ],
    microCard: {
      svgVisual: `
        <svg viewBox="0 0 400 120" class="w-full h-full">
          <rect x="30" y="30" width="130" height="60" rx="8" fill="#0f172a" stroke="#06b6d4" stroke-width="2"/>
          <text x="95" y="55" fill="#38bdf8" font-size="12" font-family="monospace" text-anchor="middle" font-weight="bold">curl URL</text>
          <text x="95" y="75" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">Client HTTP</text>
          <path d="M 170 60 L 230 60" stroke="#10b981" stroke-width="2"/>
          <rect x="240" y="30" width="130" height="60" rx="8" fill="#0f172a" stroke="#10b981" stroke-width="2"/>
          <text x="305" y="55" fill="#34d399" font-size="11" font-family="monospace" text-anchor="middle">/robots.txt</text>
          <text x="305" y="75" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">Pages cachées</text>
        </svg>
      `,
      codeSnippet: {
        language: 'bash',
        lines: [
          { num: 1, text: "# Télécharge le fichier d'exclusion des moteurs de recherche :" },
          { num: 2, text: "operator@cyberlab:~$ curl http://localhost:3333/robots.txt", isCritical: true, note: "curl extrait le texte brut de robots.txt sans passer par un navigateur" },
          { num: 3, text: "User-agent: *" },
          { num: 4, text: "Disallow: /admin-secret-portal" },
          { num: 5, text: "FLAG=CYBER{HTTP_GET_ROBOTS_TXT_FOUND}" }
        ],
        prompt: "Clique sur la commande curl qui télécharge robots.txt :"
      },
      tokenPuzzle: {
        instruction: "Tape la commande pour télécharger robots.txt avec curl :",
        tokens: ["curl", "http://localhost:3333/robots.txt", "cat", "ping"],
        correctOrder: ["curl", "http://localhost:3333/robots.txt"]
      },
      quickQuiz: {
        prompt: "Pourquoi les auditeurs en cybersécurité inspectent-ils systématiquement le fichier /robots.txt d'une cible ?",
        options: [
          { text: "Parce qu'il liste souvent explicitement les dossiers et panneaux d'administration confidentiels que le site souhaite masquer.", isCorrect: true, debrief: "Exact ! Le fichier robots.txt révèle souvent sans le vouloir les chemins les plus sensibles." },
          { text: "Parce qu'il contient la clé de déchiffrement du disque dur du serveur.", isCorrect: false, debrief: "Faux. robots.txt est un simple fichier texte public d'indexation." },
          { text: "Parce qu'il force le serveur à redémarrer en mode administrateur.", isCorrect: false, debrief: "Faux. C'est un document statique sans pouvoir exécutif." },
          { text: "Parce qu'il désactive le pare-feu du fournisseur d'accès.", isCorrect: false, debrief: "Faux. Il n'a aucun impact sur les pare-feux." }
        ]
      }
    },
    challenge: {
      type: 'terminal',
      instructions: "Dans le terminal, tape 'curl http://localhost:3333/robots.txt'. Récupère le drapeau secret présent dans le fichier et soumets sa valeur CYBER{...} !",
      flag: 'CYBER{HTTP_GET_ROBOTS_TXT_FOUND}'
    }
  },

  // 10. Écouter les Connexions Réseau avec ss et netstat
  {
    id: 'm2-l10',
    unitId: 'm2',
    title: "10. Surveillance des Sockets avec ss",
    icon: '👂',
    xp: 45,
    lessonSlides: [
      {
        title: "La Prise de Température Réseau : ss",
        bullets: [
          "Comment savoir quels programmes ouvrent des portes dérobées (backdoors) ou écoutent des connexions entrantes sur ta machine ?",
          "La commande `ss` (Socket Statistics, remplaçante moderne de `netstat`) interroge directement le noyau Linux pour afficher tous les points d'entrée ouverts."
        ]
      },
      {
        title: "Comprendre l'État LISTEN",
        bullets: [
          "Un port en état **LISTEN** est un port sur lequel un serveur attend patiemment qu'un client vienne lui parler.",
          "L'option `-t` filtre TCP, `-u` filtre UDP, `-l` affiche les sockets en écoute (**Listening**), et `-n` affiche les ports en chiffres plutôt qu'en noms de services.",
          "La formule magique que tout administrateur connaît est : `ss -tlpn`."
        ],
        syntaxBox: {
          command: "ss -tlpn",
          description: "Liste tous les serveurs TCP en écoute avec leur PID et numéro de port.",
          example: "LISTEN 0 128 0.0.0.0:3333"
        }
      }
    ],
    microCard: {
      svgVisual: `
        <svg viewBox="0 0 400 120" class="w-full h-full">
          <rect x="25" y="25" width="350" height="70" rx="8" fill="#030712" stroke="#10b981" stroke-width="2"/>
          <text x="40" y="50" fill="#34d399" font-size="11" font-family="monospace" font-weight="bold">ss -tlpn (Sockets en écoute)</text>
          <text x="40" y="70" fill="#94a3b8" font-size="10" font-family="monospace">tcp LISTEN 0 128 *:3333 (CyberLab Server)</text>
        </svg>
      `,
      codeSnippet: {
        language: 'bash',
        lines: [
          { num: 1, text: "# Examine tous les sockets en écoute d'attente de connexion :" },
          { num: 2, text: "operator@cyberlab:~$ ss -tlpn", isCritical: true, note: "ss -tlpn liste tous les ports ouverts en état LISTEN" },
          { num: 3, text: "State  Recv-Q Send-Q Local Address:Port  Peer Address:Port" },
          { num: 4, text: "LISTEN 0      128          0.0.0.0:3333      0.0.0.0:*" }
        ],
        prompt: "Clique sur la commande qui révèle les services en état LISTEN :"
      },
      tokenPuzzle: {
        instruction: "Tape la commande pour lister les sockets TCP en écoute sous forme numérique :",
        tokens: ["ss", "-tlpn", "ping", "cat"],
        correctOrder: ["ss", "-tlpn"]
      },
      quickQuiz: {
        prompt: "Que signifie l'état 'LISTEN' pour un socket réseau affiché par la commande ss ?",
        options: [
          { text: "Le service est actif et attend qu'un client vienne établir une connexion sur ce port.", isCorrect: true, debrief: "Exact ! Le port est ouvert et attend un handshake SYN." },
          { text: "Le port est définitivement bloqué par le pare-feu du système.", isCorrect: false, debrief: "Faux. Un port bloqué serait DROP ou REJECT, pas LISTEN." },
          { text: "La connexion est terminée et les paquets ont été détruits.", isCorrect: false, debrief: "Faux. Une connexion fermée est TIME_WAIT ou CLOSED." },
          { text: "Le processeur est saturé et le serveur est hors ligne.", isCorrect: false, debrief: "Faux. LISTEN indique un service en parfait état de fonctionnement." }
        ]
      }
    },
    challenge: {
      type: 'terminal',
      instructions: "Dans le terminal, tape 'ss -tlpn'. Soumets l'état affiché pour le serveur écoutant sur le port 3333 (LISTEN) !",
      flag: 'LISTEN'
    }
  },

  // 11. Scanner le Réseau avec nmap
  {
    id: 'm2-l11',
    unitId: 'm2',
    title: "11. Cartographier le Réseau avec nmap",
    icon: '🧭',
    xp: 50,
    lessonSlides: [
      {
        title: "Le Scanner de Référence Mondiale : nmap",
        bullets: [
          "`nmap` (Network Mapper) est l'outil le plus célèbre et le plus redoutable de la boîte à outils du pirate éthique.",
          "Il permet de sonder une machine ou tout un réseau à distance pour découvrir : quelles machines sont allumées, quels ports sont ouverts, et quels logiciels y tournent.",
          "C'est la première étape indispensable de toute phase de reconnaissance (**Reconnaissance**)."
        ]
      },
      {
        title: "Détecter les Versions avec -sV",
        bullets: [
          "Savoir qu'un port 80 est ouvert est utile, mais savoir qu'il fait tourner *Apache version 2.4.49* (vulnérable à une faille critique) est infiniment plus précieux !",
          "L'option `-sV` (Service Version) envoie des sondes intelligentes pour contraindre le serveur à révéler sa marque et son numéro de version exacts.",
          "Exemple : `nmap -sV localhost`."
        ],
        syntaxBox: {
          command: "nmap -sV localhost",
          description: "Scanne les ports ouverts sur localhost et détermine la version des services.",
          example: "3333/tcp open http Node.js HTTP Server"
        }
      }
    ],
    microCard: {
      svgVisual: `
        <svg viewBox="0 0 400 120" class="w-full h-full">
          <circle cx="50" cy="60" r="30" fill="#0f172a" stroke="#06b6d4" stroke-width="2"/>
          <text x="50" y="65" fill="#38bdf8" font-size="12" font-family="monospace" text-anchor="middle">nmap</text>
          <line x1="85" y1="60" x2="160" y2="60" stroke="#475569" stroke-width="2"/>
          <rect x="170" y="25" width="200" height="70" rx="8" fill="#0f172a" stroke="#10b981" stroke-width="2"/>
          <text x="180" y="50" fill="#34d399" font-size="11" font-family="monospace">PORT     STATE SERVICE</text>
          <text x="180" y="70" fill="#38bdf8" font-size="11" font-family="monospace">3333/tcp open  http</text>
        </svg>
      `,
      codeSnippet: {
        language: 'bash',
        lines: [
          { num: 1, text: "# Scanne la machine cible pour identifier les ports et versions de services :" },
          { num: 2, text: "operator@cyberlab:~$ nmap -sV localhost", isCritical: true, note: "nmap -sV détecte que le port 3333 est ouvert avec un service HTTP" },
          { num: 3, text: "PORT     STATE SERVICE VERSION" },
          { num: 4, text: "3333/tcp open  http    Node.js (CyberLab Platform)" }
        ],
        prompt: "Clique sur la commande nmap qui cartographie les ports et versions :"
      },
      tokenPuzzle: {
        instruction: "Tape la commande nmap pour scanner les versions de services sur localhost :",
        tokens: ["nmap", "-sV", "localhost", "ping"],
        correctOrder: ["nmap", "-sV", "localhost"]
      },
      quickQuiz: {
        prompt: "Quel est l'objectif premier d'un scanner de ports comme nmap dans un audit de cybersécurité ?",
        options: [
          { text: "Identifier les machines accessibles, leurs ports ouverts et les versions des logiciels en écoute.", isCorrect: true, debrief: "Exact ! C'est le fondement de la phase d'énumération." },
          { text: "Formater les disques durs des serveurs distants sans mot de passe.", isCorrect: false, debrief: "Faux. nmap est un outil d'exploration, pas un destructeur." },
          { text: "Remplacer le système d'exploitation par une distribution Linux.", isCorrect: false, debrief: "Faux. nmap n'installe aucun système d'exploitation." },
          { text: "Augmenter la vitesse du débit de la fibre optique.", isCorrect: false, debrief: "Faux. Aucun logiciel ne peut dépasser les limites physiques de la ligne." }
        ]
      }
    },
    challenge: {
      type: 'terminal',
      instructions: "Dans le terminal, tape 'nmap -sV localhost'. Soumets l'intitulé exact du port et du protocole ouvert découverts (ex: 3333/tcp) !",
      flag: '3333/tcp'
    }
  },

  // 12. Boss Fight Réseau : Reconnaissance & Cartographie
  {
    id: 'm2-l12',
    unitId: 'm2',
    title: "12. ★ BOSS FIGHT RÉSEAU : RECONNAISSANCE ★",
    icon: '👑',
    xp: 100,
    isBoss: true,
    lessonSlides: [
      {
        title: "La Chaîne Complète de Reconnaissance Réseau",
        bullets: [
          "Tu as appris ce qu'est une IP, un port, les sockets en écoute (`ss`), la poignée de main TCP, le protocole DNS, les en-têtes HTTP, l'outil `curl` et le scanner `nmap`.",
          "Pour valider la Piste 2, tu dois combiner ces compétences comme un véritable analyste :",
          "1. Vérifier les ports ouverts avec `nmap`.",
          "2. Interroger la cible avec `curl` sur le chemin d'indexation secret `/robots.txt`.",
          "3. Capturer le drapeau d'homologation réseau !"
        ]
      }
    ],
    microCard: {
      svgVisual: `
        <svg viewBox="0 0 400 120" class="w-full h-full">
          <rect x="20" y="20" width="360" height="80" rx="10" fill="#030712" stroke="#f59e0b" stroke-width="2"/>
          <text x="200" y="55" fill="#fbbf24" font-size="14" font-family="monospace" text-anchor="middle" font-weight="bold">★ ÉPREUVE D'HOMOLOGATION RÉSEAU ★</text>
          <text x="200" y="75" fill="#94a3b8" font-size="11" font-family="monospace" text-anchor="middle">Scan Nmap ➔ Découverte de Port ➔ Extraction curl</text>
        </svg>
      `,
      codeSnippet: {
        language: 'bash',
        lines: [
          { num: 1, text: "# Démarche d'audit : extrait le fichier d'indexation web avec curl :" },
          { num: 2, text: "operator@cyberlab:~$ curl -s http://localhost:3333/robots.txt", isCritical: true, note: "curl télécharge directement la ressource sensible" },
          { num: 3, text: "FLAG=CYBER{HTTP_GET_ROBOTS_TXT_FOUND}" }
        ],
        prompt: "Clique sur la commande qui interroge et extrait le fichier robots.txt :"
      },
      tokenPuzzle: {
        instruction: "Construis la commande finale pour extraire robots.txt :",
        tokens: ["curl", "http://localhost:3333/robots.txt", "nmap", "ping"],
        correctOrder: ["curl", "http://localhost:3333/robots.txt"]
      },
      quickQuiz: {
        prompt: "Dans une attaque ou un test d'intrusion réel, quel est l'enchaînement logique recommandé ?",
        options: [
          { text: "Scan de ports (nmap) pour découvrir les services ➔ Inspection des endpoints (curl) ➔ Exploitation ciblée.", isCorrect: true, debrief: "Exactement ! C'est la méthodologie standard en cybersécurité." },
          { text: "Lancer des attaques au hasard sans scanner la cible.", isCorrect: false, debrief: "Faux. Tirer au hasard est inefficace et bruyant." },
          { text: "Supprimer immédiatement son propre système d'exploitation.", isCorrect: false, debrief: "Faux. Cela détruit votre propre machine." },
          { text: "Éteindre l'ordinateur et attendre 24 heures.", isCorrect: false, debrief: "Faux. Cela n'accomplit aucune mission." }
        ]
      }
    },
    challenge: {
      type: 'terminal',
      instructions: "Dans le terminal, utilise 'curl http://localhost:3333/robots.txt' pour récupérer le drapeau de la mission et soumets sa valeur complète CYBER{...} !",
      flag: 'CYBER{HTTP_GET_ROBOTS_TXT_FOUND}'
    }
  }
];

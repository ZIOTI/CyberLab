# ⚡ CyberRange PRO (Offensive Cybersecurity & CTF Lab)

**CyberRange PRO** est une plateforme d'entraînement et d'apprentissage au hacking éthique, à la sécurité offensive (Red Team / Pentest) et aux CTF. Elle fusionne l'ergonomie gamifiée et tactile de **Duolingo** (boutons 3D avec enfoncement physique, jauges de progression lumineuses, combos x3/x5, confettis, séries et vies) avec l'exigence technique et l'immersion sans concession d'un laboratoire professionnel.

100% autonome, confiné en local et sans aucune dépendance npm externe (Node.js natif + `node:sqlite`).

---

## 🚀 Première Installation en 1 Clic (Pour tes potes / joueurs)

Tes potes ont deux façons simples d'installer le jeu depuis l'onglet **[Releases](https://github.com/ZIOTI/CyberLab/releases)** :

### Option 1 : L'Installateur Windows Dédié (.EXE) — Recommandé
1. Télécharge **`CyberRange-PRO-Setup.exe`**.
2. Lance l'installateur :
   - Il installe le laboratoire dans `%LOCALAPPDATA%\Programs\CyberRange-PRO` (aucun droit administrateur requis).
   - Il crée automatiquement un raccourci stylé sur le Bureau (**⚡ CyberRange PRO**).
   - Il crée l'entrée dans le Menu Démarrer.
   - Il démarre directement le jeu et ouvre le navigateur !

### Option 2 : Version Portable (.ZIP ou .EXE direct)
1. Télécharge **`CyberRange-PRO.zip`** et dézippe-le où tu veux.
2. Double-clique sur **`CyberRange-PRO.exe`** (ou `start.bat`).

> 🛡️ **Rétention Garantie des Données :**
> Ta progression (XP, niveaux complétés, badges débloqués, série streak, vies restantes) est automatiquement stockée dans ta base locale `cyberrange.db`. Même en mettant à jour le jeu, **ta progression n'est JAMAIS écrasée ni perdue**.

---

## 🔄 Système d'Auto-Update Automatique & En Place

Lorsqu'une nouvelle version de CyberRange PRO est publiée sur GitHub :
1. Dès qu'un joueur lance le jeu ou recharge la page, une **modale d'alerte critique verrouillée** s'affiche immédiatement.
2. L'accès aux défis est suspendu tant que la version n'est pas synchronisée afin de garantir la cohérence des cibles, des flags et du curriculum.
3. Le joueur clique sur **« 🚀 Télécharger & Mettre à Jour Automatiquement »** :
   - Le moteur télécharge la dernière version depuis GitHub Releases.
   - Il sauvegarde automatiquement `cyberrange.db` en `.bak`.
   - Il met à jour les fichiers de code **directement en place** dans le dossier d'installation.
   - **Il ne recrée pas de raccourcis supplémentaires et ne relance pas l'installateur.**
   - Le serveur redémarre instantanément et recharge la page avec 100% de la progression conservée.

---

## 👨‍💻 Publication 100% Automatique (Pour toi)

Tu n'as aucun script manuel à lancer ! Dès que tu effectues un `git push` sur la branche `main` :
1. **GitHub Actions** prend automatiquement le relais.
2. Il exécute les 12 suites de tests pour vérifier que tout est vert.
3. Il compile nativement **`CyberRange-PRO.exe`** et l'installateur **`CyberRange-PRO-Setup.exe`**.
4. Il package l'archive **`CyberRange-PRO.zip`**.
5. Il publie automatiquement la **GitHub Release** avec l'installateur `.exe` et l'archive `.zip` attachés.
6. Tous tes potes reçoivent instantanément la popup de mise à jour dès qu'ils lancent le jeu !

---

## 🗺️ Le Curriculum Pédagogique (5 Pistes Complètes, 61 Niveaux Granulaires)

| Piste | Contenu Exhaustif & Progression "De Zéro à Pro" |
| :--- | :--- |
| 🐧 **Piste 1 : Linux & Ligne de Commande (Niveau Zéro à Pro)** *(16 niveaux)* | Le terminal sans souris, syntaxe des commandes, invite de commande `$`, `whoami`, `pwd`, chemins absolus `/` vs relatifs `~`, `ls`, options détaillées et fichiers cachés `ls -la`, navigation `cd`, `cd ..`, `cd -`, autocomplétion TAB, création `mkdir` et `touch`, manipulation `cp`, `mv`, `rm` sans corbeille, lecture `cat`, `head -n`, comptage `wc -l`, redirections et pipe `|`, recherche dans le texte avec `grep` (`-i`, `-r`, `-v`), recherche de fichiers avec `find` (`-name`, `-type f`), permissions octales et symboliques `chmod`, gestion des processus `ps aux`, `top`, `kill -9`, **Boss Fight Audit Système Infiltré**. |
| 🌐 **Piste 2 : Réseau Fondamental : De l'IP au Web** *(12 niveaux)* | Qu'est-ce qu'une adresse IP (IPv4 4 octets, IPv6, publique vs privée, localhost `127.0.0.1`), qu'est-ce qu'un port réseau (0-65535, 80 HTTP, 443 HTTPS, 22 SSH, 53 DNS, 3306 MySQL), test de connectivité `ping` et protocole ICMP, TTL et latence ms, fiabilité TCP vs vitesse UDP, poignée de main TCP à 3 voies (SYN, SYN-ACK, ACK), résolution de nom DNS et interrogations `dig` / `resolv.conf`, protocole HTTP sous le capot (verbes GET/POST, headers Host/User-Agent, body), codes de statut HTTP (200, 301, 401, 403, 404, 500), requêtes en ligne de commande avec `curl` (`-v`, `-I`, `robots.txt`), sockets en écoute avec `ss -tuln`, cartographie réseau avec `nmap` (`-sV`), **Boss Fight Cartographie & Reconnaissance Cible**. |
| 💉 **Piste 3 : SQL & Injections SQL (De Zéro à Pro)** *(13 niveaux)* | Modèle relationnel (tables, colonnes, lignes, clés primaires), interrogation avec `SELECT *` et colonnes spécifiques, filtrage précis avec la clause `WHERE` (`=`, `!=`, `>`, `<`, `LIKE`, `AND`, `OR`), manipulation avec `INSERT`, `UPDATE` (danger sans WHERE) et `DELETE`, comment le code backend assemble les requêtes, concaténation de chaînes vs requêtes préparées paramétrées, l'erreur fondatrice du guillemet simple `'`, bypass d'authentification classique `' OR 1=1 --`, variantes syntaxiques et commentaires (`#`, `/* */`, `' OR 'a'='a`), comptage des colonnes avec `ORDER BY`, attaque `UNION SELECT` et correspondance des types, cartographie du schéma via `sqlite_master` / `information_schema`, injections aveugles booléennes et temporelles (Blind SQLi), **Boss Fight Extraction Totale Base CRM Aegis**. |
| ⚡ **Piste 4 : Failles Web Client & Sessions (XSS / IDOR / JWT)** *(11 niveaux)* | Client (Navigateur) vs Serveur (Backend) (HTML, CSS, JavaScript exécuté côté client), outils DevTools F12 (Inspecteur DOM, Console JS, Onglet Réseau, Cookies), HTTP stateless et rôle des cookies de session (`Set-Cookie`, `Cookie:`), failles de contrôle d'accès IDOR (Insecure Direct Object Reference, incrément d'identifiants), principe du Cross-Site Scripting (XSS), XSS Réfléchie (Reflected XSS via paramètre URL), XSS Stockée (Stored XSS persistée en base), vol de session par JavaScript et protection par le drapeau `HttpOnly`, anatomie et décodage des jetons JWT (Header, Payload, Signature en Base64Url), exploitation de la vulnérabilité `alg: none`, **Boss Fight Chaîne d'Exploitation IDOR & Jeton JWT Compromis**. |
| 💀 **Piste 5 : Failles Serveur & Élévation Root (RCE / PrivEsc)** *(9 niveaux)* | Principe de l'injection de commandes système (RCE), métacaractères de concaténation shell (`;`, `&&`, `||`, `|`), contournement des filtres d'espaces via `${IFS}`, traversée de répertoire (Path Traversal / LFI) avec `../../../../etc/passwd`, principe et mise en œuvre du Reverse Shell (`nc -lvnp 4444`, flux sortant `/dev/tcp`), modèle des privilèges Linux et UID 0 (root), arme fatale des binaires SUID (`chmod u+s`, bit 's'), bible GTFOBins pour détourner des utilitaires légitimes (`find`, `vim`, `python3`), **Boss Fight Ultime Boot2Root : Conquête du Root Flag Sacré**. |

---

## 🛠️ Stack Technique

- **Backend :** Node.js natif (`node:http`, `node:sqlite`, `node:fs`, `node:path`, `node:https`), Zéro dépendance npm.
- **Lanceurs & Installateurs :** Exécutables Windows C# natifs (`CyberRange-PRO.exe`, `CyberRange-PRO-Setup.exe`).
- **Frontend :** HTML5, Tailwind CSS, Space Grotesk, JetBrains Mono, Inter, Canvas-Confetti, Web Audio API Synthétiseur.
- **Stockage :** Base SQLite locale (`cyberrange.db`).
- **CI/CD :** GitHub Actions automatisé sur Windows (`.github/workflows/release.yml`).

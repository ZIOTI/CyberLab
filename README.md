# ⚡ CyberRange PRO (Offensive & Defensive Cybersecurity Academy)

> **État réel et prérequis :** Node.js **24.x** est requis. Le catalogue comprend 134 exercices mêlant simulations, analyse d'artefacts et cibles intégrées ; démarrer une instance ne lance actuellement aucune VM ni aucun conteneur Docker. Les certificats sont des attestations locales personnelles. Le frontend utilise encore des ressources Internet. Les garanties et travaux restants sont détaillés dans [docs/HARDENING.md](docs/HARDENING.md), qui prévaut sur les anciennes descriptions ci-dessous.
>
> **Tests :** utiliser `npm test` ou `npm run test:all`. Les suites s'exécutent dans une installation temporaire et refusent l'exécution directe contre le profil de l'opérateur.

<p align="center">
  <img src="https://img.shields.io/badge/Architecture-100%25_Native_Node.js-10b981?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Native Node.js" />
  <img src="https://img.shields.io/badge/Dependencies-Zero_npm-6366f1?style=for-the-badge" alt="Zero npm dependencies" />
  <img src="https://img.shields.io/badge/Storage-Isolated_SQLite-0ea5e9?style=for-the-badge&logo=sqlite&logoColor=white" alt="Isolated SQLite" />
  <img src="https://img.shields.io/badge/Curriculum-66_Levels_%2B_134_Labs-f59e0b?style=for-the-badge" alt="66 Levels + 134 Labs" />
  <img src="https://img.shields.io/badge/Security-Hardened_CSP_%26_Anti--CSRF-ef4444?style=for-the-badge" alt="Hardened Platform" />
  <img src="https://img.shields.io/badge/License-MIT-8b5cf6?style=for-the-badge" alt="MIT License" />
</p>

---

## 🌐 Table des Matières / Table of Contents
- [🇫🇷 Français](#-français)
  - [Vision Globale](#-vision-globale)
  - [Architecture Zéro Dépendance](#-architecture-zéro-dépendance-npm)
  - [Les 5 Modules Pédagogiques](#-les-5-modules-pédagogiques-de-zéro-à-pro)
  - [Zone d'Entraînement TryHackMe](#-zone-dentraînement-style-tryhackme-134-labs)
  - [Campagne Saison 1 : Aegis & Chimera](#-campagne-saison-1--opération-aegis--chimera)
  - [Arbre de Compétences & Mode Dojo](#-arbre-de-compétences-diagnostic--mode-dojo)
  - [Gamification, Ligues & Certificats](#-gamification-ligues-duolingo--certificats-sécurisés)
  - [Démarrage & Installation Multiplateforme](#-démarrage--installation-multiplateforme)
  - [Éthique & Divulgation Responsable](#-éthique--divulgation-responsable)
- [🇬🇧 English](#-english)
  - [Global Vision](#-global-vision)
  - [Zero npm Architecture](#-zero-npm-backend-architecture)
  - [The 5 Core Learning Tracks](#-the-5-core-learning-tracks)
  - [TryHackMe-style Training Zone](#-tryhackme-style-training-zone-134-labs)
  - [Season 1 Campaign: Aegis & Chimera](#-season-1-campaign-operation-aegis--chimera)
  - [Skill Tree & Dojo Spaced Repetition](#-skill-tree-placement-diagnostic--dojo-mode)
  - [Duolingo-style Leagues & Certificates](#-duolingo-style-gamification-leagues--certificates)
  - [Multiplatform Quickstart](#-multiplatform-quickstart)
  - [Cyber Ethics & Security](#-cyber-ethics--security)

---

# 🇫🇷 Français

## 🌟 Vision Globale

**CyberRange PRO** est un laboratoire complet d'apprentissage et d'entraînement au hacking éthique, à la sécurité offensive (Red Team / Pentest) et à la cyberdéfense (Blue Team / SOC).

La plateforme opère une synthèse unique entre :
1. **L'ergonomie gamifiée et tactile de Duolingo :** Boutons 3D avec enfoncement physique, jauges néon de progression lumineuse, micro-cards d'apprentissage interactif, combos dynamiques x3/x5, confettis, séries quotidiennes (*streaks*), gestion de vies/cœurs et synthèse vocale audio Web Audio API.
2. **L'exigence technique et l'immersion d'un laboratoire professionnel :** Cibles applicatives vulnérables réelles (injections SQL, XSS, CSRF, IDOR, SSRF, XXE, SSTI, RCE, SUID GTFOBins, Active Directory, conteneurs Cloud, sécurité des LLM, rétro-ingénierie et forensics).

---

## ⚡ Architecture Zéro Dépendance npm

CyberRange PRO a été conçu selon une rigueur d'ingénierie stricte :
- **Backend 100% Natif :** Propulsé exclusivement par les modules intégrés de Node.js v24.x (`node:http`, `node:sqlite`, `node:crypto`, `node:fs`, `node:path`, `node:child_process`). Aucun répertoire `node_modules` n'est requis pour exécuter le serveur.
- **Double Base SQLite Isolée :**
  - `cyberrange.db` : Stockage hermétique de la progression du joueur (XP, niveaux validés, badges, série streak, quêtes, inventaire, certificats). **Préservation absolue : cette base n'est jamais écrasée lors des mises à jour.**
  - `targets.db` : Base de données isolée dédiée aux exercices d'injections SQL réalistes et aux cibles exploitables.
- **Sécurité et Durcissement Serveur (Phase 5) :**
  - **En-têtes HTTP de sécurité stricts :** Injection de `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin` et `Permissions-Policy`.
  - **Protection Anti-CSRF :** Distribution de jetons de session via `GET /api/csrf-token` et contrôle strict du header `X-CSRF-Token` sur toutes les opérations sensibles d'altération d'état (`/api/reset-profile`, `/api/apply-update`).
  - **Limiteur de requêtes en mémoire (Rate Limiting) :** Limiteur glissant sans dépendance pour bloquer le déni de service et le brute-force sur `/api/training/submit-flag`, `/api/verify-answer`, `/api/apply-update`, `/api/reset-profile`.
  - **Anti-Path Traversal strict :** Rejet formel des chemins avec `..` et confinement absolu dans `challenges/<cat>/<id>/files/`.
  - **Intégrité Cryptographique SHA-256 :** Validation mathématique de l'archive ZIP par `updater.js` avant toute extraction.

---

## 🗺️ Les 5 Modules Pédagogiques (De Zéro à Pro)

Le cursus linéaire de base comprend **66 niveaux granulaires** structurés en 5 grandes pistes :

| Piste | Contenu Pédagogique Clé |
| :--- | :--- |
| 🐧 **Piste 1 : Linux & Ligne de Commande** *(16 niveaux)* | Le terminal sans souris, syntaxe des commandes `$`, `whoami`, `pwd`, chemins absolus `/` vs relatifs `~`, `ls -la`, navigation `cd`, création `mkdir`/`touch`, copie et déplacement `cp`/`mv`, suppression définitive `rm`, lecture `cat`/`head`, pipe `|`, recherche avec `grep` et `find`, permissions octales `chmod`, gestion des processus `ps aux`, `top`, `kill`, **Boss Fight Audit Système Infiltré**. |
| 🌐 **Piste 2 : Réseau Fondamental : De l'IP au Web** *(12 niveaux)* | Adresses IPv4 et IPv6, ports réseau (80, 443, 22, 53, 3306), connectivité ICMP `ping`, TTL, TCP vs UDP, poignée de main à 3 voies (SYN-ACK), DNS `dig`, protocole HTTP sous le capot (verbes GET/POST, headers, codes de statut), requêtes avec `curl` (`robots.txt`), sockets `ss -tuln`, cartographie avec `nmap`, **Boss Fight Reconnaissance Réseau Cible**. |
| 💉 **Piste 3 : SQL & Injections SQL** *(13 niveaux)* | Modèle relationnel, interrogation `SELECT`, filtrage précis `WHERE`, manipulation `INSERT`/`UPDATE`/`DELETE`, concaténation de chaînes vs requêtes préparées, bypass d'authentification `' OR 1=1 --`, comptage de colonnes `ORDER BY`, exploitation `UNION SELECT`, cartographie du schéma `sqlite_master`, Blind SQLi booléenne et temporelle, **Boss Fight Extraction Totale Base CRM**. |
| ⚡ **Piste 4 : Failles Web Client & Sessions** *(11 niveaux)* | Client vs Serveur, DevTools F12 (DOM, Console, Réseau, Cookies), HTTP stateless et drapeaux de cookies (`HttpOnly`, `SameSite`), failles de contrôle d'accès IDOR, Cross-Site Scripting (XSS Réfléchie & XSS Stockée), anatomie et décodage des jetons JWT, exploitation de l'algorithme `alg: none`, **Boss Fight Chaîne d'Exploitation IDOR & JWT**. |
| 💀 **Piste 5 : Failles Serveur & Élévation Root** *(9 niveaux)* | Injection de commandes système (RCE), métacaractères (`;`, `&&`, `||`, `|`), contournement de filtres d'espaces via `${IFS}`, traversée de répertoire (LFI/Path Traversal), Reverse Shell (`nc`, `/dev/tcp`), modèle des privilèges UID 0, binaires SUID (`chmod u+s`), exploitation de la bible GTFOBins, **Boss Fight Ultime Boot2Root**. |

---

## 🎯 Zone d'Entraînement Style TryHackMe (134 Labs)

En complément du cursus linéaire, CyberRange PRO propose une **Zone d'Entraînement Réaliste** inspirée des meilleurs standards de **TryHackMe** et **HackTheBox** :
- **134 Défis Professionnels Répartis en Catégories :** Web (35 challenges), Linux (15), Cryptographie (12), Forensics (12), Reverse Engineering (12), Pwn & Binaires (8), Réseau (10), Active Directory (8), Cloud & Docker (8), Sécurité IA & LLM (6), Éthique & Droit (4), Wi-Fi (2), Phishing & OSINT (2).
- **CyberTerminal Intégré :** Console Linux interactive sans aucune dépendance, supportant plus de 30 commandes POSIX, tuyaux Unix, redirections et raccourcis tactiques 1-clic (`getcap`, `python setuid`, `sudo -l`, `suid find`, `cat flag`).
- **Navigateur Cible Split-Screen :** Visualisation et interaction en direct avec les applications vulnérables sans configuration VPN complexe.
- **Téléchargement Sécurisé d'Artefacts :** Fichiers PCAP réels, captures de paquets, exécutables d'entraînement, fichiers EML et images disques.

---

## 🛡️ Campagne Saison 1 : Opération Aegis & Chimera

Une campagne scénarisée d'entreprise simulant l'assaut et la défense d'une infrastructure corporate compromise :
- **Acte I : Gatekeeper (Périmètre Externe)** — Reconnaissance DNS, audit HTTP et exploitation d'une injection de commandes avec contournement WAF.
- **Acte II : DataVault (Base de Données Centrale)** — Franchissement de pare-feu applicatif, exploitation SQLi multi-tables et extraction de données sensibles.
- **Acte III : Citadel (Cœur du Système)** — Élévation de privilèges locale root via détournement de binaires SUID GTFOBins.
- **Boucle Red Team / Blue Team :** Après compromission offensive, l'opérateur bascule côté défense pour rédiger des règles de détection SOC (Sigma/Suricata) et valider la remédiation du code vulnérable.
- **Double Jauge Attaque / Défense :** Visualisation synchronisée de la posture globale de cybersécurité.

---

## 🌳 Arbre de Compétences, Diagnostic & Mode Dojo

- **Ontologie de Compétences (25 nœuds spécialisés) :** Arborescence interactive avec calcul automatique des prérequis et des scores de maîtrise (Fondations, Offensif, Défensif, Spécialisations).
- **Diagnostic de Placement Automatisé :** Évaluation initiale profilant instantanément les forces et faiblesses du joueur.
- **Mode Dojo (Répétition Espacée) :** Système d'ancrage mémoriel ciblant automatiquement les concepts ayant généré des erreurs pour garantir une maîtrise durable.

---

## 🏆 Gamification, Ligues Duolingo & Certificats Sécurisés

- **Ligues Compétitives sur 5 Niveaux :** Division Bronze, Argent, Or, Platine et Diamant avec promotion hebdomadaire.
- **Rétention & Défis Quotidiens :** Quêtes journalières procédurales, protection de série avec *Streak Freeze* automatique et boutique de gemmes.
- **Certificats Cryptographiques Infalsifiables :** Génération d'attestations de réussite scellées par HMAC-SHA256 avec code de vérification public infalsifiable.
- **Export Portable du Profil Opérateur :** Sauvegarde et partage de profil au format JSON standardisé avec somme de contrôle d'intégrité.

---

## 🚀 Démarrage & Installation Multiplateforme

### 🪟 Windows (Installateur ou Portable)
1. Rendez-vous sur la page des **[Releases GitHub](https://github.com/ZIOTI/CyberLab/releases)**.
2. Téléchargez **`CyberRange-PRO-Setup.exe`** (installation 1-clic avec raccourci sur le Bureau) ou **`CyberRange-PRO.zip`** (version portable).
3. Lancez le jeu via le raccourci ou en exécutant `start.bat`.

### 🐧 Linux & 🍎 macOS
1. Assurez-vous que **Node.js (v24.x)** est installé (`node -v`).
2. Clonez le dépôt et rendez les scripts exécutables :
   ```bash
   git clone https://github.com/ZIOTI/CyberLab.git
   cd CyberLab
   chmod +x start.sh update.sh
   ./start.sh
   ```
3. Le serveur démarre en arrière-plan et ouvre automatiquement votre navigateur sur `http://127.0.0.1:3333`.

### 🔄 Mise à Jour en 1 Clic
- **Windows :** Cliquez sur le bouton de mise à jour dans l'interface ou lancez `update.bat`.
- **Linux / macOS :** Exécutez `./update.sh`.
- Vos niveaux, statistiques, badges et clés SQLite sont **garantis 100% préservés**.

---

## ⚖️ Éthique & Divulgation Responsable

Ce logiciel est distribué sous licence open source **MIT** à des fins strictement éducatives et de recherche. L'utilisation des techniques offensives présentées sur des infrastructures sans autorisation écrite préalable est illégale. Consultez [SECURITY.md](SECURITY.md) pour notre politique de divulgation responsable et [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) pour la charte éthique.

---

# 🇬🇧 English

## 🌟 Global Vision

**CyberRange PRO** is a comprehensive, standalone ethical hacking, offensive cybersecurity (Red Team / Pentesting), and defensive security (Blue Team / SOC) laboratory.

It bridges two distinct paradigms:
1. **The tactile, gamified UX of Duolingo:** 3D mechanical press buttons, neon progress rails, micro-lesson cards, dynamic x3/x5 combo streaks, confetti celebration, hearts/lives economy, and a synthesized Web Audio API soundscape.
2. **Professional-grade technical rigor:** Live, locally hosted vulnerable target applications (SQL Injections, Reflected/Stored XSS, CSRF, IDOR, SSRF, XXE, SSTI, RCE, SUID GTFOBins, Active Directory, Cloud escapes, LLM security, reverse engineering, and forensics).

---

## ⚡ Zero npm Backend Architecture

CyberRange PRO adheres to a zero-bloat design philosophy:
- **100% Native Node.js Backend:** Built exclusively using Node.js v24.x built-ins (`node:http`, `node:sqlite`, `node:crypto`, `node:fs`, `node:path`, `node:child_process`). No external npm packages required.
- **Hermetically Isolated Dual SQLite Databases:**
  - `cyberrange.db`: Stores operator state (XP, completed levels, badges, streak, quests, inventory, certificates). **Guaranteed retention: never overwritten across software updates.**
  - `targets.db`: Isolated database for vulnerable training targets and realistic SQL injection scenarios.
- **Enterprise Platform Hardening (Phase 5):**
  - **Strict HTTP Security Headers:** Global injection of `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, and `Permissions-Policy`.
  - **Session-Based Anti-CSRF Protection:** Cryptographic tokens delivered via `GET /api/csrf-token` with mandatory `X-CSRF-Token` header verification on state-altering endpoints (`/api/reset-profile`, `/api/apply-update`).
  - **In-Memory Rate Limiting:** External dependency-free sliding window limiter preventing brute-force and DoS on sensitive endpoints (`/api/training/submit-flag`, `/api/verify-answer`, `/api/apply-update`, `/api/reset-profile`).
  - **Strict Anti-Path Traversal:** Systematic rejection of `..` segments with absolute directory confinement under `challenges/<cat>/<id>/files/`.
  - **Cryptographic SHA-256 Integrity:** Mathematical checksum validation in `updater.js` before executing any file extraction.

---

## 🗺️ The 5 Core Learning Tracks

A structured 66-level linear curriculum guiding operators from complete novice to advanced practitioner:

1. 🐧 **Track 1: Linux & Command Line Foundations** (16 levels) — Shell syntax, navigation, file manipulation, pipelines, text searching with `grep` and `find`, permissions, and process management.
2. 🌐 **Track 2: Fundamental Networking: From IP to HTTP** (12 levels) — IPv4/IPv6, port architectures, ICMP `ping`, TCP 3-way handshakes, DNS resolution, HTTP protocol mechanics, and `nmap` reconnaissance.
3. 💉 **Track 3: SQL & SQL Injections** (13 levels) — Relational models, queries, string concatenation vulnerabilities, authentication bypasses, `UNION SELECT` extraction, schema mapping, and Blind SQLi.
4. ⚡ **Track 4: Client-Side Web Vulnerabilities & Sessions** (11 levels) — Browser DevTools, cookies, IDOR access controls, Reflected and Stored XSS, session hijacking, and JWT `alg: none` bypasses.
5. 💀 **Track 5: Server-Side Exploitation & Root PrivEsc** (9 levels) — OS command injections (RCE), space filter bypasses via `${IFS}`, Path Traversal / LFI, Reverse Shells, SUID binaries, and GTFOBins exploitation.

---

## 🎯 TryHackMe-style Training Zone (134 Labs)

In addition to the linear track, the platform hosts **134 realistic challenge labs** across all cybersecurity domains:
- **Comprehensive Categories:** Web (35), Linux (15), Cryptography (12), Forensics (12), Reverse Engineering (12), Pwn & Binary Exploitation (8), Network (10), Active Directory (8), Cloud & Docker (8), AI / LLM Security (6), Ethics & Law (4), Wi-Fi (2), and Phishing & OSINT (2).
- **Embedded CyberTerminal:** Built-in web terminal supporting 30+ POSIX utilities, Unix pipes, redirections, and tactical 1-click shortcuts.
- **Split-Screen Web Browser:** Live interaction with target applications without needing complex virtual machine or VPN configurations.
- **Authentic Artifacts:** Downloadable PCAP captures, memory dumps, challenge binaries, and email headers.

---

## 🛡️ Season 1 Campaign: Operation Aegis & Chimera

A realistic, multi-act corporate enterprise incident simulation:
- **Act I: Gatekeeper (Perimeter Breach)** — External reconnaissance and WAF-bypassing command injection.
- **Act II: DataVault (Database Exfiltration)** — Advanced SQL injection to compromise corporate customer records.
- **Act III: Citadel (Internal Privilege Escalation)** — SUID GTFOBins hijacking to seize UID 0 root control.
- **Dual Attack / Defense Loop:** After attacking each target, operators switch to Blue Team mode to author SOC detection rules (Sigma/Suricata) and verify code remediations.

---

## 🌳 Skill Tree, Placement Diagnostic & Dojo Mode

- **25-Node Ontological Skill Tree:** Visual progression with automated prerequisite gating and mastery scoring.
- **Automated Placement Diagnostic:** Pre-assessment test profiling operator competencies to recommend optimal learning paths.
- **Dojo Spaced Repetition Mode:** Algorithmic review engine that surfaces past mistakes for reinforced retention.

---

## 🏆 Duolingo-style Gamification, Leagues & Certificates

- **5-Tier Competitive Leagues:** Bronze, Silver, Gold, Platinum, and Diamond divisions with weekly promotion mechanics.
- **Retention Mechanics:** Daily procedural quests, streak protection via *Streak Freeze*, and gem marketplace.
- **Tamper-Proof Cryptographic Certificates:** Verifiable certificates sealed with HMAC-SHA256 signatures.
- **Portable Skill Profile:** One-click JSON profile export with integrity checksum for talent portability.

---

## 🚀 Multiplatform Quickstart

### Windows
- Grab `CyberRange-PRO-Setup.exe` from [GitHub Releases](https://github.com/ZIOTI/CyberLab/releases) or unpack `CyberRange-PRO.zip` and run `start.bat`.

### Linux & macOS
```bash
git clone https://github.com/ZIOTI/CyberLab.git
cd CyberLab
chmod +x start.sh update.sh
./start.sh
```
The server will start in the background and automatically open `http://127.0.0.1:3333` in your default browser.

---

## 📜 Contributing & License

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) and our [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
CyberRange PRO is licensed under the **[MIT License](LICENSE)**.

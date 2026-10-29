# ⚡ CyberRange PRO (Offensive Cybersecurity & CTF Lab)

**CyberRange PRO** est une plateforme d'entraînement et d'apprentissage au hacking éthique, à la sécurité offensive (Red Team / Pentest) et aux CTF. Elle fusionne l'ergonomie gamifiée et tactile de **Duolingo** (boutons 3D avec enfoncement physique, jauges de progression lumineuses, combos x3/x5, confettis, séries et vies) avec l'exigence technique et l'immersion sans concession d'un laboratoire professionnel.

100% autonome, confiné en local et sans aucune dépendance npm externe (Node.js natif + `node:sqlite`).

---

## 🚀 Démarrage en 1 Clic sur Windows (Pour tes potes / joueurs)

1. **Télécharge** la dernière version dans l'onglet **[Releases](https://github.com/Zioti/CyberLab/releases)** (`CyberRange-PRO.zip`).
2. **Dézippe** le dossier n'importe où sur ton PC.
3. Double-clique simplement sur :
```text
start.bat
```
Le serveur local démarre automatiquement sur **`http://localhost:3333`** et ouvre ton navigateur.

> 🛡️ **Rétention Garantie des Données :**
> Ta progression (XP, niveaux complétés, badges débloqués, série streak, vies restantes) est automatiquement stockée dans ta base locale `cyberrange.db`. Même en mettant à jour le jeu, **ta progression n'est JAMAIS écrasée ni perdue**.

---

## 🔄 Système d'Auto-Update Automatique & Obligatoire

Lorsqu'une nouvelle version de CyberRange PRO est publiée sur GitHub :
1. Dès qu'un joueur lance le jeu ou recharge la page, une **modale d'alerte critique verrouillée** s'affiche immédiatement.
2. L'accès aux défis est suspendu tant que la version n'est pas synchronisée afin de garantir la cohérence des cibles, des flags et du curriculum.
3. Le joueur clique sur **« 🚀 Télécharger & Mettre à Jour Automatiquement »** :
   - Le moteur télécharge la dernière archive depuis GitHub Releases.
   - Il sauvegarde automatiquement `cyberrange.db` en `.bak`.
   - Il remplace les fichiers de code et redémarre le serveur local de manière transparente.
   - Les niveaux, scores et stats sont conservés à 100%.
4. Alternativement, le script `update.bat` permet de mettre à jour le laboratoire en un double-clic sans ouvrir le navigateur.

---

## 👨‍💻 Comment Publier une Nouvelle Mise à Jour (Pour toi)

Pour publier une nouvelle version et la déployer automatiquement auprès de tous tes joueurs :

### Méthode 1 : En 1 Clic via `release.bat` (Recommandé)
Lance simplement :
```text
release.bat
```
L'assistant te demandera le numéro de version (ex: `1.0.1`) et tes notes de mise à jour. Il va automatiquement :
1. Exécuter la suite de 12 tests de validation pour s'assurer que tout fonctionne sans bug.
2. Mettre à jour `package.json`.
3. Créer le commit et le tag Git (`v1.0.1`).
4. Pousser vers GitHub (`git push origin main --tags`).
5. **GitHub Actions** prend le relais, fabrique l'archive ZIP propre et crée la Release GitHub automatiquement !

### Méthode 2 : En ligne de commande
```bash
git add .
git commit -m "feat: ajout de 5 nouveaux défis web"
git tag -a v1.0.1 -m "Version 1.0.1 : correctifs et nouveaux CTF"
git push origin main --tags
```

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
- **Frontend :** HTML5, Tailwind CSS, Space Grotesk, JetBrains Mono, Inter, Canvas-Confetti, Web Audio API Synthétiseur.
- **Stockage :** Base SQLite locale (`cyberrange.db`).
- **CI/CD :** GitHub Actions automatisé (`.github/workflows/release.yml`).

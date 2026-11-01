# Solution Détaillée // CyberCorp ERP Supply Chain

## 1. Analyse de l'application
L'ERP comprend :
- `/targets/training/real-03-cybercorp/` (Tableau de bord)
- `/targets/training/real-03-cybercorp/inventory` (Inventaire)
- `/targets/training/real-03-cybercorp/firmware-upload` (Upload firmware)
- `/targets/training/real-03-cybercorp/system-diagnostics` (Diagnostics système)

## 2. Exploitation de l'upload
En envoyant un payload nommé `update.php.bin` avec `Content-Type: application/octet-stream`, le serveur enregistre le fichier et permet son exécution via le serveur web, retournant le flag :
`CTF{REAL_CYBERCORP_SUPPLY_CHAIN_RCE}`.

## 3. Remédiation & Protection
- Renommer les fichiers téléversés avec un identifiant aléatoire (UUID).
- Servir les fichiers statiques depuis un domaine dédié sans exécution de scripts (ex: S3 sans droits d'exécution).
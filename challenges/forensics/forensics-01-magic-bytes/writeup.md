# Writeup : Resurrected Document (forensics-01-magic-bytes)

## 1. Contexte & Magic Bytes
Les systèmes d'exploitation et les visualiseurs de fichiers ne se fient pas uniquement à l'extension d'un fichier (ex: `.png`, `.pdf`) pour déterminer son type, mais examinent les premiers octets du fichier appelés **Magic Bytes** ou signatures de fichiers (RFC 2083 pour le format PNG).
Pour un fichier PNG, la signature fixe est :
`\x89\x50\x4E\x47\x0D\x0A\x1A\x0A` (`.PNG\r\n\x1a\n`)

Si ces octets sont altérés ou mis à zéro par un malware ou une corruption disque, les logiciels signalent une erreur : *"Format de fichier non reconnu"*.

## 2. Exploitation Pas à Pas

### Étape 1 : Inspection du fichier corrompu
```bash
xxd corrupted_evidence.bin | head -n 2
```
**Sortie :**
```text
00000000: 0000 0000 0000 0000 0000 000d 4948 4452  ............IHDR
```
On constate immédiatement :
* Les 8 premiers octets sont `00 00 00 00 00 00 00 00`.
* Juste après se trouve `00 00 00 0d 49 48 44 52` : c'est le chunk standard **IHDR** (longueur 13 octets, nom IHDR) caractéristique d'un fichier PNG !

### Étape 2 : Restauration des octets magiques
Avec un éditeur hexadécimal (comme `hexedit`, Bless ou CyberChef), ou en ligne de commande :
```bash
printf '\x89\x50\x4e\x47\x0d\x0a\x1a\x0a' | dd conv=notrunc bs=1 count=8 of=repaired.png
```

### Étape 3 : Lecture de la preuve et du flag
Ouvre le fichier restauré ou lance la commande `strings` :
```bash
strings corrupted_evidence.bin | grep "FLAG"
```
**Résultat :**
```text
FLAG=CYBERLAB{MAGIC_BYTES_PNG_HEADER_RESTORED_SUCCESSFULLY}
NOTE=Preuve restaurée avec succès.
```

## 3. Remédiation
* Mettre en place des sauvegardes immuables (WORM - Write Once Read Many) pour protéger l'intégrité des pièces à conviction lors d'investigations médico-légales.
* Calculer et consigner les empreintes cryptographiques (SHA-256) dès la saisie pour détecter toute altération d'intégrité.

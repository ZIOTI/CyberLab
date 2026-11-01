# Solution Détaillée // Kerberoasting & Event 4769 Audit

## 1. Mécanisme d'attaque
L'attaquant demande un TGS avec `GetUserSPNs.py`. Le contrôleur de domaine émet l'Event ID 4769 avec `TicketEncryptionType: 0x17`.

## 2. Détection
La règle SIEM détecte une volumétrie anormale de demandes TGS avec chiffrement RC4 en un court intervalle de temps :
`CTF{PURPLE_KERBEROAST_RC4_ANOMALY_HUNTED}`.

## 3. Mesures correctives
- Remplacer les comptes de service traditionnels par des comptes de service gérés de groupe (gMSA).
- Désactiver le support du chiffrement RC4 au niveau du domaine Kerberos.
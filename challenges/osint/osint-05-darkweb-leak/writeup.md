# Solution Détaillée // Dark Web Breach Triage

## 1. Analyse du dump
Un filtrage ciblé sur les privilèges révèle l'administrateur compromis :
```bash
grep "Domain-Admin" leak_dump.txt
```

## 2. Déchiffrement du hash
Le hash `8846f7eaee8fb117ad06bdd830b7586c` correspond à `Password123!`.

## 3. Remédiation & Protection
- Révoquer immédiatement les sessions actives et forcer la réinitialisation du mot de passe.
- Déployer l'authentification multi-facteurs résistante au phishing (FIDO2 / WebAuthn).
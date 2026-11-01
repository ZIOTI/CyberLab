# Solution Détaillée // Digital Footprint & Pseudonym Correlation

## 1. Méthodologie OSINT
Le pseudonyme `v01d_ph4nt0m` est renseigné dans l'outil d'investigation. L'analyse des plateformes de versioning révèle un compte actif.

## 2. Extraction des métadonnées
L'inspection du log Git fournit l'adresse e-mail réelle non masquée :
```bash
git log -n 1 --pretty=format:"%ae"
# phantom_ops_2026@proton.me
```

## 3. Section Défense & Mesures Protectrices
- Nettoyer l'historique des commits avec `git filter-repo` ou BFG Repo-Cleaner avant publication.
- Activer l'option GitHub "Keep my email addresses private" et configurer la signature GPG des commits.
# Guide du Workflow de Release Continue — CyberLab / CyberRange PRO

Ce document formalise la procédure standard de publication de release à chaque modification du projet CyberLab.

---

## 🎯 Objectif
Permettre à chaque utilisateur et contributeur de bénéficier instantanément de la dernière version prête à l'emploi (installeur `.exe`, archive portable `.zip`, intégrité cryptographique SHA-256) dès qu'un correctif ou une amélioration est apporté.

---

## 🛠️ Étapes Standardisées

### 1. Versioning SemVer dans `package.json`
Chaque modification incrémente la version :
- Correctif mineur / UI : patch (`1.4.0` -> `1.4.1`)
- Nouveau lot de challenges / fonctionnalité : minor (`1.4.x` -> `1.5.0`)

### 2. Rédaction des Notes de Version
Créer `docs/RELEASE-vX.Y.Z.md` comprenant :
- Résumé des nouveautés et correctifs.
- Instructions de démarrage et de mise à jour.
- Détails techniques des modifications.

### 3. Exécution des Tests
```bash
npm test
# ou suite complète :
npm run test:all
```

### 4. Commit et Push
```bash
git add .
git commit -m "chore(release): bump version to vX.Y.Z and publish release"
git push origin main
```

### 5. Tag et Déclenchement du Pipeline
```bash
git tag -a vX.Y.Z -m "CyberRange PRO vX.Y.Z"
git push origin vX.Y.Z
```

### 6. Pipeline CI/CD GitHub Actions
Le workflow `.github/workflows/release.yml` effectue automatiquement :
- La vérification des tests sous Windows.
- La compilation de `CyberRange-PRO.exe` et `CyberRange-PRO-Setup.exe`.
- La création de `CyberRange-PRO.zip` et `CyberRange-PRO-vX.Y.Z.zip`.
- Le calcul des hashes SHA-256 dans `dist/checksums.txt`.
- La publication de la Release officielle sur GitHub avec les notes et les binaires attachés.

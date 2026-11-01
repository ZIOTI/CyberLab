# Instructions & Règles d'Engagement de l'Agent — CyberLab / CyberRange PRO

> [!IMPORTANT]
> **RÈGLE SYSTÉMATIQUE : RELEASE OBLIGATOIRE À CHAQUE MODIFICATION**
> Conformément à la consigne explicite de l'utilisateur, toute modification de code, correction de bug, amélioration visuelle, ajout de challenge ou évolution de fonctionnalité **DOIT IMPÉRATIVEMENT** aboutir à une nouvelle **Release officielle GitHub** publiée et taguée.

---

## Protocole de Release Automatique

À chaque fin d'intervention :

1. **Incrémentation de Version (`package.json`)** :
   - Déterminer la nouvelle version selon SemVer (`1.4.1`, `1.4.2`, etc.).
   - Mettre à jour le champ `"version": "X.Y.Z"` dans `package.json`.

2. **Rédaction des Notes de Version (`docs/RELEASE-vX.Y.Z.md`)** :
   - Créer le fichier `docs/RELEASE-vX.Y.Z.md`.
   - Décrire les améliorations apportées, les corrections de bugs, l'accessibilité et les nouveaux contenus.

3. **Validation Technique & Tests** :
   - Lancer la suite de validation :
     ```bash
     npm test
     ```
   - Vérifier que 100% des suites passent avec succès avant tout commit.

4. **Synchronisation Git & Tagging** :
   - Commiter sur la branche principale :
     ```bash
     git add .
     git commit -m "chore(release): publish vX.Y.Z"
     git push origin main
     ```
   - Créer le tag Git annoté :
     ```bash
     git tag -a vX.Y.Z -m "CyberRange PRO vX.Y.Z // Titre de la release"
     git push origin vX.Y.Z
     ```

5. **Publication Automatique** :
   - Le workflow GitHub Actions `.github/workflows/release.yml` est déclenché par le push du tag `v*`.
   - Il compile les `.exe` Windows, prépare l'archive ZIP portable autonome, génère les empreintes SHA-256 (`checksums.txt`) et crée la GitHub Release officielle avec les fichiers binaires téléchargeables.

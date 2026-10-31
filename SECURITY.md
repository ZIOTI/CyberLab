# 🛡️ Politique de Sécurité & Divulgation Responsable (SECURITY.md)

La sécurité des utilisateurs et des plateformes hôtes exécutant **CyberRange PRO** est notre priorité absolue.

---

## 📌 Périmètre : Cibles Vulnérables vs Sécurité Plateforme

Dans le cadre d'un laboratoire d'entraînement offensif :
- **Composants Volontairement Vulnérables (Hors Scope Sécurité Plateforme) :**
  Les applications d'exercices situées sous `challenges/`, les tables d'injections dans `targets.db`, et les scripts de simulation sont délibérément vulnérables (XSS, SQLi, CSRF cible, RCE bac à sable). Ces failles sont documentées et requises pour l'apprentissage.
- **Sécurité de la Plateforme Hôte (En Scope Sécurité) :**
  Tout comportement permettant à un attaquant d'échapper au bac à sable local, de compromettre le système d'exploitation de l'opérateur, de voler des données personnelles ou d'exécuter du code arbitraire non confiné via `server.js`, `updater.js`, ou les lanceurs natifs constitue une vulnérabilité critique.

---

## 🔒 Mécanismes de Protection Implémentés (Phase 5)

La plateforme CyberRange PRO dispose d'un blindage en profondeur :
1. **En-têtes HTTP de sécurité stricts :**
   - `Content-Security-Policy` avec isolation des contextes d'exécution.
   - `X-Content-Type-Options: nosniff` (anti-MIME sniffing).
   - `X-Frame-Options: SAMEORIGIN` (anti-clickjacking).
   - `Referrer-Policy: strict-origin-when-cross-origin`.
   - `Permissions-Policy: camera=(), microphone=(), geolocation=()`.
2. **Protection Anti-CSRF par jetons de session :**
   - Endpoint `GET /api/csrf-token` et contrôle cryptographique obligatoire du header `X-CSRF-Token` sur toutes les opérations sensibles d'altération d'état (`/api/reset-profile`, `/api/apply-update`).
3. **Limiteur de requêtes en mémoire (Rate Limiting) :**
   - Protection sans dépendance externe contre les attaques par force brute et par déni de service sur `/api/training/submit-flag`, `/api/verify-answer`, `/api/apply-update`, `/api/reset-profile`.
4. **Anti-Path Traversal strict & Confinement :**
   - Rejet formel des chemins contenant `..` et confinement absolu des téléchargements d'artefacts dans `challenges/<cat>/<id>/files/`.
5. **Contrôle d'intégrité SHA-256 de l'Auto-Updater :**
   - Vérification mathématique de l'empreinte SHA-256 de chaque archive de mise à jour avant toute extraction sur le système de fichiers.

---

## 🚨 Signalement d'une Vulnérabilité

Si vous découvrez une vulnérabilité de sécurité sur la plateforme CyberRange PRO :
1. **Ne créez PAS d'Issue publique GitHub** contenant des détails exploitables.
2. Envoyez un rapport détaillé par email ou via la fonctionnalité privée **GitHub Private Vulnerability Reporting** sur le dépôt :
   - Dépôt : `https://github.com/ZIOTI/CyberLab/security/advisories`
3. Incluez dans votre signalement :
   - Description de la faille et composant affecté.
   - Preuve de concept (PoC) reproductible.
   - Impact potentiel sur la machine hôte.
   - Recommandations de remédiation si vous en avez.

Nous nous engageons à accuser réception sous **48 heures** et à publier un correctif dans les plus brefs délais avec attribution et remerciements dans les notes de version.

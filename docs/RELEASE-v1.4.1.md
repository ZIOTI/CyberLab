# CyberRange PRO v1.4.1 // NEXUS CYBERLAB

## 🎯 Nouveautés & Correctifs de la Version v1.4.1

Cette version apporte des améliorations clés sur la clarté opérationnelle des rooms de challenge, la prise en main des missions OSINT et l'automatisation du cycle de release continue.

### 📍 Encart « Point de Départ » & Correction du Briefing
- **Encart de Démarrage TryHackMe-Style** : Chaque room affiche désormais en tête de briefing un encart clair identifiant :
  - **L'Organisation Cible** (ex: *Financial Infrastructure Reconnaissance*).
  - **Le Point d'Entrée / Domaine de Départ** (ex: `finbank.lab` pour l'OSINT, IP ou URL directe pour le Web).
  - **Les Règles d'Engagement & Objectifs**.
- **Correction d'Affichage du Briefing** : Résolution du problème d'affichage qui rendait la section de briefing vide sur certains challenges. L'histoire et le scénario complet sont désormais systématiquement visibles.

### 🔎 Refonte des Missions OSINT & Artefact Réel
- **Cible OSINT Explicite** : Pour les challenges de renseignement sur sources ouvertes, la Target Box s'adapte automatiquement : elle affiche le domaine cible à cartographier plutôt qu'une adresse IP invitant à un faux scan réseau.
- **Artefact Téléchargeable (`finbank_certificates_dump.txt`)** : Le challenge *Certificate Transparency Subdomain Cartography* (`osint-03-domain-recon`) intègre un dump authentique de logs crt.sh téléchargeable directement. Les joueurs peuvent inspecter les données brutes et mener leur enquête par eux-mêmes, sans avoir besoin de recourir aux indices.

### ⚙️ Automatisation CI/CD & Pipeline de Release
- **Release Dynamique** : Le workflow GitHub Actions (`.github/workflows/release.yml`) sélectionne désormais dynamiquement la note de version correspondant au tag poussé (`docs/RELEASE-vX.Y.Z.md`).
- **Protocole Continu (`AGENTS.md`)** : Formalisation de la règle imposant la publication automatique d'une release GitHub à chaque lot de modifications.

---

## 📥 Démarrage Rapide

- **Installation 1-clic** : Télécharger `CyberRange-PRO-Setup.exe`.
- **Version Portable** : Télécharger et extraire `CyberRange-PRO.zip` ou `CyberRange-PRO-v1.4.1.zip`.
- **Lancement en développement** :
  ```bash
  npm start
  ```
  Accédez à l'interface sur `http://localhost:3000`.

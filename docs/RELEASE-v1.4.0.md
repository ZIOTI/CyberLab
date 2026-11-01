# CyberRange PRO v1.4.0 // NEXUS CYBERLAB

## 🚀 Nouveautés Majeures & Refonte TryHackMe-Tier

Cette version **v1.4.0** marque une évolution majeure de CyberLab vers une expérience d'entraînement immersive, haut de gamme et inspirée des meilleures plateformes mondiales comme TryHackMe.

### 🎨 Nouveau Design & Expérience Utilisateur Monopage
- **Structure de Room Monopage** : Remplacement des onglets imbriqués par une page verticale continue et fluide (En-tête sticky, Live Target Box, Briefing opérationnel, Tâches séquentielles, Section Défense et Solution).
- **Nouvelle Identité de Marque** : Intégration du logo officiel vectoriel SVG **NEXUS CYBERLAB** et du slogan *« Plateforme d'Entraînement Cyber Haute Fidélité // Attaque, Défense & Labs Réalistes »*.
- **Live Target Box Réseau** : Contrôle immédiat de l'adresse IP cible avec bouton de copie, minuterie d'expiration, commandes d'instance (+15m, reset, stop), accès web direct et tiroir terminal rétractable.

### 🌐 Extension Massive du Catalogue (148 Labs & 532 Tâches)
- **4 Real Attack Labs Multi-Pages** :
  - `real-01-fintech-gateway` : Passerelle de paiement PayShield (Reconnaissance, contournement d'authentification, SQLi et exfiltration de clés API).
  - `real-02-medhealth-ehr` : Système hospitalier de dossiers médicaux électroniques (Vulnérabilités IDOR, fuite de données de santé et export PDF confidentiel).
  - `real-03-cybercorp-erp` : ERP d'entreprise CyberCorp (Upload non restreint, déploiement de Webshell et exécution de commandes RCE).
  - `real-04-aerospace-telemetry` : Système de contrôle de télémétrie spatiale (Injections de modèles SSTI et injection de commandes système).
- **Filière Red Team & Attaque Réelle** : Exploitation de vulnérabilités noyau (Dirty Pipe CVE-2022-0847) et abus de Linux Capabilities (`cap_setuid`).
- **Filière Purple Team & Déception** : Déploiement de tokens canaris (Honeytokens), simulation de vol d'identifiants LSASS et détection Sysmon/EDR, détection de Kerberoasting et règles d'isolation C2.
- **Filière OSINT & Reconnaissance** : Analyse d'empreinte numérique multi-réseaux, investigation de fuites dark web, traçabilité de flux maritimes/aériens (AIS/ADS-B) et cartographie DNS d'entreprise.
- **Section Défensive « Comment s'en protéger »** : Chaque challenge inclut désormais une analyse de cause racine, des recommandations de durcissement et des règles de détection SIEM.

### 🛡️ Moteur de Flags & Accessibilité
- **Indices 100% Gratuits** : Suppression totale des coûts en gemmes ou monnaie virtuelle pour les indices.
- **Validation Souple & Robuste des Flags** : Tolérance automatique aux espaces superflus (`trim()`), insensibilité contrôlée à la casse, format affiché en clair (`CTF{...}`) et messages d'erreur explicites.
- **Validation Automatisée** : 100% des 148 challenges et 532 flags vérifiés avec succès par les bancs de tests automatisés.

---

## 📥 Installation & Démarrage

- **Windows** : Télécharger **CyberRange-PRO-Setup.exe** pour l'installation en 1-clic ou extraire **CyberRange-PRO.zip** pour la version portable autonome.
- **Prérequis** : **Node.js 24.x** (ou supérieur).
- **Démarrage rapide** :
  ```bash
  npm start
  ```
  Ouvrir votre navigateur sur `http://localhost:3000`.
- **Intégrité cryptographique** : Les empreintes SHA-256 de chaque package sont répertoriées dans `checksums.txt`.

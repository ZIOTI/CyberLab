# CyberRange PRO v1.3.2

## Installation

- Windows : télécharger **CyberRange-PRO-Setup.exe** ou extraire **CyberRange-PRO.zip** pour la version portable.
- **Node.js 24.x** est requis. Installer cette version avant de lancer l'application.
- Sauvegarder le dossier existant avant une mise à jour manuelle, notamment `cyberrange.db` et, après cette version, `.certificate-key`. Ne pas supprimer ces fichiers.
- Les empreintes SHA-256 des téléchargements figurent dans `checksums.txt`.

## Corrections

- Les tests utilisent une installation temporaire et un port dédié ; ils refusent l'exécution directe contre le profil existant.
- Les API de gestion refusent les origines étrangères et les valeurs Host inattendues.
- Les pages cibles et l'iframe d'entraînement utilisent une sandbox sans accès à l'origine de la plateforme.
- Les récompenses du curriculum sont validées côté serveur, avec protection contre les récompenses répétées.
- La clé publique historique des certificats est remplacée par une clé générée pour chaque installation.
- L'updater refuse les archives sans empreinte attendue et l'installateur vérifie son téléchargement.
- Corrections des contrôles de confinement de fichiers et du démarrage Windows depuis un autre dossier.
- Les instances sont explicitement présentées comme des simulations.

## Compatibilité et limites

Les anciens certificats utilisant la clé publique historique doivent être régénérés. Les certificats restent des attestations personnelles locales. Le catalogue ne démarre pas de machines Docker ou de VM. Une validation navigateur complète de toutes les cibles sous sandbox reste nécessaire. Certaines ressources frontend nécessitent encore Internet.

Voir `docs/HARDENING.md` pour l'état détaillé et les travaux restants.

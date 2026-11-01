# État du durcissement — 1 novembre 2026

## Changements implémentés

- `npm test` et `npm run test:all` utilisent une copie temporaire sans bases ni clé de certificat de l'opérateur et un port dédié. L'appel direct des suites est refusé.
- Node.js 24.x est la version prise en charge. Les lanceurs shell et batch vérifient le moteur.
- Les API de plateforme refusent les origines étrangères, y compris l'origine opaque `null`, et les valeurs Host inattendues. Ne pas exposer ce service mono-utilisateur sur Internet.
- Les documents cibles reçoivent une CSP sandbox sans `allow-same-origin`. L'iframe est également sandboxée. Les téléchargements et scripts pédagogiques restent autorisés.
- Les préférences du profil sont enregistrables ; les XP, gemmes et niveaux ne sont plus acceptés depuis cette route. La validation d'un niveau attribue les récompenses une seule fois, dans une transaction SQLite.
- Chaque installation génère une clé de certificat privée locale `.certificate-key`, conservée par l'updater. La sauvegarder avec le profil. Les anciennes signatures utilisant la clé publique historique ne sont plus valides avec cette nouvelle clé. Ces certificats restent des attestations personnelles, sans autorité de certification indépendante.
- Les archives de mise à jour sans empreinte SHA-256 attendue sont refusées. L'installateur vérifie aussi le checksum du ZIP téléchargé. Un checksum publié par la même source ne constitue pas une signature indépendante.
- Les contrôles de confinement des fichiers statiques et de l'installateur utilisent une frontière de répertoire.
- L'interface et les réponses d'instance indiquent le moteur simulé.

## Validation

Exécuter `npm run test:all`. Les suites incluent les régressions HTTP concernant les origines, la falsification de progression, les récompenses répétées et l'absence de checksum. La CI de pull request couvre Windows, Linux et macOS.

## Travaux encore nécessaires

1. Vérification dans un vrai navigateur de chaque cible sous sandbox : formulaires, scripts, téléchargements, navigation, absence d'accès au parent. Les tests HTTP vérifient les en-têtes, pas leur application par un navigateur.
2. Séparation des cibles dans un service et une origine dédiés ; la sandbox actuelle est une défense intermédiaire. Les simulations intégrées directement au DOM de la plateforme demandent aussi une revue.
3. Remplacer les Dockerfiles qui dorment et les tests de flags constants par de vrais services et scénarios d'exploitation/remédiation. Le catalogue ne constitue pas 134 machines opérationnelles.
4. Centraliser les récompenses des autres modes, les quêtes, les erreurs et les vies. Le durcissement de la progression du curriculum ne garantit pas toute l'économie contre la manipulation.
5. Mise à jour transactionnelle avec restauration de tous les fichiers, sauvegarde SQLite cohérente et manifestes signés. L'updater actuel remplace les fichiers en place.
6. Distribuer les ressources frontend localement : Tailwind, confettis et polices nécessitent encore Internet.
7. Audit visuel et clavier des modales, du terminal, des contrastes et du mobile. La conformité WCAG complète n'est pas établie.
8. Découpage progressif des gros modules, schémas des contenus pédagogiques, migrations versionnées et tests de restauration.

La progression déjà réinitialisée pendant l'audit initial ne peut pas être reconstruite sans sauvegarde antérieure.

# 🤝 Guide de Contribution — CyberRange PRO

Bienvenue dans la communauté des contributeurs de **CyberRange PRO** !
Ce projet a pour mission de démocratiser l'apprentissage de la cybersécurité offensive (Red Team / Pentest) et défensive (Blue Team / SOC) à travers un environnement 100% autonome, zéro dépendance npm externe et hautement gamifié.

---

## 🎯 Principes Fondamentaux de l'Architecture

Avant de soumettre du code, assurez-vous de respecter nos piliers techniques :
1. **Zéro dépendance npm backend** : Tout le backend s'exécute exclusivement avec les modules natifs Node.js (`node:http`, `node:sqlite`, `node:crypto`, `node:fs`, `node:path`, `node:child_process`). Aucun `package.json` encombré de dépendances tierces.
2. **Isolation stricte des bases de données** :
   - `cyberrange.db` : Réserve exclusive de la progression utilisateur (XP, badges, série, cœurs, gemmes, certificat). Jamais écrasée lors des mises à jour.
   - `targets.db` : Dédiée aux cibles d'exercices et tables vulnérables d'injections SQL.
3. **Sécurité et Confinement** : Les cibles locales sont strictement confinées. Aucune faille ne doit permettre d'échapper au bac à sable local de la machine hôte en dehors des exercices prévus.
4. **Validation automatisée stricte** : 100% des suites de tests doivent être vertes avant toute proposition de Pull Request (`node test_suite.js`).

---

## 🚀 Comment Ajouter un Nouveau Challenge d'Entraînement

La Zone d'Entraînement repose sur une arborescence standardisée sous le répertoire `challenges/` :

```text
challenges/
└── <catégorie>/
    └── <id-challenge>/
        ├── meta.json         # Métadonnées, points, tags, hints, flag
        ├── tasks.json        # Étapes pédagogiques guidées
        ├── writeup.md        # Solution détaillée et explications
        ├── files/            # Artefacts téléchargeables (PCAP, binaire, EML...)
        └── src/              # Code source de l'application cible vulnérable
```

### 1. Structure de `meta.json`
```json
{
  "id": "web-36-prototype-pollution",
  "title": "Node.js Object Prototype Poisoning",
  "category": "web",
  "difficulty": "medium",
  "xp": 350,
  "flag": "CYBER{PROTOTYPE_POLLUTION_MERGE_RCE}",
  "learning_path_ids": ["path-web-adv"],
  "tags": ["web", "prototype-pollution", "nodejs"],
  "description": "Exploitez une fonction de fusion récursive récursive non sécurisée pour altérer Object.prototype.",
  "hints": [
    { "level": 1, "cost": 0, "text": "Inspectez comment les paramètres JSON profonds sont fusionnés." },
    { "level": 2, "cost": 15, "text": "La clé __proto__ n'est pas filtrée avant assignation." }
  ]
}
```

### 2. Structure de `tasks.json`
```json
[
  {
    "id": "t1",
    "question": "Quel attribut JavaScript universel permet de modifier le prototype de base ?",
    "answer": "__proto__",
    "points": 50
  },
  {
    "id": "t2",
    "question": "Soumettez le flag de validation une fois le serveur compromis :",
    "answer": "CYBER{PROTOTYPE_POLLUTION_MERGE_RCE}",
    "points": 300
  }
]
```

### 3. Rédaction du `writeup.md`
Chaque défi **doit impérativement** comporter un writeup exhaustif expliquant :
- L'analyse de la vulnérabilité (racine du problème, CWE).
- Le scénario d'exploitation étape par étape.
- La remédiation sécurisée (patching, configuration durcie).

---

## 🧪 Tests de Solvabilité & Validation Obligatoire

Avant de proposer une modification ou un nouveau challenge :
```bash
# Exécuter l'intégralité de la suite de validation
node test_suite.js

# Exécuter les bancs de tests cas limites
node test_edge_cases_phase3.js
node test_edge_cases_phase4.js
```
Toutes les suites doivent afficher :
`🎉 100% DES SUITES DE VALIDATION SONT AU VERT !`

---

## 🔄 Processus de Pull Request (PR)

1. **Forkez** le dépôt et créez une branche descriptive :
   ```bash
   git checkout -b feature/challenge-crypto-quantum
   ```
2. **Implémentez** vos changements selon les conventions du projet.
3. **Validez** localement avec `node test_suite.js`.
4. **Commitez** vos modifications avec des messages conventionnels :
   - `feat: add challenge web-36 prototype pollution`
   - `fix: resolve edge case in pcap download confinement`
   - `docs: improve contributing and writeups`
5. **Ouvrez votre Pull Request** sur GitHub en remplissant scrupuleusement le modèle fourni.

Merci pour votre passion et votre contribution au hacking éthique ! 🛡️

# Rapport d'Exploitation & Débriefing Technique // KicksVault Streetwear Database
**Organisation cible** : KicksVault Rare Sneakers Ltd  
**Système d'exploitation** : Linux | **Catégorie** : Web & APIs  
**Difficulté** : EASY | **Vecteur de vulnérabilité** : CWE-89  
**Classification** : DOCUMENT OFFICIEL DU LABORATOIRE CYBERLAB REDTEAM  

---

## 1. Contexte Opérationnel & Règles d'Engagement
Le site de revente de sneakers en édition limitée KicksVault filtre les stocks via un endpoint de catalogue vulnérable. Grâce à la technique de l'injection SQL par UNION SELECT, détermine le nombre exact de colonnes renvoyées par la requête d'origine, explore le schéma de la base SQLite et extrais les tables secrètes d'approvisionnement et les identifiants administrateur.

L'évaluation a été menée dans un environnement strictement isolé. Aucun service de production réel n'a été impacté. L'objectif était d'auditer la sécurité du composant **sqli** et d'extraire les drapeaux de contrôle prouvant la faisabilité de l'attaque.

---

## 2. Phase 1 : Reconnaissance & Cartographie de la Surface d'Attaque
Une phase de reconnaissance passive et active permet d'identifier l'empreinte logicielle et les services en écoute :

```bash
# 1. Énumération des ports et bannières de service
nmap -sV -sC -p- 10.10.32.39 -oN nmap_initial_scan.txt

# 2. Découverte applicative locale
curl -i http://localhost:3333/targets/training/web-03-sqli-union/
```

L'analyse des réponses HTTP et des bannières confirme la présence du composant vulnérable lié à **sqli, union-select, database-enumeration, sqlite, e-commerce**.

---

## 3. Phase 2 : Exploitation Technique Pas-à-Pas

### A. Analyse de la Vulnérabilité
La faille provient d'une insuffisance de validation des contrôles d'accès et des données d'entrée au niveau de **CWE-89**. Le système interprète les paramètres non assainis sans barrière d'isolation.

### B. Élaboration du Vecteur d'Attaque
En appliquant la méthodologie offensive standard :
1. **Étape 1** : Injection du marqueur de diagnostic pour vérifier l'absence d'échappement.
2. **Étape 2** : Construction du payload weaponisé adapté à l'architecture cible.
3. **Étape 3** : Déclenchement de l'exécution et capture des privilèges.

```bash
# Exemple de commande d'exploitation standard
curl -s -X POST http://localhost:3333/targets/training/web-03-sqli-union/ \
  -H "Content-Type: application/json" \
  -d '{"exploit_vector": "sqli"}'
```

---

## 4. Phase 3 : Capture des Drapeaux & Validation des Tâches
Les drapeaux officiels validant la compromission des différentes étapes de la mission :

- **Détermination du nombre de colonnes** : `4` (40 pts)
- **Énumération de sqlite_master** : `admin_credentials_vault` (50 pts)
- **Extraction des hashs & Flag** : `CYBERLAB{SQLI_UNION_SELECT_SCHEMA_UNMASKED_994}` (60 pts)

---

## 5. Recommandations de Remédiation (Mesures Défensives Blue Team)
1. **Application du principe de moindre privilège** (Least Privilege Principle) sur tous les comptes et processus.
2. **Validation stricte par liste blanche** des données en entrée (Input Sanitization) et requêtes préparées pour toutes les interactions en base.
3. **Mise à jour des composants logiciels** vers les versions patchées éliminant CWE-89.
4. **Cloisonnement réseau et conteneurs** : Interdiction du mode privileged, montage en lecture seule des volumes système.

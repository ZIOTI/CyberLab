# Rapport d'Exploitation & Débriefing Technique // Rest API Role Escalation via Mass Assignment
**Organisation cible** : SaaS Multi-Tenant Billing Gateway  
**Système d'exploitation** : API | **Catégorie** : APIs & Microservices  
**Difficulté** : EASY | **Vecteur de vulnérabilité** : CWE-915  
**Classification** : DOCUMENT OFFICIEL DU LABORATOIRE CYBERLAB REDTEAM  

---

## 1. Contexte Opérationnel & Règles d'Engagement
L'endpoint de mise à jour de profil utilisateur PUT /api/v1/user/profile prend directement l'ensemble du payload JSON entrant et l'applique aveuglément au modèle de données ORM sans filtrer les attributs protégés (Mass Assignment). Injecte les propriétés non documentées "is_admin": true et "verified": true pour élever tes privilèges.

L'évaluation a été menée dans un environnement strictement isolé. Aucun service de production réel n'a été impacté. L'objectif était d'auditer la sécurité du composant **api** et d'extraire les drapeaux de contrôle prouvant la faisabilité de l'attaque.

---

## 2. Phase 1 : Reconnaissance & Cartographie de la Surface d'Attaque
Une phase de reconnaissance passive et active permet d'identifier l'empreinte logicielle et les services en écoute :

```bash
# 1. Énumération des ports et bannières de service
nmap -sV -sC -p- 10.10.13.140 -oN nmap_initial_scan.txt

# 2. Découverte applicative locale
curl -i http://localhost:3333/targets/training/api-02-mass-assignment/
```

L'analyse des réponses HTTP et des bannières confirme la présence du composant vulnérable lié à **api, mass-assignment, json-injection, role-escalation, rest**.

---

## 3. Phase 2 : Exploitation Technique Pas-à-Pas

### A. Analyse de la Vulnérabilité
La faille provient d'une insuffisance de validation des contrôles d'accès et des données d'entrée au niveau de **CWE-915**. Le système interprète les paramètres non assainis sans barrière d'isolation.

### B. Élaboration du Vecteur d'Attaque
En appliquant la méthodologie offensive standard :
1. **Étape 1** : Injection du marqueur de diagnostic pour vérifier l'absence d'échappement.
2. **Étape 2** : Construction du payload weaponisé adapté à l'architecture cible.
3. **Étape 3** : Déclenchement de l'exécution et capture des privilèges.

```bash
# Exemple de commande d'exploitation standard
curl -s -X POST http://localhost:3333/targets/training/api-02-mass-assignment/ \
  -H "Content-Type: application/json" \
  -d '{"exploit_vector": "api"}'
```

---

## 4. Phase 3 : Capture des Drapeaux & Validation des Tâches
Les drapeaux officiels validant la compromission des différentes étapes de la mission :

- **Détection du modèle d'assignation en masse** : `is_admin` (50 pts)
- **Modification du profil utilisateur** : `USER_ELEVATED_TO_ADMIN` (50 pts)
- **Accès au portail restreint & Flag** : `CYBERLAB{API_MASS_ASSIGNMENT_IS_ADMIN_TRUE_ACCEPTED}` (50 pts)

---

## 5. Recommandations de Remédiation (Mesures Défensives Blue Team)
1. **Application du principe de moindre privilège** (Least Privilege Principle) sur tous les comptes et processus.
2. **Validation stricte par liste blanche** des données en entrée (Input Sanitization) et requêtes préparées pour toutes les interactions en base.
3. **Mise à jour des composants logiciels** vers les versions patchées éliminant CWE-915.
4. **Cloisonnement réseau et conteneurs** : Interdiction du mode privileged, montage en lecture seule des volumes système.

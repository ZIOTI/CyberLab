# Rapport d'Exploitation & Débriefing Technique // Aura Privatbank AG FINMA Portal
**Organisation cible** : Aura Privatbank AG (Zürich)  
**Système d'exploitation** : Linux | **Catégorie** : Web & APIs  
**Difficulté** : EASY | **Vecteur de vulnérabilité** : CWE-89  
**Classification** : DOCUMENT OFFICIEL DU LABORATOIRE CYBERLAB REDTEAM  

---

## 1. Contexte Opérationnel & Règles d'Engagement
La banque privée suisse Aura dispose d'un vérificateur de mandats de gestion financière. L'application ne renvoie aucune donnée issue de la base, mais uniquement un statut booléen (Mandat Actif / Mandat Introuvable). Conçois un script d'inférence booléenne caractère par caractère (SUBSTR + ASCII) pour extraire le numéro de compte fiduciaire de l'administrateur.

L'évaluation a été menée dans un environnement strictement isolé. Aucun service de production réel n'a été impacté. L'objectif était d'auditer la sécurité du composant **sqli** et d'extraire les drapeaux de contrôle prouvant la faisabilité de l'attaque.

---

## 2. Phase 1 : Reconnaissance & Cartographie de la Surface d'Attaque
Une phase de reconnaissance passive et active permet d'identifier l'empreinte logicielle et les services en écoute :

```bash
# 1. Énumération des ports et bannières de service
nmap -sV -sC -p- 10.10.34.14 -oN nmap_initial_scan.txt

# 2. Découverte applicative locale
curl -i http://localhost:3333/targets/training/web-06-sqli-blind-boolean/
```

L'analyse des réponses HTTP et des bannières confirme la présence du composant vulnérable lié à **sqli, blind-sqli, boolean-based, banking, fintech**.

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
curl -s -X POST http://localhost:3333/targets/training/web-06-sqli-blind-boolean/ \
  -H "Content-Type: application/json" \
  -d '{"exploit_vector": "sqli"}'
```

---

## 4. Phase 3 : Capture des Drapeaux & Validation des Tâches
Les drapeaux officiels validant la compromission des différentes étapes de la mission :

- **Identification de la réponse différentielle** : `BOOLEAN_DIFFERENTIAL_CONFIRMED` (40 pts)
- **Longueur du token administrateur** : `32` (40 pts)
- **Extraction binaire & Flag** : `CYBERLAB{BOOLEAN_BLIND_SQLI_BINARY_SEARCH_WIN}` (70 pts)

---

## 5. Recommandations de Remédiation (Mesures Défensives Blue Team)
1. **Application du principe de moindre privilège** (Least Privilege Principle) sur tous les comptes et processus.
2. **Validation stricte par liste blanche** des données en entrée (Input Sanitization) et requêtes préparées pour toutes les interactions en base.
3. **Mise à jour des composants logiciels** vers les versions patchées éliminant CWE-89.
4. **Cloisonnement réseau et conteneurs** : Interdiction du mode privileged, montage en lecture seule des volumes système.

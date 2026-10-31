# Rapport d'Exploitation & Débriefing Technique // IronGate SecurID Enterprise IAM
**Organisation cible** : IronGate Security Identity Corp  
**Système d'exploitation** : Linux | **Catégorie** : Web & APIs  
**Difficulté** : BEGINNER | **Vecteur de vulnérabilité** : CWE-89  
**Classification** : DOCUMENT OFFICIEL DU LABORATOIRE CYBERLAB REDTEAM  

---

## 1. Contexte Opérationnel & Règles d'Engagement
La console IronGate SecurID centralise l'authentification SSO de milliers de postes de travail. La mire de connexion utilise une concaténation directe de requêtes SQL sans requêtes préparées. Construis une charge utile d'injection SQL classique pour forcer l'évaluation booléenne à VRAI, contourner le mot de passe et obtenir une session d'administrateur système.

L'évaluation a été menée dans un environnement strictement isolé. Aucun service de production réel n'a été impacté. L'objectif était d'auditer la sécurité du composant **sqli** et d'extraire les drapeaux de contrôle prouvant la faisabilité de l'attaque.

---

## 2. Phase 1 : Reconnaissance & Cartographie de la Surface d'Attaque
Une phase de reconnaissance passive et active permet d'identifier l'empreinte logicielle et les services en écoute :

```bash
# 1. Énumération des ports et bannières de service
nmap -sV -sC -p- 10.10.34.29 -oN nmap_initial_scan.txt

# 2. Découverte applicative locale
curl -i http://localhost:3333/targets/training/web-02-sqli-login/
```

L'analyse des réponses HTTP et des bannières confirme la présence du composant vulnérable lié à **sqli, authentication-bypass, login-form, sqlite, waf-bypass**.

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
curl -s -X POST http://localhost:3333/targets/training/web-02-sqli-login/ \
  -H "Content-Type: application/json" \
  -d '{"exploit_vector": "sqli"}'
```

---

## 4. Phase 3 : Capture des Drapeaux & Validation des Tâches
Les drapeaux officiels validant la compromission des différentes étapes de la mission :

- **Détection de l'injection SQL** : `SQLI_ERROR_CONFIRMED` (30 pts)
- **Contournement de la validation du mot de passe** : `' OR '1'='1` (30 pts)
- **Accès Console IAM & Flag Master** : `CYBERLAB{SQLI_AUTH_BYPASS_IRONGATE_ADMIN_LOGGED_992}` (40 pts)

---

## 5. Recommandations de Remédiation (Mesures Défensives Blue Team)
1. **Application du principe de moindre privilège** (Least Privilege Principle) sur tous les comptes et processus.
2. **Validation stricte par liste blanche** des données en entrée (Input Sanitization) et requêtes préparées pour toutes les interactions en base.
3. **Mise à jour des composants logiciels** vers les versions patchées éliminant CWE-89.
4. **Cloisonnement réseau et conteneurs** : Interdiction du mode privileged, montage en lecture seule des volumes système.

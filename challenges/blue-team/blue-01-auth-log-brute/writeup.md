# Rapport d'Exploitation & Débriefing Technique // SSH Brute Force Forensic Log Analysis
**Organisation cible** : Apex Enterprise Linux Bastion  
**Système d'exploitation** : Linux | **Catégorie** : Blue Team & SOC  
**Difficulté** : BEGINNER | **Vecteur de vulnérabilité** : CWE-307  
**Classification** : DOCUMENT OFFICIEL DU LABORATOIRE CYBERLAB REDTEAM  

---

## 1. Contexte Opérationnel & Règles d'Engagement
Le serveur bastion d'accès aux infrastructures critiques a subi une tentative d'intrusion automatisée par force brute sur le port SSH. Analyse le fichier de journalisation /var/log/auth.log pour identifier l'adresse IP de l'attaquant, le nombre exact de tentatives échouées, et le compte utilisateur qui a finalement été compromis.

L'évaluation a été menée dans un environnement strictement isolé. Aucun service de production réel n'a été impacté. L'objectif était d'auditer la sécurité du composant **blue-team** et d'extraire les drapeaux de contrôle prouvant la faisabilité de l'attaque.

---

## 2. Phase 1 : Reconnaissance & Cartographie de la Surface d'Attaque
Une phase de reconnaissance passive et active permet d'identifier l'empreinte logicielle et les services en écoute :

```bash
# 1. Énumération des ports et bannières de service
nmap -sV -sC -p- 10.10.17.19 -oN nmap_initial_scan.txt

# 2. Découverte applicative locale
curl -i http://localhost:3333/targets/training/blue-01-auth-log-brute/
```

L'analyse des réponses HTTP et des bannières confirme la présence du composant vulnérable lié à **blue-team, auth-log, ssh, brute-force, incident-response**.

---

## 3. Phase 2 : Exploitation Technique Pas-à-Pas

### A. Analyse de la Vulnérabilité
La faille provient d'une insuffisance de validation des contrôles d'accès et des données d'entrée au niveau de **CWE-307**. Le système interprète les paramètres non assainis sans barrière d'isolation.

### B. Élaboration du Vecteur d'Attaque
En appliquant la méthodologie offensive standard :
1. **Étape 1** : Injection du marqueur de diagnostic pour vérifier l'absence d'échappement.
2. **Étape 2** : Construction du payload weaponisé adapté à l'architecture cible.
3. **Étape 3** : Déclenchement de l'exécution et capture des privilèges.

```bash
# Exemple de commande d'exploitation standard
curl -s -X POST http://localhost:3333/targets/training/blue-01-auth-log-brute/ \
  -H "Content-Type: application/json" \
  -d '{"exploit_vector": "blue-team"}'
```

---

## 4. Phase 3 : Capture des Drapeaux & Validation des Tâches
Les drapeaux officiels validant la compromission des différentes étapes de la mission :

- **Adresse IP source de l'attaquant** : `203.0.113.195` (30 pts)
- **Compte utilisateur compromis** : `deploy_service` (30 pts)
- **Clôture de l'incident & Flag** : `CYBERLAB{BLUE_TEAM_SSH_AUTH_LOG_BRUTE_FORCE_DETECTED_302}` (40 pts)

---

## 5. Recommandations de Remédiation (Mesures Défensives Blue Team)
1. **Application du principe de moindre privilège** (Least Privilege Principle) sur tous les comptes et processus.
2. **Validation stricte par liste blanche** des données en entrée (Input Sanitization) et requêtes préparées pour toutes les interactions en base.
3. **Mise à jour des composants logiciels** vers les versions patchées éliminant CWE-307.
4. **Cloisonnement réseau et conteneurs** : Interdiction du mode privileged, montage en lecture seule des volumes système.

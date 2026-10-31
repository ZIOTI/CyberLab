# Rapport d'Exploitation & Débriefing Technique // Nginx Access Log SQLi Attack Profiling
**Organisation cible** : E-Commerce Platform SOC Monitoring  
**Système d'exploitation** : Linux | **Catégorie** : Blue Team & SOC  
**Difficulté** : EASY | **Vecteur de vulnérabilité** : CWE-89  
**Classification** : DOCUMENT OFFICIEL DU LABORATOIRE CYBERLAB REDTEAM  

---

## 1. Contexte Opérationnel & Règles d'Engagement
Une alerte de l'équipe de supervision signale un volume inhabituel de requêtes HTTP 500 sur le frontal Nginx. En analysant le fichier access.log avec awk, sort et uniq, isole les motifs d'injection SQL envoyés par l'attaquant, détermine le paramètre ciblé, et découvre la table de données qui a fait l'objet d'une exfiltration.

L'évaluation a été menée dans un environnement strictement isolé. Aucun service de production réel n'a été impacté. L'objectif était d'auditer la sécurité du composant **blue-team** et d'extraire les drapeaux de contrôle prouvant la faisabilité de l'attaque.

---

## 2. Phase 1 : Reconnaissance & Cartographie de la Surface d'Attaque
Une phase de reconnaissance passive et active permet d'identifier l'empreinte logicielle et les services en écoute :

```bash
# 1. Énumération des ports et bannières de service
nmap -sV -sC -p- 10.10.25.171 -oN nmap_initial_scan.txt

# 2. Découverte applicative locale
curl -i http://localhost:3333/targets/training/blue-02-web-access-log/
```

L'analyse des réponses HTTP et des bannières confirme la présence du composant vulnérable lié à **blue-team, nginx, access-log, sqli-detection, threat-hunting**.

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
curl -s -X POST http://localhost:3333/targets/training/blue-02-web-access-log/ \
  -H "Content-Type: application/json" \
  -d '{"exploit_vector": "blue-team"}'
```

---

## 4. Phase 3 : Capture des Drapeaux & Validation des Tâches
Les drapeaux officiels validant la compromission des différentes étapes de la mission :

- **Paramètre ciblé par l'injection** : `product_id` (40 pts)
- **Code de statut HTTP lors de la réussite** : `200` (50 pts)
- **Rapport d'intrusion & Flag** : `CYBERLAB{NGINX_LOG_ATTACK_PATTERN_SQLI_MAPPED}` (60 pts)

---

## 5. Recommandations de Remédiation (Mesures Défensives Blue Team)
1. **Application du principe de moindre privilège** (Least Privilege Principle) sur tous les comptes et processus.
2. **Validation stricte par liste blanche** des données en entrée (Input Sanitization) et requêtes préparées pour toutes les interactions en base.
3. **Mise à jour des composants logiciels** vers les versions patchées éliminant CWE-89.
4. **Cloisonnement réseau et conteneurs** : Interdiction du mode privileged, montage en lecture seule des volumes système.

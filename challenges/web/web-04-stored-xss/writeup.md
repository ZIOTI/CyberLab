# Rapport d'Exploitation & Débriefing Technique // DevSphere Developer RFC Forum
**Organisation cible** : DevSphere Software Community  
**Système d'exploitation** : Linux | **Catégorie** : Web & APIs  
**Difficulté** : EASY | **Vecteur de vulnérabilité** : CWE-79  
**Classification** : DOCUMENT OFFICIEL DU LABORATOIRE CYBERLAB REDTEAM  

---

## 1. Contexte Opérationnel & Règles d'Engagement
DevSphere héberge un forum collaboratif pour la révision de propositions techniques (RFC). Le moteur de rendu Markdown filtre imparfaitement les balises HTML dans les commentaires. Un bot administrateur headless consulte automatiquement chaque message publié. Conçois une charge utile XSS stockée capable d'exfiltrer le cookie de session de l'administrateur vers ton écouteur.

L'évaluation a été menée dans un environnement strictement isolé. Aucun service de production réel n'a été impacté. L'objectif était d'auditer la sécurité du composant **xss** et d'extraire les drapeaux de contrôle prouvant la faisabilité de l'attaque.

---

## 2. Phase 1 : Reconnaissance & Cartographie de la Surface d'Attaque
Une phase de reconnaissance passive et active permet d'identifier l'empreinte logicielle et les services en écoute :

```bash
# 1. Énumération des ports et bannières de service
nmap -sV -sC -p- 10.10.29.157 -oN nmap_initial_scan.txt

# 2. Découverte applicative locale
curl -i http://localhost:3333/targets/training/web-04-stored-xss/
```

L'analyse des réponses HTTP et des bannières confirme la présence du composant vulnérable lié à **xss, stored-xss, cookie-theft, javascript, headless-bot**.

---

## 3. Phase 2 : Exploitation Technique Pas-à-Pas

### A. Analyse de la Vulnérabilité
La faille provient d'une insuffisance de validation des contrôles d'accès et des données d'entrée au niveau de **CWE-79**. Le système interprète les paramètres non assainis sans barrière d'isolation.

### B. Élaboration du Vecteur d'Attaque
En appliquant la méthodologie offensive standard :
1. **Étape 1** : Injection du marqueur de diagnostic pour vérifier l'absence d'échappement.
2. **Étape 2** : Construction du payload weaponisé adapté à l'architecture cible.
3. **Étape 3** : Déclenchement de l'exécution et capture des privilèges.

```bash
# Exemple de commande d'exploitation standard
curl -s -X POST http://localhost:3333/targets/training/web-04-stored-xss/ \
  -H "Content-Type: application/json" \
  -d '{"exploit_vector": "xss"}'
```

---

## 4. Phase 3 : Capture des Drapeaux & Validation des Tâches
Les drapeaux officiels validant la compromission des différentes étapes de la mission :

- **Vérification de l'absence d'échappement HTML** : `XSS_TRIGGERED` (40 pts)
- **Analyse des attributs de sécurité du cookie** : `HttpOnly` (50 pts)
- **Exfiltration du cookie admin & Flag** : `CYBERLAB{STORED_XSS_COOKIE_HIJACK_ADMIN_BOT_SUCCESS}` (60 pts)

---

## 5. Recommandations de Remédiation (Mesures Défensives Blue Team)
1. **Application du principe de moindre privilège** (Least Privilege Principle) sur tous les comptes et processus.
2. **Validation stricte par liste blanche** des données en entrée (Input Sanitization) et requêtes préparées pour toutes les interactions en base.
3. **Mise à jour des composants logiciels** vers les versions patchées éliminant CWE-79.
4. **Cloisonnement réseau et conteneurs** : Interdiction du mode privileged, montage en lecture seule des volumes système.

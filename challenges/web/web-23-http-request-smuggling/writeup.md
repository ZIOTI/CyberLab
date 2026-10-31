# Rapport d'Exploitation & Débriefing Technique // CL.TE Dual Pipeline Desynchronization
**Organisation cible** : MegaProxy Edge & Gateway Corp  
**Système d'exploitation** : Linux | **Catégorie** : Web & APIs  
**Difficulté** : INSANE | **Vecteur de vulnérabilité** : CWE-444  
**Classification** : DOCUMENT OFFICIEL DU LABORATOIRE CYBERLAB REDTEAM  

---

## 1. Contexte Opérationnel & Règles d'Engagement
L'architecture réseau repose sur un frontal Nginx priorisant l'en-tête Content-Length et un backend Apache Tomcat priorisant Transfer-Encoding: chunked (désynchronisation CL.TE). En forgeant une requête contenant les deux en-têtes avec une taille tronquée, 'contrebande' une seconde requête HTTP dans le pipeline pour détourner les sessions des utilisateurs suivants.

L'évaluation a été menée dans un environnement strictement isolé. Aucun service de production réel n'a été impacté. L'objectif était d'auditer la sécurité du composant **request-smuggling** et d'extraire les drapeaux de contrôle prouvant la faisabilité de l'attaque.

---

## 2. Phase 1 : Reconnaissance & Cartographie de la Surface d'Attaque
Une phase de reconnaissance passive et active permet d'identifier l'empreinte logicielle et les services en écoute :

```bash
# 1. Énumération des ports et bannières de service
nmap -sV -sC -p- 10.10.57.26 -oN nmap_initial_scan.txt

# 2. Découverte applicative locale
curl -i http://localhost:3333/targets/training/web-23-http-request-smuggling/
```

L'analyse des réponses HTTP et des bannières confirme la présence du composant vulnérable lié à **request-smuggling, cl-te, http-desync, rfc7230, front-back**.

---

## 3. Phase 2 : Exploitation Technique Pas-à-Pas

### A. Analyse de la Vulnérabilité
La faille provient d'une insuffisance de validation des contrôles d'accès et des données d'entrée au niveau de **CWE-444**. Le système interprète les paramètres non assainis sans barrière d'isolation.

### B. Élaboration du Vecteur d'Attaque
En appliquant la méthodologie offensive standard :
1. **Étape 1** : Injection du marqueur de diagnostic pour vérifier l'absence d'échappement.
2. **Étape 2** : Construction du payload weaponisé adapté à l'architecture cible.
3. **Étape 3** : Déclenchement de l'exécution et capture des privilèges.

```bash
# Exemple de commande d'exploitation standard
curl -s -X POST http://localhost:3333/targets/training/web-23-http-request-smuggling/ \
  -H "Content-Type: application/json" \
  -d '{"exploit_vector": "request-smuggling"}'
```

---

## 4. Phase 3 : Capture des Drapeaux & Validation des Tâches
Les drapeaux officiels validant la compromission des différentes étapes de la mission :

- **Reconnaissance de la divergence de parsing** : `DESYNC_CL_TE_DETECTED` (100 pts)
- **Capture de session d'un tiers (User Foothold)** : `CYBERLAB{user_smuggled_session_token_caught}` (150 pts)
- **Contournement du WAF admin & Root Flag** : `CYBERLAB{HTTP_REQUEST_SMUGGLING_CL_TE_FRONTEND_BYPASS}` (200 pts)

---

## 5. Recommandations de Remédiation (Mesures Défensives Blue Team)
1. **Application du principe de moindre privilège** (Least Privilege Principle) sur tous les comptes et processus.
2. **Validation stricte par liste blanche** des données en entrée (Input Sanitization) et requêtes préparées pour toutes les interactions en base.
3. **Mise à jour des composants logiciels** vers les versions patchées éliminant CWE-444.
4. **Cloisonnement réseau et conteneurs** : Interdiction du mode privileged, montage en lecture seule des volumes système.

# Rapport d'Exploitation & Débriefing Technique // Out-of-Band DTD File Exfiltration
**Organisation cible** : FinDoc Automated Analysis Portal  
**Système d'exploitation** : Linux | **Catégorie** : Web & APIs  
**Difficulté** : HARD | **Vecteur de vulnérabilité** : CWE-611  
**Classification** : DOCUMENT OFFICIEL DU LABORATOIRE CYBERLAB REDTEAM  

---

## 1. Contexte Opérationnel & Règles d'Engagement
Le parseur financier FinDoc traite des flux XML sans renvoyer aucun contenu dans la réponse HTTP et sans message d'erreur verbeux (Blind XXE). Héberge une DTD externe malveillante sur ton serveur et exploite les entités de paramètres XML (%eval, %dtd) pour forcer le serveur à exfiltrer les données sensibles vers ton écouteur via un paramètre d'URL.

L'évaluation a été menée dans un environnement strictement isolé. Aucun service de production réel n'a été impacté. L'objectif était d'auditer la sécurité du composant **xxe** et d'extraire les drapeaux de contrôle prouvant la faisabilité de l'attaque.

---

## 2. Phase 1 : Reconnaissance & Cartographie de la Surface d'Attaque
Une phase de reconnaissance passive et active permet d'identifier l'empreinte logicielle et les services en écoute :

```bash
# 1. Énumération des ports et bannières de service
nmap -sV -sC -p- 10.10.50.52 -oN nmap_initial_scan.txt

# 2. Découverte applicative locale
curl -i http://localhost:3333/targets/training/web-24-blind-xxe-oob/
```

L'analyse des réponses HTTP et des bannières confirme la présence du composant vulnérable lié à **xxe, blind-xxe, oob, parameter-entities, dtd**.

---

## 3. Phase 2 : Exploitation Technique Pas-à-Pas

### A. Analyse de la Vulnérabilité
La faille provient d'une insuffisance de validation des contrôles d'accès et des données d'entrée au niveau de **CWE-611**. Le système interprète les paramètres non assainis sans barrière d'isolation.

### B. Élaboration du Vecteur d'Attaque
En appliquant la méthodologie offensive standard :
1. **Étape 1** : Injection du marqueur de diagnostic pour vérifier l'absence d'échappement.
2. **Étape 2** : Construction du payload weaponisé adapté à l'architecture cible.
3. **Étape 3** : Déclenchement de l'exécution et capture des privilèges.

```bash
# Exemple de commande d'exploitation standard
curl -s -X POST http://localhost:3333/targets/training/web-24-blind-xxe-oob/ \
  -H "Content-Type: application/json" \
  -d '{"exploit_vector": "xxe"}'
```

---

## 4. Phase 3 : Capture des Drapeaux & Validation des Tâches
Les drapeaux officiels validant la compromission des différentes étapes de la mission :

- **Confirmation de la communication sortante** : `OUTBOUND_HTTP_RECEIVED` (80 pts)
- **Hébergement de la DTD externe d'exfiltration** : `EXTERNAL_DTD_SERVED` (120 pts)
- **Extraction des données & Flag** : `CYBERLAB{BLIND_XXE_EXTERNAL_PARAM_DTD_EXFILTRATION_WIN}` (150 pts)

---

## 5. Recommandations de Remédiation (Mesures Défensives Blue Team)
1. **Application du principe de moindre privilège** (Least Privilege Principle) sur tous les comptes et processus.
2. **Validation stricte par liste blanche** des données en entrée (Input Sanitization) et requêtes préparées pour toutes les interactions en base.
3. **Mise à jour des composants logiciels** vers les versions patchées éliminant CWE-611.
4. **Cloisonnement réseau et conteneurs** : Interdiction du mode privileged, montage en lecture seule des volumes système.

# Rapport d'Exploitation & Débriefing Technique // ConnectID OAuth Account Hijack
**Organisation cible** : ConnectID Single Sign-On Provider  
**Système d'exploitation** : Cloud | **Catégorie** : Web & APIs  
**Difficulté** : INTERMEDIATE | **Vecteur de vulnérabilité** : CWE-601  
**Classification** : DOCUMENT OFFICIEL DU LABORATOIRE CYBERLAB REDTEAM  

---

## 1. Contexte Opérationnel & Règles d'Engagement
Le fournisseur d'identité ConnectID permet la connexion aux services tiers via OAuth 2.0 Authorization Code flow. La validation du paramètre redirect_uri autorise les redirections ouvertes vers des sous-domaines non contrôlés, et le paramètre state est absent. Manipule le flux d'autorisation pour intercepter le code d'autorisation d'un cadre dirigeant et usurper son compte.

L'évaluation a été menée dans un environnement strictement isolé. Aucun service de production réel n'a été impacté. L'objectif était d'auditer la sécurité du composant **oauth** et d'extraire les drapeaux de contrôle prouvant la faisabilité de l'attaque.

---

## 2. Phase 1 : Reconnaissance & Cartographie de la Surface d'Attaque
Une phase de reconnaissance passive et active permet d'identifier l'empreinte logicielle et les services en écoute :

```bash
# 1. Énumération des ports et bannières de service
nmap -sV -sC -p- 10.10.41.191 -oN nmap_initial_scan.txt

# 2. Découverte applicative locale
curl -i http://localhost:3333/targets/training/web-17-oauth-redirect/
```

L'analyse des réponses HTTP et des bannières confirme la présence du composant vulnérable lié à **oauth, open-redirect, authorization-code, sso, account-takeover**.

---

## 3. Phase 2 : Exploitation Technique Pas-à-Pas

### A. Analyse de la Vulnérabilité
La faille provient d'une insuffisance de validation des contrôles d'accès et des données d'entrée au niveau de **CWE-601**. Le système interprète les paramètres non assainis sans barrière d'isolation.

### B. Élaboration du Vecteur d'Attaque
En appliquant la méthodologie offensive standard :
1. **Étape 1** : Injection du marqueur de diagnostic pour vérifier l'absence d'échappement.
2. **Étape 2** : Construction du payload weaponisé adapté à l'architecture cible.
3. **Étape 3** : Déclenchement de l'exécution et capture des privilèges.

```bash
# Exemple de commande d'exploitation standard
curl -s -X POST http://localhost:3333/targets/training/web-17-oauth-redirect/ \
  -H "Content-Type: application/json" \
  -d '{"exploit_vector": "oauth"}'
```

---

## 4. Phase 3 : Capture des Drapeaux & Validation des Tâches
Les drapeaux officiels validant la compromission des différentes étapes de la mission :

- **Contournement de la liste blanche d'URI** : `REDIRECT_URI_BYPASSED` (50 pts)
- **Interception du code d'autorisation** : `code` (50 pts)
- **Échange du code & Flag** : `CYBERLAB{OAUTH2_STATE_MISSING_REDIRECT_TOKEN_THEFT}` (100 pts)

---

## 5. Recommandations de Remédiation (Mesures Défensives Blue Team)
1. **Application du principe de moindre privilège** (Least Privilege Principle) sur tous les comptes et processus.
2. **Validation stricte par liste blanche** des données en entrée (Input Sanitization) et requêtes préparées pour toutes les interactions en base.
3. **Mise à jour des composants logiciels** vers les versions patchées éliminant CWE-601.
4. **Cloisonnement réseau et conteneurs** : Interdiction du mode privileged, montage en lecture seule des volumes système.

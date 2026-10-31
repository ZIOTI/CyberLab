# Rapport d'Exploitation & Débriefing Technique // AuthGate JWT HMAC Secret Recovery
**Organisation cible** : AuthGate Enterprise Federation  
**Système d'exploitation** : Linux | **Catégorie** : Web & APIs  
**Difficulté** : INTERMEDIATE | **Vecteur de vulnérabilité** : CWE-345  
**Classification** : DOCUMENT OFFICIEL DU LABORATOIRE CYBERLAB REDTEAM  

---

## 1. Contexte Opérationnel & Règles d'Engagement
La passerelle AuthGate signe ses jetons de session JSON Web Tokens (JWT) avec l'algorithme HS256 en utilisant un mot de passe faible issu d'un dictionnaire d'entreprise. Capture le jeton de ton compte invité, utilise Hashcat ou John the Ripper avec rockyou.txt pour casser la clé secrète, puis forge un nouveau jeton avec le rôle admin.

L'évaluation a été menée dans un environnement strictement isolé. Aucun service de production réel n'a été impacté. L'objectif était d'auditer la sécurité du composant **jwt** et d'extraire les drapeaux de contrôle prouvant la faisabilité de l'attaque.

---

## 2. Phase 1 : Reconnaissance & Cartographie de la Surface d'Attaque
Une phase de reconnaissance passive et active permet d'identifier l'empreinte logicielle et les services en écoute :

```bash
# 1. Énumération des ports et bannières de service
nmap -sV -sC -p- 10.10.44.78 -oN nmap_initial_scan.txt

# 2. Découverte applicative locale
curl -i http://localhost:3333/targets/training/web-14-jwt-weak-secret/
```

L'analyse des réponses HTTP et des bannières confirme la présence du composant vulnérable lié à **jwt, json-web-token, hashcat, hs256, privilege-escalation**.

---

## 3. Phase 2 : Exploitation Technique Pas-à-Pas

### A. Analyse de la Vulnérabilité
La faille provient d'une insuffisance de validation des contrôles d'accès et des données d'entrée au niveau de **CWE-345**. Le système interprète les paramètres non assainis sans barrière d'isolation.

### B. Élaboration du Vecteur d'Attaque
En appliquant la méthodologie offensive standard :
1. **Étape 1** : Injection du marqueur de diagnostic pour vérifier l'absence d'échappement.
2. **Étape 2** : Construction du payload weaponisé adapté à l'architecture cible.
3. **Étape 3** : Déclenchement de l'exécution et capture des privilèges.

```bash
# Exemple de commande d'exploitation standard
curl -s -X POST http://localhost:3333/targets/training/web-14-jwt-weak-secret/ \
  -H "Content-Type: application/json" \
  -d '{"exploit_vector": "jwt"}'
```

---

## 4. Phase 3 : Capture des Drapeaux & Validation des Tâches
Les drapeaux officiels validant la compromission des différentes étapes de la mission :

- **Décodage des claims du jeton** : `HS256` (40 pts)
- **Cassage de la clé de signature** : `secret123` (60 pts)
- **Fabrication du jeton admin & Flag** : `CYBERLAB{JWT_HS256_SECRET_KEY_CRACKED_ADMIN_FORGED}` (100 pts)

---

## 5. Recommandations de Remédiation (Mesures Défensives Blue Team)
1. **Application du principe de moindre privilège** (Least Privilege Principle) sur tous les comptes et processus.
2. **Validation stricte par liste blanche** des données en entrée (Input Sanitization) et requêtes préparées pour toutes les interactions en base.
3. **Mise à jour des composants logiciels** vers les versions patchées éliminant CWE-345.
4. **Cloisonnement réseau et conteneurs** : Interdiction du mode privileged, montage en lecture seule des volumes système.

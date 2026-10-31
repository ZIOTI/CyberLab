# Rapport d'Exploitation & Débriefing Technique // AuthKey RS256 to HS256 Key Confusion
**Organisation cible** : AuthKey Federated SSO Services  
**Système d'exploitation** : Linux | **Catégorie** : Web & APIs  
**Difficulté** : HARD | **Vecteur de vulnérabilité** : CWE-347  
**Classification** : DOCUMENT OFFICIEL DU LABORATOIRE CYBERLAB REDTEAM  

---

## 1. Contexte Opérationnel & Règles d'Engagement
La solution d'authentification AuthKey vérifie les jetons JWT à l'aide d'une clé publique RSA (RS256). Cependant, la bibliothèque de validation accepte également l'algorithme symétrique HS256 sans vérifier le type de clé attendu. Récupère la clé publique RSA du serveur (disponible publiquement) et utilise-la comme secret HMAC symétrique pour signer un jeton d'administrateur forgé.

L'évaluation a été menée dans un environnement strictement isolé. Aucun service de production réel n'a été impacté. L'objectif était d'auditer la sécurité du composant **jwt** et d'extraire les drapeaux de contrôle prouvant la faisabilité de l'attaque.

---

## 2. Phase 1 : Reconnaissance & Cartographie de la Surface d'Attaque
Une phase de reconnaissance passive et active permet d'identifier l'empreinte logicielle et les services en écoute :

```bash
# 1. Énumération des ports et bannières de service
nmap -sV -sC -p- 10.10.33.33 -oN nmap_initial_scan.txt

# 2. Découverte applicative locale
curl -i http://localhost:3333/targets/training/web-28-jwt-algorithm-confusion/
```

L'analyse des réponses HTTP et des bannières confirme la présence du composant vulnérable lié à **jwt, key-confusion, rs256-hs256, cryptography, sso**.

---

## 3. Phase 2 : Exploitation Technique Pas-à-Pas

### A. Analyse de la Vulnérabilité
La faille provient d'une insuffisance de validation des contrôles d'accès et des données d'entrée au niveau de **CWE-347**. Le système interprète les paramètres non assainis sans barrière d'isolation.

### B. Élaboration du Vecteur d'Attaque
En appliquant la méthodologie offensive standard :
1. **Étape 1** : Injection du marqueur de diagnostic pour vérifier l'absence d'échappement.
2. **Étape 2** : Construction du payload weaponisé adapté à l'architecture cible.
3. **Étape 3** : Déclenchement de l'exécution et capture des privilèges.

```bash
# Exemple de commande d'exploitation standard
curl -s -X POST http://localhost:3333/targets/training/web-28-jwt-algorithm-confusion/ \
  -H "Content-Type: application/json" \
  -d '{"exploit_vector": "jwt"}'
```

---

## 4. Phase 3 : Capture des Drapeaux & Validation des Tâches
Les drapeaux officiels validant la compromission des différentes étapes de la mission :

- **Extraction de la clé publique RSA** : `public.pem` (80 pts)
- **Modification de l'en-tête JWT (alg: HS256)** : `ALG_HS256_SET` (100 pts)
- **Signature avec la clé publique & Flag** : `CYBERLAB{JWT_RS256_TO_HS256_PUBLIC_KEY_CONFUSION_PWNED}` (170 pts)

---

## 5. Recommandations de Remédiation (Mesures Défensives Blue Team)
1. **Application du principe de moindre privilège** (Least Privilege Principle) sur tous les comptes et processus.
2. **Validation stricte par liste blanche** des données en entrée (Input Sanitization) et requêtes préparées pour toutes les interactions en base.
3. **Mise à jour des composants logiciels** vers les versions patchées éliminant CWE-347.
4. **Cloisonnement réseau et conteneurs** : Interdiction du mode privileged, montage en lecture seule des volumes système.

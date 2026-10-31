# Rapport d'Exploitation & Débriefing Technique // ECDSA Reused Nonce Private Key Recovery
**Organisation cible** : Blockchain Core Validator Gateway  
**Système d'exploitation** : Linux | **Catégorie** : Cryptographie  
**Difficulté** : INSANE | **Vecteur de vulnérabilité** : CWE-326  
**Classification** : DOCUMENT OFFICIEL DU LABORATOIRE CYBERLAB REDTEAM  

---

## 1. Contexte Opérationnel & Règles d'Engagement
Un validateur de transactions blockchain signe deux messages distincts (m1 et m2) avec le même nonce aléatoire k en utilisant l'algorithme ECDSA sur la courbe secp256k1 (la faille historique qui a compromis le système de signature PlayStation 3). En soustrayant les deux équations de signature (s1 - s2), calcule la valeur de k, puis déduis la clé privée maîtresse du validateur.

L'évaluation a été menée dans un environnement strictement isolé. Aucun service de production réel n'a été impacté. L'objectif était d'auditer la sécurité du composant **crypto** et d'extraire les drapeaux de contrôle prouvant la faisabilité de l'attaque.

---

## 2. Phase 1 : Reconnaissance & Cartographie de la Surface d'Attaque
Une phase de reconnaissance passive et active permet d'identifier l'empreinte logicielle et les services en écoute :

```bash
# 1. Énumération des ports et bannières de service
nmap -sV -sC -p- 10.10.52.147 -oN nmap_initial_scan.txt

# 2. Découverte applicative locale
curl -i http://localhost:3333/targets/training/crypto-10-zkp-elliptic/
```

L'analyse des réponses HTTP et des bannières confirme la présence du composant vulnérable lié à **crypto, ecdsa, secp256k1, nonce-reuse, elliptic-curve**.

---

## 3. Phase 2 : Exploitation Technique Pas-à-Pas

### A. Analyse de la Vulnérabilité
La faille provient d'une insuffisance de validation des contrôles d'accès et des données d'entrée au niveau de **CWE-326**. Le système interprète les paramètres non assainis sans barrière d'isolation.

### B. Élaboration du Vecteur d'Attaque
En appliquant la méthodologie offensive standard :
1. **Étape 1** : Injection du marqueur de diagnostic pour vérifier l'absence d'échappement.
2. **Étape 2** : Construction du payload weaponisé adapté à l'architecture cible.
3. **Étape 3** : Déclenchement de l'exécution et capture des privilèges.

```bash
# Exemple de commande d'exploitation standard
curl -s -X POST http://localhost:3333/targets/training/crypto-10-zkp-elliptic/ \
  -H "Content-Type: application/json" \
  -d '{"exploit_vector": "crypto"}'
```

---

## 4. Phase 3 : Capture des Drapeaux & Validation des Tâches
Les drapeaux officiels validant la compromission des différentes étapes de la mission :

- **Détection de la réutilisation de k (r1 == r2)** : `r` (100 pts)
- **Calcul du nonce éphémère k** : `k = (z1 - z2) / (s1 - s2) mod n` (150 pts)
- **Extraction de la clé privée secrète & Root Flag** : `CYBERLAB{ECDSA_REUSED_K_PRIVATE_KEY_LATTICE_RECOVERED}` (250 pts)

---

## 5. Recommandations de Remédiation (Mesures Défensives Blue Team)
1. **Application du principe de moindre privilège** (Least Privilege Principle) sur tous les comptes et processus.
2. **Validation stricte par liste blanche** des données en entrée (Input Sanitization) et requêtes préparées pour toutes les interactions en base.
3. **Mise à jour des composants logiciels** vers les versions patchées éliminant CWE-326.
4. **Cloisonnement réseau et conteneurs** : Interdiction du mode privileged, montage en lecture seule des volumes système.

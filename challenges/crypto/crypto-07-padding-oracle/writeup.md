# Rapport d'Exploitation & Débriefing Technique // Automated CBC Padding Oracle Decryption
**Organisation cible** : SecureVault Enterprise Micro-API  
**Système d'exploitation** : Linux | **Catégorie** : Cryptographie  
**Difficulté** : HARD | **Vecteur de vulnérabilité** : CWE-388  
**Classification** : DOCUMENT OFFICIEL DU LABORATOIRE CYBERLAB REDTEAM  

---

## 1. Contexte Opérationnel & Règles d'Engagement
L'API de chiffrement de cookies de SecureVault renvoie un message HTTP 500 'Invalid Padding' lorsque le bourrage PKCS#7 est corrompu, et HTTP 200 lorsqu'il est valide. En manipulant octet par octet le bloc précédent du texte chiffré (attaque de Vaudenay), interroge l'oracle pour déchiffrer l'intégralité du jeton sans posséder la clé secrète.

L'évaluation a été menée dans un environnement strictement isolé. Aucun service de production réel n'a été impacté. L'objectif était d'auditer la sécurité du composant **crypto** et d'extraire les drapeaux de contrôle prouvant la faisabilité de l'attaque.

---

## 2. Phase 1 : Reconnaissance & Cartographie de la Surface d'Attaque
Une phase de reconnaissance passive et active permet d'identifier l'empreinte logicielle et les services en écoute :

```bash
# 1. Énumération des ports et bannières de service
nmap -sV -sC -p- 10.10.18.69 -oN nmap_initial_scan.txt

# 2. Découverte applicative locale
curl -i http://localhost:3333/targets/training/crypto-07-padding-oracle/
```

L'analyse des réponses HTTP et des bannières confirme la présence du composant vulnérable lié à **crypto, padding-oracle, cbc, pkcs7, vaudenay**.

---

## 3. Phase 2 : Exploitation Technique Pas-à-Pas

### A. Analyse de la Vulnérabilité
La faille provient d'une insuffisance de validation des contrôles d'accès et des données d'entrée au niveau de **CWE-388**. Le système interprète les paramètres non assainis sans barrière d'isolation.

### B. Élaboration du Vecteur d'Attaque
En appliquant la méthodologie offensive standard :
1. **Étape 1** : Injection du marqueur de diagnostic pour vérifier l'absence d'échappement.
2. **Étape 2** : Construction du payload weaponisé adapté à l'architecture cible.
3. **Étape 3** : Déclenchement de l'exécution et capture des privilèges.

```bash
# Exemple de commande d'exploitation standard
curl -s -X POST http://localhost:3333/targets/training/crypto-07-padding-oracle/ \
  -H "Content-Type: application/json" \
  -d '{"exploit_vector": "crypto"}'
```

---

## 4. Phase 3 : Capture des Drapeaux & Validation des Tâches
Les drapeaux officiels validant la compromission des différentes étapes de la mission :

- **Détection de l'oracle de bourrage PKCS#7** : `500` (70 pts)
- **Déchiffrement du premier octet intermédiaire** : `0x01` (80 pts)
- **Déchiffrement complet & Flag** : `CYBERLAB{PADDING_ORACLE_DECRYPTOR_BLOCK_BY_BLOCK_DECIPHER}` (150 pts)

---

## 5. Recommandations de Remédiation (Mesures Défensives Blue Team)
1. **Application du principe de moindre privilège** (Least Privilege Principle) sur tous les comptes et processus.
2. **Validation stricte par liste blanche** des données en entrée (Input Sanitization) et requêtes préparées pour toutes les interactions en base.
3. **Mise à jour des composants logiciels** vers les versions patchées éliminant CWE-388.
4. **Cloisonnement réseau et conteneurs** : Interdiction du mode privileged, montage en lecture seule des volumes système.

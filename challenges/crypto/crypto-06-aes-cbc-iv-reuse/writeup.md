# Rapport d'Exploitation & Débriefing Technique // AES-CBC Reused IV Known Plaintext Attack
**Organisation cible** : AeroLink Satellite Telemetry  
**Système d'exploitation** : Linux | **Catégorie** : Cryptographie  
**Difficulté** : INTERMEDIATE | **Vecteur de vulnérabilité** : CWE-329  
**Classification** : DOCUMENT OFFICIEL DU LABORATOIRE CYBERLAB REDTEAM  

---

## 1. Contexte Opérationnel & Règles d'Engagement
Le récepteur de télémesure AeroLink chiffre les paquets de commande des drones avec AES-CBC en utilisant un vecteur d'initialisation (IV) fixe codé en dur pour toutes les sessions. Connaissant le premier bloc de texte en clair d'une commande de synchronisation standard, déchiffre le premier bloc de la commande classifiée transmise immédiatement après.

L'évaluation a été menée dans un environnement strictement isolé. Aucun service de production réel n'a été impacté. L'objectif était d'auditer la sécurité du composant **crypto** et d'extraire les drapeaux de contrôle prouvant la faisabilité de l'attaque.

---

## 2. Phase 1 : Reconnaissance & Cartographie de la Surface d'Attaque
Une phase de reconnaissance passive et active permet d'identifier l'empreinte logicielle et les services en écoute :

```bash
# 1. Énumération des ports et bannières de service
nmap -sV -sC -p- 10.10.40.54 -oN nmap_initial_scan.txt

# 2. Découverte applicative locale
curl -i http://localhost:3333/targets/training/crypto-06-aes-cbc-iv-reuse/
```

L'analyse des réponses HTTP et des bannières confirme la présence du composant vulnérable lié à **crypto, aes-cbc, iv-reuse, xor-cancellation, telemetry**.

---

## 3. Phase 2 : Exploitation Technique Pas-à-Pas

### A. Analyse de la Vulnérabilité
La faille provient d'une insuffisance de validation des contrôles d'accès et des données d'entrée au niveau de **CWE-329**. Le système interprète les paramètres non assainis sans barrière d'isolation.

### B. Élaboration du Vecteur d'Attaque
En appliquant la méthodologie offensive standard :
1. **Étape 1** : Injection du marqueur de diagnostic pour vérifier l'absence d'échappement.
2. **Étape 2** : Construction du payload weaponisé adapté à l'architecture cible.
3. **Étape 3** : Déclenchement de l'exécution et capture des privilèges.

```bash
# Exemple de commande d'exploitation standard
curl -s -X POST http://localhost:3333/targets/training/crypto-06-aes-cbc-iv-reuse/ \
  -H "Content-Type: application/json" \
  -d '{"exploit_vector": "crypto"}'
```

---

## 4. Phase 3 : Capture des Drapeaux & Validation des Tâches
Les drapeaux officiels validant la compromission des différentes étapes de la mission :

- **Vulnérabilité de l'IV fixe** : `C1 = E(P1 XOR IV)` (60 pts)
- **Annulation XOR & Flag** : `CYBERLAB{AES_CBC_FIXED_IV_KNOWN_PLAINTEXT_XOR_DECRYPT}` (140 pts)

---

## 5. Recommandations de Remédiation (Mesures Défensives Blue Team)
1. **Application du principe de moindre privilège** (Least Privilege Principle) sur tous les comptes et processus.
2. **Validation stricte par liste blanche** des données en entrée (Input Sanitization) et requêtes préparées pour toutes les interactions en base.
3. **Mise à jour des composants logiciels** vers les versions patchées éliminant CWE-329.
4. **Cloisonnement réseau et conteneurs** : Interdiction du mode privileged, montage en lecture seule des volumes système.

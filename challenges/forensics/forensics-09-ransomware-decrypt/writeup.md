# Rapport d'Exploitation & Débriefing Technique // Ransomware Master Key Recovery from Volatile RAM
**Organisation cible** : Cyber Crisis Emergency Response Team  
**Système d'exploitation** : Windows | **Catégorie** : Forensics & Mémoire  
**Difficulté** : INSANE | **Vecteur de vulnérabilité** : CWE-312  
**Classification** : DOCUMENT OFFICIEL DU LABORATOIRE CYBERLAB REDTEAM  

---

## 1. Contexte Opérationnel & Règles d'Engagement
Une attaque par rançongiciel a chiffré les bases de données d'un centre hospitalier avec AES-256. L'ordinateur de supervision a été gelé avant son extinction, préservant la mémoire vive de l'attaque. En utilisant le plugin aeskeyfind pour scanner les structures de tables de clés étendues (Key Schedule) dans le dump mémoire, extrais la clé AES-256 et déchiffre les fichiers vitaux sans payer la rançon.

L'évaluation a été menée dans un environnement strictement isolé. Aucun service de production réel n'a été impacté. L'objectif était d'auditer la sécurité du composant **forensics** et d'extraire les drapeaux de contrôle prouvant la faisabilité de l'attaque.

---

## 2. Phase 1 : Reconnaissance & Cartographie de la Surface d'Attaque
Une phase de reconnaissance passive et active permet d'identifier l'empreinte logicielle et les services en écoute :

```bash
# 1. Énumération des ports et bannières de service
nmap -sV -sC -p- 10.10.57.164 -oN nmap_initial_scan.txt

# 2. Découverte applicative locale
curl -i http://localhost:3333/targets/training/forensics-09-ransomware-decrypt/
```

L'analyse des réponses HTTP et des bannières confirme la présence du composant vulnérable lié à **forensics, ransomware, aes-key-schedule, volatility, incident-response**.

---

## 3. Phase 2 : Exploitation Technique Pas-à-Pas

### A. Analyse de la Vulnérabilité
La faille provient d'une insuffisance de validation des contrôles d'accès et des données d'entrée au niveau de **CWE-312**. Le système interprète les paramètres non assainis sans barrière d'isolation.

### B. Élaboration du Vecteur d'Attaque
En appliquant la méthodologie offensive standard :
1. **Étape 1** : Injection du marqueur de diagnostic pour vérifier l'absence d'échappement.
2. **Étape 2** : Construction du payload weaponisé adapté à l'architecture cible.
3. **Étape 3** : Déclenchement de l'exécution et capture des privilèges.

```bash
# Exemple de commande d'exploitation standard
curl -s -X POST http://localhost:3333/targets/training/forensics-09-ransomware-decrypt/ \
  -H "Content-Type: application/json" \
  -d '{"exploit_vector": "forensics"}'
```

---

## 4. Phase 3 : Capture des Drapeaux & Validation des Tâches
Les drapeaux officiels validant la compromission des différentes étapes de la mission :

- **Localisation de la clé AES dans l'espace mémoire** : `aeskeyfind` (100 pts)
- **Extraction de la clé AES 256 bits (User Flag)** : `CYBERLAB{user_ransomware_aes_256_key_carved_success}` (150 pts)
- **Restauration complète de la base de données & Root Flag** : `CYBERLAB{AES_EXPANDED_KEY_SCHEDULE_IN_RAM_CARVED_CLEARED}` (200 pts)

---

## 5. Recommandations de Remédiation (Mesures Défensives Blue Team)
1. **Application du principe de moindre privilège** (Least Privilege Principle) sur tous les comptes et processus.
2. **Validation stricte par liste blanche** des données en entrée (Input Sanitization) et requêtes préparées pour toutes les interactions en base.
3. **Mise à jour des composants logiciels** vers les versions patchées éliminant CWE-312.
4. **Cloisonnement réseau et conteneurs** : Interdiction du mode privileged, montage en lecture seule des volumes système.

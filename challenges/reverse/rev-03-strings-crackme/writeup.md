# Rapport d'Exploitation & Débriefing Technique // ELF Binary Hardcoded Validation Crackme
**Organisation cible** : Aegis Binary Analysis Unit  
**Système d'exploitation** : Linux | **Catégorie** : Reverse Engineering  
**Difficulté** : BEGINNER | **Vecteur de vulnérabilité** : CWE-312  
**Classification** : DOCUMENT OFFICIEL DU LABORATOIRE CYBERLAB REDTEAM  

---

## 1. Contexte Opérationnel & Règles d'Engagement
Un exécutable Linux ELF x86_64 demande un mot de passe d'activation. L'ingénieur novice a stocké la clé de validation directement en clair dans la section de données en lecture seule (.rodata) du binaire. Utilise l'utilitaire strings ou l'explorateur Ghidra pour extraire la chaîne secrète sans exécuter le fichier.

L'évaluation a été menée dans un environnement strictement isolé. Aucun service de production réel n'a été impacté. L'objectif était d'auditer la sécurité du composant **reverse** et d'extraire les drapeaux de contrôle prouvant la faisabilité de l'attaque.

---

## 2. Phase 1 : Reconnaissance & Cartographie de la Surface d'Attaque
Une phase de reconnaissance passive et active permet d'identifier l'empreinte logicielle et les services en écoute :

```bash
# 1. Énumération des ports et bannières de service
nmap -sV -sC -p- 10.10.28.59 -oN nmap_initial_scan.txt

# 2. Découverte applicative locale
curl -i http://localhost:3333/targets/training/rev-03-strings-crackme/
```

L'analyse des réponses HTTP et des bannières confirme la présence du composant vulnérable lié à **reverse, elf, strings, crackme, binary**.

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
curl -s -X POST http://localhost:3333/targets/training/rev-03-strings-crackme/ \
  -H "Content-Type: application/json" \
  -d '{"exploit_vector": "reverse"}'
```

---

## 4. Phase 3 : Capture des Drapeaux & Validation des Tâches
Les drapeaux officiels validant la compromission des différentes étapes de la mission :

- **Extraction des chaînes imprimables** : `strings` (40 pts)
- **Validation du mot de passe & Flag** : `CYBERLAB{STRINGS_COMMAND_REVEALED_HARDCODED_KEY}` (60 pts)

---

## 5. Recommandations de Remédiation (Mesures Défensives Blue Team)
1. **Application du principe de moindre privilège** (Least Privilege Principle) sur tous les comptes et processus.
2. **Validation stricte par liste blanche** des données en entrée (Input Sanitization) et requêtes préparées pour toutes les interactions en base.
3. **Mise à jour des composants logiciels** vers les versions patchées éliminant CWE-312.
4. **Cloisonnement réseau et conteneurs** : Interdiction du mode privileged, montage en lecture seule des volumes système.

# Rapport d'Exploitation & Débriefing Technique // Classic 32-bit Stack Smash & RIP Overwrite
**Organisation cible** : Legacy C Firmware Systems  
**Système d'exploitation** : Linux | **Catégorie** : Pwn & Exploitation Mémoire  
**Difficulté** : INTERMEDIATE | **Vecteur de vulnérabilité** : CWE-121  
**Classification** : DOCUMENT OFFICIEL DU LABORATOIRE CYBERLAB REDTEAM  

---

## 1. Contexte Opérationnel & Règles d'Engagement
Un service réseau développé en C utilise la fonction non sécurisée gets() pour lire l'identifiant de session sans vérifier la taille du tampon alloué (64 octets). En calculant l'offset exact écrasant le pointeur d'instruction (EIP/RIP) avec un pattern cyclique GDB, redirige le flux d'exécution vers l'adresse de la fonction secrète print_flag() présente dans le binaire.

L'évaluation a été menée dans un environnement strictement isolé. Aucun service de production réel n'a été impacté. L'objectif était d'auditer la sécurité du composant **pwn** et d'extraire les drapeaux de contrôle prouvant la faisabilité de l'attaque.

---

## 2. Phase 1 : Reconnaissance & Cartographie de la Surface d'Attaque
Une phase de reconnaissance passive et active permet d'identifier l'empreinte logicielle et les services en écoute :

```bash
# 1. Énumération des ports et bannières de service
nmap -sV -sC -p- 10.10.32.143 -oN nmap_initial_scan.txt

# 2. Découverte applicative locale
curl -i http://localhost:3333/targets/training/pwn-01-bof-stack-simple/
```

L'analyse des réponses HTTP et des bannières confirme la présence du composant vulnérable lié à **pwn, bof, buffer-overflow, x86, ghidra**.

---

## 3. Phase 2 : Exploitation Technique Pas-à-Pas

### A. Analyse de la Vulnérabilité
La faille provient d'une insuffisance de validation des contrôles d'accès et des données d'entrée au niveau de **CWE-121**. Le système interprète les paramètres non assainis sans barrière d'isolation.

### B. Élaboration du Vecteur d'Attaque
En appliquant la méthodologie offensive standard :
1. **Étape 1** : Injection du marqueur de diagnostic pour vérifier l'absence d'échappement.
2. **Étape 2** : Construction du payload weaponisé adapté à l'architecture cible.
3. **Étape 3** : Déclenchement de l'exécution et capture des privilèges.

```bash
# Exemple de commande d'exploitation standard
curl -s -X POST http://localhost:3333/targets/training/pwn-01-bof-stack-simple/ \
  -H "Content-Type: application/json" \
  -d '{"exploit_vector": "pwn"}'
```

---

## 4. Phase 3 : Capture des Drapeaux & Validation des Tâches
Les drapeaux officiels validant la compromission des différentes étapes de la mission :

- **Calcul de l'offset du registre d'instruction** : `72` (50 pts)
- **Localisation de la fonction cible** : `0x08048536` (50 pts)
- **Construction du payload & Flag** : `CYBERLAB{BUFFER_OVERFLOW_EIP_OVERWRITE_WIN_FUNC_CALLED}` (100 pts)

---

## 5. Recommandations de Remédiation (Mesures Défensives Blue Team)
1. **Application du principe de moindre privilège** (Least Privilege Principle) sur tous les comptes et processus.
2. **Validation stricte par liste blanche** des données en entrée (Input Sanitization) et requêtes préparées pour toutes les interactions en base.
3. **Mise à jour des composants logiciels** vers les versions patchées éliminant CWE-121.
4. **Cloisonnement réseau et conteneurs** : Interdiction du mode privileged, montage en lecture seule des volumes système.

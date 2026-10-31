# Rapport d'Exploitation & Débriefing Technique // 64-bit Return-Oriented Programming (ROP) Chain
**Organisation cible** : SecOps Native Security Guard  
**Système d'exploitation** : Linux | **Catégorie** : Pwn & Exploitation Mémoire  
**Difficulté** : INSANE | **Vecteur de vulnérabilité** : CWE-121  
**Classification** : DOCUMENT OFFICIEL DU LABORATOIRE CYBERLAB REDTEAM  

---

## 1. Contexte Opérationnel & Règles d'Engagement
Sur une architecture x86_64, les arguments de fonction sont transmis via des registres (RDI, RSI, RDX...) et non plus sur la pile. En inspectant le binaire statique à l'aide de ROPgadget, sélectionne des séquences d'instructions se terminant par ret (gadgets) pour charger l'adresse de '/bin/sh' dans RDI, mettre RAX à 59 (numéro de syscall execve), mettre RSI et RDX à 0, et déclencher l'appel système syscall.

L'évaluation a été menée dans un environnement strictement isolé. Aucun service de production réel n'a été impacté. L'objectif était d'auditer la sécurité du composant **pwn** et d'extraire les drapeaux de contrôle prouvant la faisabilité de l'attaque.

---

## 2. Phase 1 : Reconnaissance & Cartographie de la Surface d'Attaque
Une phase de reconnaissance passive et active permet d'identifier l'empreinte logicielle et les services en écoute :

```bash
# 1. Énumération des ports et bannières de service
nmap -sV -sC -p- 10.10.26.152 -oN nmap_initial_scan.txt

# 2. Découverte applicative locale
curl -i http://localhost:3333/targets/training/pwn-04-rop-x64-execve/
```

L'analyse des réponses HTTP et des bannières confirme la présence du composant vulnérable lié à **pwn, rop, x64, syscall, gadgets**.

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
curl -s -X POST http://localhost:3333/targets/training/pwn-04-rop-x64-execve/ \
  -H "Content-Type: application/json" \
  -d '{"exploit_vector": "pwn"}'
```

---

## 4. Phase 3 : Capture des Drapeaux & Validation des Tâches
Les drapeaux officiels validant la compromission des différentes étapes de la mission :

- **Recherche du gadget pop rdi ; ret** : `GADGET_POP_RDI_FOUND` (90 pts)
- **Numéro d'appel système execve** : `0x3b` (110 pts)
- **Assemblage de la chaîne ROP & Root Flag** : `CYBERLAB{X64_ROP_GADGETS_POP_RDI_RAX_SYSCALL_EXECVE_ROOT}` (250 pts)

---

## 5. Recommandations de Remédiation (Mesures Défensives Blue Team)
1. **Application du principe de moindre privilège** (Least Privilege Principle) sur tous les comptes et processus.
2. **Validation stricte par liste blanche** des données en entrée (Input Sanitization) et requêtes préparées pour toutes les interactions en base.
3. **Mise à jour des composants logiciels** vers les versions patchées éliminant CWE-121.
4. **Cloisonnement réseau et conteneurs** : Interdiction du mode privileged, montage en lecture seule des volumes système.

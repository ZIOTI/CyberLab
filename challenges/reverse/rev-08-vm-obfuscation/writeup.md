# Rapport d'Exploitation & Débriefing Technique // Custom Virtual Machine Bytecode Dispatcher
**Organisation cible** : Commercial DRM Licensing Core  
**Système d'exploitation** : Linux | **Catégorie** : Reverse Engineering  
**Difficulté** : INSANE | **Vecteur de vulnérabilité** : CWE-20  
**Classification** : DOCUMENT OFFICIEL DU LABORATOIRE CYBERLAB REDTEAM  

---

## 1. Contexte Opérationnel & Règles d'Engagement
Le binaire intègre un moteur de machine virtuelle personnalisée (VM-based Obfuscation) avec un dispatcheur d'opcodes sur boucle switch-case. Les instructions x86 natives ont été traduites dans un bytecode propriétaire non documenté opérant sur des registres virtuels (V_REG0 à V_REG7). Écris un émulateur ou un désassembleur pour cartographier les 12 opcodes de la VM et extraire la clé de licence.

L'évaluation a été menée dans un environnement strictement isolé. Aucun service de production réel n'a été impacté. L'objectif était d'auditer la sécurité du composant **reverse** et d'extraire les drapeaux de contrôle prouvant la faisabilité de l'attaque.

---

## 2. Phase 1 : Reconnaissance & Cartographie de la Surface d'Attaque
Une phase de reconnaissance passive et active permet d'identifier l'empreinte logicielle et les services en écoute :

```bash
# 1. Énumération des ports et bannières de service
nmap -sV -sC -p- 10.10.16.166 -oN nmap_initial_scan.txt

# 2. Découverte applicative locale
curl -i http://localhost:3333/targets/training/rev-08-vm-obfuscation/
```

L'analyse des réponses HTTP et des bannières confirme la présence du composant vulnérable lié à **reverse, vm-obfuscation, virtual-machine, bytecode, dispatcher**.

---

## 3. Phase 2 : Exploitation Technique Pas-à-Pas

### A. Analyse de la Vulnérabilité
La faille provient d'une insuffisance de validation des contrôles d'accès et des données d'entrée au niveau de **CWE-20**. Le système interprète les paramètres non assainis sans barrière d'isolation.

### B. Élaboration du Vecteur d'Attaque
En appliquant la méthodologie offensive standard :
1. **Étape 1** : Injection du marqueur de diagnostic pour vérifier l'absence d'échappement.
2. **Étape 2** : Construction du payload weaponisé adapté à l'architecture cible.
3. **Étape 3** : Déclenchement de l'exécution et capture des privilèges.

```bash
# Exemple de commande d'exploitation standard
curl -s -X POST http://localhost:3333/targets/training/rev-08-vm-obfuscation/ \
  -H "Content-Type: application/json" \
  -d '{"exploit_vector": "reverse"}'
```

---

## 4. Phase 3 : Capture des Drapeaux & Validation des Tâches
Les drapeaux officiels validant la compromission des différentes étapes de la mission :

- **Repérage de la table des pointeurs de fonction (Jump Table)** : `12` (100 pts)
- **Désassemblage du bytecode propriétaire (User Flag)** : `CYBERLAB{user_vm_bytecode_dispatcher_emulated_step}` (150 pts)
- **Extraction de la clé maîtresse & Root Flag** : `CYBERLAB{VIRTUAL_MACHINE_DISPATCHER_EMULATION_CRACKED}` (200 pts)

---

## 5. Recommandations de Remédiation (Mesures Défensives Blue Team)
1. **Application du principe de moindre privilège** (Least Privilege Principle) sur tous les comptes et processus.
2. **Validation stricte par liste blanche** des données en entrée (Input Sanitization) et requêtes préparées pour toutes les interactions en base.
3. **Mise à jour des composants logiciels** vers les versions patchées éliminant CWE-20.
4. **Cloisonnement réseau et conteneurs** : Interdiction du mode privileged, montage en lecture seule des volumes système.

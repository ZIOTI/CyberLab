# Rapport d'Exploitation & Débriefing Technique // Heap Use-After-Free & Tcache Poisoning
**Organisation cible** : High-Frequency Trading Engine  
**Système d'exploitation** : Linux | **Catégorie** : Pwn & Exploitation Mémoire  
**Difficulté** : INSANE | **Vecteur de vulnérabilité** : CWE-416  
**Classification** : DOCUMENT OFFICIEL DU LABORATOIRE CYBERLAB REDTEAM  

---

## 1. Contexte Opérationnel & Règles d'Engagement
Le moteur de gestion de carnets d'ordres alloue et libère des blocs de mémoire sur le tas (Heap). Lorsqu'un ordre d'achat est annulé, le pointeur de structure n'est pas réinitialisé à NULL (Dangling pointer). En réallouant un bloc de même taille dans le tcache de la glibc (Tcache Poisoning), corromps le pointeur avant (fd) pour allouer un bloc arbitraire sur le pointeur __free_hook et déclencher un shell.

L'évaluation a été menée dans un environnement strictement isolé. Aucun service de production réel n'a été impacté. L'objectif était d'auditer la sécurité du composant **heap** et d'extraire les drapeaux de contrôle prouvant la faisabilité de l'attaque.

---

## 2. Phase 1 : Reconnaissance & Cartographie de la Surface d'Attaque
Une phase de reconnaissance passive et active permet d'identifier l'empreinte logicielle et les services en écoute :

```bash
# 1. Énumération des ports et bannières de service
nmap -sV -sC -p- 10.10.28.70 -oN nmap_initial_scan.txt

# 2. Découverte applicative locale
curl -i http://localhost:3333/targets/training/pwn-05-heap-uaf/
```

L'analyse des réponses HTTP et des bannières confirme la présence du composant vulnérable lié à **heap, use-after-free, tcache, fastbin, glibc-pwn**.

---

## 3. Phase 2 : Exploitation Technique Pas-à-Pas

### A. Analyse de la Vulnérabilité
La faille provient d'une insuffisance de validation des contrôles d'accès et des données d'entrée au niveau de **CWE-416**. Le système interprète les paramètres non assainis sans barrière d'isolation.

### B. Élaboration du Vecteur d'Attaque
En appliquant la méthodologie offensive standard :
1. **Étape 1** : Injection du marqueur de diagnostic pour vérifier l'absence d'échappement.
2. **Étape 2** : Construction du payload weaponisé adapté à l'architecture cible.
3. **Étape 3** : Déclenchement de l'exécution et capture des privilèges.

```bash
# Exemple de commande d'exploitation standard
curl -s -X POST http://localhost:3333/targets/training/pwn-05-heap-uaf/ \
  -H "Content-Type: application/json" \
  -d '{"exploit_vector": "heap"}'
```

---

## 4. Phase 3 : Capture des Drapeaux & Validation des Tâches
Les drapeaux officiels validant la compromission des différentes étapes de la mission :

- **Détection du pointeur suspendu (Dangling Pointer)** : `UAF_TRIGGERED_SUCCESS` (100 pts)
- **Corruption du pointeur forward tcache (User Flag)** : `CYBERLAB{user_tcache_poisoning_arbitrary_chunk_allocated}` (150 pts)
- **Écrasement de __free_hook & Root Flag** : `CYBERLAB{HEAP_UAF_FASTBIN_TCACHE_POISON_ALLOC_STACK}` (250 pts)

---

## 5. Recommandations de Remédiation (Mesures Défensives Blue Team)
1. **Application du principe de moindre privilège** (Least Privilege Principle) sur tous les comptes et processus.
2. **Validation stricte par liste blanche** des données en entrée (Input Sanitization) et requêtes préparées pour toutes les interactions en base.
3. **Mise à jour des composants logiciels** vers les versions patchées éliminant CWE-416.
4. **Cloisonnement réseau et conteneurs** : Interdiction du mode privileged, montage en lecture seule des volumes système.

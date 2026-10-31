# Rapport d'Exploitation & Débriefing Technique // Bypassing PE IsDebuggerPresent & PEB Detection
**Organisation cible** : FinTech Desktop Security Core  
**Système d'exploitation** : Windows | **Catégorie** : Reverse Engineering  
**Difficulté** : HARD | **Vecteur de vulnérabilité** : CWE-20  
**Classification** : DOCUMENT OFFICIEL DU LABORATOIRE CYBERLAB REDTEAM  

---

## 1. Contexte Opérationnel & Règles d'Engagement
Un agent Windows PE intègre des techniques sophistiquées d'anti-débogage : appel à l'API IsDebuggerPresent(), inspection manuelle du champ BeingDebugged dans le Process Environment Block (PEB) à fs:[0x30], et mesure du temps avec rdtsc pour détecter les points d'arrêt. Utilise x64dbg avec le plugin ScyllaHide pour contourner ces défenses et déchiffrer la charge utile.

L'évaluation a été menée dans un environnement strictement isolé. Aucun service de production réel n'a été impacté. L'objectif était d'auditer la sécurité du composant **reverse** et d'extraire les drapeaux de contrôle prouvant la faisabilité de l'attaque.

---

## 2. Phase 1 : Reconnaissance & Cartographie de la Surface d'Attaque
Une phase de reconnaissance passive et active permet d'identifier l'empreinte logicielle et les services en écoute :

```bash
# 1. Énumération des ports et bannières de service
nmap -sV -sC -p- 10.10.33.12 -oN nmap_initial_scan.txt

# 2. Découverte applicative locale
curl -i http://localhost:3333/targets/training/rev-06-anti-debug-pe/
```

L'analyse des réponses HTTP et des bannières confirme la présence du composant vulnérable lié à **reverse, anti-debugging, peb, isdebuggerpresent, x64dbg**.

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
curl -s -X POST http://localhost:3333/targets/training/rev-06-anti-debug-pe/ \
  -H "Content-Type: application/json" \
  -d '{"exploit_vector": "reverse"}'
```

---

## 4. Phase 3 : Capture des Drapeaux & Validation des Tâches
Les drapeaux officiels validant la compromission des différentes étapes de la mission :

- **Structure Windows contenant le drapeau BeingDebugged** : `PEB` (80 pts)
- **Instruction x86 de mesure des cycles processeur** : `rdtsc` (80 pts)
- **Contournement et extraction & Flag** : `CYBERLAB{PEB_BEING_DEBUGGED_FLAG_BYPASS_KEY_UNLOCKED}` (140 pts)

---

## 5. Recommandations de Remédiation (Mesures Défensives Blue Team)
1. **Application du principe de moindre privilège** (Least Privilege Principle) sur tous les comptes et processus.
2. **Validation stricte par liste blanche** des données en entrée (Input Sanitization) et requêtes préparées pour toutes les interactions en base.
3. **Mise à jour des composants logiciels** vers les versions patchées éliminant CWE-20.
4. **Cloisonnement réseau et conteneurs** : Interdiction du mode privileged, montage en lecture seule des volumes système.

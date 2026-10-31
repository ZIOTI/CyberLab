# Rapport d'Exploitation & Débriefing Technique // Polkit pkexec Local Privilege Escalation (PwnKit)
**Organisation cible** : Standard Enterprise Linux Workstation  
**Système d'exploitation** : Linux | **Catégorie** : Systèmes & Active Directory  
**Difficulté** : HARD | **Vecteur de vulnérabilité** : CVE-2021-4034  
**Classification** : DOCUMENT OFFICIEL DU LABORATOIRE CYBERLAB REDTEAM  

---

## 1. Contexte Opérationnel & Règles d'Engagement
L'exécutable SUID pkexec du framework Polkit est vulnérable à un dépassement d'indice mémoire hors-limites (Out-of-Bounds) lorsqu'il est invoqué avec argc=0. En injectant des variables d'environnement non assainies (GCONV_PATH), charge une bibliothèque partagée malveillante pour devenir root instantanément.

L'évaluation a été menée dans un environnement strictement isolé. Aucun service de production réel n'a été impacté. L'objectif était d'auditer la sécurité du composant **linux** et d'extraire les drapeaux de contrôle prouvant la faisabilité de l'attaque.

---

## 2. Phase 1 : Reconnaissance & Cartographie de la Surface d'Attaque
Une phase de reconnaissance passive et active permet d'identifier l'empreinte logicielle et les services en écoute :

```bash
# 1. Énumération des ports et bannières de service
nmap -sV -sC -p- 10.10.38.135 -oN nmap_initial_scan.txt

# 2. Découverte applicative locale
curl -i http://localhost:3333/targets/training/linux-08-pwnkit-cve/
```

L'analyse des réponses HTTP et des bannières confirme la présence du composant vulnérable lié à **linux, pwnkit, cve-2021-4034, polkit, memory-corruption**.

---

## 3. Phase 2 : Exploitation Technique Pas-à-Pas

### A. Analyse de la Vulnérabilité
La faille provient d'une insuffisance de validation des contrôles d'accès et des données d'entrée au niveau de **CVE-2021-4034**. Le système interprète les paramètres non assainis sans barrière d'isolation.

### B. Élaboration du Vecteur d'Attaque
En appliquant la méthodologie offensive standard :
1. **Étape 1** : Injection du marqueur de diagnostic pour vérifier l'absence d'échappement.
2. **Étape 2** : Construction du payload weaponisé adapté à l'architecture cible.
3. **Étape 3** : Déclenchement de l'exécution et capture des privilèges.

```bash
# Exemple de commande d'exploitation standard
curl -s -X POST http://localhost:3333/targets/training/linux-08-pwnkit-cve/ \
  -H "Content-Type: application/json" \
  -d '{"exploit_vector": "linux"}'
```

---

## 4. Phase 3 : Capture des Drapeaux & Validation des Tâches
Les drapeaux officiels validant la compromission des différentes étapes de la mission :

- **Binaire ciblé par PwnKit** : `pkexec` (60 pts)
- **Variable d'environnement de chargement de bibliothèque** : `GCONV_PATH` (80 pts)
- **Exécution du PoC & Root Flag** : `CYBERLAB{PWNKIT_POLKIT_PKEXEC_LOCAL_ROOT_CLEARED_2026}` (160 pts)

---

## 5. Recommandations de Remédiation (Mesures Défensives Blue Team)
1. **Application du principe de moindre privilège** (Least Privilege Principle) sur tous les comptes et processus.
2. **Validation stricte par liste blanche** des données en entrée (Input Sanitization) et requêtes préparées pour toutes les interactions en base.
3. **Mise à jour des composants logiciels** vers les versions patchées éliminant CVE-2021-4034.
4. **Cloisonnement réseau et conteneurs** : Interdiction du mode privileged, montage en lecture seule des volumes système.

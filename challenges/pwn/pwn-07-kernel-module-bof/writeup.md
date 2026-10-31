# Rapport d'Exploitation & Débriefing Technique // Custom Linux Kernel Driver IOCTL Buffer Overflow
**Organisation cible** : Industrial Hardware Interface Driver  
**Système d'exploitation** : Linux | **Catégorie** : Pwn & Exploitation Mémoire  
**Difficulté** : INSANE | **Vecteur de vulnérabilité** : CWE-121  
**Classification** : DOCUMENT OFFICIEL DU LABORATOIRE CYBERLAB REDTEAM  

---

## 1. Contexte Opérationnel & Règles d'Engagement
Un pilote de périphérique noyau (/dev/vulndrv) implémente un gestionnaire de requêtes ioctl() qui copie les données de l'espace utilisateur (copy_from_user) dans un tampon de pile noyau de taille fixe sans contrôle de longueur. Exploite ce débordement de tampon dans l'espace Ring 0 pour écraser l'adresse de retour du noyau et exécuter commit_creds(prepare_kernel_cred(0)) afin de basculer en root.

L'évaluation a été menée dans un environnement strictement isolé. Aucun service de production réel n'a été impacté. L'objectif était d'auditer la sécurité du composant **kernel-pwn** et d'extraire les drapeaux de contrôle prouvant la faisabilité de l'attaque.

---

## 2. Phase 1 : Reconnaissance & Cartographie de la Surface d'Attaque
Une phase de reconnaissance passive et active permet d'identifier l'empreinte logicielle et les services en écoute :

```bash
# 1. Énumération des ports et bannières de service
nmap -sV -sC -p- 10.10.35.184 -oN nmap_initial_scan.txt

# 2. Découverte applicative locale
curl -i http://localhost:3333/targets/training/pwn-07-kernel-module-bof/
```

L'analyse des réponses HTTP et des bannières confirme la présence du composant vulnérable lié à **kernel-pwn, ioctl, ring0, commit_creds, privesc**.

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
curl -s -X POST http://localhost:3333/targets/training/pwn-07-kernel-module-bof/ \
  -H "Content-Type: application/json" \
  -d '{"exploit_vector": "kernel-pwn"}'
```

---

## 4. Phase 3 : Capture des Drapeaux & Validation des Tâches
Les drapeaux officiels validant la compromission des différentes étapes de la mission :

- **Numéro de commande IOCTL vulnérable** : `0x1337` (100 pts)
- **Adresse de la fonction noyau commit_creds (User Flag)** : `CYBERLAB{user_kallsyms_kernel_credentials_resolved}` (150 pts)
- **Élévation Ring 0 vers Root & Root Flag** : `CYBERLAB{KERNEL_MODULE_IOCTL_RING0_COMMIT_CREDS_ROOT}` (250 pts)

---

## 5. Recommandations de Remédiation (Mesures Défensives Blue Team)
1. **Application du principe de moindre privilège** (Least Privilege Principle) sur tous les comptes et processus.
2. **Validation stricte par liste blanche** des données en entrée (Input Sanitization) et requêtes préparées pour toutes les interactions en base.
3. **Mise à jour des composants logiciels** vers les versions patchées éliminant CWE-121.
4. **Cloisonnement réseau et conteneurs** : Interdiction du mode privileged, montage en lecture seule des volumes système.

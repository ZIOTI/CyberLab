# Rapport d'Exploitation & Débriefing Technique // The Orphaned SUID Shell
**Organisation cible** : Stark Manufacturing Linux Gateway  
**Système d'exploitation** : Linux | **Catégorie** : Systèmes & Active Directory  
**Difficulté** : BEGINNER | **Vecteur de vulnérabilité** : CWE-272  
**Classification** : DOCUMENT OFFICIEL DU LABORATOIRE CYBERLAB REDTEAM  

---

## 1. Contexte Opérationnel & Règles d'Engagement
Un administrateur système pressé a configuré le bit de permission SUID (Set User ID) sur un binaire administratif /opt/maintenance/sysbackup appartenant à root. En inspectant les droits spéciaux sur le système de fichiers, découvre le binaire privilégié et invoque-le avec l'argument approprié pour ouvrir un shell root instantané.

L'évaluation a été menée dans un environnement strictement isolé. Aucun service de production réel n'a été impacté. L'objectif était d'auditer la sécurité du composant **linux** et d'extraire les drapeaux de contrôle prouvant la faisabilité de l'attaque.

---

## 2. Phase 1 : Reconnaissance & Cartographie de la Surface d'Attaque
Une phase de reconnaissance passive et active permet d'identifier l'empreinte logicielle et les services en écoute :

```bash
# 1. Énumération des ports et bannières de service
nmap -sV -sC -p- 10.10.24.61 -oN nmap_initial_scan.txt

# 2. Découverte applicative locale
curl -i http://localhost:3333/targets/training/linux-01-suid-bash/
```

L'analyse des réponses HTTP et des bannières confirme la présence du composant vulnérable lié à **linux, suid, privesc, gtfobins, bash**.

---

## 3. Phase 2 : Exploitation Technique Pas-à-Pas

### A. Analyse de la Vulnérabilité
La faille provient d'une insuffisance de validation des contrôles d'accès et des données d'entrée au niveau de **CWE-272**. Le système interprète les paramètres non assainis sans barrière d'isolation.

### B. Élaboration du Vecteur d'Attaque
En appliquant la méthodologie offensive standard :
1. **Étape 1** : Injection du marqueur de diagnostic pour vérifier l'absence d'échappement.
2. **Étape 2** : Construction du payload weaponisé adapté à l'architecture cible.
3. **Étape 3** : Déclenchement de l'exécution et capture des privilèges.

```bash
# Exemple de commande d'exploitation standard
curl -s -X POST http://localhost:3333/targets/training/linux-01-suid-bash/ \
  -H "Content-Type: application/json" \
  -d '{"exploit_vector": "linux"}'
```

---

## 4. Phase 3 : Capture des Drapeaux & Validation des Tâches
Les drapeaux officiels validant la compromission des différentes étapes de la mission :

- **Recherche des fichiers SUID sur le système** : `find / -perm -4000` (30 pts)
- **Identification du binaire vulnérable** : `sysbackup` (30 pts)
- **Obtention du shell root & Flag** : `CYBERLAB{SUID_BASH_ROOT_PRIVILEGE_ESCALATION_SUCCESS_883}` (40 pts)

---

## 5. Recommandations de Remédiation (Mesures Défensives Blue Team)
1. **Application du principe de moindre privilège** (Least Privilege Principle) sur tous les comptes et processus.
2. **Validation stricte par liste blanche** des données en entrée (Input Sanitization) et requêtes préparées pour toutes les interactions en base.
3. **Mise à jour des composants logiciels** vers les versions patchées éliminant CWE-272.
4. **Cloisonnement réseau et conteneurs** : Interdiction du mode privileged, montage en lecture seule des volumes système.

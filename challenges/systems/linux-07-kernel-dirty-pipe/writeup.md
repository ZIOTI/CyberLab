# Rapport d'Exploitation & Débriefing Technique // Dirty Pipe CVE-2022-0847 Kernel Memory Overwrite
**Organisation cible** : Titan Core Cloud Hypervisor  
**Système d'exploitation** : Linux | **Catégorie** : Systèmes & Active Directory  
**Difficulté** : INSANE | **Vecteur de vulnérabilité** : CVE-2022-0847  
**Classification** : DOCUMENT OFFICIEL DU LABORATOIRE CYBERLAB REDTEAM  

---

## 1. Contexte Opérationnel & Règles d'Engagement
Le serveur exécute un noyau Linux 5.15 vulnérable à la faille Dirty Pipe (CVE-2022-0847). En manipulant les drapeaux PIPE_BUF_FLAG_CAN_MERGE sur un tube (pipe) après un appel splice(), écris des données arbitraires directement dans le cache de page du fichier /etc/passwd en lecture seule pour remplacer le mot de passe root et obtenir les pleins pouvoirs système.

L'évaluation a été menée dans un environnement strictement isolé. Aucun service de production réel n'a été impacté. L'objectif était d'auditer la sécurité du composant **kernel-exploit** et d'extraire les drapeaux de contrôle prouvant la faisabilité de l'attaque.

---

## 2. Phase 1 : Reconnaissance & Cartographie de la Surface d'Attaque
Une phase de reconnaissance passive et active permet d'identifier l'empreinte logicielle et les services en écoute :

```bash
# 1. Énumération des ports et bannières de service
nmap -sV -sC -p- 10.10.32.170 -oN nmap_initial_scan.txt

# 2. Découverte applicative locale
curl -i http://localhost:3333/targets/training/linux-07-kernel-dirty-pipe/
```

L'analyse des réponses HTTP et des bannières confirme la présence du composant vulnérable lié à **kernel-exploit, dirty-pipe, cve-2022-0847, page-cache, privesc**.

---

## 3. Phase 2 : Exploitation Technique Pas-à-Pas

### A. Analyse de la Vulnérabilité
La faille provient d'une insuffisance de validation des contrôles d'accès et des données d'entrée au niveau de **CVE-2022-0847**. Le système interprète les paramètres non assainis sans barrière d'isolation.

### B. Élaboration du Vecteur d'Attaque
En appliquant la méthodologie offensive standard :
1. **Étape 1** : Injection du marqueur de diagnostic pour vérifier l'absence d'échappement.
2. **Étape 2** : Construction du payload weaponisé adapté à l'architecture cible.
3. **Étape 3** : Déclenchement de l'exécution et capture des privilèges.

```bash
# Exemple de commande d'exploitation standard
curl -s -X POST http://localhost:3333/targets/training/linux-07-kernel-dirty-pipe/ \
  -H "Content-Type: application/json" \
  -d '{"exploit_vector": "kernel-exploit"}'
```

---

## 4. Phase 3 : Capture des Drapeaux & Validation des Tâches
Les drapeaux officiels validant la compromission des différentes étapes de la mission :

- **Vérification de la version du noyau vulnérable** : `splice` (100 pts)
- **Écriture arbitraire dans /etc/passwd (User Foothold)** : `CYBERLAB{user_dirty_pipe_passwd_page_cache_injected}` (150 pts)
- **Élévation de privilèges & Root Flag** : `CYBERLAB{DIRTY_PIPE_PAGE_CACHE_PAGE_FLAG_OVERWRITTEN_ROOT}` (250 pts)

---

## 5. Recommandations de Remédiation (Mesures Défensives Blue Team)
1. **Application du principe de moindre privilège** (Least Privilege Principle) sur tous les comptes et processus.
2. **Validation stricte par liste blanche** des données en entrée (Input Sanitization) et requêtes préparées pour toutes les interactions en base.
3. **Mise à jour des composants logiciels** vers les versions patchées éliminant CVE-2022-0847.
4. **Cloisonnement réseau et conteneurs** : Interdiction du mode privileged, montage en lecture seule des volumes système.

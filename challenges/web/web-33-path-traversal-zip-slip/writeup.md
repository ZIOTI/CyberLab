# Rapport d'Exploitation & Débriefing Technique // Zip Slip File Overwrite & Cron Hijack
**Organisation cible** : CloudArchiver Ingestion Pipeline  
**Système d'exploitation** : Linux | **Catégorie** : Web & APIs  
**Difficulté** : HARD | **Vecteur de vulnérabilité** : CWE-22  
**Classification** : DOCUMENT OFFICIEL DU LABORATOIRE CYBERLAB REDTEAM  

---

## 1. Contexte Opérationnel & Règles d'Engagement
L'outil de décompression d'archives ZIP ne valide pas les chemins relatifs des entrées du fichier (Zip Slip). Conçois une archive contenant un fichier ../../../etc/cron.d/malicious pour écraser les tâches planifiées et exécuter un shell root.

L'évaluation a été menée dans un environnement strictement isolé. Aucun service de production réel n'a été impacté. L'objectif était d'auditer la sécurité du composant **zip-slip** et d'extraire les drapeaux de contrôle prouvant la faisabilité de l'attaque.

---

## 2. Phase 1 : Reconnaissance & Cartographie de la Surface d'Attaque
Une phase de reconnaissance passive et active permet d'identifier l'empreinte logicielle et les services en écoute :

```bash
# 1. Énumération des ports et bannières de service
nmap -sV -sC -p- 10.10.46.74 -oN nmap_initial_scan.txt

# 2. Découverte applicative locale
curl -i http://localhost:3333/targets/training/web-33-path-traversal-zip-slip/
```

L'analyse des réponses HTTP et des bannières confirme la présence du composant vulnérable lié à **zip-slip, path-traversal, archive-extraction, cron-hijack, rce**.

---

## 3. Phase 2 : Exploitation Technique Pas-à-Pas

### A. Analyse de la Vulnérabilité
La faille provient d'une insuffisance de validation des contrôles d'accès et des données d'entrée au niveau de **CWE-22**. Le système interprète les paramètres non assainis sans barrière d'isolation.

### B. Élaboration du Vecteur d'Attaque
En appliquant la méthodologie offensive standard :
1. **Étape 1** : Injection du marqueur de diagnostic pour vérifier l'absence d'échappement.
2. **Étape 2** : Construction du payload weaponisé adapté à l'architecture cible.
3. **Étape 3** : Déclenchement de l'exécution et capture des privilèges.

```bash
# Exemple de commande d'exploitation standard
curl -s -X POST http://localhost:3333/targets/training/web-33-path-traversal-zip-slip/ \
  -H "Content-Type: application/json" \
  -d '{"exploit_vector": "zip-slip"}'
```

---

## 4. Phase 3 : Capture des Drapeaux & Validation des Tâches
Les drapeaux officiels validant la compromission des différentes étapes de la mission :

- **Création de l'archive piégée** : `ZIP_SLIP_ARCHIVE_CRAFTED` (80 pts)
- **Exécution de la tâche cron (User Flag)** : `CYBERLAB{user_zip_slip_cron_overwrite_foothold}` (120 pts)
- **PrivEsc Root & Root Flag** : `CYBERLAB{ZIP_SLIP_PATH_TRAVERSAL_CRON_ROOT_PWNED}` (150 pts)

---

## 5. Recommandations de Remédiation (Mesures Défensives Blue Team)
1. **Application du principe de moindre privilège** (Least Privilege Principle) sur tous les comptes et processus.
2. **Validation stricte par liste blanche** des données en entrée (Input Sanitization) et requêtes préparées pour toutes les interactions en base.
3. **Mise à jour des composants logiciels** vers les versions patchées éliminant CWE-22.
4. **Cloisonnement réseau et conteneurs** : Interdiction du mode privileged, montage en lecture seule des volumes système.

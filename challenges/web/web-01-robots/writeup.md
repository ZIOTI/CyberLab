# Rapport d'Exploitation & Débriefing Technique // Apex Logistics Freight Tracker
**Organisation cible** : Apex Global Logistics (Rotterdam)  
**Système d'exploitation** : Linux | **Catégorie** : Web & APIs  
**Difficulté** : BEGINNER | **Vecteur de vulnérabilité** : CWE-200  
**Classification** : DOCUMENT OFFICIEL DU LABORATOIRE CYBERLAB REDTEAM  

---

## 1. Contexte Opérationnel & Règles d'Engagement
Apex Global Logistics opère la plateforme de fret maritime du terminal Maasvlakte II. Lors d'une migration d'infrastructure, l'équipe DevSecOps a laissé subsister des fichiers d'archive de configuration exposés dans des répertoires désindexés. Explore méthodiquement le serveur web, découvre les directives dissimulées aux moteurs de recherche et accède à la sauvegarde confidentielle de la base de données.

L'évaluation a été menée dans un environnement strictement isolé. Aucun service de production réel n'a été impacté. L'objectif était d'auditer la sécurité du composant **recon** et d'extraire les drapeaux de contrôle prouvant la faisabilité de l'attaque.

---

## 2. Phase 1 : Reconnaissance & Cartographie de la Surface d'Attaque
Une phase de reconnaissance passive et active permet d'identifier l'empreinte logicielle et les services en écoute :

```bash
# 1. Énumération des ports et bannières de service
nmap -sV -sC -p- 10.10.53.191 -oN nmap_initial_scan.txt

# 2. Découverte applicative locale
curl -i http://localhost:3333/targets/training/web-01-robots/
```

L'analyse des réponses HTTP et des bannières confirme la présence du composant vulnérable lié à **recon, robots.txt, information-disclosure, logistics, http-methods**.

---

## 3. Phase 2 : Exploitation Technique Pas-à-Pas

### A. Analyse de la Vulnérabilité
La faille provient d'une insuffisance de validation des contrôles d'accès et des données d'entrée au niveau de **CWE-200**. Le système interprète les paramètres non assainis sans barrière d'isolation.

### B. Élaboration du Vecteur d'Attaque
En appliquant la méthodologie offensive standard :
1. **Étape 1** : Injection du marqueur de diagnostic pour vérifier l'absence d'échappement.
2. **Étape 2** : Construction du payload weaponisé adapté à l'architecture cible.
3. **Étape 3** : Déclenchement de l'exécution et capture des privilèges.

```bash
# Exemple de commande d'exploitation standard
curl -s -X POST http://localhost:3333/targets/training/web-01-robots/ \
  -H "Content-Type: application/json" \
  -d '{"exploit_vector": "recon"}'
```

---

## 4. Phase 3 : Capture des Drapeaux & Validation des Tâches
Les drapeaux officiels validant la compromission des différentes étapes de la mission :

- **Reconnaissance de surface & Analyse du serveur** : `ROBOTS_ENUM_SUCCESS` (30 pts)
- **Découverte du répertoire sensible désindexé** : `backup_cargo_sys_2026` (30 pts)
- **Extraction de la sauvegarde & Flag de contrôle** : `CYBERLAB{ROBOTS_TXT_HIDDEN_BACKUP_DISCOVERED}` (40 pts)

---

## 5. Recommandations de Remédiation (Mesures Défensives Blue Team)
1. **Application du principe de moindre privilège** (Least Privilege Principle) sur tous les comptes et processus.
2. **Validation stricte par liste blanche** des données en entrée (Input Sanitization) et requêtes préparées pour toutes les interactions en base.
3. **Mise à jour des composants logiciels** vers les versions patchées éliminant CWE-200.
4. **Cloisonnement réseau et conteneurs** : Interdiction du mode privileged, montage en lecture seule des volumes système.

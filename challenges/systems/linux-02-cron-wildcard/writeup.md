# Rapport d'Exploitation & Débriefing Technique // The Midnight Backup Wildcard Injection
**Organisation cible** : Apex Datacenter Archival Services  
**Système d'exploitation** : Linux | **Catégorie** : Systèmes & Active Directory  
**Difficulté** : EASY | **Vecteur de vulnérabilité** : CWE-78  
**Classification** : DOCUMENT OFFICIEL DU LABORATOIRE CYBERLAB REDTEAM  

---

## 1. Contexte Opérationnel & Règles d'Engagement
Une tâche planifiée dans /etc/cron.d/nightly_backup exécute chaque minute la commande tar -czf /backup/archive.tar.gz * dans /opt/app/data avec les privilèges ROOT. L'utilisation du joker (*) permet d'injecter des arguments arbitraires dans tar (--checkpoint-action) pour déclencher l'exécution d'un script lors de la création de l'archive.

L'évaluation a été menée dans un environnement strictement isolé. Aucun service de production réel n'a été impacté. L'objectif était d'auditer la sécurité du composant **linux** et d'extraire les drapeaux de contrôle prouvant la faisabilité de l'attaque.

---

## 2. Phase 1 : Reconnaissance & Cartographie de la Surface d'Attaque
Une phase de reconnaissance passive et active permet d'identifier l'empreinte logicielle et les services en écoute :

```bash
# 1. Énumération des ports et bannières de service
nmap -sV -sC -p- 10.10.21.16 -oN nmap_initial_scan.txt

# 2. Découverte applicative locale
curl -i http://localhost:3333/targets/training/linux-02-cron-wildcard/
```

L'analyse des réponses HTTP et des bannières confirme la présence du composant vulnérable lié à **linux, cron, wildcard-injection, tar, privesc**.

---

## 3. Phase 2 : Exploitation Technique Pas-à-Pas

### A. Analyse de la Vulnérabilité
La faille provient d'une insuffisance de validation des contrôles d'accès et des données d'entrée au niveau de **CWE-78**. Le système interprète les paramètres non assainis sans barrière d'isolation.

### B. Élaboration du Vecteur d'Attaque
En appliquant la méthodologie offensive standard :
1. **Étape 1** : Injection du marqueur de diagnostic pour vérifier l'absence d'échappement.
2. **Étape 2** : Construction du payload weaponisé adapté à l'architecture cible.
3. **Étape 3** : Déclenchement de l'exécution et capture des privilèges.

```bash
# Exemple de commande d'exploitation standard
curl -s -X POST http://localhost:3333/targets/training/linux-02-cron-wildcard/ \
  -H "Content-Type: application/json" \
  -d '{"exploit_vector": "linux"}'
```

---

## 4. Phase 3 : Capture des Drapeaux & Validation des Tâches
Les drapeaux officiels validant la compromission des différentes étapes de la mission :

- **Analyse du fichier crontab** : `root` (30 pts)
- **Argument tar d'injection de point de contrôle** : `--checkpoint-action` (50 pts)
- **Shell root & Flag** : `CYBERLAB{CRON_WILDCARD_TAR_CHECKPOINT_ROOT_PWNED}` (70 pts)

---

## 5. Recommandations de Remédiation (Mesures Défensives Blue Team)
1. **Application du principe de moindre privilège** (Least Privilege Principle) sur tous les comptes et processus.
2. **Validation stricte par liste blanche** des données en entrée (Input Sanitization) et requêtes préparées pour toutes les interactions en base.
3. **Mise à jour des composants logiciels** vers les versions patchées éliminant CWE-78.
4. **Cloisonnement réseau et conteneurs** : Interdiction du mode privileged, montage en lecture seule des volumes système.

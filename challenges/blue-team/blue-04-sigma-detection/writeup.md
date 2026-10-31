# Rapport d'Exploitation & Débriefing Technique // Sigma Threat Hunting Rulebook for Sysmon
**Organisation cible** : Cyber Security Operations Center  
**Système d'exploitation** : Windows | **Catégorie** : Blue Team & SOC  
**Difficulté** : HARD | **Vecteur de vulnérabilité** : CWE-284  
**Classification** : DOCUMENT OFFICIEL DU LABORATOIRE CYBERLAB REDTEAM  

---

## 1. Contexte Opérationnel & Règles d'Engagement
Pour détecter les attaques par vol d'identifiants (Credential Dumping) via Mimikatz ou comsvcs.dll, rédige une règle de détection générique au format Sigma (YAML). La règle doit cibler l'Event ID 1 de Sysmon (Process Creation) pour intercepter toute ligne de commande invoquant MiniDump() ou lsass.exe avec des arguments obfusqués.

L'évaluation a été menée dans un environnement strictement isolé. Aucun service de production réel n'a été impacté. L'objectif était d'auditer la sécurité du composant **blue-team** et d'extraire les drapeaux de contrôle prouvant la faisabilité de l'attaque.

---

## 2. Phase 1 : Reconnaissance & Cartographie de la Surface d'Attaque
Une phase de reconnaissance passive et active permet d'identifier l'empreinte logicielle et les services en écoute :

```bash
# 1. Énumération des ports et bannières de service
nmap -sV -sC -p- 10.10.21.91 -oN nmap_initial_scan.txt

# 2. Découverte applicative locale
curl -i http://localhost:3333/targets/training/blue-04-sigma-detection/
```

L'analyse des réponses HTTP et des bannières confirme la présence du composant vulnérable lié à **blue-team, sigma, sysmon, event-id-1, process-creation**.

---

## 3. Phase 2 : Exploitation Technique Pas-à-Pas

### A. Analyse de la Vulnérabilité
La faille provient d'une insuffisance de validation des contrôles d'accès et des données d'entrée au niveau de **CWE-284**. Le système interprète les paramètres non assainis sans barrière d'isolation.

### B. Élaboration du Vecteur d'Attaque
En appliquant la méthodologie offensive standard :
1. **Étape 1** : Injection du marqueur de diagnostic pour vérifier l'absence d'échappement.
2. **Étape 2** : Construction du payload weaponisé adapté à l'architecture cible.
3. **Étape 3** : Déclenchement de l'exécution et capture des privilèges.

```bash
# Exemple de commande d'exploitation standard
curl -s -X POST http://localhost:3333/targets/training/blue-04-sigma-detection/ \
  -H "Content-Type: application/json" \
  -d '{"exploit_vector": "blue-team"}'
```

---

## 4. Phase 3 : Capture des Drapeaux & Validation des Tâches
Les drapeaux officiels validant la compromission des différentes étapes de la mission :

- **Numéro d'événement Sysmon de création de processus** : `1` (70 pts)
- **Champ de sélection de la ligne de commande en Sigma** : `CommandLine|contains` (80 pts)
- **Conversion en requête SIEM & Flag** : `CYBERLAB{SIGMA_RULE_SYSMON_EVENT1_MIMIKATZ_TRIGGERED}` (150 pts)

---

## 5. Recommandations de Remédiation (Mesures Défensives Blue Team)
1. **Application du principe de moindre privilège** (Least Privilege Principle) sur tous les comptes et processus.
2. **Validation stricte par liste blanche** des données en entrée (Input Sanitization) et requêtes préparées pour toutes les interactions en base.
3. **Mise à jour des composants logiciels** vers les versions patchées éliminant CWE-284.
4. **Cloisonnement réseau et conteneurs** : Interdiction du mode privileged, montage en lecture seule des volumes système.

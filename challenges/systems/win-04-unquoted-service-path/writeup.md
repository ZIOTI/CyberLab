# Rapport d'Exploitation & Débriefing Technique // Windows Unquoted Service Path Hijack
**Organisation cible** : Enterprise Workstation Fleet  
**Système d'exploitation** : Windows | **Catégorie** : Systèmes & Active Directory  
**Difficulté** : HARD | **Vecteur de vulnérabilité** : CWE-428  
**Classification** : DOCUMENT OFFICIEL DU LABORATOIRE CYBERLAB REDTEAM  

---

## 1. Contexte Opérationnel & Règles d'Engagement
Un service Windows démarre automatiquement au boot en exécutant le chemin C:\Program Files\Aegis Security\Agent Service\launcher.exe sans guillemets entourant le chemin (Unquoted Service Path). En raison des espaces dans le nom des répertoires, Windows tente d'exécuter successivement C:\Program.exe puis C:\Program Files\Aegis.exe. Dépose un binaire compilé à l'un de ces emplacements inscriptibles pour exécuter du code avec les privilèges NT AUTHORITY\SYSTEM.

L'évaluation a été menée dans un environnement strictement isolé. Aucun service de production réel n'a été impacté. L'objectif était d'auditer la sécurité du composant **windows** et d'extraire les drapeaux de contrôle prouvant la faisabilité de l'attaque.

---

## 2. Phase 1 : Reconnaissance & Cartographie de la Surface d'Attaque
Une phase de reconnaissance passive et active permet d'identifier l'empreinte logicielle et les services en écoute :

```bash
# 1. Énumération des ports et bannières de service
nmap -sV -sC -p- 10.10.14.150 -oN nmap_initial_scan.txt

# 2. Découverte applicative locale
curl -i http://localhost:3333/targets/training/win-04-unquoted-service-path/
```

L'analyse des réponses HTTP et des bannières confirme la présence du composant vulnérable lié à **windows, unquoted-service, service-hijack, privesc, system**.

---

## 3. Phase 2 : Exploitation Technique Pas-à-Pas

### A. Analyse de la Vulnérabilité
La faille provient d'une insuffisance de validation des contrôles d'accès et des données d'entrée au niveau de **CWE-428**. Le système interprète les paramètres non assainis sans barrière d'isolation.

### B. Élaboration du Vecteur d'Attaque
En appliquant la méthodologie offensive standard :
1. **Étape 1** : Injection du marqueur de diagnostic pour vérifier l'absence d'échappement.
2. **Étape 2** : Construction du payload weaponisé adapté à l'architecture cible.
3. **Étape 3** : Déclenchement de l'exécution et capture des privilèges.

```bash
# Exemple de commande d'exploitation standard
curl -s -X POST http://localhost:3333/targets/training/win-04-unquoted-service-path/ \
  -H "Content-Type: application/json" \
  -d '{"exploit_vector": "windows"}'
```

---

## 4. Phase 3 : Capture des Drapeaux & Validation des Tâches
Les drapeaux officiels validant la compromission des différentes étapes de la mission :

- **Énumération des services mal configurés avec WMI** : `wmic service get name,pathname` (70 pts)
- **Emplacement du fichier binaire pirate** : `Aegis.exe` (80 pts)
- **Redémarrage du service & SYSTEM Flag** : `CYBERLAB{UNQUOTED_SERVICE_PATH_EXE_HIJACK_SYSTEM_ELEV}` (150 pts)

---

## 5. Recommandations de Remédiation (Mesures Défensives Blue Team)
1. **Application du principe de moindre privilège** (Least Privilege Principle) sur tous les comptes et processus.
2. **Validation stricte par liste blanche** des données en entrée (Input Sanitization) et requêtes préparées pour toutes les interactions en base.
3. **Mise à jour des composants logiciels** vers les versions patchées éliminant CWE-428.
4. **Cloisonnement réseau et conteneurs** : Interdiction du mode privileged, montage en lecture seule des volumes système.

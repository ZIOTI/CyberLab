# Rapport d'Exploitation & Débriefing Technique // Rogue Peripheral Windows Event Log Forensics
**Organisation cible** : Internal Affairs Security Division  
**Système d'exploitation** : Windows | **Catégorie** : Forensics & Mémoire  
**Difficulté** : INTERMEDIATE | **Vecteur de vulnérabilité** : CWE-284  
**Classification** : DOCUMENT OFFICIEL DU LABORATOIRE CYBERLAB REDTEAM  

---

## 1. Contexte Opérationnel & Règles d'Engagement
Une fuite de données par support physique a eu lieu dans une salle sécurisée. Analyse le journal d'événements Windows Microsoft-Windows-Storage-ClassPnp/Operational.evtx ainsi que les ruches de registre SYSTEM pour retrouver le fabricant, le numéro de série unique et l'heure exacte de connexion de la clé USB pirate.

L'évaluation a été menée dans un environnement strictement isolé. Aucun service de production réel n'a été impacté. L'objectif était d'auditer la sécurité du composant **forensics** et d'extraire les drapeaux de contrôle prouvant la faisabilité de l'attaque.

---

## 2. Phase 1 : Reconnaissance & Cartographie de la Surface d'Attaque
Une phase de reconnaissance passive et active permet d'identifier l'empreinte logicielle et les services en écoute :

```bash
# 1. Énumération des ports et bannières de service
nmap -sV -sC -p- 10.10.18.199 -oN nmap_initial_scan.txt

# 2. Découverte applicative locale
curl -i http://localhost:3333/targets/training/forensics-06-usb-device-log/
```

L'analyse des réponses HTTP et des bannières confirme la présence du composant vulnérable lié à **forensics, event-logs, evtx, usb-forensics, registry**.

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
curl -s -X POST http://localhost:3333/targets/training/forensics-06-usb-device-log/ \
  -H "Content-Type: application/json" \
  -d '{"exploit_vector": "forensics"}'
```

---

## 4. Phase 3 : Capture des Drapeaux & Validation des Tâches
Les drapeaux officiels validant la compromission des différentes étapes de la mission :

- **Numéro de série de la clé USB malveillante** : `AA04012700013149` (60 pts)
- **Identifiant du fabricant (VID/PID)** : `VID_0781` (60 pts)
- **Clôture de l'investigation & Flag** : `CYBERLAB{WINDOWS_EVENT_LOGS_USBSTOR_SERIAL_MATCHED}` (80 pts)

---

## 5. Recommandations de Remédiation (Mesures Défensives Blue Team)
1. **Application du principe de moindre privilège** (Least Privilege Principle) sur tous les comptes et processus.
2. **Validation stricte par liste blanche** des données en entrée (Input Sanitization) et requêtes préparées pour toutes les interactions en base.
3. **Mise à jour des composants logiciels** vers les versions patchées éliminant CWE-284.
4. **Cloisonnement réseau et conteneurs** : Interdiction du mode privileged, montage en lecture seule des volumes système.

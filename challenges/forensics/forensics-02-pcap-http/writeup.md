# Rapport d'Exploitation & Débriefing Technique // Wireshark Unencrypted Credential Stream
**Organisation cible** : Enterprise SOC Network Surveillance  
**Système d'exploitation** : Linux | **Catégorie** : Forensics & Mémoire  
**Difficulté** : EASY | **Vecteur de vulnérabilité** : CWE-319  
**Classification** : DOCUMENT OFFICIEL DU LABORATOIRE CYBERLAB REDTEAM  

---

## 1. Contexte Opérationnel & Règles d'Engagement
Lors d'un incident de sécurité, la sonde réseau a enregistré un fichier de capture de paquets (.pcap). Un attaquant a exfiltré un fichier d'archives confidentiel via une requête HTTP POST non chiffrée. Ouvre la capture dans Wireshark, applique des filtres d'affichage sur les requêtes HTTP, suis le flux TCP (Follow TCP Stream) et recompose le fichier transféré.

L'évaluation a été menée dans un environnement strictement isolé. Aucun service de production réel n'a été impacté. L'objectif était d'auditer la sécurité du composant **forensics** et d'extraire les drapeaux de contrôle prouvant la faisabilité de l'attaque.

---

## 2. Phase 1 : Reconnaissance & Cartographie de la Surface d'Attaque
Une phase de reconnaissance passive et active permet d'identifier l'empreinte logicielle et les services en écoute :

```bash
# 1. Énumération des ports et bannières de service
nmap -sV -sC -p- 10.10.28.24 -oN nmap_initial_scan.txt

# 2. Découverte applicative locale
curl -i http://localhost:3333/targets/training/forensics-02-pcap-http/
```

L'analyse des réponses HTTP et des bannières confirme la présence du composant vulnérable lié à **forensics, pcap, wireshark, http-post, credentials**.

---

## 3. Phase 2 : Exploitation Technique Pas-à-Pas

### A. Analyse de la Vulnérabilité
La faille provient d'une insuffisance de validation des contrôles d'accès et des données d'entrée au niveau de **CWE-319**. Le système interprète les paramètres non assainis sans barrière d'isolation.

### B. Élaboration du Vecteur d'Attaque
En appliquant la méthodologie offensive standard :
1. **Étape 1** : Injection du marqueur de diagnostic pour vérifier l'absence d'échappement.
2. **Étape 2** : Construction du payload weaponisé adapté à l'architecture cible.
3. **Étape 3** : Déclenchement de l'exécution et capture des privilèges.

```bash
# Exemple de commande d'exploitation standard
curl -s -X POST http://localhost:3333/targets/training/forensics-02-pcap-http/ \
  -H "Content-Type: application/json" \
  -d '{"exploit_vector": "forensics"}'
```

---

## 4. Phase 3 : Capture des Drapeaux & Validation des Tâches
Les drapeaux officiels validant la compromission des différentes étapes de la mission :

- **Endpoint cible de l'exfiltration** : `/api/v1/telemetry/push` (40 pts)
- **Nom du fichier joint** : `payroll_confidential.zip` (50 pts)
- **Extraction de la pièce jointe & Flag** : `CYBERLAB{WIRESHARK_HTTP_MULTIPART_EXFILTRATION_CAUGHT}` (60 pts)

---

## 5. Recommandations de Remédiation (Mesures Défensives Blue Team)
1. **Application du principe de moindre privilège** (Least Privilege Principle) sur tous les comptes et processus.
2. **Validation stricte par liste blanche** des données en entrée (Input Sanitization) et requêtes préparées pour toutes les interactions en base.
3. **Mise à jour des composants logiciels** vers les versions patchées éliminant CWE-319.
4. **Cloisonnement réseau et conteneurs** : Interdiction du mode privileged, montage en lecture seule des volumes système.

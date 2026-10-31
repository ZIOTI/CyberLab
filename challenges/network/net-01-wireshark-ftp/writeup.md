# Rapport d'Exploitation & Débriefing Technique // Cleartext FTP Session Sniffing
**Organisation cible** : Legacy Datacenter Storage Link  
**Système d'exploitation** : Linux | **Catégorie** : Réseau & Infrastructure  
**Difficulté** : BEGINNER | **Vecteur de vulnérabilité** : CWE-319  
**Classification** : DOCUMENT OFFICIEL DU LABORATOIRE CYBERLAB REDTEAM  

---

## 1. Contexte Opérationnel & Règles d'Engagement
Le protocole de transfert de fichiers FTP transmet les identifiants et les données en clair sur le réseau (port 21). Dans une capture de trafic réseau réalisée sur le commutateur central, filtre sur le trafic FTP pour retrouver le nom d'utilisateur, le mot de passe de l'administrateur et le fichier confidentiel téléchargé.

L'évaluation a été menée dans un environnement strictement isolé. Aucun service de production réel n'a été impacté. L'objectif était d'auditer la sécurité du composant **network** et d'extraire les drapeaux de contrôle prouvant la faisabilité de l'attaque.

---

## 2. Phase 1 : Reconnaissance & Cartographie de la Surface d'Attaque
Une phase de reconnaissance passive et active permet d'identifier l'empreinte logicielle et les services en écoute :

```bash
# 1. Énumération des ports et bannières de service
nmap -sV -sC -p- 10.10.46.174 -oN nmap_initial_scan.txt

# 2. Découverte applicative locale
curl -i http://localhost:3333/targets/training/net-01-wireshark-ftp/
```

L'analyse des réponses HTTP et des bannières confirme la présence du composant vulnérable lié à **network, wireshark, ftp, cleartext, sniffing**.

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
curl -s -X POST http://localhost:3333/targets/training/net-01-wireshark-ftp/ \
  -H "Content-Type: application/json" \
  -d '{"exploit_vector": "network"}'
```

---

## 4. Phase 3 : Capture des Drapeaux & Validation des Tâches
Les drapeaux officiels validant la compromission des différentes étapes de la mission :

- **Nom d'utilisateur transmis en clair** : `ftp_admin` (40 pts)
- **Mot de passe et Flag de contrôle** : `CYBERLAB{WIRESHARK_FTP_CLEARTEXT_PASSWORD_DISCOVERED}` (60 pts)

---

## 5. Recommandations de Remédiation (Mesures Défensives Blue Team)
1. **Application du principe de moindre privilège** (Least Privilege Principle) sur tous les comptes et processus.
2. **Validation stricte par liste blanche** des données en entrée (Input Sanitization) et requêtes préparées pour toutes les interactions en base.
3. **Mise à jour des composants logiciels** vers les versions patchées éliminant CWE-319.
4. **Cloisonnement réseau et conteneurs** : Interdiction du mode privileged, montage en lecture seule des volumes système.

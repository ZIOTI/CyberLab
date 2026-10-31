# Rapport d'Exploitation & Débriefing Technique // Dual-Homed Gateway Dynamic SOCKS5 Pivot
**Organisation cible** : SecOps Perimeter DMZ  
**Système d'exploitation** : Linux | **Catégorie** : Réseau & Infrastructure  
**Difficulté** : INTERMEDIATE | **Vecteur de vulnérabilité** : CWE-284  
**Classification** : DOCUMENT OFFICIEL DU LABORATOIRE CYBERLAB REDTEAM  

---

## 1. Contexte Opérationnel & Règles d'Engagement
Tu as obtenu un accès SSH valide sur une machine passerelle possédant deux interfaces réseau : eth0 (réseau externe accessible) et eth1 (réseau interne confidentiel 172.16.10.0/24). Monte un tunnel SOCKS5 dynamique avec ssh -D 1080 et utilise proxychains pour scanner le sous-réseau interne masqué et exploiter le serveur de base de données interne.

L'évaluation a été menée dans un environnement strictement isolé. Aucun service de production réel n'a été impacté. L'objectif était d'auditer la sécurité du composant **network** et d'extraire les drapeaux de contrôle prouvant la faisabilité de l'attaque.

---

## 2. Phase 1 : Reconnaissance & Cartographie de la Surface d'Attaque
Une phase de reconnaissance passive et active permet d'identifier l'empreinte logicielle et les services en écoute :

```bash
# 1. Énumération des ports et bannières de service
nmap -sV -sC -p- 10.10.42.97 -oN nmap_initial_scan.txt

# 2. Découverte applicative locale
curl -i http://localhost:3333/targets/training/net-05-ssh-pivoting/
```

L'analyse des réponses HTTP et des bannières confirme la présence du composant vulnérable lié à **network, ssh-tunnel, pivoting, socks5, proxychains**.

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
curl -s -X POST http://localhost:3333/targets/training/net-05-ssh-pivoting/ \
  -H "Content-Type: application/json" \
  -d '{"exploit_vector": "network"}'
```

---

## 4. Phase 3 : Capture des Drapeaux & Validation des Tâches
Les drapeaux officiels validant la compromission des différentes étapes de la mission :

- **Argument SSH de tunnel dynamique** : `-D` (50 pts)
- **Découverte de l'hôte interne caché** : `172.16.10.45` (60 pts)
- **Extraction de la base de données & Flag** : `CYBERLAB{SSH_DYNAMIC_SOCKS5_PIVOT_INTERNAL_HOST_HIT}` (90 pts)

---

## 5. Recommandations de Remédiation (Mesures Défensives Blue Team)
1. **Application du principe de moindre privilège** (Least Privilege Principle) sur tous les comptes et processus.
2. **Validation stricte par liste blanche** des données en entrée (Input Sanitization) et requêtes préparées pour toutes les interactions en base.
3. **Mise à jour des composants logiciels** vers les versions patchées éliminant CWE-284.
4. **Cloisonnement réseau et conteneurs** : Interdiction du mode privileged, montage en lecture seule des volumes système.

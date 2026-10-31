# Rapport d'Exploitation & Débriefing Technique // Dual Pivot Corporate Infiltration
**Organisation cible** : Shadow Corp Secret Research  
**Système d'exploitation** : Multi-Host | **Catégorie** : Systèmes & Active Directory  
**Difficulté** : INSANE | **Vecteur de vulnérabilité** : MULTI-CVE  
**Classification** : DOCUMENT OFFICIEL DU LABORATOIRE CYBERLAB REDTEAM  

---

## 1. Contexte Opérationnel & Règles d'Engagement
Scénario en deux temps : Pénètre dans la passerelle Linux frontale via une faille de téléversement, monte un tunnel SSH / Chisel SOCKS5 pour atteindre le réseau interne 10.10.20.0/24 isolé, et attaque le serveur Windows interne en exploitant une vulnérabilité d'escalade de privilèges pour capturer les drapeaux User et Root.

L'évaluation a été menée dans un environnement strictement isolé. Aucun service de production réel n'a été impacté. L'objectif était d'auditer la sécurité du composant **boot2root** et d'extraire les drapeaux de contrôle prouvant la faisabilité de l'attaque.

---

## 2. Phase 1 : Reconnaissance & Cartographie de la Surface d'Attaque
Une phase de reconnaissance passive et active permet d'identifier l'empreinte logicielle et les services en écoute :

```bash
# 1. Énumération des ports et bannières de service
nmap -sV -sC -p- 10.10.56.194 -oN nmap_initial_scan.txt

# 2. Découverte applicative locale
curl -i http://localhost:3333/targets/training/b2r-02-shadow-corp-dmz/
```

L'analyse des réponses HTTP et des bannières confirme la présence du composant vulnérable lié à **boot2root, dual-pivot, lateral-movement, active-directory, ssh-tunnel**.

---

## 3. Phase 2 : Exploitation Technique Pas-à-Pas

### A. Analyse de la Vulnérabilité
La faille provient d'une insuffisance de validation des contrôles d'accès et des données d'entrée au niveau de **MULTI-CVE**. Le système interprète les paramètres non assainis sans barrière d'isolation.

### B. Élaboration du Vecteur d'Attaque
En appliquant la méthodologie offensive standard :
1. **Étape 1** : Injection du marqueur de diagnostic pour vérifier l'absence d'échappement.
2. **Étape 2** : Construction du payload weaponisé adapté à l'architecture cible.
3. **Étape 3** : Déclenchement de l'exécution et capture des privilèges.

```bash
# Exemple de commande d'exploitation standard
curl -s -X POST http://localhost:3333/targets/training/b2r-02-shadow-corp-dmz/ \
  -H "Content-Type: application/json" \
  -d '{"exploit_vector": "boot2root"}'
```

---

## 4. Phase 3 : Capture des Drapeaux & Validation des Tâches
Les drapeaux officiels validant la compromission des différentes étapes de la mission :

- **Phase 1 : Compromission de la passerelle Linux** : `FRONTEND_GATEWAY_COMPROMISED` (100 pts)
- **Phase 2 : Pivot réseau SOCKS5 & User Flag** : `CYBERLAB{user_shadow_corp_lateral_pivot_established}` (150 pts)
- **Phase 3 : Élévation finale sur le contrôleur & Root Flag** : `CYBERLAB{SHADOW_CORP_DUAL_PIVOT_EXPLOITATION_KILLCHAIN_CLEARED}` (250 pts)

---

## 5. Recommandations de Remédiation (Mesures Défensives Blue Team)
1. **Application du principe de moindre privilège** (Least Privilege Principle) sur tous les comptes et processus.
2. **Validation stricte par liste blanche** des données en entrée (Input Sanitization) et requêtes préparées pour toutes les interactions en base.
3. **Mise à jour des composants logiciels** vers les versions patchées éliminant MULTI-CVE.
4. **Cloisonnement réseau et conteneurs** : Interdiction du mode privileged, montage en lecture seule des volumes système.

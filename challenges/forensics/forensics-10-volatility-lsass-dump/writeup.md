# Rapport d'Exploitation & Débriefing Technique // Cobalt Strike Beacon In-Memory LSASS Carving
**Organisation cible** : National Banking Network Defense  
**Système d'exploitation** : Windows | **Catégorie** : Forensics & Mémoire  
**Difficulté** : INSANE | **Vecteur de vulnérabilité** : CWE-200  
**Classification** : DOCUMENT OFFICIEL DU LABORATOIRE CYBERLAB REDTEAM  

---

## 1. Contexte Opérationnel & Règles d'Engagement
Une équipe APT a déployé un implant Cobalt Strike Beacon dans un processus Windows pour déverser les secrets du Local Security Authority Subsystem Service (LSASS.exe). Analyse le dump mémoire de 1 Go avec Volatility, reconstitue la configuration complète du Beacon (Watermark, C2 Domains, Public Key, Sleep Time) et débloque le drapeau de contre-mesure d'élite.

L'évaluation a été menée dans un environnement strictement isolé. Aucun service de production réel n'a été impacté. L'objectif était d'auditer la sécurité du composant **forensics** et d'extraire les drapeaux de contrôle prouvant la faisabilité de l'attaque.

---

## 2. Phase 1 : Reconnaissance & Cartographie de la Surface d'Attaque
Une phase de reconnaissance passive et active permet d'identifier l'empreinte logicielle et les services en écoute :

```bash
# 1. Énumération des ports et bannières de service
nmap -sV -sC -p- 10.10.45.26 -oN nmap_initial_scan.txt

# 2. Découverte applicative locale
curl -i http://localhost:3333/targets/training/forensics-10-volatility-lsass-dump/
```

L'analyse des réponses HTTP et des bannières confirme la présence du composant vulnérable lié à **forensics, cobalt-strike, lsass, mimikatz, threat-hunting**.

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
curl -s -X POST http://localhost:3333/targets/training/forensics-10-volatility-lsass-dump/ \
  -H "Content-Type: application/json" \
  -d '{"exploit_vector": "forensics"}'
```

---

## 4. Phase 3 : Capture des Drapeaux & Validation des Tâches
Les drapeaux officiels validant la compromission des différentes étapes de la mission :

- **Identification du Watermark Cobalt Strike** : `135486920` (100 pts)
- **Domaine de commande et contrôle (C2) (User Flag)** : `CYBERLAB{user_cobalt_strike_c2_domain_identified}` (150 pts)
- **Extraction des secrets de session & Root Flag** : `CYBERLAB{COBALT_STRIKE_BEACON_CONFIG_LSASS_EXTRACTED_2026}` (250 pts)

---

## 5. Recommandations de Remédiation (Mesures Défensives Blue Team)
1. **Application du principe de moindre privilège** (Least Privilege Principle) sur tous les comptes et processus.
2. **Validation stricte par liste blanche** des données en entrée (Input Sanitization) et requêtes préparées pour toutes les interactions en base.
3. **Mise à jour des composants logiciels** vers les versions patchées éliminant CWE-200.
4. **Cloisonnement réseau et conteneurs** : Interdiction du mode privileged, montage en lecture seule des volumes système.

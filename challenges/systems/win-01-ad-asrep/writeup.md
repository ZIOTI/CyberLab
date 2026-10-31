# Rapport d'Exploitation & Débriefing Technique // Kerberos AS-REP Roasting Without Preauth
**Organisation cible** : NorthCorp Active Directory Forest  
**Système d'exploitation** : Windows | **Catégorie** : Systèmes & Active Directory  
**Difficulté** : INTERMEDIATE | **Vecteur de vulnérabilité** : CWE-287  
**Classification** : DOCUMENT OFFICIEL DU LABORATOIRE CYBERLAB REDTEAM  

---

## 1. Contexte Opérationnel & Règles d'Engagement
Dans le domaine Active Directory de NorthCorp, le compte de service svc_sql_backup a été configuré avec l'attribut DONT_REQ_PREAUTH (pré-authentification Kerberos désactivée). Utilise GetNPUsers.py d'Impacket pour demander un ticket AS-REP sans connaître le mot de passe, puis casse le hachage krb5asrep hors-ligne avec Hashcat.

L'évaluation a été menée dans un environnement strictement isolé. Aucun service de production réel n'a été impacté. L'objectif était d'auditer la sécurité du composant **active-directory** et d'extraire les drapeaux de contrôle prouvant la faisabilité de l'attaque.

---

## 2. Phase 1 : Reconnaissance & Cartographie de la Surface d'Attaque
Une phase de reconnaissance passive et active permet d'identifier l'empreinte logicielle et les services en écoute :

```bash
# 1. Énumération des ports et bannières de service
nmap -sV -sC -p- 10.10.37.8 -oN nmap_initial_scan.txt

# 2. Découverte applicative locale
curl -i http://localhost:3333/targets/training/win-01-ad-asrep/
```

L'analyse des réponses HTTP et des bannières confirme la présence du composant vulnérable lié à **active-directory, kerberos, asreproast, impacket, hashcat**.

---

## 3. Phase 2 : Exploitation Technique Pas-à-Pas

### A. Analyse de la Vulnérabilité
La faille provient d'une insuffisance de validation des contrôles d'accès et des données d'entrée au niveau de **CWE-287**. Le système interprète les paramètres non assainis sans barrière d'isolation.

### B. Élaboration du Vecteur d'Attaque
En appliquant la méthodologie offensive standard :
1. **Étape 1** : Injection du marqueur de diagnostic pour vérifier l'absence d'échappement.
2. **Étape 2** : Construction du payload weaponisé adapté à l'architecture cible.
3. **Étape 3** : Déclenchement de l'exécution et capture des privilèges.

```bash
# Exemple de commande d'exploitation standard
curl -s -X POST http://localhost:3333/targets/training/win-01-ad-asrep/ \
  -H "Content-Type: application/json" \
  -d '{"exploit_vector": "active-directory"}'
```

---

## 4. Phase 3 : Capture des Drapeaux & Validation des Tâches
Les drapeaux officiels validant la compromission des différentes étapes de la mission :

- **Identification du compte vulnérable** : `svc_sql_backup` (40 pts)
- **Extraction du hash AS-REP** : `18200` (60 pts)
- **Déchiffrement du ticket & Flag** : `CYBERLAB{ASREP_ROAST_TGT_OFFLINE_HASHCAT_CRACKED}` (100 pts)

---

## 5. Recommandations de Remédiation (Mesures Défensives Blue Team)
1. **Application du principe de moindre privilège** (Least Privilege Principle) sur tous les comptes et processus.
2. **Validation stricte par liste blanche** des données en entrée (Input Sanitization) et requêtes préparées pour toutes les interactions en base.
3. **Mise à jour des composants logiciels** vers les versions patchées éliminant CWE-287.
4. **Cloisonnement réseau et conteneurs** : Interdiction du mode privileged, montage en lecture seule des volumes système.

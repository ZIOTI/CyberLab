# Rapport d'Exploitation & Débriefing Technique // DCSync Replication Rights Domain Takeover
**Organisation cible** : CyberDyne Defense Systems Domain  
**Système d'exploitation** : Windows | **Catégorie** : Systèmes & Active Directory  
**Difficulté** : HARD | **Vecteur de vulnérabilité** : CWE-272  
**Classification** : DOCUMENT OFFICIEL DU LABORATOIRE CYBERLAB REDTEAM  

---

## 1. Contexte Opérationnel & Règles d'Engagement
L'utilisateur d'administration déléguée svc_dirsync s'est vu attribuer les droits étendus DS-Replication-Get-Changes et DS-Replication-Get-Changes-All sur la racine du domaine Active Directory. En utilisant le module lsadump::dcsync de Mimikatz, simule le comportement d'un contrôleur de domaine pour répliquer les hachages NTLM de tous les comptes, y compris KRBTGT et Administrator.

L'évaluation a été menée dans un environnement strictement isolé. Aucun service de production réel n'a été impacté. L'objectif était d'auditer la sécurité du composant **active-directory** et d'extraire les drapeaux de contrôle prouvant la faisabilité de l'attaque.

---

## 2. Phase 1 : Reconnaissance & Cartographie de la Surface d'Attaque
Une phase de reconnaissance passive et active permet d'identifier l'empreinte logicielle et les services en écoute :

```bash
# 1. Énumération des ports et bannières de service
nmap -sV -sC -p- 10.10.56.61 -oN nmap_initial_scan.txt

# 2. Découverte applicative locale
curl -i http://localhost:3333/targets/training/win-03-ad-dcsync/
```

L'analyse des réponses HTTP et des bannières confirme la présence du composant vulnérable lié à **active-directory, dcsync, mimikatz, dsgetncchanges, krbtgt**.

---

## 3. Phase 2 : Exploitation Technique Pas-à-Pas

### A. Analyse de la Vulnérabilité
La faille provient d'une insuffisance de validation des contrôles d'accès et des données d'entrée au niveau de **CWE-272**. Le système interprète les paramètres non assainis sans barrière d'isolation.

### B. Élaboration du Vecteur d'Attaque
En appliquant la méthodologie offensive standard :
1. **Étape 1** : Injection du marqueur de diagnostic pour vérifier l'absence d'échappement.
2. **Étape 2** : Construction du payload weaponisé adapté à l'architecture cible.
3. **Étape 3** : Déclenchement de l'exécution et capture des privilèges.

```bash
# Exemple de commande d'exploitation standard
curl -s -X POST http://localhost:3333/targets/training/win-03-ad-dcsync/ \
  -H "Content-Type: application/json" \
  -d '{"exploit_vector": "active-directory"}'
```

---

## 4. Phase 3 : Capture des Drapeaux & Validation des Tâches
Les drapeaux officiels validant la compromission des différentes étapes de la mission :

- **Énumération des droits DACL étendus** : `DS-Replication-Get-Changes-All` (70 pts)
- **Réplication du hash NTLM Administrateur (User Flag)** : `CYBERLAB{user_dcsync_administrator_ntlm_hash_dumped}` (100 pts)
- **Extraction du compte KRBTGT & Root Flag** : `CYBERLAB{MIMIKATZ_DCSYNC_KRBTGT_NTLM_HASH_REPLICATED}` (130 pts)

---

## 5. Recommandations de Remédiation (Mesures Défensives Blue Team)
1. **Application du principe de moindre privilège** (Least Privilege Principle) sur tous les comptes et processus.
2. **Validation stricte par liste blanche** des données en entrée (Input Sanitization) et requêtes préparées pour toutes les interactions en base.
3. **Mise à jour des composants logiciels** vers les versions patchées éliminant CWE-272.
4. **Cloisonnement réseau et conteneurs** : Interdiction du mode privileged, montage en lecture seule des volumes système.

# Rapport d'Exploitation & Débriefing Technique // Active Directory Kerberoasting SPN Ticket
**Organisation cible** : Global Health Enterprise AD  
**Système d'exploitation** : Windows | **Catégorie** : Systèmes & Active Directory  
**Difficulté** : INTERMEDIATE | **Vecteur de vulnérabilité** : CWE-287  
**Classification** : DOCUMENT OFFICIEL DU LABORATOIRE CYBERLAB REDTEAM  

---

## 1. Contexte Opérationnel & Règles d'Engagement
Un compte utilisateur MSSQLService possède un Service Principal Name (SPN) enregistré dans le domaine. N'importe quel utilisateur authentifié peut solliciter un ticket TGS chiffré avec le hachage NTLM du compte de service. Extrais le ticket TGS avec GetUserSPNs.py ou Rubeus, puis effectue une attaque par dictionnaire hors-ligne.

L'évaluation a été menée dans un environnement strictement isolé. Aucun service de production réel n'a été impacté. L'objectif était d'auditer la sécurité du composant **active-directory** et d'extraire les drapeaux de contrôle prouvant la faisabilité de l'attaque.

---

## 2. Phase 1 : Reconnaissance & Cartographie de la Surface d'Attaque
Une phase de reconnaissance passive et active permet d'identifier l'empreinte logicielle et les services en écoute :

```bash
# 1. Énumération des ports et bannières de service
nmap -sV -sC -p- 10.10.28.95 -oN nmap_initial_scan.txt

# 2. Découverte applicative locale
curl -i http://localhost:3333/targets/training/win-02-ad-kerberoast/
```

L'analyse des réponses HTTP et des bannières confirme la présence du composant vulnérable lié à **active-directory, kerberoasting, spn, tgs-rep, rubeus**.

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
curl -s -X POST http://localhost:3333/targets/training/win-02-ad-kerberoast/ \
  -H "Content-Type: application/json" \
  -d '{"exploit_vector": "active-directory"}'
```

---

## 4. Phase 3 : Capture des Drapeaux & Validation des Tâches
Les drapeaux officiels validant la compromission des différentes étapes de la mission :

- **Énumération des comptes avec SPN** : `MSSQLService` (40 pts)
- **Format de hash Kerberoasting** : `13100` (60 pts)
- **Mot de passe du compte & Flag** : `CYBERLAB{KERBEROASTING_TGS_SPN_MSSQL_CRACKED_SUCCESS}` (100 pts)

---

## 5. Recommandations de Remédiation (Mesures Défensives Blue Team)
1. **Application du principe de moindre privilège** (Least Privilege Principle) sur tous les comptes et processus.
2. **Validation stricte par liste blanche** des données en entrée (Input Sanitization) et requêtes préparées pour toutes les interactions en base.
3. **Mise à jour des composants logiciels** vers les versions patchées éliminant CWE-287.
4. **Cloisonnement réseau et conteneurs** : Interdiction du mode privileged, montage en lecture seule des volumes système.

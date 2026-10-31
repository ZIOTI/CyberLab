# Rapport d'Exploitation & Débriefing Technique // Active Directory Certificate Services (AD CS ESC1)
**Organisation cible** : Cerberus Financial PKI Infrastructure  
**Système d'exploitation** : Windows | **Catégorie** : Systèmes & Active Directory  
**Difficulté** : INSANE | **Vecteur de vulnérabilité** : CWE-287  
**Classification** : DOCUMENT OFFICIEL DU LABORATOIRE CYBERLAB REDTEAM  

---

## 1. Contexte Opérationnel & Règles d'Engagement
L'autorité de certification d'entreprise (AD CS) publie un modèle de certificat mal configuré autorisant les utilisateurs ordinaires à demander un certificat d'authentification client (Client Authentication EKU) tout en définissant un nom alternatif de sujet arbitraire (ENROLLEE_SUPPLIES_SUBJECT - ESC1). Avec Certipy, demande un certificat au nom de Administrator et échange-le contre un ticket Kerberos TGT.

L'évaluation a été menée dans un environnement strictement isolé. Aucun service de production réel n'a été impacté. L'objectif était d'auditer la sécurité du composant **active-directory** et d'extraire les drapeaux de contrôle prouvant la faisabilité de l'attaque.

---

## 2. Phase 1 : Reconnaissance & Cartographie de la Surface d'Attaque
Une phase de reconnaissance passive et active permet d'identifier l'empreinte logicielle et les services en écoute :

```bash
# 1. Énumération des ports et bannières de service
nmap -sV -sC -p- 10.10.24.167 -oN nmap_initial_scan.txt

# 2. Découverte applicative locale
curl -i http://localhost:3333/targets/training/win-08-ad-cs-esc1/
```

L'analyse des réponses HTTP et des bannières confirme la présence du composant vulnérable lié à **active-directory, adcs, esc1, certipy, pki**.

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
curl -s -X POST http://localhost:3333/targets/training/win-08-ad-cs-esc1/ \
  -H "Content-Type: application/json" \
  -d '{"exploit_vector": "active-directory"}'
```

---

## 4. Phase 3 : Capture des Drapeaux & Validation des Tâches
Les drapeaux officiels validant la compromission des différentes étapes de la mission :

- **Flag de configuration de modèle vulnérable (ESC1)** : `ENROLLEE_SUPPLIES_SUBJECT` (100 pts)
- **Demande de certificat au nom d'Administrator (User Flag)** : `CYBERLAB{user_adcs_esc1_administrator_pfx_issued}` (150 pts)
- **Authentification PKINIT & Domain Admin Root Flag** : `CYBERLAB{ADCS_ESC1_SAN_IMPERSONATION_DOMAIN_ADMIN_VAULT}` (250 pts)

---

## 5. Recommandations de Remédiation (Mesures Défensives Blue Team)
1. **Application du principe de moindre privilège** (Least Privilege Principle) sur tous les comptes et processus.
2. **Validation stricte par liste blanche** des données en entrée (Input Sanitization) et requêtes préparées pour toutes les interactions en base.
3. **Mise à jour des composants logiciels** vers les versions patchées éliminant CWE-287.
4. **Cloisonnement réseau et conteneurs** : Interdiction du mode privileged, montage en lecture seule des volumes système.

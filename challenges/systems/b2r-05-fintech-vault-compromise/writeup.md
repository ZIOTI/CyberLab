# Rapport d'Exploitation & Débriefing Technique // Zurich Capital Banking Core Compromise
**Organisation cible** : Zurich Capital Private Banking AG  
**Système d'exploitation** : Multi-Host | **Catégorie** : Systèmes & Active Directory  
**Difficulté** : INSANE | **Vecteur de vulnérabilité** : MULTI-CVE  
**Classification** : DOCUMENT OFFICIEL DU LABORATOIRE CYBERLAB REDTEAM  

---

## 1. Contexte Opérationnel & Règles d'Engagement
L'opération offensive ultime de la banque privée zurichoise : L'API Spring Boot expose l'endpoint de débogage /actuator/heapdump. Télécharge le dump de mémoire vive de la JVM, extrait les identifiants en mémoire avec Eclipse MAT / strings, obtiens une connexion SSH sur le serveur d'application, pivote vers l'Active Directory, exploite un modèle de certificat AD CS vulnérable (ESC1) avec Certipy et deviens Domain Admin pour ouvrir la chambre forte.

L'évaluation a été menée dans un environnement strictement isolé. Aucun service de production réel n'a été impacté. L'objectif était d'auditer la sécurité du composant **boot2root** et d'extraire les drapeaux de contrôle prouvant la faisabilité de l'attaque.

---

## 2. Phase 1 : Reconnaissance & Cartographie de la Surface d'Attaque
Une phase de reconnaissance passive et active permet d'identifier l'empreinte logicielle et les services en écoute :

```bash
# 1. Énumération des ports et bannières de service
nmap -sV -sC -p- 10.10.43.97 -oN nmap_initial_scan.txt

# 2. Découverte applicative locale
curl -i http://localhost:3333/targets/training/b2r-05-fintech-vault-compromise/
```

L'analyse des réponses HTTP et des bannières confirme la présence du composant vulnérable lié à **boot2root, banking, heapdump, actuator, active-directory, esc1**.

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
curl -s -X POST http://localhost:3333/targets/training/b2r-05-fintech-vault-compromise/ \
  -H "Content-Type: application/json" \
  -d '{"exploit_vector": "boot2root"}'
```

---

## 4. Phase 3 : Capture des Drapeaux & Validation des Tâches
Les drapeaux officiels validant la compromission des différentes étapes de la mission :

- **Phase 1 : Extraction d'identifiants depuis le HeapDump** : `SVC_BANKING_CREDS_CARVED` (90 pts)
- **Phase 2 : Accès initial SSH (User Flag)** : `CYBERLAB{user_zurich_capital_banking_ssh_foothold_ok}` (110 pts)
- **Phase 3 : Énumération des modèles PKI Active Directory (AD CS ESC1)** : `ESC1_CERTIFICATE_TEMPLATE_FOUND` (100 pts)
- **Phase 4 : Demande de certificat Administrateur & Root Master Flag** : `CYBERLAB{ZURICH_CAPITAL_PRIVATE_BANKING_CORE_DOMAIN_ADMIN_VAULT}` (200 pts)

---

## 5. Recommandations de Remédiation (Mesures Défensives Blue Team)
1. **Application du principe de moindre privilège** (Least Privilege Principle) sur tous les comptes et processus.
2. **Validation stricte par liste blanche** des données en entrée (Input Sanitization) et requêtes préparées pour toutes les interactions en base.
3. **Mise à jour des composants logiciels** vers les versions patchées éliminant MULTI-CVE.
4. **Cloisonnement réseau et conteneurs** : Interdiction du mode privileged, montage en lecture seule des volumes système.

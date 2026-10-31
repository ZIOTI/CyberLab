# Rapport d'Exploitation & Débriefing Technique // DocuHealth Telehealth BOLA / IDOR Vulnerability
**Organisation cible** : DocuHealth Telemedicine Platform  
**Système d'exploitation** : API | **Catégorie** : APIs & Microservices  
**Difficulté** : BEGINNER | **Vecteur de vulnérabilité** : CWE-639  
**Classification** : DOCUMENT OFFICIEL DU LABORATOIRE CYBERLAB REDTEAM  

---

## 1. Contexte Opérationnel & Règles d'Engagement
L'application de télémédecine DocuHealth expose un endpoint REST /api/patients/:id/medical-records. L'API vérifie que l'utilisateur est authentifié, mais omet de vérifier s'il est autorisé à consulter le dossier médical du patient ciblé (Broken Object Level Authorization - BOLA / IDOR). En incrémentant l'ID séquentiel vers l'ID 01, consulte le dossier médical du président du conseil d'administration.

L'évaluation a été menée dans un environnement strictement isolé. Aucun service de production réel n'a été impacté. L'objectif était d'auditer la sécurité du composant **api** et d'extraire les drapeaux de contrôle prouvant la faisabilité de l'attaque.

---

## 2. Phase 1 : Reconnaissance & Cartographie de la Surface d'Attaque
Une phase de reconnaissance passive et active permet d'identifier l'empreinte logicielle et les services en écoute :

```bash
# 1. Énumération des ports et bannières de service
nmap -sV -sC -p- 10.10.35.92 -oN nmap_initial_scan.txt

# 2. Découverte applicative locale
curl -i http://localhost:3333/targets/training/api-01-bola-profile/
```

L'analyse des réponses HTTP et des bannières confirme la présence du composant vulnérable lié à **api, bola, idor, telehealth, broken-object-level-auth**.

---

## 3. Phase 2 : Exploitation Technique Pas-à-Pas

### A. Analyse de la Vulnérabilité
La faille provient d'une insuffisance de validation des contrôles d'accès et des données d'entrée au niveau de **CWE-639**. Le système interprète les paramètres non assainis sans barrière d'isolation.

### B. Élaboration du Vecteur d'Attaque
En appliquant la méthodologie offensive standard :
1. **Étape 1** : Injection du marqueur de diagnostic pour vérifier l'absence d'échappement.
2. **Étape 2** : Construction du payload weaponisé adapté à l'architecture cible.
3. **Étape 3** : Déclenchement de l'exécution et capture des privilèges.

```bash
# Exemple de commande d'exploitation standard
curl -s -X POST http://localhost:3333/targets/training/api-01-bola-profile/ \
  -H "Content-Type: application/json" \
  -d '{"exploit_vector": "api"}'
```

---

## 4. Phase 3 : Capture des Drapeaux & Validation des Tâches
Les drapeaux officiels validant la compromission des différentes étapes de la mission :

- **Identification de l'IDOR sur l'endpoint patient** : `01` (40 pts)
- **Pathologie confidentielle du VIP** : `Arrythmie Cardiaque Stade II` (30 pts)
- **Extraction du flag médical** : `CYBERLAB{BOLA_DOCUHEALTH_PATIENT_RECORDS_EXPOSED_882}` (30 pts)

---

## 5. Recommandations de Remédiation (Mesures Défensives Blue Team)
1. **Application du principe de moindre privilège** (Least Privilege Principle) sur tous les comptes et processus.
2. **Validation stricte par liste blanche** des données en entrée (Input Sanitization) et requêtes préparées pour toutes les interactions en base.
3. **Mise à jour des composants logiciels** vers les versions patchées éliminant CWE-639.
4. **Cloisonnement réseau et conteneurs** : Interdiction du mode privileged, montage en lecture seule des volumes système.

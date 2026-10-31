# Rapport d'Exploitation & Débriefing Technique // Ghost Corporation Wayback Footprinting
**Organisation cible** : Aegis Corporate Reconnaissance  
**Système d'exploitation** : Linux | **Catégorie** : OSINT & Recon  
**Difficulté** : BEGINNER | **Vecteur de vulnérabilité** : CWE-200  
**Classification** : DOCUMENT OFFICIEL DU LABORATOIRE CYBERLAB REDTEAM  

---

## 1. Contexte Opérationnel & Règles d'Engagement
L'entreprise 'Kestrel Aerospace' semble avoir effacé un site de pré-production après un incident de sécurité en 2023. En inspectant les archives web simulées (Wayback Machine), les enregistrements DNS historiques et les certificats numériques, retrouve le nom du sous-domaine de test qui a fait l'objet d'une fuite.

L'évaluation a été menée dans un environnement strictement isolé. Aucun service de production réel n'a été impacté. L'objectif était d'auditer la sécurité du composant **osint** et d'extraire les drapeaux de contrôle prouvant la faisabilité de l'attaque.

---

## 2. Phase 1 : Reconnaissance & Cartographie de la Surface d'Attaque
Une phase de reconnaissance passive et active permet d'identifier l'empreinte logicielle et les services en écoute :

```bash
# 1. Énumération des ports et bannières de service
nmap -sV -sC -p- 10.10.34.162 -oN nmap_initial_scan.txt

# 2. Découverte applicative locale
curl -i http://localhost:3333/targets/training/osint-02-company-footprint/
```

L'analyse des réponses HTTP et des bannières confirme la présence du composant vulnérable lié à **osint, footprinting, wayback, dns, archive**.

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
curl -s -X POST http://localhost:3333/targets/training/osint-02-company-footprint/ \
  -H "Content-Type: application/json" \
  -d '{"exploit_vector": "osint"}'
```

---

## 4. Phase 3 : Capture des Drapeaux & Validation des Tâches
Les drapeaux officiels validant la compromission des différentes étapes de la mission :

- **Adresse IP du serveur DNS historique** : `198.51.100.25` (30 pts)
- **Sous-domaine caché découvert** : `staging-corp-internal.kestrel.lab` (30 pts)
- **Drapeau de clôture de l'enquête** : `CYBERLAB{OSINT_WAYBACK_HISTORICAL_DNS_FOOTPRINT_UNCOVERED}` (40 pts)

---

## 5. Recommandations de Remédiation (Mesures Défensives Blue Team)
1. **Application du principe de moindre privilège** (Least Privilege Principle) sur tous les comptes et processus.
2. **Validation stricte par liste blanche** des données en entrée (Input Sanitization) et requêtes préparées pour toutes les interactions en base.
3. **Mise à jour des composants logiciels** vers les versions patchées éliminant CWE-200.
4. **Cloisonnement réseau et conteneurs** : Interdiction du mode privileged, montage en lecture seule des volumes système.

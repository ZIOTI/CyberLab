# Rapport d'Exploitation & Débriefing Technique // InvoicexML Entity Harvester
**Organisation cible** : Enterprise B2B Billing Gateway  
**Système d'exploitation** : Linux | **Catégorie** : Web & APIs  
**Difficulté** : INTERMEDIATE | **Vecteur de vulnérabilité** : CWE-611  
**Classification** : DOCUMENT OFFICIEL DU LABORATOIRE CYBERLAB REDTEAM  

---

## 1. Contexte Opérationnel & Règles d'Engagement
Le module de traitement des factures électroniques d'un système ERP traite des documents XML sans désactiver les entités externes (DTD). Définis une entité externe <!ENTITY xxe SYSTEM 'file:///etc/passwd'> dans la structure DOCTYPE pour forcer le parseur à injecter le contenu d'un fichier local sensible dans le compte-rendu de facturation.

L'évaluation a été menée dans un environnement strictement isolé. Aucun service de production réel n'a été impacté. L'objectif était d'auditer la sécurité du composant **xxe** et d'extraire les drapeaux de contrôle prouvant la faisabilité de l'attaque.

---

## 2. Phase 1 : Reconnaissance & Cartographie de la Surface d'Attaque
Une phase de reconnaissance passive et active permet d'identifier l'empreinte logicielle et les services en écoute :

```bash
# 1. Énumération des ports et bannières de service
nmap -sV -sC -p- 10.10.11.98 -oN nmap_initial_scan.txt

# 2. Découverte applicative locale
curl -i http://localhost:3333/targets/training/web-12-xxe-injection/
```

L'analyse des réponses HTTP et des bannières confirme la présence du composant vulnérable lié à **xxe, xml-injection, entity-expansion, file-read, xml-parser**.

---

## 3. Phase 2 : Exploitation Technique Pas-à-Pas

### A. Analyse de la Vulnérabilité
La faille provient d'une insuffisance de validation des contrôles d'accès et des données d'entrée au niveau de **CWE-611**. Le système interprète les paramètres non assainis sans barrière d'isolation.

### B. Élaboration du Vecteur d'Attaque
En appliquant la méthodologie offensive standard :
1. **Étape 1** : Injection du marqueur de diagnostic pour vérifier l'absence d'échappement.
2. **Étape 2** : Construction du payload weaponisé adapté à l'architecture cible.
3. **Étape 3** : Déclenchement de l'exécution et capture des privilèges.

```bash
# Exemple de commande d'exploitation standard
curl -s -X POST http://localhost:3333/targets/training/web-12-xxe-injection/ \
  -H "Content-Type: application/json" \
  -d '{"exploit_vector": "xxe"}'
```

---

## 4. Phase 3 : Capture des Drapeaux & Validation des Tâches
Les drapeaux officiels validant la compromission des différentes étapes de la mission :

- **Identification du parseur vulnérable** : `ENTITY_EXPANDED` (50 pts)
- **Définition d'une entité externe SYSTEM** : `SYSTEM` (50 pts)
- **Exfiltration de /etc/shadow & Flag** : `CYBERLAB{XXE_SYSTEM_FILE_ENTITY_EXPANSION_SUCCESS}` (100 pts)

---

## 5. Recommandations de Remédiation (Mesures Défensives Blue Team)
1. **Application du principe de moindre privilège** (Least Privilege Principle) sur tous les comptes et processus.
2. **Validation stricte par liste blanche** des données en entrée (Input Sanitization) et requêtes préparées pour toutes les interactions en base.
3. **Mise à jour des composants logiciels** vers les versions patchées éliminant CWE-611.
4. **Cloisonnement réseau et conteneurs** : Interdiction du mode privileged, montage en lecture seule des volumes système.

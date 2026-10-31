# Rapport d'Exploitation & Débriefing Technique // The Mended Central Directory Archive
**Organisation cible** : SecOps Incident Response Unit  
**Système d'exploitation** : Linux | **Catégorie** : Forensics & Mémoire  
**Difficulté** : EASY | **Vecteur de vulnérabilité** : CWE-20  
**Classification** : DOCUMENT OFFICIEL DU LABORATOIRE CYBERLAB REDTEAM  

---

## 1. Contexte Opérationnel & Règles d'Engagement
Une archive ZIP contenant des journaux d'audit a été endommagée : l'enregistrement de fin de répertoire central (End of Central Directory Record - EOCD) a été corrompu par un outil d'effacement sécurisé. Reconstruis les signatures PK\x01\x02 et PK\x05\x06 à l'aide de zipdetails ou d'un script Python pour réparer l'archive et décompresser le fichier secret.

L'évaluation a été menée dans un environnement strictement isolé. Aucun service de production réel n'a été impacté. L'objectif était d'auditer la sécurité du composant **forensics** et d'extraire les drapeaux de contrôle prouvant la faisabilité de l'attaque.

---

## 2. Phase 1 : Reconnaissance & Cartographie de la Surface d'Attaque
Une phase de reconnaissance passive et active permet d'identifier l'empreinte logicielle et les services en écoute :

```bash
# 1. Énumération des ports et bannières de service
nmap -sV -sC -p- 10.10.36.107 -oN nmap_initial_scan.txt

# 2. Découverte applicative locale
curl -i http://localhost:3333/targets/training/forensics-05-corrupted-zip/
```

L'analyse des réponses HTTP et des bannières confirme la présence du composant vulnérable lié à **forensics, zip-repair, central-directory, hex-carving, pkzip**.

---

## 3. Phase 2 : Exploitation Technique Pas-à-Pas

### A. Analyse de la Vulnérabilité
La faille provient d'une insuffisance de validation des contrôles d'accès et des données d'entrée au niveau de **CWE-20**. Le système interprète les paramètres non assainis sans barrière d'isolation.

### B. Élaboration du Vecteur d'Attaque
En appliquant la méthodologie offensive standard :
1. **Étape 1** : Injection du marqueur de diagnostic pour vérifier l'absence d'échappement.
2. **Étape 2** : Construction du payload weaponisé adapté à l'architecture cible.
3. **Étape 3** : Déclenchement de l'exécution et capture des privilèges.

```bash
# Exemple de commande d'exploitation standard
curl -s -X POST http://localhost:3333/targets/training/forensics-05-corrupted-zip/ \
  -H "Content-Type: application/json" \
  -d '{"exploit_vector": "forensics"}'
```

---

## 4. Phase 3 : Capture des Drapeaux & Validation des Tâches
Les drapeaux officiels validant la compromission des différentes étapes de la mission :

- **Signature hexadécimale du Central Directory** : `504B0304` (50 pts)
- **Réparation et extraction du document & Flag** : `CYBERLAB{ZIP_CENTRAL_DIRECTORY_HEADER_MANUALLY_FIXED}` (100 pts)

---

## 5. Recommandations de Remédiation (Mesures Défensives Blue Team)
1. **Application du principe de moindre privilège** (Least Privilege Principle) sur tous les comptes et processus.
2. **Validation stricte par liste blanche** des données en entrée (Input Sanitization) et requêtes préparées pour toutes les interactions en base.
3. **Mise à jour des composants logiciels** vers les versions patchées éliminant CWE-20.
4. **Cloisonnement réseau et conteneurs** : Interdiction du mode privileged, montage en lecture seule des volumes système.

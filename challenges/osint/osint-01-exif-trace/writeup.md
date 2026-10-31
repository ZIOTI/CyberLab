# Rapport d'Exploitation & Débriefing Technique // EXIF Metadata Geolocation Tracking
**Organisation cible** : Covert Investigative Intelligence Bureau  
**Système d'exploitation** : Linux | **Catégorie** : OSINT & Recon  
**Difficulté** : BEGINNER | **Vecteur de vulnérabilité** : CWE-200  
**Classification** : DOCUMENT OFFICIEL DU LABORATOIRE CYBERLAB REDTEAM  

---

## 1. Contexte Opérationnel & Règles d'Engagement
Une photo a été publiée sur un forum underground par un membre d'un groupe cybercriminel. L'appareil photo utilisé a enregistré les métadonnées Exchangeable Image File Format (EXIF), incluant les coordonnées géographiques GPS précises, le modèle de l'appareil et le numéro de série de l'objectif. Utilise exiftool pour localiser l'emplacement exact de la prise de vue.

L'évaluation a été menée dans un environnement strictement isolé. Aucun service de production réel n'a été impacté. L'objectif était d'auditer la sécurité du composant **osint** et d'extraire les drapeaux de contrôle prouvant la faisabilité de l'attaque.

---

## 2. Phase 1 : Reconnaissance & Cartographie de la Surface d'Attaque
Une phase de reconnaissance passive et active permet d'identifier l'empreinte logicielle et les services en écoute :

```bash
# 1. Énumération des ports et bannières de service
nmap -sV -sC -p- 10.10.46.44 -oN nmap_initial_scan.txt

# 2. Découverte applicative locale
curl -i http://localhost:3333/targets/training/osint-01-exif-trace/
```

L'analyse des réponses HTTP et des bannières confirme la présence du composant vulnérable lié à **osint, exif, metadata, geolocation, exiftool**.

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
curl -s -X POST http://localhost:3333/targets/training/osint-01-exif-trace/ \
  -H "Content-Type: application/json" \
  -d '{"exploit_vector": "osint"}'
```

---

## 4. Phase 3 : Capture des Drapeaux & Validation des Tâches
Les drapeaux officiels validant la compromission des différentes étapes de la mission :

- **Modèle de l'appareil photographique** : `Sony Alpha 7 IV` (40 pts)
- **Coordonnées GPS et Flag** : `CYBERLAB{EXIF_GPS_METADATA_EXTRACTED_LOC_48_8584}` (60 pts)

---

## 5. Recommandations de Remédiation (Mesures Défensives Blue Team)
1. **Application du principe de moindre privilège** (Least Privilege Principle) sur tous les comptes et processus.
2. **Validation stricte par liste blanche** des données en entrée (Input Sanitization) et requêtes préparées pour toutes les interactions en base.
3. **Mise à jour des composants logiciels** vers les versions patchées éliminant CWE-200.
4. **Cloisonnement réseau et conteneurs** : Interdiction du mode privileged, montage en lecture seule des volumes système.

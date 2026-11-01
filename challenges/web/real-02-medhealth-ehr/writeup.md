# Solution Détaillée // MedHealth Clinic EHR Portal

## 1. Découverte de l'application
Le site hospitalier propose plusieurs sections :
- `/targets/training/real-02-medhealth/` (Accueil clinique)
- `/targets/training/real-02-medhealth/portal` (Connexion patient)
- `/targets/training/real-02-medhealth/prescriptions` (Ordonnances)
- `/targets/training/real-02-medhealth/radiology` (Radiologies)

## 2. Exploitation IDOR
La requête `GET /targets/training/real-02-medhealth/api/patient?id=9001` ne valide pas la session de l'utilisateur connecté et retourne le dossier secret avec le flag :
`CTF{REAL_MEDHEALTH_PATIENT_RECORDS_EXFIL}`.

## 3. Remédiation & Protection
- Utiliser des UUID v4 aléatoires au lieu d'ID numériques séquentiels.
- Valider systématiquement que le patient connecté est bien l'ayant-droit du dossier demandé.
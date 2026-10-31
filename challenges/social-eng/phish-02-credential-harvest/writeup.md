# Rapport d'Exploitation & Débriefing Technique // Cloned SSO Credential Harvester Analysis
**Organisation cible** : Phishing Threat Defense Team  
**Système d'exploitation** : Linux | **Catégorie** : Social Engineering  
**Difficulté** : BEGINNER | **Vecteur de vulnérabilité** : CWE-200  
**Classification** : DOCUMENT OFFICIEL DU LABORATOIRE CYBERLAB REDTEAM  

---

## 1. Contexte Opérationnel & Règles d'Engagement
Une campagne d'hameçonnage a diffusé un lien vers un clone parfait de la mire d'authentification Microsoft 365 de l'entreprise. En inspectant le code source de la page web malveillante (form action, scripts de capture de frappe JavaScript), découvre le serveur de commandement (C2) vers lequel les identifiants volés sont expédiés en arrière-plan.

L'évaluation a été menée dans un environnement strictement isolé. Aucun service de production réel n'a été impacté. L'objectif était d'auditer la sécurité du composant **social-eng** et d'extraire les drapeaux de contrôle prouvant la faisabilité de l'attaque.

---

## 2. Phase 1 : Reconnaissance & Cartographie de la Surface d'Attaque
Une phase de reconnaissance passive et active permet d'identifier l'empreinte logicielle et les services en écoute :

```bash
# 1. Énumération des ports et bannières de service
nmap -sV -sC -p- 10.10.16.129 -oN nmap_initial_scan.txt

# 2. Découverte applicative locale
curl -i http://localhost:3333/targets/training/phish-02-credential-harvest/
```

L'analyse des réponses HTTP et des bannières confirme la présence du composant vulnérable lié à **social-eng, phishing, harvesting, cloned-portal, javascript**.

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
curl -s -X POST http://localhost:3333/targets/training/phish-02-credential-harvest/ \
  -H "Content-Type: application/json" \
  -d '{"exploit_vector": "social-eng"}'
```

---

## 4. Phase 3 : Capture des Drapeaux & Validation des Tâches
Les drapeaux officiels validant la compromission des différentes étapes de la mission :

- **URL du script d'exfiltration en arrière-plan** : `http://c2-collector.attacker.net/harvest.php` (40 pts)
- **Méthode d'interception des frappes clavier** : `onkeyup` (30 pts)
- **Clôture du dossier & Flag** : `CYBERLAB{PHISHING_CLONED_LOGIN_EXFILTRATION_POST_FOUND}` (30 pts)

---

## 5. Recommandations de Remédiation (Mesures Défensives Blue Team)
1. **Application du principe de moindre privilège** (Least Privilege Principle) sur tous les comptes et processus.
2. **Validation stricte par liste blanche** des données en entrée (Input Sanitization) et requêtes préparées pour toutes les interactions en base.
3. **Mise à jour des composants logiciels** vers les versions patchées éliminant CWE-200.
4. **Cloisonnement réseau et conteneurs** : Interdiction du mode privileged, montage en lecture seule des volumes système.

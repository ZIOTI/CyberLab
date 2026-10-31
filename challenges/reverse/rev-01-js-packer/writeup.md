# Rapport d'Exploitation & Débriefing Technique // Obfuscated JavaScript Loader Deobfuscation
**Organisation cible** : FinTech Web Application Defense  
**Système d'exploitation** : Linux | **Catégorie** : Reverse Engineering  
**Difficulté** : BEGINNER | **Vecteur de vulnérabilité** : CWE-312  
**Classification** : DOCUMENT OFFICIEL DU LABORATOIRE CYBERLAB REDTEAM  

---

## 1. Contexte Opérationnel & Règles d'Engagement
Un script client de vérification de licence a été obfusqué avec un compresseur JS Packer et un tableau de chaînes chiffrées par décalage. Utilise les outils de développement Chrome, un déobfuscateur AST ou une exécution pas-à-pas dans un bac à sable Node.js sécurisé pour nettoyer le code et trouver le mot de passe secret de validation.

L'évaluation a été menée dans un environnement strictement isolé. Aucun service de production réel n'a été impacté. L'objectif était d'auditer la sécurité du composant **reverse** et d'extraire les drapeaux de contrôle prouvant la faisabilité de l'attaque.

---

## 2. Phase 1 : Reconnaissance & Cartographie de la Surface d'Attaque
Une phase de reconnaissance passive et active permet d'identifier l'empreinte logicielle et les services en écoute :

```bash
# 1. Énumération des ports et bannières de service
nmap -sV -sC -p- 10.10.22.39 -oN nmap_initial_scan.txt

# 2. Découverte applicative locale
curl -i http://localhost:3333/targets/training/rev-01-js-packer/
```

L'analyse des réponses HTTP et des bannières confirme la présence du composant vulnérable lié à **reverse, javascript, deobfuscation, js-packer, ast**.

---

## 3. Phase 2 : Exploitation Technique Pas-à-Pas

### A. Analyse de la Vulnérabilité
La faille provient d'une insuffisance de validation des contrôles d'accès et des données d'entrée au niveau de **CWE-312**. Le système interprète les paramètres non assainis sans barrière d'isolation.

### B. Élaboration du Vecteur d'Attaque
En appliquant la méthodologie offensive standard :
1. **Étape 1** : Injection du marqueur de diagnostic pour vérifier l'absence d'échappement.
2. **Étape 2** : Construction du payload weaponisé adapté à l'architecture cible.
3. **Étape 3** : Déclenchement de l'exécution et capture des privilèges.

```bash
# Exemple de commande d'exploitation standard
curl -s -X POST http://localhost:3333/targets/training/rev-01-js-packer/ \
  -H "Content-Type: application/json" \
  -d '{"exploit_vector": "reverse"}'
```

---

## 4. Phase 3 : Capture des Drapeaux & Validation des Tâches
Les drapeaux officiels validant la compromission des différentes étapes de la mission :

- **Nom du tableau de chaînes obfusqué** : `_0x4e21` (40 pts)
- **Clé secrète de licence & Flag** : `CYBERLAB{JAVASCRIPT_DEOBFUSCATION_PACKER_CRACKED_SUCCESS}` (60 pts)

---

## 5. Recommandations de Remédiation (Mesures Défensives Blue Team)
1. **Application du principe de moindre privilège** (Least Privilege Principle) sur tous les comptes et processus.
2. **Validation stricte par liste blanche** des données en entrée (Input Sanitization) et requêtes préparées pour toutes les interactions en base.
3. **Mise à jour des composants logiciels** vers les versions patchées éliminant CWE-312.
4. **Cloisonnement réseau et conteneurs** : Interdiction du mode privileged, montage en lecture seule des volumes système.

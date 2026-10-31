# Rapport d'Exploitation & Débriefing Technique // CryptoZenith Voucher Double Spend
**Organisation cible** : CryptoZenith Digital Exchange  
**Système d'exploitation** : Linux | **Catégorie** : Web & APIs  
**Difficulté** : INTERMEDIATE | **Vecteur de vulnérabilité** : CWE-362  
**Classification** : DOCUMENT OFFICIEL DU LABORATOIRE CYBERLAB REDTEAM  

---

## 1. Contexte Opérationnel & Règles d'Engagement
L'application de courtage en devises numériques CryptoZenith offre des bons d'achat de bienvenue de 50 €. La validation du bon et la mise à jour du solde ne s'exécutent pas au sein d'une transaction atomique (Time-of-Check to Time-of-Use). Utilise l'extension Burp Turbo Intruder ou un script multithreadé pour soumettre simultanément 20 requêtes d'échange de coupon et démultiplier ton solde.

L'évaluation a été menée dans un environnement strictement isolé. Aucun service de production réel n'a été impacté. L'objectif était d'auditer la sécurité du composant **race-condition** et d'extraire les drapeaux de contrôle prouvant la faisabilité de l'attaque.

---

## 2. Phase 1 : Reconnaissance & Cartographie de la Surface d'Attaque
Une phase de reconnaissance passive et active permet d'identifier l'empreinte logicielle et les services en écoute :

```bash
# 1. Énumération des ports et bannières de service
nmap -sV -sC -p- 10.10.18.61 -oN nmap_initial_scan.txt

# 2. Découverte applicative locale
curl -i http://localhost:3333/targets/training/web-16-race-condition/
```

L'analyse des réponses HTTP et des bannières confirme la présence du composant vulnérable lié à **race-condition, toctou, concurrency, turbo-intruder, fintech**.

---

## 3. Phase 2 : Exploitation Technique Pas-à-Pas

### A. Analyse de la Vulnérabilité
La faille provient d'une insuffisance de validation des contrôles d'accès et des données d'entrée au niveau de **CWE-362**. Le système interprète les paramètres non assainis sans barrière d'isolation.

### B. Élaboration du Vecteur d'Attaque
En appliquant la méthodologie offensive standard :
1. **Étape 1** : Injection du marqueur de diagnostic pour vérifier l'absence d'échappement.
2. **Étape 2** : Construction du payload weaponisé adapté à l'architecture cible.
3. **Étape 3** : Déclenchement de l'exécution et capture des privilèges.

```bash
# Exemple de commande d'exploitation standard
curl -s -X POST http://localhost:3333/targets/training/web-16-race-condition/ \
  -H "Content-Type: application/json" \
  -d '{"exploit_vector": "race-condition"}'
```

---

## 4. Phase 3 : Capture des Drapeaux & Validation des Tâches
Les drapeaux officiels validant la compromission des différentes étapes de la mission :

- **Analyse de la fenêtre de concurrence** : `TOCTOU_IDENTIFIED` (50 pts)
- **Multiplication du solde par requêtes parallèles** : `BALANCE_EXCEEDED_500` (50 pts)
- **Achat de l'actif VIP & Flag** : `CYBERLAB{TURBO_INTRUDER_RACE_CONDITION_BALANCE_MULT}` (100 pts)

---

## 5. Recommandations de Remédiation (Mesures Défensives Blue Team)
1. **Application du principe de moindre privilège** (Least Privilege Principle) sur tous les comptes et processus.
2. **Validation stricte par liste blanche** des données en entrée (Input Sanitization) et requêtes préparées pour toutes les interactions en base.
3. **Mise à jour des composants logiciels** vers les versions patchées éliminant CWE-362.
4. **Cloisonnement réseau et conteneurs** : Interdiction du mode privileged, montage en lecture seule des volumes système.

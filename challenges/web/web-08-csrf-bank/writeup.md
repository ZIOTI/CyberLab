# Rapport d'Exploitation & Débriefing Technique // Novus Pay European NeoBank
**Organisation cible** : Novus Pay NeoBank SAS  
**Système d'exploitation** : Linux | **Catégorie** : Web & APIs  
**Difficulté** : EASY | **Vecteur de vulnérabilité** : CWE-352  
**Classification** : DOCUMENT OFFICIEL DU LABORATOIRE CYBERLAB REDTEAM  

---

## 1. Contexte Opérationnel & Règles d'Engagement
L'application bancaire Novus Pay permet des virements SEPA instantanés via des requêtes HTTP POST sans jeton CSRF et avec des cookies configurés en SameSite=None. Crée une page HTML malveillante qui déclenche automatiquement un virement de 5 000 € vers le compte d'un attaquant dès qu'un utilisateur connecté visite le lien piégé.

L'évaluation a été menée dans un environnement strictement isolé. Aucun service de production réel n'a été impacté. L'objectif était d'auditer la sécurité du composant **csrf** et d'extraire les drapeaux de contrôle prouvant la faisabilité de l'attaque.

---

## 2. Phase 1 : Reconnaissance & Cartographie de la Surface d'Attaque
Une phase de reconnaissance passive et active permet d'identifier l'empreinte logicielle et les services en écoute :

```bash
# 1. Énumération des ports et bannières de service
nmap -sV -sC -p- 10.10.59.7 -oN nmap_initial_scan.txt

# 2. Découverte applicative locale
curl -i http://localhost:3333/targets/training/web-08-csrf-bank/
```

L'analyse des réponses HTTP et des bannières confirme la présence du composant vulnérable lié à **csrf, cross-site-request-forgery, banking, samesite, financial**.

---

## 3. Phase 2 : Exploitation Technique Pas-à-Pas

### A. Analyse de la Vulnérabilité
La faille provient d'une insuffisance de validation des contrôles d'accès et des données d'entrée au niveau de **CWE-352**. Le système interprète les paramètres non assainis sans barrière d'isolation.

### B. Élaboration du Vecteur d'Attaque
En appliquant la méthodologie offensive standard :
1. **Étape 1** : Injection du marqueur de diagnostic pour vérifier l'absence d'échappement.
2. **Étape 2** : Construction du payload weaponisé adapté à l'architecture cible.
3. **Étape 3** : Déclenchement de l'exécution et capture des privilèges.

```bash
# Exemple de commande d'exploitation standard
curl -s -X POST http://localhost:3333/targets/training/web-08-csrf-bank/ \
  -H "Content-Type: application/json" \
  -d '{"exploit_vector": "csrf"}'
```

---

## 4. Phase 3 : Capture des Drapeaux & Validation des Tâches
Les drapeaux officiels validant la compromission des différentes étapes de la mission :

- **Vérification de l'absence de jeton anti-CSRF** : `NO_CSRF_TOKEN` (40 pts)
- **Construction du formulaire auto-soumis** : `EXPLOIT_PAGE_CRAFTED` (50 pts)
- **Exécution du virement & Flag** : `CYBERLAB{CSRF_SAME_SITE_NONE_TRANSFER_PWNED}` (60 pts)

---

## 5. Recommandations de Remédiation (Mesures Défensives Blue Team)
1. **Application du principe de moindre privilège** (Least Privilege Principle) sur tous les comptes et processus.
2. **Validation stricte par liste blanche** des données en entrée (Input Sanitization) et requêtes préparées pour toutes les interactions en base.
3. **Mise à jour des composants logiciels** vers les versions patchées éliminant CWE-352.
4. **Cloisonnement réseau et conteneurs** : Interdiction du mode privileged, montage en lecture seule des volumes système.

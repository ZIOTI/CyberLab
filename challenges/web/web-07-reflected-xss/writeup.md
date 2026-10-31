# Rapport d'Exploitation & Débriefing Technique // Skyline Riviera Luxury Realty
**Organisation cible** : Skyline Riviera International Realty  
**Système d'exploitation** : Linux | **Catégorie** : Web & APIs  
**Difficulté** : BEGINNER | **Vecteur de vulnérabilité** : CWE-79  
**Classification** : DOCUMENT OFFICIEL DU LABORATOIRE CYBERLAB REDTEAM  

---

## 1. Contexte Opérationnel & Règles d'Engagement
L'agence immobilière haut de gamme Skyline Riviera propose un moteur de recherche de villas méditerranéennes. Le terme de recherche utilisateur est réinjecté directement dans la page de résultats sans encodage HTML d'entités. Fabrique un lien personnalisé contenant une charge XSS réfléchie capable de voler les jetons de session d'un acheteur VIP.

L'évaluation a été menée dans un environnement strictement isolé. Aucun service de production réel n'a été impacté. L'objectif était d'auditer la sécurité du composant **xss** et d'extraire les drapeaux de contrôle prouvant la faisabilité de l'attaque.

---

## 2. Phase 1 : Reconnaissance & Cartographie de la Surface d'Attaque
Une phase de reconnaissance passive et active permet d'identifier l'empreinte logicielle et les services en écoute :

```bash
# 1. Énumération des ports et bannières de service
nmap -sV -sC -p- 10.10.50.156 -oN nmap_initial_scan.txt

# 2. Découverte applicative locale
curl -i http://localhost:3333/targets/training/web-07-reflected-xss/
```

L'analyse des réponses HTTP et des bannières confirme la présence du composant vulnérable lié à **xss, reflected-xss, dom, url-parameters, real-estate**.

---

## 3. Phase 2 : Exploitation Technique Pas-à-Pas

### A. Analyse de la Vulnérabilité
La faille provient d'une insuffisance de validation des contrôles d'accès et des données d'entrée au niveau de **CWE-79**. Le système interprète les paramètres non assainis sans barrière d'isolation.

### B. Élaboration du Vecteur d'Attaque
En appliquant la méthodologie offensive standard :
1. **Étape 1** : Injection du marqueur de diagnostic pour vérifier l'absence d'échappement.
2. **Étape 2** : Construction du payload weaponisé adapté à l'architecture cible.
3. **Étape 3** : Déclenchement de l'exécution et capture des privilèges.

```bash
# Exemple de commande d'exploitation standard
curl -s -X POST http://localhost:3333/targets/training/web-07-reflected-xss/ \
  -H "Content-Type: application/json" \
  -d '{"exploit_vector": "xss"}'
```

---

## 4. Phase 3 : Capture des Drapeaux & Validation des Tâches
Les drapeaux officiels validant la compromission des différentes étapes de la mission :

- **Détection du paramètre réfléchi** : `q` (30 pts)
- **Échappement du contexte de recherche** : `XSS_REFLECTED_FIRED` (30 pts)
- **Capture de session & Flag** : `CYBERLAB{REFLECTED_XSS_QUERY_PARAM_INJECT_SUCCESS}` (40 pts)

---

## 5. Recommandations de Remédiation (Mesures Défensives Blue Team)
1. **Application du principe de moindre privilège** (Least Privilege Principle) sur tous les comptes et processus.
2. **Validation stricte par liste blanche** des données en entrée (Input Sanitization) et requêtes préparées pour toutes les interactions en base.
3. **Mise à jour des composants logiciels** vers les versions patchées éliminant CWE-79.
4. **Cloisonnement réseau et conteneurs** : Interdiction du mode privileged, montage en lecture seule des volumes système.

# Rapport d'Exploitation & Débriefing Technique // Varnish Unkeyed Header Cache Poison
**Organisation cible** : Global CDN Delivery Edge  
**Système d'exploitation** : Cloud | **Catégorie** : Web & APIs  
**Difficulté** : HARD | **Vecteur de vulnérabilité** : CWE-444  
**Classification** : DOCUMENT OFFICIEL DU LABORATOIRE CYBERLAB REDTEAM  

---

## 1. Contexte Opérationnel & Règles d'Engagement
Le serveur mandataire inverse de mise en cache Varnish s'appuie sur l'en-tête hôte X-Forwarded-Host pour générer dynamiquement l'URL de chargement des scripts JavaScript statiques, sans intégrer cet en-tête dans la clé de cache (Unkeyed Header). Empoisonne le cache pour forcer des milliers d'utilisateurs à exécuter ton script externe sur leur navigateur.

L'évaluation a été menée dans un environnement strictement isolé. Aucun service de production réel n'a été impacté. L'objectif était d'auditer la sécurité du composant **cache-poisoning** et d'extraire les drapeaux de contrôle prouvant la faisabilité de l'attaque.

---

## 2. Phase 1 : Reconnaissance & Cartographie de la Surface d'Attaque
Une phase de reconnaissance passive et active permet d'identifier l'empreinte logicielle et les services en écoute :

```bash
# 1. Énumération des ports et bannières de service
nmap -sV -sC -p- 10.10.19.93 -oN nmap_initial_scan.txt

# 2. Découverte applicative locale
curl -i http://localhost:3333/targets/training/web-22-cache-poisoning/
```

L'analyse des réponses HTTP et des bannières confirme la présence du composant vulnérable lié à **cache-poisoning, varnish, unkeyed-headers, x-forwarded-host, cdn**.

---

## 3. Phase 2 : Exploitation Technique Pas-à-Pas

### A. Analyse de la Vulnérabilité
La faille provient d'une insuffisance de validation des contrôles d'accès et des données d'entrée au niveau de **CWE-444**. Le système interprète les paramètres non assainis sans barrière d'isolation.

### B. Élaboration du Vecteur d'Attaque
En appliquant la méthodologie offensive standard :
1. **Étape 1** : Injection du marqueur de diagnostic pour vérifier l'absence d'échappement.
2. **Étape 2** : Construction du payload weaponisé adapté à l'architecture cible.
3. **Étape 3** : Déclenchement de l'exécution et capture des privilèges.

```bash
# Exemple de commande d'exploitation standard
curl -s -X POST http://localhost:3333/targets/training/web-22-cache-poisoning/ \
  -H "Content-Type: application/json" \
  -d '{"exploit_vector": "cache-poisoning"}'
```

---

## 4. Phase 3 : Capture des Drapeaux & Validation des Tâches
Les drapeaux officiels validant la compromission des différentes étapes de la mission :

- **Détection de l'en-tête non clé** : `X-Forwarded-Host` (60 pts)
- **Observation du statut de cache HIT** : `X-Cache: HIT` (80 pts)
- **Détournement de session & Flag** : `CYBERLAB{X_FORWARDED_HOST_CACHE_POISONED_RESPONSE}` (160 pts)

---

## 5. Recommandations de Remédiation (Mesures Défensives Blue Team)
1. **Application du principe de moindre privilège** (Least Privilege Principle) sur tous les comptes et processus.
2. **Validation stricte par liste blanche** des données en entrée (Input Sanitization) et requêtes préparées pour toutes les interactions en base.
3. **Mise à jour des composants logiciels** vers les versions patchées éliminant CWE-444.
4. **Cloisonnement réseau et conteneurs** : Interdiction du mode privileged, montage en lecture seule des volumes système.

# Rapport d'Exploitation & Débriefing Technique // CloudSync Webhook Relay Breach
**Organisation cible** : CloudSync SaaS Integration Hub  
**Système d'exploitation** : Cloud | **Catégorie** : Web & APIs  
**Difficulté** : INTERMEDIATE | **Vecteur de vulnérabilité** : CWE-918  
**Classification** : DOCUMENT OFFICIEL DU LABORATOIRE CYBERLAB REDTEAM  

---

## 1. Contexte Opérationnel & Règles d'Engagement
La plateforme d'automatisation CloudSync permet aux développeurs de configurer des webhooks HTTP sortants. Le backend n'applique aucune restriction sur les adresses IP privées ni sur les adresses link-local de métadonnées cloud. Force le serveur à interroger le service IMDS AWS (169.254.169.254) pour dérober les clés d'accès IAM temporaires du serveur.

L'évaluation a été menée dans un environnement strictement isolé. Aucun service de production réel n'a été impacté. L'objectif était d'auditer la sécurité du composant **ssrf** et d'extraire les drapeaux de contrôle prouvant la faisabilité de l'attaque.

---

## 2. Phase 1 : Reconnaissance & Cartographie de la Surface d'Attaque
Une phase de reconnaissance passive et active permet d'identifier l'empreinte logicielle et les services en écoute :

```bash
# 1. Énumération des ports et bannières de service
nmap -sV -sC -p- 10.10.25.164 -oN nmap_initial_scan.txt

# 2. Découverte applicative locale
curl -i http://localhost:3333/targets/training/web-11-ssrf-webhook/
```

L'analyse des réponses HTTP et des bannières confirme la présence du composant vulnérable lié à **ssrf, cloud-metadata, imds, internal-network, aws**.

---

## 3. Phase 2 : Exploitation Technique Pas-à-Pas

### A. Analyse de la Vulnérabilité
La faille provient d'une insuffisance de validation des contrôles d'accès et des données d'entrée au niveau de **CWE-918**. Le système interprète les paramètres non assainis sans barrière d'isolation.

### B. Élaboration du Vecteur d'Attaque
En appliquant la méthodologie offensive standard :
1. **Étape 1** : Injection du marqueur de diagnostic pour vérifier l'absence d'échappement.
2. **Étape 2** : Construction du payload weaponisé adapté à l'architecture cible.
3. **Étape 3** : Déclenchement de l'exécution et capture des privilèges.

```bash
# Exemple de commande d'exploitation standard
curl -s -X POST http://localhost:3333/targets/training/web-11-ssrf-webhook/ \
  -H "Content-Type: application/json" \
  -d '{"exploit_vector": "ssrf"}'
```

---

## 4. Phase 3 : Capture des Drapeaux & Validation des Tâches
Les drapeaux officiels validant la compromission des différentes étapes de la mission :

- **Test de boucle locale (Localhost SSRF)** : `SSRF_LOOPBACK_CONFIRMED` (50 pts)
- **Interrogation de l'Instance Metadata Service** : `169.254.169.254` (50 pts)
- **Extraction des identifiants IAM & Flag** : `CYBERLAB{SSRF_169_254_CLOUD_METADATA_EXTRACTED}` (100 pts)

---

## 5. Recommandations de Remédiation (Mesures Défensives Blue Team)
1. **Application du principe de moindre privilège** (Least Privilege Principle) sur tous les comptes et processus.
2. **Validation stricte par liste blanche** des données en entrée (Input Sanitization) et requêtes préparées pour toutes les interactions en base.
3. **Mise à jour des composants logiciels** vers les versions patchées éliminant CWE-918.
4. **Cloisonnement réseau et conteneurs** : Interdiction du mode privileged, montage en lecture seule des volumes système.

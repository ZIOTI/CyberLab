# Rapport d'Exploitation & Débriefing Technique // Sorbonne Historical Archives Portal
**Organisation cible** : Institut des Archives Historiques  
**Système d'exploitation** : Linux | **Catégorie** : Web & APIs  
**Difficulté** : EASY | **Vecteur de vulnérabilité** : CWE-98  
**Classification** : DOCUMENT OFFICIEL DU LABORATOIRE CYBERLAB REDTEAM  

---

## 1. Contexte Opérationnel & Règles d'Engagement
Le portail universitaire de consultation des manuscrits anciens utilise un paramètre dynamique include($_GET['page']) pour charger ses fiches documentaires. Les fichiers PHP sensibles s'exécutent côté serveur et masquent leur code source. Exploite les filtres de flux PHP (php://filter) pour encoder le fichier de configuration config.php en Base64 et lire les mots de passe de production codés en dur.

L'évaluation a été menée dans un environnement strictement isolé. Aucun service de production réel n'a été impacté. L'objectif était d'auditer la sécurité du composant **lfi** et d'extraire les drapeaux de contrôle prouvant la faisabilité de l'attaque.

---

## 2. Phase 1 : Reconnaissance & Cartographie de la Surface d'Attaque
Une phase de reconnaissance passive et active permet d'identifier l'empreinte logicielle et les services en écoute :

```bash
# 1. Énumération des ports et bannières de service
nmap -sV -sC -p- 10.10.22.54 -oN nmap_initial_scan.txt

# 2. Découverte applicative locale
curl -i http://localhost:3333/targets/training/web-05-lfi-wrapper/
```

L'analyse des réponses HTTP et des bannières confirme la présence du composant vulnérable lié à **lfi, php-wrappers, base64, source-disclosure, academic**.

---

## 3. Phase 2 : Exploitation Technique Pas-à-Pas

### A. Analyse de la Vulnérabilité
La faille provient d'une insuffisance de validation des contrôles d'accès et des données d'entrée au niveau de **CWE-98**. Le système interprète les paramètres non assainis sans barrière d'isolation.

### B. Élaboration du Vecteur d'Attaque
En appliquant la méthodologie offensive standard :
1. **Étape 1** : Injection du marqueur de diagnostic pour vérifier l'absence d'échappement.
2. **Étape 2** : Construction du payload weaponisé adapté à l'architecture cible.
3. **Étape 3** : Déclenchement de l'exécution et capture des privilèges.

```bash
# Exemple de commande d'exploitation standard
curl -s -X POST http://localhost:3333/targets/training/web-05-lfi-wrapper/ \
  -H "Content-Type: application/json" \
  -d '{"exploit_vector": "lfi"}'
```

---

## 4. Phase 3 : Capture des Drapeaux & Validation des Tâches
Les drapeaux officiels validant la compromission des différentes étapes de la mission :

- **Détection du paramètre vulnérable** : `page` (30 pts)
- **Identification du wrapper PHP** : `convert.base64-encode` (40 pts)
- **Décodage et Flag secret** : `CYBERLAB{PHP_FILTER_BASE64_ENCODE_LFI_CLEARED_881}` (80 pts)

---

## 5. Recommandations de Remédiation (Mesures Défensives Blue Team)
1. **Application du principe de moindre privilège** (Least Privilege Principle) sur tous les comptes et processus.
2. **Validation stricte par liste blanche** des données en entrée (Input Sanitization) et requêtes préparées pour toutes les interactions en base.
3. **Mise à jour des composants logiciels** vers les versions patchées éliminant CWE-98.
4. **Cloisonnement réseau et conteneurs** : Interdiction du mode privileged, montage en lecture seule des volumes système.

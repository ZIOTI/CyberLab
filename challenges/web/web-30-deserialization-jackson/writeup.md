# Rapport d'Exploitation & Débriefing Technique // Enterprise Logistics Java Jackson Polymorphism
**Organisation cible** : EuroFreight Global ERP Integration  
**Système d'exploitation** : Linux | **Catégorie** : Web & APIs  
**Difficulté** : INSANE | **Vecteur de vulnérabilité** : CVE-2019-12384  
**Classification** : DOCUMENT OFFICIEL DU LABORATOIRE CYBERLAB REDTEAM  

---

## 1. Contexte Opérationnel & Règles d'Engagement
L'API de facturation EuroFreight utilise la bibliothèque Jackson-databind avec le typage polymorphique activé (enableDefaultTyping). En soumettant une charge utile JSON ciblant la classe ch.qos.logback.core.db.DriverManagerConnectionSource, force le serveur Java à charger une base de données distante H2 et exécuter du code SQL malveillant pour obtenir un shell distant.

L'évaluation a été menée dans un environnement strictement isolé. Aucun service de production réel n'a été impacté. L'objectif était d'auditer la sécurité du composant **deserialization** et d'extraire les drapeaux de contrôle prouvant la faisabilité de l'attaque.

---

## 2. Phase 1 : Reconnaissance & Cartographie de la Surface d'Attaque
Une phase de reconnaissance passive et active permet d'identifier l'empreinte logicielle et les services en écoute :

```bash
# 1. Énumération des ports et bannières de service
nmap -sV -sC -p- 10.10.23.91 -oN nmap_initial_scan.txt

# 2. Découverte applicative locale
curl -i http://localhost:3333/targets/training/web-30-deserialization-jackson/
```

L'analyse des réponses HTTP et des bannières confirme la présence du composant vulnérable lié à **deserialization, jackson, java, cve-2019-12384, logback**.

---

## 3. Phase 2 : Exploitation Technique Pas-à-Pas

### A. Analyse de la Vulnérabilité
La faille provient d'une insuffisance de validation des contrôles d'accès et des données d'entrée au niveau de **CVE-2019-12384**. Le système interprète les paramètres non assainis sans barrière d'isolation.

### B. Élaboration du Vecteur d'Attaque
En appliquant la méthodologie offensive standard :
1. **Étape 1** : Injection du marqueur de diagnostic pour vérifier l'absence d'échappement.
2. **Étape 2** : Construction du payload weaponisé adapté à l'architecture cible.
3. **Étape 3** : Déclenchement de l'exécution et capture des privilèges.

```bash
# Exemple de commande d'exploitation standard
curl -s -X POST http://localhost:3333/targets/training/web-30-deserialization-jackson/ \
  -H "Content-Type: application/json" \
  -d '{"exploit_vector": "deserialization"}'
```

---

## 4. Phase 3 : Capture des Drapeaux & Validation des Tâches
Les drapeaux officiels validant la compromission des différentes étapes de la mission :

- **Détection du polymorphisme Jackson** : `POLYMORPHIC_TYPING_ENABLED` (90 pts)
- **Dépôt du script SQL d'exécution (User Flag)** : `CYBERLAB{user_jackson_h2_rce_shell_acquired}` (160 pts)
- **Exploitation du conteneur & Root Flag** : `CYBERLAB{JACKSON_DESERIALIZE_H2_LOGBACK_RCE_ROOT_CLEARED}` (200 pts)

---

## 5. Recommandations de Remédiation (Mesures Défensives Blue Team)
1. **Application du principe de moindre privilège** (Least Privilege Principle) sur tous les comptes et processus.
2. **Validation stricte par liste blanche** des données en entrée (Input Sanitization) et requêtes préparées pour toutes les interactions en base.
3. **Mise à jour des composants logiciels** vers les versions patchées éliminant CVE-2019-12384.
4. **Cloisonnement réseau et conteneurs** : Interdiction du mode privileged, montage en lecture seule des volumes système.

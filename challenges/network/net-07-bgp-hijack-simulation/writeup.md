# Rapport d'Exploitation & Débriefing Technique // Autonomous System BGP Prefix Hijack Simulation
**Organisation cible** : Global Internet Exchange Point  
**Système d'exploitation** : Linux | **Catégorie** : Réseau & Infrastructure  
**Difficulté** : INSANE | **Vecteur de vulnérabilité** : CWE-284  
**Classification** : DOCUMENT OFFICIEL DU LABORATOIRE CYBERLAB REDTEAM  

---

## 1. Contexte Opérationnel & Règles d'Engagement
Dans un environnement de routage inter-domaines BGP (Border Gateway Protocol) virtualisé avec FRRouting (FRR), simule un détournement de préfixe BGP (BGP Hijacking) : annonce un préfixe plus spécifique (/24 au lieu de /22) avec un chemin AS plus court pour forcer les routeurs d'échange à rediriger l'intégralité du trafic d'un réseau bancaire vers ton routeur d'interception.

L'évaluation a été menée dans un environnement strictement isolé. Aucun service de production réel n'a été impacté. L'objectif était d'auditer la sécurité du composant **network** et d'extraire les drapeaux de contrôle prouvant la faisabilité de l'attaque.

---

## 2. Phase 1 : Reconnaissance & Cartographie de la Surface d'Attaque
Une phase de reconnaissance passive et active permet d'identifier l'empreinte logicielle et les services en écoute :

```bash
# 1. Énumération des ports et bannières de service
nmap -sV -sC -p- 10.10.13.137 -oN nmap_initial_scan.txt

# 2. Découverte applicative locale
curl -i http://localhost:3333/targets/training/net-07-bgp-hijack-simulation/
```

L'analyse des réponses HTTP et des bannières confirme la présence du composant vulnérable lié à **network, bgp, routing-attack, autonomous-system, prefix-hijack**.

---

## 3. Phase 2 : Exploitation Technique Pas-à-Pas

### A. Analyse de la Vulnérabilité
La faille provient d'une insuffisance de validation des contrôles d'accès et des données d'entrée au niveau de **CWE-284**. Le système interprète les paramètres non assainis sans barrière d'isolation.

### B. Élaboration du Vecteur d'Attaque
En appliquant la méthodologie offensive standard :
1. **Étape 1** : Injection du marqueur de diagnostic pour vérifier l'absence d'échappement.
2. **Étape 2** : Construction du payload weaponisé adapté à l'architecture cible.
3. **Étape 3** : Déclenchement de l'exécution et capture des privilèges.

```bash
# Exemple de commande d'exploitation standard
curl -s -X POST http://localhost:3333/targets/training/net-07-bgp-hijack-simulation/ \
  -H "Content-Type: application/json" \
  -d '{"exploit_vector": "network"}'
```

---

## 4. Phase 3 : Capture des Drapeaux & Validation des Tâches
Les drapeaux officiels validant la compromission des différentes étapes de la mission :

- **Règle de sélection de route BGP prépondérante** : `Longest Prefix Match` (100 pts)
- **Annonce du préfixe pirate (User Flag)** : `CYBERLAB{user_bgp_route_injection_traffic_diverted}` (150 pts)
- **Interception des transactions & Root Flag** : `CYBERLAB{BGP_PREFIX_HIJACK_MED_METRIC_ROUTING_POISONED}` (250 pts)

---

## 5. Recommandations de Remédiation (Mesures Défensives Blue Team)
1. **Application du principe de moindre privilège** (Least Privilege Principle) sur tous les comptes et processus.
2. **Validation stricte par liste blanche** des données en entrée (Input Sanitization) et requêtes préparées pour toutes les interactions en base.
3. **Mise à jour des composants logiciels** vers les versions patchées éliminant CWE-284.
4. **Cloisonnement réseau et conteneurs** : Interdiction du mode privileged, montage en lecture seule des volumes système.

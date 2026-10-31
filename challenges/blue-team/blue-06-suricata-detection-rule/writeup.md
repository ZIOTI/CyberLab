# Rapport d'Exploitation & Débriefing Technique // SOC Perimeter Network Intrusion Rule Engine
**Organisation cible** : National Critical Infrastructure SOC  
**Système d'exploitation** : Linux | **Catégorie** : Blue Team & SOC  
**Difficulté** : INSANE | **Vecteur de vulnérabilité** : CWE-200  
**Classification** : DOCUMENT OFFICIEL DU LABORATOIRE CYBERLAB REDTEAM  

---

## 1. Contexte Opérationnel & Règles d'Engagement
La sonde de détection d'intrusion réseau Suricata du centre de supervision doit être configurée pour bloquer un nouveau protocole de C2 utilisant le port TLS 443 avec un certificat auto-signé spécifique et des balises régulières toutes les 60 secondes (Jitter de 5%). Développe l'ensemble de règles Suricata multicritères et teste-les en conditions réelles.

L'évaluation a été menée dans un environnement strictement isolé. Aucun service de production réel n'a été impacté. L'objectif était d'auditer la sécurité du composant **blue-team** et d'extraire les drapeaux de contrôle prouvant la faisabilité de l'attaque.

---

## 2. Phase 1 : Reconnaissance & Cartographie de la Surface d'Attaque
Une phase de reconnaissance passive et active permet d'identifier l'empreinte logicielle et les services en écoute :

```bash
# 1. Énumération des ports et bannières de service
nmap -sV -sC -p- 10.10.44.13 -oN nmap_initial_scan.txt

# 2. Découverte applicative locale
curl -i http://localhost:3333/targets/training/blue-06-suricata-detection-rule/
```

L'analyse des réponses HTTP et des bannières confirme la présence du composant vulnérable lié à **blue-team, suricata, ids-ips, pcaps, c2-detection**.

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
curl -s -X POST http://localhost:3333/targets/training/blue-06-suricata-detection-rule/ \
  -H "Content-Type: application/json" \
  -d '{"exploit_vector": "blue-team"}'
```

---

## 4. Phase 3 : Capture des Drapeaux & Validation des Tâches
Les drapeaux officiels validant la compromission des différentes étapes de la mission :

- **Empreinte JA3 du client C2 malveillant** : `e7d705a3286e19ea42f587b344ee6865` (100 pts)
- **Règle d'alerte sur l'émetteur TLS (User Flag)** : `CYBERLAB{user_suricata_ja3_fingerprint_rule_alerted}` (150 pts)
- **Blocage dynamique en mode IPS & Root Flag** : `CYBERLAB{SURICATA_PERIMETER_IPS_BLOCK_C2_ACTIVE_2026}` (200 pts)

---

## 5. Recommandations de Remédiation (Mesures Défensives Blue Team)
1. **Application du principe de moindre privilège** (Least Privilege Principle) sur tous les comptes et processus.
2. **Validation stricte par liste blanche** des données en entrée (Input Sanitization) et requêtes préparées pour toutes les interactions en base.
3. **Mise à jour des composants logiciels** vers les versions patchées éliminant CWE-200.
4. **Cloisonnement réseau et conteneurs** : Interdiction du mode privileged, montage en lecture seule des volumes système.

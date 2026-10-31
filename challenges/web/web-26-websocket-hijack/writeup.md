# Rapport d'Exploitation & Débriefing Technique // Cross-Site WebSocket Hijacking (CSWSH)
**Organisation cible** : TradingView Real-Time Stream Engine  
**Système d'exploitation** : Linux | **Catégorie** : Web & APIs  
**Difficulté** : HARD | **Vecteur de vulnérabilité** : CWE-346  
**Classification** : DOCUMENT OFFICIEL DU LABORATOIRE CYBERLAB REDTEAM  

---

## 1. Contexte Opérationnel & Règles d'Engagement
Le terminal financier en temps réel de TradingView établit une connexion WebSocket persistante (wss://) pour streamer les transactions confidentielles des clients. Le handshake HTTP initial n'effectue aucune validation de l'en-tête Origin. Monte une page web malveillante qui ouvre une connexion WebSocket cross-origin au nom de la victime connectée pour intercepter le flux de transactions en direct.

L'évaluation a été menée dans un environnement strictement isolé. Aucun service de production réel n'a été impacté. L'objectif était d'auditer la sécurité du composant **cswsh** et d'extraire les drapeaux de contrôle prouvant la faisabilité de l'attaque.

---

## 2. Phase 1 : Reconnaissance & Cartographie de la Surface d'Attaque
Une phase de reconnaissance passive et active permet d'identifier l'empreinte logicielle et les services en écoute :

```bash
# 1. Énumération des ports et bannières de service
nmap -sV -sC -p- 10.10.12.164 -oN nmap_initial_scan.txt

# 2. Découverte applicative locale
curl -i http://localhost:3333/targets/training/web-26-websocket-hijack/
```

L'analyse des réponses HTTP et des bannières confirme la présence du composant vulnérable lié à **cswsh, websocket, origin-bypass, real-time, trading**.

---

## 3. Phase 2 : Exploitation Technique Pas-à-Pas

### A. Analyse de la Vulnérabilité
La faille provient d'une insuffisance de validation des contrôles d'accès et des données d'entrée au niveau de **CWE-346**. Le système interprète les paramètres non assainis sans barrière d'isolation.

### B. Élaboration du Vecteur d'Attaque
En appliquant la méthodologie offensive standard :
1. **Étape 1** : Injection du marqueur de diagnostic pour vérifier l'absence d'échappement.
2. **Étape 2** : Construction du payload weaponisé adapté à l'architecture cible.
3. **Étape 3** : Déclenchement de l'exécution et capture des privilèges.

```bash
# Exemple de commande d'exploitation standard
curl -s -X POST http://localhost:3333/targets/training/web-26-websocket-hijack/ \
  -H "Content-Type: application/json" \
  -d '{"exploit_vector": "cswsh"}'
```

---

## 4. Phase 3 : Capture des Drapeaux & Validation des Tâches
Les drapeaux officiels validant la compromission des différentes étapes de la mission :

- **Analyse du Handshake WebSocket** : `Origin` (80 pts)
- **Établissement du tunnel cross-origin** : `WS_HANDSHAKE_ACCEPTED` (120 pts)
- **Interception du flux boursier & Flag** : `CYBERLAB{CSWSH_MISSING_ORIGIN_CHECK_STREAM_INTERCEPT}` (150 pts)

---

## 5. Recommandations de Remédiation (Mesures Défensives Blue Team)
1. **Application du principe de moindre privilège** (Least Privilege Principle) sur tous les comptes et processus.
2. **Validation stricte par liste blanche** des données en entrée (Input Sanitization) et requêtes préparées pour toutes les interactions en base.
3. **Mise à jour des composants logiciels** vers les versions patchées éliminant CWE-346.
4. **Cloisonnement réseau et conteneurs** : Interdiction du mode privileged, montage en lecture seule des volumes système.

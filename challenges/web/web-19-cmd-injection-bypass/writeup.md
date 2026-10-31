# Rapport d'Exploitation & Débriefing Technique // WAF Filter Evasion Diagnostic Shell
**Organisation cible** : AeroNet Network Diagnostics  
**Système d'exploitation** : Linux | **Catégorie** : Web & APIs  
**Difficulté** : HARD | **Vecteur de vulnérabilité** : CWE-78  
**Classification** : DOCUMENT OFFICIEL DU LABORATOIRE CYBERLAB REDTEAM  

---

## 1. Contexte Opérationnel & Règles d'Engagement
L'interface de diagnostic réseau AeroNet exécute un outil ping système. Un Web Application Firewall (WAF) agressif bloque les espaces, les points-virgules, les esperluettes (&&), ainsi que les mots-clés courants comme cat, /etc/passwd, sh et bash. Utilise des techniques avancées d'évasion (variables d'environnement ${IFS}, caractères jokers /???/???, concaténation d'octets) pour forcer l'exécution de code.

L'évaluation a été menée dans un environnement strictement isolé. Aucun service de production réel n'a été impacté. L'objectif était d'auditer la sécurité du composant **command-injection** et d'extraire les drapeaux de contrôle prouvant la faisabilité de l'attaque.

---

## 2. Phase 1 : Reconnaissance & Cartographie de la Surface d'Attaque
Une phase de reconnaissance passive et active permet d'identifier l'empreinte logicielle et les services en écoute :

```bash
# 1. Énumération des ports et bannières de service
nmap -sV -sC -p- 10.10.27.149 -oN nmap_initial_scan.txt

# 2. Découverte applicative locale
curl -i http://localhost:3333/targets/training/web-19-cmd-injection-bypass/
```

L'analyse des réponses HTTP et des bannières confirme la présence du composant vulnérable lié à **command-injection, waf-evasion, bash-bypass, wildcards, ifs**.

---

## 3. Phase 2 : Exploitation Technique Pas-à-Pas

### A. Analyse de la Vulnérabilité
La faille provient d'une insuffisance de validation des contrôles d'accès et des données d'entrée au niveau de **CWE-78**. Le système interprète les paramètres non assainis sans barrière d'isolation.

### B. Élaboration du Vecteur d'Attaque
En appliquant la méthodologie offensive standard :
1. **Étape 1** : Injection du marqueur de diagnostic pour vérifier l'absence d'échappement.
2. **Étape 2** : Construction du payload weaponisé adapté à l'architecture cible.
3. **Étape 3** : Déclenchement de l'exécution et capture des privilèges.

```bash
# Exemple de commande d'exploitation standard
curl -s -X POST http://localhost:3333/targets/training/web-19-cmd-injection-bypass/ \
  -H "Content-Type: application/json" \
  -d '{"exploit_vector": "command-injection"}'
```

---

## 4. Phase 3 : Capture des Drapeaux & Validation des Tâches
Les drapeaux officiels validant la compromission des différentes étapes de la mission :

- **Substitution d'espace par variable système** : `${IFS}` (60 pts)
- **Contournement des noms de fichiers par jokers** : `/???/??t` (80 pts)
- **Lecture du fichier secret & Flag** : `CYBERLAB{COMMAND_INJECTION_HEX_WILDCARD_WAF_EVASION}` (160 pts)

---

## 5. Recommandations de Remédiation (Mesures Défensives Blue Team)
1. **Application du principe de moindre privilège** (Least Privilege Principle) sur tous les comptes et processus.
2. **Validation stricte par liste blanche** des données en entrée (Input Sanitization) et requêtes préparées pour toutes les interactions en base.
3. **Mise à jour des composants logiciels** vers les versions patchées éliminant CWE-78.
4. **Cloisonnement réseau et conteneurs** : Interdiction du mode privileged, montage en lecture seule des volumes système.

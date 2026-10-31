# Rapport d'Exploitation & Débriefing Technique // Arbitrary Memory Write via Format String (%n)
**Organisation cible** : Industrial Telemetry Daemon  
**Système d'exploitation** : Linux | **Catégorie** : Pwn & Exploitation Mémoire  
**Difficulté** : HARD | **Vecteur de vulnérabilité** : CWE-134  
**Classification** : DOCUMENT OFFICIEL DU LABORATOIRE CYBERLAB REDTEAM  

---

## 1. Contexte Opérationnel & Règles d'Engagement
Un service de journalisation industriel transmet une entrée utilisateur directement en premier argument de printf(user_input) au lieu de printf('%s', user_input). Utilise les spécificateurs de format %x et %s pour lire arbitrairement la mémoire de la pile, puis utilise le spécificateur d'écriture %n pour réécrire une entrée de la Global Offset Table (GOT) et rediriger un appel de fonction vers un shell.

L'évaluation a été menée dans un environnement strictement isolé. Aucun service de production réel n'a été impacté. L'objectif était d'auditer la sécurité du composant **pwn** et d'extraire les drapeaux de contrôle prouvant la faisabilité de l'attaque.

---

## 2. Phase 1 : Reconnaissance & Cartographie de la Surface d'Attaque
Une phase de reconnaissance passive et active permet d'identifier l'empreinte logicielle et les services en écoute :

```bash
# 1. Énumération des ports et bannières de service
nmap -sV -sC -p- 10.10.10.84 -oN nmap_initial_scan.txt

# 2. Découverte applicative locale
curl -i http://localhost:3333/targets/training/pwn-03-format-string/
```

L'analyse des réponses HTTP et des bannières confirme la présence du composant vulnérable lié à **pwn, format-string, printf, got-overwrite, memory-write**.

---

## 3. Phase 2 : Exploitation Technique Pas-à-Pas

### A. Analyse de la Vulnérabilité
La faille provient d'une insuffisance de validation des contrôles d'accès et des données d'entrée au niveau de **CWE-134**. Le système interprète les paramètres non assainis sans barrière d'isolation.

### B. Élaboration du Vecteur d'Attaque
En appliquant la méthodologie offensive standard :
1. **Étape 1** : Injection du marqueur de diagnostic pour vérifier l'absence d'échappement.
2. **Étape 2** : Construction du payload weaponisé adapté à l'architecture cible.
3. **Étape 3** : Déclenchement de l'exécution et capture des privilèges.

```bash
# Exemple de commande d'exploitation standard
curl -s -X POST http://localhost:3333/targets/training/pwn-03-format-string/ \
  -H "Content-Type: application/json" \
  -d '{"exploit_vector": "pwn"}'
```

---

## 4. Phase 3 : Capture des Drapeaux & Validation des Tâches
Les drapeaux officiels validant la compromission des différentes étapes de la mission :

- **Lecture de la mémoire avec %p** : `%p` (60 pts)
- **Écriture arbitraire en mémoire avec %n** : `%n` (80 pts)
- **Écrasement de la table GOT & Flag** : `CYBERLAB{FORMAT_STRING_PERCENT_N_GOT_OVERWRITE_ROOT}` (160 pts)

---

## 5. Recommandations de Remédiation (Mesures Défensives Blue Team)
1. **Application du principe de moindre privilège** (Least Privilege Principle) sur tous les comptes et processus.
2. **Validation stricte par liste blanche** des données en entrée (Input Sanitization) et requêtes préparées pour toutes les interactions en base.
3. **Mise à jour des composants logiciels** vers les versions patchées éliminant CWE-134.
4. **Cloisonnement réseau et conteneurs** : Interdiction du mode privileged, montage en lecture seule des volumes système.

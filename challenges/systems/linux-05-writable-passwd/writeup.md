# Rapport d'Exploitation & Débriefing Technique // The World Writable /etc/passwd Hash Injection
**Organisation cible** : Legacy Linux Gateway Server  
**Système d'exploitation** : Linux | **Catégorie** : Systèmes & Active Directory  
**Difficulté** : EASY | **Vecteur de vulnérabilité** : CWE-276  
**Classification** : DOCUMENT OFFICIEL DU LABORATOIRE CYBERLAB REDTEAM  

---

## 1. Contexte Opérationnel & Règles d'Engagement
Des permissions trop permissives (0666) ont été attribuées au fichier /etc/passwd. N'importe quel utilisateur peut ajouter ou modifier les lignes du fichier. Génère un hachage de mot de passe avec openssl passwd -1 et injecte une nouvelle entrée root avec un UID de 0 pour obtenir les privilèges totaux.

L'évaluation a été menée dans un environnement strictement isolé. Aucun service de production réel n'a été impacté. L'objectif était d'auditer la sécurité du composant **linux** et d'extraire les drapeaux de contrôle prouvant la faisabilité de l'attaque.

---

## 2. Phase 1 : Reconnaissance & Cartographie de la Surface d'Attaque
Une phase de reconnaissance passive et active permet d'identifier l'empreinte logicielle et les services en écoute :

```bash
# 1. Énumération des ports et bannières de service
nmap -sV -sC -p- 10.10.23.38 -oN nmap_initial_scan.txt

# 2. Découverte applicative locale
curl -i http://localhost:3333/targets/training/linux-05-writable-passwd/
```

L'analyse des réponses HTTP et des bannières confirme la présence du composant vulnérable lié à **linux, passwd-writable, privesc, openssl, root**.

---

## 3. Phase 2 : Exploitation Technique Pas-à-Pas

### A. Analyse de la Vulnérabilité
La faille provient d'une insuffisance de validation des contrôles d'accès et des données d'entrée au niveau de **CWE-276**. Le système interprète les paramètres non assainis sans barrière d'isolation.

### B. Élaboration du Vecteur d'Attaque
En appliquant la méthodologie offensive standard :
1. **Étape 1** : Injection du marqueur de diagnostic pour vérifier l'absence d'échappement.
2. **Étape 2** : Construction du payload weaponisé adapté à l'architecture cible.
3. **Étape 3** : Déclenchement de l'exécution et capture des privilèges.

```bash
# Exemple de commande d'exploitation standard
curl -s -X POST http://localhost:3333/targets/training/linux-05-writable-passwd/ \
  -H "Content-Type: application/json" \
  -d '{"exploit_vector": "linux"}'
```

---

## 4. Phase 3 : Capture des Drapeaux & Validation des Tâches
Les drapeaux officiels validant la compromission des différentes étapes de la mission :

- **Vérification des droits d'écriture** : `-rw-rw-rw-` (40 pts)
- **Génération du hash avec openssl** : `openssl passwd -1` (50 pts)
- **Ajout de l'utilisateur root & Flag** : `CYBERLAB{ETC_PASSWD_ROOT_HASH_OVERWRITTEN_SUCCESS}` (60 pts)

---

## 5. Recommandations de Remédiation (Mesures Défensives Blue Team)
1. **Application du principe de moindre privilège** (Least Privilege Principle) sur tous les comptes et processus.
2. **Validation stricte par liste blanche** des données en entrée (Input Sanitization) et requêtes préparées pour toutes les interactions en base.
3. **Mise à jour des composants logiciels** vers les versions patchées éliminant CWE-276.
4. **Cloisonnement réseau et conteneurs** : Interdiction du mode privileged, montage en lecture seule des volumes système.

# Rapport d'Exploitation & Débriefing Technique // Full Kill Chain Enterprise Alpha
**Organisation cible** : Aegis Industrial Systems DMZ  
**Système d'exploitation** : Linux | **Catégorie** : Systèmes & Active Directory  
**Difficulté** : INSANE | **Vecteur de vulnérabilité** : MULTI-CVE  
**Classification** : DOCUMENT OFFICIEL DU LABORATOIRE CYBERLAB REDTEAM  

---

## 1. Contexte Opérationnel & Règles d'Engagement
Scénario complet d'intrusion d'entreprise (Boot2Root) : Une passerelle web exposée en DMZ présente une mauvaise configuration d'authentification et un endpoint d'exécution de scripts. Établis un premier accès non privilégié (User Shell), pivote sur le sous-réseau interne, analyse les tâches d'arrière-plan avec LinPEAS et exploite une mauvaise configuration de droits pour compromettre la machine hôte et voler la clé de chiffrement racine.

L'évaluation a été menée dans un environnement strictement isolé. Aucun service de production réel n'a été impacté. L'objectif était d'auditer la sécurité du composant **boot2root** et d'extraire les drapeaux de contrôle prouvant la faisabilité de l'attaque.

---

## 2. Phase 1 : Reconnaissance & Cartographie de la Surface d'Attaque
Une phase de reconnaissance passive et active permet d'identifier l'empreinte logicielle et les services en écoute :

```bash
# 1. Énumération des ports et bannières de service
nmap -sV -sC -p- 10.10.10.84 -oN nmap_initial_scan.txt

# 2. Découverte applicative locale
curl -i http://localhost:3333/targets/training/b2r-01-enterprise-alpha/
```

L'analyse des réponses HTTP et des bannières confirme la présence du composant vulnérable lié à **boot2root, full-killchain, dmz-pivot, linpeas, privesc**.

---

## 3. Phase 2 : Exploitation Technique Pas-à-Pas

### A. Analyse de la Vulnérabilité
La faille provient d'une insuffisance de validation des contrôles d'accès et des données d'entrée au niveau de **MULTI-CVE**. Le système interprète les paramètres non assainis sans barrière d'isolation.

### B. Élaboration du Vecteur d'Attaque
En appliquant la méthodologie offensive standard :
1. **Étape 1** : Injection du marqueur de diagnostic pour vérifier l'absence d'échappement.
2. **Étape 2** : Construction du payload weaponisé adapté à l'architecture cible.
3. **Étape 3** : Déclenchement de l'exécution et capture des privilèges.

```bash
# Exemple de commande d'exploitation standard
curl -s -X POST http://localhost:3333/targets/training/b2r-01-enterprise-alpha/ \
  -H "Content-Type: application/json" \
  -d '{"exploit_vector": "boot2root"}'
```

---

## 4. Phase 3 : Capture des Drapeaux & Validation des Tâches
Les drapeaux officiels validant la compromission des différentes étapes de la mission :

- **Phase 1 : Reconnaissance & Surface d'attaque exposée** : `RECON_DMZ_ALPHA_COMPLETE` (80 pts)
- **Phase 2 : Exploitation & Accès Initial (User Flag)** : `CYBERLAB{user_alpha_dmz_foothold_shell_granted}` (120 pts)
- **Phase 3 : Énumération locale interne** : `INTERNAL_PRIVILEGE_VECTOR_FOUND` (100 pts)
- **Phase 4 : Élévation de privilèges & Root Flag** : `CYBERLAB{BOOT2ROOT_ALPHA_DMZ_PIVOT_ROOT_COMPROMISE_FLAG}` (200 pts)

---

## 5. Recommandations de Remédiation (Mesures Défensives Blue Team)
1. **Application du principe de moindre privilège** (Least Privilege Principle) sur tous les comptes et processus.
2. **Validation stricte par liste blanche** des données en entrée (Input Sanitization) et requêtes préparées pour toutes les interactions en base.
3. **Mise à jour des composants logiciels** vers les versions patchées éliminant MULTI-CVE.
4. **Cloisonnement réseau et conteneurs** : Interdiction du mode privileged, montage en lecture seule des volumes système.

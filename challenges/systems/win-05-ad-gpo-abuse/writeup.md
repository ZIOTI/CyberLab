# Rapport d'Exploitation & Débriefing Technique // Active Directory Group Policy Object (GPO) Abuse
**Organisation cible** : NorthCorp Active Directory Domain  
**Système d'exploitation** : Windows | **Catégorie** : Systèmes & Active Directory  
**Difficulté** : INSANE | **Vecteur de vulnérabilité** : CWE-272  
**Classification** : DOCUMENT OFFICIEL DU LABORATOIRE CYBERLAB REDTEAM  

---

## 1. Contexte Opérationnel & Règles d'Engagement
L'analyse BloodHound révèle que ton compte utilisateur compromis possède le droit de modification WriteDacl ou GenericAll sur l'objet de stratégie de groupe (GPO) 'Workstation Hardening Policy'. Utilise l'outil SharpGPOAbuse pour modifier cette GPO en lui ajoutant une tâche planifiée immédiate qui ajoute ton utilisateur au groupe privilégié 'Domain Admins'.

L'évaluation a été menée dans un environnement strictement isolé. Aucun service de production réel n'a été impacté. L'objectif était d'auditer la sécurité du composant **active-directory** et d'extraire les drapeaux de contrôle prouvant la faisabilité de l'attaque.

---

## 2. Phase 1 : Reconnaissance & Cartographie de la Surface d'Attaque
Une phase de reconnaissance passive et active permet d'identifier l'empreinte logicielle et les services en écoute :

```bash
# 1. Énumération des ports et bannières de service
nmap -sV -sC -p- 10.10.53.102 -oN nmap_initial_scan.txt

# 2. Découverte applicative locale
curl -i http://localhost:3333/targets/training/win-05-ad-gpo-abuse/
```

L'analyse des réponses HTTP et des bannières confirme la présence du composant vulnérable lié à **active-directory, gpo, group-policy, sharp-gpoabuse, domain-admin**.

---

## 3. Phase 2 : Exploitation Technique Pas-à-Pas

### A. Analyse de la Vulnérabilité
La faille provient d'une insuffisance de validation des contrôles d'accès et des données d'entrée au niveau de **CWE-272**. Le système interprète les paramètres non assainis sans barrière d'isolation.

### B. Élaboration du Vecteur d'Attaque
En appliquant la méthodologie offensive standard :
1. **Étape 1** : Injection du marqueur de diagnostic pour vérifier l'absence d'échappement.
2. **Étape 2** : Construction du payload weaponisé adapté à l'architecture cible.
3. **Étape 3** : Déclenchement de l'exécution et capture des privilèges.

```bash
# Exemple de commande d'exploitation standard
curl -s -X POST http://localhost:3333/targets/training/win-05-ad-gpo-abuse/ \
  -H "Content-Type: application/json" \
  -d '{"exploit_vector": "active-directory"}'
```

---

## 4. Phase 3 : Capture des Drapeaux & Validation des Tâches
Les drapeaux officiels validant la compromission des différentes étapes de la mission :

- **Recherche des droits de contrôle GPO avec BloodHound** : `GenericWrite` (100 pts)
- **Injection d'une tâche planifiée dans la GPO (User Flag)** : `CYBERLAB{user_gpo_scheduled_task_injected_successfully}` (150 pts)
- **Propagation de la GPO (gpupdate) & Root Flag** : `CYBERLAB{GPO_SCHEDULED_TASK_OVERWRITE_ENTERPRISE_ADMIN}` (200 pts)

---

## 5. Recommandations de Remédiation (Mesures Défensives Blue Team)
1. **Application du principe de moindre privilège** (Least Privilege Principle) sur tous les comptes et processus.
2. **Validation stricte par liste blanche** des données en entrée (Input Sanitization) et requêtes préparées pour toutes les interactions en base.
3. **Mise à jour des composants logiciels** vers les versions patchées éliminant CWE-272.
4. **Cloisonnement réseau et conteneurs** : Interdiction du mode privileged, montage en lecture seule des volumes système.

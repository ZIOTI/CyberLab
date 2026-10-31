# Rapport d'Exploitation & Débriefing Technique // Kubernetes Cluster Role Escalation
**Organisation cible** : FinTech Kubernetes Platform  
**Système d'exploitation** : Cloud | **Catégorie** : Cloud & Conteneurs  
**Difficulté** : INSANE | **Vecteur de vulnérabilité** : CWE-284  
**Classification** : DOCUMENT OFFICIEL DU LABORATOIRE CYBERLAB REDTEAM  

---

## 1. Contexte Opérationnel & Règles d'Engagement
Après avoir obtenu un shell dans un pod Kubernetes, découvre le jeton du compte de service injecté dans /var/run/secrets/kubernetes.io/serviceaccount/token. Ce compte de service dispose de permissions RBAC excessives permettant d'énumérer les Secrets de tous les namespaces ou de créer de nouveaux pods privilégiés. Utilise kubectl pour devenir Cluster-Admin.

L'évaluation a été menée dans un environnement strictement isolé. Aucun service de production réel n'a été impacté. L'objectif était d'auditer la sécurité du composant **k8s** et d'extraire les drapeaux de contrôle prouvant la faisabilité de l'attaque.

---

## 2. Phase 1 : Reconnaissance & Cartographie de la Surface d'Attaque
Une phase de reconnaissance passive et active permet d'identifier l'empreinte logicielle et les services en écoute :

```bash
# 1. Énumération des ports et bannières de service
nmap -sV -sC -p- 10.10.13.94 -oN nmap_initial_scan.txt

# 2. Découverte applicative locale
curl -i http://localhost:3333/targets/training/cloud-04-k8s-service-account/
```

L'analyse des réponses HTTP et des bannières confirme la présence du composant vulnérable lié à **k8s, kubernetes, rbac, service-account, cloud-privesc**.

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
curl -s -X POST http://localhost:3333/targets/training/cloud-04-k8s-service-account/ \
  -H "Content-Type: application/json" \
  -d '{"exploit_vector": "k8s"}'
```

---

## 4. Phase 3 : Capture des Drapeaux & Validation des Tâches
Les drapeaux officiels validant la compromission des différentes étapes de la mission :

- **Extraction du JWT du ServiceAccount** : `/var/run/secrets/kubernetes.io/serviceaccount` (90 pts)
- **Énumération des droits RBAC (User Flag)** : `CYBERLAB{user_k8s_serviceaccount_token_privileges_audited}` (160 pts)
- **Extraction des Secrets du namespace kube-system & Root Flag** : `CYBERLAB{K8S_SERVICEACCOUNT_RBAC_CLUSTER_ADMIN_TAKEOVER}` (200 pts)

---

## 5. Recommandations de Remédiation (Mesures Défensives Blue Team)
1. **Application du principe de moindre privilège** (Least Privilege Principle) sur tous les comptes et processus.
2. **Validation stricte par liste blanche** des données en entrée (Input Sanitization) et requêtes préparées pour toutes les interactions en base.
3. **Mise à jour des composants logiciels** vers les versions patchées éliminant CWE-284.
4. **Cloisonnement réseau et conteneurs** : Interdiction du mode privileged, montage en lecture seule des volumes système.

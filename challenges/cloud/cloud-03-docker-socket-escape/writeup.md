# Rapport d'Exploitation & Débriefing Technique // Docker Socket Mount Host Escape
**Organisation cible** : Containerized Microservices Cluster  
**Système d'exploitation** : Docker | **Catégorie** : Cloud & Conteneurs  
**Difficulté** : HARD | **Vecteur de vulnérabilité** : CWE-250  
**Classification** : DOCUMENT OFFICIEL DU LABORATOIRE CYBERLAB REDTEAM  

---

## 1. Contexte Opérationnel & Règles d'Engagement
Dans un conteneur applicatif, l'administrateur a monté le socket Docker de l'hôte (/var/run/docker.sock) pour permettre au conteneur de gérer d'autres images. Utilise le binaire docker ou des requêtes HTTP directes sur le socket UNIX pour instancier un nouveau conteneur montant le système de fichiers racine de l'hôte (/mnt/host) et échapper complètement au bac à sable.

L'évaluation a été menée dans un environnement strictement isolé. Aucun service de production réel n'a été impacté. L'objectif était d'auditer la sécurité du composant **docker** et d'extraire les drapeaux de contrôle prouvant la faisabilité de l'attaque.

---

## 2. Phase 1 : Reconnaissance & Cartographie de la Surface d'Attaque
Une phase de reconnaissance passive et active permet d'identifier l'empreinte logicielle et les services en écoute :

```bash
# 1. Énumération des ports et bannières de service
nmap -sV -sC -p- 10.10.11.157 -oN nmap_initial_scan.txt

# 2. Découverte applicative locale
curl -i http://localhost:3333/targets/training/cloud-03-docker-socket-escape/
```

L'analyse des réponses HTTP et des bannières confirme la présence du composant vulnérable lié à **docker, container-escape, docker-sock, chroot, privesc**.

---

## 3. Phase 2 : Exploitation Technique Pas-à-Pas

### A. Analyse de la Vulnérabilité
La faille provient d'une insuffisance de validation des contrôles d'accès et des données d'entrée au niveau de **CWE-250**. Le système interprète les paramètres non assainis sans barrière d'isolation.

### B. Élaboration du Vecteur d'Attaque
En appliquant la méthodologie offensive standard :
1. **Étape 1** : Injection du marqueur de diagnostic pour vérifier l'absence d'échappement.
2. **Étape 2** : Construction du payload weaponisé adapté à l'architecture cible.
3. **Étape 3** : Déclenchement de l'exécution et capture des privilèges.

```bash
# Exemple de commande d'exploitation standard
curl -s -X POST http://localhost:3333/targets/training/cloud-03-docker-socket-escape/ \
  -H "Content-Type: application/json" \
  -d '{"exploit_vector": "docker"}'
```

---

## 4. Phase 3 : Capture des Drapeaux & Validation des Tâches
Les drapeaux officiels validant la compromission des différentes étapes de la mission :

- **Détection du socket Docker monté** : `docker.sock` (60 pts)
- **Instanciation d'un conteneur avec volume racine (User Flag)** : `CYBERLAB{user_docker_socket_mounted_volume_accessed}` (100 pts)
- **Chroot sur l'hôte & Root Flag** : `CYBERLAB{DOCKER_SOCK_MOUNTED_CHROOT_HOST_BREAKOUT}` (140 pts)

---

## 5. Recommandations de Remédiation (Mesures Défensives Blue Team)
1. **Application du principe de moindre privilège** (Least Privilege Principle) sur tous les comptes et processus.
2. **Validation stricte par liste blanche** des données en entrée (Input Sanitization) et requêtes préparées pour toutes les interactions en base.
3. **Mise à jour des composants logiciels** vers les versions patchées éliminant CWE-250.
4. **Cloisonnement réseau et conteneurs** : Interdiction du mode privileged, montage en lecture seule des volumes système.

# Rapport d'Exploitation & Débriefing Technique // Spring4Shell ClassLoader Binding RCE
**Organisation cible** : CoreSpring Enterprise Microservice  
**Système d'exploitation** : Linux | **Catégorie** : Web & APIs  
**Difficulté** : INSANE | **Vecteur de vulnérabilité** : CVE-2022-22965  
**Classification** : DOCUMENT OFFICIEL DU LABORATOIRE CYBERLAB REDTEAM  

---

## 1. Contexte Opérationnel & Règles d'Engagement
Une application critique de gestion des stocks tourne sur Spring Framework (versions < 5.3.18) déployée dans Apache Tomcat sous JDK 9+. En manipulant le DataBinder de Spring via des paramètres HTTP POST spécifiques (class.module.classLoader...), reconfigure le filtre de journalisation AccessLogValve de Tomcat pour déposer automatiquement un webshell JSP persistant dans le répertoire racine web.

L'évaluation a été menée dans un environnement strictement isolé. Aucun service de production réel n'a été impacté. L'objectif était d'auditer la sécurité du composant **spring4shell** et d'extraire les drapeaux de contrôle prouvant la faisabilité de l'attaque.

---

## 2. Phase 1 : Reconnaissance & Cartographie de la Surface d'Attaque
Une phase de reconnaissance passive et active permet d'identifier l'empreinte logicielle et les services en écoute :

```bash
# 1. Énumération des ports et bannières de service
nmap -sV -sC -p- 10.10.47.174 -oN nmap_initial_scan.txt

# 2. Découverte applicative locale
curl -i http://localhost:3333/targets/training/web-25-java-spring4shell/
```

L'analyse des réponses HTTP et des bannières confirme la présence du composant vulnérable lié à **spring4shell, cve-2022-22965, java, classloader, tomcat-valve**.

---

## 3. Phase 2 : Exploitation Technique Pas-à-Pas

### A. Analyse de la Vulnérabilité
La faille provient d'une insuffisance de validation des contrôles d'accès et des données d'entrée au niveau de **CVE-2022-22965**. Le système interprète les paramètres non assainis sans barrière d'isolation.

### B. Élaboration du Vecteur d'Attaque
En appliquant la méthodologie offensive standard :
1. **Étape 1** : Injection du marqueur de diagnostic pour vérifier l'absence d'échappement.
2. **Étape 2** : Construction du payload weaponisé adapté à l'architecture cible.
3. **Étape 3** : Déclenchement de l'exécution et capture des privilèges.

```bash
# Exemple de commande d'exploitation standard
curl -s -X POST http://localhost:3333/targets/training/web-25-java-spring4shell/ \
  -H "Content-Type: application/json" \
  -d '{"exploit_vector": "spring4shell"}'
```

---

## 4. Phase 3 : Capture des Drapeaux & Validation des Tâches
Les drapeaux officiels validant la compromission des différentes étapes de la mission :

- **Détection de l'accès au ClassLoader (CVE-2022-22965)** : `SPRING4SHELL_VULNERABLE` (100 pts)
- **Écriture du webshell JSP (User Flag)** : `CYBERLAB{user_spring4shell_tomcat_valve_jsp_shell}` (150 pts)
- **Élévation locale & Root Flag** : `CYBERLAB{SPRING4SHELL_TOMCAT_PIPELINE_VALVE_LOG_RCE}` (250 pts)

---

## 5. Recommandations de Remédiation (Mesures Défensives Blue Team)
1. **Application du principe de moindre privilège** (Least Privilege Principle) sur tous les comptes et processus.
2. **Validation stricte par liste blanche** des données en entrée (Input Sanitization) et requêtes préparées pour toutes les interactions en base.
3. **Mise à jour des composants logiciels** vers les versions patchées éliminant CVE-2022-22965.
4. **Cloisonnement réseau et conteneurs** : Interdiction du mode privileged, montage en lecture seule des volumes système.

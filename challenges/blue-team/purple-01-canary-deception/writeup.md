# Solution Détaillée // Canary Tokens Deception Defense

## 1. Localisation du token
Le fichier de configuration contient un jeton spécifique `canary_aegis_sec_99`.

## 2. Déclenchement de l'alerte
L'utilisation de la clé déclenche immédiatement le webhook de supervision SOC :
`CTF{PURPLE_CANARY_TOKEN_TRIPWIRE_TRIGGERED}`.

## 3. Posture Purple Team
- Intégrer des faux fichiers de mots de passe, des entrées DNS dormantes et des tokens AWS factices pour détecter les mouvements latéraux précocement.
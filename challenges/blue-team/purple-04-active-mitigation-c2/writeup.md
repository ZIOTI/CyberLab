# Solution Détaillée // Automated C2 Beacon Hunting

## 1. Détection de balise
Les deltas de temps entre les connexions sortantes convergent vers 45 secondes (`45s`) avec un jitter faible.

## 2. Blocage dynamique SOAR
Le script d'orchestration isole l'hôte hostile en coupant les communications sortantes :
`CTF{PURPLE_C2_BEACON_HUNT_AUTOMATED_BLOCK}`.

## 3. Posture de protection
- Restreindre drastiquement le trafic sortant des serveurs internes aux seuls proxys mandatés.
- Utiliser la détection statistique de périodicité (outils Zeek / RITA).
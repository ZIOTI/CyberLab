# Walkthrough : Evil Twin & Rogue Access Point Triangulation

## 1. Analyse du fichier CSV
L'examen de `aircrack_survey.csv` révèle deux AP autorisés Cisco (`00:14:6C:7E:40:80` et `...81`) sur le canal 6 en WPA2.
Une troisième ligne présente le même SSID `Aegis-Corporate-Secure` avec le BSSID `DE:AD:BE:EF:13:37` sur le canal 11 avec Privacy `OPN` (Open) et un signal très fort (-32 dBm).

## 2. Détection & Flag
BSSID imposteur : `DE:AD:BE:EF:13:37`
Canal : `11`
Flag : `CYBERLAB{WIFI_ROGUE_AP_EVIL_TWIN_DETECTED_441}`
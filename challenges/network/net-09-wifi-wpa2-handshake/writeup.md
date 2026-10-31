# Walkthrough : Aegis Corp WPA2 4-Way Handshake Cracking

## 1. Contexte
L'authentification WPA2-PSK utilise un échange à 4 voies (4-way handshake) pour dériver des clés de chiffrement éphémères.

## 2. Analyse Wireshark
Ouvre `wpa2_corp_handshake.pcap` :
- Trame 1 (Beacon) : SSID = `Aegis-Corporate-Secure`, BSSID = `00:14:6C:7E:40:80`.
- Trames 2 à 5 : Échange EAPOL-Key entre l'AP et la Station `00:0F:B5:88:AC:19`.

## 3. Cassage par dictionnaire
Lance aircrack-ng :
```bash
aircrack-ng -w wordlist_wifi.txt -b 00:14:6C:7E:40:80 wpa2_corp_handshake.pcap
```
Mot de passe découvert : `AegisSecureWiFi#2026`.

Flag : `CYBERLAB{WIFI_WPA2_4WAY_HANDSHAKE_MIC_CRACKED_993}`

## 4. Remédiation Blue Team
Activer WPA3-SAE (Simultaneous Authentication of Equals) pour éliminer les attaques par dictionnaire hors-ligne.
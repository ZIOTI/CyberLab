# Writeup : Flight of the Hawk (osint-01-exif-trace)

## 1. Contexte & Vulnérabilité
Lorsqu'un appareil photo, un smartphone ou un drone prend un cliché, il insère automatiquement des métadonnées normalisées appelées **EXIF (Exchangeable Image File Format)**.
Ces métadonnées contiennent souvent :
* Le modèle de l'appareil et son numéro de série.
* L'horodatage précis à la seconde.
* Les coordonnées GPS (Latitude, Longitude, Altitude).
* Les logiciels d'édition utilisés.

Si ces métadonnées ne sont pas purgées (scrubbing) avant publication ou transmission, elles constituent une source majeure de fuite de renseignement (GEOINT / OSINT).

## 2. Exploitation Pas à Pas

### Étape 1 : Analyse du fichier avec exiftool ou strings
Télécharge l'artefact `recon_relay_alpha.jpg` et exécute :
```bash
exiftool recon_relay_alpha.jpg
```

**Sortie représentative :**
```text
Camera Model Name               : DJI-Mavic3-Enterprise
Date/Time Original              : 2026:10:24 14:22:08
GPS Latitude                    : 48 deg 51' 24.12" N
GPS Longitude                   : 2 deg 21' 7.02" E
User Comment                    : MISSION_STATUS=SUCCESS; OPERATOR_BEACON=CYBERLAB{EXIF_GPS_AERIAL_RECON_GEOLOCATED}
```

### Étape 2 : Validation des drapeaux
* Modèle du drone : `DJI-Mavic3-Enterprise`
* Date du cliché : `2026:10:24`
* Flag de mission : `CYBERLAB{EXIF_GPS_AERIAL_RECON_GEOLOCATED}`

## 3. Remédiation
Pour protéger la confidentialité opérationnelle :
* Utiliser un outil de nettoyage de métadonnées comme `exiftool -all= image.jpg` avant toute diffusion publique.
* Configurer les équipements d'acquisition pour désactiver la géolocalisation automatique (GPS tagging).

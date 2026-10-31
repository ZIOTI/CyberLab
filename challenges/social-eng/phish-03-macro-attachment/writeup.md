# Walkthrough : Malicious Macro & Double Extension Payload Analysis

## 1. Analyse statique
Le fichier `Facture_Impayee_Fevrier2026.docm.vbs` exploite une double extension (.docm pour simuler Word, .vbs pour l'exécution réelle).

## 2. Extraction du vecteur d'exécution
Le script instancie `WScript.Shell` et invoque `powershell.exe` avec le paramètre `-Enc`.

## 3. Flag & Détection
Le scan via `/api/modules/phishing/attachment-scan` confirme le statut `MALICIOUS_DROPPER_DETECTED` et fournit le flag `CYBERLAB{PHISHING_MALICIOUS_MACRO_ATTACHMENT_NEUTRALIZED_552}`.
@echo off
title CyberRange PRO - Mise a Jour du Laboratoire
chcp 65001 >nul
cls

echo =====================================================================
echo    🚀 CYBERRANGE PRO - ASSISTANT DE MISE À JOUR OFFENSIVE
echo =====================================================================
echo.
echo [*] Recherche de la derniere version sur GitHub...
echo [*] Verification de la preservation de cyberrange.db...
echo.

node updater.js apply

if %ERRORLEVEL% equ 0 (
    echo.
    echo =====================================================================
    echo    [✔] Mise a jour terminee avec succes !
    echo    [*] Tous tes niveaux, XP et stats SQLite ont ete conserves.
    echo =====================================================================
) else (
    echo.
    echo [!] La mise a jour n'a pas pu etre appliquee automatiquement.
    echo [*] Verifie ta connexion Internet ou telecharge le ZIP manuellement.
)

echo.
pause

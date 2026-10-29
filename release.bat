@echo off
title CyberRange PRO - Publier une Release
chcp 65001 >nul
cls

echo =====================================================================
echo    🚀 CYBERRANGE PRO - ASSISTANT DE PUBLICATION GITHUB RELEASE
echo =====================================================================
echo.

set VERSION_ARG=%1
set MESSAGE_ARG=%2

if "%VERSION_ARG%"=="" (
    set /p VERSION_ARG="Entrez le nouveau numero de version (ex: 1.0.1) : "
)

if "%VERSION_ARG%"=="" (
    echo [!] Version invalide. Annulation.
    pause
    exit /b 1
)

:: Nettoyer le 'v' initial si l'utilisateur l'a tape
set CLEAN_VER=%VERSION_ARG:v=%
set TAG_NAME=v%CLEAN_VER%

if "%MESSAGE_ARG%"=="" (
    set /p MESSAGE_ARG="Entrez les notes de version (ex: Nouveaux defis et correctifs) : "
)

if "%MESSAGE_ARG%"=="" (
    set MESSAGE_ARG=Mise a jour CyberRange PRO %TAG_NAME%
)

echo.
echo [*] 1/4 - Execution de la suite de tests de validation...
node test_suite.js
if %ERRORLEVEL% neq 0 (
    echo.
    echo [!] ERREUR: Les tests ne passent pas. Publication interrompue.
    pause
    exit /b 1
)

echo.
echo [*] 2/4 - Mise a jour de package.json vers la version %CLEAN_VER%...
node -e "const fs = require('fs'); const p = JSON.parse(fs.readFileSync('package.json', 'utf8')); p.version = '%CLEAN_VER%'; fs.writeFileSync('package.json', JSON.stringify(p, null, 2));"

echo.
echo [*] 3/4 - Commit des changements et creation du Tag %TAG_NAME%...
git add .
git commit -m "chore(release): %TAG_NAME% - %MESSAGE_ARG%"
git tag -a "%TAG_NAME%" -m "%MESSAGE_ARG%"

echo.
echo [*] 4/4 - Envoi vers GitHub (Push commits et tags)...
git push origin main
git push origin %TAG_NAME%

echo.
echo =====================================================================
echo    [✔] FELICITATIONS !
echo    Le tag %TAG_NAME% a ete pousse sur GitHub.
echo    GitHub Actions est en train de fabriquer l'archive et la Release !
echo    Tes potes recevront automatiquement la notification de mise a jour.
echo =====================================================================
echo.
pause

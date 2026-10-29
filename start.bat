@echo off
title CyberRange PRO - Academie Offensive de Cybersecurite
chcp 65001 >nul
cls

echo =====================================================================
echo    🛡️  CYBERRANGE PRO - ACADÉMIE OFFENSIVE DE ZÉRO À PRO
echo =====================================================================
echo.
echo [*] Verification du moteur d'execution...

set NODE_EXEC=

:: 1. Verifier si node est dans le PATH standard
where node >nul 2>nul
if %ERRORLEVEL% equ 0 (
    set "NODE_EXEC=node"
    goto START_SERVER
)

:: 2. Verifier si agy-node.cmd d'Antigravity existe
if exist "%APPDATA%\Antigravity\bin\agy-node.cmd" (
    set "NODE_EXEC=%APPDATA%\Antigravity\bin\agy-node.cmd"
    goto START_SERVER
)

:: 3. Verifier l'executable Antigravity directement
if exist "%LOCALAPPDATA%\Programs\antigravity\Antigravity.exe" (
    set ELECTRON_RUN_AS_NODE=1
    set "NODE_EXEC=%LOCALAPPDATA%\Programs\antigravity\Antigravity.exe"
    goto START_SERVER
)

echo [!] ERREUR: Aucun moteur Node.js n'a ete trouve sur cette machine.
pause
exit /b 1

:START_SERVER
echo [+] Moteur Node detecte : %NODE_EXEC%
echo [*] Demarrage du serveur sur http://localhost:3333 ...
echo.

:: Ouvrir automatiquement le navigateur par defaut apres 1 seconde
start "" cmd /c "timeout /t 1 /nobreak >nul & start http://localhost:3333"

:RUN_LOOP
set CYBERRANGE_SUPERVISOR=1
:: Lancer le serveur
"%NODE_EXEC%" server.js

:: Code de sortie 42 = Redémarrage demandé après mise à jour automatique
if %ERRORLEVEL% equ 42 (
    echo.
    echo [*] Redémarrage du serveur suite a une mise a jour...
    timeout /t 1 /nobreak >nul
    goto RUN_LOOP
)

pause

#!/usr/bin/env bash
# ============================================================================
# CYBERRANGE PRO - SCRIPT DE MISE À JOUR MULTIPLATEFORME (LINUX & MACOS)
# ============================================================================

set -u

# Confinement dans le répertoire du projet pour supporter l'appel depuis n'importe quel dossier
cd "$(dirname "${BASH_SOURCE[0]}")" || exit 1

echo "====================================================================="
echo "   🚀 CYBERRANGE PRO - ASSISTANT DE MISE À JOUR OFFENSIVE"
echo "====================================================================="
echo ""

# 1. Vérification du moteur d'exécution Node.js
if ! command -v node >/dev/null 2>&1; then
    echo "❌ [ERREUR] Node.js n'est pas installé ou introuvable dans votre PATH."
    echo "ℹ️  Veuillez installer Node.js v18+ (https://nodejs.org)."
    exit 1
fi

echo "[*] Recherche de la dernière version sur GitHub Releases..."
echo "[*] Préservation garantie de la progression utilisateur (cyberrange.db)..."
echo ""

# 2. Exécution du moteur d'auto-update
node updater.js apply
EXIT_STATUS=$?

if [ $EXIT_STATUS -eq 0 ]; then
    echo ""
    echo "====================================================================="
    echo "   ✅ [SUCCÈS] Mise à jour appliquée avec succès !"
    echo "   🛡️  Tous vos niveaux, XP et statistiques SQLite sont préservés."
    echo "   💡 Relancez le serveur avec : ./start.sh"
    echo "====================================================================="
else
    echo ""
    echo "⚠️  [AVERTISSEMENT] La mise à jour automatique n'a pas pu être finalisée."
    echo "ℹ️  Vérifiez votre connexion Internet ou téléchargez l'archive manuellement."
fi

exit $EXIT_STATUS

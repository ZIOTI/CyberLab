#!/usr/bin/env bash
# ============================================================================
# CYBERRANGE PRO - LANCEUR MULTIPLATEFORME (LINUX & MACOS)
# ============================================================================

set -u

# Confinement dans le répertoire du projet pour supporter l'appel depuis n'importe quel dossier
cd "$(dirname "${BASH_SOURCE[0]}")" || exit 1

echo "====================================================================="
echo "   🛡️  CYBERRANGE PRO - ACADÉMIE OFFENSIVE DE ZÉRO À PRO"
echo "====================================================================="
echo ""

# 1. Vérification du moteur d'exécution Node.js
if ! command -v node >/dev/null 2>&1; then
    echo "❌ [ERREUR] Node.js n'est pas installé ou n'est pas dans votre PATH."
    echo "ℹ️  Veuillez installer Node.js v18 ou supérieur (https://nodejs.org)."
    exit 1
fi

NODE_VERSION_RAW=$(node -v | tr -d 'v')
NODE_MAJOR=$(echo "$NODE_VERSION_RAW" | cut -d. -f1)

if [ "$NODE_MAJOR" -lt 18 ]; then
    echo "❌ [ERREUR] Node.js v18+ est requis. Version détectée : v$NODE_VERSION_RAW"
    echo "ℹ️  Veuillez mettre à jour Node.js vers v18, v20 ou v22."
    exit 1
fi

echo "✅ Moteur Node.js détecté : v$NODE_VERSION_RAW"
echo "🚀 Démarrage du serveur CyberRange PRO sur http://127.0.0.1:3333 ..."
echo ""

# 2. Fonction d'ouverture automatique du navigateur par défaut
open_browser() {
    local target_url="http://127.0.0.1:3333"
    local max_retries=30
    local count=0

    # Attente active de la disponibilité du serveur (avec curl ou node natif)
    while [ $count -lt $max_retries ]; do
        if command -v curl >/dev/null 2>&1; then
            if curl -s -f "$target_url/api/version" >/dev/null 2>&1; then
                break
            fi
        elif node -e "fetch('$target_url/api/version').then(r=>{if(r.ok)process.exit(0);else process.exit(1)}).catch(()=>process.exit(1))" >/dev/null 2>&1; then
            break
        fi
        sleep 0.4
        count=$((count + 1))
    done

    # Détection de l'utilitaire d'ouverture selon l'OS (macOS 'open' vs Linux 'xdg-open')
    if [ "$(uname -s)" = "Darwin" ]; then
        open "$target_url" >/dev/null 2>&1 &
    elif [ -n "${DISPLAY:-}" ] || [ -n "${WAYLAND_DISPLAY:-}" ]; then
        if command -v xdg-open >/dev/null 2>&1; then
            xdg-open "$target_url" >/dev/null 2>&1 &
        fi
    fi
}

# Lancer la veille d'ouverture du navigateur en tâche de fond
open_browser &

# 3. Boucle de supervision du serveur (redémarrage propre sur mise à jour)
export CYBERRANGE_SUPERVISOR=1

while true; do
    node server.js
    EXIT_CODE=$?

    # Code de sortie 42 = Redémarrage demandé après application d'une mise à jour
    if [ $EXIT_CODE -eq 42 ]; then
        echo ""
        echo "🔄 [*] Redémarrage automatique du serveur suite à la mise à jour..."
        sleep 1
    else
        break
    fi
done

exit $EXIT_CODE

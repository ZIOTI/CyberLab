// ============================================================================
// CYBERRANGE PRO - MOTEUR D'AUTO-UPDATE ET DE PRÉSERVATION DES DONNÉES
// 100% Autonome, Zéro dépendance npm, Préservation absolue de cyberrange.db
// ============================================================================

const fs = require('node:fs');
const path = require('node:path');
const https = require('node:https');
const { execSync } = require('node:child_process');

const APP_DIR = __dirname;
const DB_PATH = path.join(APP_DIR, 'cyberrange.db');
const DB_BAK_PATH = path.join(APP_DIR, 'cyberrange.db.bak');
const PKG_PATH = path.join(APP_DIR, 'package.json');

function getPackageConfig() {
  try {
    const pkg = JSON.parse(fs.readFileSync(PKG_PATH, 'utf8'));
    return {
      version: pkg.version || '1.0.0',
      owner: (pkg.cyberConfig && pkg.cyberConfig.repoOwner) || 'Zioti',
      repo: (pkg.cyberConfig && pkg.cyberConfig.repoName) || 'CyberLab'
    };
  } catch (e) {
    return { version: '1.0.0', owner: 'Zioti', repo: 'CyberLab' };
  }
}

// Nettoie et compare deux numéros de version SemVer (ex: "v1.0.1" vs "1.0.0")
function isNewerVersion(latest, current) {
  const clean = v => (v || '').replace(/^v/i, '').trim();
  const v1 = clean(latest).split('.').map(n => parseInt(n, 10) || 0);
  const v2 = clean(current).split('.').map(n => parseInt(n, 10) || 0);

  const len = Math.max(v1.length, v2.length);
  for (let i = 0; i < len; i++) {
    const p1 = v1[i] || 0;
    const p2 = v2[i] || 0;
    if (p1 > p2) return true;
    if (p1 < p2) return false;
  }
  return false;
}

// Requête HTTPS générique avec redirection
function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'CyberRange-PRO-AutoUpdater/1.0',
        'Accept': 'application/vnd.github.v3+json'
      }
    };

    https.get(url, options, (res) => {
      // Gestion des redirections HTTP (301, 302, 307)
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(fetchJSON(res.headers.location));
      }

      if (res.statusCode === 404) {
        return resolve({ not_found: true, statusCode: 404 });
      }

      if (res.statusCode < 200 || res.statusCode >= 300) {
        return reject(new Error(`GitHub API HTTP ${res.statusCode}: ${res.statusMessage}`));
      }

      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

// Téléchargement binaire de fichier
function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'CyberRange-PRO-AutoUpdater/1.0',
        'Accept': 'application/octet-stream'
      }
    };

    https.get(url, options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(downloadFile(res.headers.location, destPath));
      }

      if (res.statusCode !== 200) {
        return reject(new Error(`Téléchargement échoué HTTP ${res.statusCode}`));
      }

      const file = fs.createWriteStream(destPath);
      res.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

// 1. VÉRIFICATION DE LA DISPONIBILITÉ D'UNE MISE À JOUR
async function checkForUpdates() {
  const config = getPackageConfig();
  const url = `https://api.github.com/repos/${config.owner}/${config.repo}/releases/latest`;

  try {
    const release = await fetchJSON(url);

    if (release.not_found) {
      return {
        updateAvailable: false,
        currentVersion: config.version,
        latestVersion: config.version,
        message: 'Dépôt GitHub ou Release introuvable pour l\'instant.'
      };
    }

    const latestTag = release.tag_name || release.name || config.version;
    const cleanLatest = latestTag.replace(/^v/i, '').trim();
    const updateAvailable = isNewerVersion(cleanLatest, config.version);

    // Cherche l'archive release zippée (.zip) dans les assets
    let downloadUrl = release.zipball_url;
    if (release.assets && release.assets.length > 0) {
      const zipAsset = release.assets.find(a => a.name.endsWith('.zip'));
      if (zipAsset) {
        downloadUrl = zipAsset.browser_download_url;
      }
    }

    return {
      updateAvailable,
      currentVersion: config.version,
      latestVersion: cleanLatest,
      tag: latestTag,
      releaseName: release.name || latestTag,
      releaseNotes: release.body || 'Mise à jour d\'optimisation du laboratoire offensive.',
      publishedAt: release.published_at || new Date().toISOString(),
      downloadUrl: downloadUrl,
      htmlUrl: release.html_url || `https://github.com/${config.owner}/${config.repo}/releases`,
      mandatory: true
    };
  } catch (err) {
    return {
      updateAvailable: false,
      currentVersion: config.version,
      latestVersion: config.version,
      offline: true,
      error: err.message
    };
  }
}

// 2. EXTRACTION ET COPIE RÉCURSIVE SÉCURISÉE (PRÉSERVANT LA BASE SQLITE)
function copyDirRecursiveSafe(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    // PROTECTION ABSOLUE DE LA BASE DE DONNÉES DE PROGRESSION
    if (entry.name === 'cyberrange.db' || entry.name.startsWith('cyberrange.db-')) {
      continue; // Ne JAMAIS écraser la base SQLite des niveaux !
    }

    if (entry.isDirectory()) {
      if (entry.name === '.git' || entry.name === 'node_modules') continue;
      copyDirRecursiveSafe(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 3. APPLICATION COMPLÈTE DE LA MISE À JOUR
async function applyUpdate() {
  const check = await checkForUpdates();
  if (!check.updateAvailable && !process.env.FORCE_UPDATE) {
    return { success: false, message: 'Aucune mise à jour disponible.', currentVersion: check.currentVersion };
  }

  console.log(`[*] Démarrage de la mise à jour v${check.currentVersion} -> v${check.latestVersion}...`);

  // Étape A : Sauvegarde de sécurité de la base de données existante
  if (fs.existsSync(DB_PATH)) {
    console.log('[*] Sauvegarde de cyberrange.db vers cyberrange.db.bak...');
    fs.copyFileSync(DB_PATH, DB_BAK_PATH);
  }

  const tempZip = path.join(APP_DIR, 'update_temp.zip');
  const tempExtract = path.join(APP_DIR, 'update_extract');

  try {
    // Étape B : Téléchargement du ZIP de mise à jour
    console.log(`[*] Téléchargement depuis ${check.downloadUrl}...`);
    await downloadFile(check.downloadUrl, tempZip);

    // Étape C : Extraction du ZIP
    if (fs.existsSync(tempExtract)) {
      fs.rmSync(tempExtract, { recursive: true, force: true });
    }
    fs.mkdirSync(tempExtract, { recursive: true });

    console.log('[*] Extraction de l\'archive...');
    try {
      execSync(`tar -xf "${tempZip}" -C "${tempExtract}"`, { stdio: 'ignore' });
    } catch (tarErr) {
      // Fallback PowerShell Expand-Archive
      execSync(`powershell -NoProfile -Command "Expand-Archive -Force -Path '${tempZip}' -DestinationPath '${tempExtract}'"`, { stdio: 'ignore' });
    }

    // Détection du dossier source (si github zipball, il y a un dossier conteneur interne)
    let sourceRoot = tempExtract;
    const items = fs.readdirSync(tempExtract);
    if (items.length === 1 && fs.statSync(path.join(tempExtract, items[0])).isDirectory()) {
      sourceRoot = path.join(tempExtract, items[0]);
    }

    // Étape D : Remplacement sécurisé des fichiers de l'application
    console.log('[*] Déploiement des nouveaux fichiers (préservation de SQLite)...');
    copyDirRecursiveSafe(sourceRoot, APP_DIR);

    // Nettoyage temporaire
    fs.unlinkSync(tempZip);
    fs.rmSync(tempExtract, { recursive: true, force: true });

    // Vérification que la base de données est bien intacte
    if (!fs.existsSync(DB_PATH) && fs.existsSync(DB_BAK_PATH)) {
      fs.copyFileSync(DB_BAK_PATH, DB_PATH);
    }

    console.log(`[✔] Mise à jour vers la version ${check.latestVersion} réussie !`);
    return {
      success: true,
      oldVersion: check.currentVersion,
      newVersion: check.latestVersion,
      message: 'Mise à jour installée avec succès ! Les niveaux et statistiques sont préservés.'
    };
  } catch (err) {
    // En cas d'erreur, restaurer immédiatement cyberrange.db depuis le backup
    if (fs.existsSync(DB_BAK_PATH) && !fs.existsSync(DB_PATH)) {
      fs.copyFileSync(DB_BAK_PATH, DB_PATH);
    }
    // Nettoyage
    if (fs.existsSync(tempZip)) fs.unlinkSync(tempZip);
    if (fs.existsSync(tempExtract)) fs.rmSync(tempExtract, { recursive: true, force: true });

    console.error('[!] Erreur lors de la mise à jour :', err);
    throw err;
  }
}

// Exécution directe via CLI (ex: `node updater.js check` ou `node updater.js apply`)
if (require.main === module) {
  const cmd = process.argv[2] || 'check';
  if (cmd === 'check') {
    checkForUpdates().then(info => {
      console.log(JSON.stringify(info, null, 2));
    }).catch(err => {
      console.error(err);
      process.exit(1);
    });
  } else if (cmd === 'apply') {
    applyUpdate().then(res => {
      console.log(JSON.stringify(res, null, 2));
    }).catch(err => {
      console.error(err);
      process.exit(1);
    });
  }
}

module.exports = {
  checkForUpdates,
  applyUpdate,
  getPackageConfig
};

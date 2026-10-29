// Script to assemble and generate public/js/challenges.js
const fs = require('fs');
const path = require('path');

const t1 = require('./build_levels_track1.js');
const t2 = require('./build_levels_track2.js');
const t3 = require('./build_levels_track3.js');
const t4 = require('./build_levels_track4.js');
const t5 = require('./build_levels_track5.js');

const TRACKS = [
  { id: 'track-linux', title: 'Piste 1 : Linux & Ligne de Commande (Niveau Zéro à Pro)', icon: '🐧', moduleIds: ['m1'] },
  { id: 'track-network', title: 'Piste 2 : Réseau Fondamental : De l\'IP au Web', icon: '🌐', moduleIds: ['m2'] },
  { id: 'track-sql', title: 'Piste 3 : SQL & Injections SQL (De Zéro à Pro)', icon: '💉', moduleIds: ['m3'] },
  { id: 'track-client', title: 'Piste 4 : Failles Web Client & Sessions (XSS / IDOR / JWT)', icon: '⚡', moduleIds: ['m4'] },
  { id: 'track-server', title: 'Piste 5 : Failles Serveur & Élévation Root (RCE / PrivEsc)', icon: '💀', moduleIds: ['m5'] }
];

const UNITS = [
  {
    id: 'm1',
    trackId: 'track-linux',
    number: 1,
    title: 'Linux & Terminal : Les Fondations du Hacker',
    icon: '🐧',
    badgeColor: 'bg-cyan-500',
    description: 'Apprends à utiliser le terminal Linux à partir de zéro absolu : navigation, arborescence, fichiers, pipes, filtres grep, permissions chmod, processus et gestion de paquets.'
  },
  {
    id: 'm2',
    trackId: 'track-network',
    number: 2,
    title: 'Réseau Fondamental : Du Câble aux Protocoles',
    icon: '🌐',
    badgeColor: 'bg-emerald-500',
    description: 'Comprends ce qu\'est une adresse IP, un port réseau, une requête HTTP, le rôle du DNS, le handshake TCP à 3 voies, et maîtrise l\'outil en ligne de commande curl et le scanner nmap.'
  },
  {
    id: 'm3',
    trackId: 'track-sql',
    number: 3,
    title: 'Bases de Données & Injections SQL (SQLi)',
    icon: '💉',
    badgeColor: 'bg-rose-500',
    description: 'Comprends comment stocker et filtrer des données en SQL (SELECT, WHERE), puis apprends à briser la syntaxe pour contourner les logins et vider les tables avec UNION SELECT.'
  },
  {
    id: 'm4',
    trackId: 'track-client',
    number: 4,
    title: 'Failles Côté Client, Cookies & Authentification',
    icon: '🔑',
    badgeColor: 'bg-amber-500',
    description: 'Découvre comment fonctionne un navigateur web, inspecte les cookies de session avec les DevTools, détourne des contrôles d\'accès IDOR, exploite les failles XSS et falsifie des jetons JWT.'
  },
  {
    id: 'm5',
    trackId: 'track-server',
    number: 5,
    title: 'Injections Serveur & Conquête du Root (PrivEsc)',
    icon: '💀',
    badgeColor: 'bg-purple-600',
    description: 'Force le serveur à exécuter des commandes arbitraires (RCE), contourne les filtres avec IFS, comprends les reverse shells et escalade tes privilèges vers l\'utilisateur root suprême via SUID et GTFOBins.'
  }
];

const ALL_LEVELS = [...t1, ...t2, ...t3, ...t4, ...t5];

// Mélange des options de quiz au niveau de la génération pour éliminer le pattern où A est toujours la bonne réponse
ALL_LEVELS.forEach(lvl => {
  if (lvl.microCard && lvl.microCard.quickQuiz && Array.isArray(lvl.microCard.quickQuiz.options)) {
    const opts = lvl.microCard.quickQuiz.options;
    for (let i = opts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [opts[i], opts[j]] = [opts[j], opts[i]];
    }
  }
});

const BADGES = [
  { id: 'badge-linux', title: 'Explorateur Linux Débutant', icon: '🐧', desc: 'A appris à naviguer, créer et inspecter des fichiers dans un terminal.' },
  { id: 'badge-net', title: 'Architecte Réseau Fondamental', icon: '🌐', desc: 'Comprend les adresses IP, les numéros de ports, curl et le handshake TCP.' },
  { id: 'badge-sql', title: 'Infiltreur de Données SQL', icon: '💉', desc: 'Maîtrise les requêtes SELECT et l\'injection de contournement \' OR 1=1 --.' },
  { id: 'badge-client', title: 'Penta-Testeur Web Client', icon: '⚡', desc: 'Capte les failles de contrôle d\'accès IDOR et l\'injection XSS de cookies.' },
  { id: 'badge-root', title: 'Souveraineté Root Suprême', icon: '👑', desc: 'A escaladé ses privilèges via un binaire SUID pour conquérir la machine.' }
];

console.log(`Tracks: ${TRACKS.length}, Units: ${UNITS.length}, Total Levels: ${ALL_LEVELS.length}`);

const targetFile = path.join(__dirname, 'public', 'js', 'challenges.js');

const jsContent = `// ============================================================================
// CYBERRANGE PRO - CURRICULUM PÉDAGOGIQUE OFFENSIF "DE ZÉRO À PRO"
// 5 Pistes Complètes, 61 Niveaux Granulaires Denses, Multi-Slides Détaillées,
// Schémas SVG, Line-Clickers, Puzzles Tactiles, Quiz et Environnements Réels
// ============================================================================

window.CYBER_TRACKS = ${JSON.stringify(TRACKS, null, 2)};

window.CYBER_UNITS = ${JSON.stringify(UNITS, null, 2)};

window.CYBER_LEVELS = ${JSON.stringify(ALL_LEVELS, null, 2)};

window.CYBER_BADGES = ${JSON.stringify(BADGES, null, 2)};
`;

fs.writeFileSync(targetFile, jsContent, 'utf8');
console.log(`Successfully generated ${targetFile} with ${ALL_LEVELS.length} levels!`);

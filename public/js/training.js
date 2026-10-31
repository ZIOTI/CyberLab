// ============================================================================
// CYBERRANGE PRO - MODULE ZONE D'ENTRAÎNEMENT & ROOMS TRYHACKME / HACKTHEBOX
// MOTEUR DE MINIATURES VECTORIELLES DÉDIÉES & MATRICE TACTIQUE ULTRA-RÉALISTE
// 100% Autonome, Zéro dépendance npm, Haute fidélité graphique & Rétention SQLite
// ============================================================================

class CyberThumbnailEngine {
  static getPalette(category = '', os = '') {
    const cat = (category || '').toLowerCase();
    if (cat.includes('web')) {
      return { bg1: '#041517', bg2: '#082c2a', primary: '#10b981', secondary: '#06b6d4', accent: '#34d399', name: 'WEB EXPLOITATION' };
    }
    if (cat.includes('linux')) {
      return { bg1: '#171204', bg2: '#2e2107', primary: '#f59e0b', secondary: '#10b981', accent: '#fbbf24', name: 'LINUX PRIVESC' };
    }
    if (cat.includes('windows') || cat.includes('ad') || cat.includes('active directory')) {
      return { bg1: '#0e091d', bg2: '#21143f', primary: '#8b5cf6', secondary: '#3b82f6', accent: '#a78bfa', name: 'ACTIVE DIRECTORY' };
    }
    if (cat.includes('pwn') || cat.includes('binaire') || cat.includes('kernel')) {
      return { bg1: '#1a0509', bg2: '#350812', primary: '#ef4444', secondary: '#f97316', accent: '#f87171', name: 'BINARY PWN / KERNEL' };
    }
    if (cat.includes('cloud') || cat.includes('docker') || cat.includes('k8s')) {
      return { bg1: '#04141f', bg2: '#0b2940', primary: '#06b6d4', secondary: '#3b82f6', accent: '#38bdf8', name: 'CLOUD & DOCKER' };
    }
    if (cat.includes('crypto')) {
      return { bg1: '#171403', bg2: '#332a05', primary: '#eab308', secondary: '#06b6d4', accent: '#fde047', name: 'CRYPTANALYSIS' };
    }
    if (cat.includes('forensics')) {
      return { bg1: '#04161a', bg2: '#09302e', primary: '#14b8a6', secondary: '#3b82f6', accent: '#2dd4bf', name: 'DFIR & FORENSICS' };
    }
    if (cat.includes('network') || cat.includes('réseau') || cat.includes('reseau')) {
      return { bg1: '#05111d', bg2: '#0a233d', primary: '#38bdf8', secondary: '#818cf8', accent: '#7dd3fc', name: 'NETWORK PIVOTING' };
    }
    if (cat.includes('blue')) {
      return { bg1: '#050e1f', bg2: '#0b1f47', primary: '#3b82f6', secondary: '#10b981', accent: '#60a5fa', name: 'BLUE TEAM SIEM' };
    }
    if (cat.includes('reverse')) {
      return { bg1: '#15051a', bg2: '#2e0b38', primary: '#d946ef', secondary: '#06b6d4', accent: '#e879f9', name: 'REVERSE ENGINEERING' };
    }
    if (cat.includes('boot2root') || cat.includes('b2r')) {
      return { bg1: '#190412', bg2: '#380727', primary: '#ec4899', secondary: '#ef4444', accent: '#f472b6', name: 'BOOT2ROOT ENTERPRISE' };
    }
    if (cat.includes('api')) {
      return { bg1: '#081711', bg2: '#0e3323', primary: '#10b981', secondary: '#3b82f6', accent: '#34d399', name: 'REST & GRAPHQL API' };
    }
    if (cat.includes('osint') || cat.includes('social') || cat.includes('phish')) {
      return { bg1: '#15130b', bg2: '#2b2512', primary: '#fbbf24', secondary: '#f87171', accent: '#fde68a', name: 'OSINT & SOCIAL ENG.' };
    }
    return { bg1: '#090f1d', bg2: '#131e33', primary: '#38bdf8', secondary: '#818cf8', accent: '#60a5fa', name: 'TACTICAL LAB' };
  }

  static getOsIconSvg(os = '') {
    const o = (os || '').toLowerCase();
    if (o.includes('win')) {
      return `
        <rect x="0" y="0" width="6" height="6" fill="currentColor"/>
        <rect x="7.5" y="0" width="6" height="6" fill="currentColor"/>
        <rect x="0" y="7.5" width="6" height="6" fill="currentColor"/>
        <rect x="7.5" y="7.5" width="6" height="6" fill="currentColor"/>
      `;
    }
    if (o.includes('cloud')) {
      return `
        <path d="M4 11a3 3 0 0 1-.3-6 4 4 0 0 1 7.6-1.5 3.5 3.5 0 0 1 2.7 6.5H4z" fill="none" stroke="currentColor" stroke-width="1.3"/>
      `;
    }
    if (o.includes('docker')) {
      return `
        <rect x="1" y="6" width="2" height="2" fill="currentColor"/>
        <rect x="4" y="6" width="2" height="2" fill="currentColor"/>
        <rect x="7" y="6" width="2" height="2" fill="currentColor"/>
        <rect x="4" y="3.5" width="2" height="2" fill="currentColor"/>
        <rect x="7" y="3.5" width="2" height="2" fill="currentColor"/>
        <path d="M1 8.5c1 1.5 3 2 6 2s6-1.5 6-3.5H1v1.5z" fill="none" stroke="currentColor" stroke-width="1.2"/>
      `;
    }
    // Linux Penguin Silhouette
    return `
      <circle cx="7" cy="4.5" r="2.8" fill="currentColor"/>
      <ellipse cx="7" cy="9.5" rx="4.5" ry="3.8" fill="currentColor" opacity="0.8"/>
      <path d="M5.5 5.5h3L7 7z" fill="#f59e0b"/>
    `;
  }

  static render(challenge) {
    const c = challenge || {};
    const pal = this.getPalette(c.category, c.target_os);
    const mono = (c.monogram || (c.id ? c.id.substring(0, 4) : 'LAB')).toUpperCase();
    const os = c.target_os || 'Linux';
    const org = (c.organization || 'CYBERLAB CORP').toUpperCase();
    const isB2r = (c.machine_type === 'machine' || (c.id || '').startsWith('b2r-'));
    const type = isB2r ? 'MACHINE [2 FLAGS]' : 'VULN ROOM';
    const cve = c.cve || '';
    const solves = c.solves || 1200;
    const rating = c.rating || 4.9;
    const isSolved = c.status === 'solved';

    const gradId = 'grad_' + (c.id || 'room').replace(/[^a-zA-Z0-9]/g, '_');

    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 270" class="select-none" style="width:100%; height:100%; display:block;">
        <defs>
          <linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${pal.bg1}" />
            <stop offset="55%" stop-color="${pal.bg2}" />
            <stop offset="100%" stop-color="${pal.bg1}" />
          </linearGradient>
          <pattern id="grid_${gradId}" width="24" height="24" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="24" y2="0" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
            <line x1="0" y1="0" x2="0" y2="24" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
          </pattern>
        </defs>

        <!-- Fond dégradé sombre immersif -->
        <rect width="480" height="270" fill="url(#${gradId})"/>
        <rect width="480" height="270" fill="url(#grid_${gradId})"/>

        <!-- Lignes de balayage tactiques (Scanlines) -->
        <line x1="0" y1="42" x2="480" y2="42" stroke="${pal.primary}" stroke-width="0.8" opacity="0.35"/>
        <line x1="0" y1="228" x2="480" y2="228" stroke="rgba(255,255,255,0.08)" stroke-width="0.8"/>

        <!-- Tracé de circuit cyber discret -->
        <path d="M 20 42 L 40 42 L 55 56 L 160 56" fill="none" stroke="${pal.secondary}" stroke-width="1.2" opacity="0.4" stroke-dasharray="4,2"/>
        <circle cx="160" cy="56" r="2.5" fill="${pal.secondary}" opacity="0.8"/>

        <path d="M 460 228 L 440 228 L 425 214 L 320 214" fill="none" stroke="${pal.primary}" stroke-width="1.2" opacity="0.35" stroke-dasharray="4,2"/>
        <circle cx="320" cy="214" r="2.5" fill="${pal.primary}" opacity="0.8"/>

        <!-- Monogramme géant en filigrane d'arrière-plan -->
        <text x="330" y="180" font-family="'JetBrains Mono', monospace" font-size="105" font-weight="900" fill="${pal.primary}" opacity="0.05" text-anchor="middle" letter-spacing="4">
          ${mono}
        </text>

        <!-- Badge en-tête gauche : Type de Machine -->
        <g transform="translate(18, 14)">
          <rect width="136" height="22" rx="5" fill="rgba(0,0,0,0.65)" stroke="${pal.primary}" stroke-width="1" opacity="0.9"/>
          <text x="10" y="15" font-family="'JetBrains Mono', monospace" font-size="9" font-weight="900" fill="${pal.primary}" letter-spacing="0.5">
            ${type}
          </text>
        </g>

        <!-- Badge en-tête droit : OS -->
        <g transform="translate(366, 14)">
          <rect width="96" height="22" rx="5" fill="rgba(0,0,0,0.65)" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
          <g transform="translate(10, 4)" fill="${pal.accent}" color="${pal.accent}">
            ${this.getOsIconSvg(os)}
          </g>
          <text x="30" y="15" font-family="'JetBrains Mono', monospace" font-size="9" font-weight="800" fill="#cbd5e1" letter-spacing="0.5">
            ${os.toUpperCase()}
          </text>
        </g>

        <!-- Bloc Central : Monogramme Tactique & Organisation Cible -->
        <g transform="translate(24, 90)">
          <!-- Boîte Monogramme néon -->
          <rect width="84" height="84" rx="14" fill="#030712" stroke="${pal.primary}" stroke-width="2"/>
          <rect x="3" y="3" width="78" height="78" rx="11" fill="none" stroke="${pal.secondary}" stroke-width="0.8" opacity="0.4"/>
          <text x="42" y="52" font-family="'JetBrains Mono', monospace" font-size="28" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="1">
            ${mono}
          </text>
          <text x="42" y="69" font-family="'JetBrains Mono', monospace" font-size="8" font-weight="800" fill="${pal.accent}" text-anchor="middle" letter-spacing="1.5">
            TACTICAL
          </text>

          <!-- Titre Organisation Cible & Filière -->
          <g transform="translate(100, 20)">
            <text x="0" y="0" font-family="'JetBrains Mono', monospace" font-size="9.5" font-weight="900" fill="${pal.primary}" letter-spacing="1.2">
              TARGET // ${org}
            </text>
            <text x="0" y="24" font-family="'Inter', sans-serif" font-size="17" font-weight="900" fill="#ffffff" letter-spacing="-0.3">
              ${this.escapeXml(c.title ? (c.title.length > 25 ? c.title.substring(0, 24) + '…' : c.title) : mono)}
            </text>
            <text x="0" y="44" font-family="'JetBrains Mono', monospace" font-size="9.5" font-weight="700" fill="#94a3b8">
              ${pal.name} • ${c.duration_min || 45} MIN
            </text>
          </g>
        </g>

        <!-- Barre de pied de page : CVE, Rating, Solves -->
        <g transform="translate(20, 248)">
          ${cve ? `
            <rect width="86" height="15" rx="3" fill="rgba(239,68,68,0.18)" stroke="rgba(239,68,68,0.4)" stroke-width="0.8"/>
            <text x="43" y="11" font-family="'JetBrains Mono', monospace" font-size="8.5" font-weight="800" fill="#fca5a5" text-anchor="middle">
              ${cve}
            </text>
          ` : `
            <text x="0" y="11" font-family="'JetBrains Mono', monospace" font-size="8.5" font-weight="700" fill="#64748b">
              OFFENSIVE CTF LAB
            </text>
          `}

          <!-- Rating & Solves à droite -->
          <text x="440" y="11" font-family="'JetBrains Mono', monospace" font-size="9" font-weight="800" fill="#94a3b8" text-anchor="end">
            ★ ${rating.toFixed(1)}  •  ${(solves >= 1000 ? (solves / 1000).toFixed(1) + 'k' : solves)} solves
          </text>
        </g>

        <!-- Ruban diagonal PWNED si résolu -->
        ${isSolved ? `
          <g transform="translate(415, -15) rotate(45)">
            <rect x="-40" y="0" width="130" height="26" fill="#10b981" />
            <text x="25" y="17" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="900" fill="#022c22" text-anchor="middle" letter-spacing="2">
              PWNED
            </text>
          </g>
        ` : ''}
      </svg>
    `;
  }

  static escapeXml(unsafe = '') {
    return String(unsafe)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}

class TrainingSystem {
  constructor() {
    this.catalog = [];
    this.learningPaths = [];
    this.viewMode = 'grid'; // 'grid' | 'matrix' | 'paths'
    this.activeFilter = {
      category: 'all',
      difficulty: 'all',
      status: 'all',
      type: 'all', // 'all' | 'machine' | 'room'
      search: ''
    };
    this.activeChallenge = null;
    this.activeRoomTab = 'tasks'; // 'tasks' | 'browser' | 'scenario' | 'writeup'
    this.activeInstance = null;
    this.timerInterval = null;
    this.expandedTaskId = null;
    this.isLoading = false;
  }

  async init() {
    await this.loadCatalog();
    await this.loadLearningPaths();
    this.setupListeners();
    this.renderHub();
  }

  setupListeners() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const modal = document.getElementById('modal-training-room');
        if (modal && !modal.classList.contains('hidden')) {
          this.closeRoom();
        }
      }
    });
  }

  // ==========================================================================
  // CHARGEMENT DU CATALOGUE & DES PARCOURS
  // ==========================================================================
  async loadCatalog() {
    try {
      this.isLoading = true;
      const res = await fetch('/api/training/catalog');
      if (res.ok) {
        const data = await res.json();
        this.catalog = data.challenges || (Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error('Erreur chargement catalogue entraînement:', e);
    } finally {
      this.isLoading = false;
    }
  }

  async loadLearningPaths() {
    try {
      const res = await fetch('/api/training/learning-paths');
      if (res.ok) {
        const data = await res.json();
        this.learningPaths = data.paths || (Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error('Erreur chargement learning paths:', e);
    }
  }

  switchViewMode(mode) {
    if (this.viewMode === mode) return;
    this.viewMode = mode;
    if (window.cyberAudio) window.cyberAudio.playTactileClick();
    this.renderHub();
  }

  // ==========================================================================
  // RENDU DU TRAINING HUB
  // ==========================================================================
  renderHub() {
    const mount = document.getElementById('view-training-hub');
    if (!mount) return;

    const totalChallenges = this.catalog.length;
    const solvedCount = this.catalog.filter(c => c.status === 'solved').length;
    const totalPoints = this.catalog.reduce((acc, c) => acc + (c.points || 0), 0);
    const earnedPoints = this.catalog.filter(c => c.status === 'solved').reduce((acc, c) => acc + (c.points || 0), 0);
    const progressPct = totalChallenges > 0 ? Math.round((solvedCount / totalChallenges) * 100) : 0;

    mount.innerHTML = `
      <!-- EN-TÊTE DU CENTRE D'ENTRAÎNEMENT -->
      <div class="p-6 bg-slate-900/80 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden font-mono mb-6">
        <div class="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative z-10">
          <div>
            <div class="flex items-center gap-2 mb-1.5">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-950/80 text-emerald-400 border border-emerald-800/80">
                LABORATOIRES TACTIQUES OFFENSIFS
              </span>
              <span class="text-xs text-slate-400">// ${totalChallenges} ROOMS & MACHINES RÉALISTES</span>
            </div>
            <h2 class="text-2xl font-black text-white font-heading tracking-tight">Zone d'Entraînement Avancée</h2>
            <p class="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed font-sans">
              Infiltre des environnements d'entreprise vulnérables, analyse des artefacts réseau et médico-légaux, casse des cryptosystèmes et pwn des binaires dans des labs sécurisés.
            </p>
          </div>

          <!-- Métriques Globales -->
          <div class="flex items-center gap-3">
            <div class="px-4 py-3 bg-slate-950 rounded-xl border border-slate-800 text-center min-w-[90px]">
              <div class="text-[10px] text-slate-400 font-bold uppercase">Résolus</div>
              <div class="text-lg font-black text-emerald-400 mt-0.5">${solvedCount}/${totalChallenges}</div>
            </div>
            <div class="px-4 py-3 bg-slate-950 rounded-xl border border-slate-800 text-center min-w-[90px]">
              <div class="text-[10px] text-slate-400 font-bold uppercase">Score</div>
              <div class="text-lg font-black text-cyan-400 mt-0.5">${earnedPoints} pts</div>
            </div>
            <div class="px-4 py-3 bg-slate-950 rounded-xl border border-slate-800 text-center min-w-[90px]">
              <div class="text-[10px] text-slate-400 font-bold uppercase">Maîtrise</div>
              <div class="text-lg font-black text-purple-400 mt-0.5">${progressPct}%</div>
            </div>
          </div>
        </div>

        <!-- Barre de complétion globale -->
        <div class="mt-5 pt-4 border-t border-slate-800/60 flex items-center gap-4">
          <div class="flex-1 h-2 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div class="h-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-purple-500 rounded-full transition-all duration-500" style="width: ${progressPct}%;"></div>
          </div>
          <span class="text-[11px] font-bold text-slate-400">${progressPct}% complété</span>
        </div>
      </div>

      <!-- SPOTLIGHT HERO : MACHINE VEDETTE DU JOUR -->
      ${this.renderSpotlightHero()}

      <!-- BARRE DE FILTRES MULTIPLES & SÉLECTEUR DE MODE DE VUE -->
      <div class="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-3.5 font-mono mb-6">
        <div class="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          
          <!-- Recherche textuelle -->
          <div class="flex-1 relative">
            <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none w-4 h-4">
              ${window.CyberIcons ? window.CyberIcons.get('search', 'w-4 h-4') : '🔍'}
            </span>
            <input 
              type="text" 
              id="training-search-input"
              value="${this.escapeHtml(this.activeFilter.search)}"
              placeholder="Rechercher une machine, CVE, tech, organisation (ex: SQLi, Kerberos, Spring4Shell, Aura)..." 
              class="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none transition-colors"
            />
          </div>

          <!-- Sélecteurs de Filtres -->
          <div class="flex flex-wrap items-center gap-2">
            <!-- Filtre Difficulté -->
            <select id="filter-difficulty" class="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:border-cyan-500 focus:outline-none">
              <option value="all" ${this.activeFilter.difficulty === 'all' ? 'selected' : ''}>Toutes difficultés</option>
              <option value="beginner" ${this.activeFilter.difficulty === 'beginner' ? 'selected' : ''}>Débutant</option>
              <option value="easy" ${this.activeFilter.difficulty === 'easy' ? 'selected' : ''}>Facile</option>
              <option value="intermediate" ${this.activeFilter.difficulty === 'intermediate' ? 'selected' : ''}>Intermédiaire</option>
              <option value="hard" ${this.activeFilter.difficulty === 'hard' ? 'selected' : ''}>Difficile</option>
              <option value="insane" ${this.activeFilter.difficulty === 'insane' ? 'selected' : ''}>Insane</option>
            </select>

            <!-- Filtre Statut -->
            <select id="filter-status" class="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:border-cyan-500 focus:outline-none">
              <option value="all" ${this.activeFilter.status === 'all' ? 'selected' : ''}>Tous statuts</option>
              <option value="not_started" ${this.activeFilter.status === 'not_started' ? 'selected' : ''}>Non commencé</option>
              <option value="in_progress" ${this.activeFilter.status === 'in_progress' ? 'selected' : ''}>En cours</option>
              <option value="solved" ${this.activeFilter.status === 'solved' ? 'selected' : ''}>PWNED / Résolu</option>
            </select>

            <!-- Filtre Type de Cible -->
            <select id="filter-type" class="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:border-cyan-500 focus:outline-none">
              <option value="all" ${this.activeFilter.type === 'all' ? 'selected' : ''}>Tous types</option>
              <option value="machine" ${this.activeFilter.type === 'machine' ? 'selected' : ''}>Machines (2 Flags)</option>
              <option value="room" ${this.activeFilter.type === 'room' ? 'selected' : ''}>Rooms Web/API</option>
            </select>

            <!-- Boutons de Mode de Vue (Cards / Matrix / Paths) -->
            <div class="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button 
                onclick="window.trainingSystem.switchViewMode('grid')"
                class="px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${this.viewMode === 'grid' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'}"
                title="Vue Grille Illustrée"
              >
                <span>☵</span>
                <span class="hidden sm:inline">Affiches</span>
              </button>
              <button 
                onclick="window.trainingSystem.switchViewMode('matrix')"
                class="px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${this.viewMode === 'matrix' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'}"
                title="Vue Matrice Tactique (Style HackTheBox)"
              >
                <span>☰</span>
                <span class="hidden sm:inline">Matrice</span>
              </button>
              <button 
                onclick="window.trainingSystem.switchViewMode('paths')"
                class="px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${this.viewMode === 'paths' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'}"
                title="Vue Parcours Certifiants"
              >
                <span>☍</span>
                <span class="hidden sm:inline">Parcours</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Pilules de Catégories (Filtre rapide) -->
        <div class="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin text-xs pt-1 border-t border-slate-800/60">
          ${this.renderCategoryPills()}
        </div>
      </div>

      <!-- CONTENEUR DES LABS (SELON LE MODE DE VUE) -->
      <div id="training-view-mount" class="space-y-4 font-mono">
        ${this.renderActiveViewContent()}
      </div>
    `;

    this.attachHubEvents();
  }

  renderSpotlightHero() {
    const feat = this.catalog.find(c => c.id === 'b2r-01-enterprise-alpha') || this.catalog[0];
    if (!feat) return '';

    const isSolved = feat.status === 'solved';
    const mono = (feat.monogram || feat.id.substring(0, 4)).toUpperCase();
    const org = feat.organization || 'Aura Privatbank';

    return `
      <div class="spotlight-hero-card p-5 sm:p-6 mb-6 font-mono relative">
        <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div class="flex items-start gap-4 flex-1">
            <div class="radar-scanner-sweep flex-shrink-0 hidden sm:flex items-center justify-center">
              <span class="text-xs font-black text-emerald-400 font-mono tracking-widest">[${mono}]</span>
            </div>

            <div class="space-y-1.5 flex-1">
              <div class="flex flex-wrap items-center gap-2">
                <span class="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-black tracking-wider uppercase flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>MACHINE RECOMMANDÉE DU JOUR</span>
                </span>
                <span class="text-xs text-slate-400">// MISSION OFFENSIVE NON-GUIDÉE</span>
                <span class="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-bold border border-slate-700">
                  ${feat.target_os || 'Linux'}
                </span>
              </div>

              <h3 class="text-xl sm:text-2xl font-black text-white font-heading tracking-tight">
                ${this.escapeHtml(feat.title)} <span class="text-emerald-400 font-mono text-base font-normal">[${org}]</span>
              </h3>

              <p class="text-xs text-slate-300 leading-relaxed font-sans max-w-2xl">
                ${this.escapeHtml(feat.narrative_story || feat.description || 'Scénario complet en chaîne d\'intrusion : DMZ, élévation de privilèges et extraction du grand livre comptable.')}
              </p>

              <div class="flex flex-wrap items-center gap-3 pt-2 text-xs">
                <div class="flex items-center gap-1.5 text-amber-400 font-bold">
                  <span>💎</span>
                  <span>${feat.points} XP</span>
                </div>
                <div class="text-slate-500">•</div>
                <div class="flex items-center gap-1.5 text-slate-300">
                  <span>Difficulté :</span>
                  ${this.renderDiffMeter(feat.difficulty)}
                  <span class="text-[11px] font-bold text-slate-400">(${this.getDifficultyLabel(feat.difficulty)})</span>
                </div>
                <div class="text-slate-500">•</div>
                <div class="text-slate-400">
                  ★ ${(feat.rating || 4.9).toFixed(1)} (${feat.solves || 1400} solves)
                </div>
              </div>
            </div>
          </div>

          <div class="flex-shrink-0 flex sm:flex-col items-center gap-3 w-full sm:w-auto">
            <button 
              onclick="window.trainingSystem.openRoom('${feat.id}')"
              class="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs font-mono tracking-wider transition-all shadow-xl shadow-emerald-950/50 flex items-center justify-center gap-2 group"
            >
              <span>🚀</span>
              <span>${isSolved ? 'REVOIR L\'OPÉRATION' : 'LANCER L\'OPÉRATION SPOTLIGHT'}</span>
              <span class="group-hover:translate-x-1 transition-transform">&rarr;</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  renderDiffMeter(difficulty) {
    const d = (difficulty || '').toLowerCase();
    let count = 1;
    let cls = 'active-beginner';
    if (d === 'easy') { count = 2; cls = 'active-easy'; }
    else if (d === 'intermediate') { count = 3; cls = 'active-intermediate'; }
    else if (d === 'hard') { count = 4; cls = 'active-hard'; }
    else if (d === 'insane') { count = 5; cls = 'active-insane'; }

    return `
      <div class="diff-meter-bar" title="${this.getDifficultyLabel(difficulty)}">
        <span class="diff-meter-segment ${count >= 1 ? cls : ''}"></span>
        <span class="diff-meter-segment ${count >= 2 ? cls : ''}"></span>
        <span class="diff-meter-segment ${count >= 3 ? cls : ''}"></span>
        <span class="diff-meter-segment ${count >= 4 ? cls : ''}"></span>
        <span class="diff-meter-segment ${count >= 5 ? cls : ''}"></span>
      </div>
    `;
  }

  renderActiveViewContent() {
    if (this.viewMode === 'matrix') {
      return this.renderMatrixTable();
    }
    if (this.viewMode === 'paths') {
      return this.renderPathsView();
    }
    // Mode Par Défaut : Grille Illustrée avec Miniatures Dédiées
    return `
      <div class="flex items-center justify-between mb-3 text-xs text-slate-400 font-bold">
        <div>Affichage de <span class="text-cyan-400 font-black">${this.getFilteredChallenges().length}</span> lab(s)</div>
        <div class="text-[11px] text-slate-500">Miniatures Vectorielles HD • TryHackMe & HackTheBox Style</div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" id="training-rooms-grid">
        ${this.renderChallengeCards()}
      </div>
    `;
  }

  renderCategoryPills() {
    const categories = [
      { id: 'all', label: 'Toutes' },
      { id: 'Web', label: 'Web' },
      { id: 'Linux', label: 'Linux PrivEsc' },
      { id: 'Windows', label: 'Active Directory' },
      { id: 'Cloud', label: 'Cloud & Docker' },
      { id: 'Pwn', label: 'Pwn / Binaire' },
      { id: 'Crypto', label: 'Crypto' },
      { id: 'Forensics', label: 'Forensics' },
      { id: 'Network', label: 'Réseau' },
      { id: 'Reverse', label: 'Reverse' },
      { id: 'Boot2Root', label: 'Boot2Root' },
      { id: 'API', label: 'API & Mobile' },
      { id: 'Blue', label: 'Blue Team' },
      { id: 'OSINT', label: 'OSINT' }
    ];

    return categories.map(cat => {
      const active = this.activeFilter.category.toLowerCase() === cat.id.toLowerCase();
      return `
        <button 
          class="px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
            active 
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-950' 
              : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
          }"
          onclick="window.trainingSystem.setCategoryFilter('${cat.id}')"
        >
          ${cat.label}
        </button>
      `;
    }).join('');
  }

  getFilteredChallenges() {
    return this.catalog.filter(c => {
      // Filtre catégorie
      if (this.activeFilter.category !== 'all') {
        const cCat = (c.category || '').toLowerCase();
        const fCat = this.activeFilter.category.toLowerCase();
        if (cCat !== fCat && !cCat.includes(fCat) && !fCat.includes(cCat)) {
          return false;
        }
      }
      // Filtre difficulté
      if (this.activeFilter.difficulty !== 'all') {
        const cDiff = (c.difficulty || '').toLowerCase();
        const fDiff = this.activeFilter.difficulty.toLowerCase();
        if (cDiff !== fDiff) return false;
      }
      // Filtre statut
      if (this.activeFilter.status !== 'all') {
        const cStat = c.status || 'not_started';
        if (cStat !== this.activeFilter.status) return false;
      }
      // Filtre type
      if (this.activeFilter.type !== 'all') {
        const isB2r = (c.machine_type === 'machine' || (c.id || '').startsWith('b2r-'));
        if (this.activeFilter.type === 'machine' && !isB2r) return false;
        if (this.activeFilter.type === 'room' && isB2r) return false;
      }
      // Recherche textuelle
      if (this.activeFilter.search) {
        const query = this.activeFilter.search.toLowerCase();
        const inTitle = (c.title || '').toLowerCase().includes(query);
        const inDesc = (c.description || '').toLowerCase().includes(query);
        const inOrg = (c.organization || '').toLowerCase().includes(query);
        const inCve = (c.cve || '').toLowerCase().includes(query);
        const inMono = (c.monogram || '').toLowerCase().includes(query);
        const inTags = (c.tags || []).some(t => t.toLowerCase().includes(query));
        const inTools = (c.recommended_tools || []).some(t => t.toLowerCase().includes(query));
        if (!inTitle && !inDesc && !inOrg && !inCve && !inMono && !inTags && !inTools) return false;
      }
      return true;
    });
  }

  renderChallengeCards() {
    const list = this.getFilteredChallenges();
    if (list.length === 0) {
      return this.renderEmptyState();
    }

    return list.map(c => {
      const isSolved = c.status === 'solved';
      const isInProgress = c.status === 'in_progress';
      const diffClass = `diff-${this.mapDifficultyClass(c.difficulty)}`;
      const completedTasks = c.completed_task_count || 0;
      const totalTasks = c.task_count || 1;
      const progressPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      return `
        <div class="training-card with-poster ${isSolved ? 'solved' : (isInProgress ? 'in-progress' : '')}" role="article">
          <!-- Miniature Vectorielle 16:9 DÉDIÉE -->
          <div class="room-thumb-poster cursor-pointer" onclick="window.trainingSystem.openRoom('${c.id}')">
            ${CyberThumbnailEngine.render(c)}
          </div>

          <!-- Corps de la Carte -->
          <div class="card-body font-mono">
            <!-- Haut de carte : Catégorie & Badge difficulté -->
            <div class="flex items-center justify-between mb-2.5">
              <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <span class="w-3.5 h-3.5 text-cyan-400">${this.getCategoryIcon(c.category)}</span>
                <span>${c.category}</span>
              </span>
              <div class="flex items-center gap-1.5">
                ${this.renderDiffMeter(c.difficulty)}
                <span class="diff-badge ${diffClass} text-[9px] py-0.5 px-1.5">
                  ${this.getDifficultyLabel(c.difficulty)}
                </span>
              </div>
            </div>

            <!-- Titre & Organisation -->
            <h4 class="text-sm font-black text-white hover:text-cyan-300 transition-colors line-clamp-1 mb-1 font-heading cursor-pointer" onclick="window.trainingSystem.openRoom('${c.id}')">
              ${this.escapeHtml(c.title)}
            </h4>
            <div class="text-[10px] text-cyan-400 font-bold mb-2 flex items-center gap-1">
              <span>Cible :</span>
              <span class="text-slate-300">${this.escapeHtml(c.organization || 'Entreprise Cible')}</span>
              ${c.cve ? `<span class="text-rose-400 ml-auto font-mono text-[9px]">[${c.cve}]</span>` : ''}
            </div>

            <!-- Description -->
            <p class="text-[11px] text-slate-400 leading-relaxed line-clamp-2 flex-1 mb-3.5 font-sans">
              ${this.escapeHtml(c.narrative_story || c.description || '')}
            </p>

            <!-- Tags & Outils recommandés -->
            <div class="flex flex-wrap gap-1 mb-4">
              ${(c.recommended_tools || []).slice(0, 3).map(tool => `
                <span class="text-[9px] font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-300">
                  ${this.escapeHtml(tool)}
                </span>
              `).join('')}
            </div>

            <!-- Barre de complétion de la room -->
            <div class="space-y-1 mb-3.5">
              <div class="flex items-center justify-between text-[10px] text-slate-400">
                <span>Progression : ${completedTasks}/${totalTasks} tâche${totalTasks > 1 ? 's' : ''}</span>
                <span class="text-cyan-400 font-bold">${progressPct}%</span>
              </div>
              <div class="h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800/80">
                <div class="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full" style="width: ${progressPct}%"></div>
              </div>
            </div>

            <!-- Bas de carte : Points & Bouton CTA -->
            <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between mt-auto">
              <span class="text-xs font-black text-amber-400 flex items-center gap-1">
                <span>💎</span>
                <span>${c.points} pts</span>
              </span>

              <button 
                onclick="window.trainingSystem.openRoom('${c.id}')"
                class="btn-mini-3d ${isSolved ? 'btn-mini-green' : (isInProgress ? 'btn-mini-cyan' : 'btn-mini-slate')} py-1.5 px-3.5 text-[10.5px]"
              >
                ${isSolved ? '✓ Pwned (Revoir)' : (isInProgress ? 'Continuer' : 'Infiltrer')}
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // ==========================================================================
  // MATRICE TACTIQUE (TABLEAU HACKTHEBOX DENSE & AUDIT)
  // ==========================================================================
  renderMatrixTable() {
    const list = this.getFilteredChallenges();
    if (list.length === 0) {
      return this.renderEmptyState();
    }

    return `
      <div class="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        <div class="overflow-x-auto">
          <table class="tactical-matrix-table">
            <thead>
              <tr>
                <th style="width: 50px;">STATUT</th>
                <th>MACHINE / ROOM</th>
                <th style="width: 85px;">OS</th>
                <th>ORGANISATION CIBLE</th>
                <th style="width: 120px;">CATÉGORIE</th>
                <th style="width: 110px;">CVE / TECH</th>
                <th style="width: 140px;">DIFFICULTÉ</th>
                <th style="width: 110px;">ÉVALUATION</th>
                <th style="width: 80px;">POINTS</th>
                <th style="width: 100px; text-align: right;">ACTION</th>
              </tr>
            </thead>
            <tbody>
              ${list.map(c => {
                const isSolved = c.status === 'solved';
                const mono = (c.monogram || c.id.substring(0, 4)).toUpperCase();
                const os = c.target_os || 'Linux';
                return `
                  <tr class="${isSolved ? 'solved-row' : ''}">
                    <td>
                      ${isSolved 
                        ? `<span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-400 font-black text-xs" title="Machine Complétée (PWNED)">✓</span>`
                        : `<span class="inline-block w-2.5 h-2.5 rounded-full bg-slate-700 ml-1.5" title="Non Résolu"></span>`
                      }
                    </td>
                    <td>
                      <div class="flex items-center gap-2.5">
                        <span class="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-300 font-bold text-[10px]">
                          [${mono}]
                        </span>
                        <div>
                          <a href="javascript:void(0)" onclick="window.trainingSystem.openRoom('${c.id}')" class="font-black text-white hover:text-cyan-400 transition-colors">
                            ${this.escapeHtml(c.title)}
                          </a>
                          <div class="text-[9.5px] text-slate-500 font-mono">
                            ${c.machine_type === 'machine' ? 'Machine 2-Flags' : 'Challenge Room'} • ${c.duration_min || 45}m
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span class="px-2 py-0.5 rounded bg-slate-900 text-slate-300 text-[10px] font-bold border border-slate-800">
                        ${os}
                      </span>
                    </td>
                    <td>
                      <span class="text-slate-300 font-sans text-xs">
                        ${this.escapeHtml(c.organization || 'CyberLab Target')}
                      </span>
                    </td>
                    <td>
                      <span class="text-[10px] text-slate-400 font-bold uppercase">
                        ${c.category}
                      </span>
                    </td>
                    <td>
                      ${c.cve ? `
                        <span class="px-1.5 py-0.5 rounded bg-rose-950/60 border border-rose-900/60 text-rose-300 font-mono text-[9.5px]">
                          ${c.cve}
                        </span>
                      ` : `
                        <span class="text-slate-600 font-mono text-[9px]">—</span>
                      `}
                    </td>
                    <td>
                      <div class="flex items-center gap-2">
                        ${this.renderDiffMeter(c.difficulty)}
                        <span class="text-[10px] text-slate-400">${this.getDifficultyLabel(c.difficulty)}</span>
                      </div>
                    </td>
                    <td>
                      <span class="text-slate-300 text-[11px] font-bold">
                        ★ ${(c.rating || 4.9).toFixed(1)} <span class="text-slate-500 font-normal text-[10px]">(${(c.solves || 1200) >= 1000 ? ((c.solves || 1200)/1000).toFixed(1) + 'k' : (c.solves || 1200)})</span>
                      </span>
                    </td>
                    <td>
                      <span class="text-amber-400 font-black text-xs">
                        ${c.points} pts
                      </span>
                    </td>
                    <td style="text-align: right;">
                      <button 
                        onclick="window.trainingSystem.openRoom('${c.id}')"
                        class="btn-mini-3d ${isSolved ? 'btn-mini-green' : 'btn-mini-cyan'} py-1 px-2.5 text-[10px]"
                      >
                        ${isSolved ? 'Revoir' : 'Pwn'}
                      </button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // PARCOURS D'APPRENTISSAGE CERTIFIANTS (LEARNING PATHS)
  // ==========================================================================
  renderPathsView() {
    return `
      <div class="space-y-6 font-mono">
        <div class="p-4 bg-slate-900/60 rounded-xl border border-slate-800 text-xs text-slate-300">
          Chaque parcours regroupe une série logique de labs progressifs permettant de valider un badge certifiant officiel.
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${this.learningPaths.map(p => this.renderPathDetailedCard(p)).join('')}
        </div>
      </div>
    `;
  }

  renderPathDetailedCard(path) {
    const rawIds = JSON.parse(path.challenge_ids || '[]');
    const matchingChallenges = this.catalog.filter(c => rawIds.includes(c.id));
    const completedCount = matchingChallenges.filter(c => c.status === 'solved').length;
    const pct = matchingChallenges.length > 0 ? Math.round((completedCount / matchingChallenges.length) * 100) : 0;

    return `
      <div class="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 hover:border-cyan-500/50 transition-all font-mono space-y-4">
        <div class="flex items-center justify-between">
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-cyan-950/80 text-cyan-400 border border-cyan-800/80">
            FILIÈRE OFFICIELLE
          </span>
          <span class="text-xs font-bold text-amber-400">${path.difficulty.toUpperCase()}</span>
        </div>

        <div>
          <h4 class="text-base font-black text-white">${this.escapeHtml(path.title)}</h4>
          <p class="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed font-sans">${this.escapeHtml(path.description)}</p>
        </div>

        <div class="space-y-1.5">
          <div class="flex items-center justify-between text-[11px] text-slate-400">
            <span>Progression : ${completedCount}/${matchingChallenges.length} labs</span>
            <span class="text-cyan-400 font-bold">${pct}%</span>
          </div>
          <div class="h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div class="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full" style="width: ${pct}%"></div>
          </div>
        </div>

        <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <div class="flex items-center gap-1.5 text-xs text-amber-300 font-bold">
            <span>🎖️</span>
            <span>${this.escapeHtml(path.badge_reward || 'Certificat Pro')}</span>
          </div>
          <button 
            onclick="window.trainingSystem.applyPathFilter('${path.id}')"
            class="btn-mini-3d btn-mini-cyan py-1 px-3 text-[10px]"
          >
            Filtrer ces labs &rarr;
          </button>
        </div>
      </div>
    `;
  }

  renderEmptyState() {
    return `
      <div class="col-span-full p-10 text-center bg-slate-900/40 rounded-2xl border border-slate-800 font-mono">
        <div class="w-12 h-12 mx-auto rounded-2xl bg-slate-800/80 text-slate-400 flex items-center justify-center mb-3 text-xl">
          🔍
        </div>
        <h4 class="text-sm font-black text-slate-300">Aucun lab ne correspond à tes critères de filtrage</h4>
        <p class="text-xs text-slate-500 mt-1 font-sans">Réinitialise ta recherche ou sélectionne une autre catégorie pour explorer le catalogue.</p>
        <button onclick="window.trainingSystem.resetFilters()" class="btn-mini-3d btn-mini-cyan mt-4">
          Réinitialiser les filtres
        </button>
      </div>
    `;
  }

  attachHubEvents() {
    const searchInput = document.getElementById('training-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.activeFilter.search = e.target.value;
        const mount = document.getElementById('training-view-mount');
        if (mount) mount.innerHTML = this.renderActiveViewContent();
      });
    }

    const diffSelect = document.getElementById('filter-difficulty');
    if (diffSelect) {
      diffSelect.addEventListener('change', (e) => {
        this.activeFilter.difficulty = e.target.value;
        const mount = document.getElementById('training-view-mount');
        if (mount) mount.innerHTML = this.renderActiveViewContent();
      });
    }

    const statusSelect = document.getElementById('filter-status');
    if (statusSelect) {
      statusSelect.addEventListener('change', (e) => {
        this.activeFilter.status = e.target.value;
        const mount = document.getElementById('training-view-mount');
        if (mount) mount.innerHTML = this.renderActiveViewContent();
      });
    }

    const typeSelect = document.getElementById('filter-type');
    if (typeSelect) {
      typeSelect.addEventListener('change', (e) => {
        this.activeFilter.type = e.target.value;
        const mount = document.getElementById('training-view-mount');
        if (mount) mount.innerHTML = this.renderActiveViewContent();
      });
    }
  }

  setCategoryFilter(catId) {
    this.activeFilter.category = catId;
    this.renderHub();
  }

  applyPathFilter(pathId) {
    const path = this.learningPaths.find(p => p.id === pathId);
    if (path) {
      if (path.id === 'web-beginner') this.setCategoryFilter('Web');
      else if (path.id === 'soc-forensics') this.setCategoryFilter('Forensics');
      else if (path.id === 'crypto-osint-core') this.setCategoryFilter('Crypto');
      else if (path.id === 'systems-reversing') this.setCategoryFilter('Linux');
      else if (path.id === 'pwn-binary') this.setCategoryFilter('Pwn');
      else if (path.id === 'ad-enterprise') this.setCategoryFilter('Windows');
      else if (path.id === 'cloud-container') this.setCategoryFilter('Cloud');
      else if (path.id === 'master-boot2root') this.setCategoryFilter('Boot2Root');
      else this.setCategoryFilter('all');
    }
    this.switchViewMode('grid');
  }

  resetFilters() {
    this.activeFilter = {
      category: 'all',
      difficulty: 'all',
      status: 'all',
      type: 'all',
      search: ''
    };
    this.renderHub();
  }

  // ==========================================================================
  // ROOM IMMERSIVE STYLE TRYHACKME / HACKTHEBOX
  // ==========================================================================
  async openRoom(challengeId) {
    try {
      if (window.cyberAudio) window.cyberAudio.playTactileClick();
      
      const res = await fetch(`/api/training/challenge/${challengeId}`);
      if (!res.ok) throw new Error('Impossible de charger la room');
      
      const data = await res.json();
      this.activeChallenge = data.room || data.challenge || data;
      this.activeRoomTab = 'tasks';
      this.expandedTaskId = this.activeChallenge.tasks[0]?.id || null;
      this.activeInstance = this.activeChallenge.instance || null;

      const modal = document.getElementById('modal-training-room');
      if (modal) modal.classList.remove('hidden');

      this.renderRoom();
      if (this.activeInstance && (this.activeInstance.status === 'RUNNING' || this.activeInstance.status === 'running')) {
        this.startCountdownTimer();
      }
    } catch (e) {
      console.error('Erreur ouverture room:', e);
      alert('Erreur lors de l\'ouverture du challenge : ' + e.message);
    }
  }

  closeRoom() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    const modal = document.getElementById('modal-training-room');
    if (modal) modal.classList.add('hidden');
    
    this.activeChallenge = null;
    this.loadCatalog().then(() => this.renderHub());
  }

  renderRoom() {
    const mount = document.getElementById('training-room-mount');
    if (!mount || !this.activeChallenge) return;

    const c = this.activeChallenge;
    const diffClass = `diff-${this.mapDifficultyClass(c.difficulty)}`;
    const allTasksCompleted = c.tasks.every(t => t.is_completed);
    const mono = (c.monogram || c.id.substring(0, 4)).toUpperCase();
    const org = c.organization || 'Entreprise Cible';

    mount.innerHTML = `
      <!-- EN-TÊTE DE LA ROOM -->
      <div class="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4 font-mono">
        <div class="flex items-center gap-3.5 min-w-0">
          <div class="w-11 h-11 rounded-xl bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center text-cyan-300 font-black text-sm flex-shrink-0">
            [${mono}]
          </div>
          <div class="min-w-0">
            <div class="flex items-center gap-2">
              <span class="diff-badge ${diffClass}">${this.getDifficultyLabel(c.difficulty)}</span>
              <span class="text-[10px] text-slate-400 uppercase">${c.category} • ${c.points} PTS • ${c.duration_min} MIN</span>
              <span class="text-[10px] text-cyan-400 font-bold hidden sm:inline">• ${org}</span>
            </div>
            <h2 class="text-base sm:text-lg font-black text-white font-heading truncate mt-0.5">
              ${this.escapeHtml(c.title)}
            </h2>
          </div>
        </div>

        <button onclick="window.trainingSystem.closeRoom()" class="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors flex-shrink-0" title="Fermer la Room">
          ✕
        </button>
      </div>

      <!-- CORPS DE LA ROOM : TARGET BOX & ONGLET -->
      <div class="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        <!-- COLONNE GAUCHE / PANNEAU DE CONTRÔLE MACHINE (TARGET BOX) -->
        <div class="w-full md:w-80 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-950/70 p-4 sm:p-5 overflow-y-auto space-y-4 font-mono">
          
          <!-- LIVE TARGET BOX -->
          <div id="room-target-box-mount">
            ${this.renderTargetBox()}
          </div>

          <!-- Artefacts / Fichiers à télécharger -->
          ${(c.downloadable_files && c.downloadable_files.length > 0) ? `
            <div class="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2">
              <div class="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <span>📦</span>
                <span>Artefacts d'Investigation</span>
              </div>
              <div class="space-y-1.5">
                ${c.downloadable_files.map(f => `
                  <a href="${f.url}" download class="flex items-center justify-between p-2 rounded-lg bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-xs text-cyan-400 transition-colors">
                    <span class="truncate font-mono">${this.escapeHtml(f.name)}</span>
                    <span class="text-[10px] text-slate-400 font-mono">${f.size || ''}</span>
                  </a>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Boîte à outils recommandée -->
          <div class="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
            <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Outils Conseillés</div>
            <div class="flex flex-wrap gap-1">
              ${(c.recommended_tools || []).map(tool => `
                <span class="text-[10px] font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-300">
                  ${this.escapeHtml(tool)}
                </span>
              `).join('')}
            </div>
          </div>

          <!-- Indices Globaux Déblocables -->
          ${(c.hints && c.hints.length > 0) ? `
            <div class="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2.5">
              <div class="flex items-center justify-between">
                <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Indices Déblocables</div>
                <span class="text-[10px] text-emerald-400">${c.hints.filter(h => h.is_unlocked).length}/${c.hints.length} débloqué${c.hints.length > 1 ? 's' : ''}</span>
              </div>
              <div class="space-y-2">
                ${c.hints.map(h => `
                  <div class="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-xs">
                    <div class="flex items-center justify-between mb-1">
                      <span class="font-bold text-slate-300 text-[11px]">${this.escapeHtml(h.title)}</span>
                      ${!h.is_unlocked ? `
                        <button onclick="window.trainingSystem.unlockHint('${c.id}', ${h.index})" class="btn-mini-3d btn-mini-slate py-0.5 px-2 text-[9px] flex items-center gap-1">
                          <span class="text-emerald-400">${h.cost} 💎</span>
                          <span>Débloquer</span>
                        </button>
                      ` : `
                        <span class="text-[9px] text-emerald-400 font-bold">DÉBLOQUÉ</span>
                      `}
                    </div>
                    ${h.is_unlocked ? `
                      <p class="text-[11px] text-cyan-200/90 leading-relaxed font-sans mt-1 p-2 bg-cyan-950/40 rounded border border-cyan-900/50">
                        ${this.escapeHtml(h.content)}
                      </p>
                    ` : `
                      <p class="text-[10px] text-slate-500 italic">Contenu masqué. Débloque avec tes gemmes.</p>
                    `}
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>

        <!-- COLONNE DROITE / ESPACE DE TRAVAIL & ONGLETS -->
        <div class="flex-1 flex flex-col bg-slate-900/40 overflow-hidden font-mono">
          <!-- Barre d'onglets de navigation -->
          <div class="bg-slate-950/80 px-4 py-2 border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
            <button 
              onclick="window.trainingSystem.switchRoomTab('tasks')"
              class="px-3.5 py-1.5 rounded-lg font-bold transition flex items-center gap-2 ${this.activeRoomTab === 'tasks' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}"
            >
              <span>📋</span>
              <span>Tâches & Questions (${c.tasks.filter(t => t.is_completed).length}/${c.tasks.length})</span>
            </button>

            ${this.getLocalWebTarget(c.id) ? `
              <button 
                onclick="window.trainingSystem.switchRoomTab('browser')"
                class="px-3.5 py-1.5 rounded-lg font-bold transition flex items-center gap-2 ${this.activeRoomTab === 'browser' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}"
              >
                <span>🌐</span>
                <span>Navigateur Intégré (Split-Screen)</span>
              </button>
            ` : ''}

            <button 
              onclick="window.trainingSystem.switchRoomTab('scenario')"
              class="px-3.5 py-1.5 rounded-lg font-bold transition flex items-center gap-2 ${this.activeRoomTab === 'scenario' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}"
            >
              <span>🎯</span>
              <span>Scénario & Contexte</span>
            </button>

            <button 
              onclick="window.trainingSystem.switchRoomTab('writeup')"
              class="px-3.5 py-1.5 rounded-lg font-bold transition flex items-center gap-2 ${this.activeRoomTab === 'writeup' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}"
            >
              <span>${allTasksCompleted ? '📖' : '🔒'}</span>
              <span>Writeup Solution ${allTasksCompleted ? '' : '(Verrouillé)'}</span>
            </button>
          </div>

          <!-- Contenu de l'onglet actif -->
          <div class="flex-1 p-5 overflow-y-auto" id="room-tab-content">
            ${this.renderRoomTabContent()}
          </div>
        </div>
      </div>
    `;
  }

  getLocalWebTarget(chId) {
    if (!chId) return null;
    const cat = (this.activeChallenge?.category || '').toLowerCase();
    if (chId.startsWith('web-01')) return `${window.location.origin}/targets/training/web-01/`;
    if (chId.startsWith('web-02')) return `${window.location.origin}/targets/training/web-02/`;
    if (chId.startsWith('web-03')) return `${window.location.origin}/targets/training/web-03/`;
    if (chId.startsWith('web-04')) return `${window.location.origin}/targets/training/web-04/`;
    if (chId.startsWith('web-05')) return `${window.location.origin}/targets/training/web-05/`;
    if (chId.startsWith('web-06')) return `${window.location.origin}/targets/training/web-06/`;
    if (chId.startsWith('web-07')) return `${window.location.origin}/targets/training/web-07/`;
    if (chId.startsWith('web-08')) return `${window.location.origin}/targets/training/web-08/`;
    if (chId.startsWith('web-09')) return `${window.location.origin}/targets/training/web-09/`;
    if (chId.startsWith('web-10')) return `${window.location.origin}/targets/training/web-10/`;
    if (chId.startsWith('api-01')) return `${window.location.origin}/targets/training/api-01/`;
    if (cat.includes('web') || cat.includes('api') || cat.includes('boot2root') || chId.startsWith('b2r-') || chId.startsWith('cloud-')) {
      return `${window.location.origin}/targets/training/${chId}/`;
    }
    return null;
  }

  navigateInAppBrowser(url) {
    const iframe = document.getElementById('target-in-app-iframe');
    const input = document.getElementById('browser-in-app-url');
    if (iframe && url) {
      iframe.src = url;
      if (input) input.value = url;
    }
  }

  renderTargetBox() {
    const inst = this.activeInstance;
    const isRunning = inst && (inst.status === 'RUNNING' || inst.status === 'running');

    if (!isRunning) {
      return `
        <div class="live-target-box space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-black text-slate-300 flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-slate-600"></span>
              <span>MACHINE VIRTUELLE</span>
            </span>
            <span class="text-[10px] text-slate-400">HORS LIGNE</span>
          </div>
          <p class="text-[11px] text-slate-400 leading-relaxed font-sans">
            Démarre l'environnement d'entraînement dédié pour interagir avec les cibles du lab.
          </p>
          <button 
            onclick="window.trainingSystem.startInstance('${this.activeChallenge.id}')"
            class="w-full btn-mini-3d btn-mini-green py-2.5"
          >
            <span>▶</span>
            <span>Démarrer la Machine</span>
          </button>
        </div>
      `;
    }

    const ip = inst.virtual_ip || inst.target_ip || '10.10.1.10';
    const localWebTarget = this.getLocalWebTarget(this.activeChallenge?.id);

    return `
      <div class="live-target-box active space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-xs font-black text-emerald-400 flex items-center gap-2">
            <span class="radar-ping"><span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span></span>
            <span>MACHINE EN LIGNE</span>
          </span>
          <span id="target-countdown-display" class="text-xs font-black text-amber-400">--:--</span>
        </div>

        <!-- Accès Direct & URL Réelle du Lab -->
        <div class="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5">
          ${localWebTarget ? `
            <div class="space-y-1.5">
              <div class="flex items-center justify-between text-[10px]">
                <span class="text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <span>🟢</span>
                  <span>URL RÉELLE DU LAB :</span>
                </span>
                <span class="text-[10px] text-emerald-400 font-mono font-bold">127.0.0.1:3333</span>
              </div>
              <div class="flex items-center justify-between bg-slate-900 px-2.5 py-1.5 rounded-lg border border-emerald-950/80">
                <code class="text-xs font-black text-emerald-300 select-all font-mono truncate mr-2">${localWebTarget}</code>
                <button onclick="navigator.clipboard.writeText('${localWebTarget}'); alert('URL copiée dans le presse-papier !');" class="text-slate-400 hover:text-white p-1 rounded transition" title="Copier l'URL">
                  📋
                </button>
              </div>
            </div>

            <div class="pt-2 border-t border-slate-800/80 space-y-2">
              <a href="${localWebTarget}" target="_blank" class="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 text-xs font-black transition-all shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 group font-mono">
                <span>🌐</span>
                <span>ACCÉDER AU LAB DANS CHROME</span>
                <span class="group-hover:translate-x-1 transition-transform">↗</span>
              </a>

              <button onclick="window.trainingSystem.switchRoomTab('browser')" class="w-full py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-bold transition flex items-center justify-center gap-1.5 font-mono">
                <span>🖥️</span>
                <span>Navigateur CTF Split-Screen Intégré</span>
              </button>

              <div class="p-2 rounded-lg bg-slate-900/90 border border-slate-800 text-[10px] text-slate-400 leading-snug font-sans space-y-1">
                <div class="flex items-center justify-between text-slate-500 font-mono">
                  <span>IP VPN Virtuelle (simulation CTF) :</span>
                  <code class="text-cyan-400 font-bold">${ip}</code>
                </div>
                <div class="text-[9.5px] text-emerald-400 font-medium">
                  💡 Note : Le lab est hébergé localement sur ton PC. Clique sur le bouton vert ci-dessus pour ouvrir le site. Ne tape pas l'adresse 10.10.x.x directement dans ton navigateur Windows.
                </div>
              </div>
            </div>
          ` : `
            <div class="flex items-center justify-between text-[10px]">
              <span class="text-slate-400 font-bold uppercase tracking-wider">MACHINE CTF :</span>
              <span class="text-cyan-400 font-mono font-bold bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/60">${ip}</span>
            </div>
            <div class="text-[10px] text-slate-300 pt-1 border-t border-slate-800 leading-relaxed font-sans">
              📦 Challenge basé sur artefacts & fichiers à analyser (PCAP, binaire, dump). Télécharge les fichiers ci-dessous.
            </div>
          `}
        </div>

        <!-- Boutons d'Action (Prolonger +15m / Arrêter) -->
        <div class="grid grid-cols-2 gap-2 pt-1">
          <button onclick="window.trainingSystem.renewInstance('${this.activeChallenge.id}')" class="btn-mini-3d btn-mini-cyan py-1.5 text-[10px]" title="Ajouter 15 minutes">
            <span>+15 min</span>
          </button>
          <button onclick="window.trainingSystem.stopInstance('${this.activeChallenge.id}')" class="btn-mini-3d btn-mini-rose py-1.5 text-[10px]" title="Terminer l'instance">
            <span>Arrêter</span>
          </button>
        </div>
      </div>
    `;
  }

  renderRoomTabContent() {
    if (this.activeRoomTab === 'browser') {
      const targetUrl = this.getLocalWebTarget(this.activeChallenge?.id);
      if (!targetUrl) {
        return `
          <div class="p-8 text-center text-slate-400 font-sans">
            <p>Ce challenge est un lab basé sur des artefacts/fichiers téléchargeables (analyse pcap, dump mémoire, binaire). Aucune application web cible n'est requise.</p>
          </div>
        `;
      }
      return `
        <div class="flex flex-col h-[650px] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
          <!-- Mini navigateur Header / URL Bar -->
          <div class="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between gap-3 text-xs font-mono">
            <div class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
              <span class="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
              <span class="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
            </div>
            
            <div class="flex-1 flex items-center gap-2 max-w-2xl bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300 text-[11px]">
              <span class="text-emerald-400 font-bold">HTTP</span>
              <span class="text-slate-500">|</span>
              <input id="browser-in-app-url" type="text" value="${targetUrl}" class="flex-1 bg-transparent text-slate-200 outline-none" onkeydown="if(event.key==='Enter') window.trainingSystem.navigateInAppBrowser(this.value)">
              <button onclick="window.trainingSystem.navigateInAppBrowser(document.getElementById('browser-in-app-url').value)" class="text-slate-400 hover:text-white px-1 font-bold" title="Charger l'URL">
                GO
              </button>
            </div>

            <div class="flex items-center gap-2">
              <button onclick="document.getElementById('target-in-app-iframe').src = document.getElementById('target-in-app-iframe').src" class="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white" title="Actualiser la page">
                🔄
              </button>
              <a href="${targetUrl}" target="_blank" class="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-[11px] flex items-center gap-1.5 transition">
                <span>Plein écran</span>
                <span>↗</span>
              </a>
            </div>
          </div>

          <!-- Iframe du site cible -->
          <div class="flex-1 bg-white relative">
            <iframe id="target-in-app-iframe" src="${targetUrl}" class="w-full h-full border-0"></iframe>
          </div>
        </div>
      `;
    }

    if (this.activeRoomTab === 'scenario') {
      const c = this.activeChallenge;
      return `
        <div class="p-6 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-5 font-mono">
          <div class="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span class="text-[10px] font-black uppercase text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">DOSSIER DE MISSION CONFIDENTIEL</span>
              <h3 class="text-lg font-black text-white font-heading mt-1">${this.escapeHtml(c.title)}</h3>
              <div class="text-xs text-slate-400 font-sans mt-0.5">Organisation auditée : <strong class="text-slate-200">${this.escapeHtml(c.organization || 'Client')}</strong></div>
            </div>
            <div class="text-right">
              <span class="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300">
                ${c.target_os || 'Linux'}
              </span>
            </div>
          </div>

          <div class="space-y-2">
            <h4 class="text-xs font-black text-emerald-400 uppercase tracking-wider">Contexte Opérationnel & Backstory</h4>
            <p class="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">${this.escapeHtml(c.narrative_story || c.description)}</p>
          </div>

          <div class="pt-4 border-t border-slate-800 space-y-3">
            <h4 class="text-xs font-black text-cyan-400 uppercase tracking-wider">Règles d'Engagement (ROE) & Objectifs</h4>
            <ul class="list-disc list-inside text-xs text-slate-300 space-y-2 leading-relaxed font-sans">
              ${c.tasks.map(t => `<li><strong class="text-white font-mono">${this.escapeHtml(t.title)}</strong> : ${this.escapeHtml(t.description)}</li>`).join('')}
            </ul>
          </div>
        </div>
      `;
    }

    if (this.activeRoomTab === 'writeup') {
      return `
        <div class="p-6 bg-slate-950/90 rounded-2xl border border-slate-800 space-y-4 font-mono">
          <div class="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span class="text-[10px] font-black uppercase text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">SOLUTION CERTIFIÉE</span>
              <h3 class="text-base font-black text-white font-heading mt-1">Writeup Pas-à-Pas d'Expert</h3>
            </div>
          </div>
          <div id="writeup-body-mount" class="writeup-content font-sans">
            Chargement du writeup officiel...
          </div>
        </div>
      `;
    }

    // Onglet par défaut : Tâches & Questions
    return `
      <div class="space-y-3 font-mono">
        ${this.activeChallenge.tasks.map((task, idx) => this.renderTaskCard(task, idx + 1)).join('')}
      </div>
    `;
  }

  renderTaskCard(task, taskNum) {
    const isCompleted = task.is_completed;
    const isExpanded = this.expandedTaskId === task.id;

    return `
      <div class="room-task-card ${isCompleted ? 'task-completed' : ''}" id="task-card-${task.id}">
        <!-- En-tête de la tâche -->
        <div class="room-task-header cursor-pointer" onclick="window.trainingSystem.toggleTaskAccordion('${task.id}')">
          <div class="flex items-center gap-3">
            <div class="w-6 h-6 rounded-lg ${isCompleted ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-900 text-slate-400 border border-slate-800'} flex items-center justify-center text-xs font-black">
              ${isCompleted ? '✓' : taskNum}
            </div>
            <div>
              <h4 class="text-xs font-black text-white">${this.escapeHtml(task.title)}</h4>
              <span class="text-[10px] text-slate-400">${task.points || 0} points • ${isCompleted ? '<span class="text-emerald-400 font-bold">RÉSOLUE</span>' : 'À résoudre'}</span>
            </div>
          </div>
          <span class="text-slate-400 text-xs transition-transform ${isExpanded ? 'rotate-180' : ''}">▼</span>
        </div>

        <!-- Corps de la tâche accordéon -->
        ${isExpanded ? `
          <div class="room-task-body space-y-4">
            <p class="text-xs text-slate-300 leading-relaxed font-sans">${this.escapeHtml(task.description)}</p>

            <!-- Champ de soumission de Flag -->
            <div class="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Flag de validation (Format: CYBERLAB{...})
              </label>
              ${isCompleted ? `
                <div class="flex items-center gap-2 p-2 bg-emerald-950/60 border border-emerald-800/80 rounded-lg text-emerald-300 text-xs font-mono font-bold">
                  <span>✓</span>
                  <span>Tâche résolue avec succès ! Flag validé.</span>
                </div>
              ` : `
                <div class="flex items-center gap-2">
                  <input 
                    type="text" 
                    id="input-flag-${task.id}"
                    placeholder="CYBERLAB{...}" 
                    class="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-cyan-300 font-mono focus:border-cyan-500 focus:outline-none"
                    onkeydown="if(event.key === 'Enter') window.trainingSystem.submitFlag('${task.id}')"
                  />
                  <button 
                    onclick="window.trainingSystem.submitFlag('${task.id}')"
                    class="btn-mini-3d btn-mini-cyan py-2 px-4"
                  >
                    Soumettre
                  </button>
                </div>
                <div id="flag-error-${task.id}" class="text-[11px] text-rose-400 font-bold hidden font-mono"></div>
              `}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  toggleTaskAccordion(taskId) {
    this.expandedTaskId = (this.expandedTaskId === taskId) ? null : taskId;
    const tabMount = document.getElementById('room-tab-content');
    if (tabMount && this.activeRoomTab === 'tasks') {
      tabMount.innerHTML = this.renderRoomTabContent();
    }
  }

  switchRoomTab(tabName) {
    const c = this.activeChallenge;
    const allCompleted = c.tasks.every(t => t.is_completed);

    if (tabName === 'writeup' && !allCompleted) {
      alert('🔒 Le Writeup est verrouillé ! Tu dois d\'abord résoudre toutes les tâches du lab pour consulter la solution détaillée.');
      return;
    }

    this.activeRoomTab = tabName;
    this.renderRoom();

    if (tabName === 'writeup') {
      this.fetchWriteup(c.id);
    }
  }

  // ==========================================================================
  // GESTION DES INSTANCES VIRTUELLES (START / STOP / RENEW)
  // ==========================================================================
  async startInstance(challengeId) {
    try {
      if (window.cyberAudio) window.cyberAudio.playTactileClick();
      const res = await fetch('/api/training/instance/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challenge_id: challengeId })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Erreur démarrage');
      }

      const data = await res.json();
      this.activeInstance = data.instance || data;
      const boxMount = document.getElementById('room-target-box-mount');
      if (boxMount) boxMount.innerHTML = this.renderTargetBox();

      this.startCountdownTimer();
    } catch (e) {
      alert('Impossible de lancer la machine : ' + e.message);
    }
  }

  async stopInstance(challengeId) {
    try {
      if (window.cyberAudio) window.cyberAudio.playTactileClick();
      await fetch('/api/training/instance/stop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challenge_id: challengeId })
      });

      if (this.timerInterval) clearInterval(this.timerInterval);
      this.activeInstance = null;

      const boxMount = document.getElementById('room-target-box-mount');
      if (boxMount) boxMount.innerHTML = this.renderTargetBox();
    } catch (e) {
      console.error('Erreur arrêt instance:', e);
    }
  }

  async renewInstance(challengeId) {
    try {
      if (window.cyberAudio) window.cyberAudio.playTactileClick();
      const res = await fetch('/api/training/instance/renew', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challenge_id: challengeId })
      });

      if (res.ok) {
        const data = await res.json();
        this.activeInstance = data.instance || data;
      }
    } catch (e) {
      console.error('Erreur renouvellement:', e);
    }
  }

  startCountdownTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);

    const updateTimer = () => {
      const display = document.getElementById('target-countdown-display');
      if (!display || !this.activeInstance) {
        clearInterval(this.timerInterval);
        return;
      }

      const expires = new Date(this.activeInstance.expires_at).getTime();
      const now = Date.now();
      const remainingSec = Math.max(0, Math.floor((expires - now) / 1000));

      if (remainingSec <= 0) {
        display.innerText = 'Expirée';
        display.classList.add('text-rose-500');
        clearInterval(this.timerInterval);
        this.activeInstance.status = 'EXPIRED';
        const boxMount = document.getElementById('room-target-box-mount');
        if (boxMount) boxMount.innerHTML = this.renderTargetBox();
        return;
      }

      const mins = Math.floor(remainingSec / 60);
      const secs = remainingSec % 60;
      display.innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

      if (remainingSec < 300) {
        display.classList.add('text-rose-400');
        display.classList.remove('text-amber-400');
      }
    };

    updateTimer();
    this.timerInterval = setInterval(updateTimer, 1000);
  }

  // ==========================================================================
  // SOUMISSION DE FLAG ET DÉBLOCAGE D'INDICES
  // ==========================================================================
  async submitFlag(taskId) {
    const input = document.getElementById(`input-flag-${taskId}`);
    const errBox = document.getElementById(`flag-error-${taskId}`);
    if (!input) return;

    const flagVal = input.value.trim();
    if (!flagVal) {
      if (errBox) {
        errBox.innerText = 'Veuillez renseigner un flag.';
        errBox.classList.remove('hidden');
      }
      return;
    }

    try {
      const res = await fetch('/api/training/submit-flag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challenge_id: this.activeChallenge.id,
          task_id: taskId,
          flag: flagVal
        })
      });

      const data = await res.json();

      if (res.ok && data.success && data.correct) {
        if (window.cyberAudio) window.cyberAudio.playVictory();
        if (window.confetti) {
          window.confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
        }

        const task = this.activeChallenge.tasks.find(t => t.id === taskId);
        if (task) task.is_completed = true;

        if (window.cyberApp) {
          window.cyberApp.state.xp += data.points_awarded || 0;
          window.cyberApp.renderHeaderWidgets();
          window.cyberApp.renderRightWidgets();
        }

        this.renderRoom();
      } else {
        if (window.cyberAudio) window.cyberAudio.playError();
        if (errBox) {
          errBox.innerText = data.error || 'Flag incorrect. Analyse bien les indices et les traces !';
          errBox.classList.remove('hidden');
        }
        input.classList.add('animate-shake', 'border-rose-500');
        setTimeout(() => input.classList.remove('animate-shake', 'border-rose-500'), 600);
      }
    } catch (e) {
      alert('Erreur réseau lors de la validation du flag : ' + e.message);
    }
  }

  async unlockHint(challengeId, hintIdx) {
    if (!confirm('Débloquer cet indice pour des Gemmes 💎 ?')) return;

    try {
      const res = await fetch('/api/training/unlock-hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challenge_id: challengeId,
          hint_index: hintIdx
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (window.cyberAudio) window.cyberAudio.playTactileClick();
        
        const hint = this.activeChallenge.hints?.find(h => h.index === hintIdx);
        if (hint) {
          hint.is_unlocked = true;
          hint.content = data.hint || data.content;
        }

        if (window.cyberApp && data.gems_remaining !== undefined) {
          window.cyberApp.state.gems = data.gems_remaining;
          window.cyberApp.renderHeaderWidgets();
          window.cyberApp.renderRightWidgets();
        }

        this.renderRoom();
      } else {
        alert(data.error || 'Gemmes insuffisantes ou erreur lors du déblocage.');
      }
    } catch (e) {
      alert('Erreur réseau : ' + e.message);
    }
  }

  async fetchWriteup(challengeId) {
    const mount = document.getElementById('writeup-body-mount');
    if (!mount) return;

    try {
      const res = await fetch(`/api/training/writeup/${challengeId}`);
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Writeup non accessible');
      }

      const data = await res.json();
      mount.innerHTML = this.renderMarkdown(data.writeup);
    } catch (e) {
      mount.innerHTML = `
        <div class="p-4 bg-rose-950/40 border border-rose-800 text-rose-300 rounded-xl text-xs font-mono">
          ${this.escapeHtml(e.message)}
        </div>
      `;
    }
  }

  // ==========================================================================
  // PARSER MARKDOWN LÉGER & SÉCURISÉ (ZÉRO DÉPENDANCE NPM)
  // ==========================================================================
  renderMarkdown(md) {
    if (!md) return '';

    let html = md;
    
    html = html.replace(/```([a-z0-9_-]*)\n([\s\S]*?)```/gm, (match, lang, code) => {
      return `<pre><code class="language-${lang}">${this.escapeHtml(code.trim())}</code></pre>`;
    });

    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/gims, '<ul>$1</ul>');

    html = html.replace(/\n\n/g, '<br><br>');

    return html;
  }

  // ==========================================================================
  // UTILITAIRES & ICÔNES
  // ==========================================================================
  mapDifficultyClass(diff) {
    const d = (diff || '').toLowerCase();
    if (d === 'beginner' || d === 'debutant') return 'debutant';
    if (d === 'easy' || d === 'facile') return 'facile';
    if (d === 'intermediate' || d === 'intermediaire') return 'intermediaire';
    if (d === 'hard' || d === 'difficile') return 'difficile';
    return 'insane';
  }

  getDifficultyLabel(diff) {
    const d = (diff || '').toLowerCase();
    if (d === 'beginner' || d === 'debutant') return 'Débutant';
    if (d === 'easy' || d === 'facile') return 'Facile';
    if (d === 'intermediate' || d === 'intermediaire') return 'Intermédiaire';
    if (d === 'hard' || d === 'difficile') return 'Difficile';
    return 'Insane';
  }

  getCategoryIcon(cat) {
    if (!window.CyberIcons) return '🛡️';
    const c = (cat || '').toLowerCase();
    if (c.includes('web')) return window.CyberIcons.get('globe', 'w-4 h-4') || '🌐';
    if (c.includes('osint')) return window.CyberIcons.get('compass', 'w-4 h-4') || '🧭';
    if (c.includes('crypto')) return window.CyberIcons.get('key', 'w-4 h-4') || '🔑';
    if (c.includes('forensics')) return window.CyberIcons.get('search', 'w-4 h-4') || '🔬';
    if (c.includes('réseau') || c.includes('reseau') || c.includes('network')) return window.CyberIcons.get('radar', 'w-4 h-4') || '📡';
    if (c.includes('linux') || c.includes('sys') || c.includes('server')) return window.CyberIcons.get('server', 'w-4 h-4') || '🐧';
    if (c.includes('windows') || c.includes('ad')) return '🪟';
    if (c.includes('reverse') || c.includes('pwn')) return window.CyberIcons.get('cpu', 'w-4 h-4') || '⚡';
    if (c.includes('api') || c.includes('mobile')) return window.CyberIcons.get('layers', 'w-4 h-4') || '🔌';
    if (c.includes('social') || c.includes('phish')) return window.CyberIcons.get('puzzle', 'w-4 h-4') || '🎣';
    if (c.includes('cloud') || c.includes('docker')) return '☁️';
    if (c.includes('boot2root') || c.includes('b2r')) return '🎯';
    return window.CyberIcons.get('shield', 'w-4 h-4') || '🛡️';
  }

  escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}

// Initialisation globale
window.trainingSystem = new TrainingSystem();

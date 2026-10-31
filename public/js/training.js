// ============================================================================
// CYBERRANGE PRO - ZONE D'ENTRAÎNEMENT OFFICIELLE (TRYHACKME / HACKTHEBOX STYLE)
// Design ultra-moderne, espacé, épuré, avec Sections Curatées, Avatars Dédiés,
// Terminal Linux Bash Interactif en direct (Web Console) & Split-Screen Cible
// ============================================================================

class CyberAvatarEngine {
  static getAvatar(c) {
    const cat = (c.category || '').toLowerCase();
    const id = (c.id || '').toLowerCase();
    const title = (c.title || '').toLowerCase();

    // 1. Détection par type de challenge spécifique (Iconographie signature THM)
    if (id.includes('pickle') || title.includes('pickle')) {
      return { bg: 'from-emerald-950 to-green-900 border-emerald-500/50 text-emerald-400', icon: '🥒' };
    }
    if (id.includes('rootme') || title.includes('rootme') || (id.includes('terminal') && cat.includes('linux'))) {
      return { bg: 'from-slate-900 to-slate-800 border-cyan-500/50 text-cyan-400', icon: '&gt;_' };
    }
    if (id.includes('bounty') || title.includes('bounty')) {
      return { bg: 'from-red-950 to-amber-900 border-red-500/50 text-amber-300', icon: '🏴‍☠️' };
    }
    if (id.includes('lazy') || title.includes('lazy')) {
      return { bg: 'from-blue-950 to-slate-900 border-blue-500/50 text-blue-300', icon: '💼' };
    }
    if (id.includes('itsy') || title.includes('itsy')) {
      return { bg: 'from-indigo-950 to-purple-900 border-indigo-500/50 text-indigo-300', icon: '💎' };
    }
    if (id.includes('sudo') || title.includes('sudo')) {
      return { bg: 'from-purple-950 to-indigo-900 border-purple-500/50 text-purple-300', icon: '🕵️' };
    }
    if (id.includes('cap') || title.includes('capabilities') || title.includes('setuid')) {
      return { bg: 'from-amber-950 to-yellow-900 border-amber-500/50 text-amber-400', icon: '🐧' };
    }
    if (id.includes('suid') || title.includes('suid')) {
      return { bg: 'from-rose-950 to-amber-900 border-rose-500/50 text-rose-400', icon: '⚙️' };
    }
    if (id.includes('b2r') || cat.includes('boot2root') || id.includes('enterprise-alpha')) {
      return { bg: 'from-rose-950 to-red-900 border-rose-500/50 text-rose-400', icon: '🏰' };
    }
    if (id.includes('wireshark') || id.includes('pcap') || id.includes('network') || cat.includes('réseau')) {
      return { bg: 'from-cyan-950 to-blue-900 border-cyan-500/50 text-cyan-400', icon: '📡' };
    }
    if (id.includes('phish') || title.includes('phish')) {
      return { bg: 'from-teal-950 to-emerald-900 border-teal-500/50 text-teal-400', icon: '🎣' };
    }
    if (id.includes('snapped') || title.includes('snapped')) {
      return { bg: 'from-blue-950 to-sky-900 border-blue-500/50 text-blue-400', icon: '🪪' };
    }
    if (id.includes('ad-') || id.includes('kerberos') || title.includes('active directory') || cat.includes('windows')) {
      return { bg: 'from-violet-950 to-purple-900 border-violet-500/50 text-violet-400', icon: '🌲' };
    }
    if (id.includes('docker') || id.includes('container') || id.includes('k8s') || cat.includes('cloud')) {
      return { bg: 'from-sky-950 to-cyan-900 border-sky-500/50 text-sky-400', icon: '🐳' };
    }
    if (id.includes('memory') || id.includes('volatility') || id.includes('lsass') || cat.includes('forensic')) {
      return { bg: 'from-fuchsia-950 to-purple-900 border-fuchsia-500/50 text-fuchsia-400', icon: '🧠' };
    }
    if (id.includes('siem') || id.includes('soc') || id.includes('suricata') || cat.includes('blue')) {
      return { bg: 'from-blue-950 to-indigo-900 border-blue-500/50 text-blue-400', icon: '🛡️' };
    }
    if (id.includes('rop') || id.includes('bof') || id.includes('heap') || cat.includes('pwn')) {
      return { bg: 'from-red-950 to-rose-900 border-red-500/50 text-red-400', icon: '⚡' };
    }
    if (id.includes('reverse') || id.includes('crackme') || cat.includes('reverse')) {
      return { bg: 'from-pink-950 to-rose-900 border-pink-500/50 text-pink-400', icon: '🧩' };
    }
    if (id.includes('crypto') || id.includes('rsa') || id.includes('aes') || cat.includes('crypto')) {
      return { bg: 'from-amber-950 to-orange-900 border-amber-500/50 text-amber-400', icon: '🔑' };
    }
    if (id.includes('sqli') || id.includes('sql') || id.includes('xss') || cat.includes('web') || cat.includes('api')) {
      return { bg: 'from-emerald-950 to-teal-900 border-emerald-500/50 text-emerald-400', icon: '&lt;/&gt;' };
    }
    if (id.includes('osint') || title.includes('osint')) {
      return { bg: 'from-blue-950 to-indigo-900 border-blue-500/50 text-blue-400', icon: '🧭' };
    }

    // Défaut par OS
    const os = (c.target_os || 'Linux').toLowerCase();
    if (os.includes('win')) {
      return {
        bg: 'from-blue-950 to-sky-900 border-blue-500/50 text-blue-400',
        icon: '🪟'
      };
    }
    return {
      bg: 'from-slate-900 to-slate-800 border-slate-700 text-slate-300',
      icon: '🛡️'
    };
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
      type: 'all',
      search: ''
    };
    this.activeChallenge = null;
    this.activeRoomTab = 'tasks'; // 'tasks' | 'terminal' | 'browser' | 'scenario' | 'writeup'
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
  // RENDU DU TRAINING HUB (STYLE OFFICIEL TRYHACKME)
  // ==========================================================================
  renderHub() {
    const mount = document.getElementById('view-training-hub');
    if (!mount) return;

    const totalChallenges = this.catalog.length;
    const solvedCount = this.catalog.filter(c => c.status === 'solved').length;
    const totalPoints = this.catalog.reduce((acc, c) => acc + (c.points || 0), 0);
    const earnedPoints = this.catalog.filter(c => c.status === 'solved').reduce((acc, c) => acc + (c.points || 0), 0);

    mount.innerHTML = `
      <!-- EN-TÊTE ÉLÉGANT & AÉRÉ TRYHACKME -->
      <div class="mb-8 font-sans">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div>
            <div class="flex items-center gap-2 mb-1.5">
              <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                CYBERLAB CHALLENGES
              </span>
              <span class="text-xs text-slate-400 font-medium">100% Labs Réalistes et Isolés</span>
            </div>
            <h2 class="text-2xl sm:text-3xl font-black text-white tracking-tight">Zones d'Entraînement</h2>
            <p class="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Infiltre des cibles réalistes, élève tes privilèges sur Linux et Active Directory, pwn des binaires et résous des enquêtes forensiques.
            </p>
          </div>

          <!-- Statistiques Épurées -->
          <div class="flex items-center gap-3 font-mono">
            <div class="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center min-w-[95px]">
              <div class="text-[10px] text-slate-400 font-bold uppercase">Résolus</div>
              <div class="text-base font-black text-emerald-400 mt-0.5">${solvedCount}/${totalChallenges}</div>
            </div>
            <div class="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center min-w-[95px]">
              <div class="text-[10px] text-slate-400 font-bold uppercase">Score XP</div>
              <div class="text-base font-black text-cyan-400 mt-0.5">${earnedPoints} pts</div>
            </div>
            <div class="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center min-w-[95px]">
              <div class="text-[10px] text-slate-400 font-bold uppercase">Labs Total</div>
              <div class="text-base font-black text-purple-400 mt-0.5">${totalChallenges}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- BARRE DE FILTRES ÉPURÉE & SPACIEUSE -->
      <div class="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-3.5 mb-8 font-sans">
        <div class="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          
          <!-- Champ recherche -->
          <div class="flex-1 relative">
            <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-sm">
              🔍
            </span>
            <input 
              type="text" 
              id="training-search-input"
              value="${this.escapeHtml(this.activeFilter.search)}"
              placeholder="Rechercher une room (ex: Cap Setuid, RootMe, Pickle Rick, SQLi, Kerberos)..." 
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
              <option value="solved" ${this.activeFilter.status === 'solved' ? 'selected' : ''}>Résolu</option>
            </select>

            <!-- Switcher Mode de Vue -->
            <div class="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 font-mono">
              <button 
                onclick="window.trainingSystem.switchViewMode('grid')"
                class="px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${this.viewMode === 'grid' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'}"
                title="Vue TryHackMe"
              >
                <span>☵</span>
                <span class="hidden sm:inline">TryHackMe</span>
              </button>
              <button 
                onclick="window.trainingSystem.switchViewMode('matrix')"
                class="px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${this.viewMode === 'matrix' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'}"
                title="Vue Matrice Tactique (Tableau HTB)"
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
        <div class="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin text-xs pt-1 border-t border-slate-800/60 font-sans">
          ${this.renderCategoryPills()}
        </div>
      </div>

      <!-- CONTENU DES ROOMS & SECTIONS -->
      <div id="training-view-mount" class="space-y-4">
        ${this.renderActiveViewContent()}
      </div>
    `;

    this.attachHubEvents();
  }

  renderCategoryPills() {
    const categories = [
      { id: 'all', label: 'Toutes les Rooms' },
      { id: 'Linux', label: 'Systèmes & Linux' },
      { id: 'Web', label: 'Web Exploitation' },
      { id: 'Windows', label: 'Active Directory' },
      { id: 'Forensics', label: 'Forensics & SOC' },
      { id: 'Crypto', label: 'Cryptographie' },
      { id: 'Pwn', label: 'Pwn & Binaires' },
      { id: 'Cloud', label: 'Cloud & Docker' },
      { id: 'Boot2Root', label: 'Boot2Root' }
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
      // Recherche textuelle
      if (this.activeFilter.search) {
        const query = this.activeFilter.search.toLowerCase();
        const inTitle = (c.title || '').toLowerCase().includes(query);
        const inDesc = (c.description || '').toLowerCase().includes(query);
        const inOrg = (c.organization || '').toLowerCase().includes(query);
        const inCve = (c.cve || '').toLowerCase().includes(query);
        const inTags = (c.tags || []).some(t => t.toLowerCase().includes(query));
        if (!inTitle && !inDesc && !inOrg && !inCve && !inTags) return false;
      }
      return true;
    });
  }

  // ==========================================================================
  // RENDU DES SECTIONS CURATÉES TRYHACKME
  // ==========================================================================
  renderActiveViewContent() {
    if (this.viewMode === 'matrix') {
      return this.renderMatrixTable();
    }
    if (this.viewMode === 'paths') {
      return this.renderPathsView();
    }

    const isFiltered = this.activeFilter.category !== 'all' || 
                       this.activeFilter.difficulty !== 'all' || 
                       this.activeFilter.status !== 'all' || 
                       !!this.activeFilter.search;

    // Si l'utilisateur filtre ou cherche, afficher directement la grille des résultats
    if (isFiltered) {
      const filtered = this.getFilteredChallenges();
      if (filtered.length === 0) {
        return this.renderEmptyState();
      }
      return `
        <div class="mb-4 text-xs font-bold text-slate-400 font-mono">
          Affichage de <span class="text-cyan-400 font-black">${filtered.length}</span> lab(s) correspondant à vos critères
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          ${filtered.map(c => this.renderThmCard(c)).join('')}
        </div>
      `;
    }

    // Affichage officiel par Sections Thématiques (comme sur TryHackMe)
    const sections = [
      {
        id: 'server',
        title: 'Break into the server',
        subtitle: 'Get remote access, escalate privileges, and take full control',
        filter: c => {
          const cat = (c.category || '').toLowerCase();
          const id = (c.id || '').toLowerCase();
          return cat.includes('syst') || id.includes('linux') || id.includes('suid') || id.includes('cap') || id.includes('cron') || id.includes('sudo');
        }
      },
      {
        id: 'web',
        title: 'Exploit web vulnerabilities',
        subtitle: 'Bypass authentication, extract databases, and execute remote code',
        filter: c => {
          const cat = (c.category || '').toLowerCase();
          return cat.includes('web') || cat.includes('api');
        }
      },
      {
        id: 'forensics',
        title: 'Investigate a cybercrime',
        subtitle: 'Analyse phishing emails, trace attackers, and dig through logs',
        filter: c => {
          const cat = (c.category || '').toLowerCase();
          return cat.includes('forensic') || cat.includes('blue') || cat.includes('osint') || cat.includes('social');
        }
      },
      {
        id: 'defend',
        title: 'Stop an attack',
        subtitle: 'Detect malicious activity, mitigate threats, and respond to incidents',
        filter: c => {
          const cat = (c.category || '').toLowerCase();
          const id = (c.id || '').toLowerCase();
          return cat.includes('blue') || id.includes('siem') || id.includes('soc') || id.includes('suricata') || id.includes('snort');
        }
      },
      {
        id: 'ad',
        title: 'Master Active Directory & Networks',
        subtitle: 'Kerberos attacks, pivoting, and enterprise domain dominance',
        filter: c => {
          const cat = (c.category || '').toLowerCase();
          const id = (c.id || '').toLowerCase();
          return id.includes('win-') || id.includes('ad-') || cat.includes('réseau') || cat.includes('network');
        }
      },
      {
        id: 'pwn',
        title: 'Crack ciphers & Binaries',
        subtitle: 'Reverse engineering, buffer overflows, and cryptanalysis',
        filter: c => {
          const cat = (c.category || '').toLowerCase();
          return cat.includes('pwn') || cat.includes('crypto') || cat.includes('reverse');
        }
      },
      {
        id: 'cloud',
        title: 'Cloud & Container Escapes',
        subtitle: 'Docker escapes, socket abuse, and Kubernetes privilege escalation',
        filter: c => {
          const cat = (c.category || '').toLowerCase();
          const id = (c.id || '').toLowerCase();
          return cat.includes('cloud') || id.includes('docker') || id.includes('k8s') || id.includes('container') || id.includes('bucket');
        }
      },
      {
        id: 'b2r',
        title: 'Boot2Root Elite Corporate Targets',
        subtitle: 'Realistic multi-stage full chain corporate compromise (2 Flags)',
        filter: c => {
          const id = (c.id || '').toLowerCase();
          const cat = (c.category || '').toLowerCase();
          return id.startsWith('b2r-') || cat.includes('boot2root') || id.includes('enterprise-alpha');
        }
      }
    ];

    return sections.map(sec => {
      const rooms = this.catalog.filter(sec.filter);
      if (rooms.length === 0) return '';

      return `
        <div class="thm-section">
          <div class="thm-section-header">
            <h3 class="thm-section-title">${sec.title}</h3>
            <p class="thm-section-subtitle">${sec.subtitle}</p>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            ${rooms.slice(0, 8).map(c => this.renderThmCard(c)).join('')}
          </div>
        </div>
      `;
    }).join('');
  }

  // ==========================================================================
  // CARTE DE LAB TRYHACKME (AÉRÉE, MODERNE, MINIMALISTE)
  // ==========================================================================
  renderThmCard(c) {
    const isSolved = c.status === 'solved';
    const isInProgress = c.status === 'in_progress';
    const avatar = CyberAvatarEngine.getAvatar(c);
    const osTag = c.target_os || 'Linux';
    const diffLabel = this.getDifficultyLabel(c.difficulty);
    const duration = c.duration_min || 45;

    return `
      <div 
        class="thm-card ${isSolved ? 'solved' : (isInProgress ? 'in-progress' : '')}" 
        onclick="window.trainingSystem.openRoom('${c.id}')"
        role="button"
        tabindex="0"
      >
        <!-- Avatar Central Illustré Signature THM -->
        <div class="thm-card-avatar bg-gradient-to-br ${avatar.bg}">
          <span class="font-mono font-black select-none text-2xl">${avatar.icon}</span>
        </div>

        <!-- Métadonnées Épurées : Difficulté & Durée -->
        <div class="thm-card-meta">
          <span>${diffLabel}</span>
          <span class="text-slate-600 font-bold">·</span>
          <span>${duration} min</span>
        </div>

        <!-- Titre de la Room -->
        <h4 class="thm-card-title" title="${this.escapeHtml(c.title)}">
          ${this.escapeHtml(c.title)}
        </h4>

        <!-- Footer : Tags & Statut -->
        <div class="thm-card-footer">
          <div class="thm-card-tags">
            <span class="thm-tag-pill">${osTag}</span>
            <span class="thm-tag-pill">+ 1 more</span>
          </div>

          <!-- Icône Bookmark / Statut -->
          <div class="flex-shrink-0">
            ${isSolved 
              ? `<span class="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/80">✓ PWNED</span>` 
              : `<span class="thm-bookmark-icon" title="Sauvegarder">
                  <svg class="w-4 h-4 text-rose-500/80 hover:text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                  </svg>
                </span>`
            }
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // MATRICE TACTIQUE (VUE TABLEAU DENSE HACKTHEBOX)
  // ==========================================================================
  renderMatrixTable() {
    const list = this.getFilteredChallenges();
    if (list.length === 0) return this.renderEmptyState();

    return `
      <div class="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl font-mono">
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
                <th style="width: 120px;">DIFFICULTÉ</th>
                <th style="width: 80px;">POINTS</th>
                <th style="width: 100px; text-align: right;">ACTION</th>
              </tr>
            </thead>
            <tbody>
              ${list.map(c => {
                const isSolved = c.status === 'solved';
                const os = c.target_os || 'Linux';
                return `
                  <tr class="${isSolved ? 'solved-row' : ''}">
                    <td>
                      ${isSolved 
                        ? `<span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-400 font-black text-xs">✓</span>`
                        : `<span class="inline-block w-2 h-2 rounded-full bg-slate-700 ml-1.5"></span>`
                      }
                    </td>
                    <td>
                      <a href="javascript:void(0)" onclick="window.trainingSystem.openRoom('${c.id}')" class="font-bold text-white hover:text-cyan-400 transition-colors">
                        ${this.escapeHtml(c.title)}
                      </a>
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
                      ${c.cve ? `<span class="px-1.5 py-0.5 rounded bg-rose-950/60 border border-rose-900/60 text-rose-300 text-[9.5px]">${c.cve}</span>` : `<span class="text-slate-600">—</span>`}
                    </td>
                    <td>
                      <span class="text-xs text-slate-300">${this.getDifficultyLabel(c.difficulty)}</span>
                    </td>
                    <td>
                      <span class="text-amber-400 font-bold text-xs">${c.points} pts</span>
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
  // PARCOURS CERTIFIANTS
  // ==========================================================================
  renderPathsView() {
    return `
      <div class="space-y-6 font-sans">
        <div class="p-4 bg-slate-900/60 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
          Chaque filière regroupe des challenges enchaînés pour valider un badge certifiant officiel (Junior Pentester, Active Directory Specialist, DFIR Sentinel...).
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
      <div class="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 hover:border-cyan-500/50 transition-all space-y-4">
        <div class="flex items-center justify-between">
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-cyan-950/80 text-cyan-400 border border-cyan-800/80">
            FILIÈRE OFFICIELLE
          </span>
          <span class="text-xs font-bold text-amber-400 font-mono">${path.difficulty.toUpperCase()}</span>
        </div>

        <div>
          <h4 class="text-base font-black text-white">${this.escapeHtml(path.title)}</h4>
          <p class="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">${this.escapeHtml(path.description)}</p>
        </div>

        <div class="space-y-1.5 font-mono">
          <div class="flex items-center justify-between text-[11px] text-slate-400">
            <span>Progression : ${completedCount}/${matchingChallenges.length} labs</span>
            <span class="text-cyan-400 font-bold">${pct}%</span>
          </div>
          <div class="h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div class="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full" style="width: ${pct}%"></div>
          </div>
        </div>

        <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between font-mono">
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
      <div class="col-span-full p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800 font-sans">
        <div class="text-3xl mb-3">🔍</div>
        <h4 class="text-base font-bold text-slate-200">Aucun lab ne correspond à tes filtres</h4>
        <p class="text-xs text-slate-400 mt-1">Réinitialise ta recherche ou change de catégorie.</p>
        <button onclick="window.trainingSystem.resetFilters()" class="btn-mini-3d btn-mini-cyan mt-4 font-mono">
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
  // ROOM MODALE TRYHACKME & TERMINAL EN DIRECT
  // ==========================================================================
  async openRoom(challengeId) {
    try {
      if (window.cyberAudio) window.cyberAudio.playTactileClick();
      
      const res = await fetch(`/api/training/challenge/${challengeId}`);
      if (!res.ok) throw new Error('Impossible de charger la room');
      
      const data = await res.json();
      this.activeChallenge = data.room || data.challenge || data;
      this.activeInstance = this.activeChallenge.instance || null;

      // Choix intelligent de l'onglet par défaut
      const isWeb = (this.activeChallenge.category || '').toLowerCase().includes('web');
      this.activeRoomTab = 'tasks';
      this.expandedTaskId = this.activeChallenge.tasks[0]?.id || null;

      const modal = document.getElementById('modal-training-room');
      if (modal) modal.classList.remove('hidden');

      this.renderRoom();

      if (this.activeInstance && (this.activeInstance.status === 'RUNNING' || this.activeInstance.status === 'running')) {
        this.startCountdownTimer();
        // Si la machine est déjà active sur un lab Linux, activer le terminal
        if (!isWeb) {
          setTimeout(() => this.switchRoomTab('terminal'), 150);
        }
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
    const org = c.organization || 'Entreprise Cible';
    const isWeb = (c.category || '').toLowerCase().includes('web');

    mount.innerHTML = `
      <!-- EN-TÊTE ÉPURÉ DE LA ROOM -->
      <div class="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4 font-sans">
        <div class="flex items-center gap-3.5 min-w-0">
          <button onclick="window.trainingSystem.closeRoom()" class="text-slate-400 hover:text-white transition font-mono text-sm px-2 py-1 rounded bg-slate-900 border border-slate-800" title="Retour aux challenges">
            &larr; Retour
          </button>
          <div class="min-w-0">
            <div class="flex items-center gap-2">
              <span class="diff-badge ${diffClass} text-[10px] font-mono py-0.5 px-2">${this.getDifficultyLabel(c.difficulty)}</span>
              <span class="text-xs text-slate-400 font-mono">${c.points} PTS • ${c.duration_min} MIN</span>
              <span class="text-xs text-cyan-400 font-mono hidden sm:inline">• ${org}</span>
            </div>
            <h2 class="text-lg sm:text-xl font-black text-white truncate mt-0.5">
              ${this.escapeHtml(c.title)}
            </h2>
          </div>
        </div>

        <button onclick="window.trainingSystem.closeRoom()" class="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors flex-shrink-0 font-mono text-sm" title="Fermer la Room">
          ✕
        </button>
      </div>

      <!-- CORPS DE LA ROOM : PANNEAU LATÉRAL & ESPACE DE TRAVAIL -->
      <div class="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        <!-- PANNEAU GAUCHE : MACHINE ET INFORMATIONS -->
        <div class="w-full md:w-80 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-950/70 p-4 sm:p-5 overflow-y-auto space-y-4 font-sans">
          
          <!-- LIVE TARGET BOX -->
          <div id="room-target-box-mount">
            ${this.renderTargetBox()}
          </div>

          <!-- Artefacts / Fichiers à télécharger -->
          ${(c.downloadable_files && c.downloadable_files.length > 0) ? `
            <div class="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2">
              <div class="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <span>📦</span>
                <span>Fichiers de la Mission</span>
              </div>
              <div class="space-y-1.5 font-mono">
                ${c.downloadable_files.map(f => `
                  <a href="${f.url}" download class="flex items-center justify-between p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs text-cyan-400 transition-colors">
                    <span class="truncate">${this.escapeHtml(f.name)}</span>
                    <span class="text-[10px] text-slate-400">${f.size || ''}</span>
                  </a>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Boîte à outils conseillée -->
          <div class="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
            <div class="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Outils Conseillés</div>
            <div class="flex flex-wrap gap-1 font-mono">
              ${(c.recommended_tools || []).map(tool => `
                <span class="text-[10px] bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-300">
                  ${this.escapeHtml(tool)}
                </span>
              `).join('')}
            </div>
          </div>

          <!-- Indices Déblocables -->
          ${(c.hints && c.hints.length > 0) ? `
            <div class="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2.5">
              <div class="flex items-center justify-between font-mono">
                <div class="text-xs font-bold text-slate-400 uppercase tracking-wider">Indices</div>
                <span class="text-[10px] text-emerald-400">${c.hints.filter(h => h.is_unlocked).length}/${c.hints.length} débloqué${c.hints.length > 1 ? 's' : ''}</span>
              </div>
              <div class="space-y-2">
                ${c.hints.map(h => `
                  <div class="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-xs">
                    <div class="flex items-center justify-between mb-1">
                      <span class="font-bold text-slate-300 text-[11px]">${this.escapeHtml(h.title)}</span>
                      ${!h.is_unlocked ? `
                        <button onclick="window.trainingSystem.unlockHint('${c.id}', ${h.index})" class="btn-mini-3d btn-mini-slate py-0.5 px-2 text-[9px] flex items-center gap-1 font-mono">
                          <span class="text-emerald-400">${h.cost} 💎</span>
                          <span>Débloquer</span>
                        </button>
                      ` : `
                        <span class="text-[9px] text-emerald-400 font-bold font-mono">DÉBLOQUÉ</span>
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

        <!-- ESPACE DE TRAVAIL PRINCIPAL : ONGLETS & CONTENU -->
        <div class="flex-1 flex flex-col bg-slate-900/40 overflow-hidden font-sans">
          
          <!-- Barre d'onglets épurée -->
          <div class="bg-slate-950/80 px-4 py-2 border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-xs font-mono">
            <button 
              onclick="window.trainingSystem.switchRoomTab('tasks')"
              class="px-3.5 py-1.5 rounded-lg font-bold transition flex items-center gap-2 ${this.activeRoomTab === 'tasks' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}"
            >
              <span>📋</span>
              <span>Tâches & Questions (${c.tasks.filter(t => t.is_completed).length}/${c.tasks.length})</span>
            </button>

            <!-- Onglet Terminal Web Interactif pour Linux/System/Pwn -->
            <button 
              onclick="window.trainingSystem.switchRoomTab('terminal')"
              class="px-3.5 py-1.5 rounded-lg font-bold transition flex items-center gap-2 ${this.activeRoomTab === 'terminal' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}"
            >
              <span>💻</span>
              <span>Terminal Machine (Connecté)</span>
            </button>

            ${this.getLocalWebTarget(c.id) ? `
              <button 
                onclick="window.trainingSystem.switchRoomTab('browser')"
                class="px-3.5 py-1.5 rounded-lg font-bold transition flex items-center gap-2 ${this.activeRoomTab === 'browser' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}"
              >
                <span>🌐</span>
                <span>Navigateur Web Cible</span>
              </button>
            ` : ''}

            <button 
              onclick="window.trainingSystem.switchRoomTab('scenario')"
              class="px-3.5 py-1.5 rounded-lg font-bold transition flex items-center gap-2 ${this.activeRoomTab === 'scenario' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}"
            >
              <span>🎯</span>
              <span>Contexte & Briefing</span>
            </button>

            <button 
              onclick="window.trainingSystem.switchRoomTab('guide')"
              class="px-3.5 py-1.5 rounded-lg font-bold transition flex items-center gap-2 ${this.activeRoomTab === 'guide' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}"
            >
              <span>📚</span>
              <span>Guide Terminal</span>
            </button>

            <button 
              onclick="window.trainingSystem.switchRoomTab('writeup')"
              class="px-3.5 py-1.5 rounded-lg font-bold transition flex items-center gap-2 ${this.activeRoomTab === 'writeup' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}"
            >
              <span>${allTasksCompleted ? '📖' : '🔒'}</span>
              <span>Writeup Solution</span>
            </button>
          </div>

          <!-- Contenu dynamique de l'onglet -->
          <div class="flex-1 p-5 overflow-y-auto" id="room-tab-content">
            ${this.renderRoomTabContent()}
          </div>
        </div>
      </div>
    `;

    // Si l'onglet terminal est actif, initialiser CyberTerminal
    if (this.activeRoomTab === 'terminal') {
      this.initRoomTerminal();
    }
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

  renderTargetBox() {
    const inst = this.activeInstance;
    const isRunning = inst && (inst.status === 'RUNNING' || inst.status === 'running');

    if (!isRunning) {
      return `
        <div class="live-target-box space-y-3 font-sans">
          <div class="flex items-center justify-between font-mono">
            <span class="text-xs font-black text-slate-300 flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-slate-600"></span>
              <span>MACHINE VIRTUELLE</span>
            </span>
            <span class="text-[10px] text-slate-400">HORS LIGNE</span>
          </div>
          <p class="text-xs text-slate-400 leading-relaxed">
            Démarre ton serveur dédié pour lancer le terminal interactif ou ouvrir les cibles web du lab.
          </p>
          <button 
            onclick="window.trainingSystem.startInstance('${this.activeChallenge.id}')"
            class="w-full btn-mini-3d btn-mini-green py-2.5 text-xs font-mono"
          >
            <span>▶</span>
            <span>Démarrer la Machine</span>
          </button>
        </div>
      `;
    }

    const ip = inst.virtual_ip || inst.target_ip || '10.30.45.88';
    const localWebTarget = this.getLocalWebTarget(this.activeChallenge?.id);
    const isWeb = (this.activeChallenge?.category || '').toLowerCase().includes('web');

    return `
      <div class="live-target-box active space-y-3 font-sans">
        <div class="flex items-center justify-between font-mono">
          <span class="text-xs font-black text-emerald-400 flex items-center gap-2">
            <span class="radar-ping"><span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span></span>
            <span>MACHINE EN LIGNE</span>
          </span>
          <span id="target-countdown-display" class="text-xs font-black text-amber-400">--:--</span>
        </div>

        <!-- Carte Réseau Simple (Poste d'Attaque vs Machine Cible) -->
        <div class="p-2.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-[11px] font-mono">
          <div class="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <span>Réseau Lab Isolé</span>
            <span class="text-emerald-400 flex items-center gap-1">● VPN Connecté</span>
          </div>
          <div class="grid grid-cols-2 gap-2 p-2 bg-slate-900/80 rounded-lg border border-slate-800/80 text-xs">
            <div class="text-left border-r border-slate-800 pr-1">
              <span class="text-slate-500 text-[10px] block">Attaquant (Toi)</span>
              <span class="text-cyan-400 font-bold">10.10.14.5</span>
            </div>
            <div class="text-right pl-1">
              <span class="text-slate-500 text-[10px] block">Cible (${this.escapeHtml(this.activeChallenge?.target_os || 'Linux')})</span>
              <span class="text-amber-400 font-bold">${ip}</span>
            </div>
          </div>
        </div>

        <!-- Informations d'Accès Cible -->
        <div class="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5">
          <div class="flex items-center justify-between text-xs font-mono">
            <span class="text-slate-400 font-bold uppercase">IP Cible :</span>
            <span class="text-cyan-400 font-bold bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">${ip}</span>
          </div>

          <!-- Bouton d'accès direct selon le type de challenge -->
          <div class="pt-2 border-t border-slate-800/80 space-y-2 font-mono">
            ${isWeb && localWebTarget ? `
              <a href="${localWebTarget}" target="_blank" class="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 text-xs font-black transition-all shadow-lg flex items-center justify-center gap-2 group">
                <span>🌐</span>
                <span>OUVRIR LE SITE DANS CHROME</span>
                <span class="group-hover:translate-x-1 transition-transform">↗</span>
              </a>
              <button onclick="window.trainingSystem.switchRoomTab('browser')" class="w-full py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold transition flex items-center justify-center gap-1.5">
                <span>🖥️</span>
                <span>Split-Screen Intégré</span>
              </button>
            ` : `
              <button onclick="window.trainingSystem.switchRoomTab('terminal')" class="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 text-xs font-black transition-all shadow-lg flex items-center justify-center gap-2 group">
                <span>💻</span>
                <span>OUVRIR LE TERMINAL BASH</span>
                <span class="group-hover:translate-x-1 transition-transform">&rarr;</span>
              </button>
            `}
          </div>
        </div>

        <!-- Contrôles Instance : Prolonger, Réinitialiser & Arrêter -->
        <div class="grid grid-cols-3 gap-1.5 pt-1 font-mono">
          <button onclick="window.trainingSystem.renewInstance('${this.activeChallenge.id}')" class="btn-mini-3d btn-mini-cyan py-1.5 px-1 text-[10px]" title="Ajouter 15 minutes">
            <span>+15 min</span>
          </button>
          <button onclick="window.trainingSystem.resetInstance('${this.activeChallenge.id}')" class="btn-mini-3d btn-mini-slate py-1.5 px-1 text-[10px] text-amber-300 hover:text-amber-200" title="Réinitialiser la machine à zéro">
            <span>↻ Reset</span>
          </button>
          <button onclick="window.trainingSystem.stopInstance('${this.activeChallenge.id}')" class="btn-mini-3d btn-mini-rose py-1.5 px-1 text-[10px]" title="Arrêter l'instance">
            <span>■ Arrêter</span>
          </button>
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // CONTENU DES ONGLETS DE LA ROOM
  // ==========================================================================
  renderRoomTabContent() {
    // 1. ONGLET TERMINAL BASH INTERACTIF (Pour Linux, AD, Pwn, Systems)
    if (this.activeRoomTab === 'terminal') {
      const c = this.activeChallenge;
      const isCap = (c.id || '').includes('cap');

      return `
        <div class="space-y-3 font-sans">
          <!-- Barre d'outils et de raccourcis rapides au-dessus du terminal -->
          <div class="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800 font-mono text-xs overflow-x-auto">
            <div class="flex items-center gap-2 text-slate-400 text-[11px] font-bold uppercase mr-2 flex-shrink-0">
              <span>⚡ Raccourcis :</span>
            </div>
            <div class="flex items-center gap-2 flex-wrap">
              ${isCap ? `
                <button onclick="window.cyberActiveTerminal?.runCommand('getcap -r / 2>/dev/null')" class="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-cyan-300 font-bold border border-slate-700 text-[11px]" title="Lister les capacités Linux">
                  ⚡ getcap -r /
                </button>
                <button onclick="window.cyberActiveTerminal?.runCommand('python3.8 -c \\'import os; os.setuid(0); os.system(\"/bin/bash\")\\'')" class="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-emerald-300 font-bold border border-slate-700 text-[11px]" title="Exploiter cap_setuid en root">
                  🐍 Python Setuid Root
                </button>
              ` : `
                <button onclick="window.cyberActiveTerminal?.runCommand('sudo -l')" class="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold border border-slate-700 text-[11px]">
                  🔍 sudo -l
                </button>
                <button onclick="window.cyberActiveTerminal?.runCommand('find / -perm -4000 2>/dev/null')" class="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-purple-300 font-bold border border-slate-700 text-[11px]">
                  👑 SUID find
                </button>
              `}
              <button onclick="window.cyberActiveTerminal?.runCommand('cat user.txt')" class="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold border border-slate-700 text-[11px]">
                📄 Cat User Flag
              </button>
              <button onclick="window.cyberActiveTerminal?.runCommand('cat /root/root.txt')" class="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-rose-300 font-bold border border-slate-700 text-[11px]">
                🚩 Cat Root Flag
              </button>
              <button onclick="window.cyberActiveTerminal?.clear()" class="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 font-bold border border-slate-700 text-[11px]">
                🧹 Clear
              </button>
            </div>
          </div>

          <!-- Monture du Terminal Virtuel -->
          <div class="room-terminal-wrapper" id="room-terminal-mount">
            <!-- Injecté par CyberTerminal -->
          </div>
        </div>
      `;
    }

    // 2. ONGLET SPLIT-SCREEN BROWSER (Pour Web)
    if (this.activeRoomTab === 'browser') {
      const targetUrl = this.getLocalWebTarget(this.activeChallenge?.id);
      if (!targetUrl) {
        return `
          <div class="p-8 text-center text-slate-400 font-sans">
            <p>Ce challenge est un lab système/binaire. Utilise l'onglet <strong>Terminal Machine</strong> pour interagir avec le shell.</p>
            <button onclick="window.trainingSystem.switchRoomTab('terminal')" class="btn-mini-3d btn-mini-cyan mt-3 font-mono">
              Ouvrir le Terminal Machine
            </button>
          </div>
        `;
      }
      return `
        <div class="flex flex-col h-[650px] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl font-mono">
          <div class="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between gap-3 text-xs">
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
              <a href="${targetUrl}" target="_blank" class="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-[11px] flex items-center gap-1.5 transition">
                <span>Plein écran</span>
                <span>↗</span>
              </a>
            </div>
          </div>

          <div class="flex-1 bg-white relative">
            <iframe id="target-in-app-iframe" src="${targetUrl}" class="w-full h-full border-0"></iframe>
          </div>
        </div>
      `;
    }

    // 3. ONGLET SCENARIO & DOSSIER
    if (this.activeRoomTab === 'scenario') {
      const c = this.activeChallenge;
      return `
        <div class="p-6 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-5 font-sans">
          <div class="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span class="text-[10px] font-black uppercase text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800 font-mono">DOSSIER DE MISSION</span>
              <h3 class="text-lg font-bold text-white mt-1">${this.escapeHtml(c.title)}</h3>
              <div class="text-xs text-slate-400 mt-0.5">Organisation auditée : <strong class="text-slate-200">${this.escapeHtml(c.organization || 'Client')}</strong></div>
            </div>
            <div class="text-right font-mono">
              <span class="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300">
                ${c.target_os || 'Linux'}
              </span>
            </div>
          </div>

          <div class="space-y-2">
            <h4 class="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">Contexte Opérationnel</h4>
            <p class="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">${this.escapeHtml(c.narrative_story || c.description)}</p>
          </div>

          <div class="pt-4 border-t border-slate-800 space-y-3">
            <h4 class="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">Règles d'Engagement & Objectifs</h4>
            <ul class="list-disc list-inside text-sm text-slate-300 space-y-2 leading-relaxed">
              ${c.tasks.map(t => `<li><strong class="text-white">${this.escapeHtml(t.title)}</strong> : ${this.escapeHtml(t.description)}</li>`).join('')}
            </ul>
          </div>
        </div>
      `;
    }

    // 4. ONGLET WRITEUP
    if (this.activeRoomTab === 'writeup') {
      return `
        <div class="p-6 bg-slate-950/90 rounded-2xl border border-slate-800 space-y-4 font-sans">
          <div class="flex items-center justify-between pb-3 border-b border-slate-800 font-mono">
            <div>
              <span class="text-[10px] font-black uppercase text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">SOLUTION OFFICIELLE</span>
              <h3 class="text-base font-black text-white mt-1">Writeup Pas-à-Pas</h3>
            </div>
          </div>
          <div id="writeup-body-mount" class="writeup-content">
            Chargement du writeup officiel...
          </div>
        </div>
      `;
    }

    // 5. ONGLET AIDE & GUIDE DU TERMINAL
    if (this.activeRoomTab === 'guide') {
      return this.renderTerminalGuide();
    }

    // 6. ONGLET PAR DÉFAUT : TÂCHES & QUESTIONS
    return `
      <div class="space-y-4 font-sans">
        ${this.activeChallenge.tasks.map((task, idx) => this.renderTaskCard(task, idx + 1)).join('')}
      </div>
    `;
  }

  initRoomTerminal() {
    const mount = document.getElementById('room-terminal-mount');
    if (!mount) return;

    if (window.cyberActiveTerminal && 
        window.cyberActiveTerminal.wrapperElement && 
        window.cyberActiveTerminal.options?.challenge?.id === this.activeChallenge?.id) {
      mount.innerHTML = '';
      mount.appendChild(window.cyberActiveTerminal.wrapperElement);
      if (window.cyberActiveTerminal.fitAddon) {
        setTimeout(() => {
          try { window.cyberActiveTerminal.fitAddon.fit(); } catch (e) {}
        }, 50);
      }
      if (window.cyberActiveTerminal.xterm) {
        window.cyberActiveTerminal.xterm.focus();
      }
      return;
    }

    if (window.CyberTerminal) {
      window.cyberActiveTerminal = new CyberTerminal(mount, {
        challenge: this.activeChallenge,
        instance: this.activeInstance
      });
    }
  }

  renderTerminalGuide() {
    return `
      <div class="p-6 bg-slate-950/90 rounded-2xl border border-slate-800 space-y-6 font-sans">
        <div class="flex items-center justify-between pb-3 border-b border-slate-800 font-mono">
          <div>
            <span class="text-[10px] font-black uppercase text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">AIDE & GUIDE DU TERMINAL</span>
            <h3 class="text-base font-black text-white mt-1">L'Art de la Ligne de Commande Linux pour Opérateur Cyber</h3>
          </div>
          <button onclick="window.trainingSystem.switchRoomTab('terminal')" class="btn-mini-3d btn-mini-cyan py-1 px-3 text-xs font-mono">
            <span>Ouvrir le Terminal</span> <span>&rarr;</span>
          </button>
        </div>

        <!-- 1. Identité & Navigation -->
        <div class="space-y-3">
          <h4 class="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono flex items-center gap-2">
            <span>📍</span> <span>1. Identité & Navigation Essentielle</span>
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div class="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
              <div class="flex items-center justify-between">
                <code class="font-bold text-cyan-300 font-mono">whoami</code>
                <button onclick="window.trainingSystem.switchRoomTab('terminal'); setTimeout(() => window.cyberActiveTerminal?.runCommand('whoami'), 200);" class="text-[10px] text-slate-400 hover:text-cyan-400 font-mono">Tester ▶</button>
              </div>
              <p class="text-slate-400 text-[11px]">Affiche le nom de l'utilisateur actif (<code class="text-slate-300">operator</code> ou <code class="text-rose-400">root</code>).</p>
            </div>
            <div class="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
              <div class="flex items-center justify-between">
                <code class="font-bold text-cyan-300 font-mono">pwd</code>
                <button onclick="window.trainingSystem.switchRoomTab('terminal'); setTimeout(() => window.cyberActiveTerminal?.runCommand('pwd'), 200);" class="text-[10px] text-slate-400 hover:text-cyan-400 font-mono">Tester ▶</button>
              </div>
              <p class="text-slate-400 text-[11px]">Print Working Directory : affiche le chemin absolu du dossier courant.</p>
            </div>
            <div class="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
              <div class="flex items-center justify-between">
                <code class="font-bold text-cyan-300 font-mono">ls -la</code>
                <button onclick="window.trainingSystem.switchRoomTab('terminal'); setTimeout(() => window.cyberActiveTerminal?.runCommand('ls -la'), 200);" class="text-[10px] text-slate-400 hover:text-cyan-400 font-mono">Tester ▶</button>
              </div>
              <p class="text-slate-400 text-[11px]">Liste détaillée de tous les fichiers (y compris les fichiers cachés).</p>
            </div>
            <div class="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
              <div class="flex items-center justify-between">
                <code class="font-bold text-cyan-300 font-mono">cd &lt;dossier&gt; | cd .. | cd ~</code>
                <button onclick="window.trainingSystem.switchRoomTab('terminal'); setTimeout(() => window.cyberActiveTerminal?.runCommand('cd ~'), 200);" class="text-[10px] text-slate-400 hover:text-cyan-400 font-mono">Tester ▶</button>
              </div>
              <p class="text-slate-400 text-[11px]">Se déplacer dans l'arborescence : <code class="text-slate-300">cd ..</code> (parent), <code class="text-slate-300">cd ~</code> (home).</p>
            </div>
          </div>
        </div>

        <!-- 2. Lecture, Recherche & Filtres -->
        <div class="space-y-3">
          <h4 class="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono flex items-center gap-2">
            <span>🔍</span> <span>2. Lecture, Recherche & Filtres</span>
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div class="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
              <div class="flex items-center justify-between">
                <code class="font-bold text-cyan-300 font-mono">cat &lt;fichier&gt;</code>
                <button onclick="window.trainingSystem.switchRoomTab('terminal'); setTimeout(() => window.cyberActiveTerminal?.runCommand('cat notes.txt'), 200);" class="text-[10px] text-slate-400 hover:text-cyan-400 font-mono">Tester ▶</button>
              </div>
              <p class="text-slate-400 text-[11px]">Affiche le contenu d'un fichier texte directement dans le shell.</p>
            </div>
            <div class="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
              <div class="flex items-center justify-between">
                <code class="font-bold text-cyan-300 font-mono">grep -i "mot" &lt;fichier&gt;</code>
                <button onclick="window.trainingSystem.switchRoomTab('terminal'); setTimeout(() => window.cyberActiveTerminal?.runCommand('grep -i BIENVENUE notes.txt'), 200);" class="text-[10px] text-slate-400 hover:text-cyan-400 font-mono">Tester ▶</button>
              </div>
              <p class="text-slate-400 text-[11px]">Filtre les lignes contenant une expression ou un mot-clé.</p>
            </div>
            <div class="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
              <div class="flex items-center justify-between">
                <code class="font-bold text-cyan-300 font-mono">find / -perm -4000 2&gt;/dev/null</code>
                <button onclick="window.trainingSystem.switchRoomTab('terminal'); setTimeout(() => window.cyberActiveTerminal?.runCommand('find / -perm -4000 2>/dev/null'), 200);" class="text-[10px] text-slate-400 hover:text-cyan-400 font-mono">Tester ▶</button>
              </div>
              <p class="text-slate-400 text-[11px]">Recherche les binaires SUID pour l'élévation de privilèges root.</p>
            </div>
            <div class="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
              <div class="flex items-center justify-between">
                <code class="font-bold text-cyan-300 font-mono">commande1 | commande2</code>
                <button onclick="window.trainingSystem.switchRoomTab('terminal'); setTimeout(() => window.cyberActiveTerminal?.runCommand('cat /etc/passwd | grep operator'), 200);" class="text-[10px] text-slate-400 hover:text-cyan-400 font-mono">Tester ▶</button>
              </div>
              <p class="text-slate-400 text-[11px]">Pipes Unix (|) pour chaîner la sortie d'un outil vers un autre.</p>
            </div>
          </div>
        </div>

        <!-- 3. Raccourcis Clavier du Terminal -->
        <div class="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
          <h4 class="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono flex items-center gap-2">
            <span>⚡</span> <span>Raccourcis Clavier Rapides</span>
          </h4>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono text-slate-300">
            <div class="p-2 bg-slate-950 rounded-lg border border-slate-800">
              <span class="text-cyan-400 font-bold">TAB</span> : Autocomplétion
            </div>
            <div class="p-2 bg-slate-950 rounded-lg border border-slate-800">
              <span class="text-cyan-400 font-bold">Flèches ↑ / ↓</span> : Historique
            </div>
            <div class="p-2 bg-slate-950 rounded-lg border border-slate-800">
              <span class="text-cyan-400 font-bold">Ctrl + C</span> : Annuler ligne
            </div>
            <div class="p-2 bg-slate-950 rounded-lg border border-slate-800">
              <span class="text-cyan-400 font-bold">Ctrl + L</span> : Effacer écran
            </div>
          </div>
        </div>
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
            <div class="w-7 h-7 rounded-lg ${isCompleted ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-900 text-slate-400 border border-slate-800'} flex items-center justify-center text-xs font-bold font-mono">
              ${isCompleted ? '✓' : taskNum}
            </div>
            <div>
              <h4 class="text-sm font-bold text-white">${this.escapeHtml(task.title)}</h4>
              <span class="text-xs text-slate-400 font-mono">${task.points || 0} points • ${isCompleted ? '<span class="text-emerald-400 font-bold">RÉSOLUE</span>' : 'À résoudre'}</span>
            </div>
          </div>
          <span class="text-slate-400 text-xs transition-transform ${isExpanded ? 'rotate-180' : ''}">▼</span>
        </div>

        <!-- Corps de la tâche accordéon -->
        ${isExpanded ? `
          <div class="room-task-body space-y-4">
            <p class="text-sm text-slate-300 leading-relaxed">${this.escapeHtml(task.description)}</p>

            <!-- Champ de soumission de Flag -->
            <div class="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
                Réponse ou Flag (Format: CYBERLAB{...} ou valeur)
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
                    placeholder="Tape ta réponse ou ton flag..." 
                    class="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-cyan-300 font-mono focus:border-cyan-500 focus:outline-none"
                    onkeydown="if(event.key === 'Enter') window.trainingSystem.submitFlag('${task.id}')"
                  />
                  <button 
                    onclick="window.trainingSystem.submitFlag('${task.id}')"
                    class="btn-mini-3d btn-mini-cyan py-2 px-4 font-mono text-xs"
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

      // Bascule automatique vers le terminal si lab système, ou navigateur si web
      const isWeb = (this.activeChallenge?.category || '').toLowerCase().includes('web');
      if (isWeb) {
        setTimeout(() => this.switchRoomTab('browser'), 200);
      } else {
        setTimeout(() => this.switchRoomTab('terminal'), 200);
      }
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

  async resetInstance(challengeId) {
    if (!confirm('Réinitialiser la machine virtuelle à son état d\'origine ?')) return;
    try {
      if (window.cyberAudio) window.cyberAudio.playTactileClick();
      const res = await fetch('/api/training/instance/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challenge_id: challengeId })
      });

      if (res.ok) {
        const data = await res.json();
        this.activeInstance = data.instance || data;
        const boxMount = document.getElementById('room-target-box-mount');
        if (boxMount) boxMount.innerHTML = this.renderTargetBox();
        this.startCountdownTimer();
        if (window.cyberActiveTerminal) {
          window.cyberActiveTerminal.reset();
        }
        if (window.cyberAudio) window.cyberAudio.playSuccess();
      }
    } catch (e) {
      console.error('Erreur réinitialisation:', e);
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
  // SOUMISSION DE FLAG ET VALIDATION
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
          errBox.innerText = data.error || 'Flag incorrect. Analyse bien les traces et les indices !';
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

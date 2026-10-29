// ============================================================================
// CYBERRANGE PRO - MODULE ZONE D'ENTRAÎNEMENT & ROOMS TRYHACKME
// UI/UX PRO MAX EDITION: Filtres Avancés, Live Target Box, Flags Dynamiques,
// Indices Déblocables & Writeups d'Experts Verrouillés
// ============================================================================

class TrainingSystem {
  constructor() {
    this.catalog = [];
    this.learningPaths = [];
    this.activeFilter = {
      category: 'all',
      difficulty: 'all',
      status: 'all',
      search: ''
    };
    this.activeChallenge = null;
    this.activeRoomTab = 'tasks'; // 'tasks' | 'scenario' | 'writeup'
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
    // Écouteur pour fermer la room sur échap
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
      <div class="p-6 bg-slate-900/80 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden font-mono">
        <div class="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative z-10">
          <div>
            <div class="flex items-center gap-2 mb-1.5">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-950/80 text-emerald-400 border border-emerald-800/80">
                LABORATOIRES TACTIQUES OFFENSIFS
              </span>
              <span class="text-xs text-slate-400">// 100+ ROOMS RÉALISTES</span>
            </div>
            <h2 class="text-2xl font-black text-white font-heading tracking-tight">Zone d'Entraînement Avancée</h2>
            <p class="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed font-sans">
              Infiltre des environnements d'entreprise vulnérables, analyse des artefacts réseau et médico-légaux, casse des cryptosystèmes et pwn des binaires dans des labs conteneurisés sécurisés.
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

      <!-- CAROUSEL DES LEARNING PATHS (PARCOURS GUIDÉS) -->
      <div class="space-y-3 font-mono">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-black text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <span class="w-4 h-4 text-cyan-400">${window.CyberIcons ? window.CyberIcons.get('layers', 'w-4 h-4') : ''}</span>
            <span>Parcours d'Apprentissage Certifiants</span>
          </h3>
          <span class="text-[11px] text-slate-400">${this.learningPaths.length} filières</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          ${this.learningPaths.map(p => this.renderPathCard(p)).join('')}
        </div>
      </div>

      <!-- BARRE DE FILTRES MULTIPLES & RECHERCHE (UI/UX PRO MAX) -->
      <div class="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-3.5 font-mono">
        <!-- Recherche textuelle & Sélecteurs -->
        <div class="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <!-- Champ recherche -->
          <div class="flex-1 relative">
            <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none w-4 h-4">
              ${window.CyberIcons ? window.CyberIcons.get('search', 'w-4 h-4') : ''}
            </span>
            <input 
              type="text" 
              id="training-search-input"
              value="${this.escapeHtml(this.activeFilter.search)}"
              placeholder="Rechercher une room, un tag, un outil (ex: SQLi, Wireshark, RSA, SUID)..." 
              class="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none transition-colors"
            />
          </div>

          <!-- Filtre Difficulté -->
          <div class="flex items-center gap-2">
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
          </div>
        </div>

        <!-- Pilules de Catégories (Filtre rapide) -->
        <div class="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin text-xs">
          ${this.renderCategoryPills()}
        </div>
      </div>

      <!-- GRILLE DES ROOMS D'ENTRAÎNEMENT -->
      <div class="space-y-3 font-mono">
        <div class="flex items-center justify-between">
          <div class="text-xs text-slate-400 font-bold">
            Affichage de <span class="text-cyan-400 font-black">${this.getFilteredChallenges().length}</span> lab(s)
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="training-rooms-grid">
          ${this.renderChallengeCards()}
        </div>
      </div>
    `;

    this.attachHubEvents();
  }

  renderPathCard(path) {
    return `
      <div class="p-4 bg-slate-900/60 rounded-xl border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer group" onclick="window.trainingSystem.applyPathFilter('${path.id}')">
        <div class="flex items-center justify-between mb-2">
          <div class="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
            ${window.CyberIcons ? window.CyberIcons.get('target', 'w-4 h-4') : ''}
          </div>
          <span class="text-[10px] font-bold text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
            ${path.difficulty.toUpperCase()}
          </span>
        </div>
        <h4 class="text-xs font-black text-white group-hover:text-cyan-300 transition-colors">${this.escapeHtml(path.title)}</h4>
        <p class="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed font-sans">${this.escapeHtml(path.description)}</p>
        <div class="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
          <span class="text-amber-400 font-bold">${path.badge_reward}</span>
          <span class="text-cyan-400 group-hover:translate-x-1 transition-transform">Explorer &rarr;</span>
        </div>
      </div>
    `;
  }

  renderCategoryPills() {
    const categories = [
      { id: 'all', label: 'Toutes' },
      { id: 'Web', label: 'Web' },
      { id: 'OSINT', label: 'OSINT' },
      { id: 'Crypto', label: 'Crypto' },
      { id: 'Forensics', label: 'Forensics' },
      { id: 'Réseau', label: 'Réseau' },
      { id: 'Linux', label: 'Linux & Windows' },
      { id: 'Reverse', label: 'Reverse' },
      { id: 'Pwn', label: 'Pwn / Binaire' },
      { id: 'Cloud', label: 'Cloud' },
      { id: 'API', label: 'API & Mobile' },
      { id: 'Social', label: 'Social Eng.' },
      { id: 'Blue', label: 'Blue Team' }
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
        const inTags = (c.tags || []).some(t => t.toLowerCase().includes(query));
        const inTools = (c.recommended_tools || []).some(t => t.toLowerCase().includes(query));
        if (!inTitle && !inDesc && !inTags && !inTools) return false;
      }
      return true;
    });
  }

  renderChallengeCards() {
    const list = this.getFilteredChallenges();
    if (list.length === 0) {
      return `
        <div class="col-span-full p-8 text-center bg-slate-900/40 rounded-2xl border border-slate-800">
          <div class="w-12 h-12 mx-auto rounded-2xl bg-slate-800/80 text-slate-400 flex items-center justify-center mb-3">
            ${window.CyberIcons ? window.CyberIcons.get('search', 'w-6 h-6') : ''}
          </div>
          <h4 class="text-sm font-black text-slate-300">Aucun lab ne correspond à tes filtres</h4>
          <p class="text-xs text-slate-500 mt-1">Réinitialise ta recherche ou change de catégorie pour explorer les challenges.</p>
          <button onclick="window.trainingSystem.resetFilters()" class="btn-mini-3d btn-mini-cyan mt-4">
            Réinitialiser les filtres
          </button>
        </div>
      `;
    }

    return list.map(c => {
      const isSolved = c.status === 'solved';
      const isInProgress = c.status === 'in_progress';
      const diffClass = `diff-${this.mapDifficultyClass(c.difficulty)}`;
      const completedTasks = c.completed_task_count || 0;
      const totalTasks = c.task_count || 1;

      return `
        <div class="training-card ${isSolved ? 'solved' : (isInProgress ? 'in-progress' : '')}" role="article">
          <!-- Haut de carte : Catégorie & Badge difficulté -->
          <div class="flex items-center justify-between mb-3">
            <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <span class="w-3.5 h-3.5 text-cyan-400">${this.getCategoryIcon(c.category)}</span>
              <span>${c.category}</span>
            </span>
            <span class="diff-badge ${diffClass}">
              ${this.getDifficultyLabel(c.difficulty)}
            </span>
          </div>

          <!-- Titre & Description -->
          <h4 class="text-sm font-black text-white hover:text-cyan-300 transition-colors line-clamp-1 mb-1 font-heading">
            ${this.escapeHtml(c.title)}
          </h4>
          <p class="text-[11px] text-slate-400 leading-relaxed line-clamp-2 flex-1 mb-4 font-sans">
            ${this.escapeHtml(c.description || '')}
          </p>

          <!-- Tags & Outils recommandés -->
          <div class="flex flex-wrap gap-1 mb-4">
            ${(c.recommended_tools || []).slice(0, 3).map(tool => `
              <span class="text-[9px] font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-300">
                ${this.escapeHtml(tool)}
              </span>
            `).join('')}
          </div>

          <!-- Bas de carte : Points, progression des tâches & bouton CTA -->
          <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-xs font-black text-amber-400 flex items-center gap-1">
                <span class="w-3.5 h-3.5">${window.CyberIcons ? window.CyberIcons.get('zap', 'w-3.5 h-3.5') : ''}</span>
                <span>${c.points} pts</span>
              </span>
              <span class="text-[10px] text-slate-400">
                • ${completedTasks}/${totalTasks} tâche${totalTasks > 1 ? 's' : ''}
              </span>
            </div>

            <button 
              onclick="window.trainingSystem.openRoom('${c.id}')"
              class="btn-mini-3d ${isSolved ? 'btn-mini-green' : (isInProgress ? 'btn-mini-cyan' : 'btn-mini-slate')}"
            >
              ${isSolved ? 'Revoir' : (isInProgress ? 'Continuer' : 'Entrer')}
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  attachHubEvents() {
    const searchInput = document.getElementById('training-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.activeFilter.search = e.target.value;
        const grid = document.getElementById('training-rooms-grid');
        if (grid) grid.innerHTML = this.renderChallengeCards();
      });
    }

    const diffSelect = document.getElementById('filter-difficulty');
    if (diffSelect) {
      diffSelect.addEventListener('change', (e) => {
        this.activeFilter.difficulty = e.target.value;
        const grid = document.getElementById('training-rooms-grid');
        if (grid) grid.innerHTML = this.renderChallengeCards();
      });
    }

    const statusSelect = document.getElementById('filter-status');
    if (statusSelect) {
      statusSelect.addEventListener('change', (e) => {
        this.activeFilter.status = e.target.value;
        const grid = document.getElementById('training-rooms-grid');
        if (grid) grid.innerHTML = this.renderChallengeCards();
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
      else this.setCategoryFilter('all');
    }
  }

  resetFilters() {
    this.activeFilter = {
      category: 'all',
      difficulty: 'all',
      status: 'all',
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
      if (this.activeInstance && this.activeInstance.status === 'RUNNING') {
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

    mount.innerHTML = `
      <!-- EN-TÊTE DE LA ROOM -->
      <div class="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4 font-mono">
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center text-cyan-400 flex-shrink-0">
            ${this.getCategoryIcon(c.category)}
          </div>
          <div class="min-w-0">
            <div class="flex items-center gap-2">
              <span class="diff-badge ${diffClass}">${this.getDifficultyLabel(c.difficulty)}</span>
              <span class="text-[10px] text-slate-400 uppercase">${c.category} • ${c.points} PTS • ${c.duration_min} MIN</span>
            </div>
            <h2 class="text-base sm:text-lg font-black text-white font-heading truncate mt-0.5">
              ${this.escapeHtml(c.title)}
            </h2>
          </div>
        </div>

        <button onclick="window.trainingSystem.closeRoom()" class="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors" title="Fermer la Room">
          ${window.CyberIcons ? window.CyberIcons.get('close', 'w-5 h-5') : '×'}
        </button>
      </div>

      <!-- CORPS DE LA ROOM : TARGET BOX & ONGLET -->
      <div class="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        <!-- COLONNE GAUCHE / PANNEAU DE CONTRÔLE MACHINE (TARGET BOX) -->
        <div class="w-full md:w-80 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-950/60 p-4 sm:p-5 overflow-y-auto space-y-4 font-mono">
          
          <!-- LIVE TARGET BOX -->
          <div id="room-target-box-mount">
            ${this.renderTargetBox()}
          </div>

          <!-- Artefacts / Fichiers à télécharger -->
          ${(c.downloadable_files && c.downloadable_files.length > 0) ? `
            <div class="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2">
              <div class="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <span class="w-3.5 h-3.5 text-cyan-400">${window.CyberIcons ? window.CyberIcons.get('download', 'w-3.5 h-3.5') : ''}</span>
                <span>Artefacts du Lab</span>
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

        <!-- COLONNE DROITE / CONTENU DES ONGLETS -->
        <div class="flex-1 flex flex-col overflow-hidden bg-slate-900/40 font-mono">
          
          <!-- BARRE D'ONGLETS -->
          <div class="flex items-center px-4 pt-3 border-b border-slate-800 gap-2 bg-slate-950/40">
            <button 
              onclick="window.trainingSystem.switchRoomTab('tasks')"
              class="px-4 py-2 text-xs font-bold rounded-t-xl transition-all border-b-2 ${
                this.activeRoomTab === 'tasks' 
                  ? 'text-cyan-400 border-cyan-500 bg-slate-900/80' 
                  : 'text-slate-400 border-transparent hover:text-slate-200'
              }"
            >
              Tâches & Questions (${c.tasks.filter(t => t.is_completed).length}/${c.tasks.length})
            </button>
            <button 
              onclick="window.trainingSystem.switchRoomTab('browser')"
              class="px-4 py-2 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 ${
                this.activeRoomTab === 'browser' 
                  ? 'text-cyan-400 border-cyan-500 bg-slate-900/80 shadow-sm shadow-cyan-500/20' 
                  : 'text-slate-400 border-transparent hover:text-slate-200'
              }"
            >
              <span>🌐</span>
              <span>Navigateur Cible</span>
            </button>
            <button 
              onclick="window.trainingSystem.switchRoomTab('scenario')"
              class="px-4 py-2 text-xs font-bold rounded-t-xl transition-all border-b-2 ${
                this.activeRoomTab === 'scenario' 
                  ? 'text-cyan-400 border-cyan-500 bg-slate-900/80' 
                  : 'text-slate-400 border-transparent hover:text-slate-200'
              }"
            >
              Briefing & Objectifs
            </button>
            <button 
              onclick="window.trainingSystem.switchRoomTab('writeup')"
              class="px-4 py-2 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 ${
                this.activeRoomTab === 'writeup' 
                  ? 'text-emerald-400 border-emerald-500 bg-slate-900/80' 
                  : (allTasksCompleted ? 'text-emerald-400/80 border-transparent hover:text-emerald-300' : 'text-slate-500 border-transparent cursor-not-allowed')
              }"
            >
              <span>${allTasksCompleted ? (window.CyberIcons ? window.CyberIcons.get('unlock', 'w-3.5 h-3.5') : '🔓') : (window.CyberIcons ? window.CyberIcons.get('lock', 'w-3.5 h-3.5') : '🔒')}</span>
              <span>Solution (Writeup)</span>
            </button>
          </div>

          <!-- CONTENU DE L'ONGLET SÉLECTIONNÉ -->
          <div class="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4" id="room-tab-content">
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
    if (cat.includes('web') || cat.includes('api')) {
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
            Démarre ton conteneur ou serveur d'entraînement dédié pour interagir avec les cibles du lab.
          </p>
          <button 
            onclick="window.trainingSystem.startInstance('${this.activeChallenge.id}')"
            class="w-full btn-mini-3d btn-mini-green py-2.5"
          >
            <span class="w-3.5 h-3.5">${window.CyberIcons ? window.CyberIcons.get('play', 'w-3.5 h-3.5') : ''}</span>
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

        <!-- IP & Accès Cible -->
        <div class="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5">
          <div class="flex items-center justify-between text-[10px]">
            <span class="text-slate-400 font-bold uppercase tracking-wider">IP VIRTUELLE CTF :</span>
            <span class="text-amber-400 font-mono font-bold bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/60">VPN THM / HTB</span>
          </div>
          <div class="flex items-center justify-between bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800">
            <code class="text-xs font-black text-cyan-300 select-all font-mono">${ip}</code>
            <button onclick="navigator.clipboard.writeText('${ip}')" class="text-slate-400 hover:text-white p-1 rounded" title="Copier l'IP Virtuelle">
              ${window.CyberIcons ? window.CyberIcons.get('copy', 'w-3.5 h-3.5') : '📋'}
            </button>
          </div>

          ${localWebTarget ? `
            <div class="pt-2 border-t border-slate-800 space-y-2">
              <button onclick="window.trainingSystem.switchRoomTab('browser')" class="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 text-xs font-black transition-all shadow-lg shadow-cyan-950 flex items-center justify-center gap-2 group">
                <span>🌐</span>
                <span>OUVRIR DANS LE LAB INTÉGRÉ</span>
              </button>

              <a href="${localWebTarget}" target="_blank" class="w-full py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-bold transition flex items-center justify-center gap-1.5">
                <span>Ouvrir dans un nouvel onglet</span>
                <span>${window.CyberIcons ? window.CyberIcons.get('externalLink', 'w-3 h-3') : '↗'}</span>
              </a>

              <div class="p-2 rounded-lg bg-cyan-950/40 border border-cyan-800/40 text-[10px] text-cyan-200/90 leading-tight font-sans">
                💡 <strong>Important</strong> : Sur votre PC, le serveur répond sur le port local (3333). Ne collez pas l'IP <code class="text-amber-300 font-mono">${ip}</code> dans Chrome, utilisez le bouton ci-dessus !
              </div>
            </div>
          ` : `
            <div class="text-[10px] text-slate-400 pt-1 border-t border-slate-800">
              Lab basé sur artefacts / fichiers téléchargeables ci-dessous.
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
                ${window.CyberIcons ? window.CyberIcons.get('refresh', 'w-3.5 h-3.5') : '🔄'}
              </button>
              <a href="${targetUrl}" target="_blank" class="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-[11px] flex items-center gap-1.5 transition">
                <span>Plein écran</span>
                <span>${window.CyberIcons ? window.CyberIcons.get('externalLink', 'w-3 h-3') : '↗'}</span>
              </a>
            </div>
          </div>

          <!-- Quick Navigation Shortcuts (Ex: /robots.txt, etc.) -->
          <div class="bg-slate-900/60 px-4 py-1.5 border-b border-slate-800 flex items-center gap-2 text-[10px] text-slate-400 overflow-x-auto font-mono">
            <span class="font-bold text-slate-500 uppercase">Raccourcis :</span>
            <button onclick="window.trainingSystem.navigateInAppBrowser('${targetUrl}')" class="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200">Accueil /</button>
            ${this.activeChallenge?.id?.startsWith('web-01') ? `
              <button onclick="window.trainingSystem.navigateInAppBrowser('${targetUrl}robots.txt')" class="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 hover:bg-cyan-900 text-cyan-300">robots.txt</button>
              <button onclick="window.trainingSystem.navigateInAppBrowser('${targetUrl}hidden_admin_vault_9041/')" class="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200">hidden_admin_vault_9041/</button>
            ` : ''}
          </div>

          <!-- Iframe -->
          <div class="flex-1 bg-white relative">
            <iframe id="target-in-app-iframe" src="${targetUrl}" class="w-full h-full border-0"></iframe>
          </div>
        </div>
      `;
    }

    if (this.activeRoomTab === 'scenario') {
      return `
        <div class="p-5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-4">
          <h3 class="text-base font-black text-white font-heading">Contexte Opérationnel & Briefing</h3>
          <p class="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">${this.escapeHtml(this.activeChallenge.narrative_story || this.activeChallenge.description)}</p>

          <div class="pt-4 border-t border-slate-800 space-y-2">
            <h4 class="text-xs font-black text-cyan-400 uppercase tracking-wider">Objectifs d'Engagement</h4>
            <ul class="list-disc list-inside text-xs text-slate-300 space-y-1.5 leading-relaxed font-sans">
              ${this.activeChallenge.tasks.map(t => `<li>${this.escapeHtml(t.title)}</li>`).join('')}
            </ul>
          </div>
        </div>
      `;
    }

    if (this.activeRoomTab === 'writeup') {
      return `
        <div class="p-6 bg-slate-950/90 rounded-2xl border border-slate-800 space-y-4">
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
        <div class="room-task-header" onclick="window.trainingSystem.toggleTaskAccordion('${task.id}')">
          <div class="flex items-center gap-3">
            <div class="w-6 h-6 rounded-lg ${isCompleted ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-900 text-slate-400 border border-slate-800'} flex items-center justify-center text-xs font-black">
              ${isCompleted ? (window.CyberIcons ? window.CyberIcons.get('check', 'w-3.5 h-3.5') : '✓') : taskNum}
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
                Flag de la tâche (Format: CYBERLAB{...} ou valeur attendue)
              </label>
              ${isCompleted ? `
                <div class="flex items-center gap-2 p-2 bg-emerald-950/60 border border-emerald-800/80 rounded-lg text-emerald-300 text-xs font-mono font-bold">
                  <span class="w-4 h-4">${window.CyberIcons ? window.CyberIcons.get('checkCircle', 'w-4 h-4') : '✓'}</span>
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
        // VICTOIRE !
        if (window.cyberAudio) window.cyberAudio.playVictory();
        if (window.confetti) {
          window.confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
        }

        // Mettre à jour la tâche dans l'état local
        const task = this.activeChallenge.tasks.find(t => t.id === taskId);
        if (task) task.is_completed = true;

        // Rafraîchir les compteurs et l'UI
        if (window.cyberApp) {
          window.cyberApp.state.xp += data.points_awarded || 0;
          window.cyberApp.renderHeaderWidgets();
          window.cyberApp.renderRightWidgets();
        }

        this.renderRoom();
      } else {
        // ERREUR
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
        
        // Mettre à jour l'indice dans l'état local
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
    
    // Code blocks avec backticks triples
    html = html.replace(/```([a-z0-9_-]*)\n([\s\S]*?)```/gm, (match, lang, code) => {
      return `<pre><code class="language-${lang}">${this.escapeHtml(code.trim())}</code></pre>`;
    });

    // Titres H1, H2, H3
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Gras & Italique
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Code inline
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Listes à puces
    html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/gims, '<ul>$1</ul>');

    // Paragraphes
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
    if (!window.CyberIcons) return '';
    const c = (cat || '').toLowerCase();
    if (c.includes('web')) return window.CyberIcons.get('globe', 'w-4 h-4');
    if (c.includes('osint')) return window.CyberIcons.get('compass', 'w-4 h-4');
    if (c.includes('crypto')) return window.CyberIcons.get('key', 'w-4 h-4');
    if (c.includes('forensics')) return window.CyberIcons.get('search', 'w-4 h-4');
    if (c.includes('réseau') || c.includes('reseau') || c.includes('network')) return window.CyberIcons.get('radar', 'w-4 h-4');
    if (c.includes('linux') || c.includes('sys') || c.includes('server')) return window.CyberIcons.get('server', 'w-4 h-4');
    if (c.includes('reverse') || c.includes('pwn')) return window.CyberIcons.get('cpu', 'w-4 h-4');
    if (c.includes('api') || c.includes('mobile')) return window.CyberIcons.get('layers', 'w-4 h-4');
    if (c.includes('social') || c.includes('phish')) return window.CyberIcons.get('puzzle', 'w-4 h-4');
    return window.CyberIcons.get('shield', 'w-4 h-4');
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

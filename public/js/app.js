// ============================================================================
// CYBERRANGE PRO - MOTEUR GAMIFIÉ DUOLINGO & STEPPER DE MICRO-CARDS
// UI/UX PRO MAX EDITION: SVG Icons, Circuit Rails, Keyboard Nav & Tactile 3D
// ============================================================================

class CyberAppPro {
  constructor() {
    this.tracks = window.CYBER_TRACKS || [];
    this.units = window.CYBER_UNITS || [];
    this.levels = window.CYBER_LEVELS || [];
    this.badges = window.CYBER_BADGES || [];

    this.currentTrackId = 'all';
    this.badgeFilter = 'all';

    this.state = {
      nickname: 'Opérateur RedTeam',
      avatar: '🥷',
      theme: 'dark',
      xp: 0,
      streak: 1,
      maxStreak: 1,
      hearts: 5,
      maxHearts: 5,
      combo: 0,
      gems: 100,
      completedLevels: [],
      unlockedBadges: []
    };

    // État de la session micro-card en cours
    this.session = {
      level: null,
      phase: 'lesson',
      slideIndex: 0,
      microStep: 1, // 1: Hook+SVG, 2: LineClicker, 3: TokenPuzzle, 4: QuickQuiz, 5: RealChallenge
      lineClicked: false,
      selectedTokens: [],
      quizSelectedId: null,
      quizAnswered: false,
      shuffledQuizOptions: null
    };

    this.sandboxInstance = null;
    this.init();
  }

  async init() {
    this.loadLocalState();
    await this.syncWithBackend();

    this.initStaticIcons();
    this.setupEventListeners();
    this.setupKeyboardShortcuts();
    this.renderTrackSelector();
    this.renderHeaderWidgets();
    this.renderSidebarStats();
    this.renderLearningPath();
    this.renderRightWidgets();

    // Initialisation du module Zone d'Entraînement (100 Labs)
    if (window.trainingSystem) {
      window.trainingSystem.init();
    }

    // Initialisation du Skill Tree (Arborescence 4 Rôles & Dojo)
    if (window.cyberSkillTree) {
      window.cyberSkillTree.init();
    }

    // Vérification de mise à jour au démarrage
    this.checkForUpdates();
  }

  // ==========================================================================
  // INJECTION D'ICÔNES VECTORIELLES SVG STATIQUES (UI/UX PRO MAX)
  // ==========================================================================
  initStaticIcons() {
    if (!window.CyberIcons) return;

    const setIcon = (id, iconName, className = "w-5 h-5") => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = window.CyberIcons.get(iconName, className);
    };

    // Navigation desktop
    setIcon('nav-icon-curriculum', 'curriculum', 'w-5 h-5');
    setIcon('nav-icon-skill-tree', 'skillTree', 'w-5 h-5');
    setIcon('nav-icon-training', 'training', 'w-5 h-5');
    setIcon('nav-icon-badges', 'trophy', 'w-5 h-5');
    setIcon('nav-icon-profile', 'profile', 'w-5 h-5');

    // Contrôle audio
    const isMuted = window.cyberAudio ? window.cyberAudio.isMuted() : false;
    setIcon('audio-icon-slot', isMuted ? 'volumeMute' : 'volume', 'w-4 h-4');
    setIcon('mob-audio-icon', isMuted ? 'volumeMute' : 'volume', 'w-4 h-4');

    // Panneau droit stats
    setIcon('stat-icon-streak', 'flame', 'w-5 h-5');
    setIcon('stat-icon-xp', 'zap', 'w-5 h-5');
    setIcon('stat-icon-gems', 'gem', 'w-5 h-5');
    setIcon('heart-header-icon', 'heart', 'w-4 h-4');
    setIcon('directive-shield-icon', 'shield', 'w-4 h-4');

    // Header mobile
    setIcon('mob-streak-icon', 'flame', 'w-4 h-4');
    setIcon('mob-xp-icon', 'zap', 'w-4 h-4');

    // Navigation mobile dock
    setIcon('mob-dock-icon-learn', 'curriculum', 'w-5 h-5');
    setIcon('mob-dock-icon-skill-tree', 'skillTree', 'w-5 h-5');
    setIcon('mob-dock-icon-training', 'training', 'w-5 h-5');
    setIcon('mob-dock-icon-badges', 'trophy', 'w-5 h-5');
    setIcon('mob-dock-icon-profile', 'profile', 'w-5 h-5');

    // Modales
    setIcon('modal-close-icon', 'close', 'w-5 h-5');
    setIcon('session-xp-icon', 'zap', 'w-4 h-4');
    setIcon('badges-header-icon', 'trophy', 'w-6 h-6');
    setIcon('badges-close-icon', 'close', 'w-4 h-4');
    setIcon('profile-close-icon', 'close', 'w-4 h-4');
    setIcon('reset-icon-slot', 'refresh', 'w-4 h-4');
  }

  loadLocalState() {
    try {
      const saved = localStorage.getItem('cyber_pro_state');
      if (saved) {
        this.state = { ...this.state, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Erreur chargement localStorage', e);
    }
  }

  saveLocalState() {
    try {
      localStorage.setItem('cyber_pro_state', JSON.stringify(this.state));
    } catch (e) {
      console.warn('Erreur sauvegarde localStorage', e);
    }
  }

  async syncWithBackend() {
    try {
      const res = await fetch('/api/user-progress');
      if (res.ok) {
        const data = await res.json();
        if ((data.xp || 0) >= this.state.xp) {
          this.state = { ...this.state, ...data };
          this.saveLocalState();
        } else {
          await this.saveToBackend();
        }
      }
    } catch (e) {
      console.warn('Mode autonome local SQLite.', e);
    }
  }

  async saveToBackend() {
    try {
      await fetch('/api/user-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.state)
      });
    } catch (e) {
      console.warn('Erreur synchro backend', e);
    }
  }

  setupEventListeners() {
    // Boutons Audio (desktop + mobile)
    const toggleAudio = () => {
      const isMuted = window.cyberAudio.toggleMute();
      const muteBtnIcon = document.getElementById('audio-icon-slot');
      const mobAudioIcon = document.getElementById('mob-audio-icon');
      const audioLabel = document.getElementById('audio-label-text');
      
      const iconMarkup = window.CyberIcons.get(isMuted ? 'volumeMute' : 'volume', 'w-4 h-4');
      if (muteBtnIcon) muteBtnIcon.innerHTML = iconMarkup;
      if (mobAudioIcon) mobAudioIcon.innerHTML = iconMarkup;
      if (audioLabel) audioLabel.innerText = isMuted ? 'Son Coupé' : 'Synthétiseur Audio';
    };

    document.getElementById('btn-audio-mute')?.addEventListener('click', toggleAudio);
    document.getElementById('mob-audio-btn')?.addEventListener('click', toggleAudio);

    // Modale Badges
    document.getElementById('btn-open-badges-nav')?.addEventListener('click', () => this.openBadgesModal());
    document.getElementById('mob-nav-badges')?.addEventListener('click', () => this.openBadgesModal());
    document.getElementById('btn-close-badges')?.addEventListener('click', () => document.getElementById('modal-badges')?.classList.add('hidden'));

    // Modale Profil
    document.getElementById('btn-open-profile-nav')?.addEventListener('click', () => this.openProfileModal());
    document.getElementById('btn-sidebar-profile')?.addEventListener('click', () => this.openProfileModal());
    document.getElementById('mob-nav-profile')?.addEventListener('click', () => this.openProfileModal());
    document.getElementById('btn-close-profile')?.addEventListener('click', () => document.getElementById('modal-profile')?.classList.add('hidden'));

    // Basculement entre Vues Principales (Curriculum vs Arbre de Compétences vs Zone Entraînement)
    const switchToCurriculum = () => {
      this.closeAllModals();
      document.getElementById('view-curriculum-container')?.classList.remove('hidden');
      document.getElementById('view-skill-tree')?.classList.add('hidden');
      document.getElementById('view-training-hub')?.classList.add('hidden');

      document.getElementById('nav-learn')?.classList.add('active');
      document.getElementById('nav-skill-tree')?.classList.remove('active');
      document.getElementById('nav-training')?.classList.remove('active');

      document.getElementById('mob-nav-learn')?.classList.add('active');
      document.getElementById('mob-nav-skill-tree')?.classList.remove('active');
      document.getElementById('mob-nav-training')?.classList.remove('active');

      if (window.cyberAudio) window.cyberAudio.playTactileClick();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const switchToSkillTree = () => {
      this.closeAllModals();
      document.getElementById('view-curriculum-container')?.classList.add('hidden');
      document.getElementById('view-skill-tree')?.classList.remove('hidden');
      document.getElementById('view-training-hub')?.classList.add('hidden');

      document.getElementById('nav-learn')?.classList.remove('active');
      document.getElementById('nav-skill-tree')?.classList.add('active');
      document.getElementById('nav-training')?.classList.remove('active');

      document.getElementById('mob-nav-learn')?.classList.remove('active');
      document.getElementById('mob-nav-skill-tree')?.classList.add('active');
      document.getElementById('mob-nav-training')?.classList.remove('active');

      if (window.cyberAudio) window.cyberAudio.playTactileClick();
      if (window.cyberSkillTree) window.cyberSkillTree.renderHub();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const switchToTraining = () => {
      this.closeAllModals();
      document.getElementById('view-curriculum-container')?.classList.add('hidden');
      document.getElementById('view-skill-tree')?.classList.add('hidden');
      document.getElementById('view-training-hub')?.classList.remove('hidden');

      document.getElementById('nav-learn')?.classList.remove('active');
      document.getElementById('nav-skill-tree')?.classList.remove('active');
      document.getElementById('nav-training')?.classList.add('active');

      document.getElementById('mob-nav-learn')?.classList.remove('active');
      document.getElementById('mob-nav-skill-tree')?.classList.remove('active');
      document.getElementById('mob-nav-training')?.classList.add('active');

      if (window.cyberAudio) window.cyberAudio.playTactileClick();
      if (window.trainingSystem) window.trainingSystem.renderHub();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    document.getElementById('nav-learn')?.addEventListener('click', switchToCurriculum);
    document.getElementById('mob-nav-learn')?.addEventListener('click', switchToCurriculum);
    document.getElementById('nav-skill-tree')?.addEventListener('click', switchToSkillTree);
    document.getElementById('mob-nav-skill-tree')?.addEventListener('click', switchToSkillTree);
    document.getElementById('nav-training')?.addEventListener('click', switchToTraining);
    document.getElementById('mob-nav-training')?.addEventListener('click', switchToTraining);

    // Réinitialisation du profil
    document.getElementById('btn-reset-data')?.addEventListener('click', async () => {
      if (confirm('Réinitialiser l\'ensemble de ton dossier opérateur et repartir à zéro ?')) {
        await fetch('/api/reset-profile', { method: 'POST' });
        localStorage.removeItem('cyber_pro_state');
        window.location.reload();
      }
    });

    // Fermeture des modales avec touche Échap (Accessibilité)
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAllModals();
        document.getElementById('modal-badges')?.classList.add('hidden');
        document.getElementById('modal-profile')?.classList.add('hidden');
      }
    });
  }

  // ==========================================================================
  // NAVIGATION CLAVIER POUR LES QUIZ (UI/UX PRO MAX)
  // ==========================================================================
  setupKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      const s = this.session;
      const modal = document.getElementById('modal-session');
      if (!modal || modal.classList.contains('hidden')) return;

      // Seulement si on est à l'étape 4 (Quiz)
      if (s.phase === 'practice' && s.microStep === 4 && !s.quizAnswered) {
        let selectedIdx = null;
        if (e.key === '1' || e.key === 'a' || e.key === 'A') selectedIdx = 0;
        if (e.key === '2' || e.key === 'b' || e.key === 'B') selectedIdx = 1;
        if (e.key === '3' || e.key === 'c' || e.key === 'C') selectedIdx = 2;
        if (e.key === '4' || e.key === 'd' || e.key === 'D') selectedIdx = 3;

        if (selectedIdx !== null) {
          const cards = document.querySelectorAll('.quiz-option-card');
          if (cards[selectedIdx]) {
            if (window.cyberAudio) window.cyberAudio.playTactileClick();
            s.quizSelectedId = selectedIdx;
            this.renderMicroStep();
          }
        }

        // Valider avec Enter si une option est sélectionnée
        if (e.key === 'Enter' && s.quizSelectedId !== null) {
          document.getElementById('btn-quiz-check')?.click();
        }
      }
    });
  }

  // ==========================================================================
  // SYSTÈME DE MISE À JOUR OBLIGATOIRE (AUTO-UPDATE GITHUB RELEASES)
  // ==========================================================================
  async checkForUpdates() {
    try {
      const res = await fetch('/api/check-update');
      if (!res.ok) return;
      const data = await res.json();

      if (data && data.updateAvailable) {
        this.displayUpdateModal(data);
      }
    } catch (err) {
      console.warn('Mode hors-ligne ou verification mise a jour ignoree.', err);
    }
  }

  async checkUpdateManual() {
    try {
      const res = await fetch('/api/check-update');
      const data = await res.json();
      if (data && data.updateAvailable) {
        this.displayUpdateModal(data);
      } else {
        const msg = `✅ Votre version de CyberLab (v${data.currentVersion || '1.0.1'}) est à jour !\nAucune version plus récente n'a été publiée sur GitHub.\n\nVoulez-vous afficher l'écran de mise à jour obligatoire (mode test/aperçu) ?`;
        if (confirm(msg)) {
          this.testUpdateModal();
        }
      }
    } catch (e) {
      alert('Erreur lors de la vérification de mise à jour : ' + e.message);
    }
  }

  testUpdateModal() {
    this.displayUpdateModal({
      updateAvailable: true,
      currentVersion: '1.1.0',
      latestVersion: '1.2.0',
      isTest: true,
      releaseName: 'CyberRange PRO v1.2.0 (Zone Entraînement TryHackMe & Terminal Bash)',
      releaseNotes: '⚡ NOUVEAUTÉS DE LA VERSION v1.2.0 :\n- Zone Entraînement refaite à neuf style officiel TryHackMe (sections curatées, cartes aérées, avatars dédiés)\n- Terminal Linux Bash interactif intégré dans les rooms avec raccourcis tactiques (getcap, python setuid, sudo, suid)\n- 123 challenges CTF réalistes avec scénarios d\'entreprises, indices et writeups officiels\n- Élimination des redirections vers des IP virtuelles inaccessibles\n- Sauvegarde intégrale et rétention de cyberrange.db garantie !',
      downloadUrl: 'https://github.com/ZIOTI/CyberLab/releases/latest',
      htmlUrl: 'https://github.com/ZIOTI/CyberLab/releases'
    });
  }

  displayUpdateModal(updateData) {
    const modal = document.getElementById('modal-update-required');
    if (!modal) return;

    const currVer = document.getElementById('update-curr-version');
    const targetVer = document.getElementById('update-target-version');
    const notesEl = document.getElementById('update-release-notes');
    const manualLink = document.getElementById('btn-manual-update-link');
    const updateBtn = document.getElementById('btn-trigger-update');
    const progContainer = document.getElementById('update-progress-container');
    const progStatus = document.getElementById('update-progress-status');
    const progPct = document.getElementById('update-progress-pct');
    const progFill = document.getElementById('update-progress-bar-fill');
    const closeTestBtn = document.getElementById('btn-close-test-update');

    if (currVer) currVer.innerText = `v${updateData.currentVersion}`;
    if (targetVer) targetVer.innerText = `v${updateData.latestVersion}`;
    if (notesEl) notesEl.innerText = updateData.releaseNotes || 'Nouvelle version critique disponible.';
    if (manualLink) {
      manualLink.href = updateData.htmlUrl || updateData.downloadUrl || '#';
    }

    if (closeTestBtn) {
      if (updateData.isTest) {
        closeTestBtn.classList.remove('hidden');
      } else {
        closeTestBtn.classList.add('hidden');
      }
    }

    if (window.cyberAudio) window.cyberAudio.playError();

    // Affichage de la modale obligatoire non fermable
    modal.classList.remove('hidden');

    if (updateBtn) {
      updateBtn.onclick = async () => {
        if (window.cyberAudio) window.cyberAudio.playTactileClick();
        updateBtn.disabled = true;
        updateBtn.classList.add('opacity-50', 'cursor-not-allowed');
        if (progContainer) progContainer.classList.remove('hidden');

        // Étape 1 : Connexion
        if (progStatus) progStatus.innerText = '1/3 : Connexion aux serveurs GitHub Releases...';
        if (progPct) progPct.innerText = '25%';
        if (progFill) progFill.style.width = '25%';

        try {
          if (updateData.isTest) {
            // Mode test / démonstration de la rétention et de l'interface
            if (progStatus) progStatus.innerText = '1/3 : Simulation du téléchargement depuis GitHub...';
            if (progPct) progPct.innerText = '45%';
            if (progFill) progFill.style.width = '45%';

            await new Promise(r => setTimeout(r, 800));
            if (progStatus) progStatus.innerText = '2/3 : Vérification intégrité & sécurisation SQLite (cyberrange.db)...';
            if (progPct) progPct.innerText = '80%';
            if (progFill) progFill.style.width = '80%';

            await new Promise(r => setTimeout(r, 900));
            if (window.cyberAudio) window.cyberAudio.playSuccess();
            if (progStatus) {
              progStatus.className = 'text-xs text-emerald-400 font-bold';
              progStatus.innerText = '✅ Simulation Réussie : cyberrange.db et ta progression sont 100% sécurisés !';
            }
            if (progPct) progPct.innerText = '100%';
            if (progFill) progFill.style.width = '100%';

            setTimeout(() => {
              modal.classList.add('hidden');
              if (progContainer) progContainer.classList.add('hidden');
              updateBtn.disabled = false;
              updateBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            }, 2500);
            return;
          }

          if (progStatus) progStatus.innerText = '1/3 : Téléchargement du pack depuis GitHub...';
          if (progPct) progPct.innerText = '30%';
          if (progFill) progFill.style.width = '30%';

          const step2Timer = setTimeout(() => {
            if (progStatus) progStatus.innerText = '2/3 : Extraction & sécurisation SQLite (cyberrange.db)...';
            if (progPct) progPct.innerText = '70%';
            if (progFill) progFill.style.width = '70%';
          }, 1200);

          const applyRes = await fetch('/api/apply-update', { method: 'POST' });
          clearTimeout(step2Timer);

          if (!applyRes.ok) {
            const errData = await applyRes.json().catch(() => ({}));
            throw new Error(errData.error || `Erreur serveur HTTP ${applyRes.status}`);
          }
          const applyData = await applyRes.json();

          if (applyData.alreadyUpToDate) {
            if (window.cyberAudio) window.cyberAudio.playSuccess();
            if (progStatus) {
              progStatus.className = 'text-xs text-emerald-400 font-bold';
              progStatus.innerText = `✅ Vous disposez déjà de la version la plus récente (v${applyData.currentVersion}) !`;
            }
            if (progPct) progPct.innerText = '100%';
            if (progFill) progFill.style.width = '100%';
            setTimeout(() => {
              modal.classList.add('hidden');
              if (progContainer) progContainer.classList.add('hidden');
              updateBtn.disabled = false;
              updateBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            }, 2200);
            return;
          }

          if (applyData.success) {
            if (window.cyberAudio) window.cyberAudio.playSuccess();
            if (progStatus) progStatus.innerText = '3/3 : Déploiement terminé avec succès ! Redémarrage...';
            if (progPct) progPct.innerText = '100%';
            if (progFill) progFill.style.width = '100%';

            // Polling automatique pour recharger la page dès que le serveur a redémarré
            let attempts = 0;
            const checkServerRestart = setInterval(async () => {
              attempts++;
              try {
                const ping = await fetch('/api/version');
                if (ping.ok) {
                  clearInterval(checkServerRestart);
                  window.location.reload();
                }
              } catch (e) {
                if (attempts > 20) {
                  clearInterval(checkServerRestart);
                  window.location.reload();
                }
              }
            }, 1000);
          } else {
            throw new Error(applyData.error || 'Échec de la mise à jour automatique.');
          }
        } catch (updateErr) {
          if (window.cyberAudio) window.cyberAudio.playError();
          if (progStatus) {
            progStatus.className = 'text-rose-400 font-bold';
            progStatus.innerText = `Erreur : ${updateErr.message}. Télécharge le ZIP ci-dessous.`;
          }
          updateBtn.disabled = false;
          updateBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
      };
    }
  }

  // ==========================================================================
  // CALCUL DU RANG ET TITRE DE L'OPÉRATEUR
  // ==========================================================================
  getOperatorRank() {
    const xp = this.state.xp;
    if (xp >= 5000) return { title: 'Grandmaster Boot2Root', color: 'text-rose-400', badge: 'ROOT' };
    if (xp >= 3000) return { title: 'Expert Red Team & PrivEsc', color: 'text-purple-400', badge: 'LVL 5' };
    if (xp >= 1500) return { title: 'Spécialiste Exploitation & CTF', color: 'text-cyan-400', badge: 'LVL 4' };
    if (xp >= 700) return { title: 'Analyste Sécurité Offensive', color: 'text-emerald-400', badge: 'LVL 3' };
    if (xp >= 250) return { title: 'Opérateur Junior Pentest', color: 'text-amber-400', badge: 'LVL 2' };
    return { title: 'Apprenti Hacking Éthique', color: 'text-slate-300', badge: 'LVL 1' };
  }

  // ==========================================================================
  // SÉLECTEUR DE PISTES TRYHACKME / HTB AVEC ICÔNES VECTORIELLES
  // ==========================================================================
  renderTrackSelector() {
    const mount = document.getElementById('track-selector-mount');
    if (!mount) return;

    const trackIconMap = {
      'track-linux': 'trackLinux',
      'track-network': 'trackNetwork',
      'track-sql': 'trackSQL',
      'track-client': 'trackClient',
      'track-server': 'trackServer'
    };

    const allCompletedCount = this.state.completedLevels.length;
    const allTotalCount = this.levels.length;

    let html = `
      <div class="track-tabs-container" role="tablist" aria-label="Pistes d'apprentissage">
        <button class="track-tab-btn ${this.currentTrackId === 'all' ? 'active' : ''}" data-track-id="all" role="tab" aria-selected="${this.currentTrackId === 'all'}">
          <span class="w-4 h-4 flex items-center justify-center">${window.CyberIcons.get('curriculum', 'w-4 h-4')}</span>
          <span>TOUT LE CURRICULUM</span>
          <span class="track-tab-counter font-mono">${allCompletedCount}/${allTotalCount}</span>
        </button>
    `;

    this.tracks.forEach(track => {
      const trackLevels = this.levels.filter(l => {
        const u = this.units.find(unit => unit.id === l.unitId);
        return u && u.trackId === track.id;
      });
      const trackCompleted = trackLevels.filter(l => this.state.completedLevels.includes(l.id)).length;
      const iconKey = trackIconMap[track.id] || 'zap';

      html += `
        <button class="track-tab-btn ${this.currentTrackId === track.id ? 'active' : ''}" data-track-id="${track.id}" role="tab" aria-selected="${this.currentTrackId === track.id}">
          <span class="w-4 h-4 flex items-center justify-center">${window.CyberIcons.get(iconKey, 'w-4 h-4')}</span>
          <span>${track.title.split(':')[0].trim()}</span>
          <span class="track-tab-counter font-mono">${trackCompleted}/${trackLevels.length}</span>
        </button>
      `;
    });

    html += `</div>`;
    mount.innerHTML = html;

    mount.querySelectorAll('.track-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (window.cyberAudio) window.cyberAudio.playTactileClick();
        this.currentTrackId = btn.getAttribute('data-track-id');
        this.renderTrackSelector();
        this.renderLearningPath();
      });
    });
  }

  // ==========================================================================
  // RENDU DU PARCOURS EN SERPENTIN AVEC RAIL SVG CONNECTÉ (DUOLINGO GAMIFIÉ)
  // ==========================================================================
  renderLearningPath() {
    const mount = document.getElementById('learning-path-mount');
    if (!mount) return;

    let filteredUnits = this.units;
    if (this.currentTrackId !== 'all') {
      filteredUnits = this.units.filter(u => u.trackId === this.currentTrackId);
    }

    let html = '';

    filteredUnits.forEach(unit => {
      const unitLevels = this.levels.filter(l => l.unitId === unit.id);
      const completedInUnit = unitLevels.filter(l => this.state.completedLevels.includes(l.id)).length;
      const unitPct = Math.round((completedInUnit / Math.max(1, unitLevels.length)) * 100);

      html += `
        <div class="unit-banner">
          <div class="flex items-center justify-between gap-4">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="text-[10px] font-black uppercase tracking-widest text-cyan-400 font-mono">MODULE 0${unit.number}</span>
                <span class="unit-progress-chip">${completedInUnit}/${unitLevels.length} COMPLÉTÉ (${unitPct}%)</span>
              </div>
              <h2 class="text-base sm:text-lg font-black text-white font-heading">${unit.title}</h2>
              <p class="text-xs text-slate-300 max-w-xl leading-relaxed">${unit.description}</p>
            </div>
            <div class="hidden sm:flex w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700/80 items-center justify-center text-cyan-400 shadow-inner flex-shrink-0">
              ${window.CyberIcons.get('target', 'w-6 h-6')}
            </div>
          </div>
        </div>
      `;

      html += `<div class="learning-path-container">`;

      // Construction du tracé SVG reliant les nœuds
      const nodeCoordinates = unitLevels.map((lvl, idx) => {
        const curveOffset = Math.sin(idx * 1.5) * 55;
        return { x: 200 + curveOffset, y: 40 + idx * 115 };
      });

      const totalHeight = 40 + (unitLevels.length - 1) * 115 + 80;

      let svgPathD = '';
      nodeCoordinates.forEach((pt, i) => {
        if (i === 0) {
          svgPathD += `M ${pt.x} ${pt.y}`;
        } else {
          const prev = nodeCoordinates[i - 1];
          const midY = (prev.y + pt.y) / 2;
          svgPathD += ` C ${prev.x} ${midY}, ${pt.x} ${midY}, ${pt.x} ${pt.y}`;
        }
      });

      html += `
        <svg class="path-connector-rail" viewBox="0 0 400 ${totalHeight}" preserveAspectRatio="none" style="height: ${totalHeight}px;">
          <defs>
            <linearGradient id="rail-gradient-${unit.id}" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.8"/>
              <stop offset="100%" stop-color="#10b981" stop-opacity="0.8"/>
            </linearGradient>
          </defs>
          <!-- Rail de fond inactif -->
          <path d="${svgPathD}" fill="none" stroke="#1e293b" stroke-width="6" stroke-linecap="round"/>
          <!-- Rail lumineux actif avec tirets néon -->
          <path d="${svgPathD}" fill="none" stroke="url(#rail-gradient-${unit.id})" stroke-width="4" stroke-dasharray="8 8" stroke-linecap="round" opacity="0.6"/>
        </svg>
      `;

      // Rendu des nœuds 3D
      unitLevels.forEach((lvl, idx) => {
        const isCompleted = this.state.completedLevels.includes(lvl.id);
        const prevLevel = this.levels[this.levels.indexOf(lvl) - 1];
        const isUnlocked = !prevLevel || this.state.completedLevels.includes(prevLevel.id) || idx === 0;

        let nodeClass = 'node-locked';
        let statusIconSvg = window.CyberIcons.get('lock', 'w-7 h-7 text-slate-500');

        if (isCompleted) {
          nodeClass = 'node-completed';
          statusIconSvg = window.CyberIcons.get('check', 'w-8 h-8 text-amber-950 font-black');
        } else if (isUnlocked) {
          if (lvl.isBoss) {
            nodeClass = 'node-boss node-active';
            statusIconSvg = window.CyberIcons.get('skull', 'w-10 h-10 text-white');
          } else if (lvl.isCheckpoint) {
            nodeClass = 'node-checkpoint node-active';
            statusIconSvg = window.CyberIcons.get('shield', 'w-9 h-9 text-white');
          } else {
            nodeClass = 'node-active';
            statusIconSvg = window.CyberIcons.get('target', 'w-8 h-8 text-white');
          }
        }

        const curveOffset = Math.sin(idx * 1.5) * 55;

        html += `
          <div class="path-node-wrapper" style="transform: translateX(${curveOffset}px);">
            <button class="path-node-button ${nodeClass}" data-level-id="${lvl.id}" aria-label="${lvl.title} - ${isCompleted ? 'Complété' : (isUnlocked ? 'Débloqué' : 'Verrouillé')}">
              ${statusIconSvg}
            </button>
            <div class="node-tooltip">
              <span>${lvl.title}</span>
              <span class="text-cyan-400 font-bold">+${lvl.xp} XP</span>
              ${lvl.isBoss ? '<span class="text-rose-400 font-black">★ BOSS</span>' : ''}
              ${lvl.isCheckpoint ? '<span class="text-purple-400 font-black">★ EVAL</span>' : ''}
            </div>
          </div>
        `;
      });

      html += `</div>`;
    });

    mount.innerHTML = html;

    mount.querySelectorAll('.path-node-button').forEach(btn => {
      btn.addEventListener('click', () => {
        const levelId = btn.getAttribute('data-level-id');
        this.startLevelSession(levelId);
      });
    });
  }

  formatLessonText(text) {
    if (!text) return '';
    return text
      .replace(/`([^`]+)`/g, '<code class="px-2 py-0.5 rounded bg-slate-900 border border-cyan-800/60 text-cyan-300 font-mono text-xs font-bold">$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white font-bold">$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em class="text-amber-300 italic">$1</em>');
  }

  // ==========================================================================
  // DÉMARRAGE ET STEPPER DE SESSION
  // ==========================================================================
  startSession(levelId) {
    return this.startLevelSession(levelId);
  }

  startLevelSession(levelId) {
    const level = this.levels.find(l => l.id === levelId);
    if (!level) return;

    const levelIndex = this.levels.indexOf(level);
    const prevLevel = this.levels[levelIndex - 1];
    if (prevLevel && !this.state.completedLevels.includes(prevLevel.id)) {
      if (window.cyberAudio) window.cyberAudio.playError();
      this.triggerScreenShake();
      alert('Niveau précédent requis pour débloquer cette mission offensive.');
      return;
    }

    if (window.cyberAudio) window.cyberAudio.playTactileClick();

    this.session = {
      level: level,
      phase: (level.lessonSlides && level.lessonSlides.length > 0) ? 'lesson' : 'practice',
      slideIndex: 0,
      microStep: 1, // 1: Hook+SVG, 2: Line Clicker, 3: Token Puzzle, 4: Quick Quiz, 5: Challenge
      lineClicked: false,
      selectedTokens: [],
      quizSelectedId: null,
      quizAnswered: false,
      shuffledQuizOptions: null
    };

    const modal = document.getElementById('modal-session');
    if (modal) modal.classList.remove('hidden');

    this.renderMicroStep();
  }

  renderMicroStep() {
    const s = this.session;
    const level = s.level;
    const card = level.microCard || {};
    const body = document.getElementById('session-card-body');
    const footer = document.getElementById('session-validation-footer');
    const progFill = document.getElementById('session-glossy-bar-fill');

    if (!body || !footer) return;

    footer.className = 'duo-validation-footer';
    footer.innerHTML = '';

    // ========================================================================
    // PHASE 1 : LEÇONS APPROFONDIES MULTI-SLIDES
    // ========================================================================
    if (s.phase === 'lesson') {
      const slides = level.lessonSlides || [];
      const currentSlide = slides[s.slideIndex] || { title: level.title, bullets: [] };

      if (progFill) {
        progFill.style.width = `${((s.slideIndex + 1) / Math.max(1, slides.length)) * 100}%`;
      }

      body.innerHTML = `
        <div class="micro-card-container space-y-4">
          <div class="flex items-center justify-between">
            <span class="px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/80 text-cyan-400 font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span>${window.CyberIcons.get('book', 'w-3.5 h-3.5')}</span>
              <span>LEÇON TECHNIQUE // SLIDE ${s.slideIndex + 1}/${slides.length}</span>
            </span>
            <span class="text-xs font-mono text-amber-400 font-bold flex items-center gap-1">
              <span>${level.title}</span>
            </span>
          </div>

          <!-- Carte Principale de la Slide -->
          <div class="bg-gradient-to-br from-slate-900 via-slate-950 to-black border border-slate-800/90 p-6 rounded-3xl shadow-2xl space-y-5">
            <h3 class="text-base sm:text-lg font-black text-white font-heading flex items-center gap-2.5">
              <span class="text-cyan-400">${window.CyberIcons.get('zap', 'w-5 h-5')}</span>
              <span>${currentSlide.title}</span>
            </h3>

            <div class="space-y-3 font-mono text-xs sm:text-sm text-slate-300 leading-relaxed">
              ${currentSlide.bullets.map(bullet => `
                <div class="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80">
                  <span class="text-cyan-400 font-bold text-sm mt-0.5">➔</span>
                  <div class="flex-1">${this.formatLessonText(bullet)}</div>
                </div>
              `).join('')}
            </div>

            ${currentSlide.syntaxBox ? `
              <div class="mt-4 p-4 bg-black/90 rounded-2xl border border-cyan-500/30 font-mono text-xs space-y-2.5">
                <div class="flex items-center justify-between">
                  <div class="text-[10px] uppercase font-bold text-cyan-400 tracking-wider flex items-center gap-1.5">
                    <span>${window.CyberIcons.get('terminal', 'w-3.5 h-3.5')}</span>
                    <span>COMMANDE & SYNTAXE OFFICIELLE :</span>
                  </div>
                  <button id="btn-copy-syntax" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 hover:text-white flex items-center gap-1 transition-all" title="Copier la commande">
                    <span>${window.CyberIcons.get('copy', 'w-3 h-3')}</span>
                    <span>Copier</span>
                  </button>
                </div>
                <div class="text-cyan-300 font-bold bg-slate-950 p-3 rounded-xl border border-slate-800 text-sm overflow-x-auto flex items-center justify-between">
                  <span id="syntax-cmd-text">$ ${this.escapeHTML(currentSlide.syntaxBox.command)}</span>
                </div>
                ${currentSlide.syntaxBox.description ? `<div class="text-slate-400 text-xs leading-relaxed">${this.escapeHTML(currentSlide.syntaxBox.description)}</div>` : ''}
                ${currentSlide.syntaxBox.example ? `<div class="text-emerald-400 text-xs font-bold font-mono">Sortie : ${this.escapeHTML(currentSlide.syntaxBox.example)}</div>` : ''}
              </div>
            ` : ''}
          </div>
        </div>
      `;

      // Listener de copie
      document.getElementById('btn-copy-syntax')?.addEventListener('click', () => {
        if (currentSlide.syntaxBox && currentSlide.syntaxBox.command) {
          navigator.clipboard.writeText(currentSlide.syntaxBox.command);
          if (window.cyberAudio) window.cyberAudio.playTactileClick();
          const btn = document.getElementById('btn-copy-syntax');
          if (btn) btn.innerHTML = `<span>${window.CyberIcons.get('check', 'w-3 h-3 text-emerald-400')}</span><span class="text-emerald-400">Copié !</span>`;
          setTimeout(() => {
            if (btn) btn.innerHTML = `<span>${window.CyberIcons.get('copy', 'w-3 h-3')}</span><span>Copier</span>`;
          }, 1500);
        }
      });

      footer.classList.add('visible');
      footer.innerHTML = `
        <div class="flex items-center justify-between w-full">
          <div>
            ${s.slideIndex > 0 ? `
              <button id="btn-slide-prev" class="btn-duo-3d btn-duo-slate py-2.5 px-5 text-xs font-mono font-bold">
                <span>${window.CyberIcons.get('arrowLeft', 'w-4 h-4')}</span>
                <span>Précédent</span>
              </button>
            ` : `<div class="text-[11px] font-mono text-slate-400">Lis attentivement pour maîtriser les concepts réels.</div>`}
          </div>

          <div>
            ${s.slideIndex < slides.length - 1 ? `
              <button id="btn-slide-next" class="btn-duo-3d btn-duo-cyan py-2.5 px-6 text-xs font-mono font-bold">
                <span>Slide Suivante</span>
                <span>${window.CyberIcons.get('arrowRight', 'w-4 h-4')}</span>
              </button>
            ` : `
              <button id="btn-slide-practice" class="btn-duo-3d btn-duo-green py-2.5 px-7 text-xs font-mono font-bold">
                <span>Passer aux Exercices Pratiques</span>
                <span>${window.CyberIcons.get('arrowRight', 'w-4 h-4')}</span>
              </button>
            `}
          </div>
        </div>
      `;

      document.getElementById('btn-slide-prev')?.addEventListener('click', () => {
        if (window.cyberAudio) window.cyberAudio.playTactileClick();
        s.slideIndex--;
        this.renderMicroStep();
      });

      document.getElementById('btn-slide-next')?.addEventListener('click', () => {
        if (window.cyberAudio) window.cyberAudio.playTactileClick();
        s.slideIndex++;
        this.renderMicroStep();
      });

      document.getElementById('btn-slide-practice')?.addEventListener('click', () => {
        if (window.cyberAudio) window.cyberAudio.playSuccess();
        s.phase = 'practice';
        s.microStep = 1;
        this.renderMicroStep();
      });

      return;
    }

    // ========================================================================
    // PHASE 2 : EXERCICES PRATIQUES DUOLINGO
    // ========================================================================
    if (progFill) {
      progFill.style.width = `${(s.microStep / 5) * 100}%`;
    }

    // ÉTAPE 1 : VISUALISATION DU VECTEUR (SCHÉMA SVG ANIMÉ)
    if (s.microStep === 1) {
      body.innerHTML = `
        <div class="micro-card-container">
          <div class="flex items-center justify-between">
            <span class="px-3 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span>${window.CyberIcons.get('target', 'w-3.5 h-3.5')}</span>
              <span>MICRO-CARTE 1/4 // VISUALISATION DU VECTEUR</span>
            </span>
            <span class="text-xs font-mono text-cyan-400 font-bold">${level.title}</span>
          </div>

          <div class="micro-card-hook">
            Observe le fonctionnement sous le capot avant d'analyser le code source :
          </div>

          <div class="interactive-svg-box">
            ${card.svgVisual || '<div class="text-slate-500 font-mono text-xs">Schéma dynamique en chargement...</div>'}
          </div>
        </div>
      `;

      footer.classList.add('visible');
      footer.innerHTML = `
        <div class="text-xs text-slate-300 font-mono">Observe le flux animé puis continue vers l'audit interactif.</div>
        <button id="btn-step-next" class="btn-duo-3d btn-duo-green py-3 px-8 text-xs font-mono font-bold">
          <span>J'ai compris le flux</span>
          <span>${window.CyberIcons.get('arrowRight', 'w-4 h-4')}</span>
        </button>
      `;

      document.getElementById('btn-step-next')?.addEventListener('click', () => {
        if (window.cyberAudio) window.cyberAudio.playTactileClick();
        s.microStep = 2;
        this.renderMicroStep();
      });
      return;
    }

    // ÉTAPE 2 : LINE CLICKER (AUDIT DE CODE INTERACTIF)
    if (s.microStep === 2) {
      body.innerHTML = `
        <div class="micro-card-container">
          <div class="flex items-center justify-between">
            <span class="px-3 py-1 rounded-full bg-rose-950/80 border border-rose-800 text-rose-400 font-mono text-[10px] font-bold uppercase flex items-center gap-1.5">
              <span>${window.CyberIcons.get('code', 'w-3.5 h-3.5')}</span>
              <span>MICRO-CARTE 2/4 // AUDIT DE CODE INTERACTIF</span>
            </span>
            <span class="text-xs font-mono text-amber-400 font-bold">CLIQUE SUR LA LIGNE CRITIQUE</span>
          </div>

          <div class="micro-card-hook">
            ${card.codeSnippet.prompt}
          </div>

          <div class="code-line-clicker">
            <div class="code-clicker-header font-mono">
              <span>vuln_service.py</span>
              <span class="text-slate-500">Inspection statique</span>
            </div>
            ${card.codeSnippet.lines.map(line => `
              <div class="code-interactive-line ${s.lineClicked && line.isCritical ? 'line-correct' : ''}" data-line-num="${line.num}">
                <span class="line-num">${line.num}</span>
                <span class="line-code flex-1 font-mono">${this.escapeHTML(line.text)}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;

      body.querySelectorAll('.code-interactive-line').forEach(el => {
        el.addEventListener('click', () => {
          const num = parseInt(el.getAttribute('data-line-num'), 10);
          const lineObj = card.codeSnippet.lines.find(l => l.num === num);

          if (lineObj && lineObj.isCritical) {
            if (window.cyberAudio) window.cyberAudio.playSuccess();
            s.lineClicked = true;
            el.classList.add('line-correct');

            if (typeof confetti === 'function') {
              confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 } });
            }

            footer.className = 'duo-validation-footer visible success';
            footer.innerHTML = `
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 font-black text-lg flex items-center justify-center">
                  ${window.CyberIcons.get('check', 'w-5 h-5 text-slate-950')}
                </div>
                <div>
                  <div class="text-xs font-black text-emerald-400 font-mono">LIGNE VULNÉRABLE IDENTIFIÉE !</div>
                  <div class="text-[11px] text-slate-300 font-mono">${lineObj.note || 'Point de compromission validé.'}</div>
                </div>
              </div>
              <button id="btn-line-next" class="btn-duo-3d btn-duo-green py-2.5 px-6 text-xs">
                <span>Continuer</span>
                <span>${window.CyberIcons.get('arrowRight', 'w-4 h-4')}</span>
              </button>
            `;

            document.getElementById('btn-line-next')?.addEventListener('click', () => {
              if (window.cyberAudio) window.cyberAudio.playTactileClick();
              s.microStep = 3;
              this.renderMicroStep();
            });
          } else {
            if (window.cyberAudio) window.cyberAudio.playError();
            this.triggerScreenShake();
            this.triggerRedFlash();
            this.deductHeart();
            el.classList.add('line-wrong');
            setTimeout(() => el.classList.remove('line-wrong'), 500);
          }
        });
      });

      if (!s.lineClicked) {
        footer.classList.add('visible');
        footer.innerHTML = `<div class="text-xs text-slate-300 font-mono">Clique sur la ligne de code vulnérable pour débloquer l'étape suivante.</div>`;
      }
      return;
    }

    // ÉTAPE 3 : TOKEN PUZZLE / RECONSTITUTION TACTILE
    if (s.microStep === 3) {
      const p = card.tokenPuzzle;

      body.innerHTML = `
        <div class="micro-card-container">
          <div class="flex items-center justify-between">
            <span class="px-3 py-1 rounded-full bg-amber-950/80 border border-amber-800 text-amber-400 font-mono text-[10px] font-bold uppercase flex items-center gap-1.5">
              <span>${window.CyberIcons.get('puzzle', 'w-3.5 h-3.5')}</span>
              <span>MICRO-CARTE 3/4 // RECONSTITUTION TACTILE</span>
            </span>
            <span class="text-xs font-mono text-cyan-400 font-bold">ORDRE SYNTAXIQUE</span>
          </div>

          <div class="micro-card-hook">
            ${p.instruction}
          </div>

          <!-- Zone cible des badges assemblés -->
          <div class="token-puzzle-target font-mono" id="token-target-slot">
            ${s.selectedTokens.length === 0 ? '<span class="text-slate-500 text-xs">Clique sur les fragments ci-dessous pour assembler la commande...</span>' : ''}
            ${s.selectedTokens.map((tok, idx) => `
              <button class="token-placed-chip px-3.5 py-1.5 rounded-xl bg-cyan-950 border border-cyan-500 text-cyan-300 text-xs font-bold shadow-sm flex items-center gap-1.5 hover:bg-rose-950 hover:border-rose-500 hover:text-rose-300 transition-all cursor-pointer" data-placed-idx="${idx}" title="Cliquer pour retirer ce fragment">
                <span>${this.escapeHTML(tok)}</span>
                <span class="text-[10px] text-slate-500 hover:text-white">✕</span>
              </button>
            `).join('')}
          </div>

          <!-- Banque de badges de commande -->
          <div class="token-bank">
            ${p.tokens.map(tok => `
              <button class="token-badge-btn ${s.selectedTokens.includes(tok) ? 'used' : ''}" data-tok-val="${tok}">
                ${this.escapeHTML(tok)}
              </button>
            `).join('')}
          </div>

          <div class="flex justify-between items-center pt-1 text-xs text-slate-400 font-mono">
            <span>Astuce : tu peux cliquer sur un fragment placé pour le retirer.</span>
            <button id="btn-reset-tokens" class="text-slate-400 hover:text-white underline font-mono">Réinitialiser les blocs</button>
          </div>
        </div>
      `;

      // Clic sur un fragment placé pour le retirer
      body.querySelectorAll('.token-placed-chip').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.getAttribute('data-placed-idx'), 10);
          if (!isNaN(idx)) {
            if (window.cyberAudio) window.cyberAudio.playTactileClick();
            s.selectedTokens.splice(idx, 1);
            this.renderMicroStep();
          }
        });
      });

      document.getElementById('btn-reset-tokens')?.addEventListener('click', () => {
        if (window.cyberAudio) window.cyberAudio.playTactileClick();
        s.selectedTokens = [];
        this.renderMicroStep();
      });

      body.querySelectorAll('.token-badge-btn').forEach(b => {
        b.addEventListener('click', () => {
          if (window.cyberAudio) window.cyberAudio.playTactileClick();
          const val = b.getAttribute('data-tok-val');
          s.selectedTokens.push(val);
          this.renderMicroStep();
        });
      });

      const isComplete = s.selectedTokens.length === p.correctOrder.length;
      footer.classList.add('visible');

      if (isComplete) {
        const isMatch = s.selectedTokens.every((t, i) => t === p.correctOrder[i]);
        if (isMatch) {
          if (window.cyberAudio) window.cyberAudio.playSuccess();
          footer.className = 'duo-validation-footer visible success';
          footer.innerHTML = `
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 font-black text-lg flex items-center justify-center">
                ${window.CyberIcons.get('check', 'w-5 h-5 text-slate-950')}
              </div>
              <div class="text-xs font-black text-emerald-400 font-mono">COMMANDE PARFAITEMENT CONSTRUITE !</div>
            </div>
            <button id="btn-token-next" class="btn-duo-3d btn-duo-green py-2.5 px-6 text-xs">
              <span>Passer au Quiz</span>
              <span>${window.CyberIcons.get('arrowRight', 'w-4 h-4')}</span>
            </button>
          `;
          document.getElementById('btn-token-next')?.addEventListener('click', () => {
            if (window.cyberAudio) window.cyberAudio.playTactileClick();
            s.microStep = 4;
            this.renderMicroStep();
          });
        } else {
          if (window.cyberAudio) window.cyberAudio.playError();
          this.triggerScreenShake();
          this.deductHeart();
          footer.className = 'duo-validation-footer visible error';
          footer.innerHTML = `
            <div class="text-xs font-black text-rose-400 font-mono">Ordre syntaxique incorrect. Réessaie pour ancrer la logique.</div>
            <button id="btn-token-retry" class="btn-duo-3d btn-duo-rose py-2.5 px-6 text-xs">Recommencer</button>
          `;
          document.getElementById('btn-token-retry')?.addEventListener('click', () => {
            s.selectedTokens = [];
            this.renderMicroStep();
          });
        }
      } else {
        footer.innerHTML = `<div class="text-xs text-slate-300 font-mono">Sélectionne les fragments dans l'ordre adéquat.</div>`;
      }
      return;
    }

    // ÉTAPE 4 : QUICK QUIZ (< 3 LIGNES)
    if (s.microStep === 4) {
      const q = card.quickQuiz || { prompt: '', options: [] };

      if (!s.shuffledQuizOptions && Array.isArray(q.options)) {
        s.shuffledQuizOptions = q.options.map((opt, origIdx) => ({ ...opt, origIdx }));
        for (let i = s.shuffledQuizOptions.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [s.shuffledQuizOptions[i], s.shuffledQuizOptions[j]] = [s.shuffledQuizOptions[j], s.shuffledQuizOptions[i]];
        }
      }

      const optionsToRender = s.shuffledQuizOptions || (q.options || []);

      body.innerHTML = `
        <div class="micro-card-container">
          <div class="flex items-center justify-between">
            <span class="px-3 py-1 rounded-full bg-purple-950/80 border border-purple-800 text-purple-400 font-mono text-[10px] font-bold uppercase flex items-center gap-1.5">
              <span>${window.CyberIcons.get('zap', 'w-3.5 h-3.5')}</span>
              <span>MICRO-CARTE 4/4 // TEST D'ANCRAGE COGNITIF</span>
            </span>
            <span class="text-xs font-mono text-slate-400">Raccourcis : [1-4] ou [A-D]</span>
          </div>

          <div class="micro-card-hook">
            ${q.prompt}
          </div>

          <div class="space-y-3 pt-2">
            ${optionsToRender.map((opt, idx) => `
              <div class="quiz-option-card ${s.quizSelectedId === idx ? 'selected' : ''}" data-opt-idx="${idx}" role="button" tabindex="0">
                <div class="quiz-option-badge">${String.fromCharCode(65 + idx)}</div>
                <div class="text-xs font-mono text-slate-200 flex-1 leading-relaxed">${opt.text}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;

      if (!s.quizAnswered) {
        body.querySelectorAll('.quiz-option-card').forEach(cardEl => {
          cardEl.addEventListener('click', () => {
            if (window.cyberAudio) window.cyberAudio.playTactileClick();
            s.quizSelectedId = parseInt(cardEl.getAttribute('data-opt-idx'), 10);
            this.renderMicroStep();
          });
        });
      }

      footer.classList.add('visible');

      if (!s.quizAnswered) {
        footer.innerHTML = `
          <div class="text-xs text-slate-300 font-mono">Sélectionne une réponse technique puis valide.</div>
          <button id="btn-quiz-check" class="btn-duo-3d btn-duo-cyan py-3 px-8 text-xs font-mono font-bold" ${s.quizSelectedId === null ? 'disabled' : ''}>
            <span>Vérifier</span>
            <span>${window.CyberIcons.get('check', 'w-4 h-4')}</span>
          </button>
        `;

        document.getElementById('btn-quiz-check')?.addEventListener('click', () => {
          const chosen = optionsToRender[s.quizSelectedId];
          s.quizAnswered = true;

          if (chosen && chosen.isCorrect) {
            if (window.cyberAudio) window.cyberAudio.playSuccess();
            this.state.combo++;
            this.triggerComboBurst();

            footer.className = 'duo-validation-footer visible success';
            footer.innerHTML = `
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 font-black text-lg flex items-center justify-center">
                  ${window.CyberIcons.get('check', 'w-5 h-5 text-slate-950')}
                </div>
                <div>
                  <div class="text-xs font-black text-emerald-400 font-mono">EXCELLENT TRAVAIL ! ${this.state.combo >= 2 ? `⚡ COMBO x${this.state.combo}` : ''}</div>
                  <div class="text-[11px] text-slate-300 font-mono">${chosen.debrief}</div>
                </div>
              </div>
              <button id="btn-quiz-finish-to-challenge" class="btn-duo-3d btn-duo-green py-2.5 px-6 text-xs">
                <span>Accéder au Défi Réel</span>
                <span>${window.CyberIcons.get('arrowRight', 'w-4 h-4')}</span>
              </button>
            `;

            document.getElementById('btn-quiz-finish-to-challenge')?.addEventListener('click', () => {
              if (window.cyberAudio) window.cyberAudio.playTactileClick();
              s.microStep = 5;
              this.renderMicroStep();
            });
          } else {
            if (window.cyberAudio) window.cyberAudio.playError();
            this.triggerScreenShake();
            this.triggerRedFlash();
            this.deductHeart();

            footer.className = 'duo-validation-footer visible error';
            footer.innerHTML = `
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-rose-500 text-white font-black text-lg flex items-center justify-center">
                  ${window.CyberIcons.get('close', 'w-5 h-5 text-white')}
                </div>
                <div>
                  <div class="text-xs font-black text-rose-400 font-mono">ERREUR TECHNIQUE (-1 VIE)</div>
                  <div class="text-[11px] text-slate-300 font-mono">${chosen ? chosen.debrief : 'Option incorrecte.'}</div>
                </div>
              </div>
              <button id="btn-quiz-retry" class="btn-duo-3d btn-duo-rose py-2.5 px-6 text-xs">Réessayer</button>
            `;

            document.getElementById('btn-quiz-retry')?.addEventListener('click', () => {
              s.quizAnswered = false;
              s.quizSelectedId = null;
              if (s.shuffledQuizOptions && s.shuffledQuizOptions.length > 1) {
                for (let i = s.shuffledQuizOptions.length - 1; i > 0; i--) {
                  const j = Math.floor(Math.random() * (i + 1));
                  [s.shuffledQuizOptions[i], s.shuffledQuizOptions[j]] = [s.shuffledQuizOptions[j], s.shuffledQuizOptions[i]];
                }
              }
              this.renderMicroStep();
            });
          }
        });
      }
      return;
    }

    // ÉTAPE 5 : DÉFI D'EXPLOITATION RÉEL OU TERMINAL
    if (s.microStep === 5) {
      this.renderChallengePhase();
    }
  }

  // ==========================================================================
  // PHASE DE DÉFI RÉEL OU TERMINAL
  // ==========================================================================
  renderChallengePhase() {
    const s = this.session;
    const level = s.level;
    const body = document.getElementById('session-card-body');
    const footer = document.getElementById('session-validation-footer');

    if (!body || !footer) return;

    footer.className = 'duo-validation-footer visible';

    body.innerHTML = `
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <span class="px-3 py-1 rounded-full bg-rose-950/80 border border-rose-800 text-rose-400 font-mono text-[10px] font-bold uppercase flex items-center gap-1.5">
            <span>${window.CyberIcons.get(level.isBoss ? 'skull' : 'terminal', 'w-3.5 h-3.5')}</span>
            <span>${level.isBoss ? '★ BOSS FIGHT FINAL BOOT2ROOT ★' : 'DÉFI D\'EXPLOITATION RÉEL (SANS GUIDAGE)'}</span>
          </span>
          <span class="text-xs font-mono text-cyan-400 font-bold">+${level.xp} XP</span>
        </div>

        <div class="bg-slate-950/90 p-4 rounded-2xl border border-slate-800 text-slate-200 text-xs font-mono leading-relaxed shadow-lg">
          ${level.challenge.instructions}
        </div>

        <div id="sandbox-active-container"></div>
      </div>
    `;

    this.sandboxInstance = new CyberSandbox('sandbox-active-container');
    this.sandboxInstance.loadLevel(level);

    footer.innerHTML = `
      <div class="flex items-center gap-2 flex-1 max-w-lg">
        <input type="text" id="flag-input" placeholder="CYBER{...}" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none" aria-label="Saisie du flag de validation" />
        <button id="btn-paste-flag" class="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 text-xs font-mono flex items-center gap-1" title="Coller depuis le presse-papier">
          <span>${window.CyberIcons.get('copy', 'w-3.5 h-3.5')}</span>
          <span class="hidden sm:inline">Coller</span>
        </button>
      </div>
      <button id="btn-flag-submit" class="btn-duo-3d btn-duo-green py-2.5 px-6 text-xs">
        <span>Soumettre le Flag</span>
        <span>${window.CyberIcons.get('check', 'w-4 h-4')}</span>
      </button>
    `;

    document.getElementById('btn-paste-flag')?.addEventListener('click', async () => {
      try {
        const text = await navigator.clipboard.readText();
        const input = document.getElementById('flag-input');
        if (input && text) input.value = text.trim();
      } catch (err) {
        console.warn('Accès presse-papier restreint', err);
      }
    });

    document.getElementById('btn-flag-submit')?.addEventListener('click', () => this.submitFlag());
    document.getElementById('flag-input')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.submitFlag();
    });
  }

  async submitFlag() {
    const flagInput = document.getElementById('flag-input');
    if (!flagInput) return;
    const submitted = flagInput.value.trim();
    if (!submitted) return;

    if (window.cyberAudio) window.cyberAudio.playTactileClick();
    const level = this.session.level;

    try {
      const res = await fetch('/api/verify-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level_id: level.id, answer: submitted })
      });
      const data = await res.json();

      if (data.is_correct) {
        this.triggerVictoryCelebration(level);
      } else {
        if (window.cyberAudio) window.cyberAudio.playError();
        this.triggerScreenShake();
        this.triggerRedFlash();
        this.deductHeart();
        alert('Drapeau incorrect. Analyse la cible et inspecte les requêtes émises.');
      }
    } catch (e) {
      alert('Erreur réseau : ' + e.message);
    }
  }

  triggerVictoryCelebration(level) {
    if (level.isBoss) {
      if (window.cyberAudio) window.cyberAudio.playBossVictory();
    } else {
      if (window.cyberAudio) window.cyberAudio.playSuccess();
    }

    if (typeof confetti === 'function') {
      confetti({
        particleCount: 140,
        spread: 80,
        origin: { y: 0.65 },
        colors: ['#10b981', '#06b6d4', '#f59e0b', '#f43f5e']
      });
    }

    if (!this.state.completedLevels.includes(level.id)) {
      this.state.completedLevels.push(level.id);
      this.state.xp += level.xp;
      this.state.gems += 25;
      if (this.state.streak > this.state.maxStreak) {
        this.state.maxStreak = this.state.streak;
      }
    }

    this.saveLocalState();
    this.saveToBackend();
    this.renderHeaderWidgets();
    this.renderSidebarStats();
    this.renderLearningPath();
    this.renderRightWidgets();
    this.renderTrackSelector();

    const footer = document.getElementById('session-validation-footer');
    footer.className = 'duo-validation-footer visible success';
    footer.innerHTML = `
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-emerald-500 text-slate-950 font-black text-xl flex items-center justify-center">
          ${window.CyberIcons.get('check', 'w-6 h-6 text-slate-950')}
        </div>
        <div>
          <div class="text-sm font-black text-emerald-400 font-mono">OPÉRATION VALIDÉE (+${level.xp} XP)</div>
          <div class="text-xs text-slate-300 font-mono">Drapeau compromis et validé par l'académie offensive.</div>
        </div>
      </div>
      <button id="btn-finish-level" class="btn-duo-3d btn-duo-green py-3 px-8 text-xs font-mono font-bold">
        <span>Terminer la Mission</span>
        <span>${window.CyberIcons.get('arrowRight', 'w-4 h-4')}</span>
      </button>
    `;

    document.getElementById('btn-finish-level')?.addEventListener('click', () => {
      this.closeAllModals();
    });
  }

  deductHeart() {
    this.state.hearts = Math.max(0, this.state.hearts - 1);
    this.state.combo = 0;
    this.renderHeaderWidgets();
    this.saveLocalState();
    this.saveToBackend();

    const heartEl = document.getElementById('user-hearts-container');
    if (heartEl) {
      heartEl.classList.add('heart-broken');
      setTimeout(() => heartEl.classList.remove('heart-broken'), 600);
    }
  }

  triggerComboBurst() {
    if (this.state.combo >= 2) {
      if (window.cyberAudio) window.cyberAudio.playCombo();
      const badge = document.createElement('div');
      badge.className = 'combo-burst-badge font-mono';
      badge.innerHTML = `<span>${window.CyberIcons.get('zap', 'w-4 h-4 text-amber-300')}</span><span>COMBO x${this.state.combo} !</span>`;
      document.body.appendChild(badge);
      setTimeout(() => badge.remove(), 800);
    }
  }

  triggerScreenShake() {
    const app = document.querySelector('.app-container');
    if (app) {
      app.classList.remove('animate-shake');
      void app.offsetWidth;
      app.classList.add('animate-shake');
      setTimeout(() => app.classList.remove('animate-shake'), 450);
    }
  }

  triggerRedFlash() {
    const flash = document.createElement('div');
    flash.className = 'flash-red-overlay';
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 500);
  }

  closeAllModals() {
    document.getElementById('modal-session')?.classList.add('hidden');
    document.getElementById('modal-badges')?.classList.add('hidden');
    document.getElementById('modal-profile')?.classList.add('hidden');
    document.getElementById('modal-skill-node')?.classList.add('hidden');
    document.getElementById('modal-placement-test')?.classList.add('hidden');
    document.getElementById('modal-dojo')?.classList.add('hidden');
    document.getElementById('session-validation-footer')?.classList.remove('visible');
  }

  // ==========================================================================
  // WIDGETS ET ÉTATS DU JOUEUR (DESKTOP & MOBILE SYNCHRONISÉS)
  // ==========================================================================
  renderHeaderWidgets() {
    const streakLabel = document.getElementById('user-streak-label');
    const xpLabel = document.getElementById('user-xp-label');
    const gemsLabel = document.getElementById('user-gems-label');
    const heartsContainer = document.getElementById('user-hearts-container');

    const mobStreak = document.getElementById('mob-streak');
    const mobXp = document.getElementById('mob-xp');

    if (streakLabel) streakLabel.innerText = this.state.streak;
    if (mobStreak) mobStreak.innerText = this.state.streak;

    if (xpLabel) xpLabel.innerText = `${this.state.xp} XP`;
    if (mobXp) mobXp.innerText = `${this.state.xp} XP`;

    if (gemsLabel) gemsLabel.innerText = this.state.gems;

    if (heartsContainer) {
      heartsContainer.innerHTML = Array.from({ length: this.state.maxHearts }).map((_, i) => {
        const isAlive = i < this.state.hearts;
        return `
          <span class="w-6 h-6 flex items-center justify-center transition-all ${isAlive ? 'text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.7)]' : 'text-slate-700 opacity-40'}">
            ${window.CyberIcons.get(isAlive ? 'heart' : 'heartLost', 'w-5 h-5')}
          </span>
        `;
      }).join('');
    }
  }

  renderSidebarStats() {
    const nickname = document.getElementById('user-nickname-label');
    const avatar = document.getElementById('user-avatar-badge');
    const rankLabel = document.getElementById('user-rank-label');

    const rank = this.getOperatorRank();

    if (nickname) nickname.innerText = this.state.nickname;
    if (avatar) avatar.innerText = this.state.avatar;
    if (rankLabel) {
      rankLabel.innerText = rank.title;
      rankLabel.className = `text-[10px] font-bold ${rank.color} uppercase tracking-tight truncate`;
    }
  }

  renderRightWidgets() {
    const pct = Math.round((this.state.completedLevels.length / this.levels.length) * 100) || 0;
    const pctLabel = document.getElementById('widget-progress-pct');
    const progressBar = document.getElementById('widget-progress-bar');
    if (pctLabel) pctLabel.innerText = `${pct}%`;
    if (progressBar) progressBar.style.width = `${pct}%`;
  }

  // ==========================================================================
  // VITRINE DES BADGES & TROPHÉES
  // ==========================================================================
  openBadgesModal() {
    const modal = document.getElementById('modal-badges');
    const mount = document.getElementById('badges-grid-mount');
    const counterSub = document.getElementById('badges-counter-subtitle');
    if (!modal || !mount) return;

    const unlockedCount = this.state.unlockedBadges.length;
    if (counterSub) {
      counterSub.innerText = `${unlockedCount} / ${this.badges.length} Trophées Débloqués (${Math.round((unlockedCount / Math.max(1, this.badges.length)) * 100)}%)`;
    }

    mount.innerHTML = this.badges.map(b => {
      const isUnlocked = this.state.unlockedBadges.includes(b.id) || this.state.completedLevels.length >= 2;
      return `
        <div class="p-4 rounded-2xl border transition-all ${isUnlocked ? 'border-amber-500/60 bg-gradient-to-br from-amber-950/30 to-slate-900/80 shadow-[0_0_15px_rgba(245,158,11,0.15)]' : 'border-slate-800 bg-slate-900/40 opacity-50'} flex items-center gap-3.5">
          <div class="w-12 h-12 rounded-xl bg-slate-800/80 border ${isUnlocked ? 'border-amber-400/40 text-amber-300' : 'border-slate-700 text-slate-500'} flex items-center justify-center text-2xl flex-shrink-0 shadow-inner">
            ${b.icon}
          </div>
          <div class="min-w-0 flex-1">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-white truncate font-heading">${b.title}</span>
              <span class="text-[9px] font-bold ${isUnlocked ? 'text-amber-400' : 'text-slate-500'} uppercase font-mono">${isUnlocked ? 'DÉBLOQUÉ' : 'VERROUILLÉ'}</span>
            </div>
            <div class="text-[11px] text-slate-400 mt-0.5 leading-snug font-mono">${b.desc}</div>
          </div>
        </div>
      `;
    }).join('');

    modal.classList.remove('hidden');
  }

  // ==========================================================================
  // DOSSIER OPÉRATEUR RED TEAM
  // ==========================================================================
  openProfileModal() {
    const modal = document.getElementById('modal-profile');
    if (!modal) return;

    const rank = this.getOperatorRank();

    document.getElementById('profile-modal-name').innerText = this.state.nickname;
    document.getElementById('profile-modal-avatar').innerText = this.state.avatar;
    document.getElementById('profile-modal-xp').innerText = `${this.state.xp} XP`;
    document.getElementById('profile-modal-streak').innerText = `${this.state.maxStreak || this.state.streak} Jours`;
    document.getElementById('profile-modal-badges-count').innerText = `${this.state.completedLevels.length}/${this.levels.length}`;

    const rankBadge = document.getElementById('profile-modal-rank-badge');
    if (rankBadge) {
      rankBadge.innerText = `${rank.title} [${rank.badge}]`;
      rankBadge.className = `text-xs ${rank.color} font-bold mt-0.5`;
    }

    // Sélecteur d'avatar tactile
    const pickerRow = document.getElementById('avatar-picker-row');
    if (pickerRow) {
      const avatars = ['🥷', '💀', '🤖', '⚡', '🛡️', '🛰️'];
      pickerRow.innerHTML = avatars.map(av => `
        <button class="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700 border ${this.state.avatar === av ? 'border-cyan-400 scale-110 shadow-[0_0_8px_rgba(6,182,212,0.5)]' : 'border-slate-700'} flex items-center justify-center text-sm transition-all cursor-pointer" data-avatar-choice="${av}" title="Choisir cet avatar">
          ${av}
        </button>
      `).join('');

      pickerRow.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
          const chosen = btn.getAttribute('data-avatar-choice');
          if (chosen) {
            if (window.cyberAudio) window.cyberAudio.playTactileClick();
            this.state.avatar = chosen;
            this.saveLocalState();
            this.saveToBackend();
            this.renderSidebarStats();
            this.openProfileModal();
          }
        });
      });
    }

    modal.classList.remove('hidden');
  }

  escapeHTML(str) {
    return (str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.cyberApp = new CyberAppPro();
});

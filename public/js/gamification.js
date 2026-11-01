// ============================================================================
// CYBERRANGE PRO - MOTEUR DE GAMIFICATION AVANCÉE, RÉTENTION & ACCESSIBILITÉ
// Quêtes Quotidiennes, Série (Streak Freeze), Ligues (Leaderboard),
// Certificats Cryptographiques Signés, i18n Bilingue FR/EN & Reduced Motion
// ============================================================================

// 1. DICTIONNAIRE D'INTERNATIONALISATION (i18n BILINGUE COMPLET FR / EN)
const CYBER_TRANSLATIONS = {
  fr: {
    // Navigation & Layout
    curriculum: "Curriculum (15 Mod.)",
    skill_tree: "Arbre de Compétences",
    training_labs: "Entraînement (148 Labs)",
    badges_trophies: "Badges & Exploits",
    operator_profile: "Profil Opérateur",
    leagues_leaderboard: "Ligues & Classement",
    daily_quests_title: "Quêtes Quotidiennes",
    shop_title: "Boutique & Équipement",
    audio_sound: "Synthétiseur Audio",
    reduced_motion: "Animations Réduites",
    reduced_motion_desc: "Désactive les secousses, confettis et animations",
    language_toggle: "Langue : Français 🇫🇷",
    updates: "Mises à Jour",
    check_update: "Vérifier ↻",

    // Statistiques & Labels
    hearts_left: "VIES RESTANTES",
    streak_label: "SÉRIE ENFLAMMÉE",
    xp_label: "EXPÉRIENCE",
    gems_label: "GEMMES",
    missions_done: "MISSIONS",
    streak_freeze_name: "Gel de Flamme",
    streak_freeze_desc: "Protège ta série si tu manques un jour d'activité.",
    streak_freeze_equipped: "Gel de Flamme Actif",
    buy_freeze_btn: "Acheter Gel (50 💎)",

    // Quêtes
    quests_heading: "3 Quêtes du Jour",
    quest_reward_claim: "Réclamer",
    quest_claimed: "Réclamé ✅",
    all_quests_done: "Toutes les quêtes du jour sont accomplies !",
    quest_reset_info: "Réinitialisation quotidienne à minuit UTC.",

    // Ligues
    league_title: "Arène & Ligues Hebdomadaires",
    league_desc: "Mesure-toi aux opérateurs du monde entier. Top 3 promu chaque semaine !",
    league_bronze: "Ligue Bronze 🥉",
    league_silver: "Ligue Argent 🥈",
    league_gold: "Ligue Or 🥇",
    league_platinum: "Ligue Platine 💎",
    league_diamond: "Ligue Diamant 👑",
    zone_promotion: "Zone de Promotion 🔼",
    zone_safe: "Zone de Maintien ➖",
    zone_relegation: "Zone de Relégation 🔻",
    rank_col: "Rang",
    operator_col: "Opérateur",
    weekly_xp_col: "XP Semaine",
    status_col: "Statut",

    // Certificats & Profil
    cert_official_title: "CERTIFICAT OFFICIEL D'ACCOMPLISSEMENT",
    cert_academy_name: "CyberLab Offensive Security Academy",
    cert_awarded_to: "Ce certificat est fièrement décerné à",
    cert_recognition: "en reconnaissance de la validation intégrale et de la maîtrise opérationnelle du parcours spécialisé :",
    cert_authentic_signature: "Signature Cryptographique Vérifiée & Infalsifiable",
    cert_unique_id: "Identifiant Unique :",
    cert_hash: "Hash SHA-256 :",
    cert_print_btn: "🖨️ Imprimer / Sauvegarder en PDF",
    cert_verify_btn: "🛡️ Vérifier la Signature",
    cert_close_btn: "Fermer",
    my_certificates: "Mes Certificats Officiels",
    export_profile_json: "Exporter le Profil de Compétences (JSON)",

    // Messages
    volume_control: "Volume Sonore",
    cert_verify_live_success: "Authenticité Validée (HMAC-SHA256)",
    cert_verify_live_error: "Échec de Vérification / Falsifié",
    curriculum_levels: "Curriculum (61 Niveaux)",
    hearts_desc: "Chaque échec technique décrémente un cœur avec secousse d'écran.",
    directive_title: "CURRICULUM DE ZÉRO À PRO",
    directive_desc: "Pédagogie offensive complète et progressive : cours approfondis, schémas animés, audits de code et défis réels en laboratoire.",
    nav_dock_learn: "Parcours",
    nav_dock_tree: "Arbre",
    nav_dock_training: "Labs",
    nav_dock_badges: "Badges",
    nav_dock_profile: "Profil",
    volume_control: "Sound Volume",
    cert_verify_live_success: "Authenticity Verified (HMAC-SHA256)",
    cert_verify_live_error: "Verification Failed / Tampered",
    curriculum_levels: "Curriculum (61 Levels)",
    hearts_desc: "Each technical failure decrements a heart with screen shake.",
    directive_title: "CURRICULUM ZERO TO HERO",
    directive_desc: "Comprehensive progressive offensive curriculum: in-depth courses, animated diagrams, code audits, and hands-on labs.",
    nav_dock_learn: "Path",
    nav_dock_tree: "Tree",
    nav_dock_training: "Labs",
    nav_dock_badges: "Badges",
    nav_dock_profile: "Profile",
    reward_claimed_msg: "Récompense réclamée avec succès !",
    freeze_bought_msg: "Gel de Flamme acquis ! Ta série est désormais sous protection.",
    error_occurred: "Une erreur est survenue."
  },
  en: {
    // Navigation & Layout
    curriculum: "Curriculum (15 Mod.)",
    skill_tree: "Skill Tree",
    training_labs: "Training (148 Labs)",
    badges_trophies: "Badges & Exploits",
    operator_profile: "Operator Profile",
    leagues_leaderboard: "Leagues & Leaderboard",
    daily_quests_title: "Daily Quests",
    shop_title: "Shop & Gear",
    audio_sound: "Audio Synthesizer",
    reduced_motion: "Reduced Motion",
    reduced_motion_desc: "Disables shakes, confettis, and heavy motion",
    language_toggle: "Language: English 🇬🇧",
    updates: "Updates",
    check_update: "Check ↻",

    // Stats & Labels
    hearts_left: "REMAINING HEARTS",
    streak_label: "FIRE STREAK",
    xp_label: "EXPERIENCE",
    gems_label: "GEMS",
    missions_done: "MISSIONS",
    streak_freeze_name: "Streak Freeze",
    streak_freeze_desc: "Protects your streak if you miss a day of activity.",
    streak_freeze_equipped: "Streak Freeze Active",
    buy_freeze_btn: "Buy Freeze (50 💎)",

    // Quests
    quests_heading: "3 Daily Quests",
    quest_reward_claim: "Claim",
    quest_claimed: "Claimed ✅",
    all_quests_done: "All daily quests accomplished!",
    quest_reset_info: "Daily reset at midnight UTC.",

    // Leagues
    league_title: "Arena & Weekly Leagues",
    league_desc: "Compete against operators worldwide. Top 3 promoted weekly!",
    league_bronze: "Bronze League 🥉",
    league_silver: "Silver League 🥈",
    league_gold: "Gold League 🥇",
    league_platinum: "Platinum League 💎",
    league_diamond: "Diamond League 👑",
    zone_promotion: "Promotion Zone 🔼",
    zone_safe: "Safe Zone ➖",
    zone_relegation: "Relegation Zone 🔻",
    rank_col: "Rank",
    operator_col: "Operator",
    weekly_xp_col: "Weekly XP",
    status_col: "Status",

    // Certificates & Profile
    cert_official_title: "OFFICIAL CERTIFICATE OF COMPLETION",
    cert_academy_name: "CyberLab Offensive Security Academy",
    cert_awarded_to: "This certificate is proudly awarded to",
    cert_recognition: "in recognition of full completion and verified operational mastery of the specialized track:",
    cert_authentic_signature: "Tamper-Proof Cryptographic Signature Verified",
    cert_unique_id: "Certificate ID:",
    cert_hash: "SHA-256 Hash:",
    cert_print_btn: "🖨️ Print / Save as PDF",
    cert_verify_btn: "🛡️ Verify Signature",
    cert_close_btn: "Close",
    my_certificates: "My Official Certificates",
    export_profile_json: "Export Skill Profile (JSON)",

    // Messages
    reward_claimed_msg: "Reward successfully claimed!",
    freeze_bought_msg: "Streak Freeze acquired! Your streak is now protected.",
    error_occurred: "An error occurred."
  }
};

class CyberI18n {
  constructor() {
    this.currentLang = localStorage.getItem('cyberlab_lang') || 'fr';
    this.translations = CYBER_TRANSLATIONS;
  }

  getLanguage() {
    return this.currentLang;
  }

  setLanguage(lang) {
    if (this.translations[lang]) {
      this.currentLang = lang;
      localStorage.setItem('cyberlab_lang', lang);
      this.applyTranslations();
      return true;
    }
    return false;
  }

  toggleLanguage() {
    const nextLang = this.currentLang === 'fr' ? 'en' : 'fr';
    this.setLanguage(nextLang);
    return nextLang;
  }

  t(key, fallback = '') {
    const dict = this.translations[this.currentLang] || this.translations.fr;
    return dict[key] !== undefined ? dict[key] : (fallback || key);
  }

  applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key) {
        el.innerText = this.t(key, el.innerText);
      }
    });

    // Bouton de toggle langue
    const langBtn = document.getElementById('btn-lang-toggle');
    if (langBtn) {
      langBtn.innerHTML = this.currentLang === 'fr'
        ? '<span class="text-xs font-bold font-mono">🇫🇷 FR</span>'
        : '<span class="text-xs font-bold font-mono">🇬🇧 EN</span>';
      langBtn.title = this.t('language_toggle');
    }
  }
}

// 2. MOTEUR DE GAMIFICATION FRONTEND
class CyberGamificationUI {
  constructor() {
    this.i18n = new CyberI18n();
    const systemPrefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const savedReduced = typeof localStorage !== 'undefined' ? localStorage.getItem('cyberlab_reduced_motion') : null;
    this.isReducedMotion = savedReduced !== null ? savedReduced === 'true' : Boolean(systemPrefersReduced);
    this.quests = [];
    this.inventory = [];
    this.leaderboardData = null;
    this.certificates = [];
    this._viewingCert = null;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    this.initialized = true;

    // Application immédiate du reduced motion si mémorisé
    this.applyReducedMotion(this.isReducedMotion);

    // Initialisation i18n
    this.i18n.applyTranslations();

    // Montage des éléments UI
    this.injectSidebarButtons();
    this.injectQuestsPanel();
    this.setupEventListeners();

    // Chargement initial des données
    this.refreshAll();
  }

  // --- REDUCED MOTION TOGGLE ---
  applyReducedMotion(enabled) {
    this.isReducedMotion = Boolean(enabled);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('cyberlab_reduced_motion', this.isReducedMotion);
    }
    if (typeof document !== 'undefined') {
      if (this.isReducedMotion) {
        document.body.classList.add('reduced-motion');
        document.documentElement.classList.add('reduced-motion');
      } else {
        document.body.classList.remove('reduced-motion');
        document.documentElement.classList.remove('reduced-motion');
      }
    }
    if (typeof window !== 'undefined') {
      if (this.isReducedMotion) {
        if (window.confetti && !window._cyberOrigConfetti) {
          window._cyberOrigConfetti = window.confetti;
          window.confetti = () => {};
        }
      } else {
        if (window._cyberOrigConfetti) {
          window.confetti = window._cyberOrigConfetti;
          window._cyberOrigConfetti = null;
        }
      }
    }

    const btn = document.getElementById('btn-reduced-motion-toggle');
    if (btn) {
      btn.classList.toggle('text-cyan-400', this.isReducedMotion);
      btn.classList.toggle('bg-cyan-950/40', this.isReducedMotion);
    }
  }

  toggleReducedMotion() {
    this.applyReducedMotion(!this.isReducedMotion);
    if (window.cyberAudio) window.cyberAudio.playTactileClick();
    return this.isReducedMotion;
  }

  // --- INJECTION BOUTONS DANS LA SIDEBAR GAUCHE ---
  injectSidebarButtons() {
    const nav = document.querySelector('aside.duo-sidebar nav');
    if (!nav) return;

    // Bouton Ligues & Classement
    if (!document.getElementById('nav-leaderboard')) {
      const aLeague = document.createElement('a');
      aLeague.className = 'duo-nav-item';
      aLeague.id = 'nav-leaderboard';
      aLeague.setAttribute('role', 'button');
      aLeague.setAttribute('tabindex', '0');
      aLeague.innerHTML = `
        <span class="w-5 h-5 flex items-center justify-center text-amber-400">🏆</span>
        <span data-i18n="leagues_leaderboard">${this.i18n.t('leagues_leaderboard')}</span>
      `;
      aLeague.addEventListener('click', () => this.openLeaderboardModal());
      nav.appendChild(aLeague);
    }

    // Bouton Boutique & Gel de Flamme
    if (!document.getElementById('nav-shop')) {
      const aShop = document.createElement('a');
      aShop.className = 'duo-nav-item';
      aShop.id = 'nav-shop';
      aShop.setAttribute('role', 'button');
      aShop.setAttribute('tabindex', '0');
      aShop.innerHTML = `
        <span class="w-5 h-5 flex items-center justify-center text-sky-400">🧊</span>
        <span data-i18n="shop_title">${this.i18n.t('shop_title')}</span>
      `;
      aShop.addEventListener('click', () => this.openShopModal());
      nav.appendChild(aShop);
    }

    // Contrôles en bas de sidebar : Volume, Langue & Reduced Motion
    const bottomControls = document.querySelector('aside.duo-sidebar .pt-4');
    if (bottomControls && !document.getElementById('audio-volume-slider')) {
      const volBox = document.createElement('div');
      volBox.id = 'audio-volume-control-box';
      volBox.className = 'flex items-center gap-2 px-2.5 py-1.5 bg-slate-900/60 rounded-xl border border-slate-800 text-[11px] font-mono';
      const curVol = window.cyberAudio ? window.cyberAudio.getVolume() : 0.7;
      volBox.innerHTML = `
        <span title="${this.i18n.t('volume_control')}">🔊</span>
        <input id="audio-volume-slider" type="range" min="0" max="1" step="0.05" value="${curVol}" class="flex-1 accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer" aria-label="${this.i18n.t('volume_control')}">
        <span id="audio-volume-pct" class="text-[10px] text-cyan-400 font-bold min-w-[28px] text-right">${Math.round(curVol * 100)}%</span>
      `;
      bottomControls.insertBefore(volBox, bottomControls.firstChild);

      const slider = document.getElementById('audio-volume-slider');
      slider?.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        if (window.cyberAudio) window.cyberAudio.setVolume(val);
        const pctEl = document.getElementById('audio-volume-pct');
        if (pctEl) pctEl.innerText = Math.round(val * 100) + '%';
      });
    }

    if (bottomControls && !document.getElementById('btn-lang-toggle')) {
      const row = document.createElement('div');
      row.className = 'flex items-center gap-2 pt-1';
      row.innerHTML = `
        <button id="btn-lang-toggle" class="flex-1 px-3 py-2 rounded-xl text-xs font-mono font-bold bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 flex items-center justify-center gap-2 transition-all" title="${this.i18n.t('language_toggle')}">
          <span>${this.i18n.getLanguage() === 'fr' ? '🇫🇷 FR' : '🇬🇧 EN'}</span>
        </button>
        <button id="btn-reduced-motion-toggle" class="px-3 py-2 rounded-xl text-xs font-mono font-bold bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 flex items-center justify-center transition-all ${this.isReducedMotion ? 'text-cyan-400 bg-cyan-950/40' : ''}" title="${this.i18n.t('reduced_motion')}">
          <span>🌀 Motion</span>
        </button>
      `;
      bottomControls.appendChild(row);

      document.getElementById('btn-lang-toggle')?.addEventListener('click', () => {
        this.i18n.toggleLanguage();
        if (window.cyberAudio) window.cyberAudio.playTactileClick();
        this.refreshAll();
      });

      document.getElementById('btn-reduced-motion-toggle')?.addEventListener('click', () => {
        this.toggleReducedMotion();
      });
    }

    // Ajout bouton Certificats & Export JSON dans la modale profil
    const profileModalBody = document.querySelector('#modal-profile .modal-content-card');
    if (profileModalBody && !document.getElementById('btn-open-certificates')) {
      const actionsDiv = document.createElement('div');
      actionsDiv.className = 'pt-2 space-y-2 border-t border-slate-800/80';
      actionsDiv.innerHTML = `
        <button id="btn-open-certificates" class="w-full text-xs text-amber-400 hover:text-amber-300 font-bold py-2.5 px-4 rounded-xl border border-amber-900/40 hover:bg-amber-950/30 transition-all flex items-center justify-center gap-2">
          <span>🎓</span>
          <span data-i18n="my_certificates">${this.i18n.t('my_certificates')}</span>
        </button>
        <button id="btn-export-profile-json" class="w-full text-xs text-cyan-400 hover:text-cyan-300 font-bold py-2.5 px-4 rounded-xl border border-cyan-900/40 hover:bg-cyan-950/30 transition-all flex items-center justify-center gap-2">
          <span>💾</span>
          <span data-i18n="export_profile_json">${this.i18n.t('export_profile_json')}</span>
        </button>
      `;
      profileModalBody.insertBefore(actionsDiv, document.getElementById('btn-reset-data'));

      document.getElementById('btn-open-certificates')?.addEventListener('click', () => {
        this.openCertificatesModal();
      });

      document.getElementById('btn-export-profile-json')?.addEventListener('click', () => {
        this.exportProfileJSON();
      });
    }
  }

  // --- INJECTION PANNEAU QUÊTES QUOTIDIENNES DANS COLONNE 3 ---
  injectQuestsPanel() {
    const rightPanel = document.querySelector('aside.duo-right-panel');
    if (!rightPanel || document.getElementById('widget-daily-quests')) return;

    const questsWidget = document.createElement('div');
    questsWidget.id = 'widget-daily-quests';
    questsWidget.className = 'p-4 bg-slate-900/70 rounded-2xl border border-slate-800/80 space-y-3 font-mono shadow-md';
    questsWidget.innerHTML = `
      <div class="flex justify-between items-center pb-1 border-b border-slate-800/60">
        <span class="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-2">
          <span>⚡</span>
          <span data-i18n="daily_quests_title">${this.i18n.t('daily_quests_title')}</span>
        </span>
        <span id="streak-freeze-badge-slot"></span>
      </div>
      <div id="quests-list-container" class="space-y-2.5">
        <div class="text-[11px] text-slate-400 italic">Chargement des objectifs...</div>
      </div>
    `;

    // Insérer avant ou après les jauges
    rightPanel.appendChild(questsWidget);
  }

  setupEventListeners() {
    // Raccourci clavier : Q pour quêtes, L pour ligues
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (e.key === 'q' || e.key === 'Q') {
        // Toggle ou focus quêtes
        document.getElementById('widget-daily-quests')?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Suivi de quête direct depuis l'interface / outils
  async trackQuest(questKey, amount = 1) {
    try {
      const res = await fetch('/api/gamification/quests/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quest_key: questKey, amount })
      });
      const data = await res.json();
      if (data.success) {
        await this.loadQuests();
      }
      return data;
    } catch (err) {
      console.warn('[GAMIFICATION] Erreur track quest :', err.message);
    }
  }

  // --- RAFRAÎCHISSEMENT GLOBAL DES DONNÉES ---
  async refreshAll() {
    await Promise.all([
      this.loadQuests(),
      this.loadInventory(),
      this.loadLeaderboard()
    ]);
  }

  // --- GESTION DES QUÊTES QUOTIDIENNES ---
  async loadQuests() {
    try {
      const res = await fetch('/api/gamification/quests');
      const data = await res.json();
      if (data.success && Array.isArray(data.quests)) {
        this.quests = data.quests;
        this.renderQuestsWidget();
      }
    } catch (err) {
      console.warn('[GAMIFICATION] Erreur chargement quêtes :', err.message);
    }
  }

  renderQuestsWidget() {
    const container = document.getElementById('quests-list-container');
    if (!container) return;

    if (!this.quests.length) {
      container.innerHTML = `<div class="text-xs text-slate-400">${this.i18n.t('all_quests_done')}</div>`;
      return;
    }

    container.innerHTML = this.quests.map(q => {
      const pct = Math.min(100, Math.round((q.progress / q.target) * 100));
      const isCompleted = q.completed || q.progress >= q.target;
      const isClaimed = q.claimed;

      return `
        <div class="quest-card ${isCompleted ? 'quest-completed' : ''} p-2.5 space-y-1.5 text-xs">
          <div class="flex items-start justify-between gap-2">
            <div class="font-bold text-slate-200 leading-snug">${q.title}</div>
            <div class="flex items-center gap-1 font-mono text-[10px] text-emerald-400 flex-shrink-0">
              <span>+${q.gem_reward}💎</span>
              <span>+${q.xp_reward}XP</span>
            </div>
          </div>
          <div class="text-[10px] text-slate-400">${q.description}</div>
          <div class="flex items-center gap-2 pt-1">
            <div class="quest-progress-track flex-1">
              <div class="quest-progress-fill" style="width: ${pct}%"></div>
            </div>
            <span class="text-[10px] font-black text-slate-300 font-mono">${q.progress}/${q.target}</span>
          </div>
          <div class="pt-1 flex justify-end">
            ${isClaimed
              ? `<span class="text-[10px] font-bold text-slate-500">${this.i18n.t('quest_claimed')}</span>`
              : isCompleted
                ? `<button onclick="window.cyberGamification.claimQuest('${q.id}')" class="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[11px] shadow-sm font-mono transition-all animate-pulse">
                    ${this.i18n.t('quest_reward_claim')} 💎
                   </button>`
                : `<span class="text-[10px] text-slate-400 font-mono">${pct}%</span>`
            }
          </div>
        </div>
      `;
    }).join('');
  }

  async claimQuest(questId) {
    try {
      const res = await fetch('/api/gamification/quests/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quest_id: questId })
      });
      const data = await res.json();
      if (data.success) {
        if (window.cyberAudio) window.cyberAudio.playQuestComplete();
        // Confetti sauf si reduced motion
        if (!this.isReducedMotion && typeof confetti === 'function') {
          confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
        }
        await this.loadQuests();
        if (window.cyberApp && window.cyberApp.syncWithBackend) {
          await window.cyberApp.syncWithBackend();
          window.cyberApp.renderHeaderWidgets();
          window.cyberApp.renderSidebarStats();
        }
      } else {
        alert(data.error || this.i18n.t('error_occurred'));
      }
    } catch (err) {
      console.error('[GAMIFICATION] Erreur claim quest :', err);
    }
  }

  // --- GESTION DE L'INVENTAIRE & GEL DE FLAMME ---
  async loadInventory() {
    try {
      const res = await fetch('/api/gamification/inventory');
      const data = await res.json();
      if (data.success && Array.isArray(data.inventory)) {
        this.inventory = data.inventory;
        this.renderStreakFreezeBadge();
      }
    } catch (err) {
      console.warn('[GAMIFICATION] Erreur chargement inventaire :', err.message);
    }
  }

  renderStreakFreezeBadge() {
    const slot = document.getElementById('streak-freeze-badge-slot');
    if (!slot) return;

    const freeze = this.inventory.find(i => i.id === 'streak_freeze');
    const count = freeze ? freeze.quantity : 0;

    if (count > 0) {
      slot.innerHTML = `
        <span class="streak-freeze-badge cursor-pointer" onclick="window.cyberGamification.openShopModal()" title="Gel de Flamme actif (${count} en réserve)">
          <span>🧊</span>
          <span>${count}</span>
        </span>
      `;
    } else {
      slot.innerHTML = `
        <button onclick="window.cyberGamification.openShopModal()" class="text-[10px] font-bold text-sky-400 hover:text-sky-300 underline font-mono" title="Acheter un Gel de Flamme">
          +🧊 Gel
        </button>
      `;
    }
  }

  // --- MODALE BOUTIQUE / SHOP ---
  openShopModal() {
    let modal = document.getElementById('modal-cyber-shop');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'modal-cyber-shop';
      modal.className = 'modal-overlay hidden z-[180]';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      document.body.appendChild(modal);
    }

    const freezeItem = this.inventory.find(i => i.id === 'streak_freeze') || { quantity: 0, cost: 50 };
    const heartsItem = this.inventory.find(i => i.id === 'heart_refill') || { quantity: 0, cost: 40 };

    modal.innerHTML = `
      <div class="modal-content-card max-w-lg p-6 font-mono space-y-5">
        <div class="flex justify-between items-center border-b border-slate-800 pb-3">
          <div class="flex items-center gap-2.5">
            <span class="text-2xl">🧊</span>
            <div>
              <h2 class="text-base font-black text-sky-400 font-heading" data-i18n="shop_title">${this.i18n.t('shop_title')}</h2>
              <div class="text-[11px] text-slate-400">${this.i18n.t('streak_freeze_desc')}</div>
            </div>
          </div>
          <button onclick="document.getElementById('modal-cyber-shop').classList.add('hidden')" class="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center">
            ✕
          </button>
        </div>

        <div class="space-y-3">
          <!-- Article 1 : Gel de Flamme -->
          <div class="p-4 bg-slate-900/80 rounded-2xl border border-sky-500/30 flex items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-xl bg-sky-950 border border-sky-500/40 flex items-center justify-center text-2xl">
                🧊
              </div>
              <div>
                <div class="font-black text-slate-100 text-sm" data-i18n="streak_freeze_name">${this.i18n.t('streak_freeze_name')}</div>
                <div class="text-[11px] text-slate-400">Possédé : <span class="text-sky-300 font-bold">${freezeItem.quantity}</span></div>
              </div>
            </div>
            <button onclick="window.cyberGamification.buyItem('streak_freeze')" class="px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs font-mono shadow-md transition-all">
              50 💎
            </button>
          </div>

          <!-- Article 2 : Recharge de Vies -->
          <div class="p-4 bg-slate-900/80 rounded-2xl border border-rose-500/30 flex items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-xl bg-rose-950 border border-rose-500/40 flex items-center justify-center text-2xl">
                ❤️
              </div>
              <div>
                <div class="font-black text-slate-100 text-sm">Recharge Complète de Vies</div>
                <div class="text-[11px] text-slate-400">Restaure instantanément 5 cœurs complets</div>
              </div>
            </div>
            <button onclick="window.cyberGamification.buyItem('heart_refill')" class="px-3.5 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 font-black text-xs font-mono shadow-md transition-all">
              40 💎
            </button>
          </div>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    if (window.cyberAudio) window.cyberAudio.playTactileClick();
  }

  async buyItem(itemId) {
    try {
      const res = await fetch('/api/gamification/shop/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item_id: itemId, quantity: 1 })
      });
      const data = await res.json();
      if (data.success) {
        if (window.cyberAudio) {
          window.cyberAudio.playPurchase();
          if (itemId === 'streak_freeze') window.cyberAudio.playFreezeSound();
        }
        await this.loadInventory();
        if (window.cyberApp && window.cyberApp.syncWithBackend) {
          await window.cyberApp.syncWithBackend();
          window.cyberApp.renderHeaderWidgets();
          window.cyberApp.renderSidebarStats();
        }
        this.openShopModal(); // Rafraîchir modale
      } else {
        alert(data.error || this.i18n.t('error_occurred'));
      }
    } catch (err) {
      console.error('[GAMIFICATION] Erreur achat shop :', err);
    }
  }

  // --- GESTION DU CLASSEMENT & LIGUES ---
  async loadLeaderboard() {
    try {
      const res = await fetch('/api/gamification/leaderboard');
      const data = await res.json();
      if (data.success) {
        this.leaderboardData = data;
      }
    } catch (err) {
      console.warn('[GAMIFICATION] Erreur chargement leaderboard :', err.message);
    }
  }

  openLeaderboardModal() {
    let modal = document.getElementById('modal-leaderboard');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'modal-leaderboard';
      modal.className = 'modal-overlay hidden z-[180]';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      document.body.appendChild(modal);
    }

    if (!this.leaderboardData) {
      this.loadLeaderboard().then(() => this.openLeaderboardModal());
      return;
    }

    const d = this.leaderboardData;
    const currentLeague = d.league_info;

    modal.innerHTML = `
      <div class="modal-content-card max-w-2xl p-6 font-mono space-y-4">
        <div class="flex justify-between items-center border-b border-slate-800 pb-3">
          <div class="flex items-center gap-3">
            <span class="text-3xl">${currentLeague.icon}</span>
            <div>
              <h2 class="text-lg font-black text-amber-400 font-heading">${currentLeague.name}</h2>
              <div class="text-[11px] text-slate-400" data-i18n="league_desc">${this.i18n.t('league_desc')}</div>
            </div>
          </div>
          <button onclick="document.getElementById('modal-leaderboard').classList.add('hidden')" class="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center">
            ✕
          </button>
        </div>

        <!-- Paliers de Ligues -->
        <div class="flex items-center justify-between gap-1.5 p-2 bg-slate-950/80 rounded-xl border border-slate-800 text-[11px] overflow-x-auto">
          ${d.leagues.map(l => `
            <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${l.id === d.current_league ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold' : 'text-slate-500'}">
              <span>${l.icon}</span>
              <span class="hidden sm:inline">${l.name.replace('Ligue ', '')}</span>
            </div>
          `).join('')}
        </div>

        <!-- Légende des Zones -->
        <div class="flex items-center justify-between text-[11px] px-1 text-slate-400">
          <span class="flex items-center gap-1.5 text-emerald-400 font-bold">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Top 3: Promotion 🔼
          </span>
          <span class="flex items-center gap-1.5 text-slate-400 font-bold">
            <span class="w-2.5 h-2.5 rounded-full bg-slate-600"></span> Maintien ➖
          </span>
          <span class="flex items-center gap-1.5 text-rose-400 font-bold">
            <span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Relégation 🔻
          </span>
        </div>

        <!-- Tableau des 15 Participants -->
        <div class="max-h-80 overflow-y-auto space-y-1.5 pr-1">
          ${d.leaderboard.map(p => {
            let zoneClass = 'league-zone-safe';
            if (p.status === 'promotion') zoneClass = 'league-zone-promotion';
            if (p.status === 'relegation') zoneClass = 'league-zone-relegation';
            const isPlayer = p.is_player ? 'league-player-row' : '';

            return `
              <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs ${zoneClass} ${isPlayer}">
                <div class="flex items-center gap-3">
                  <div class="w-6 text-center font-black ${p.rank <= 3 ? 'text-amber-400' : 'text-slate-500'}">
                    #${p.rank}
                  </div>
                  <div class="text-base select-none">${p.avatar}</div>
                  <div class="font-bold text-slate-200">
                    ${p.nickname}
                    ${p.is_player ? '<span class="text-[10px] text-cyan-400 font-mono ml-1.5">(Toi)</span>' : ''}
                  </div>
                </div>
                <div class="font-mono font-black text-cyan-400">
                  ${p.xp} XP
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    if (window.cyberAudio) window.cyberAudio.playTactileClick();
  }

  // --- CERTIFICATS OFFICIELS & EXPORT JSON ---
  async openCertificatesModal() {
    let modal = document.getElementById('modal-certificates-list');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'modal-certificates-list';
      modal.className = 'modal-overlay hidden z-[190]';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      document.body.appendChild(modal);
    }

    try {
      const res = await fetch('/api/gamification/certificates');
      const data = await res.json();
      this.certificates = data.success ? data.certificates : [];
    } catch {}

    const certs = this.certificates;

    modal.innerHTML = `
      <div class="modal-content-card max-w-xl p-6 font-mono space-y-4">
        <div class="flex justify-between items-center border-b border-slate-800 pb-3">
          <div class="flex items-center gap-2.5">
            <span class="text-2xl">🎓</span>
            <h2 class="text-base font-black text-amber-400 font-heading" data-i18n="my_certificates">${this.i18n.t('my_certificates')}</h2>
          </div>
          <button onclick="document.getElementById('modal-certificates-list').classList.add('hidden')" class="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center">
            ✕
          </button>
        </div>

        <div class="space-y-2.5 max-h-96 overflow-y-auto">
          ${certs.length === 0 ? `
            <div class="p-6 text-center text-slate-400 space-y-3">
              <p>Aucun certificat émis pour le moment. Termine un parcours complet ou la Campagne Saison 1 pour recevoir ton diplôme cryptographique officiel !</p>
              <button onclick="window.cyberGamification.requestCertificate('campaign-season-1')" class="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs font-mono transition-all">
                Générer Certificat Campagne Saison 1
              </button>
            </div>
          ` : certs.map(c => `
            <div class="p-3.5 bg-slate-900/80 rounded-2xl border border-amber-500/30 flex items-center justify-between gap-3">
              <div>
                <div class="font-bold text-slate-100 text-xs">${c.track_title}</div>
                <div class="text-[10px] text-slate-400 font-mono mt-0.5">Émis le : ${new Date(c.issued_at).toLocaleDateString()}</div>
                <div class="text-[9px] text-amber-400/80 font-mono truncate max-w-xs">${c.id}</div>
              </div>
              <button onclick="window.cyberGamification.viewCertificate('${c.id}')" class="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs font-mono transition-all">
                Afficher 📜
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    if (window.cyberAudio) window.cyberAudio.playTactileClick();
  }

  async requestCertificate(trackId) {
    try {
      const res = await fetch('/api/gamification/certificate/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ track_id: trackId })
      });
      const data = await res.json();
      if (data.success && data.certificate) {
        this.viewCertificateDirect(data.certificate);
      }
    } catch (err) {
      alert('Erreur lors de la génération : ' + err.message);
    }
  }

  viewCertificate(certId) {
    const cert = this.certificates.find(c => c.id === certId);
    if (cert) this.viewCertificateDirect(cert);
  }

  viewCertificateDirect(cert) {
    this._viewingCert = cert;
    let modal = document.getElementById('modal-certificate-viewer');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'modal-certificate-viewer';
      modal.className = 'modal-overlay hidden z-[200] overflow-y-auto p-4';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="max-w-3xl w-full mx-auto my-6 space-y-4">
        <!-- Barre d'actions supérieure (non imprimable) -->
        <div class="flex flex-wrap justify-between items-center bg-slate-950 p-3 rounded-2xl border border-slate-800 no-print font-mono text-xs gap-2">
          <div id="cert-live-verification-status" class="flex items-center gap-2 text-cyan-400 font-bold">
            <button id="btn-verify-cert-signature" onclick="window.cyberGamification.verifyCurrentCertificate('${cert.id}')" class="px-2.5 py-1.5 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-300 font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer">
              <span>🛡️</span>
              <span data-i18n="cert_verify_btn">${this.i18n.t('cert_verify_btn')}</span>
            </button>
            <span class="text-[11px] text-slate-400 font-mono">(HMAC-SHA256)</span>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="window.print()" class="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition-all">
              ${this.i18n.t('cert_print_btn')}
            </button>
            <button onclick="document.getElementById('modal-certificate-viewer').classList.add('hidden')" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-lg">
              ${this.i18n.t('cert_close_btn')}
            </button>
          </div>
        </div>

        <!-- Diplôme Élégant Imprimable -->
        <div class="certificate-frame">
          <div class="certificate-watermark">CYBERLAB</div>

          <div class="certificate-header-crest">
            <div class="certificate-seal">
              <span class="text-3xl text-amber-400">🛡️</span>
            </div>
          </div>

          <div class="text-center space-y-3 font-mono">
            <h1 class="text-lg sm:text-xl font-black text-amber-400 tracking-widest uppercase font-heading">
              ${this.i18n.t('cert_official_title')}
            </h1>
            <p class="text-xs text-slate-400 uppercase tracking-widest font-bold">
              ${this.i18n.t('cert_academy_name')}
            </p>

            <div class="py-4">
              <p class="text-xs text-slate-400 italic">${this.i18n.t('cert_awarded_to')}</p>
              <div class="text-2xl sm:text-3xl font-black text-white font-heading mt-1 border-b-2 border-amber-500/40 inline-block px-8 py-1">
                ${cert.recipient_name}
              </div>
            </div>

            <p class="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
              ${this.i18n.t('cert_recognition')}
            </p>

            <div class="p-3 bg-slate-900/90 rounded-xl border border-amber-500/50 inline-block text-sm font-black text-amber-300">
              ${cert.track_title}
            </div>

            <!-- Signature & Hash Infalsifiables -->
            <div class="pt-6 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left text-[10px] text-slate-400 font-mono">
              <div class="space-y-1">
                <div><strong class="text-slate-300">${this.i18n.t('cert_unique_id')}</strong> ${cert.id}</div>
                <div><strong class="text-slate-300">Date d'émission :</strong> ${new Date(cert.issued_at).toUTCString()}</div>
                <div><strong class="text-slate-300">Autorité :</strong> CYBERRANGE-PRO-CA-2026</div>
              </div>
              <div class="space-y-1 overflow-hidden">
                <div class="truncate"><strong class="text-slate-300">${this.i18n.t('cert_hash')}</strong></div>
                <div class="p-1 bg-slate-950 rounded text-[9px] text-cyan-400 font-mono break-all select-all">
                  ${cert.certificate_hash}
                </div>
                <div class="truncate"><strong class="text-slate-300">Signature HMAC-SHA256 :</strong></div>
                <div class="p-1 bg-slate-950 rounded text-[9px] text-emerald-400 font-mono break-all select-all">
                  ${cert.signature}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    if (window.cyberAudio) window.cyberAudio.playSuccess();
  }

  // Vérification cryptographique en direct
  async verifyCurrentCertificate(certId) {
    const cert = this._viewingCert || this.certificates.find(c => c.id === certId);
    if (!cert) return;
    const badgeSlot = document.getElementById('cert-live-verification-status');
    if (badgeSlot) {
      badgeSlot.innerHTML = '<span class="text-amber-400 animate-pulse font-mono text-xs">Vérification cryptographique en cours...</span>';
    }
    try {
      const res = await fetch('/api/gamification/certificate/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ certificate: cert })
      });
      const data = await res.json();
      if (badgeSlot) {
        if (data.success && data.valid) {
          badgeSlot.innerHTML = `
            <span class="text-emerald-400 font-bold flex items-center gap-1.5 font-mono text-xs">
              <span>✅</span>
              <span>Authenticité Certifiée (${data.authority || 'CA-2026'})</span>
            </span>
          `;
          if (window.cyberAudio) window.cyberAudio.playSuccess();
        } else {
          badgeSlot.innerHTML = `
            <span class="text-rose-400 font-bold flex items-center gap-1.5 font-mono text-xs">
              <span>❌</span>
              <span>${data.reason || 'Signature invalide ou altérée'}</span>
            </span>
          `;
          if (window.cyberAudio) window.cyberAudio.playHeartLoss();
        }
      }
    } catch (e) {
      if (badgeSlot) badgeSlot.innerHTML = `<span class="text-rose-400 font-mono text-xs">Erreur : ${e.message}</span>`;
    }
  }

  // --- EXPORT DE PROFIL EN JSON PORTABLE ---
  async exportProfileJSON() {
    try {
      const res = await fetch('/api/gamification/profile/export');
      const data = await res.json();

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cyberlab-profile-${data.operator ? data.operator.nickname : 'player'}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      if (window.cyberAudio) window.cyberAudio.playSuccess();
    } catch (err) {
      alert('Erreur lors de l\'export du profil : ' + err.message);
    }
  }
}

// Instance globale et auto-initialisation
window.cyberGamification = new CyberGamificationUI();

// Auto-démarrage après le DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => window.cyberGamification.init());
} else {
  window.cyberGamification.init();
}

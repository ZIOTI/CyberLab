// ============================================================================
// CYBERLAB GAMIFICATION PLATFORM - GAMIFICATION MANAGER
// Quêtes Quotidiennes, Série (Streak) & Gel de Flamme (Streak Freeze),
// Ligues & Classement (Leaderboard), Certificats Cryptographiques & Profil
// Moteur Node.js natif + node:sqlite + node:crypto (Zéro dépendance externe)
// ============================================================================

const crypto = require('node:crypto');

const LEAGUES = [
  { id: 'bronze', name: 'Ligue Bronze', icon: '🥉', min_xp: 0, tier: 1, promotion_rank: 3, relegation_rank: null },
  { id: 'silver', name: 'Ligue Argent', icon: '🥈', min_xp: 500, tier: 2, promotion_rank: 3, relegation_rank: 11 },
  { id: 'gold', name: 'Ligue Or', icon: '🥇', min_xp: 1500, tier: 3, promotion_rank: 3, relegation_rank: 11 },
  { id: 'platinum', name: 'Ligue Platine', icon: '💎', min_xp: 3500, tier: 4, promotion_rank: 3, relegation_rank: 11 },
  { id: 'diamond', name: 'Ligue Diamant', icon: '👑', min_xp: 7500, tier: 5, promotion_rank: null, relegation_rank: 11 }
];

const SHOP_ITEMS = {
  streak_freeze: {
    id: 'streak_freeze',
    name: 'Gel de Flamme (Streak Freeze)',
    description: 'Protège ta série (streak) d\'un jour d\'inactivité. Se consomme automatiquement si tu manques un jour.',
    cost: 50,
    icon: '🧊',
    type: 'consumable'
  },
  heart_refill: {
    id: 'heart_refill',
    name: 'Recharge Complète de Vies (+5 ❤️)',
    description: 'Restaure immédiatement ta jauge à 5 cœurs complets.',
    cost: 40,
    icon: '❤️',
    type: 'consumable'
  },
  double_xp: {
    id: 'double_xp',
    name: 'Booster Double XP Tactique',
    description: 'Multiplie par 2 les gains d\'expérience sur les prochains défis.',
    cost: 60,
    icon: '⚡',
    type: 'boost'
  }
};

class GamificationManager {
  constructor(db, trainingManager, skillTreeManager) {
    this.db = db;
    this.trainingManager = trainingManager;
    this.skillTreeManager = skillTreeManager;
    this.hmacSecret = process.env.CYBERLAB_CERT_SECRET || 'CYBERLAB_OFFENSIVE_ACADEMY_ROOT_CERT_SIGNING_KEY_2026';
    this.initTables();
  }

  // 1. Initialisation des tables SQLite dans cyberrange.db
  initTables() {
    if (!this.db) return;

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS user_daily_quests (
        id TEXT PRIMARY KEY,
        player_id TEXT NOT NULL,
        quest_date TEXT NOT NULL,
        quest_key TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        target INTEGER NOT NULL,
        progress INTEGER DEFAULT 0,
        xp_reward INTEGER NOT NULL,
        gem_reward INTEGER NOT NULL,
        completed INTEGER DEFAULT 0,
        claimed INTEGER DEFAULT 0,
        created_at TEXT
      );

      CREATE TABLE IF NOT EXISTS user_inventory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        player_id TEXT NOT NULL,
        item_id TEXT NOT NULL,
        item_name TEXT NOT NULL,
        item_type TEXT DEFAULT 'consumable',
        quantity INTEGER DEFAULT 0,
        is_equipped INTEGER DEFAULT 0,
        metadata TEXT DEFAULT '{}',
        updated_at TEXT,
        UNIQUE(player_id, item_id)
      );

      CREATE TABLE IF NOT EXISTS user_league_state (
        player_id TEXT PRIMARY KEY,
        current_league TEXT DEFAULT 'bronze',
        weekly_xp INTEGER DEFAULT 0,
        week_id TEXT,
        cohort_seed TEXT,
        updated_at TEXT
      );

      CREATE TABLE IF NOT EXISTS user_certificates (
        id TEXT PRIMARY KEY,
        player_id TEXT NOT NULL,
        track_id TEXT NOT NULL,
        track_title TEXT NOT NULL,
        recipient_name TEXT NOT NULL,
        issued_at TEXT NOT NULL,
        certificate_hash TEXT NOT NULL,
        signature TEXT NOT NULL,
        metadata TEXT DEFAULT '{}'
      );

      CREATE TABLE IF NOT EXISTS user_state (
        id TEXT PRIMARY KEY,
        nickname TEXT DEFAULT 'Opérateur RedTeam',
        avatar TEXT DEFAULT '🥷',
        theme TEXT DEFAULT 'dark',
        xp INTEGER DEFAULT 0,
        streak INTEGER DEFAULT 1,
        max_streak INTEGER DEFAULT 1,
        hearts INTEGER DEFAULT 5,
        combo INTEGER DEFAULT 0,
        gems INTEGER DEFAULT 100,
        completed_levels TEXT DEFAULT '[]',
        unlocked_badges TEXT DEFAULT '[]',
        last_activity_date TEXT,
        updated_at TEXT
      );
    `);

    // Migration ascendante de user_state pour last_activity_date
    try {
      this.db.exec("ALTER TABLE user_state ADD COLUMN last_activity_date TEXT");
    } catch (e) {}
  }

  // Garantit la présence d'un enregistrement joueur valide dans user_state
  ensurePlayerState(playerId = 'current_player') {
    if (!this.db) return;
    try {
      this.db.prepare(`
        INSERT OR IGNORE INTO user_state (id, nickname, avatar, theme, xp, streak, max_streak, hearts, combo, gems, completed_levels, unlocked_badges, updated_at)
        VALUES (?, 'Opérateur RedTeam', '🥷', 'dark', 0, 1, 1, 5, 0, 100, '[]', '[]', datetime('now'))
      `).run(playerId);
    } catch (e) {}
  }

  // Helper date ISO du jour YYYY-MM-DD
  getTodayDateString() {
    return new Date().toISOString().slice(0, 10);
  }

  // Helper identifiant de semaine ISO (ex: 2026-W44)
  getCurrentWeekId(date = new Date()) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
  }

  // ==========================================================================
  // SECTION 1 : QUÊTES QUOTIDIENNES (DAILY QUESTS)
  // ==========================================================================

  getDailyQuests(playerId = 'current_player', dateStr = null) {
    if (!this.db) return [];
    const targetDate = dateStr || this.getTodayDateString();

    const stmt = this.db.prepare(
      'SELECT * FROM user_daily_quests WHERE player_id = ? AND quest_date = ? ORDER BY id ASC'
    );
    let quests = stmt.all(playerId, targetDate);

    if (quests.length === 0) {
      // Génération de 3 quêtes personnalisées pour le jour
      quests = this.generateDailyQuestsForDate(playerId, targetDate);
    }

    return quests.map(q => ({
      ...q,
      completed: Boolean(q.completed || q.progress >= q.target),
      claimed: Boolean(q.claimed),
      can_claim: Boolean((q.completed || q.progress >= q.target) && !q.claimed)
    }));
  }

  generateDailyQuestsForDate(playerId, dateStr) {
    const xpQuest = {
      quest_key: 'earn_xp',
      title: 'Gagner 80 XP Offensif',
      description: 'Accumule au moins 80 points d\'expérience lors de tes sessions du jour.',
      target: 80,
      xp_reward: 40,
      gem_reward: 20
    };

    const rotatingPool = [
      {
        quest_key: 'solve_challenge',
        title: 'Résoudre 1 challenge CTF',
        description: 'Valide au moins 1 challenge dans la Zone d\'Entraînement ou le Curriculum.',
        target: 1,
        xp_reward: 50,
        gem_reward: 25
      },
      {
        quest_key: 'dojo_review',
        title: 'Réviser 1 erreur dans le Dojo',
        description: 'Corrige une notion ou révise un concept technique dans le Dojo.',
        target: 1,
        xp_reward: 35,
        gem_reward: 15
      },
      {
        quest_key: 'network_scan',
        title: 'Lancer un scan réseau tactique',
        description: 'Effectue une analyse réseau, un scan de ports ou un audit dans le Terminal.',
        target: 1,
        xp_reward: 30,
        gem_reward: 15
      },
      {
        quest_key: 'complete_curriculum',
        title: 'Compléter 1 niveau du Curriculum',
        description: 'Termine avec succès un palier d\'apprentissage dans l\'arbre de formation.',
        target: 1,
        xp_reward: 45,
        gem_reward: 20
      }
    ];

    // Sélection déterministe de 2 quêtes distinctes depuis le pool rotatif
    const daySeed = Math.abs(dateStr.split('-').reduce((acc, part) => (acc * 31) + parseInt(part, 10), 0));
    const idx1 = daySeed % rotatingPool.length;
    const step = 1 + (Math.floor(daySeed / rotatingPool.length) % (rotatingPool.length - 1));
    const idx2 = (idx1 + step) % rotatingPool.length;

    const chosen = [xpQuest, rotatingPool[idx1], rotatingPool[idx2]];
    const inserted = [];

    const insertStmt = this.db.prepare(`
      INSERT INTO user_daily_quests (id, player_id, quest_date, quest_key, title, description, target, progress, xp_reward, gem_reward, completed, claimed, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, ?, 0, 0, datetime('now'))
    `);

    chosen.forEach((q, idx) => {
      const questId = `quest_${dateStr}_${playerId}_${idx + 1}`;
      insertStmt.run(
        questId,
        playerId,
        dateStr,
        q.quest_key,
        q.title,
        q.description,
        q.target,
        q.xp_reward,
        q.gem_reward
      );
      inserted.push({
        id: questId,
        player_id: playerId,
        quest_date: dateStr,
        quest_key: q.quest_key,
        title: q.title,
        description: q.description,
        target: q.target,
        progress: 0,
        xp_reward: q.xp_reward,
        gem_reward: q.gem_reward,
        completed: 0,
        claimed: 0,
        created_at: new Date().toISOString()
      });
    });

    return inserted;
  }

  // Suivi automatique d'avancement des quêtes
  trackQuestProgress(playerId = 'current_player', questKey, amount = 1) {
    if (!this.db) return [];
    const today = this.getTodayDateString();
    this.getDailyQuests(playerId, today); // Assure la présence des 3 quêtes

    const rows = this.db.prepare(
      'SELECT * FROM user_daily_quests WHERE player_id = ? AND quest_date = ?'
    ).all(playerId, today);

    const updated = [];
    const updateStmt = this.db.prepare(`
      UPDATE user_daily_quests
      SET progress = ?, completed = ?
      WHERE id = ?
    `);

    for (const q of rows) {
      let shouldUpdate = false;
      let inc = 0;

      if (q.quest_key === questKey) {
        shouldUpdate = true;
        inc = amount;
      } else if (questKey === 'earn_xp' && q.quest_key === 'earn_xp') {
        shouldUpdate = true;
        inc = amount;
      } else if (q.quest_key === 'solve_challenge' && (questKey === 'solve_challenge' || questKey === 'flag_submitted')) {
        shouldUpdate = true;
        inc = amount;
      }

      if (shouldUpdate && !q.claimed) {
        const newProgress = Math.min(q.target, q.progress + inc);
        const isCompleted = newProgress >= q.target ? 1 : 0;
        updateStmt.run(newProgress, isCompleted, q.id);
        updated.push({
          id: q.id,
          quest_key: q.quest_key,
          old_progress: q.progress,
          new_progress: newProgress,
          completed: Boolean(isCompleted)
        });
      }
    }

    // Si de l'XP a été gagnée, on incrémente également la ligue hebdomadaire
    if (questKey === 'earn_xp' && amount > 0) {
      this.addWeeklyXp(playerId, amount);
    }

    return updated;
  }

  // Réclamation de récompense
  claimQuestReward(playerId = 'current_player', questId) {
    if (!this.db) throw new Error('Base de données non connectée.');

    const quest = this.db.prepare(
      'SELECT * FROM user_daily_quests WHERE id = ? AND player_id = ?'
    ).get(questId, playerId);

    if (!quest) {
      throw new Error('Quête introuvable.');
    }
    if (quest.claimed) {
      throw new Error('Récompense de quête déjà réclamée.');
    }
    if (!quest.completed && quest.progress < quest.target) {
      throw new Error('Quête non terminée (objectif non atteint).');
    }

    // Marquer comme réclamée
    this.db.prepare('UPDATE user_daily_quests SET claimed = 1, completed = 1 WHERE id = ?').run(questId);

    // Créditer XP et Gemmes dans user_state
    const user = this.db.prepare('SELECT xp, gems FROM user_state WHERE id = ?').get(playerId);
    const currentXp = user ? (user.xp || 0) : 0;
    const currentGems = user ? (user.gems || 0) : 0;

    const newXp = currentXp + quest.xp_reward;
    const newGems = currentGems + quest.gem_reward;

    this.db.prepare(`
      UPDATE user_state
      SET xp = ?, gems = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(newXp, newGems, playerId);

    // Créditer aussi l'XP hebdomadaire de ligue
    this.addWeeklyXp(playerId, quest.xp_reward);

    return {
      success: true,
      quest_id: questId,
      rewarded_xp: quest.xp_reward,
      rewarded_gems: quest.gem_reward,
      new_xp: newXp,
      new_gems: newGems
    };
  }

  // ==========================================================================
  // SECTION 2 : SÉRIE (STREAK) & GEL DE FLAMME (STREAK FREEZE)
  // ==========================================================================

  getInventory(playerId = 'current_player') {
    if (!this.db) return [];
    const items = this.db.prepare('SELECT * FROM user_inventory WHERE player_id = ?').all(playerId);
    
    // Assurer la présence des métadonnées du shop
    const map = new Map(items.map(it => [it.item_id, it]));
    return Object.values(SHOP_ITEMS).map(shopItem => {
      const inv = map.get(shopItem.id);
      return {
        ...shopItem,
        quantity: inv ? inv.quantity : 0,
        is_equipped: inv ? Boolean(inv.is_equipped) : (shopItem.id === 'streak_freeze' ? 1 : 0),
        updated_at: inv ? inv.updated_at : null
      };
    });
  }

  buyShopItem(playerId = 'current_player', itemId, quantity = 1) {
    if (!this.db) throw new Error('Base de données non connectée.');
    this.ensurePlayerState(playerId);
    const shopItem = SHOP_ITEMS[itemId];
    if (!shopItem) {
      throw new Error(`Article de boutique inconnu : ${itemId}`);
    }

    const qty = Math.max(1, parseInt(quantity, 10) || 1);
    const totalCost = shopItem.cost * qty;

    const user = this.db.prepare('SELECT gems, hearts FROM user_state WHERE id = ?').get(playerId);
    const currentGems = user ? (user.gems || 0) : 0;

    if (currentGems < totalCost) {
      throw new Error(`Gemmes insuffisantes. Requis : ${totalCost} 💎 (Solde : ${currentGems} 💎).`);
    }

    const newGems = currentGems - totalCost;

    // Déduire les gemmes
    if (itemId === 'heart_refill') {
      // Recharge complète de vies
      this.db.prepare(`
        UPDATE user_state
        SET gems = ?, hearts = 5, updated_at = datetime('now')
        WHERE id = ?
      `).run(newGems, playerId);
    } else {
      this.db.prepare(`
        UPDATE user_state
        SET gems = ?, updated_at = datetime('now')
        WHERE id = ?
      `).run(newGems, playerId);
    }

    // Mettre à jour l'inventaire
    this.db.prepare(`
      INSERT INTO user_inventory (player_id, item_id, item_name, item_type, quantity, is_equipped, updated_at)
      VALUES (?, ?, ?, ?, ?, 1, datetime('now'))
      ON CONFLICT(player_id, item_id) DO UPDATE SET
        quantity = quantity + excluded.quantity,
        updated_at = datetime('now')
    `).run(playerId, shopItem.id, shopItem.name, shopItem.type, qty);

    const updatedInv = this.db.prepare(
      'SELECT quantity FROM user_inventory WHERE player_id = ? AND item_id = ?'
    ).get(playerId, itemId);

    return {
      success: true,
      item_id: itemId,
      quantity_purchased: qty,
      new_quantity: updatedInv ? updatedInv.quantity : qty,
      remaining_gems: newGems,
      item: shopItem
    };
  }

  // Logique de protection de série avec Streak Freeze
  checkAndApplyStreak(playerId = 'current_player', simulatedActivityDate = null) {
    if (!this.db) return { streak: 1, max_streak: 1, freeze_used: false };
    this.ensurePlayerState(playerId);

    const activityDate = simulatedActivityDate || this.getTodayDateString();
    const user = this.db.prepare(
      'SELECT streak, max_streak, last_activity_date FROM user_state WHERE id = ?'
    ).get(playerId) || { streak: 1, max_streak: 1, last_activity_date: null };

    let currentStreak = user.streak || 1;
    let maxStreak = user.max_streak || currentStreak;
    const lastDate = user.last_activity_date;

    // Premier jour d'activité
    if (!lastDate) {
      this.db.prepare(`
        UPDATE user_state
        SET streak = 1, max_streak = MAX(1, max_streak), last_activity_date = ?, updated_at = datetime('now')
        WHERE id = ?
      `).run(activityDate, playerId);

      return {
        streak: 1,
        max_streak: Math.max(1, maxStreak),
        status: 'initial_day',
        freeze_used: false,
        last_activity_date: activityDate
      };
    }

    // Calcul de la différence en jours
    const dAct = new Date(activityDate + 'T00:00:00Z');
    const dLast = new Date(lastDate + 'T00:00:00Z');
    const diffTime = dAct.getTime() - dLast.getTime();
    const diffDays = Math.round(diffTime / (1000 * 3600 * 24));

    // Même jour : aucun changement de streak
    if (diffDays === 0) {
      return {
        streak: currentStreak,
        max_streak: maxStreak,
        status: 'same_day',
        freeze_used: false,
        last_activity_date: activityDate
      };
    }

    // Jour consécutif : incrément de la série
    if (diffDays === 1) {
      currentStreak += 1;
      maxStreak = Math.max(currentStreak, maxStreak);
      this.db.prepare(`
        UPDATE user_state
        SET streak = ?, max_streak = ?, last_activity_date = ?, updated_at = datetime('now')
        WHERE id = ?
      `).run(currentStreak, maxStreak, activityDate, playerId);

      return {
        streak: currentStreak,
        max_streak: maxStreak,
        status: 'streak_incremented',
        freeze_used: false,
        last_activity_date: activityDate
      };
    }

    // Plus d'un jour d'écart : tentative de protection par Gel de Flamme (Streak Freeze)
    if (diffDays > 1) {
      const missedDays = diffDays - 1;
      const freezeRow = this.db.prepare(
        'SELECT quantity FROM user_inventory WHERE player_id = ? AND item_id = ?'
      ).get(playerId, 'streak_freeze');

      const freezeCount = freezeRow ? freezeRow.quantity : 0;

      // Un Streak Freeze par jour manqué est nécessaire pour protéger la série
      if (freezeCount >= missedDays) {
        // Consommation des Streak Freezes nécessaires
        const remainingFreezes = freezeCount - missedDays;
        this.db.prepare(`
          UPDATE user_inventory
          SET quantity = ?, updated_at = datetime('now')
          WHERE player_id = ? AND item_id = 'streak_freeze'
        `).run(remainingFreezes, playerId);

        // La série est sauvée ! On la conserve et on l'incrémente pour aujourd'hui
        currentStreak += 1;
        maxStreak = Math.max(currentStreak, maxStreak);

        this.db.prepare(`
          UPDATE user_state
          SET streak = ?, max_streak = ?, last_activity_date = ?, updated_at = datetime('now')
          WHERE id = ?
        `).run(currentStreak, maxStreak, activityDate, playerId);

        return {
          streak: currentStreak,
          max_streak: maxStreak,
          status: 'streak_protected_by_freeze',
          freeze_used: true,
          consumed_freezes: missedDays,
          remaining_freezes: remainingFreezes,
          last_activity_date: activityDate,
          message: `🛡️ Gel de Flamme activé (${missedDays} consommé${missedDays > 1 ? 's' : ''}) ! Ta série de ${currentStreak} jours a été protégée.`
        };
      } else {
        // Pas assez de Streak Freezes pour combler tous les jours manqués : la série est réinitialisée à 1
        currentStreak = 1;
        this.db.prepare(`
          UPDATE user_state
          SET streak = 1, last_activity_date = ?, updated_at = datetime('now')
          WHERE id = ?
        `).run(activityDate, playerId);

        return {
          streak: 1,
          max_streak: maxStreak,
          status: 'streak_lost',
          freeze_used: false,
          remaining_freezes: freezeCount,
          last_activity_date: activityDate,
          message: `⚠️ Série réinitialisée à 1 jour faute d'activité consécutive ou de Gel de Flamme suffisant (${missedDays} jour(s) manqué(s), ${freezeCount} gel(s) en réserve).`
        };
      }
    }

    return {
      streak: currentStreak,
      max_streak: maxStreak,
      status: 'noop',
      freeze_used: false
    };
  }

  // ==========================================================================
  // SECTION 3 : SYSTÈME DE LIGUES & CLASSEMENT (LEADERBOARD)
  // ==========================================================================

  getLeaderboard(playerId = 'current_player') {
    if (!this.db) return null;

    const weekId = this.getCurrentWeekId();
    let leagueState = this.db.prepare(
      'SELECT * FROM user_league_state WHERE player_id = ?'
    ).get(playerId);

    if (!leagueState) {
      this.db.prepare(`
        INSERT INTO user_league_state (player_id, current_league, weekly_xp, week_id, updated_at)
        VALUES (?, 'bronze', 0, ?, datetime('now'))
      `).run(playerId, weekId);
      leagueState = { player_id: playerId, current_league: 'bronze', weekly_xp: 0, week_id: weekId };
    } else if (leagueState.week_id !== weekId) {
      // Nouvelle semaine : calcul des promotions/relégations basées sur la semaine écoulée
      const prevLeagueId = leagueState.current_league || 'bronze';
      const prevLeague = LEAGUES.find(l => l.id === prevLeagueId) || LEAGUES[0];
      const prevOpponents = this.generateBotOpponents(prevLeague, leagueState.week_id);
      const prevParticipants = [
        ...prevOpponents,
        { id: playerId, xp: leagueState.weekly_xp || 0, is_player: true }
      ].sort((a, b) => b.xp - a.xp);

      const prevRank = prevParticipants.findIndex(p => p.is_player) + 1;
      let newLeagueId = prevLeagueId;

      if (prevRank <= 3 && prevLeague.promotion_rank && prevLeague.tier < 5) {
        const nextLeague = LEAGUES.find(l => l.tier === prevLeague.tier + 1);
        if (nextLeague) newLeagueId = nextLeague.id;
      } else if (prevLeague.relegation_rank && prevRank >= prevLeague.relegation_rank && prevLeague.tier > 1) {
        const lowerLeague = LEAGUES.find(l => l.tier === prevLeague.tier - 1);
        if (lowerLeague) newLeagueId = lowerLeague.id;
      }

      this.db.prepare(`
        UPDATE user_league_state
        SET current_league = ?, weekly_xp = 0, week_id = ?, updated_at = datetime('now')
        WHERE player_id = ?
      `).run(newLeagueId, weekId, playerId);

      leagueState.current_league = newLeagueId;
      leagueState.weekly_xp = 0;
      leagueState.week_id = weekId;
    }

    const currentLeagueId = leagueState.current_league || 'bronze';
    const currentLeague = LEAGUES.find(l => l.id === currentLeagueId) || LEAGUES[0];

    // Récupérer le joueur
    const user = this.db.prepare(
      'SELECT nickname, avatar FROM user_state WHERE id = ?'
    ).get(playerId) || { nickname: 'Opérateur RedTeam', avatar: '🥷' };

    // Génération déterministe de 14 adversaires/bots crédibles pour la ligue et la semaine
    const botOpponents = this.generateBotOpponents(currentLeague, weekId);

    // Intégration du joueur
    const allParticipants = [
      ...botOpponents,
      {
        id: playerId,
        nickname: user.nickname,
        avatar: user.avatar,
        xp: leagueState.weekly_xp,
        is_player: true
      }
    ];

    // Tri décroissant par XP hebdomadaire
    allParticipants.sort((a, b) => b.xp - a.xp);

    // Calcul des rangs et des zones (Top 3 = promotion, Derniers = relégation)
    let playerRank = 1;
    let playerStatus = 'safe';

    const total = allParticipants.length;
    const leaderboard = allParticipants.map((p, idx) => {
      const rank = idx + 1;
      let status = 'safe'; // Maintien

      if (rank <= 3 && currentLeague.promotion_rank) {
        status = 'promotion'; // Top 3
      } else if (currentLeague.relegation_rank && rank >= currentLeague.relegation_rank) {
        status = 'relegation'; // Relégation
      }

      if (p.is_player) {
        playerRank = rank;
        playerStatus = status;
      }

      return {
        ...p,
        rank,
        status
      };
    });

    return {
      current_league: currentLeague.id,
      league_info: currentLeague,
      leagues: LEAGUES,
      week_id: weekId,
      player_rank: playerRank,
      player_status: playerStatus,
      player_weekly_xp: leagueState.weekly_xp,
      leaderboard,
      promotion_cutoff: 3,
      relegation_cutoff: currentLeague.relegation_rank || 15
    };
  }

  generateBotOpponents(league, weekId) {
    const baseNames = [
      { name: 'GhostByte', avatar: '👻' },
      { name: 'CipherFox', avatar: '🦊' },
      { name: 'NullPointer', avatar: '⚡' },
      { name: 'ValkyrieSec', avatar: '🛡️' },
      { name: 'RootAdmin', avatar: '💀' },
      { name: 'PixelHunter', avatar: '🎯' },
      { name: 'BitShift', avatar: '🦾' },
      { name: 'ZeroDay_Ace', avatar: '🃏' },
      { name: 'KernelPanic', avatar: '🔥' },
      { name: 'SynFlood', avatar: '🌊' },
      { name: 'CryptoKnight', avatar: '⚔️' },
      { name: 'PacketSniffer', avatar: '🐕' },
      { name: 'RedNebula', avatar: '🌌' },
      { name: 'ShadowOps', avatar: '🥷' }
    ];

    const tierFactor = league.tier; // 1 à 5
    // Calcul déterministe via hash de la semaine
    const hash = crypto.createHash('md5').update(weekId + league.id).digest('hex');

    return baseNames.map((bot, i) => {
      const seedChar = parseInt(hash.charAt(i % hash.length), 16);
      // Échelle d'XP par ligue
      const minXp = tierFactor * 80;
      const maxXp = tierFactor * 350;
      const calculatedXp = minXp + Math.floor((seedChar / 15) * (maxXp - minXp));

      return {
        id: `bot-${bot.name.toLowerCase()}`,
        nickname: bot.name,
        avatar: bot.avatar,
        xp: calculatedXp,
        is_player: false
      };
    });
  }

  addWeeklyXp(playerId = 'current_player', amount = 0) {
    if (!this.db || amount <= 0) return;
    const weekId = this.getCurrentWeekId();
    this.db.prepare(`
      INSERT INTO user_league_state (player_id, current_league, weekly_xp, week_id, updated_at)
      VALUES (?, 'bronze', ?, ?, datetime('now'))
      ON CONFLICT(player_id) DO UPDATE SET
        weekly_xp = CASE WHEN week_id = excluded.week_id THEN weekly_xp + excluded.weekly_xp ELSE excluded.weekly_xp END,
        week_id = excluded.week_id,
        updated_at = datetime('now')
    `).run(playerId, amount, weekId);
  }

  setPlayerLeague(playerId = 'current_player', leagueId) {
    if (!this.db) return false;
    const exists = LEAGUES.some(l => l.id === leagueId);
    if (!exists) throw new Error(`Ligue inconnue : ${leagueId}`);

    const weekId = this.getCurrentWeekId();
    this.db.prepare(`
      INSERT INTO user_league_state (player_id, current_league, weekly_xp, week_id, updated_at)
      VALUES (?, ?, 0, ?, datetime('now'))
      ON CONFLICT(player_id) DO UPDATE SET
        current_league = excluded.current_league,
        updated_at = datetime('now')
    `).run(playerId, leagueId, weekId);

    return true;
  }

  // ==========================================================================
  // SECTION 4 : CERTIFICATS CRYPTOGRAPHIQUES & PROFIL EXPORTABLE
  // ==========================================================================

  generateCertificate(playerId = 'current_player', trackId, customRecipientName = null) {
    if (!this.db) throw new Error('Base de données non connectée.');

    // Titres officiels des parcours
    const trackTitles = {
      'path-linux-fundamentals': 'Fondamentaux Linux, VFS & Scripting Tactique',
      'path-web-junior': 'Sécurité des Applications Web & OWASP Top 10',
      'path-network-recon': 'Reconnaissance Réseau, Nmap & Énumération Active',
      'path-privesc-linux': 'Élévation de Privilèges Linux & Post-Exploitation',
      'path-soc-detection': 'Analyse SOC, Investigation d\'Incidents & Règles Sigma',
      'campaign-season-1': 'Campagne Officielle Saison 1 : Opération Aegis Defense',
      'role-web-network': 'Parcours Professionnel : Pentester Web & Réseau',
      'role-soc-analyst': 'Parcours Professionnel : Analyste SOC & Détection',
      'role-devsecops': 'Parcours Professionnel : Ingénieur DevSecOps & Cloud',
      'role-threat-hunter': 'Parcours Professionnel : Spécialiste Threat Hunting & Reverse',
      'mastery-curriculum': 'Grand Chelem : Certification Offensive CyberRange Pro'
    };

    const trackTitle = trackTitles[trackId] || `Certification Spécialisée : ${trackId}`;

    const user = this.db.prepare('SELECT nickname FROM user_state WHERE id = ?').get(playerId);
    const recipientName = customRecipientName || (user ? user.nickname : 'Opérateur RedTeam');

    const randomSuffix = crypto.randomBytes(4).toString('hex').toUpperCase();
    const certId = `CYBERLAB-CERT-${randomSuffix}-${Date.now().toString(36).toUpperCase()}`;
    const issuedAt = new Date().toISOString();

    const payload = {
      cert_id: certId,
      player_id: playerId,
      track_id: trackId,
      track_title: trackTitle,
      recipient_name: recipientName,
      issued_at: issuedAt,
      issuer: 'CyberLab Offensive Security Academy',
      authority: 'CYBERRANGE-PRO-CA-2026'
    };

    // Hash d'authenticité SHA-256 du contenu
    const certificateHash = crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex');

    // Signature cryptographique locale HMAC-SHA256 infalsifiable
    const signature = crypto
      .createHmac('sha256', this.hmacSecret)
      .update(certificateHash + ':' + certId)
      .digest('hex');

    this.db.prepare(`
      INSERT INTO user_certificates (id, player_id, track_id, track_title, recipient_name, issued_at, certificate_hash, signature, metadata)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      certId,
      playerId,
      trackId,
      trackTitle,
      recipientName,
      issuedAt,
      certificateHash,
      signature,
      JSON.stringify(payload)
    );

    return {
      id: certId,
      player_id: playerId,
      track_id: trackId,
      track_title: trackTitle,
      recipient_name: recipientName,
      issued_at: issuedAt,
      certificate_hash: certificateHash,
      signature,
      authority: 'CYBERRANGE-PRO-CA-2026'
    };
  }

  verifyCertificate(certificate) {
    if (!certificate || !certificate.id || !certificate.signature || !certificate.certificate_hash) {
      return { valid: false, reason: 'Champs de certificat manquants ou invalides.' };
    }

    try {
      let payload;
      if (certificate.metadata) {
        payload = typeof certificate.metadata === 'string' ? JSON.parse(certificate.metadata) : certificate.metadata;
      } else {
        payload = {
          cert_id: certificate.id,
          player_id: certificate.player_id,
          track_id: certificate.track_id,
          track_title: certificate.track_title,
          recipient_name: certificate.recipient_name,
          issued_at: certificate.issued_at,
          issuer: 'CyberLab Offensive Security Academy',
          authority: 'CYBERRANGE-PRO-CA-2026'
        };
      }

      // 1. Recalcul du hash SHA-256
      const expectedHash = crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex');
      if (expectedHash !== certificate.certificate_hash) {
        return { valid: false, reason: 'Hash de contenu altéré ou non conforme.' };
      }

      // 2. Vérification de la signature HMAC-SHA256
      const expectedSignature = crypto
        .createHmac('sha256', this.hmacSecret)
        .update(expectedHash + ':' + certificate.id)
        .digest('hex');

      const bufA = Buffer.from(expectedSignature, 'hex');
      const bufB = Buffer.from(certificate.signature, 'hex');

      if (bufA.length !== bufB.length || !crypto.timingSafeEqual(bufA, bufB)) {
        return { valid: false, reason: 'Signature cryptographique non authentique (échec HMAC-SHA256).' };
      }

      return {
        valid: true,
        cert_id: certificate.id,
        recipient_name: certificate.recipient_name,
        track_title: certificate.track_title,
        issued_at: certificate.issued_at,
        issuer: payload.issuer,
        authority: payload.authority
      };
    } catch (err) {
      return { valid: false, reason: `Erreur de vérification : ${err.message}` };
    }
  }

  getCertificates(playerId = 'current_player') {
    if (!this.db) return [];
    return this.db.prepare(
      'SELECT * FROM user_certificates WHERE player_id = ? ORDER BY issued_at DESC'
    ).all(playerId);
  }

  exportProfile(playerId = 'current_player') {
    if (!this.db) throw new Error('Base de données non connectée.');
    this.ensurePlayerState(playerId);

    const user = this.db.prepare('SELECT * FROM user_state WHERE id = ?').get(playerId) || {};
    const inventory = this.getInventory(playerId);
    const leaderboard = this.getLeaderboard(playerId);
    const certificates = this.getCertificates(playerId);

    let skillProgress = [];
    let placement = null;
    try {
      skillProgress = this.db.prepare('SELECT * FROM user_skill_progress WHERE player_id = ?').all(playerId);
      placement = this.db.prepare('SELECT * FROM user_placement_results WHERE player_id = ?').get(playerId);
    } catch (e) {}

    const profileData = {
      meta: {
        platform: 'CYBERRANGE PRO // CyberLab',
        version: '1.2.0',
        exported_at: new Date().toISOString(),
        format: 'CYBERLAB_SKILL_PROFILE_V1'
      },
      operator: {
        id: playerId,
        nickname: user.nickname || 'Opérateur RedTeam',
        avatar: user.avatar || '🥷',
        theme: user.theme || 'dark',
        xp: user.xp || 0,
        streak: user.streak || 1,
        max_streak: user.max_streak || 1,
        hearts: user.hearts || 5,
        gems: user.gems || 100,
        combo: user.combo || 0,
        completed_levels: JSON.parse(user.completed_levels || '[]'),
        unlocked_badges: JSON.parse(user.unlocked_badges || '[]')
      },
      gamification: {
        league: leaderboard ? leaderboard.current_league : 'bronze',
        weekly_xp: leaderboard ? leaderboard.player_weekly_xp : 0,
        rank: leaderboard ? leaderboard.player_rank : 1,
        inventory
      },
      skills: {
        placement_test: placement ? {
          total_score: placement.total_score,
          recommended_role: placement.recommended_role,
          recommended_tier: placement.recommended_tier,
          domain_scores: JSON.parse(placement.domain_scores || '{}'),
          completed_at: placement.completed_at
        } : null,
        skill_nodes: skillProgress
      },
      official_certificates: certificates.map(c => ({
        id: c.id,
        track_id: c.track_id,
        track_title: c.track_title,
        recipient_name: c.recipient_name,
        issued_at: c.issued_at,
        certificate_hash: c.certificate_hash,
        signature: c.signature
      }))
    };

    // Calcul d'un checksum SHA-256 d'intégrité du profil
    const checksum = crypto
      .createHash('sha256')
      .update(JSON.stringify(profileData.operator) + JSON.stringify(profileData.skills))
      .digest('hex');

    profileData.meta.integrity_checksum = checksum;

    return profileData;
  }
}

module.exports = GamificationManager;

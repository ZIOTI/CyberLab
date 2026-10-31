// ============================================================================
// CYBERLAB - SKILL TREE & CURRICULUM UNIFICATION FRONTEND ENGINE
// Arborescence Interactive 4 Rôles, Diagnostic de Placement & Mode Dojo
// Zero external dependencies - Architecture Web Moderne
// ============================================================================

window.cyberSkillTree = (function() {
  let treeData = null;
  let activeRoleId = 'role-web-network';
  let placementQuestions = [];
  let currentPlacementIdx = 0;
  let placementAnswers = {};
  let currentDojoSession = null;

  async function fetchSkillTreeData() {
    try {
      const res = await fetch('/api/skill-tree');
      const data = await res.json();
      if (data && data.roles) {
        treeData = data;
        return data;
      }
    } catch (e) {
      console.warn('[SKILL-TREE] Erreur chargement données:', e);
    }
    return null;
  }

  function getIcon(name, cls = 'w-5 h-5') {
    if (window.CyberIcons && window.CyberIcons.has(name)) {
      return window.CyberIcons.get(name, cls);
    }
    return `<span class="${cls} inline-block">⚡</span>`;
  }

  function renderHub() {
    const container = document.getElementById('view-skill-tree');
    if (!container) return;

    if (!treeData) {
      container.innerHTML = `
        <div class="p-12 text-center text-slate-400 font-mono">
          <div class="inline-block w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mb-3"></div>
          <div>Chargement de l'Arborescence de Compétences CyberLab...</div>
        </div>
      `;
      fetchSkillTreeData().then(() => renderHub());
      return;
    }

    const roles = treeData.roles || [];
    const nodes = treeData.nodes || [];
    const stats = treeData.stats || {};
    const placement = treeData.placement;

    const activeRole = roles.find(r => r.id === activeRoleId) || roles[0];
    const roleNodes = nodes.filter(n => n.role_id === activeRoleId);

    // Regroupement par Tier (1 à 4)
    const tiers = [1, 2, 3, 4];

    container.innerHTML = `
      <!-- En-tête de l'Arborescence avec Badges d'Étapes et Actions Rapides -->
      <div class="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800/80 shadow-2xl space-y-5 font-mono backdrop-blur-md">
        
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
          <div class="flex items-center gap-3.5">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-cyan-950/60 p-2.5">
              ${getIcon('skillTree', 'w-full h-full text-slate-950')}
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="text-[10px] font-black uppercase tracking-widest text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/60">
                  ONTOLOGIE UNIFIÉE // PHASE 3
                </span>
                <span class="text-[10px] font-bold text-slate-400">4 RÔLES D'ÉLITE</span>
              </div>
              <h2 class="text-xl sm:text-2xl font-black text-white font-heading mt-0.5">
                Arborescence de Compétences & Matrice des Talents
              </h2>
            </div>
          </div>

          <!-- Boutons Actions Rapides : Diagnostic & Mode Dojo -->
          <div class="flex items-center gap-2.5 flex-wrap">
            <button id="btn-trigger-placement" class="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-500/50 text-cyan-300 hover:text-white text-xs font-bold transition-all flex items-center gap-2 shadow-sm">
              ${getIcon('diagnostic', 'w-4 h-4 text-cyan-400')}
              <span>${placement ? 'Re-tester Positionnement' : '🎯 Test de Positionnement'}</span>
            </button>

            <button id="btn-trigger-dojo" class="px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-500/20 to-amber-500/20 hover:from-rose-500/30 hover:to-amber-500/30 border border-rose-500/50 text-rose-300 hover:text-white text-xs font-bold transition-all flex items-center gap-2 shadow-sm">
              ${getIcon('dojo', 'w-4 h-4 text-amber-400')}
              <span>🥋 Mode Dojo (Révision)</span>
            </button>
          </div>
        </div>

        ${!placement ? `
          <!-- BANNIÈRE D'INVITATION TEST DE POSITIONNEMENT (PREMIER LANCEMENT) -->
          <div class="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-950/70 via-slate-900 to-cyan-950/70 border border-purple-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-purple-950/30">
            <div class="flex items-center gap-3.5">
              <div class="w-10 h-10 rounded-xl bg-purple-900/60 border border-purple-400/50 flex items-center justify-center text-xl shrink-0">
                🎯
              </div>
              <div>
                <h4 class="text-sm font-bold text-white font-heading">Nouveau sur l'Arborescence CyberLab ?</h4>
                <p class="text-xs text-slate-300 mt-0.5 leading-relaxed">
                  Passe le test de diagnostic initial (8 questions) pour calibrer ton profil et débloquer directement ton point d'entrée idéal.
                </p>
              </div>
            </div>
            <button onclick="window.cyberSkillTree.openPlacementModal()" class="btn-duo-3d btn-duo-green px-5 py-2.5 text-xs font-bold whitespace-nowrap shrink-0">
              <span>Lancer le Diagnostic (2 min) ➔</span>
            </button>
          </div>
        ` : ''}

        <!-- Jauge globale et Mini-Dashboard -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div class="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
            <div class="text-[10px] text-slate-400 font-bold uppercase">Maîtrise Globale</div>
            <div class="text-base font-black text-cyan-400 mt-0.5">${stats.overall_completion_pct || 0}%</div>
            <div class="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1.5">
              <div class="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full" style="width: ${stats.overall_completion_pct || 0}%;"></div>
            </div>
          </div>

          <div class="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
            <div class="text-[10px] text-slate-400 font-bold uppercase">Nœuds Débloqués</div>
            <div class="text-base font-black text-emerald-400 mt-0.5">${(stats.available_count || 0) + (stats.completed_count || 0) + (stats.mastered_count || 0)} / ${stats.total_nodes || 20}</div>
            <div class="text-[10px] text-slate-500 mt-1">${stats.locked_count || 0} sous verrou</div>
          </div>

          <div class="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
            <div class="text-[10px] text-slate-400 font-bold uppercase">Nœuds Maîtrisés</div>
            <div class="text-base font-black text-amber-400 mt-0.5 flex items-center gap-1">
              <span>${stats.mastered_count || 0}</span>
              ${getIcon('crown', 'w-4 h-4 text-amber-400 inline-block')}
            </div>
            <div class="text-[10px] text-slate-500 mt-1">Excellence technique</div>
          </div>

          <div class="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
            <div class="text-[10px] text-slate-400 font-bold uppercase">Rôle Recommandé</div>
            <div class="text-xs font-black text-purple-300 mt-1 truncate">
              ${placement && placement.recommended_role ? getRoleTitle(placement.recommended_role) : 'Diagnostic requis'}
            </div>
            <div class="text-[10px] text-slate-500 mt-0.5">Palier : Tier ${placement ? placement.recommended_tier : 1}</div>
          </div>
        </div>

        <!-- Onglets des 4 Rôles Professionnels -->
        <div class="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-800/80">
          ${roles.map(r => {
            const isActive = r.id === activeRoleId;
            const roleBorder = isActive ? 'border-cyan-400 bg-cyan-950/40 text-cyan-300 shadow-md shadow-cyan-950/40' : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:border-slate-700';
            return `
              <button onclick="window.cyberSkillTree.selectRole('${r.id}')" class="px-4 py-2.5 rounded-2xl border ${roleBorder} text-xs font-bold transition-all flex items-center gap-2.5 whitespace-nowrap">
                <span class="w-4 h-4">${getIcon(r.icon || 'shield', 'w-4 h-4')}</span>
                <span>${r.title}</span>
              </button>
            `;
          }).join('')}
        </div>

        <!-- Description du Rôle Sélectionné -->
        <div class="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3">
          <div class="p-2 rounded-xl bg-slate-900 border border-slate-700/80 text-cyan-400">
            ${getIcon(activeRole.icon, 'w-5 h-5')}
          </div>
          <div>
            <h3 class="text-sm font-black text-white font-heading">${activeRole.title}</h3>
            <p class="text-xs text-slate-300 mt-0.5 leading-relaxed">${activeRole.description}</p>
            <div class="text-[10px] text-amber-400 font-bold mt-1.5 flex items-center gap-1">
              ${getIcon('trophy', 'w-3.5 h-3.5 text-amber-400')}
              <span>Trophée d'homologation : ${activeRole.badge_reward}</span>
            </div>
          </div>
        </div>

      </div>

      <!-- ARBORESCENCE GRAPHIQUE VISUELLE PAR PALIERS (TIERS 1 À 4) -->
      <div class="space-y-6 pt-2 font-mono">
        ${tiers.map(tierNum => {
          const tierNodes = roleNodes.filter(n => n.tier === tierNum);
          if (tierNodes.length === 0) return '';
          const tierTitles = {
            1: 'PALIER I : FONDATIONS & PROTOCOLES FONDAMENTAUX',
            2: 'PALIER II : EXPLOITATION APPLICATIVE & INGÉNIERIE',
            3: 'PALIER III : VULNÉRABILITÉS COMPLEXES & ANALYSE DÉTAILLÉE',
            4: 'PALIER IV : EXPLOITATION SUPRÊME, CONTENANTS & REMÉDIATION'
          };
          return `
            <div class="space-y-3">
              <div class="skill-tier-separator flex items-center gap-3">
                <span class="w-2.5 h-2.5 rounded-full ${tierNum === 1 ? 'bg-cyan-400' : tierNum === 2 ? 'bg-emerald-400' : tierNum === 3 ? 'bg-amber-400' : 'bg-purple-500'} animate-pulse"></span>
                <h4 class="text-xs font-black tracking-widest text-slate-400 uppercase">${tierTitles[tierNum]}</h4>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                ${tierNodes.map(node => renderNodeCard(node)).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    // Attachement des gestionnaires d'événements
    document.getElementById('btn-trigger-placement')?.addEventListener('click', () => openPlacementModal());
    document.getElementById('btn-trigger-dojo')?.addEventListener('click', () => openDojoModal());
  }

  function getRoleTitle(roleId) {
    const titles = {
      'role-web-network': 'Pentester Web & Réseau',
      'role-soc-defense': 'Analyste SOC & Détection',
      'role-cloud-devsec': 'Spécialiste Cloud & DevSecOps',
      'role-binary-ctf': 'Chasseur Binaire & CTF'
    };
    return titles[roleId] || roleId;
  }

  function renderNodeCard(node) {
    const isLocked = node.status === 'locked';
    const isAvailable = node.status === 'available';
    const isCompleted = node.status === 'completed';
    const isMastered = node.status === 'mastered';

    let cardBg = 'bg-slate-950/90 border-slate-800 text-slate-400';
    let statusBadge = `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 border border-slate-700 text-slate-500">🔒 VERROUILLÉ</span>`;

    if (isMastered) {
      cardBg = 'bg-gradient-to-br from-slate-950 to-amber-950/20 border-amber-500/80 skill-node-glow-gold text-slate-200';
      statusBadge = `<span class="px-2 py-0.5 rounded text-[10px] font-black bg-amber-950/80 border border-amber-500/80 text-amber-300 flex items-center gap-1">👑 MAÎTRISÉ</span>`;
    } else if (isCompleted) {
      cardBg = 'bg-gradient-to-br from-slate-950 to-emerald-950/20 border-emerald-500/80 skill-node-glow-emerald text-slate-200';
      statusBadge = `<span class="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-950/80 border border-emerald-500/80 text-emerald-300">✔ COMPLÉTÉ</span>`;
    } else if (isAvailable) {
      cardBg = 'bg-gradient-to-br from-slate-950 to-cyan-950/30 border-cyan-400/80 skill-node-glow-cyan text-slate-100 ring-1 ring-cyan-500/30';
      statusBadge = `<span class="px-2 py-0.5 rounded text-[10px] font-black bg-cyan-950/80 border border-cyan-400 text-cyan-300 animate-pulse">⚡ DISPONIBLE</span>`;
    }

    const prereqList = (node.prerequisites || []).map(p => {
      const match = treeData && treeData.nodes ? treeData.nodes.find(n => n.id === p) : null;
      return match ? match.title.split(' ')[0] : p;
    });

    return `
      <div onclick="window.cyberSkillTree.openNodeDetail('${node.id}')" class="skill-tree-node-card p-5 rounded-3xl border ${cardBg} transition-all duration-300 hover:scale-[1.01] cursor-pointer flex flex-col justify-between group">
        <div class="space-y-3">
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl ${isMastered ? 'bg-amber-950 text-amber-400 border border-amber-500' : isCompleted ? 'bg-emerald-950 text-emerald-400 border border-emerald-500' : isAvailable ? 'bg-cyan-950 text-cyan-400 border border-cyan-400' : 'bg-slate-900 text-slate-600 border border-slate-800'} flex items-center justify-center p-2.5">
                ${getIcon(node.icon || 'shield', 'w-full h-full')}
              </div>
              <div>
                <span class="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">${node.category}</span>
                <h5 class="text-sm font-black text-white group-hover:text-cyan-400 transition-colors font-heading leading-tight">${node.title}</h5>
              </div>
            </div>
            <div>${statusBadge}</div>
          </div>

          <p class="text-xs text-slate-300 line-clamp-2 leading-relaxed">${node.description}</p>

          ${prereqList.length > 0 ? `
            <div class="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
              <span class="text-slate-500">Prérequis :</span>
              ${prereqList.map(pr => `<span class="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300">${pr}</span>`).join('')}
            </div>
          ` : ''}

          <!-- Tags de compétences -->
          <div class="flex flex-wrap gap-1.5 pt-1">
            ${(node.mastery_skills || []).slice(0, 3).map(s => `
              <span class="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] text-slate-300 font-mono">${s}</span>
            `).join('')}
            ${(node.mastery_skills || []).length > 3 ? `<span class="text-[10px] text-slate-400">+${node.mastery_skills.length - 3}</span>` : ''}
          </div>
        </div>

        <div class="pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <div class="flex items-center gap-2">
            <span class="text-[10px] text-slate-400 font-bold">Progression :</span>
            <div class="w-20 h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div class="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full" style="width: ${node.progress_percentage || 0}%;"></div>
            </div>
            <span class="text-[10px] font-black text-cyan-300">${node.progress_percentage || 0}%</span>
          </div>

          <div class="text-[10px] font-extrabold text-cyan-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
            <span>Détails & Labs</span>
            <span>➔</span>
          </div>
        </div>
      </div>
    `;
  }

  function openNodeDetail(nodeId) {
    if (!treeData) return;
    const node = treeData.nodes.find(n => n.id === nodeId);
    if (!node) return;

    const modal = document.getElementById('modal-skill-node');
    if (!modal) return;

    const isLocked = node.status === 'locked';
    const isCompleted = node.status === 'completed';
    const isMastered = node.status === 'mastered';

    modal.innerHTML = `
      <div class="modal-content-card max-w-2xl p-6 sm:p-7 space-y-5 font-mono overflow-y-auto max-h-[90vh]">
        <!-- En-tête -->
        <div class="flex items-start justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div class="flex items-center gap-3.5">
            <div class="w-12 h-12 rounded-2xl bg-slate-900 border border-cyan-500/60 flex items-center justify-center text-cyan-400 p-2.5">
              ${getIcon(node.icon || 'shield', 'w-full h-full')}
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="text-[10px] font-black uppercase text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">TIER ${node.tier} // ${node.category}</span>
                <span class="text-[10px] font-black text-purple-400">+${node.xp_reward} EXP</span>
              </div>
              <h3 class="text-lg font-black text-white font-heading mt-0.5">${node.title}</h3>
            </div>
          </div>
          <button onclick="document.getElementById('modal-skill-node').classList.add('hidden')" class="w-8 h-8 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all">
            ✕
          </button>
        </div>

        <p class="text-xs text-slate-300 leading-relaxed">${node.description}</p>

        <!-- Volet Offense & Volet Blue Team Defense -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div class="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-900/60 space-y-1">
            <span class="text-[10px] font-black text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>🎯</span>
              <span>OBJECTIF OFFENSE (RED TEAM)</span>
            </span>
            <p class="text-[11px] text-rose-200 leading-relaxed">${node.offense_objective || 'Exploiter la vulnérabilité cible et extraire le flag.'}</p>
          </div>

          <div class="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-900/60 space-y-1">
            <span class="text-[10px] font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>🛡️</span>
              <span>OBJECTIF BLUE TEAM (DÉFENSE)</span>
            </span>
            <p class="text-[11px] text-emerald-200 leading-relaxed">${node.defense_objective || 'Auditer les journaux et durcir la configuration.'}</p>
          </div>
        </div>

        <!-- Leçons du Curriculum Associées -->
        <div class="space-y-2">
          <span class="text-[11px] font-bold text-slate-400 uppercase">Leçons du Curriculum Liées (${(node.linked_curriculum_levels || []).length}) :</span>
          <div class="space-y-1.5">
            ${(node.linked_curriculum_levels || []).map(lvlId => `
              <div class="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <span class="font-bold text-slate-300">Niveau ${lvlId.toUpperCase()}</span>
                <button onclick="(window.cyberApp.startLevelSession ? window.cyberApp.startLevelSession('${lvlId}') : window.cyberApp.startSession('${lvlId}')); document.getElementById('modal-skill-node').classList.add('hidden');" class="px-2.5 py-1 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-300 hover:text-white hover:bg-cyan-900 text-[11px] font-bold transition-all">
                  Lancer la Leçon ➔
                </button>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Labs CTF Associés -->
        <div class="space-y-2">
          <span class="text-[11px] font-bold text-slate-400 uppercase">Labs Pratiques & Cibles CTF (${(node.linked_challenges || []).length}) :</span>
          <div class="space-y-1.5">
            ${(node.linked_challenges || []).map(chId => `
              <div class="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <span class="font-bold text-emerald-400">${chId}</span>
                <button onclick="window.trainingSystem.openRoom('${chId}'); document.getElementById('modal-skill-node').classList.add('hidden');" class="px-2.5 py-1 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-300 hover:text-white hover:bg-emerald-900 text-[11px] font-bold transition-all">
                  Ouvrir le Lab ➔
                </button>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Bouton Validation / Maîtrise -->
        <div class="pt-2 border-t border-slate-800 flex items-center justify-between gap-3">
          <button onclick="window.cyberSkillTree.attemptUnlockNode('${node.id}')" class="flex-1 py-3 px-4 rounded-xl font-bold text-xs ${isMastered ? 'bg-amber-950 border border-amber-500 text-amber-300' : 'bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 hover:brightness-110'} transition-all shadow-md">
            ${isMastered ? '👑 Compétence Maîtrisée' : '⚡ Valider & Homologuer la Maîtrise'}
          </button>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
  }

  async function attemptUnlockNode(nodeId) {
    try {
      const res = await fetch('/api/skill-tree/unlock-node', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ node_id: nodeId })
      });
      const data = await res.json();
      if (data && data.success) {
        if (window.confetti) {
          window.confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
        }
        if (window.cyberAudio) window.cyberAudio.playSuccessFanfare();
        await fetchSkillTreeData();
        renderHub();
        openNodeDetail(nodeId);
      }
    } catch (e) {
      alert('Erreur validation : ' + e.message);
    }
  }

  // --- MODAL DU TEST DE POSITIONNEMENT (DIAGNOSTIC INITIAL) ---
  async function openPlacementModal() {
    const modal = document.getElementById('modal-placement-test');
    if (!modal) return;

    currentPlacementIdx = 0;
    placementAnswers = {};

    try {
      const res = await fetch('/api/skill-tree/diagnostic-questions');
      const data = await res.json();
      placementQuestions = (data && data.questions) ? data.questions : [];
    } catch (e) {
      placementQuestions = [];
    }

    renderPlacementQuestionStep();
    modal.classList.remove('hidden');
  }

  function renderPlacementQuestionStep() {
    const modal = document.getElementById('modal-placement-test');
    if (!modal || placementQuestions.length === 0) return;

    const q = placementQuestions[currentPlacementIdx];
    const total = placementQuestions.length;
    const pct = Math.round(((currentPlacementIdx + 1) / total) * 100);

    modal.innerHTML = `
      <div class="modal-content-card max-w-xl p-6 sm:p-7 space-y-5 font-mono">
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <div class="flex items-center gap-2.5">
            <span class="text-xl">🎯</span>
            <div>
              <h3 class="text-sm font-black text-white font-heading">Diagnostic Initial de Placement</h3>
              <span class="text-[10px] text-cyan-400 font-bold uppercase">${q.domain} // ${q.difficulty}</span>
            </div>
          </div>
          <span class="text-xs font-bold text-slate-400">Question ${currentPlacementIdx + 1} / ${total}</span>
        </div>

        <!-- Barre de progression -->
        <div class="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
          <div class="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-300" style="width: ${pct}%;"></div>
        </div>

        <div class="space-y-4">
          <h4 class="text-sm font-bold text-slate-100 leading-relaxed">${q.question}</h4>

          <div class="space-y-2">
            ${(q.options || []).map((opt, idx) => `
              <label class="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500/80 flex items-center gap-3 cursor-pointer transition-colors group">
                <input type="radio" name="placement_option" value="${idx}" class="w-4 h-4 text-cyan-500 focus:ring-0">
                <span class="text-xs text-slate-300 group-hover:text-white leading-normal">${opt}</span>
              </label>
            `).join('')}
          </div>
        </div>

        <div class="flex items-center justify-between pt-2 border-t border-slate-800">
          <button onclick="document.getElementById('modal-placement-test').classList.add('hidden')" class="text-xs text-slate-500 hover:text-slate-300">
            Quitter le diagnostic
          </button>

          <button onclick="window.cyberSkillTree.submitPlacementStep()" class="btn-duo-3d btn-duo-green px-6 py-2.5 text-xs font-bold">
            <span>${currentPlacementIdx + 1 === total ? 'Terminer & Évaluer ➔' : 'Suivant ➔'}</span>
          </button>
        </div>
      </div>
    `;
  }

  function submitPlacementStep() {
    const selected = document.querySelector('input[name="placement_option"]:checked');
    if (!selected) {
      alert('Veuillez sélectionner une réponse pour continuer.');
      return;
    }

    const q = placementQuestions[currentPlacementIdx];
    placementAnswers[q.id] = parseInt(selected.value, 10);

    if (currentPlacementIdx + 1 < placementQuestions.length) {
      currentPlacementIdx++;
      renderPlacementQuestionStep();
    } else {
      finalizePlacementTest();
    }
  }

  async function finalizePlacementTest() {
    const modal = document.getElementById('modal-placement-test');
    if (!modal) return;

    modal.innerHTML = `
      <div class="modal-content-card max-w-xl p-8 text-center font-mono space-y-4">
        <div class="inline-block w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        <div class="text-sm font-bold text-slate-200">Évaluation algorithmique de ton profil technique...</div>
      </div>
    `;

    try {
      const res = await fetch('/api/skill-tree/placement-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: placementAnswers })
      });
      const data = await res.json();
      if (data && data.success) {
        if (window.confetti) window.confetti({ particleCount: 70, spread: 80 });
        if (window.cyberAudio) window.cyberAudio.playSuccessFanfare();
        renderPlacementResult(data);
        await fetchSkillTreeData();
      }
    } catch (e) {
      alert('Erreur diagnostic : ' + e.message);
    }
  }

  function renderPlacementResult(res) {
    const modal = document.getElementById('modal-placement-test');
    if (!modal) return;

    const scores = res.domain_scores || {};

    modal.innerHTML = `
      <div class="modal-content-card max-w-xl p-6 sm:p-7 space-y-5 font-mono">
        <div class="text-center space-y-2 border-b border-slate-800 pb-4">
          <div class="w-16 h-16 mx-auto rounded-3xl bg-cyan-950 border border-cyan-500/80 flex items-center justify-center text-3xl shadow-lg shadow-cyan-950/60">
            🎯
          </div>
          <h3 class="text-lg font-black text-white font-heading">Diagnostic de Placement Réussi</h3>
          <p class="text-xs text-slate-300">${res.feedback}</p>
        </div>

        <!-- Grille des Scores par Domaine -->
        <div class="space-y-2.5">
          <div class="flex justify-between text-xs">
            <span class="text-slate-400">Web & Réseau Offensif :</span>
            <span class="font-black text-cyan-400">${scores.web_network || 0}%</span>
          </div>
          <div class="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
            <div class="h-full bg-cyan-400 rounded-full placement-radar-bar" style="width: ${scores.web_network || 0}%;"></div>
          </div>

          <div class="flex justify-between text-xs">
            <span class="text-slate-400">Défense SOC & Forensics :</span>
            <span class="font-black text-emerald-400">${scores.soc_defense || 0}%</span>
          </div>
          <div class="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
            <div class="h-full bg-emerald-400 rounded-full placement-radar-bar" style="width: ${scores.soc_defense || 0}%;"></div>
          </div>

          <div class="flex justify-between text-xs">
            <span class="text-slate-400">Cloud & Conteneurs DevSecOps :</span>
            <span class="font-black text-amber-400">${scores.cloud_devsec || 0}%</span>
          </div>
          <div class="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
            <div class="h-full bg-amber-400 rounded-full placement-radar-bar" style="width: ${scores.cloud_devsec || 0}%;"></div>
          </div>

          <div class="flex justify-between text-xs">
            <span class="text-slate-400">Binaire, Pwn & Cryptanalyse :</span>
            <span class="font-black text-purple-400">${scores.binary_crypto || 0}%</span>
          </div>
          <div class="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
            <div class="h-full bg-purple-400 rounded-full placement-radar-bar" style="width: ${scores.binary_crypto || 0}%;"></div>
          </div>
        </div>

        <div class="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-800 text-xs text-cyan-200">
          <strong>Rôle Recommandé :</strong> ${getRoleTitle(res.recommended_role)} (Point d'entrée : Palier Tier ${res.recommended_tier})
        </div>

        <button onclick="window.cyberSkillTree.selectRole('${res.recommended_role}'); document.getElementById('modal-placement-test').classList.add('hidden');" class="w-full btn-duo-3d btn-duo-green py-3 text-xs font-bold">
          <span>Appliquer la Recommandation & Découvrir l'Arbre ➔</span>
        </button>
      </div>
    `;
  }

  // --- MODAL DU MODE DOJO (RÉVISION ESPACÉE DES ERREURS) ---
  async function openDojoModal() {
    const modal = document.getElementById('modal-dojo');
    if (!modal) return;

    modal.innerHTML = `
      <div class="modal-content-card max-w-xl p-8 text-center font-mono space-y-4">
        <div class="inline-block w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
        <div class="text-sm font-bold text-slate-200">Génération d'une session Dojo ciblée sur tes erreurs...</div>
      </div>
    `;
    modal.classList.remove('hidden');

    try {
      const res = await fetch('/api/skill-tree/dojo-session');
      const data = await res.json();
      currentDojoSession = (data && data.drills) ? data : { drills: [] };
      renderDojoSession();
    } catch (e) {
      alert('Erreur Dojo : ' + e.message);
      modal.classList.add('hidden');
    }
  }

  function renderDojoSession() {
    const modal = document.getElementById('modal-dojo');
    if (!modal || !currentDojoSession) return;

    const drills = currentDojoSession.drills || [];

    if (drills.length === 0) {
      modal.innerHTML = `
        <div class="modal-content-card max-w-md p-6 text-center font-mono space-y-4">
          <div class="text-3xl">🥋</div>
          <h3 class="text-base font-black text-white font-heading">Dojo Impeccable !</h3>
          <p class="text-xs text-slate-300">Aucune erreur récente à réviser. Ton taux de réussite est optimal !</p>
          <button onclick="document.getElementById('modal-dojo').classList.add('hidden')" class="btn-duo-3d btn-duo-green px-6 py-2.5 text-xs font-bold">
            <span>Retour à l'entraînement</span>
          </button>
        </div>
      `;
      return;
    }

    const firstDrill = drills[0];

    modal.innerHTML = `
      <div class="modal-content-card max-w-xl p-6 sm:p-7 space-y-5 font-mono">
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <div class="flex items-center gap-2.5">
            <span class="text-2xl text-amber-400">🥋</span>
            <div>
              <span class="text-[10px] font-black uppercase text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800">RÉVISION ESPACÉE // DOJO</span>
              <h3 class="text-sm font-black text-white font-heading">${firstDrill.topic}</h3>
            </div>
          </div>
          <button onclick="document.getElementById('modal-dojo').classList.add('hidden')" class="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center">
            ✕
          </button>
        </div>

        <div class="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 dojo-drill-card">
          <p class="text-xs text-slate-200 font-bold leading-relaxed">${firstDrill.question}</p>

          ${firstDrill.user_previous_mistake ? `
            <div class="p-2.5 rounded-xl bg-rose-950/30 border border-rose-900/50 text-[11px] text-rose-300">
              <span class="font-bold">Dernière tentative erronée :</span> <code class="text-rose-200">${firstDrill.user_previous_mistake}</code>
            </div>
          ` : ''}

          ${firstDrill.options ? `
            <div class="space-y-2 pt-1">
              ${firstDrill.options.map((opt, idx) => `
                <label class="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-400 flex items-center gap-3 cursor-pointer transition-colors group">
                  <input type="radio" name="dojo_option" value="${opt}" class="w-4 h-4 text-amber-400">
                  <span class="text-xs text-slate-300 group-hover:text-white">${opt}</span>
                </label>
              `).join('')}
            </div>
          ` : `
            <input type="text" id="dojo-input-answer" placeholder="Tape ta réponse ou le flag corrigé..." class="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono">
          `}
        </div>

        <div id="dojo-feedback-box" class="hidden p-3.5 rounded-xl text-xs font-mono"></div>

        <div class="flex items-center justify-between pt-2 border-t border-slate-800">
          <span class="text-[11px] text-slate-500">${drills.length} drill(s) restant(s)</span>
          <button onclick="window.cyberSkillTree.submitDojoStep('${firstDrill.id}')" class="btn-duo-3d btn-duo-green px-6 py-2.5 text-xs font-bold">
            <span>Valider ma révision ➔</span>
          </button>
        </div>
      </div>
    `;
  }

  async function submitDojoStep(drillId) {
    let answer = '';
    const selected = document.querySelector('input[name="dojo_option"]:checked');
    if (selected) {
      answer = selected.value;
    } else {
      const input = document.getElementById('dojo-input-answer');
      if (input) answer = input.value.trim();
    }

    if (!answer) {
      alert('Veuillez fournir une réponse.');
      return;
    }

    try {
      const res = await fetch('/api/skill-tree/dojo-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ drill_id: drillId, answer })
      });
      const data = await res.json();
      const fb = document.getElementById('dojo-feedback-box');
      if (fb) {
        fb.classList.remove('hidden');
        if (data.correct) {
          fb.className = 'p-3.5 rounded-xl text-xs font-mono bg-emerald-950/80 border border-emerald-500 text-emerald-200';
          fb.innerHTML = `✔ ${data.explanation} (+${data.xp_awarded} EXP, +${data.gems_awarded} gemmes)`;
          if (window.confetti) window.confetti({ particleCount: 50, spread: 60 });
          if (window.cyberAudio) window.cyberAudio.playSuccessFanfare();
          setTimeout(() => {
            openDojoModal();
          }, 1500);
        } else {
          fb.className = 'p-3.5 rounded-xl text-xs font-mono bg-rose-950/80 border border-rose-500 text-rose-200';
          fb.innerHTML = `✕ ${data.explanation}`;
          if (window.cyberAudio) window.cyberAudio.playErrorBuzzer();
        }
      }
    } catch (e) {
      alert('Erreur soumission Dojo : ' + e.message);
    }
  }

  function selectRole(roleId) {
    activeRoleId = roleId;
    renderHub();
  }

  return {
    init() {
      fetchSkillTreeData();
    },
    renderHub,
    selectRole,
    openNodeDetail,
    attemptUnlockNode,
    openPlacementModal,
    submitPlacementStep,
    openDojoModal,
    submitDojoStep
  };
})();

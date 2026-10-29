// ============================================================================
// CyberRange Junior - Moteur de Modélisations Visuelles & Schémas Animés
// Fournit des diagrammes interactifs animés (Parser SQL, Pipeline DOM, Headers, Inodes)
// Permet de comprendre le fonctionnement profond de l'informatique sans jargon inutile
// ============================================================================

window.CYBER_VISUAL_MODELS = {

  // ==========================================================================
  // MODÈLE 1 : L'ARBRE SYNTAXIQUE SQL (AST & BREAKING BOUNDARY)
  // Explique comment le compilateur SQL découpe la requête en jetons (tokens)
  // ==========================================================================
  renderSqlParserModel: function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="visual-model-card p-4 bg-slate-900 border border-slate-700 rounded-2xl">
        <div class="flex justify-between items-center mb-3">
          <span class="text-[11px] font-black uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
            <span>🔬</span> MODÉLISATION DU PARSER SQL (ANALYSE LEXICALE & JETONS)
          </span>
          <span class="text-[10px] text-slate-400 font-mono">SQLite / MySQL Engine</span>
        </div>

        <!-- Schéma interactif SVG / CSS -->
        <div class="relative bg-black/90 p-4 rounded-xl border border-slate-800 font-mono text-xs overflow-x-auto space-y-3">
          <div class="text-slate-400 text-[11px]">1. Requête brute construite par le serveur :</div>
          <div class="p-2 bg-slate-950 rounded border border-slate-700 text-slate-300">
            SELECT * FROM users WHERE user = '<span id="sql-tok-user" class="text-rose-400 font-bold transition-all">' OR 1=1 --</span>' AND pass = '...';
          </div>

          <div class="text-slate-400 text-[11px] mt-2">2. Découpage en jetons (Tokens) par l'Analyseur Syntaxique :</div>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px]" id="sql-tokens-flow">
            <div class="p-2 bg-slate-800 rounded border border-slate-700 text-sky-300">
              <div class="text-[9px] text-slate-400">CMD</div>
              <b>SELECT</b>
            </div>
            <div class="p-2 bg-slate-800 rounded border border-slate-700 text-slate-300">
              <div class="text-[9px] text-slate-400">TABLE</div>
              <b>users</b>
            </div>
            <div class="p-2 bg-rose-950/80 border border-rose-500 rounded text-rose-300 shadow-md">
              <div class="text-[9px] text-rose-400">LOGIQUE INJECTÉE</div>
              <b>OR 1=1 (VRAI)</b>
            </div>
            <div class="p-2 bg-slate-900/60 border border-slate-800 rounded text-slate-600 line-through">
              <div class="text-[9px] text-slate-600">COMMENTAIRE --</div>
              <b>AND pass = '...'</b>
            </div>
          </div>

          <div class="p-3 bg-rose-950/30 border border-rose-500/40 rounded-xl text-slate-300 text-[11px] leading-relaxed">
            <b class="text-rose-400">Ce qui se passe sous le capot :</b> Le guillemet simple (<code class="text-amber-300">'</code>) referme la chaîne de texte plus tôt que prévu. Les mots <code class="text-rose-400">OR 1=1</code> cessent d'être considérés comme du texte et deviennent de véritables instructions logiques pour la base de données ! Les tirets <code class="text-slate-500">--</code> neutralisent le mot de passe.
          </div>
        </div>

        <div class="mt-3 flex gap-2">
          <button id="btn-toggle-sql-prep" class="text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-bold border border-slate-700 transition-all">
            🛡️ Voir comment une Requête Préparée bloque cette attaque
          </button>
        </div>
        <div id="sql-prep-explanation" class="hidden mt-3 p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-[11px] text-emerald-300 font-mono">
          <b>Avec requête préparée :</b><br/>
          <code>db.prepare("SELECT * FROM users WHERE user = ?").get("' OR 1=1 --")</code><br/>
          Le moteur traite toute la saisie comme un <b>SEUL bloc de texte inoffensif</b>. Aucun jeton SQL n'est injecté !
        </div>
      </div>
    `;

    document.getElementById('btn-toggle-sql-prep')?.addEventListener('click', () => {
      document.getElementById('sql-prep-explanation')?.classList.toggle('hidden');
      if (window.cyberAudio) window.cyberAudio.playClick();
    });
  },

  // ==========================================================================
  // MODÈLE 2 : LE PIPELINE DE RENDU DU NAVIGATEUR ET FAILLE XSS
  // Explique comment le HTML Parser rencontre un événement script
  // ==========================================================================
  renderXssPipelineModel: function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="visual-model-card p-4 bg-slate-900 border border-slate-700 rounded-2xl">
        <div class="flex justify-between items-center mb-3">
          <span class="text-[11px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <span>⚡</span> LE PIPELINE DE RENDU DOM & EXÉCUTION JAVASCRIPT
          </span>
          <span class="text-[10px] text-slate-400 font-mono">Browser Engine Context</span>
        </div>

        <div class="bg-black/90 p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
          <!-- Étapes du flux -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center text-[11px]">
            <div class="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
              <div class="text-[10px] text-sky-400 font-bold mb-1">1. Flux Réseau Brut</div>
              <div class="text-slate-300 text-[10px]">&lt;div&gt;&lt;script&gt;alert(1)&lt;/script&gt;&lt;/div&gt;</div>
            </div>
            <div class="p-3 bg-amber-950/40 rounded-xl border border-amber-500/50">
              <div class="text-[10px] text-amber-400 font-bold mb-1">2. Construction du DOM</div>
              <div class="text-slate-300 text-[10px]">Création d'un nœud &lt;script&gt; dans l'arbre HTML</div>
            </div>
            <div class="p-3 bg-rose-950/60 rounded-xl border border-rose-500">
              <div class="text-[10px] text-rose-400 font-bold mb-1">3. Moteur JS V8</div>
              <div class="text-emerald-400 font-bold text-[10px]">Exécution immédiate : alert(1)</div>
            </div>
          </div>

          <div class="p-3 bg-amber-950/20 border border-amber-500/30 rounded-xl text-slate-300 text-[11px] leading-relaxed">
            <b class="text-amber-400">Le danger absolu :</b> Le navigateur accorde une confiance aveugle à tout ce qui ressemble à du balisage HTML. Dès qu'il instancie une balise de script ou un événement d'erreur (<code class="text-yellow-300">onerror</code>), le code JavaScript s'exécute avec les privilèges complets de la session utilisateur.
          </div>
        </div>
      </div>
    `;
  },

  // ==========================================================================
  // MODÈLE 3 : LES EN-TÊTES HTTP & FLUX DE SESSION COOKIES
  // Explique le transit des en-têtes Cookie entre client et serveur
  // ==========================================================================
  renderCookieFlowModel: function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="visual-model-card p-4 bg-slate-900 border border-slate-700 rounded-2xl">
        <div class="flex justify-between items-center mb-3">
          <span class="text-[11px] font-black uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
            <span>🍪</span> TRANSIT DU HEADER HTTP "COOKIE" & PRIVILÈGES
          </span>
          <span class="text-[10px] text-slate-400 font-mono">RFC 6265 Protocol</span>
        </div>

        <div class="bg-black/90 p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
          <div class="flex flex-col sm:flex-row items-center justify-between gap-3 text-center">
            <div class="p-3 bg-slate-800 rounded-xl border border-slate-700 w-full sm:w-1/3">
              <div class="text-xl mb-1">💻</div>
              <div class="text-slate-200 font-bold text-xs">Navigateur (Client)</div>
              <div class="text-[10px] text-amber-400 mt-1">Cookie: role=superadmin</div>
            </div>

            <div class="text-sky-400 font-bold text-lg hidden sm:block">➔ HTTP GET ➔</div>

            <div class="p-3 bg-slate-800 rounded-xl border border-slate-700 w-full sm:w-1/3">
              <div class="text-xl mb-1">🖥️</div>
              <div class="text-slate-200 font-bold text-xs">Serveur Web</div>
              <div class="text-[10px] text-emerald-400 mt-1">req.headers.cookie lu</div>
            </div>
          </div>

          <div class="p-3 bg-sky-950/20 border border-sky-500/30 rounded-xl text-slate-300 text-[11px] leading-relaxed">
            <b class="text-sky-400">Pourquoi ça marche :</b> Le protocole HTTP est sans état (stateless). À chaque requête, le navigateur renvoie de lui-même tous les cookies enregistrés pour ce domaine. Comme ils sont stockés sur ton propre disque dur, tu peux les modifier à la volée avec l'inspecteur F12 !
          </div>
        </div>
      </div>
    `;
  },

  // ==========================================================================
  // MODÈLE 4 : L'ARBORESCENCE DE FICHIERS & TRAVERSÉE DE DOSSIERS (../)
  // Explique la remontée des inodes vers la racine /
  // ==========================================================================
  renderPathTraversalModel: function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="visual-model-card p-4 bg-slate-900 border border-slate-700 rounded-2xl">
        <div class="flex justify-between items-center mb-3">
          <span class="text-[11px] font-black uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
            <span>📁</span> REMONTÉE D'ARBORESCENCE (DIRECTORY TRAVERSAL ../)
          </span>
          <span class="text-[10px] text-slate-400 font-mono">POSIX / Windows Inodes</span>
        </div>

        <div class="bg-black/90 p-4 rounded-xl border border-slate-800 space-y-2 font-mono text-xs">
          <div class="text-slate-400 text-[11px]">Arborescence des dossiers sur le serveur :</div>
          <div class="space-y-1 text-[11px]">
            <div class="text-rose-400 font-bold flex items-center gap-2">
              <span>📂 /var/</span> <span class="text-[10px] bg-rose-950 px-1.5 py-0.5 rounded border border-rose-500">secret_system.env (CIBLE PRIVÉE)</span>
            </div>
            <div class="pl-4 text-slate-400 flex items-center gap-2">
              <span>└─ 📂 www/</span>
            </div>
            <div class="pl-8 text-sky-400 flex items-center gap-2">
              <span>└─ 📂 vulnerable_files/</span> <span class="text-[10px] bg-sky-950 px-1.5 py-0.5 rounded border border-sky-600">Dossier web autorisé</span>
            </div>
          </div>

          <div class="mt-3 p-3 bg-purple-950/20 border border-purple-500/30 rounded-xl text-slate-300 text-[11px] leading-relaxed">
            <b class="text-purple-400">Le mécanisme :</b> Lorsque tu demandes <code class="text-yellow-300">file=../secret_system.env</code>, le serveur commence dans <code class="text-slate-400">vulnerable_files</code>, remonte d'un étage avec <code class="text-purple-400">../</code> vers le dossier parent, et ouvre le fichier confidentiel hors du dossier web !
          </div>
        </div>
      </div>
    `;
  },

  // ==========================================================================
  // MODÈLE 5 : RAINBOW TABLE & FONCTION DE HACHAGE À SENS UNIQUE
  // ==========================================================================
  renderHashRainbowModel: function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="visual-model-card p-4 bg-slate-900 border border-slate-700 rounded-2xl">
        <div class="flex justify-between items-center mb-3">
          <span class="text-[11px] font-black uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
            <span>👣</span> TRAPDOOR MATHEMATIQUE & RAINBOW TABLES
          </span>
          <span class="text-[10px] text-slate-400 font-mono">One-Way Hash Theory</span>
        </div>

        <div class="bg-black/90 p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
          <div class="flex items-center justify-between text-center gap-2">
            <div class="p-2 bg-slate-800 rounded-lg text-slate-200 text-xs w-1/3">
              "hello"
            </div>
            <div class="text-indigo-400 font-bold text-xs">➔ MD5() ➔</div>
            <div class="p-2 bg-slate-950 rounded-lg border border-slate-700 text-amber-300 text-[10px] w-1/2 truncate font-mono">
              5d41402abc4b2a76...
            </div>
          </div>

          <div class="p-3 bg-indigo-950/20 border border-indigo-500/30 rounded-xl text-slate-300 text-[11px] leading-relaxed">
            <b class="text-indigo-400">Pourquoi le calcul inverse est impossible :</b> Une fonction de hachage comprime une infinité de données dans 128 bits fixes en détruisant de l'information mathématique. On ne peut pas "recalculer" en arrière, mais une <b>Rainbow Table</b> a déjà calculé le hash des millions de mots les plus courants à l'avance pour faire une recherche par dictionnaire inversé.
          </div>
        </div>
      </div>
    `;
  }
};

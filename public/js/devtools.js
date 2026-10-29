// ============================================================================
// CyberRange Junior - Mini-DevTools Intégrés (Inspecteur DOM, Cookies & Réseau)
// Permet d'apprendre à inspecter le web comme un vrai professionnel de la cyber
// ============================================================================

class CyberDevTools {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.activeTab = 'inspector'; // 'inspector', 'cookies', 'network'
    this.currentSource = '';
    this.cookies = {
      'role': 'user',
      'session_id': 'sess_994827103a8f92',
      'theme': 'dark'
    };
    this.networkLogs = [
      {
        id: 1,
        time: '10:00:12',
        method: 'GET',
        url: 'https://cybercorp.internal/home',
        status: 200,
        type: 'document',
        reqHeaders: { 'Host': 'cybercorp.internal', 'User-Agent': 'Mozilla/5.0 CyberBrowser/1.0', 'Accept': 'text/html' },
        resHeaders: { 'Content-Type': 'text/html', 'Server': 'nginx/1.18.0' },
        body: 'HTML Document (2.4 KB)'
      }
    ];

    this.render();
  }

  setSource(html) {
    this.currentSource = html || '';
    if (this.activeTab === 'inspector') {
      this.renderInspector();
    }
  }

  addNetworkLog(entry) {
    this.networkLogs.unshift({
      id: Date.now(),
      time: new Date().toLocaleTimeString(),
      method: entry.method || 'GET',
      url: entry.url || '',
      status: entry.status || 200,
      type: entry.type || 'xhr',
      reqHeaders: entry.reqHeaders || { 'Accept': 'application/json' },
      resHeaders: entry.resHeaders || { 'Content-Type': 'application/json' },
      body: entry.body || ''
    });
    if (this.activeTab === 'network') {
      this.renderNetwork();
    }
  }

  getCookie(name) {
    return this.cookies[name];
  }

  setCookie(name, val) {
    this.cookies[name] = val;
    if (this.activeTab === 'cookies') {
      this.renderCookies();
    }
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = `
      <div class="devtools-wrapper">
        <div class="devtools-nav">
          <div class="devtools-tabs">
            <button class="devtools-tab-btn active" data-tab="inspector" id="tab-btn-inspector">
              <span class="icon">🔍</span> Inspecteur (DOM)
            </button>
            <button class="devtools-tab-btn" data-tab="cookies" id="tab-btn-cookies">
              <span class="icon">🍪</span> Cookies & Storage
            </button>
            <button class="devtools-tab-btn" data-tab="network" id="tab-btn-network">
              <span class="icon">🌐</span> Réseau (Network) <span class="badge-count" id="net-count">1</span>
            </button>
          </div>
          <div class="devtools-status text-xs text-gray-400">Cyber DevTools v2.4</div>
        </div>

        <div class="devtools-content" id="devtools-pane-content">
          <!-- Le contenu de l'onglet actif est injecté ici -->
        </div>
      </div>
    `;

    // Événements d'onglets
    this.container.querySelectorAll('.devtools-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = btn.dataset.tab;
        this.switchTab(tab);
      });
    });

    this.renderTabContent();
  }

  switchTab(tabName) {
    this.activeTab = tabName;
    this.container.querySelectorAll('.devtools-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    if (window.cyberAudio) window.cyberAudio.playClick();
    this.renderTabContent();
  }

  renderTabContent() {
    if (this.activeTab === 'inspector') this.renderInspector();
    else if (this.activeTab === 'cookies') this.renderCookies();
    else if (this.activeTab === 'network') this.renderNetwork();
  }

  renderInspector() {
    const pane = document.getElementById('devtools-pane-content');
    if (!pane) return;

    let highlighted = this.highlightHTML(this.currentSource || '<!-- Aucun code source chargé pour cette cible -->');

    pane.innerHTML = `
      <div class="inspector-view">
        <div class="inspector-toolbar">
          <span class="text-xs text-gray-400">Arborescence DOM & Code Source HTML de la cible :</span>
          <span class="text-xs text-green-400">Mode Lecture Activé</span>
        </div>
        <pre class="inspector-code-block font-mono text-xs"><code>${highlighted}</code></pre>
      </div>
    `;
  }

  renderCookies() {
    const pane = document.getElementById('devtools-pane-content');
    if (!pane) return;

    let rows = Object.entries(this.cookies).map(([name, val]) => `
      <tr class="cookie-row">
        <td class="font-mono text-cyan-300 font-bold">${name}</td>
        <td>
          <input type="text" class="cookie-val-input font-mono" data-cookie="${name}" value="${this.escapeHTML(val)}" />
        </td>
        <td class="text-gray-400 text-xs font-mono">cybercorp.internal</td>
        <td class="text-gray-400 text-xs">Session</td>
        <td>
          <button class="btn-save-cookie" data-cookie="${name}">💾 Appliquer</button>
        </td>
      </tr>
    `).join('');

    pane.innerHTML = `
      <div class="cookies-view p-3">
        <div class="text-xs text-yellow-300 mb-2 font-semibold flex items-center gap-1">
          <span>ℹ️</span> Modifie la valeur d'un cookie et clique sur 'Appliquer' pour manipuler tes privilèges !
        </div>
        <table class="devtools-table text-xs w-full">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Valeur</th>
              <th>Domaine</th>
              <th>Expiration</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
        <div class="mt-3 text-xs text-gray-400">
          Astuce sécurité : Les cookies non protégés par l'attribut <code>HttpOnly</code> peuvent être modifiés à volonté par l'internaute.
        </div>
      </div>
    `;

    pane.querySelectorAll('.btn-save-cookie').forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.dataset.cookie;
        const input = pane.querySelector(`.cookie-val-input[data-cookie="${name}"]`);
        if (input) {
          const newVal = input.value.trim();
          this.setCookie(name, newVal);
          if (window.cyberAudio) window.cyberAudio.playClick();
          alert(`Cookie "${name}" mis à jour avec la valeur : "${newVal}" ! Tu peux maintenant tester la cible.`);
          
          // Notifier le bac à sable
          if (window.cyberSandbox) {
            window.cyberSandbox.onCookieChange(name, newVal);
          }
        }
      });
    });
  }

  renderNetwork() {
    const pane = document.getElementById('devtools-pane-content');
    if (!pane) return;

    const netCount = document.getElementById('net-count');
    if (netCount) netCount.innerText = this.networkLogs.length;

    let rows = this.networkLogs.map(item => `
      <tr class="net-row cursor-pointer hover:bg-gray-800" data-net-id="${item.id}">
        <td class="font-mono text-gray-400 text-xs">${item.time}</td>
        <td><span class="net-badge-method ${item.method.toLowerCase()}">${item.method}</span></td>
        <td class="font-mono text-xs text-blue-300 truncate max-w-xs">${this.escapeHTML(item.url)}</td>
        <td><span class="net-badge-status status-${item.status}">${item.status}</span></td>
        <td class="text-gray-400 text-xs">${item.type}</td>
      </tr>
    `).join('');

    pane.innerHTML = `
      <div class="network-view p-2">
        <div class="text-xs text-gray-400 mb-2">Requêtes HTTP émises par le faux navigateur. Clique sur une requête pour inspecter ses En-têtes (Headers) :</div>
        <table class="devtools-table text-xs w-full">
          <thead>
            <tr>
              <th>Heure</th>
              <th>Méthode</th>
              <th>URL</th>
              <th>Statut</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
        <div class="net-detail-box mt-3 p-3 bg-gray-950 border border-gray-800 rounded hidden" id="net-detail-pane"></div>
      </div>
    `;

    pane.querySelectorAll('.net-row').forEach(row => {
      row.addEventListener('click', () => {
        const id = parseInt(row.dataset.netId, 10);
        const item = this.networkLogs.find(l => l.id === id);
        if (item) {
          this.showNetworkDetail(item);
        }
      });
    });
  }

  showNetworkDetail(item) {
    const detail = document.getElementById('net-detail-pane');
    if (!detail) return;
    detail.classList.remove('hidden');

    let resHeadersHtml = Object.entries(item.resHeaders).map(([k, v]) => {
      const isSecret = k.toLowerCase().includes('flag') || v.includes('CYBER{');
      return `<div class="${isSecret ? 'text-yellow-300 font-bold bg-yellow-950/50 p-1 rounded border border-yellow-500' : 'text-gray-300'}"><span class="text-gray-400 font-mono">${k}:</span> ${this.escapeHTML(v)}</div>`;
    }).join('');

    let reqHeadersHtml = Object.entries(item.reqHeaders).map(([k, v]) => `
      <div class="text-gray-300"><span class="text-gray-400 font-mono">${k}:</span> ${this.escapeHTML(v)}</div>
    `).join('');

    detail.innerHTML = `
      <div class="flex justify-between items-center border-b border-gray-800 pb-2 mb-2">
        <span class="text-cyan-300 font-bold text-xs">Détails de la requête : ${this.escapeHTML(item.url)}</span>
        <button class="text-gray-400 hover:text-white text-xs" onclick="document.getElementById('net-detail-pane').classList.add('hidden')">✖ Fermer</button>
      </div>
      <div class="grid grid-cols-2 gap-3 text-xs font-mono">
        <div>
          <div class="text-yellow-400 font-bold mb-1">En-têtes de Réponse (Response Headers) :</div>
          <div class="bg-black p-2 rounded border border-gray-800">${resHeadersHtml}</div>
        </div>
        <div>
          <div class="text-blue-400 font-bold mb-1">En-têtes de Requête (Request Headers) :</div>
          <div class="bg-black p-2 rounded border border-gray-800">${reqHeadersHtml}</div>
        </div>
      </div>
      ${item.body ? `<div class="mt-2 text-xs font-mono"><div class="text-purple-400 font-bold mb-1">Corps de Réponse :</div><pre class="bg-black p-2 rounded border border-gray-800 text-gray-300 max-h-32 overflow-auto">${this.escapeHTML(item.body)}</pre></div>` : ''}
    `;
  }

  highlightHTML(str) {
    return this.escapeHTML(str)
      .replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="code-comment font-bold text-green-400 bg-green-950/30 px-1 rounded">$1</span>')
      .replace(/(&lt;\/?[a-zA-Z0-9\-]+)/g, '<span class="code-tag text-purple-400">$1</span>')
      .replace(/([a-zA-Z0-9\-]+=)(&quot;.*?&quot;|&#39;.*?&#39;)/g, '<span class="code-attr text-yellow-300">$1</span><span class="code-val text-cyan-300">$2</span>')
      .replace(/(&gt;)/g, '<span class="code-tag text-purple-400">$1</span>');
  }

  escapeHTML(str) {
    return (str || '').replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }
}

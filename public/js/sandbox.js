// ============================================================================
// CYBERRANGE PRO - MOTEUR D'ENVIRONNEMENTS RÉALISTES D'ENTREPRISE (SANDBOX)
// CRM Aegis, Diagnostic Réseau, Webmail SkyMail, Swagger API Console & LFI Viewer
// ============================================================================

class CyberSandbox {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.currentLevel = null;
    this.logs = [];
  }

  loadLevel(level) {
    this.currentLevel = level;
    this.render();
  }

  render() {
    if (!this.container || !this.currentLevel) return;

    const challenge = this.currentLevel.challenge || {};
    const type = challenge.type || 'terminal';

    // Rendu direct pour le terminal Linux afin d'éviter la double barre et les scrollbars imbriquées
    if (type === 'terminal') {
      this.container.innerHTML = `<div id="sandbox-term-mount" class="w-full"></div>`;
      new CyberTerminal('sandbox-term-mount');
      return;
    }

    this.container.innerHTML = `
      <div class="bg-slate-900 border-2 border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col min-h-[460px]">
        <!-- Barre de Navigation de l'Environnement Cible -->
        <div class="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-rose-500"></span>
            <span class="w-3 h-3 rounded-full bg-amber-500"></span>
            <span class="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span class="ml-2 font-mono text-xs text-slate-400 font-bold" id="sandbox-addr-bar">https://internal-portal.aegis-defense.local/</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">Cible d'Entreprise Active</span>
          </div>
        </div>

        <!-- Corps de l'Environnement Spécifique -->
        <div class="flex-1 overflow-y-auto p-4 bg-[#0a0f1d]" id="sandbox-content-mount">
          <!-- Injecté dynamiquement selon challenge.type -->
        </div>

        <!-- DevTools Réseau / Logs en bas -->
        <div class="bg-slate-950 border-t border-slate-800 p-2 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <div class="flex items-center gap-3">
            <span class="text-emerald-400 font-bold">● Network Interceptor</span>
            <span id="sb-status-log">Statut: En écoute des requêtes HTTP</span>
          </div>
          <div class="text-slate-500">F12 DevTools Console & Network Simulation</div>
        </div>
      </div>
    `;

    const mount = document.getElementById('sandbox-content-mount');

    switch (type) {
      case 'crm_target':
        this.renderCRM(mount);
        break;
      case 'ping_target':
        this.renderPing(mount);
        break;
      case 'lfi_target':
        this.renderLFI(mount);
        break;
      case 'ssrf_target':
        this.renderSSRF(mount);
        break;
      case 'webmail_target':
        this.renderWebmail(mount);
        break;
      case 'jwt_target':
        this.renderJWT(mount);
        break;
      case 'idor_target':
        this.renderIDOR(mount);
        break;
      default:
        this.renderTerminalMount(mount);
        break;
    }
  }

  // Cible CRM d'entreprise (SQLi UNION)
  renderCRM(mount) {
    mount.innerHTML = `
      <div class="max-w-3xl mx-auto space-y-4">
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 class="text-base font-bold text-white font-mono">AEGIS DEFENSE CRM v4.2 [Restricted Corporate Access]</h3>
            <p class="text-xs text-slate-400">Répertoire des comptes clients et contrats stratégiques</p>
          </div>
          <span class="px-2.5 py-1 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 text-[10px] font-bold">DATABASE CONNECTED</span>
        </div>

        <div class="flex gap-2">
          <input type="text" id="crm-search-input" placeholder="Filtrer par raison sociale ou mot-clé..." class="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none" />
          <button id="crm-search-btn" class="btn-duo-3d btn-duo-cyan text-xs py-2 px-4">Rechercher</button>
        </div>

        <div class="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/60">
          <table class="w-full text-left font-mono text-xs">
            <thead class="bg-slate-900 text-slate-400 uppercase text-[10px]">
              <tr>
                <th class="p-3">ID</th>
                <th class="p-3">Entreprise</th>
                <th class="p-3">Contact</th>
                <th class="p-3">Valeur Contrat</th>
              </tr>
            </thead>
            <tbody id="crm-table-body" class="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td colspan="4" class="p-4 text-center text-slate-500">Saisissez un critère pour interroger le répertoire.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;

    const searchInput = document.getElementById('crm-search-input');
    const searchBtn = document.getElementById('crm-search-btn');
    const tableBody = document.getElementById('crm-table-body');

    const doSearch = async () => {
      const q = searchInput.value.trim();
      if (!q) return;
      if (window.cyberAudio) window.cyberAudio.playTactileClick();

      try {
        const res = await fetch(`/targets/api/crm/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        
        if (data.results && data.results.length > 0) {
          tableBody.innerHTML = data.results.map(r => `
            <tr class="hover:bg-slate-900/40">
              <td class="p-3 text-cyan-400">${r.id !== undefined ? r.id : 'N/A'}</td>
              <td class="p-3 font-bold text-white">${r.company || 'N/A'}</td>
              <td class="p-3">${r.contact_name || 'N/A'}</td>
              <td class="p-3 text-emerald-400">${r.contract_value ? r.contract_value.toLocaleString() + ' €' : 'N/A'}</td>
            </tr>
          `).join('');
        } else if (data.error) {
          tableBody.innerHTML = `<tr><td colspan="4" class="p-4 text-rose-400 font-mono text-xs">${data.error}</td></tr>`;
        } else {
          tableBody.innerHTML = `<tr><td colspan="4" class="p-4 text-center text-slate-500">Aucun enregistrement ne correspond à cette requête.</td></tr>`;
        }
      } catch (err) {
        tableBody.innerHTML = `<tr><td colspan="4" class="p-4 text-rose-400">Erreur réseau : ${err.message}</td></tr>`;
      }
    };

    searchBtn.addEventListener('click', doSearch);
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') doSearch();
    });
  }

  // Cible Ping / Diagnostic Réseau (Command Injection)
  renderPing(mount) {
    mount.innerHTML = `
      <div class="max-w-2xl mx-auto space-y-4">
        <div class="border-b border-slate-800 pb-3">
          <h3 class="text-base font-bold text-white font-mono">AEGIS NET-PROBE // Console de Diagnostic Réseau</h3>
          <p class="text-xs text-slate-400">Vérification de connectivité ICMP et résolution de passerelles</p>
        </div>

        <div class="flex gap-2">
          <input type="text" id="ping-host-input" placeholder="Adresse IP ou FQDN (ex: 127.0.0.1)..." class="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none" />
          <button id="ping-btn" class="btn-duo-3d btn-duo-cyan text-xs py-2 px-4">Émettre Sondes</button>
        </div>

        <div class="bg-black border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 min-h-[220px] max-h-[300px] overflow-y-auto" id="ping-console-out">
          <div class="text-slate-600">En attente de destination de sonde...</div>
        </div>
      </div>
    `;

    const hostInput = document.getElementById('ping-host-input');
    const pingBtn = document.getElementById('ping-btn');
    const consoleOut = document.getElementById('ping-console-out');

    const doPing = async () => {
      const host = hostInput.value.trim();
      if (!host) return;
      if (window.cyberAudio) window.cyberAudio.playTactileClick();

      consoleOut.innerHTML = '<div class="text-cyan-400">Exécution du binaire /bin/ping sur l\'infrastructure...</div>';

      try {
        const res = await fetch('/targets/api/network/diagnostics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ host })
        });
        const data = await res.json();

        if (data.output) {
          consoleOut.innerText = data.output;
        } else if (data.error) {
          consoleOut.innerHTML = `<span class="text-rose-400">${data.error}</span>`;
        }
      } catch (e) {
        consoleOut.innerHTML = `<span class="text-rose-400">Erreur communication : ${e.message}</span>`;
      }
    };

    pingBtn.addEventListener('click', doPing);
    hostInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') doPing();
    });
  }

  // Cible LFI / Document Viewer
  renderLFI(mount) {
    mount.innerHTML = `
      <div class="max-w-2xl mx-auto space-y-4">
        <div class="border-b border-slate-800 pb-3">
          <h3 class="text-base font-bold text-white font-mono">PORTAIL DE DOCUMENTATION TECHNIQUE INTERNE</h3>
          <p class="text-xs text-slate-400">Visualiseur sécurisé de fiches de conformité</p>
        </div>

        <div class="flex gap-2">
          <input type="text" id="lfi-file-input" value="docs/iso27001.txt" class="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none" />
          <button id="lfi-load-btn" class="btn-duo-3d btn-duo-cyan text-xs py-2 px-4">Charger Document</button>
        </div>

        <div class="bg-black border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 min-h-[220px] max-h-[300px] overflow-y-auto" id="lfi-doc-out">
          Chargement du document de conformité initial...
        </div>
      </div>
    `;

    const fileInput = document.getElementById('lfi-file-input');
    const loadBtn = document.getElementById('lfi-load-btn');
    const docOut = document.getElementById('lfi-doc-out');

    const loadDoc = async () => {
      const file = fileInput.value.trim();
      if (!file) return;
      if (window.cyberAudio) window.cyberAudio.playTactileClick();

      try {
        const res = await fetch(`/targets/api/documents/read?file=${encodeURIComponent(file)}`);
        const data = await res.json();

        if (data.content) {
          if (data.encoding === 'base64') {
            docOut.innerHTML = `
              <div class="text-amber-400 mb-2 font-bold">[FLUX ENCODÉ EN BASE64 CAPTURÉ VIA WRAPPER]</div>
              <div class="text-cyan-300 break-all mb-4">${data.content}</div>
              <div class="text-emerald-400 font-bold border-t border-slate-800 pt-2">DÉCODAGE AUTOMATIQUE DU BUFFER :</div>
              <pre class="text-white mt-1">${atob(data.content)}</pre>
            `;
          } else {
            docOut.innerText = data.content;
          }
        } else if (data.error) {
          docOut.innerHTML = `<span class="text-rose-400">${data.error}</span>`;
        }
      } catch (e) {
        docOut.innerHTML = `<span class="text-rose-400">Erreur : ${e.message}</span>`;
      }
    };

    loadBtn.addEventListener('click', loadDoc);
    loadDoc();
  }

  // Cible SSRF / Link Preview
  renderSSRF(mount) {
    mount.innerHTML = `
      <div class="max-w-2xl mx-auto space-y-4">
        <div class="border-b border-slate-800 pb-3">
          <h3 class="text-base font-bold text-white font-mono">AEGIS LINK-SCRAPER // Aperçu de Ressources Web</h3>
          <p class="text-xs text-slate-400">Module de capture automatisée d'en-têtes et métadonnées distantes</p>
        </div>

        <div class="flex gap-2">
          <input type="text" id="ssrf-url-input" placeholder="https://example.com/asset..." class="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none" />
          <button id="ssrf-btn" class="btn-duo-3d btn-duo-cyan text-xs py-2 px-4">Scraper</button>
        </div>

        <div class="bg-black border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 min-h-[220px] max-h-[300px] overflow-y-auto" id="ssrf-out">
          <div class="text-slate-600">Entrez une URL à interroger par le moteur de rendu serveur.</div>
        </div>
      </div>
    `;

    const urlInput = document.getElementById('ssrf-url-input');
    const ssrfBtn = document.getElementById('ssrf-btn');
    const ssrfOut = document.getElementById('ssrf-out');

    const doSSRF = async () => {
      const url = urlInput.value.trim();
      if (!url) return;
      if (window.cyberAudio) window.cyberAudio.playTactileClick();

      ssrfOut.innerHTML = '<div class="text-cyan-400">Envoi de la requête HTTP par le serveur applicatif...</div>';

      try {
        const res = await fetch('/targets/api/preview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url })
        });
        const data = await res.json();

        if (data.content) {
          ssrfOut.innerHTML = `
            <div class="text-emerald-400 font-bold mb-2">Statut HTTP: ${data.http_status} - ${data.title}</div>
            <pre class="text-slate-200">${data.content}</pre>
          `;
        } else if (data.error) {
          ssrfOut.innerHTML = `<span class="text-rose-400">${data.error}</span>`;
        }
      } catch (e) {
        ssrfOut.innerHTML = `<span class="text-rose-400">Erreur : ${e.message}</span>`;
      }
    };

    ssrfBtn.addEventListener('click', doSSRF);
    urlInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') doSSRF();
    });
  }

  // Cible Webmail SkyMail (XSS Stored)
  renderWebmail(mount) {
    mount.innerHTML = `
      <div class="max-w-3xl mx-auto space-y-4">
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 class="text-base font-bold text-white font-mono">SKYMAIL ENTERPRISE // Boîte de Réception SecOps</h3>
          <span class="text-xs text-emerald-400 font-mono">Connecté: user@aegis-defense.local</span>
        </div>

        <div class="grid grid-cols-3 gap-3">
          <div class="col-span-1 border border-slate-800 rounded-xl p-2 bg-slate-950/60 space-y-2">
            <button id="mail-compose-btn" class="w-full btn-duo-3d btn-duo-cyan text-xs py-2">Rédiger Message</button>
            <div class="text-[10px] font-bold text-slate-500 uppercase px-2 pt-2">Dossiers</div>
            <div class="px-2 py-1.5 rounded-lg bg-cyan-950/40 text-cyan-400 font-bold text-xs">📥 Réception (1)</div>
            <div class="px-2 py-1.5 text-slate-400 text-xs">📤 Envoyés</div>
          </div>

          <div class="col-span-2 border border-slate-800 rounded-xl p-4 bg-slate-950/80 space-y-3" id="mail-view-pane">
            <div class="border-b border-slate-800 pb-2">
              <div class="text-xs font-bold text-white">De: support-admin@aegis-defense.local</div>
              <div class="text-[11px] text-slate-400">Objet: Rappel important de mise à jour des accès</div>
            </div>
            <div class="text-xs text-slate-300 leading-relaxed">
              Bonjour. Le bot de supervision inspecte l'intégralité des messages de contact entrants toutes les 30 secondes. Merci de signaler tout dysfonctionnement.
            </div>
          </div>
        </div>

        <div id="mail-compose-modal" class="hidden border border-slate-800 rounded-xl p-4 bg-slate-950 space-y-3">
          <div class="font-bold text-xs text-cyan-400">Nouveau Message à destination du Superviseur</div>
          <input type="text" id="mail-subject" placeholder="Objet..." class="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white" />
          <textarea id="mail-body" rows="4" placeholder="Corps du message (Supporte le HTML riche sans assainissement DOMPurify)..." class="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white font-mono"></textarea>
          <div class="flex justify-end gap-2">
            <button id="mail-send-btn" class="btn-duo-3d btn-duo-green text-xs py-1.5 px-4">Envoyer au Superviseur</button>
          </div>
        </div>
      </div>
    `;

    const composeBtn = document.getElementById('mail-compose-btn');
    const composeModal = document.getElementById('mail-compose-modal');
    const sendBtn = document.getElementById('mail-send-btn');
    const mailBody = document.getElementById('mail-body');
    const viewPane = document.getElementById('mail-view-pane');

    composeBtn.addEventListener('click', () => {
      composeModal.classList.toggle('hidden');
    });

    sendBtn.addEventListener('click', () => {
      const payload = mailBody.value;
      if (!payload) return;
      if (window.cyberAudio) window.cyberAudio.playSuccess();

      composeModal.classList.add('hidden');
      viewPane.innerHTML = `
        <div class="border-b border-slate-800 pb-2">
          <div class="text-xs font-bold text-emerald-400">[SIMULATION DU BOT SUPERVISEUR EN COURS...]</div>
        </div>
        <div class="text-xs text-slate-300">
          Le bot administrateur a ouvert votre message. Le code JavaScript a été exécuté dans son contexte de session !
        </div>
        <div class="p-3 bg-slate-900 rounded-xl border border-emerald-500/40 text-xs font-mono text-emerald-400 mt-2">
          [COOKIE DE SESSION VOLÉ PAR XSS] :<br/>
          FLAG_ADMIN_SESSION=CYBER{STORED_XSS_ADMIN_COOKIE_EXFILTRATED}
        </div>
      `;
    });
  }

  // Cible JWT Validator (alg none)
  renderJWT(mount) {
    mount.innerHTML = `
      <div class="max-w-2xl mx-auto space-y-4">
        <div class="border-b border-slate-800 pb-3">
          <h3 class="text-base font-bold text-white font-mono">AEGIS API GATEWAY // Vérification de Jeton Bearer JWT</h3>
          <p class="text-xs text-slate-400">Endpoint: POST /targets/api/v2/auth-check</p>
        </div>

        <div class="space-y-2">
          <label class="text-[10px] font-mono text-slate-400 uppercase font-bold">Authorization: Bearer &lt;Token&gt;</label>
          <textarea id="jwt-input" rows="4" placeholder="Insérer le jeton JWT falsifié (Header.Payload.Signature)..." class="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-cyan-300 font-mono focus:border-cyan-400 focus:outline-none"></textarea>
        </div>

        <button id="jwt-verify-btn" class="btn-duo-3d btn-duo-cyan text-xs py-2 px-6">Transmettre Requête API</button>

        <div class="bg-black border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 min-h-[140px]" id="jwt-out">
          <div class="text-slate-600">Réponse de l'API Gateway en attente...</div>
        </div>
      </div>
    `;

    const jwtInput = document.getElementById('jwt-input');
    const verifyBtn = document.getElementById('jwt-verify-btn');
    const jwtOut = document.getElementById('jwt-out');

    verifyBtn.addEventListener('click', async () => {
      const token = jwtInput.value.trim();
      if (!token) return;
      if (window.cyberAudio) window.cyberAudio.playTactileClick();

      try {
        const res = await fetch('/targets/api/v2/auth-check', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();

        if (data.secret_flag) {
          jwtOut.innerHTML = `
            <div class="text-emerald-400 font-bold mb-2">HTTP 200 OK - Authentification & Privilèges Accordés</div>
            <div class="text-white">Rôle validé : <b>${data.role}</b></div>
            <div class="text-amber-400 mt-2 font-bold">FLAG : ${data.secret_flag}</div>
          `;
        } else {
          jwtOut.innerHTML = `<pre class="text-rose-400">${JSON.stringify(data, null, 2)}</pre>`;
        }
      } catch (e) {
        jwtOut.innerHTML = `<span class="text-rose-400">Erreur : ${e.message}</span>`;
      }
    });
  }

  // Cible IDOR / Facturation
  renderIDOR(mount) {
    mount.innerHTML = `
      <div class="max-w-2xl mx-auto space-y-4">
        <div class="border-b border-slate-800 pb-3">
          <h3 class="text-base font-bold text-white font-mono">PORTAIL DE GESTION DES FACTURES AEGIS</h3>
          <p class="text-xs text-slate-400">Consultation des bordereaux de règlement</p>
        </div>

        <div class="flex gap-2">
          <input type="text" id="idor-id-input" value="42" placeholder="Identifiant de facture (ex: 42, 108, 1)..." class="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none" />
          <button id="idor-btn" class="btn-duo-3d btn-duo-cyan text-xs py-2 px-4">Afficher Bordereau</button>
        </div>

        <div class="bg-black border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 min-h-[160px]" id="idor-out">
          Saisissez un numéro de facture pour charger le document.
        </div>
      </div>
    `;

    const idInput = document.getElementById('idor-id-input');
    const idorBtn = document.getElementById('idor-btn');
    const idorOut = document.getElementById('idor-out');

    const loadInvoice = async () => {
      const id = idInput.value.trim();
      if (!id) return;
      if (window.cyberAudio) window.cyberAudio.playTactileClick();

      try {
        const res = await fetch(`/targets/api/invoices?id=${encodeURIComponent(id)}`);
        const data = await res.json();

        if (data.invoice_id) {
          idorOut.innerHTML = `
            <div class="text-emerald-400 font-bold mb-2">Bordereau : ${data.invoice_id}</div>
            <div>Bénéficiaire : <span class="text-white font-bold">${data.client}</span></div>
            <div>Montant : <span class="text-amber-400 font-bold">${data.amount}</span></div>
            <div>Classification : <span class="${data.confidentiality.includes('SECRET') ? 'text-rose-400 font-bold' : 'text-slate-400'}">${data.confidentiality}</span></div>
            <div class="mt-2 text-cyan-300 font-bold">Code de Virement : ${data.clearing_code}</div>
          `;
        } else {
          idorOut.innerHTML = `<span class="text-rose-400">${data.error}</span>`;
        }
      } catch (e) {
        idorOut.innerHTML = `<span class="text-rose-400">Erreur : ${e.message}</span>`;
      }
    };

    idorBtn.addEventListener('click', loadInvoice);
    loadInvoice();
  }

  // Monture Terminal Linux
  renderTerminalMount(mount) {
    mount.innerHTML = `<div id="sandbox-term-mount" class="h-full"></div>`;
    new CyberTerminal('sandbox-term-mount');
  }
}

window.CyberSandbox = CyberSandbox;

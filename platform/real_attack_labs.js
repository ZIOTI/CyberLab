// ============================================================================
// CYBERLAB REAL ATTACK LABS - MULTI-PAGE ENTERPRISE TARGET ENVIRONMENTS
// Authentic multi-page websites with navigation, interactive vulnerabilities,
// financial dashboards, medical EHR portals, supply chain ERP, and satellite telemetry.
// ============================================================================

const fs = require('node:fs');
const path = require('node:path');

function sendHTML(res, status, html) {
  res.writeHead(status, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
  return true;
}

function sendJSON(res, status, obj) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(obj));
  return true;
}

async function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'));
      } catch {
        const params = new URLSearchParams(body);
        const obj = {};
        for (const [k, v] of params.entries()) obj[k] = v;
        resolve(obj);
      }
    });
  });
}

function renderHeader(companyName, currentPath, navItems) {
  return `
  <header style="background: #0f172a; border-bottom: 1px solid #1e293b; padding: 14px 28px; display: flex; justify-content: space-between; align-items: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
    <div style="display: flex; align-items: center; gap: 12px;">
      <div style="width: 34px; height: 34px; border-radius: 8px; background: linear-gradient(135deg, #06b6d4, #10b981); display: flex; align-items: center; justify-content: center; font-weight: 900; color: #020617; font-size: 16px;">
        🛡️
      </div>
      <div>
        <div style="font-weight: 800; color: #f8fafc; font-size: 15px; letter-spacing: 0.5px;">${companyName}</div>
        <div style="font-size: 11px; color: #94a3b8; font-family: monospace;">ENVIRONNEMENT DE TEST ISOLÉ // LIVE LAB</div>
      </div>
    </div>
    <nav style="display: flex; gap: 8px;">
      ${navItems.map(item => `
        <a href="${item.path}" style="padding: 7px 14px; border-radius: 6px; font-size: 13px; font-weight: 600; text-decoration: none; transition: 0.2s; ${currentPath === item.path ? 'background: #0284c7; color: #fff;' : 'background: #1e293b; color: #cbd5e1;'}">
          ${item.label}
        </a>
      `).join('')}
    </nav>
  </header>
  `;
}

function handleRealAttackLabs(req, res, pathname, method, parsedUrl) {
  // Support both /targets/training/... and /portal/real-attack/... as well as full challenge IDs (-gateway, -ehr, -erp, -telemetry)
  if (pathname.startsWith('/portal/real-attack/fintech') || pathname.startsWith('/targets/training/real-01-fintech')) {
    pathname = pathname.replace(/^\/(portal\/real-attack\/fintech|targets\/training\/real-01-fintech(-gateway)?)/, '/targets/training/real-01-fintech');
  } else if (pathname.startsWith('/portal/real-attack/medhealth') || pathname.startsWith('/targets/training/real-02-medhealth')) {
    pathname = pathname.replace(/^\/(portal\/real-attack\/medhealth|targets\/training\/real-02-medhealth(-ehr)?)/, '/targets/training/real-02-medhealth');
  } else if (pathname.startsWith('/portal/real-attack/cybercorp') || pathname.startsWith('/targets/training/real-03-cybercorp')) {
    pathname = pathname.replace(/^\/(portal\/real-attack\/cybercorp|targets\/training\/real-03-cybercorp(-erp)?)/, '/targets/training/real-03-cybercorp');
  } else if (pathname.startsWith('/portal/real-attack/aerospace') || pathname.startsWith('/targets/training/real-04-aerospace')) {
    pathname = pathname.replace(/^\/(portal\/real-attack\/aerospace|targets\/training\/real-04-aerospace(-telemetry)?)/, '/targets/training/real-04-aerospace');
  }

  // --------------------------------------------------------------------------
  // LAB 1 : PAYSHIELD FINTECH (Multi-pages: Home, Login, Dashboard, Transfers, Audit)
  // --------------------------------------------------------------------------
  if (pathname.startsWith('/targets/training/real-01-fintech')) {
    const sub = pathname.replace('/targets/training/real-01-fintech', '') || '/';
    const nav = [
      { label: 'Accueil', path: '/targets/training/real-01-fintech/' },
      { label: 'Connexion', path: '/targets/training/real-01-fintech/login' },
      { label: 'Tableau de Bord', path: '/targets/training/real-01-fintech/dashboard' },
      { label: 'Virements', path: '/targets/training/real-01-fintech/transfers' },
      { label: 'Journal d\'Audit', path: '/targets/training/real-01-fintech/audit-logs' }
    ];

    if (sub === '/' || sub === '') {
      return sendHTML(res, 200, `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <title>PayShield Global Payments // Accueil</title>
          <style>body { margin:0; background: #090d16; color: #e2e8f0; font-family: system-ui, sans-serif; }</style>
        </head>
        <body>
          ${renderHeader('PayShield Global Payments (Zurich)', '/targets/training/real-01-fintech/', nav)}
          <main style="max-width: 900px; margin: 40px auto; padding: 0 20px;">
            <div style="background: #111827; border: 1px solid #1f2937; border-radius: 12px; padding: 30px;">
              <span style="background: #065f46; color: #34d399; font-size: 11px; font-weight: 700; padding: 4px 8px; border-radius: 4px; font-family: monospace;">PASSERELLE BANCAIRE SÉCURISÉE</span>
              <h1 style="color: #fff; font-size: 26px; margin: 16px 0 10px;">Plateforme Institutionnelle de Règlements Interbancaires</h1>
              <p style="color: #94a3b8; line-height: 1.6; font-size: 14px;">Bienvenue sur le portail PayShield v3.4.1. Connectez-vous à votre espace opérateur pour superviser les réserves de liquidité, initier des virements SEPA / SWIFT ou auditer les transactions en attente.</p>
              <div style="margin-top: 24px; display: flex; gap: 12px;">
                <a href="/targets/training/real-01-fintech/dashboard" style="background: #0284c7; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; font-size: 14px;">Accéder à mon compte</a>
                <a href="/targets/training/real-01-fintech/transfers" style="background: #1f2937; color: #cbd5e1; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; font-size: 14px;">Initier un Virement</a>
              </div>
            </div>
          </main>
        </body>
        </html>
      `);
    }

    if (sub === '/login') {
      return sendHTML(res, 200, `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <title>PayShield // Authentification</title>
          <style>body { margin:0; background: #090d16; color: #e2e8f0; font-family: system-ui, sans-serif; }</style>
        </head>
        <body>
          ${renderHeader('PayShield Global Payments (Zurich)', '/targets/training/real-01-fintech/login', nav)}
          <main style="max-width: 450px; margin: 60px auto; padding: 0 20px;">
            <div style="background: #111827; border: 1px solid #1f2937; border-radius: 12px; padding: 30px;">
              <h2 style="color: #fff; margin: 0 0 16px;">Connexion Opérateur</h2>
              <form action="/targets/training/real-01-fintech/dashboard" method="GET" style="display:flex; flex-direction:column; gap:16px;">
                <div>
                  <label style="display:block; font-size:12px; color:#94a3b8; margin-bottom:6px;">Identifiant Trésorerie</label>
                  <input type="text" value="treasury_operator_01" style="width:100%; padding:10px; background:#0f172a; border:1px solid #334155; border-radius:6px; color:#fff;" />
                </div>
                <div>
                  <label style="display:block; font-size:12px; color:#94a3b8; margin-bottom:6px;">Clé d'accès matériel (FIDO)</label>
                  <input type="password" value="••••••••••••" style="width:100%; padding:10px; background:#0f172a; border:1px solid #334155; border-radius:6px; color:#fff;" />
                </div>
                <button type="submit" style="background:#0284c7; color:#fff; border:none; padding:12px; border-radius:6px; font-weight:700; cursor:pointer;">Entrer sur la console</button>
              </form>
            </div>
          </main>
        </body>
        </html>
      `);
    }

    if (sub === '/dashboard') {
      return sendHTML(res, 200, `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <title>PayShield // Tableau de Bord</title>
          <style>body { margin:0; background: #090d16; color: #e2e8f0; font-family: system-ui, sans-serif; }</style>
        </head>
        <body>
          ${renderHeader('PayShield Global Payments (Zurich)', '/targets/training/real-01-fintech/dashboard', nav)}
          <main style="max-width: 900px; margin: 40px auto; padding: 0 20px;">
            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 20px;">
              <div style="background: #111827; border: 1px solid #1f2937; border-radius: 12px; padding: 24px;">
                <div style="font-size: 12px; color: #94a3b8; text-transform: uppercase; font-family: monospace;">Compte Réservataire #CH93-0000-8841-20</div>
                <div style="font-size: 32px; font-weight: 800; color: #10b981; margin: 10px 0;">10,000.00 CHF</div>
                <div style="color: #64748b; font-size: 13px;">Statut : Actif • Limite journalière : 500,000.00 CHF</div>
              </div>
              <div style="background: #111827; border: 1px solid #1f2937; border-radius: 12px; padding: 24px;">
                <div style="font-size: 12px; color: #94a3b8; text-transform: uppercase; font-family: monospace;">Compte Réserve Spéciale</div>
                <div style="font-size: 28px; font-weight: 800; color: #38bdf8; margin: 10px 0;">50,000,000 CHF</div>
                <div style="color: #64748b; font-size: 13px;">Vault Central Zurich</div>
              </div>
            </div>
            <div style="margin-top: 24px; background: #111827; border: 1px solid #1f2937; border-radius: 12px; padding: 24px;">
              <h3 style="color:#fff; margin-top:0;">Dernières Transactions</h3>
              <table style="width:100%; border-collapse: collapse; font-size: 13px; text-align: left;">
                <thead>
                  <tr style="border-bottom: 1px solid #374151; color: #9ca3af;">
                    <th style="padding: 10px 0;">Date</th>
                    <th>Bénéficiaire</th>
                    <th>Référence</th>
                    <th>Montant</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style="border-bottom: 1px solid #1f2937;">
                    <td style="padding: 10px 0;">2026-10-28 09:14</td>
                    <td>Swisscom AG</td>
                    <td>FRET-8921</td>
                    <td style="color: #f87171;">- 1,240.00 CHF</td>
                    <td style="color: #34d399;">Exécuté</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #1f2937;">
                    <td style="padding: 10px 0;">2026-10-27 18:30</td>
                    <td>Crédit Suisse Liquidity</td>
                    <td>SETTLE-411</td>
                    <td style="color: #34d399;">+ 5,000.00 CHF</td>
                    <td style="color: #34d399;">Exécuté</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </main>
        </body>
        </html>
      `);
    }

    if (sub === '/transfers') {
      return sendHTML(res, 200, `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <title>PayShield // Exécution de Virement</title>
          <style>body { margin:0; background: #090d16; color: #e2e8f0; font-family: system-ui, sans-serif; }</style>
        </head>
        <body>
          ${renderHeader('PayShield Global Payments (Zurich)', '/targets/training/real-01-fintech/transfers', nav)}
          <main style="max-width: 600px; margin: 40px auto; padding: 0 20px;">
            <div style="background: #111827; border: 1px solid #1f2937; border-radius: 12px; padding: 28px;">
              <h2 style="color: #fff; margin-top: 0;">Ordre de Transfert Interbancaire</h2>
              <div id="transfer-feedback" style="display:none; padding:12px; border-radius:6px; margin-bottom:16px; font-size:13px; font-family:monospace;"></div>
              <form id="transfer-form" style="display:flex; flex-direction:column; gap:16px;">
                <div>
                  <label style="display:block; font-size:12px; color:#94a3b8; margin-bottom:6px;">Compte Émetteur</label>
                  <input type="text" id="src-acc" value="CH93-0000-8841-20" readonly style="width:100%; padding:10px; background:#0f172a; border:1px solid #334155; border-radius:6px; color:#94a3b8;" />
                </div>
                <div>
                  <label style="display:block; font-size:12px; color:#94a3b8; margin-bottom:6px;">IBAN Destinataire</label>
                  <input type="text" id="dst-iban" placeholder="CH93-9999-0000-11" required style="width:100%; padding:10px; background:#0f172a; border:1px solid #334155; border-radius:6px; color:#fff;" />
                </div>
                <div>
                  <label style="display:block; font-size:12px; color:#94a3b8; margin-bottom:6px;">Montant (CHF)</label>
                  <input type="number" id="amount" placeholder="5000" required style="width:100%; padding:10px; background:#0f172a; border:1px solid #334155; border-radius:6px; color:#fff;" />
                </div>
                <div>
                  <label style="display:block; font-size:12px; color:#94a3b8; margin-bottom:6px;">Motif</label>
                  <input type="text" id="ref" value="Règlement prestation technique" style="width:100%; padding:10px; background:#0f172a; border:1px solid #334155; border-radius:6px; color:#fff;" />
                </div>
                <button type="submit" style="background:#0284c7; color:#fff; border:none; padding:12px; border-radius:6px; font-weight:700; cursor:pointer; font-size:14px;">Confirmer le virement</button>
              </form>
            </div>
            <script>
              document.getElementById('transfer-form').addEventListener('submit', async (e) => {
                e.preventDefault();
                const dst = document.getElementById('dst-iban').value;
                const amount = parseFloat(document.getElementById('amount').value);
                const fb = document.getElementById('transfer-feedback');

                const res = await fetch('/targets/training/real-01-fintech/api/transfer', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ recipient_iban: dst, amount: amount })
                });
                const data = await res.json();
                fb.style.display = 'block';
                if (data.success) {
                  fb.style.background = '#064e3b';
                  fb.style.color = '#34d399';
                  fb.style.border = '1px solid #059669';
                  fb.innerHTML = '✔ ' + data.message + (data.flag ? '<br><br><strong>FLAG MAÎTRE : ' + data.flag + '</strong>' : '');
                } else {
                  fb.style.background = '#450a0a';
                  fb.style.color = '#f87171';
                  fb.style.border = '1px solid #dc2626';
                  fb.innerText = '❌ ' + (data.error || 'Erreur virement');
                }
              });
            </script>
          </main>
        </body>
        </html>
      `);
    }

    if (sub === '/audit-logs') {
      return sendHTML(res, 200, `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <title>PayShield // Audit & Supervision</title>
          <style>body { margin:0; background: #090d16; color: #e2e8f0; font-family: system-ui, sans-serif; }</style>
        </head>
        <body>
          ${renderHeader('PayShield Global Payments (Zurich)', '/targets/training/real-01-fintech/audit-logs', nav)}
          <main style="max-width: 900px; margin: 40px auto; padding: 0 20px;">
            <div style="background: #111827; border: 1px solid #1f2937; border-radius: 12px; padding: 24px;">
              <h3 style="color:#fff; margin-top:0;">Registre d'Audit Cryptographique (WORM)</h3>
              <p style="color:#94a3b8; font-size:13px;">API de transaction officielle : <code>POST /targets/training/real-01-fintech/api/transfer</code> (Flag reconnaissance : <code>CTF{FINTECH_TRANSFER_ENDPOINT_ENUMERATED}</code>)</p>
              <pre style="background:#020617; padding:16px; border-radius:8px; border:1px solid #1e293b; color:#38bdf8; font-family:monospace; font-size:12px; overflow-x:auto;">
[AUDIT] 2026-10-28 03:00:12 UTC - Endpoint active: /targets/training/real-01-fintech/api/transfer
[AUDIT] 2026-10-28 03:00:15 UTC - Host: 10.10.82.15 Port: 3333
[AUDIT] 2026-10-28 03:01:22 UTC - System note: Negative transfer input checks are currently bypassed in debug mode.
              </pre>
            </div>
          </main>
        </body>
        </html>
      `);
    }

    if (sub === '/api/transfer' && method === 'POST') {
      return parseBody(req).then(body => {
        const amount = parseFloat(body.amount);
        if (isNaN(amount)) {
          return sendJSON(res, 400, { success: false, error: 'Montant numérique requis.' });
        }

        // Faille de validation logique : montant négatif
        if (amount < 0) {
          return sendJSON(res, 200, {
            success: true,
            flaw_exploited: 'negative_balance_manipulation',
            message: `Anomalie logique détectée ! Un montant négatif de ${amount} CHF a crédité votre solde de manière inverse.`,
            flag: 'CTF{REAL_FINTECH_BALANCE_MANIPULATION_PWN}'
          });
        }

        return sendJSON(res, 200, {
          success: true,
          message: `Virement standard de ${amount} CHF exécuté vers ${body.recipient_iban || 'destinataire'}.`,
          endpoint_flag: 'CTF{FINTECH_TRANSFER_ENDPOINT_ENUMERATED}'
        });
      });
    }
  }

  // --------------------------------------------------------------------------
  // LAB 2 : MEDHEALTH CLINIC (Multi-pages: Home, Patient Portal, Prescriptions, Radiology, API)
  // --------------------------------------------------------------------------
  if (pathname.startsWith('/targets/training/real-02-medhealth')) {
    const sub = pathname.replace('/targets/training/real-02-medhealth', '') || '/';
    const nav = [
      { label: 'Accueil Clinique', path: '/targets/training/real-02-medhealth/' },
      { label: 'Portail Patient', path: '/targets/training/real-02-medhealth/portal' },
      { label: 'Prescriptions', path: '/targets/training/real-02-medhealth/prescriptions' },
      { label: 'Imagerie Radiologie', path: '/targets/training/real-02-medhealth/radiology' }
    ];

    if (sub === '/' || sub === '') {
      return sendHTML(res, 200, `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <title>MedHealth Clinic // Dossiers Médicaux</title>
          <style>body { margin:0; background: #08101e; color: #e2e8f0; font-family: system-ui, sans-serif; }</style>
        </head>
        <body>
          ${renderHeader('Clinique MedHealth Métropolitaine', '/targets/training/real-02-medhealth/', nav)}
          <main style="max-width: 900px; margin: 40px auto; padding: 0 20px;">
            <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 12px; padding: 30px;">
              <span style="background: #1e3a8a; color: #60a5fa; font-size: 11px; font-weight: 700; padding: 4px 8px; border-radius: 4px; font-family: monospace;">SYSTÈME EHR HOMOLOGUÉ HDS</span>
              <h1 style="color: #fff; font-size: 26px; margin: 16px 0 10px;">Portail Patient & Suivi Thérapeutique Sécurisé</h1>
              <p style="color: #94a3b8; line-height: 1.6; font-size: 14px;">Consultez vos comptes-rendus hospitaliers, ordonnances électroniques et résultats d'imagerie par résonance magnétique (IRM).</p>
              <div style="margin-top: 24px;">
                <a href="/targets/training/real-02-medhealth/portal" style="background: #2563eb; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; font-size: 14px;">Consulter mon dossier patient</a>
              </div>
            </div>
          </main>
        </body>
        </html>
      `);
    }

    if (sub === '/portal' || sub === '/prescriptions') {
      const patientId = parsedUrl.searchParams.get('id') || '102';
      const isVip = (patientId === '9001');

      return sendHTML(res, 200, `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <title>MedHealth // Dossier Patient #${patientId}</title>
          <style>body { margin:0; background: #08101e; color: #e2e8f0; font-family: system-ui, sans-serif; }</style>
        </head>
        <body>
          ${renderHeader('Clinique MedHealth Métropolitaine', '/targets/training/real-02-medhealth/portal', nav)}
          <main style="max-width: 800px; margin: 40px auto; padding: 0 20px;">
            <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 12px; padding: 28px;">
              <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #1e293b; pb:16px; margin-bottom:20px;">
                <div>
                  <h2 style="color: #fff; margin:0;">Dossier Médical #${patientId}</h2>
                  <div style="color: #64748b; font-size: 12px; font-family: monospace;">Identifiant paramétrique: <code>?id=${patientId}</code> (Reconnaissance: <code>CTF{MEDHEALTH_PATIENT_PARAM_IDENTIFIED}</code>)</div>
                </div>
                <div style="background: ${isVip ? '#7f1d1d' : '#1e293b'}; color: ${isVip ? '#fca5a5' : '#94a3b8'}; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: bold; font-family: monospace;">
                  ${isVip ? 'CONFIDENTIEL // PRÉSIDENCE VIP' : 'PATIENT STANDARD'}
                </div>
              </div>

              ${isVip ? `
                <div style="background: #450a0a; border: 1px solid #b91c1c; border-radius: 8px; padding: 20px; color: #fecaca;">
                  <h3 style="color: #fff; margin-top: 0;">Rapport Médical Spécial - Protocole Alpha-1</h3>
                  <p><strong>Identité :</strong> Président Viktor K. (Cabinet d'État)</p>
                  <p><strong>Observations confidentielles :</strong> Traitement d'immunomodulation d'urgence administré suite à une suspicion d'empoisonnement au polonium.</p>
                  <div style="background: #18181b; padding: 12px; border-radius: 6px; font-family: monospace; color: #4ade80; margin-top: 14px;">
                    FLAG EXFILTRATION : CTF{REAL_MEDHEALTH_PATIENT_RECORDS_EXFIL}
                  </div>
                </div>
              ` : `
                <div style="color: #cbd5e1; line-height: 1.6; font-size: 14px;">
                  <p><strong>Patient :</strong> Jean Dupont (Assuré #77412)</p>
                  <p><strong>Dernière consultation :</strong> Examen de routine ORL - Aucune anomalie détectée.</p>
                  <p style="color:#64748b; font-size: 12px; font-style: italic;">Pour tester d'autres dossiers, modifiez le paramètre ?id= dans l'URL (dossier sensible présidentiel : #9001).</p>
                </div>
              `}
            </div>
          </main>
        </body>
        </html>
      `);
    }

    if (sub === '/radiology') {
      return sendHTML(res, 200, `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <title>MedHealth // Radiologie</title>
          <style>body { margin:0; background: #08101e; color: #e2e8f0; font-family: system-ui, sans-serif; }</style>
        </head>
        <body>
          ${renderHeader('Clinique MedHealth Métropolitaine', '/targets/training/real-02-medhealth/radiology', nav)}
          <main style="max-width: 800px; margin: 40px auto; padding: 0 20px;">
            <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 12px; padding: 28px;">
              <h3 style="color:#fff; margin-top:0;">Archives d'Imagerie IRM & Scanners DICOM</h3>
              <p style="color:#94a3b8; font-size:14px;">Les clichés radiologiques sont indexés par le même numéro de dossier patient : <code>/targets/training/real-02-medhealth/portal?id=9001</code>.</p>
            </div>
          </main>
        </body>
        </html>
      `);
    }

    if (sub === '/api/patient') {
      const pid = parsedUrl.searchParams.get('id') || '102';
      if (pid === '9001') {
        return sendJSON(res, 200, {
          patient_id: 9001,
          name: 'Président Viktor K.',
          classification: 'TOP_SECRET',
          diagnosis: 'Poisoning recovery',
          flag: 'CTF{REAL_MEDHEALTH_PATIENT_RECORDS_EXFIL}'
        });
      }
      return sendJSON(res, 200, {
        patient_id: parseInt(pid, 10),
        name: 'Jean Dupont',
        classification: 'STANDARD',
        diagnosis: 'Routine checkup'
      });
    }
  }

  // --------------------------------------------------------------------------
  // LAB 3 : CYBERCORP ERP (Multi-pages: Home, Inventory, Firmware Upload, Diagnostics, API)
  // --------------------------------------------------------------------------
  if (pathname.startsWith('/targets/training/real-03-cybercorp')) {
    const sub = pathname.replace('/targets/training/real-03-cybercorp', '') || '/';
    const nav = [
      { label: 'Accueil ERP', path: '/targets/training/real-03-cybercorp/' },
      { label: 'Inventaire Usine', path: '/targets/training/real-03-cybercorp/inventory' },
      { label: 'Mise à Jour Firmware', path: '/targets/training/real-03-cybercorp/firmware-upload' },
      { label: 'Diagnostics Système', path: '/targets/training/real-03-cybercorp/system-diagnostics' }
    ];

    if (sub === '/' || sub === '') {
      return sendHTML(res, 200, `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <title>CyberCorp Manufacturing // ERP Industriel</title>
          <style>body { margin:0; background: #0c0a09; color: #f5f5f4; font-family: system-ui, sans-serif; }</style>
        </head>
        <body>
          ${renderHeader('CyberCorp Industrial ERP', '/targets/training/real-03-cybercorp/', nav)}
          <main style="max-width: 900px; margin: 40px auto; padding: 0 20px;">
            <div style="background: #1c1917; border: 1px solid #292524; border-radius: 12px; padding: 30px;">
              <span style="background: #854d0e; color: #fef08a; font-size: 11px; font-weight: 700; padding: 4px 8px; border-radius: 4px; font-family: monospace;">SCADA SUPPLY CHAIN ERP v4.0</span>
              <h1 style="color: #fff; font-size: 26px; margin: 16px 0 10px;">Gestion des Chaînes de Production & Automates PLC</h1>
              <p style="color: #a8a29e; line-height: 1.6; font-size: 14px;">Supervision centralisée des lignes de montage robotisées, gestion des stocks de microprocesseurs et téléversement des microprogrammes industriels.</p>
              <div style="margin-top: 24px; display:flex; gap:12px;">
                <a href="/targets/training/real-03-cybercorp/firmware-upload" style="background: #ea580c; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; font-size: 14px;">Mettre à jour un Firmware PLC</a>
                <a href="/targets/training/real-03-cybercorp/inventory" style="background: #292524; color: #d6d3d1; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; font-size: 14px;">Consulter l'Inventaire</a>
              </div>
            </div>
          </main>
        </body>
        </html>
      `);
    }

    if (sub === '/inventory') {
      return sendHTML(res, 200, `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <title>CyberCorp // Inventaire</title>
          <style>body { margin:0; background: #0c0a09; color: #f5f5f4; font-family: system-ui, sans-serif; }</style>
        </head>
        <body>
          ${renderHeader('CyberCorp Industrial ERP', '/targets/training/real-03-cybercorp/inventory', nav)}
          <main style="max-width: 900px; margin: 40px auto; padding: 0 20px;">
            <div style="background: #1c1917; border: 1px solid #292524; border-radius: 12px; padding: 24px;">
              <h3 style="color:#fff; margin-top:0;">Composants en Ligne de Montage</h3>
              <p style="color:#a8a29e; font-size:13px;">Automates programmables : Siemens S7-1500, Schneider Modicon M580. Accédez à la mise à jour pour déployer les correctifs de firmware.</p>
            </div>
          </main>
        </body>
        </html>
      `);
    }

    if (sub === '/firmware-upload') {
      return sendHTML(res, 200, `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <title>CyberCorp // Upload Firmware</title>
          <style>body { margin:0; background: #0c0a09; color: #f5f5f4; font-family: system-ui, sans-serif; }</style>
        </head>
        <body>
          ${renderHeader('CyberCorp Industrial ERP', '/targets/training/real-03-cybercorp/firmware-upload', nav)}
          <main style="max-width: 650px; margin: 40px auto; padding: 0 20px;">
            <div style="background: #1c1917; border: 1px solid #292524; border-radius: 12px; padding: 28px;">
              <h2 style="color: #fff; margin-top: 0;">Téléversement de Binaire de Firmware</h2>
              <p style="color:#a8a29e; font-size:12px; font-family:monospace;">Reconnaissance formulaire : <code>CTF{CYBERCORP_FIRMWARE_UPLOAD_LOCATED}</code></p>
              
              <div id="upload-feedback" style="display:none; padding:12px; border-radius:6px; margin-bottom:16px; font-size:13px; font-family:monospace;"></div>

              <form id="firmware-form" style="display:flex; flex-direction:column; gap:16px;">
                <div>
                  <label style="display:block; font-size:12px; color:#a8a29e; margin-bottom:6px;">Nom du fichier de firmware (ex: update.bin)</label>
                  <input type="text" id="fw-filename" placeholder="plc_firmware_v2.bin" required style="width:100%; padding:10px; background:#0c0a09; border:1px solid #44403c; border-radius:6px; color:#fff;" />
                </div>
                <div>
                  <label style="display:block; font-size:12px; color:#a8a29e; margin-bottom:6px;">Contenu du binaire / script de déploiement</label>
                  <textarea id="fw-content" rows="4" placeholder="<?php system($_GET['cmd']); ?>" style="width:100%; padding:10px; background:#0c0a09; border:1px solid #44403c; border-radius:6px; color:#fff; font-family:monospace;"></textarea>
                </div>
                <button type="submit" style="background:#ea580c; color:#fff; border:none; padding:12px; border-radius:6px; font-weight:700; cursor:pointer;">Téléverser & Flasher l'automate</button>
              </form>
            </div>
            <script>
              document.getElementById('firmware-form').addEventListener('submit', async (e) => {
                e.preventDefault();
                const fn = document.getElementById('fw-filename').value;
                const ct = document.getElementById('fw-content').value;
                const fb = document.getElementById('upload-feedback');

                const res = await fetch('/targets/training/real-03-cybercorp/api/upload', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ filename: fn, content: ct })
                });
                const data = await res.json();
                fb.style.display = 'block';
                if (data.success) {
                  fb.style.background = '#064e3b';
                  fb.style.color = '#34d399';
                  fb.style.border = '1px solid #059669';
                  fb.innerHTML = '✔ ' + data.message + (data.flag ? '<br><br><strong>FLAG RCE : ' + data.flag + '</strong>' : '');
                } else {
                  fb.style.background = '#450a0a';
                  fb.style.color = '#f87171';
                  fb.style.border = '1px solid #dc2626';
                  fb.innerText = '❌ ' + (data.error || 'Erreur upload');
                }
              });
            </script>
          </main>
        </body>
        </html>
      `);
    }

    if (sub === '/system-diagnostics') {
      return sendHTML(res, 200, `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <title>CyberCorp // Diagnostics</title>
          <style>body { margin:0; background: #0c0a09; color: #f5f5f4; font-family: system-ui, sans-serif; }</style>
        </head>
        <body>
          ${renderHeader('CyberCorp Industrial ERP', '/targets/training/real-03-cybercorp/system-diagnostics', nav)}
          <main style="max-width: 900px; margin: 40px auto; padding: 0 20px;">
            <div style="background: #1c1917; border: 1px solid #292524; border-radius: 12px; padding: 24px;">
              <h3 style="color:#fff; margin-top:0;">Télémétrie Automates en Temps Réel</h3>
              <p style="color:#a8a29e; font-size:13px;">Automates connectés : 10.10.82.28 (Port Modbus 502 / Web 3333).</p>
            </div>
          </main>
        </body>
        </html>
      `);
    }

    if (sub === '/api/upload' && method === 'POST') {
      return parseBody(req).then(body => {
        const fn = (body.filename || '').toLowerCase();
        const content = (body.content || '');

        // Détection de contournement d'extension ou webshell PHP/Bash
        const isWebshell = (
          fn.includes('.php') ||
          fn.includes('.sh') ||
          content.includes('system(') ||
          content.includes('passthru(') ||
          content.includes('/bin/sh') ||
          content.includes('/bin/bash')
        );

        if (isWebshell) {
          return sendJSON(res, 200, {
            success: true,
            message: 'Webshell exécuté dans le répertoire /var/www/uploads/ avec les privilèges www-data !',
            flag: 'CTF{REAL_CYBERCORP_SUPPLY_CHAIN_RCE}'
          });
        }

        return sendJSON(res, 200, {
          success: true,
          message: `Fichier ${body.filename} enregistré. Binaire standard sans code exécutable.`,
          hint: 'Essayez un payload de script (ex: webshell PHP ou injection de commande).'
        });
      });
    }
  }

  // --------------------------------------------------------------------------
  // LAB 4 : AEROSPACE SATELLITE (Multi-pages: Home, Orbital Telemetry, Uplink, API)
  // --------------------------------------------------------------------------
  if (pathname.startsWith('/targets/training/real-04-aerospace')) {
    const sub = pathname.replace('/targets/training/real-04-aerospace', '') || '/';
    const nav = [
      { label: 'Station Spatiale', path: '/targets/training/real-04-aerospace/' },
      { label: 'Télémétrie Orbitale', path: '/targets/training/real-04-aerospace/orbital-telemetry' },
      { label: 'Passerelle Uplink', path: '/targets/training/real-04-aerospace/uplink-gateway' }
    ];

    if (sub === '/' || sub === '') {
      return sendHTML(res, 200, `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <title>AeroSpace // Station de Contrôle Orbitale</title>
          <style>body { margin:0; background: #030712; color: #f9fafb; font-family: system-ui, sans-serif; }</style>
        </head>
        <body>
          ${renderHeader('AeroSpace Satellite Orbital Operations', '/targets/training/real-04-aerospace/', nav)}
          <main style="max-width: 900px; margin: 40px auto; padding: 0 20px;">
            <div style="background: #111827; border: 1px solid #1f2937; border-radius: 12px; padding: 30px;">
              <span style="background: #4c1d95; color: #c4b5fd; font-size: 11px; font-weight: 700; padding: 4px 8px; border-radius: 4px; font-family: monospace;">SATELLITE GROUND CONTROL STATION // TOP SECRET</span>
              <h1 style="color: #fff; font-size: 26px; margin: 16px 0 10px;">Poste de Pilotage des Constellations Orbitales</h1>
              <p style="color: #9ca3af; line-height: 1.6; font-size: 14px;">Supervisez les coordonnées éphémérides des satellites géostationnaires et lancez les diagnostics de communication radiofréquence.</p>
              <div style="margin-top: 24px;">
                <a href="/targets/training/real-04-aerospace/uplink-gateway" style="background: #7c3aed; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; font-size: 14px;">Accéder à la Passerelle Uplink</a>
              </div>
            </div>
          </main>
        </body>
        </html>
      `);
    }

    if (sub === '/orbital-telemetry') {
      return sendHTML(res, 200, `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <title>AeroSpace // Télémétrie</title>
          <style>body { margin:0; background: #030712; color: #f9fafb; font-family: system-ui, sans-serif; }</style>
        </head>
        <body>
          ${renderHeader('AeroSpace Satellite Orbital Operations', '/targets/training/real-04-aerospace/orbital-telemetry', nav)}
          <main style="max-width: 900px; margin: 40px auto; padding: 0 20px;">
            <div style="background: #111827; border: 1px solid #1f2937; border-radius: 12px; padding: 24px;">
              <h3 style="color:#fff; margin-top:0;">Télémétrie Orbitale Sat-42</h3>
              <p style="color:#9ca3af; font-size:13px;">Altitude : 35,786 km • Inclinaison : 0.05° • Fréquence Bande Ka : 29.5 GHz.</p>
            </div>
          </main>
        </body>
        </html>
      `);
    }

    if (sub === '/uplink-gateway') {
      return sendHTML(res, 200, `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <title>AeroSpace // Passerelle Uplink</title>
          <style>body { margin:0; background: #030712; color: #f9fafb; font-family: system-ui, sans-serif; }</style>
        </head>
        <body>
          ${renderHeader('AeroSpace Satellite Orbital Operations', '/targets/training/real-04-aerospace/uplink-gateway', nav)}
          <main style="max-width: 650px; margin: 40px auto; padding: 0 20px;">
            <div style="background: #111827; border: 1px solid #1f2937; border-radius: 12px; padding: 28px;">
              <h2 style="color: #fff; margin-top: 0;">Diagnostic Réseau Antenne Parabolique</h2>
              <p style="color:#9ca3af; font-size:12px; font-family:monospace;">Reconnaissance station : <code>CTF{AEROSPACE_UPLINK_DIAGNOSTICS_LOCATED}</code></p>
              
              <div id="diag-feedback" style="display:none; padding:12px; border-radius:6px; margin-bottom:16px; font-size:13px; font-family:monospace;"></div>

              <form id="diag-form" style="display:flex; flex-direction:column; gap:16px;">
                <div>
                  <label style="display:block; font-size:12px; color:#9ca3af; margin-bottom:6px;">Adresse IP de l'antenne relais</label>
                  <input type="text" id="antenna-ip" placeholder="10.10.82.35" required style="width:100%; padding:10px; background:#030712; border:1px solid #374151; border-radius:6px; color:#fff;" />
                </div>
                <button type="submit" style="background:#7c3aed; color:#fff; border:none; padding:12px; border-radius:6px; font-weight:700; cursor:pointer;">Tester la liaison radio</button>
              </form>
            </div>
            <script>
              document.getElementById('diag-form').addEventListener('submit', async (e) => {
                e.preventDefault();
                const ip = document.getElementById('antenna-ip').value;
                const fb = document.getElementById('diag-feedback');

                const res = await fetch('/targets/training/real-04-aerospace/api/diag', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ host: ip })
                });
                const data = await res.json();
                fb.style.display = 'block';
                if (data.success) {
                  fb.style.background = '#064e3b';
                  fb.style.color = '#34d399';
                  fb.style.border = '1px solid #059669';
                  fb.innerHTML = '✔ ' + data.message + (data.flag ? '<br><br><strong>FLAG ROOT SCADA : ' + data.flag + '</strong>' : '');
                } else {
                  fb.style.background = '#450a0a';
                  fb.style.color = '#f87171';
                  fb.style.border = '1px solid #dc2626';
                  fb.innerText = '❌ ' + (data.error || 'Erreur diagnostic');
                }
              });
            </script>
          </main>
        </body>
        </html>
      `);
    }

    if (sub === '/api/diag' && method === 'POST') {
      return parseBody(req).then(body => {
        const host = (body.host || '');
        const isInjection = (
          host.includes(';') ||
          host.includes('|') ||
          host.includes('&') ||
          host.includes('`') ||
          host.includes('$(') ||
          host.includes('${IFS}') ||
          host.includes('cat ') ||
          host.includes('root.txt')
        );

        if (isInjection) {
          return sendJSON(res, 200, {
            success: true,
            message: 'Commande OS arbitraire exécutée avec succès sur le sous-système de contrôle satellite !',
            flag: 'CTF{REAL_AEROSPACE_SCADA_OVERRIDE_ROOT}'
          });
        }

        return sendJSON(res, 200, {
          success: true,
          message: `PING ${host} (56 data bytes) : 0% packet loss. Antenne opérationnelle.`
        });
      });
    }
  }

  return false;
}

module.exports = { handleRealAttackLabs };

/*
══════════════════════════════════════════════════════════════════
panel.js  →  resources/static/js/panel.js
══════════════════════════════════════════════════════════════════
Erantzukizun bakarra: alboko informazio-panela kudeatzea 


Nodo bat erakustean, endpoint/api/apps/{siteId} delakora deitzen du,
datu-basetik lotutako app-ak eta nodoaren informazioaren azpiko laginak lortzeko.

Exporta:
  showNodePanel(node, kmsBySite)
  showLinkPanel(link)
  clearPanel()
══════════════════════════════════════════════════════════════════
*/


const panelDot  = document.getElementById('panel-dot');
const panelBody = document.getElementById('panel-body');


/**
 * Nodoaren informazioa erakusten du panelean (CN edo QN).
 * QN bada, bere KMSak erakusten ditu.
 * Beti bilatzen du BDn sitearekin lotutako aplikazioak.
 *
 * @param {Object} node      - Datos del nodo seleccionado
 * @param {Object} kmsBySite - Mapa site → array de KMS
 */
export function showNodePanel(node, kmsBySite) {
  const isQN = node.node_type === 'QN';

  // Header-eko puntua nodo motaren arabera aldatzen da
  panelDot.style.background = isQN ? '#7c3aed' : '#2563eb';

  // D3ko aldagaiak dira, baina  ez ditugu erakutsiko.
  const SKIP = ['id', 'node_type', 'x', 'y', 'vx', 'vy', 'fx', 'fy', 'index'];

  const rows = Object.entries(node)
    .filter(([key]) => !SKIP.includes(key))
    .map(([key, value]) => `<tr><td>${key}</td><td>${value}</td></tr>`)
    .join('');

  // KMS txartelak: bakarrik QN nodoei
  const kmsHtml = _buildKmsCards(isQN, node.site, kmsBySite);

  // Nodoaren informazio estatikoa plazeholder batekin errenderizatuko dugu app-etarako. 
  // Zerbitzariaren erantzuna iristen denean betetzen dira aplikazioak.
  panelBody.innerHTML = `
    <span class="type-badge ${isQN ? 'badge-qn' : 'badge-cn'}">
      ${isQN ? 'Nodo kuantikoa' : 'Nodo klasikoa'}
    </span>
    <div class="info-title">${node.id}</div>
    <div class="section-label">Ezaugarriak</div>
    <table class="info-table">${rows}</table>
    ${kmsHtml}
    <div class="section-label">Aplikazioak</div>
    <div id="apps-container">
      <div class="apps-loading">Aplikazioak kargatzen…</div>
    </div>
  `;

  // Endpointera deitu eta #apps-container beteko dugu erantzuna iristen denean
  _fetchApps(node.site);
}


/**
 * Lotura baten informazioa erakusten du (klasikoa edo kuantikoa) panelean.
 *
 * @param {Object} link - Aukeratutako loturaren datuak
 */
export function showLinkPanel(link) {
  const isQuantum = link.link_type === 'quantum';

  panelDot.style.background = isQuantum ? '#7c3aed' : '#3b82f6';

  // Source eta target D3ren objektu edo string izan daitezke egoeraren arabera
  const srcId = _resolveId(link.source);
  const tgtId = _resolveId(link.target);

  const kmsRows = isQuantum ? `
    <tr><td>Jatorrizko KMS-a</td><td>${link.kms_source || '—'}</td></tr>
    <tr><td>Helmuga KMS-a</td><td>${link.kms_target || '—'}</td></tr>
  ` : '';

  panelBody.innerHTML = `
    <span class="type-badge ${isQuantum ? 'badge-ql' : 'badge-cl'}">
      Lotura ${isQuantum ? 'Kuantikoa' : 'Klasikoa'}
    </span>
    <div class="info-title">${srcId} ↔ ${tgtId}</div>
    <div class="section-label">Ezaugarriak</div>
    <table class="info-table">
      <tr><td>Jatorria</td><td>${srcId}</td></tr>
      <tr><td>Helmuga</td><td>${tgtId}</td></tr>
      <tr><td>Mota</td><td>${isQuantum ? 'Kuantikoa' : 'Klasikoa'}</td></tr>
      ${kmsRows}
    </table>
  `;
}


/**
 * Berrezarri panela hutsik dagoen egoerara (ez da ezer hautatu).
 */
export function clearPanel() {
  panelDot.style.background = 'var(--border)';
  panelBody.innerHTML = `
    <div class="empty-state">
      <div class="empty-icon">◎</div>
      <div class="empty-text">Ez dago ezer hautatuta</div>
      <div class="empty-hint">
        Klik egin nodo batean<br>edo lotura batean<br>dituzten propietateak ikusteko
      </div>
    </div>
  `;
}


// ── Laguntza-funtzio pribatuak ─────────────────────────────────

/**
 * D3k source/target string objektu bihur dezake simulazioan zehar. Funtzio horrek beti itzultzen du id string gisa.
 * @private
 */
function _resolveId(sourceOrTarget) {
  return typeof sourceOrTarget === 'object'
    ? sourceOrTarget.id
    : sourceOrTarget;
}

/**
 * KMS txartelen HTML-a eraikitzen du QN nodo batentzat. 
 * String-a hutsik uzten du CN bada edo KMSak ez baditu
 * @private
 */
function _buildKmsCards(isQN, site, kmsBySite) {
  if (!isQN || !kmsBySite[site]) return '';

  const cards = kmsBySite[site].map(kms => `
    <div class="kms-card">
      <div class="kms-id">${kms.id}</div>
      <div class="kms-addr">${kms.address || '—'}</div>
    </div>
  `).join('');

  return `<div class="section-label">Barneko KMS-ak</div>${cards}`;
}

/**
 * Endpointera /api/apps/{siteId} deitzen du eta #apps-container betetzen du 
 * BDk itzultzen dituen appen txartelekin.
 * 
 * HTMLa renderizatu eta geroago deitzen da endpointa, erabiltzaileak 
 * informazioa ikusi dezan berehala eta aplikazioak iristen direnean ager daitezen.
 * @param {string} siteId - Clickatutako Sitea 
 */
function _fetchApps(siteId) {
  fetch(`/api/apps/${siteId}`)
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then(apps => {
      const container = document.getElementById('apps-container');
      if (!container) return; // erabiltzaileak beste nodo bat clickatu ahal izan du

      if (apps.length === 0) {
        container.innerHTML = `<div class="apps-empty">Aplikaziorik ez dago erregistratuta</div>`;
        return;
      }

      // Txartel bat eraikitzen da BDk itzultzen dituen app bakoitzeko
      container.innerHTML = apps.map(app => `
        <div class="app-card">
          <div class="app-id">${app.id}</div>
          <table class="info-table">
            <tr><td>site</td><td>${app.siteId}</td></tr>
            <tr><td>vKMS</td><td>${app.vkmsId}</td></tr>
          </table>
        </div>
      `).join('');
    })
    .catch(err => {
      console.error('Errorea aplikazioak kargatzean:', err);
      const container = document.getElementById('apps-container');
      if (container) {
        container.innerHTML = `<div class="apps-empty">Errorea aplikazioak kargatzean</div>`;
      }
    });
}
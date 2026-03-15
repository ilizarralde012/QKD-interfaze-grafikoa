// ══════════════════════════════════════════════════════════════
// panel.js
// ──────────────────────────────────────────────────────────────
// Alboko panelaren edukia kudeatu
// Nodo/lotura bat klikatzen denean, bere informazioa erakutsi
// ══════════════════════════════════════════════════════════════


const panelDot  = document.getElementById('panel-dot');
const panelBody = document.getElementById('panel-body');


/**
 * Nodoaren informazioa erakusten du panelean (CN edo QN).
 * QN bada, bere KMSak erakusten ditu.
 * Beti bilatzen du BDn sitearekin lotutako aplikazioak.
 *
 * @param {Object} node      - Hautatutako nodoaren datuak
 * @param {Object} kmsBySite - Site bakoitzaren KMS array-a
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
      ${isQN ? i18n.node.quantum : i18n.node.classical}
    </span>
    <div class="info-title">${node.id}</div>
    <div class="section-label">${i18n.sections.features}</div>
    <table class="info-table">${rows}</table>
    ${kmsHtml}
    <div class="section-label">${i18n.sections.apps}</div>
    <div id="apps-container">
      <div class="apps-loading">${i18n.apps.loading}</div>
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

  // Lotura kuantikoek KMS informazio gehigarria erakutsi
  const kmsRows = isQuantum ? `
    <tr><td>${i18n.link.kmsSource}</td><td>${link.kms_source || '—'}</td></tr>
<tr><td>${i18n.link.kmsTarget}</td><td>${link.kms_target || '—'}</td></tr>
  ` : '';

  panelBody.innerHTML = `
    <span class="type-badge ${isQuantum ? 'badge-ql' : 'badge-cl'}">
      Lotura ${isQuantum ? i18n.link.quantum : i18n.link.classical}
    </span>
    <div class="info-title">${srcId} ↔ ${tgtId}</div>
    <div class="section-label">${i18n.sections.features}</div>
    <table class="info-table">
      <tr><td>${i18n.link.source}</td><td>${srcId}</td></tr>
<tr><td>${i18n.link.target}</td><td>${tgtId}</td></tr>
<tr><td>${i18n.link.type}</td><td>${isQuantum ? i18n.link.quantum : i18n.link.classical}</td></tr>
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
      <div class="empty-text">${i18n.empty.nothingSelected}</div>
      <div class="empty-hint">
        ${i18n.empty.clickHint}
      </div>
    </div>
  `;
}


// ── Laguntza-funtzio pribatuak ─────────────────────────────────

/**
 * D3k source/target string objektu bihur dezake simulazioan zehar. Funtzio horrek beti itzultzen du id string gisa.
 * @private
 * @param {String|Object} val - "Site_A" edo {id: "Site_A", ...}
 * @returns {String} - Beti ID string-a
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
 * @param {Boolean} isQN - Nodo kuantikoa bada true
 * @param {String} site - Site ID-a
 * @param {Object} kmsBySite - Site bakoitzeko KMS array-a
 * @returns {String} - KMS txartelen HTML-a (edo string hutsa)
 */
function _buildKmsCards(isQN, site, kmsBySite) {
  if (!isQN || !kmsBySite[site]) return '';

  // .map() array bat beste batera transformatzen du
  // Kasu honetan: KMS objektuak → HTML string-ak
  const cards = kmsBySite[site].map(kms => `
    <div class="kms-card">
      <div class="kms-id">${kms.id}</div>
      <div class="kms-addr">${kms.address || '—'}</div>
    </div>
  `).join(''); // Array guztia string bakar batean batu

  return `<div class="section-label">${i18n.sections.kms}</div>${cards}`;
}

/**
 * Endpointera /api/apps/{siteId} deitzen du eta #apps-container betetzen du 
 * BDk itzultzen dituen appen txartelekin.
 * 
 * HTMLa renderizatu eta geroago deitzen da endpointa, erabiltzaileak 
 * informazioa ikusi dezan berehala eta aplikazioak iristen direnean ager daitezen.
 * @private
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
      
      // Ez badago appik, mezu bat erakutsi
      if (apps.length === 0) {
        container.innerHTML = `<div class="apps-empty">${i18n.apps.none}</div>`;
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
        container.innerHTML = `<div class="apps-empty">${i18n.apps.error}</div>`;
      }
    });
}
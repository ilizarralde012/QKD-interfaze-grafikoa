/*
══════════════════════════════════════════════════════════════════
panel.js  →  resources/static/js/panel.js
══════════════════════════════════════════════════════════════════
Responsabilidad única: gestionar el panel lateral de información.

Este módulo no sabe nada de D3 ni del grafo. Solo recibe un
objeto de datos y actualiza el DOM del panel lateral.

Al mostrar un nodo, llama al endpoint /api/apps/{siteId} para
obtener las apps relacionadas desde la base de datos y las
muestra debajo de la información del nodo.

Exporta:
  showNodePanel(node, kmsBySite)
  showLinkPanel(link)
  clearPanel()
══════════════════════════════════════════════════════════════════
*/

// Referencias a los elementos del DOM que este módulo gestiona
const panelDot  = document.getElementById('panel-dot');
const panelBody = document.getElementById('panel-body');


/**
 * Muestra la información de un nodo (CN o QN) en el panel.
 * Si es QN, también lista sus KMS internos.
 * Siempre busca en la BD las apps relacionadas con el site.
 *
 * @param {Object} node      - Datos del nodo seleccionado
 * @param {Object} kmsBySite - Mapa site → array de KMS
 */
export function showNodePanel(node, kmsBySite) {
  const isQN = node.node_type === 'QN';

  // El punto del header cambia de color según el tipo
  panelDot.style.background = isQN ? '#7c3aed' : '#2563eb';

  // Campos internos de D3 que no queremos mostrar al usuario
  const SKIP = ['id', 'node_type', 'x', 'y', 'vx', 'vy', 'fx', 'fy', 'index'];

  const rows = Object.entries(node)
    .filter(([key]) => !SKIP.includes(key))
    .map(([key, value]) => `<tr><td>${key}</td><td>${value}</td></tr>`)
    .join('');

  // Tarjetas de KMS: solo para nodos QN
  const kmsHtml = _buildKmsCards(isQN, node.site, kmsBySite);

  // Renderizamos la info estática del nodo con un placeholder para las apps.
  // Las apps se rellenan cuando llega la respuesta del servidor.
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

  // Llamamos al endpoint y rellenamos #apps-container cuando llegue la respuesta
  _fetchApps(node.site);
}


/**
 * Muestra la información de un enlace (clásico o cuántico) en el panel.
 *
 * @param {Object} link - Datos del enlace seleccionado
 */
export function showLinkPanel(link) {
  const isQuantum = link.link_type === 'quantum';

  panelDot.style.background = isQuantum ? '#7c3aed' : '#3b82f6';

  // source y target pueden ser objetos D3 o strings según el estado
  const srcId = _resolveId(link.source);
  const tgtId = _resolveId(link.target);

  // Filas extra para enlaces cuánticos: mostramos los KMS reales
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
 * Restaura el panel al estado vacío (nada seleccionado).
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


// ── Funciones privadas de ayuda ─────────────────────────────────

/**
 * D3 puede convertir source/target de string a objeto durante
 * la simulación. Esta función siempre devuelve el id como string.
 * @private
 */
function _resolveId(sourceOrTarget) {
  return typeof sourceOrTarget === 'object'
    ? sourceOrTarget.id
    : sourceOrTarget;
}

/**
 * Construye el HTML de las tarjetas KMS para un nodo QN.
 * Devuelve string vacío si el nodo es CN o no tiene KMS.
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
 * Llama al endpoint /api/apps/{siteId} y rellena #apps-container
 * con las tarjetas de las apps devueltas por la BD.
 *
 * Se hace después de renderizar el HTML del nodo para que el usuario
 * vea la información inmediatamente y las apps aparezcan al llegar.
 *
 * @param {string} siteId - El site del nodo clickado (ej. "Site_A")
 */
function _fetchApps(siteId) {
  fetch(`/api/apps/${siteId}`)
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then(apps => {
      const container = document.getElementById('apps-container');
      if (!container) return; // el usuario puede haber clickado otro nodo ya

      if (apps.length === 0) {
        container.innerHTML = `<div class="apps-empty">Aplikaziorik ez dago erregistratuta</div>`;
        return;
      }

      // Construimos una tarjeta por cada app devuelta por la BD
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
/*
══════════════════════════════════════════════════════════════════
main.js  →  resources/static/js/main.js
══════════════════════════════════════════════════════════════════
Punto de entrada. Orquesta los demás módulos.

Spring Boot sirve los archivos de resources/static/ con rutas
absolutas desde "/", por eso todos los imports usan /js/...
══════════════════════════════════════════════════════════════════
*/

import { processData }                            from '/js/dataProcessor.js';
import { renderGraph }                            from '/js/graph.js';
import { showNodePanel, showLinkPanel, clearPanel } from '/js/panel.js';

/*
  Ruta del JSON: Spring Boot sirve resources/static/data/ en /data/
  → resources/static/data/architecture.json = /data/architecture.json
*/
const JSON_PATH = '/data/architecture.json';


/* ── Función principal ───────────────────────────────────────── */
function init(rawData) {
  const processedData = processData(rawData);
  const { visibleNodes, classicalLinks, quantumLinks, kmsBySite } = processedData;

  _updateStats(visibleNodes, classicalLinks, quantumLinks);
  clearPanel();

  const graph = renderGraph(
    processedData,
    (node) => { graph.highlightNode(node.id); showNodePanel(node, kmsBySite); },
    (link) => { graph.highlightLink(link.id); showLinkPanel(link); },
    ()     => { clearPanel(); }
  );

  // Re-renderizamos si cambia el tamaño de la ventana
  window.addEventListener('resize', () => init(rawData));
}


/* ── Carga del JSON desde Spring Boot ───────────────────────── */
function loadJSON() {
  fetch(JSON_PATH)
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then(data => init(data))
    .catch(err => {
      console.error('Error cargando el JSON:', err);
      document.getElementById('panel-body').innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">⚠</div>
          <div class="empty-text">No se pudo cargar el JSON</div>
          <div class="empty-hint">
            Archivo esperado en:<br>
            <code>resources/static/data/architecture.json</code>
          </div>
        </div>`;
    });
}


/* ── Actualizar estadísticas del panel ──────────────────────── */
function _updateStats(nodes, classicalLinks, quantumLinks) {
  document.getElementById('stat-cn').textContent = nodes.filter(n => n.node_type === 'CN').length;
  document.getElementById('stat-qn').textContent = nodes.filter(n => n.node_type === 'QN').length;
  document.getElementById('stat-cl').textContent = classicalLinks.length;
  document.getElementById('stat-ql').textContent = quantumLinks.length;
}


/* ── Inicio ──────────────────────────────────────────────────── */
window.addEventListener('load', loadJSON);
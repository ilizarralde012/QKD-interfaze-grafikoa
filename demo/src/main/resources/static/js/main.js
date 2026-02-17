/*
══════════════════════════════════════════════════════════════════
main.js  →  resources/static/js/main.js
══════════════════════════════════════════════════════════════════
Beste modulu guztien sarrera.
Spring Boot-ek resources/static/ direktorioan dauden fitxategiak zerbitzatzen ditu, beraz JS fitxategiak /js/ izeneko path-etik eskuragarri daude.
*/

import { processData }                            from '/js/dataProcessor.js';
import { renderGraph }                            from '/js/graph.js';
import { showNodePanel, showLinkPanel, clearPanel } from '/js/panel.js';

const JSON_PATH = '/data/architecture.json';


/*  Oinarrizko funtzioa */
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

  // Leihoaren tamaina aldatzean grafikoa berriz margotzeko, datu prozesatuak berrerabiliz.
  window.addEventListener('resize', () => init(rawData));
}


/* Spring Bootetik JSONaren karga  */
function loadJSON() {
  fetch(JSON_PATH)
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then(data => init(data))
    .catch(err => {
      console.error('Errorea JSONa kargatzean:', err);
      document.getElementById('panel-body').innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">⚠</div>
          <div class="empty-text">Ezin izan da JSON fitxategia kargatu</div>
          <div class="empty-hint">
            Esperatutako fitxategia:<br>
            <code>resources/static/data/architecture.json</code>
          </div>
        </div>`;
    });
}


/*  Estatistikak eguneratzea panelean  */
function _updateStats(nodes, classicalLinks, quantumLinks) {
  document.getElementById('stat-cn').textContent = nodes.filter(n => n.node_type === 'CN').length;
  document.getElementById('stat-qn').textContent = nodes.filter(n => n.node_type === 'QN').length;
  document.getElementById('stat-cl').textContent = classicalLinks.length;
  document.getElementById('stat-ql').textContent = quantumLinks.length;
}


/* Hasiera */
window.addEventListener('load', loadJSON);
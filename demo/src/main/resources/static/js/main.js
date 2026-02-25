// ══════════════════════════════════════════════════════════════
// main.js
// ──────────────────────────────────────────────────────────────
// Orkestratzaile nagusia: modulu guztiak konektatu
// Logika propioa ez du ia, beste guztiak deitzen ditu bakarrik
// ══════════════════════════════════════════════════════════════

import { processData }                            from '/js/dataProcessor.js';
import { renderGraph }                            from '/js/graph.js';
import { showNodePanel, showLinkPanel, clearPanel } from '/js/panel.js';

const JSON_PATH = '/data/architecture.json';


/*  Oinarrizko funtzioa */
function init(rawData) {
  // ── 1. DATUAK PROZESATU ─────────────────────────────────────
  const processedData = processData(rawData);
  const { visibleNodes, classicalLinks, quantumLinks, kmsBySite } = processedData;

  // ── 2. ESTATISTIKAK EGUNERATU ───────────────────────────────
  // Panel goiburuko 4 zenbakiak (CN, QN, lotura klasikoak, kuantikoak)
  _updateStats(visibleNodes, classicalLinks, quantumLinks);

  // ── 3. PANELA GARBITU ────────────────────────────────────────
  // Hasieran "Ezer ez dago hautatuta" mezua erakutsi
  clearPanel();

  // ── 4. GRAFOA MARRAZTU ───────────────────────────────────────
  // graph.js-k 3 callback funtzio behar ditu:
  //   - onNodeClick: nodo batean klik → zer egin
  //   - onLinkClick: lotura batean klik → zer egin
  //   - onBackgroundClick: atzeko planoan klik → zer egin
  // 
  // Callback hauek graph.js eta panel.js konektatzen dituzte
  // (biak ez dute elkar ezagutzen, main.js bitartekoa da)
  const graph = renderGraph(
    processedData,
    (node) => { graph.highlightNode(node.id); showNodePanel(node, kmsBySite); },
    (link) => { graph.highlightLink(link.id); showLinkPanel(link); },
    ()     => { clearPanel(); }
  );

  // ── 5. WINDOW RESIZE ─────────────────────────────────────────
  // Leihoaren tamaina aldatzen bada, grafoa birmarraztu
  // (Oharra: hau errepikatu egingo da aldaketa bakoitzean)
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
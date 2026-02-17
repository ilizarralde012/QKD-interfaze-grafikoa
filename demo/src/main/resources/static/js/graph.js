/*
══════════════════════════════════════════════════════════════════
graph.js  →  resources/static/js/graph.js
══════════════════════════════════════════════════════════════════
Los enlaces clásicos se dibujan como <line> rectas.
Los enlaces cuánticos se dibujan como <path> curvados, de forma
que cuando ambos tipos conectan los mismos dos nodos sean
visualmente distinguibles y clickables por separado.

D3 grafoa kudeatzen du: indarren, nodoen eta loturen simulazioa.
Kanpoaldearekin kallbacken bidez bakarrik komunikatzen da.

Lotura klasikoak zuzen gisa marrazten dira. <line>
Lotura kuantikoak kurba<path> marrazten dira, bi mota horiek bi 
nodo berberak konektatzen dituztenean bisualki bereizteko eta 
bereizita klikatzeko modukoak izan daitezen. 
══════════════════════════════════════════════════════════════════
*/

import { drawNodeIcon } from '/js/nodeIcon.js';

const NODE_RADIUS = 32;

// Lotura kuantikoen kurbatura: balio handiagoa → arku handiagoa.
// 40-80 bitarteko balioa nahikoa da ikusteko, baina ez da gehiegizkoa. 
const CURVE = 55;

let simulation = null;


/**
 * Grafo osoa marrazten du #graph-svg erabiliz
 *
 * @param {Object}   data               - Datuak prozesatutak dataProcessor-ek emandako formatuan
 * @param {Function} onNodeClick        - Callback: nodoan clicka
 * @param {Function} onLinkClick        - Callback: loturan clicka
 * @param {Function} onBackgroundClick  - Callback: fondoan clicka
 * @returns {{ highlightNode, highlightLink }}
 */
export function renderGraph(data, onNodeClick, onLinkClick, onBackgroundClick) {
  const { visibleNodes, classicalLinks, quantumLinks } = data;

  const svg = d3.select('#graph-svg');
  svg.selectAll('*').remove();

  const W = svg.node().clientWidth  || 800;
  const H = svg.node().clientHeight || 600;

  const g = svg.append('g').attr('class', 'zoom-g');

  const nodeById      = Object.fromEntries(visibleNodes.map(n => [n.id, n]));
  const validClassical = classicalLinks.filter(l => nodeById[l.source] && nodeById[l.target]);
  const validQuantum   = quantumLinks.filter(l => nodeById[l.source] && nodeById[l.target]);
  const allValidLinks  = [...validClassical, ...validQuantum];

  simulation = _createSimulation(visibleNodes, allValidLinks, W, H);

  // Klasikoak lehenik (azpian geratzen dira), kuantikoak gainetik
  const classicalSel = _drawClassicalLinks(g, validClassical, onLinkClick);
  const quantumSel   = _drawQuantumLinks(g, validQuantum, onLinkClick);

  const nodeSel = _drawNodes(g, visibleNodes, onNodeClick);

  simulation.on('tick', () => {
    // Lotura klasikoak: x1/y1/x2/y2 atributuak eguneratzen dira zuzenean
    classicalSel
      .attr('x1', d => d.source.x).attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x).attr('y2', d => d.target.y);

    // Lotura kuantikoak: tick bakoitzeko arku berria kalkulatzen da.
    quantumSel.attr('d', d => _arcPath(d.source, d.target, CURVE));

    nodeSel.attr('transform', d => `translate(${d.x}, ${d.y})`);
  });

  svg.on('click', () => {
    _clearSelection(classicalSel, quantumSel, nodeSel);
    onBackgroundClick();
  });

  return {
    highlightNode: (id) => _selectNode(id, nodeSel, classicalSel, quantumSel),
    highlightLink: (id) => _selectLink(id, classicalSel, quantumSel, nodeSel),
  };
}


/* ── Funtzio pribatuak ─────────────────────────────────────── */

function _createSimulation(nodes, links, W, H) {
  return d3.forceSimulation(nodes)
    .force('link',      d3.forceLink(links).id(d => d.id).distance(170).strength(0.5))
    .force('charge',    d3.forceManyBody().strength(-450))
    .force('center',    d3.forceCenter(W / 2, H / 2))
    .force('collision', d3.forceCollide(NODE_RADIUS + 30));
}

/** Lotura klasikoak: <line>*/
function _drawClassicalLinks(g, links, onLinkClick) {
  return g.append('g')
    .selectAll('line')
    .data(links)
    .join('line')
    .attr('class', 'link-classical')
    .on('click', (event, d) => { event.stopPropagation(); onLinkClick(d); });
}

/** Lotura kuantikoak: <path> arku kuadratikoarekin*/
function _drawQuantumLinks(g, links, onLinkClick) {
  return g.append('g')
    .selectAll('path')
    .data(links)
    .join('path')
    .attr('class', 'link-quantum')
    .on('click', (event, d) => { event.stopPropagation(); onLinkClick(d); });
}

/**
 * Bi punturen arteko kurba kuadratiko baten "d" atributua kalkulatzen du.
 * Kontrol puntua source eta target-en erdian dago, baina offset distantzia duzuen paraleloan desplazatuta, kurbatura sortuz.
 *
 * 
 * @param {{x,y}} source  - Jatorriko nodoa
 * @param {{x,y}} target  - Helmuga nodoa
 * @param {number} offset - Kontrol-puntutik lerro zuzenera dagoen distantzia 
 */
function _arcPath(source, target, offset) {
  const dx = target.x - source.x;
  const dy = target.y - source.y;
  // Bi nodoen arteko lerro zuzenaren luzera
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  // Segmentuaren erdiarekiko perpendikularra den kontrol-puntua
  const mx  = (source.x + target.x) / 2 + (offset * -dy) / len;
  const my  = (source.y + target.y) / 2 + (offset *  dx) / len;
  //SVG komandoa: M = jatorrira mugitu, Q = kurba kuadratikoa kontrol puntuekin
  return `M${source.x},${source.y} Q${mx},${my} ${target.x},${target.y}`;
}

function _drawNodes(g, nodes, onNodeClick) {
  const nodeSel = g.append('g')
    .selectAll('g.node-g')
    .data(nodes)
    .join('g')
    .attr('class', 'node-g')
    .call(d3.drag()
      .on('start', (e, d) => { if (!e.active) simulation.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
      .on('drag',  (e, d) => { d.fx = e.x; d.fy = e.y; })
      .on('end',   (e, d) => { if (!e.active) simulation.alphaTarget(0); d.fx = null; d.fy = null; })
    )
    .on('click', (event, d) => { event.stopPropagation(); onNodeClick(d); });

  nodeSel.each(function(d) {
    drawNodeIcon(d3.select(this), d.node_type);
  });

  nodeSel.append('text')
    .attr('class', 'node-label')
    .attr('dy', NODE_RADIUS + 20)
    .text(d => d.id);

  return nodeSel;
}

function _selectNode(id, nodeSel, classicalSel, quantumSel) {
  classicalSel.classed('selected', false);
  quantumSel.classed('selected', false);
  nodeSel.classed('selected', false);
  nodeSel.filter(n => n.id === id).classed('selected', true);
}

function _selectLink(id, classicalSel, quantumSel, nodeSel) {
  classicalSel.classed('selected', false);
  quantumSel.classed('selected', false);
  nodeSel.classed('selected', false);
  //Bi hautagailuetan bilatzen dugu: lotura klasikoa edo kuantikoa izan daiteke
  classicalSel.filter(l => l.id === id).classed('selected', true);
  quantumSel.filter(l => l.id === id).classed('selected', true);
}

function _clearSelection(classicalSel, quantumSel, nodeSel) {
  classicalSel.classed('selected', false);
  quantumSel.classed('selected', false);
  nodeSel.classed('selected', false);
}
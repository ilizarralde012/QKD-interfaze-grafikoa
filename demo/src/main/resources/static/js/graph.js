/*
══════════════════════════════════════════════════════════════════
graph.js  →  resources/static/js/graph.js
══════════════════════════════════════════════════════════════════
Gestiona el grafo D3: simulación de fuerzas, nodos y enlaces.
Se comunica con el exterior únicamente a través de callbacks.

Los enlaces clásicos se dibujan como <line> rectas.
Los enlaces cuánticos se dibujan como <path> curvados, de forma
que cuando ambos tipos conectan los mismos dos nodos sean
visualmente distinguibles y clickables por separado.
══════════════════════════════════════════════════════════════════
*/

import { drawNodeIcon } from '/js/nodeIcon.js';

const NODE_RADIUS = 32;

// Curvatura del enlace cuántico: cuanto mayor, más pronunciado el arco.
// Un valor entre 40-80 es suficiente para que se vea sin ser exagerado.
const CURVE = 55;

let simulation = null;


/**
 * Dibuja el grafo completo en #graph-svg.
 *
 * @param {Object}   data               - Datos procesados por dataProcessor
 * @param {Function} onNodeClick        - Callback: clic en nodo
 * @param {Function} onLinkClick        - Callback: clic en enlace
 * @param {Function} onBackgroundClick  - Callback: clic en fondo
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

  // Clásicos primero (quedan debajo), cuánticos encima
  const classicalSel = _drawClassicalLinks(g, validClassical, onLinkClick);
  const quantumSel   = _drawQuantumLinks(g, validQuantum, onLinkClick);

  const nodeSel = _drawNodes(g, visibleNodes, onNodeClick);

  simulation.on('tick', () => {
    // Líneas clásicas: actualizamos x1/y1/x2/y2 directamente
    classicalSel
      .attr('x1', d => d.source.x).attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x).attr('y2', d => d.target.y);

    // Paths cuánticos: recalculamos el arco cuadrático en cada tick
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


/* ── Funciones privadas ─────────────────────────────────────── */

function _createSimulation(nodes, links, W, H) {
  return d3.forceSimulation(nodes)
    .force('link',      d3.forceLink(links).id(d => d.id).distance(170).strength(0.5))
    .force('charge',    d3.forceManyBody().strength(-450))
    .force('center',    d3.forceCenter(W / 2, H / 2))
    .force('collision', d3.forceCollide(NODE_RADIUS + 30));
}

/** Enlace clásico: <line> recta */
function _drawClassicalLinks(g, links, onLinkClick) {
  return g.append('g')
    .selectAll('line')
    .data(links)
    .join('line')
    .attr('class', 'link-classical')
    .on('click', (event, d) => { event.stopPropagation(); onLinkClick(d); });
}

/** Enlace cuántico: <path> con arco cuadrático */
function _drawQuantumLinks(g, links, onLinkClick) {
  return g.append('g')
    .selectAll('path')
    .data(links)
    .join('path')
    .attr('class', 'link-quantum')
    .on('click', (event, d) => { event.stopPropagation(); onLinkClick(d); });
}

/**
 * Calcula el atributo "d" de un arco cuadrático entre dos puntos.
 * El punto de control se desplaza perpendicularmente a la línea
 * recta entre source y target, creando una curva suave.
 *
 * @param {{x,y}} source  - Nodo origen
 * @param {{x,y}} target  - Nodo destino
 * @param {number} offset - Distancia del punto de control a la línea recta
 */
function _arcPath(source, target, offset) {
  const dx = target.x - source.x;
  const dy = target.y - source.y;
  // Longitud de la línea recta entre los dos nodos
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  // Punto de control perpendicular a la mitad del segmento
  const mx  = (source.x + target.x) / 2 + (offset * -dy) / len;
  const my  = (source.y + target.y) / 2 + (offset *  dx) / len;
  // Comando SVG: M = mover al origen, Q = curva cuadrática con punto de control
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
  // Buscamos en ambos selectores: el enlace puede ser clásico o cuántico
  classicalSel.filter(l => l.id === id).classed('selected', true);
  quantumSel.filter(l => l.id === id).classed('selected', true);
}

function _clearSelection(classicalSel, quantumSel, nodeSel) {
  classicalSel.classed('selected', false);
  quantumSel.classed('selected', false);
  nodeSel.classed('selected', false);
}
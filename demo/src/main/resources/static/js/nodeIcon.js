/*
══════════════════════════════════════════════════════════════════
nodeIcon.js  →  resources/static/js/nodeIcon.js
══════════════════════════════════════════════════════════════════
Dibuja el icono SVG de cada nodo con formas geométricas y letras.

  CN (Classical Node) → círculo azul con la letra "C"
  QN (Quantum Node)   → cuadrado violeta con la letra "Q"
══════════════════════════════════════════════════════════════════
*/

const NODE_RADIUS = 32;


/**
 * Dibuja el icono de un nodo dentro de su grupo D3.
 *
 * @param {d3.Selection} g        - Grupo D3 del nodo (<g>)
 * @param {string}       nodeType - "CN" o "QN"
 */
export function drawNodeIcon(g, nodeType) {

  // Área de clic invisible más grande que el icono para facilitar la interacción
  g.append('circle')
    .attr('class', 'node-hitarea')
    .attr('r', NODE_RADIUS + 16);

  if (nodeType === 'CN') {
    _drawClassicalNode(g, NODE_RADIUS);
  } else if (nodeType === 'QN') {
    _drawQuantumNode(g, NODE_RADIUS);
  }
}


/**
 * CN → círculo azul con la letra "C"
 * @private
 */
function _drawClassicalNode(g, r) {
  // Anillo exterior punteado — visible al hacer hover o al seleccionar
  g.append('circle')
    .attr('class', 'node-ring')
    .attr('r', r + 8)
    .attr('stroke', '#2563eb');

  // Círculo principal
  g.append('circle')
    .attr('r', r)
    .attr('fill', '#eff6ff')
    .attr('stroke', '#2563eb')
    .attr('stroke-width', 2);

  // Letra "C" centrada
  g.append('text')
    .attr('dy', 4)
    .attr('text-anchor', 'middle')
    .style('font-size', '13px')
    .style('font-family', 'DM Mono, monospace')
    .style('font-weight', '500')
    .style('fill', '#2563eb')
    .style('pointer-events', 'none')
    .text('C');
}


/**
 * QN → cuadrado violeta con la letra "Q"
 * @private
 */
function _drawQuantumNode(g, r) {
  const side = r * 1.6;

  // Anillo exterior punteado cuadrado
  g.append('rect')
    .attr('class', 'node-ring')
    .attr('x', -(side / 2 + 8))
    .attr('y', -(side / 2 + 8))
    .attr('width', side + 16)
    .attr('height', side + 16)
    .attr('rx', 6)
    .attr('stroke', '#7c3aed');

  // Cuadrado principal
  g.append('rect')
    .attr('x', -side / 2)
    .attr('y', -side / 2)
    .attr('width', side)
    .attr('height', side)
    .attr('rx', 5)
    .attr('fill', '#f5f3ff')
    .attr('stroke', '#7c3aed')
    .attr('stroke-width', 2);

  // Letra "Q" centrada
  g.append('text')
    .attr('dy', 4)
    .attr('text-anchor', 'middle')
    .style('font-size', '13px')
    .style('font-family', 'DM Mono, monospace')
    .style('font-weight', '500')
    .style('fill', '#7c3aed')
    .style('pointer-events', 'none')
    .text('Q');
}
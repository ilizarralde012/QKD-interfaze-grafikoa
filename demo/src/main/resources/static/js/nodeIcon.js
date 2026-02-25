// ══════════════════════════════════════════════════════════════
// nodeIcon.js
// ──────────────────────────────────────────────────────────────
// Nodo bakoitzaren ikono bisuala marraztu SVG-n
// CN → zirkulua urdina + "C" letra
// QN → karratua morea + "Q" letra
// ══════════════════════════════════════════════════════════════

const NODE_RADIUS = 32;


/**
 * Nodo baten ikonoa marrazten du D3 multzo baten barruan.
 *
 * @param {d3.Selection} g        - D3 multzoa nodoarekin (<g>)
 * @param {string}       nodeType - "CN" edo "QN"
 */
export function drawNodeIcon(g, nodeType) {

  // ── HITAREA ──────────────────────────────────────────────────
  // Zirkulu ikusezin handi bat nodoaren gainean
  // Erabiltzaileak "airean" klik egin dezake eta nodoa hautatuko da
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
 * CN → borobil urdina eta "C" letra batekin
 * @private
 */
function _drawClassicalNode(g, r) {
  // Kanpoko eraztun punteatua — ikusgarria hover egitean edo hautatzean
  g.append('circle')
    .attr('class', 'node-ring')
    .attr('r', r + 8)
    .attr('stroke', '#2563eb');

  // Borobil nagusia
  g.append('circle')
    .attr('r', r)
    .attr('fill', '#eff6ff')
    .attr('stroke', '#2563eb')
    .attr('stroke-width', 2);

  // C letra erdian
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
 * QN → karratu morea eta "Q" letra batekin
 * @private
 */
function _drawQuantumNode(g, r) {
  const side = r * 1.6;

  // Kanpoko eraztun punteatu karratua — ikusgarria hover egitean edo hautatzean
  g.append('rect')
    .attr('class', 'node-ring')
    .attr('x', -(side / 2 + 8))
    .attr('y', -(side / 2 + 8))
    .attr('width', side + 16)
    .attr('height', side + 16)
    .attr('rx', 6)
    .attr('stroke', '#7c3aed');

  // Karratu nagusia
  g.append('rect')
    .attr('x', -side / 2)
    .attr('y', -side / 2)
    .attr('width', side)
    .attr('height', side)
    .attr('rx', 5)
    .attr('fill', '#f5f3ff')
    .attr('stroke', '#7c3aed')
    .attr('stroke-width', 2);

  // "Q" letra zentratua
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
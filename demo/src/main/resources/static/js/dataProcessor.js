/*
══════════════════════════════════════════════════════════════════
dataProcessor.js
──────────────────────────────────────────────────────────────────
Responsabilidad única: transformar el JSON crudo del framework
en la estructura que el resto de módulos necesita.

No toca el DOM, no dibuja nada. Solo recibe datos y devuelve
datos. Esto facilita testear esta lógica de forma aislada.

Exporta:
  processData(raw) → { visibleNodes, classicalLinks, quantumLinks, kmsBySite }
══════════════════════════════════════════════════════════════════
*/

/**
 * Transforma el JSON del framework en los datos listos para D3.
 *
 * @param {Object} raw - El JSON tal como viene del archivo
 * @returns {{
 *   visibleNodes:    Array,   - Solo nodos CN y QN (sin KMS)
 *   classicalLinks:  Array,   - Enlaces clásicos
 *   quantumLinks:    Array,   - Enlaces cuánticos (mapeados a Sites)
 *   kmsBySite:       Object   - KMS agrupados por site, para el panel
 * }}
 */
export function processData(raw) {

  // ── Nodos visibles ──────────────────────────────────────────
  // Los KMS existen en el JSON pero son nodos internos de los QN.
  // Solo dibujamos CN y QN. Copiamos con spread para no mutar el original.
  const visibleNodes = raw.nodes
    .filter(n => n.node_type === 'CN' || n.node_type === 'QN')
    .map(n => ({ ...n }));

  // ── Mapa KMS → Site padre ───────────────────────────────────
  // Los enlaces cuánticos apuntan a KMS (ej. "KMS_D"), pero como
  // los KMS no se dibujan, necesitamos redirigirlos al Site padre.
  // Ejemplo: { "KMS_D": "Site_D", "KMS_E1": "Site_E", ... }
  const kmsToSite = {};
  raw.nodes
    .filter(n => n.node_type === 'KMS')
    .forEach(kms => {
      kmsToSite[kms.id] = kms.site;
    });

  // ── KMS agrupados por site ──────────────────────────────────
  // Se usa en el panel de información para mostrar los KMS
  // internos cuando el usuario selecciona un nodo QN.
  // Ejemplo: { "Site_E": [KMS_E1, KMS_E2], "Site_D": [KMS_D], ... }
  const kmsBySite = {};
  raw.nodes
    .filter(n => n.node_type === 'KMS')
    .forEach(kms => {
      if (!kmsBySite[kms.site]) kmsBySite[kms.site] = [];
      kmsBySite[kms.site].push(kms);
    });

  // ── Enlaces clásicos ────────────────────────────────────────
  // Ya apuntan directamente a Sites, no hay que transformar nada.
  // Añadimos un id único y el tipo para distinguirlos de los cuánticos.
  const classicalLinks = (raw['classical-links'] || []).map((l, i) => ({
    id: `cl-${i}`,
    source: l.source,
    target: l.target,
    link_type: 'classical'
  }));

  // ── Enlaces cuánticos ───────────────────────────────────────
  // Apuntan a KMS → los sustituimos por el Site padre.
  // Guardamos los IDs originales de KMS para mostrarlos en el panel.
  const quantumLinks = (raw.links || [])
    .filter(l => l.quantum_link === true)
    .map((l, i) => ({
      id: `ql-${i}`,
      source: kmsToSite[l.source] || l.source,
      target: kmsToSite[l.target] || l.target,
      link_type: 'quantum',
      kms_source: l.source,
      kms_target: l.target
    }));

  return { visibleNodes, classicalLinks, quantumLinks, kmsBySite };
}
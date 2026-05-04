/*
══════════════════════════════════════════════════════════════════
dataProcessor.js
JSON fitxategiko datuak D3 graforako prestatzen ditu.
══════════════════════════════════════════════════════════════════
*/

/**
 * Datuak prozesatu eta D3rako formateatu
 *
 * @param {Object} raw - JSON fitxategiko datu gordinak
 * @returns {{
 *   visibleNodes:    Array,   - Bakarrik CN eta QN (KMS gabe)
 *   classicalLinks:  Array,   - Lotura klasikoak
 *   quantumLinks:    Array,   - Lotura kuantikoak (Siteetara mapeatuta)
 *   kmsBySite:       Object   - Site bakoitzeko KMSen zerrenda
 * }}
 */
export function processData(raw) {

  // ── Nodo ikusgarriak ──────────────────────────────────────────
  // KMSak QNen barruan doaz.
  // Bakarrik QN eta CN marrazten dira, spread operadorearekin kopiatuz (ez zuzenean) datuak mutatu ez daitezen.
  const visibleNodes = raw.nodes
    .filter(n => n.node_type === 'CN' || n.node_type === 'QN')
    .map(n => ({ ...n }));

  // ── KMS → Site QN ───────────────────────────────────
  // Lotura kuantikoak KMSetara apuntatzen dute, baina hauek ez direnez marrazten nodora bideratu behar dugu
  // Objektu bat sortzen dugu: { "KMS_D": "Site_D", "KMS_E1": "Site_E", ... }
  const kmsToSite = {};
  raw.nodes
    .filter(n => n.node_type === 'KMS')
    .forEach(kms => {
      kmsToSite[kms.id] = kms.site;
    });

  // ── KMSak nodoka bateratuta ──────────────────────────────────
  // Informazio panela erabiltzen da QN nodo bat aukeratzean, barruko KMSak erakusteko.
  // Objektu bat: { "Site_E": [KMS_E1, KMS_E2], "Site_D": [KMS_D], ... }
  const kmsBySite = {};
  raw.nodes
    .filter(n => n.node_type === 'KMS')
    .forEach(kms => {
      if (!kmsBySite[kms.site]) kmsBySite[kms.site] = [];
      kmsBySite[kms.site].push(kms);
    });

  // ── Lotura klasikoak ────────────────────────────────────────
  //Siteetara apuntazten dute jadanik, ez da aldatu behar. Id bat gehitu eta mota bat gehitzen dugu, kuantikoetatik bereizteko.
  const classicalLinks = (raw['classical-links'] || []).map((l, i) => ({
    id: `cl-${i}`,
    source: l.source,
    target: l.target,
    link_type: 'classical'
  }));

  // ── Lotura kuantikoak ───────────────────────────────────────
  //KMSetara apuntatzen dute --> Nodo gurasoa jarriko dugu. KMSen IDak gordeko ditugu panelerako.
  const quantumLinks = (raw.links || [])
    .filter(l => l.quantum_link === true)
    .map((l, i) => ({
      id: `ql-${i}`,
      source: kmsToSite[l.source] || l.source,
      target: kmsToSite[l.target] || l.target,
      link_type: 'quantum',
      kms_source: l.source,
      kms_target: l.target
    })).filter(l => l.source !== l.target); 

  return { visibleNodes, classicalLinks, quantumLinks, kmsBySite };
}
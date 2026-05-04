// ══════════════════════════════════════════════════════════════
// languageSelector.js - Hizkuntza hautatzailearen logika
// ══════════════════════════════════════════════════════════════

/**
 * Hizkuntza hautatzailea hasieratu
 * 
 * @param {string} page - Orrialde izena URL-rako ('', 'apps', 'requests')
 */
export function initLanguageSelector(page) {
  const langBtn = document.getElementById('lang-btn');
  const langDropdown = document.getElementById('lang-dropdown');
  const langCode = document.getElementById('lang-code');

  if (!langBtn || !langDropdown || !langCode) {
    console.warn('Language selector elements not found');
    return;
  }

  // Dropdown irekitzeko/ixteko
  langBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    langDropdown.classList.toggle('active');
  });

  // Hizkuntza bat aukeratzean
  document.querySelectorAll('.lang-option').forEach(option => {
    option.addEventListener('click', () => {
      const lang = option.dataset.lang;
      const basePath = page ? `/${page}` : '/';
      window.location.href = `${basePath}?lang=${lang}`;
    });
  });

  // Kanpoan klik egitean dropdown itxi
  document.addEventListener('click', () => {
    langDropdown.classList.remove('active');
  });

  // Dropdown-eko hautaketa markatu
  const activeLang = langCode.textContent.toLowerCase();
  document.querySelectorAll('.lang-option').forEach(opt => {
    opt.classList.toggle('selected', opt.dataset.lang === activeLang);
  });
}
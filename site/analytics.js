/* Çerezsiz ziyaretçi sayacı (GoatCounter). SITE.goatcounter boşsa dışarıya hiçbir istek gitmez.
   Olaylar: data-track niteliği olan öğelere tıklama + form gönderimi + bug avının tamamlanması. */
(function () {
  const code = (window.SITE && window.SITE.goatcounter) || '';
  const log = [];

  if (code) {
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://gc.zgo.at/count.js';
    s.dataset.goatcounter = 'https://' + code + '.goatcounter.com/count';
    document.head.append(s);
  }

  function track(name) {
    log.push(name);
    try {
      if (window.goatcounter && typeof window.goatcounter.count === 'function') {
        window.goatcounter.count({ path: 'event/' + name, title: name, event: true });
      }
    } catch (e) { /* sayaç hiçbir zaman siteyi bozmamalı */ }
  }

  document.addEventListener('click', (e) => {
    const el = e.target.closest && e.target.closest('[data-track]');
    if (el) track(el.dataset.track);
  }, true);

  document.addEventListener('submit', (e) => {
    if (e.target.id === 'contact-form') track('contact-submit');
  }, true);

  window.Analytics = { track, events: () => log.slice(), enabled: !!code };
})();

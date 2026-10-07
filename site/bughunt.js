/* Bug avı: sayfaya saklanmış 5 bug. Varsayılan olarak kapalı — ziyaretçi avı başlatınca ortaya çıkarlar. */
(function () {
  // Sayfadaki sıraya göre: #1 en üstte, #5 en altta
  const ORDER = ['align', 'typo', 'date', 'link', 'flip'];
  const KEY = { active: 'bh.active', found: 'bh.found', start: 'bh.start', done: 'bh.done' };

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* gizli pencere vb. */ } },
    del(k) { try { localStorage.removeItem(k); } catch (e) { /* yoksay */ } }
  };

  let t = () => ({});
  let lang = () => 'tr';
  let active = false;
  let found = new Set();
  let hintIndex = -1;

  function load() {
    active = store.get(KEY.active) === '1';
    try {
      const raw = JSON.parse(store.get(KEY.found) || '[]');
      found = new Set(raw.filter((id) => ORDER.includes(id)));
    } catch (e) { found = new Set(); }
  }

  function save() { store.set(KEY.found, JSON.stringify([...found])); }

  function fmt(str, vars) {
    return str.replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined ? vars[k] : ''));
  }

  function toast(text, ms) {
    const box = document.getElementById('toasts');
    if (!box) return;
    const el = document.createElement('p');
    el.className = 'toast';
    el.textContent = text;
    box.append(el);
    setTimeout(() => el.classList.add('out'), ms || 3200);
    setTimeout(() => el.remove(), (ms || 3200) + 400);
  }

  /* Av kapalıyken ya da bug bulunduysa öğe temiz haliyle görünür. */
  function apply() {
    document.querySelectorAll('[data-bug]').forEach((el) => {
      const showBug = active && !found.has(el.dataset.bug);
      el.classList.toggle('bugged', showBug);
      el.classList.toggle('fixed', !showBug);
      if (el.dataset.buggy !== undefined) {
        el.textContent = showBug ? el.dataset.buggy : el.dataset.fixed;
      }
      if (el.tagName === 'A') {
        if (showBug) { el.setAttribute('href', '#'); el.removeAttribute('aria-disabled'); }
        else { el.removeAttribute('href'); el.setAttribute('aria-disabled', 'true'); }
      }
    });
    renderPanel();
  }

  function renderPanel() {
    const s = t().bh;
    if (!s) return;
    const root = document.getElementById('bh');
    root.classList.toggle('active', active);
    root.classList.toggle('complete', active && found.size === ORDER.length);
    document.getElementById('bh-count').textContent = found.size + '/' + ORDER.length;
    const list = document.getElementById('bh-list');
    list.innerHTML = '';
    ORDER.forEach((id) => {
      const li = document.createElement('li');
      const ok = found.has(id);
      li.className = ok ? 'ok' : '';
      li.textContent = ok ? s.bugs[id].name : s.unknown;
      list.append(li);
    });
    const hint = document.getElementById('bh-hint');
    if (found.size === ORDER.length) hint.textContent = s.allFound;
    else if (hintIndex >= 0 && !found.has(ORDER[hintIndex])) hint.textContent = s.bugs[ORDER[hintIndex]].hint;
    else hint.textContent = '';
  }

  function duration() {
    const ms = Number(store.get(KEY.done)) || 0;
    const total = Math.max(1, Math.round(ms / 1000));
    const m = Math.floor(total / 60);
    const sec = total % 60;
    if (lang() === 'tr') return (m ? m + ' dk ' : '') + sec + ' sn';
    return (m ? m + 'm ' : '') + sec + 's';
  }

  function openDialog() {
    const s = t().bh;
    const site = window.SITE;
    const dialog = document.getElementById('bh-dialog');
    document.getElementById('bh-done-text').textContent = fmt(s.doneText, { time: duration() });
    document.getElementById('bh-share').href =
      'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(site.url);
    document.getElementById('bh-write').href =
      'mailto:' + site.email + '?subject=' + encodeURIComponent(s.mailSubject);
    if (typeof dialog.showModal === 'function' && !dialog.open) dialog.showModal();
  }

  function markFound(id, el) {
    found.add(id);
    save();
    if (found.size === ORDER.length && !store.get(KEY.done)) {
      store.set(KEY.done, String(Date.now() - Number(store.get(KEY.start) || Date.now())));
    }
    apply();
    el.classList.add('just-fixed');
    setTimeout(() => el.classList.remove('just-fixed'), 900);
    const s = t().bh;
    toast(fmt(s.found, { n: ORDER.indexOf(id) + 1, name: s.bugs[id].name, count: found.size }));
    if (found.size === ORDER.length) {
      if (window.Analytics) window.Analytics.track('bug-hunt-complete');
      setTimeout(openDialog, 700);
    }
  }

  function onClick(e) {
    if (!active) return;
    const el = e.target.closest('[data-bug]');
    if (!el) return;
    const id = el.dataset.bug;
    if (el.tagName === 'A') e.preventDefault();
    if (found.has(id)) return;
    e.preventDefault();
    e.stopPropagation();
    markFound(id, el);
  }

  function setPanel(open) {
    document.getElementById('bh-panel').hidden = !open;
    document.getElementById('bh-pill').setAttribute('aria-expanded', String(open));
  }

  function start() {
    if (active) { setPanel(true); return; }
    active = true;
    hintIndex = -1;
    found = new Set();
    store.set(KEY.active, '1');
    store.del(KEY.found);
    store.del(KEY.done);
    store.set(KEY.start, String(Date.now()));
    apply();
    setPanel(true);
    toast(t().bh.started, 4000);
  }

  function stop() {
    active = false;
    found = new Set();
    hintIndex = -1;
    [KEY.active, KEY.found, KEY.done, KEY.start].forEach(store.del);
    apply();
    setPanel(false);
  }

  function init(opts) {
    t = opts.t;
    lang = opts.lang;
    load();

    document.addEventListener('click', onClick, true);

    document.getElementById('bh-pill').addEventListener('click', () => {
      setPanel(document.getElementById('bh-panel').hidden);
    });
    document.getElementById('bh-start').addEventListener('click', start);
    document.getElementById('bh-reset').addEventListener('click', stop);
    document.getElementById('bh-hint-btn').addEventListener('click', () => {
      const next = ORDER.findIndex((id, i) => !found.has(id) && i > hintIndex);
      hintIndex = next >= 0 ? next : ORDER.findIndex((id) => !found.has(id));
      renderPanel();
    });

    const dialog = document.getElementById('bh-dialog');
    document.getElementById('bh-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
  }

  window.BugHunt = {
    init, apply, toast, start, stop,
    isActive: () => active,
    count: () => found.size,
    total: ORDER.length
  };
})();

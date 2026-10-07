(function () {
  const SITE = window.SITE;
  const I18N = window.I18N;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* yoksay */ } }
  };

  let lang = initialLang();
  let status = null;
  const T = () => I18N[lang];

  function initialLang() {
    const q = new URLSearchParams(location.search).get('lang');
    if (q === 'tr' || q === 'en') return q;
    const saved = store.get('lang');
    if (saved === 'tr' || saved === 'en') return saved;
    return (navigator.language || '').toLowerCase().startsWith('tr') ? 'tr' : 'en';
  }

  function get(path) {
    return path.split('.').reduce((o, k) => (o ? o[k] : undefined), T());
  }

  function fmt(str, vars) {
    return str.replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined ? vars[k] : ''));
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  /* ---------- Statik metinler ---------- */
  function renderStatic() {
    const t = T();
    document.documentElement.lang = lang;
    document.title = t.meta.title;
    document.querySelector('meta[name="description"]').setAttribute('content', t.meta.description);

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const v = get(el.dataset.i18n);
      if (typeof v === 'string') el.textContent = v;
    });
    document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
      el.dataset.i18nAttr.split(',').forEach((pair) => {
        const [attr, key] = pair.split(':');
        el.setAttribute(attr, get(key));
      });
    });

    const toggle = document.getElementById('lang-toggle');
    toggle.textContent = lang === 'tr' ? 'EN' : 'TR';
    toggle.setAttribute('aria-label', t.langSwitch);
    toggle.setAttribute('lang', lang === 'tr' ? 'en' : 'tr');

    const title = document.getElementById('experience-title');
    title.dataset.buggy = t.experience.titleBug;
    title.dataset.fixed = t.experience.title;
  }

  function renderStats() {
    document.getElementById('stats').innerHTML = T().stats.map((s, i) =>
      `<li class="stat"${i === 1 ? ' data-bug="align"' : ''}><strong>${esc(s.value)}</strong><span>${esc(s.label)}</span></li>`
    ).join('');
  }

  function renderLooking() {
    const h = T().hero;
    const row = (label, items) => `
      <div class="looking-row">
        <dt class="mono">${esc(label)}</dt>
        <dd><ul class="looking-tags">${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul></dd>
      </div>`;
    document.getElementById('looking').innerHTML = `
      <p class="open-badge"><span class="open-dot" aria-hidden="true"></span>${esc(h.open)}</p>
      <dl class="looking-list">${row(h.rolesLabel, h.roles)}${row(h.workLabel, h.work)}</dl>`;
  }

  function renderMarquee() {
    const items = [...new Set(T().skills.groups.flatMap((g) => g.items))];
    const row = items.map((s) => `<span class="mq-item"><span class="mq-tick">✓</span>${esc(s)}</span>`).join('');
    document.getElementById('marquee').innerHTML = row + row;
  }

  function renderApproach() {
    document.getElementById('approach-grid').innerHTML = T().approach.items.map((a) => `
      <article class="card approach-card reveal">
        <span class="approach-icon" aria-hidden="true">${esc(a.icon)}</span>
        <h3>${esc(a.title)}</h3>
        <p>${esc(a.text)}</p>
      </article>`).join('');
  }

  function renderExperience() {
    const e = T().experience;
    const total = e.jobs.reduce((n, j) => n + j.cases.length, 0);
    const suites = e.jobs.map((j) => {
      const year = j.bugDate
        ? `<span data-bug="date" data-buggy="${esc(j.from[1].replace('0', 'O'))}" data-fixed="${esc(j.from[1])}">${esc(j.from[1])}</span>`
        : esc(j.from[1]);
      return `
      <article class="suite reveal">
        <header class="suite-head">
          <div>
            <h3>${esc(j.role)}</h3>
            <p class="suite-company">${esc(j.company)} <span class="muted">· ${esc(j.place)}</span></p>
          </div>
          <p class="suite-period mono">${esc(j.from[0])} ${year} – ${esc(j.to)}</p>
        </header>
        <ul class="cases">
          ${j.cases.map((c) => `<li><span class="tick mono" aria-hidden="true">✓</span><span>${esc(c)}</span></li>`).join('')}
        </ul>
      </article>`;
    }).join('');
    document.getElementById('run').innerHTML = `
      <div class="run-head mono">
        <span>${esc(e.command)}</span>
        <span class="run-summary">✓ ${esc(fmt(e.summary, { s: e.jobs.length, t: total }))}</span>
      </div>
      ${suites}`;
  }

  function renderProjects() {
    const p = T().projects;
    document.getElementById('project-grid').innerHTML = p.items.map((it) => {
      let result = it.result;
      if (result.includes('{passed}')) {
        result = status && status.total ? fmt(result, { passed: status.passed }) : it.resultFallback;
      }
      let link = '';
      if (it.bugLink) {
        link = `<a class="project-link" data-bug="link" href="#" data-buggy="${esc(it.bugLink.buggy)}" data-fixed="${esc(it.bugLink.fixed)}">${esc(it.bugLink.buggy)}</a>`;
      } else if (it.repo && SITE.repo) {
        link = `<a class="project-link" href="${esc(SITE.repo)}" target="_blank" rel="noopener">${esc(it.repoLabel)}</a>`;
      }
      return `
      <article class="card project reveal">
        <p class="project-meta mono">${esc(it.meta)}</p>
        <h3>${esc(it.title)}</h3>
        <dl class="project-body">
          <div><dt>${esc(p.labels.problem)}</dt><dd>${esc(it.problem)}</dd></div>
          <div><dt>${esc(p.labels.solution)}</dt><dd>${esc(it.solution)}</dd></div>
        </dl>
        <p class="project-result"><span class="mono">${esc(p.labels.result)}</span><strong>${esc(result)}</strong></p>
        <ul class="tags">${it.tags.map((tg) => `<li>${esc(tg)}</li>`).join('')}</ul>
        ${link}
      </article>`;
    }).join('');
  }

  function renderSkills() {
    document.getElementById('skill-grid').innerHTML = T().skills.groups.map((g) => `
      <div class="card skill-group reveal">
        <h3 class="mono">${esc(g.title)}</h3>
        <ul class="chips">
          ${g.items.map((s) => s.startsWith('Cucumber')
            ? `<li class="chip"><span class="chip-icon" data-bug="flip" aria-hidden="true">🥒</span>${esc(s)}</li>`
            : `<li class="chip">${esc(s)}</li>`).join('')}
        </ul>
      </div>`).join('');
  }

  function renderCerts() {
    const c = T().certs;
    document.getElementById('cert-list').innerHTML = c.items.map((it) => `
      <li class="cert reveal">
        <span class="pass mono">PASS</span>
        <span class="cert-name">${esc(it.name)}<span class="cert-org">${esc(it.org)}</span>${it.proof ? `<a class="cert-proof" href="${esc(it.proof)}" target="_blank" rel="noopener" data-track="cert-${esc(it.track || it.proof.split('/').pop().split('.')[0])}">${esc(c.proof)}</a>` : ''}</span>
        <span class="cert-year mono">${esc(it.year)}</span>
      </li>`).join('');
    const block = (title, rows) => `
      <div class="card edu-card reveal">
        <h3 class="mono">${esc(title)}</h3>
        <ul>${rows.map((r) => `<li><strong>${esc(r.name)}</strong><span>${esc(r.org)}</span></li>`).join('')}</ul>
      </div>`;
    document.getElementById('edu').innerHTML = block(c.eduTitle, c.edu) + block(c.langTitle, c.langs);
  }

  function renderContact() {
    const l = T().contact.links;
    const rows = [
      { label: l.email, value: SITE.email, href: 'mailto:' + SITE.email, icon: '@', track: 'contact-email' },
      { label: l.linkedin, value: 'in/yamangokhan', href: SITE.linkedin, icon: 'in', ext: true, track: 'contact-linkedin' },
      { label: l.github, value: 'yamangokhan', href: SITE.github, icon: '{}', ext: true, track: 'contact-github' },
      { label: l.cv, value: 'Gokhan_Yaman_CV.pdf', href: SITE.cv, icon: '↓', download: true, track: 'cv-download' }
    ];
    document.getElementById('contact-links').innerHTML = rows.map((r) => `
      <li>
        <a class="contact-link" href="${esc(r.href)}" data-track="${r.track}"${r.ext ? ' target="_blank" rel="noopener"' : ''}${r.download ? ' download' : ''}>
          <span class="contact-icon mono" aria-hidden="true">${esc(r.icon)}</span>
          <span><span class="contact-label">${esc(r.label)}</span><span class="contact-value">${esc(r.value)}</span></span>
        </a>
      </li>`).join('');
  }

  /* ---------- Test durumu rozeti ---------- */
  function relTime(iso) {
    const diff = (new Date(iso).getTime() - Date.now()) / 1000;
    const rtf = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' });
    const units = [['day', 86400], ['hour', 3600], ['minute', 60]];
    for (const [unit, sec] of units) {
      if (Math.abs(diff) >= sec) return rtf.format(Math.round(diff / sec), unit);
    }
    return rtf.format(0, 'minute');
  }

  function renderStatus() {
    const s = T().status;
    const badge = document.getElementById('status-badge');
    const text = badge.querySelector('.status-text');
    const time = badge.querySelector('.status-time');
    const footer = document.getElementById('footer-tested');

    if (status === null) {
      badge.dataset.state = 'loading';
      text.textContent = s.loading;
      time.textContent = '';
    } else if (!status || !status.total) {
      badge.dataset.state = 'none';
      text.textContent = s.none;
      time.textContent = '';
    } else {
      badge.dataset.state = status.failed > 0 ? 'fail' : 'pass';
      text.textContent = status.failed > 0 ? fmt(s.fail, status) : fmt(s.pass, status);
      time.textContent = status.finishedAt ? '· ' + fmt(s.ago, { time: relTime(status.finishedAt) }) : '';
    }

    const link = status && (status.reportUrl || status.runUrl);
    if (link) {
      badge.href = link;
      badge.title = s.title;
    } else {
      badge.removeAttribute('href');
      badge.removeAttribute('title');
    }

    const f = T().footer;
    footer.textContent = status && status.total ? fmt(f.tested, { n: status.total }) : f.testedFallback;
  }

  function loadStatus() {
    fetch('test-status.json', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : false))
      .catch(() => false)
      .then((data) => {
        status = data;
        renderStatus();
        renderProjects();
        window.BugHunt.apply();
        observeReveal();
      });
  }

  /* ---------- Gherkin terminali ---------- */
  let gherkinRun = 0;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  async function runGherkin() {
    const run = ++gherkinRun;
    const code = document.getElementById('gherkin');
    const g = T().gherkin;
    const animate = !reduceMotion;
    code.innerHTML = '';
    code.dataset.done = 'false';
    document.getElementById('terminal-title').textContent = lang === 'tr' ? 'isveren.feature' : 'recruiter.feature';

    let steps = 0;
    for (const line of g.lines) {
      if (run !== gherkinRun) return;
      const row = document.createElement('span');
      row.className = 'g-line g-' + line.type;
      if (line.type === 'step') row.classList.add('g-indent-2');
      if (line.type === 'scenario') row.classList.add('g-indent-1');
      const kw = document.createElement('span');
      kw.className = 'g-kw';
      kw.textContent = line.kw || '';
      const txt = document.createElement('span');
      txt.className = 'g-text';
      row.append(kw, txt);
      code.append(row);

      if (animate) {
        for (const ch of line.text) {
          if (run !== gherkinRun) return;
          txt.textContent += ch;
          await sleep(16);
        }
      } else {
        txt.textContent = line.text;
      }

      if (line.type === 'step') {
        steps++;
        const mark = document.createElement('span');
        mark.className = 'g-mark';
        mark.setAttribute('aria-hidden', 'true');
        row.append(mark);
        if (animate) {
          row.classList.add('running');
          mark.textContent = ' …';
          await sleep(260);
          if (run !== gherkinRun) return;
          row.classList.remove('running');
        }
        row.classList.add('passed');
        mark.textContent = ' ✓';
      }
    }
    const sum = document.createElement('span');
    sum.className = 'g-line g-summary';
    sum.textContent = fmt(g.summary, { n: steps });
    code.append(document.createElement('br'), sum);
    code.dataset.done = 'true';
  }

  /* ---------- Etkileşimler ---------- */
  let revealObserver;
  function observeReveal() {
    const els = document.querySelectorAll('.reveal:not(.visible)');
    if (reduceMotion || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('visible'));
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('visible');
            revealObserver.unobserve(en.target);
          }
        });
      }, { rootMargin: '0px 0px -40px 0px' });
    }
    els.forEach((el) => revealObserver.observe(el));
  }

  function setupNav() {
    const menu = document.getElementById('menu-toggle');
    const links = document.getElementById('nav-links');
    const close = () => { links.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); };
    menu.addEventListener('click', () => {
      const open = !links.classList.contains('open');
      links.classList.toggle('open', open);
      menu.setAttribute('aria-expanded', String(open));
    });
    links.addEventListener('click', (e) => { if (e.target.closest('a')) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

    const header = document.querySelector('.site-header');
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if ('IntersectionObserver' in window) {
      const map = new Map([...links.querySelectorAll('a')].map((a) => [a.getAttribute('href').slice(1), a]));
      const spy = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          const a = map.get(en.target.id);
          if (a && en.isIntersecting) {
            map.forEach((x) => x.removeAttribute('aria-current'));
            a.setAttribute('aria-current', 'true');
          }
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      document.querySelectorAll('main section[id]').forEach((s) => spy.observe(s));
    }

    document.getElementById('lang-toggle').addEventListener('click', () => setLang(lang === 'tr' ? 'en' : 'tr'));
  }

  function setLang(next) {
    if (next === lang) return;
    lang = next;
    store.set('lang', lang);
    const url = new URL(location.href);
    if (url.searchParams.has('lang')) {
      url.searchParams.set('lang', lang);
      history.replaceState(null, '', url);
    }
    renderAll();
  }

  function renderAll() {
    renderStatic();
    renderLooking();
    renderStats();
    renderMarquee();
    renderApproach();
    renderExperience();
    renderProjects();
    renderSkills();
    renderCerts();
    renderContact();
    renderStatus();
    window.BugHunt.apply();
    observeReveal();
    runGherkin();
  }

  function consoleHello() {
    console.log(
      '%c🐞 Merhaba geliştirici! / Hi developer!%c\n' +
      'Bu sitede 5 bug saklı — DevTools yetmez, gözünü kullan. / 5 bugs are hidden here — DevTools won’t help, use your eyes.\n' +
      SITE.email,
      'font: 600 14px sans-serif; color: #3fb950', 'color: inherit'
    );
  }

  window.App = { T, lang: () => lang, setLang, status: () => status, relTime, fmt };

  document.getElementById('year').textContent = new Date().getFullYear();
  const source = document.getElementById('footer-source');
  if (SITE.repo) {
    source.href = SITE.repo;
    source.target = '_blank';
    source.rel = 'noopener';
  } else {
    source.closest('p').remove();
  }
  window.BugHunt.init({ t: T, lang: () => lang });
  setupNav();
  renderAll();
  loadStatus();
  consoleHello();
})();

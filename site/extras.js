/* Laboratuvar: terminal, locator modu, "siteyi kır", coverage ölçer ve imleç efektleri. */
(function () {
  const App = window.App;
  const SITE = window.SITE;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const speed = reduceMotion ? 0.12 : 1;
  const T = () => App.T();
  const L = () => App.T().lab;
  const fmt = App.fmt;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms * speed));
  const toast = (msg, ms) => window.BugHunt.toast(msg, ms);

  /* ---------- İmleç ışığı ve kart spotlight ---------- */
  function setupSpotlight() {
    if (!finePointer || reduceMotion) return;
    const root = document.documentElement;
    let frame = 0;
    let last;
    document.addEventListener('pointermove', (e) => {
      last = e;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        root.style.setProperty('--mx', last.clientX + 'px');
        root.style.setProperty('--my', last.clientY + 'px');
        const card = last.target.closest && last.target.closest('.card, .suite, .contact-link, .lab-btn');
        if (card) {
          const r = card.getBoundingClientRect();
          card.style.setProperty('--x', (last.clientX - r.left) + 'px');
          card.style.setProperty('--y', (last.clientY - r.top) + 'px');
        }
      });
    }, { passive: true });
    document.body.classList.add('has-glow');
  }

  /* ---------- Coverage ölçer ---------- */
  function setupCoverage() {
    const sections = [...document.querySelectorAll('main section[id]')];
    const seen = new Set();
    const meter = document.getElementById('cov');
    const fill = document.getElementById('cov-fill');
    const text = document.getElementById('cov-text');
    let celebrated = false;

    const update = () => {
      const pct = Math.round((seen.size / sections.length) * 100);
      fill.style.width = pct + '%';
      text.textContent = 'cov ' + pct + '%';
      meter.setAttribute('aria-valuenow', String(pct));
      meter.dataset.pct = String(pct);
      meter.classList.toggle('full', pct === 100);
      if (pct === 100 && !celebrated) {
        celebrated = true;
        toast(L().coverageDone, 4500);
      }
    };

    if (!('IntersectionObserver' in window)) {
      sections.forEach((s) => seen.add(s.id));
      update();
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting && !seen.has(en.target.id)) {
          seen.add(en.target.id);
          io.unobserve(en.target);
          update();
        }
      });
    }, { rootMargin: '-25% 0px -25% 0px' });
    sections.forEach((s) => io.observe(s));

    // Sayfanın en altına gelindiyse son bölüm orta banda hiç girmeyebilir
    window.addEventListener('scroll', () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        const last = sections[sections.length - 1];
        if (!seen.has(last.id)) { seen.add(last.id); update(); }
      }
    }, { passive: true });
    update();
  }

  /* ---------- Siteyi kır: kaos + self-healing ---------- */
  let chaosRunning = false;
  const rand = (min, max) => min + Math.random() * (max - min);

  async function chaos() {
    if (chaosRunning) return;
    chaosRunning = true;
    const l = L().ci;
    const ci = document.getElementById('ci');
    const title = document.getElementById('ci-title');
    const lines = document.getElementById('ci-lines');
    const groups = [
      '.stat, .avatar, .status-badge, .hero-cta .btn',
      '.section-head h2, .hero h1',
      '.card, .suite, .cert, .terminal',
      '.chip, .tags li, .mq-item',
      '.lab-btn, .contact-link, .btn',
      '.section-sub, .hero-summary, .hero-role'
    ].map((sel) => [...document.querySelectorAll(sel)].filter(near));

    ci.hidden = false;
    ci.dataset.state = 'running';
    title.textContent = l.running;
    lines.innerHTML = '';
    document.body.classList.add('chaos');

    const used = new Set();
    for (let i = 0; i < groups.length; i++) {
      groups[i] = groups[i].filter((el) => !used.has(el) && used.add(el));
      groups[i].forEach((el) => {
        el.style.transition = 'transform .8s cubic-bezier(.3,1.5,.5,1), filter .5s';
        el.style.transform = `translate(${rand(-60, 60)}px, ${rand(-20, 140)}px) rotate(${rand(-28, 28)}deg)`;
        if (i === 1 || i === 5) el.classList.add('glitch');
      });
      const li = document.createElement('li');
      li.className = 'fail';
      li.innerHTML = '<span class="ci-mark">✗</span> ';
      li.append(document.createTextNode(l.checks[i]));
      lines.append(li);
      await sleep(140);
    }
    title.textContent = fmt(l.failed, { n: groups.length });
    ci.dataset.state = 'failed';
    await sleep(1400);

    title.textContent = l.healing;
    ci.dataset.state = 'healing';
    for (let i = 0; i < groups.length; i++) {
      await sleep(420);
      groups[i].forEach((el) => { el.style.transform = ''; el.classList.remove('glitch'); });
      const li = lines.children[i];
      li.className = 'pass';
      li.querySelector('.ci-mark').textContent = '✓';
    }
    document.body.classList.remove('chaos');
    await sleep(800);
    used.forEach((el) => { el.style.transition = ''; });
    title.textContent = fmt(l.done, { n: groups.length });
    ci.dataset.state = 'passed';
    chaosRunning = false;
    setTimeout(() => { if (!chaosRunning) ci.hidden = true; }, 3500 * speed + 600);
  }

  function near(el) {
    const r = el.getBoundingClientRect();
    return r.bottom > -300 && r.top < window.innerHeight + 300 && r.width > 0;
  }

  /* ---------- Locator modu ---------- */
  const ROLE = { A: 'link', BUTTON: 'button', H1: 'heading', H2: 'heading', H3: 'heading', IMG: 'img', INPUT: 'textbox', TEXTAREA: 'textbox' };
  let inspecting = false;
  const box = document.getElementById('inspect-box');
  const label = document.getElementById('inspect-label');

  const quote = (s) => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");

  function accName(el) {
    const aria = el.getAttribute('aria-label');
    if (aria) return aria.trim();
    if (el.tagName === 'IMG') return el.getAttribute('alt') || '';
    const clone = el.cloneNode(true);
    clone.querySelectorAll('[aria-hidden="true"]').forEach((n) => n.remove());
    return clone.textContent.replace(/\s+/g, ' ').trim();
  }

  function target(el) {
    let n = el;
    for (let i = 0; n && n !== document.body && i < 5; i++, n = n.parentElement) {
      if (ROLE[n.tagName]) return n;
    }
    return el;
  }

  function locatorFor(el) {
    const role = ROLE[el.tagName];
    if (role === 'textbox') {
      const lbl = el.closest('label');
      const name = lbl ? lbl.querySelector('span').textContent.trim() : el.name;
      return `page.getByLabel('${quote(name)}')`;
    }
    if (role) {
      let name = accName(el);
      if (name.length > 40) name = name.slice(0, 40).trim();
      return name ? `page.getByRole('${role}', { name: '${quote(name)}' })` : `page.getByRole('${role}')`;
    }
    const text = el.textContent.replace(/\s+/g, ' ').trim();
    if (text && text.length <= 50 && el.children.length === 0) return `page.getByText('${quote(text)}')`;
    if (el.id) return `page.locator('#${el.id}')`;
    const scope = el.closest('[id]');
    const cls = el.classList[0] ? '.' + el.classList[0] : '';
    return `page.locator('${scope && scope !== el ? '#' + scope.id + ' ' : ''}${el.tagName.toLowerCase()}${cls}')`;
  }

  function highlight(el) {
    const t = target(el);
    const r = t.getBoundingClientRect();
    const loc = locatorFor(t);
    Object.assign(box.style, { top: r.top + 'px', left: r.left + 'px', width: r.width + 'px', height: r.height + 'px' });
    label.textContent = '';
    const code = document.createElement('span');
    code.textContent = loc;
    const size = document.createElement('span');
    size.className = 'inspect-size';
    size.textContent = `${t.tagName.toLowerCase()} · ${Math.round(r.width)}×${Math.round(r.height)}`;
    label.append(code, size);
    const lw = Math.min(label.offsetWidth, window.innerWidth - 16);
    const top = r.top > 64 ? r.top - label.offsetHeight - 8 : r.bottom + 8;
    label.style.top = Math.max(8, Math.min(top, window.innerHeight - label.offsetHeight - 8)) + 'px';
    label.style.left = Math.max(8, Math.min(r.left, window.innerWidth - lw - 8)) + 'px';
    return loc;
  }

  function setInspect(on) {
    inspecting = on;
    document.body.classList.toggle('inspecting', on);
    box.hidden = label.hidden = true;
    document.querySelector('[data-lab="inspect"]').setAttribute('aria-pressed', String(on));
    toast(on ? L().inspectOn : L().inspectOff, on ? 5000 : 1800);
  }

  function ignored(el) {
    return !el || el.closest('[data-lab], #toasts, #bh, .site-header .nav-actions, dialog');
  }

  function setupInspect() {
    window.addEventListener('pointermove', (e) => {
      if (!inspecting) return;
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (ignored(el)) { box.hidden = label.hidden = true; return; }
      box.hidden = label.hidden = false;
      highlight(el);
    }, { passive: true });

    window.addEventListener('click', (e) => {
      if (!inspecting || ignored(e.target)) return;
      e.preventDefault();
      e.stopPropagation();
      box.hidden = label.hidden = false;
      const loc = highlight(e.target);
      if (navigator.clipboard) navigator.clipboard.writeText(loc).catch(() => {});
      toast(fmt(L().copied, { loc }), 3500);
    }, true);

    window.addEventListener('scroll', () => { if (inspecting) box.hidden = label.hidden = true; }, { passive: true });
  }

  /* ---------- Terminal ---------- */
  const term = document.getElementById('term');
  const out = document.getElementById('term-out');
  const input = document.getElementById('term-input');
  const history = [];
  let hIndex = 0;
  let busy = false;

  const BANNER = [
    '  ██████╗ ██╗   ██╗',
    ' ██╔════╝ ╚██╗ ██╔╝',
    ' ██║  ███╗ ╚████╔╝ ',
    ' ██║   ██║  ╚██╔╝  ',
    ' ╚██████╔╝   ██║   ',
    '  ╚═════╝    ╚═╝   '
  ];

  function print(text, cls) {
    const line = document.createElement('div');
    line.className = 'tl' + (cls ? ' ' + cls : '');
    const parts = String(text).split(/(https?:\/\/[^\s]+|[\w.+-]+@[\w-]+\.[\w.]+)/g);
    parts.forEach((p, i) => {
      if (i % 2) {
        const a = document.createElement('a');
        a.href = p.includes('@') && !p.startsWith('http') ? 'mailto:' + p : p;
        if (p.startsWith('http')) { a.target = '_blank'; a.rel = 'noopener'; }
        a.textContent = p;
        line.append(a);
      } else if (p) {
        line.append(document.createTextNode(p));
      }
    });
    out.append(line);
    out.scrollTop = out.scrollHeight;
    return line;
  }

  const files = () => ['about.txt', 'experience.log', 'projects.md', 'skills.json', 'contact.md', 'cv.pdf'];

  function whoami() {
    const t = T();
    print('Gökhan Yaman', 'tl-strong');
    print(t.hero.role, 'tl-green');
    print(t.hero.summary);
    print('');
    print('● ' + t.hero.open, 'tl-green');
    print(`  ${t.hero.rolesLabel}: ${t.hero.roles.join(' · ')}`);
    print(`  ${t.hero.workLabel}: ${t.hero.work.join(' · ')}`);
  }

  function experience() {
    T().experience.jobs.forEach((j) => {
      print(`✓ ${j.role} @ ${j.company}`, 'tl-green');
      print(`  ${j.from.join(' ')} – ${j.to} · ${j.place}`, 'tl-dim');
    });
  }

  function projects() {
    T().projects.items.forEach((p) => {
      let result = p.result;
      if (result.includes('{passed}')) {
        const st = App.status();
        result = st && st.total ? fmt(result, { passed: st.passed }) : p.resultFallback;
      }
      print(`▸ ${p.title}`, 'tl-strong');
      print(`  ${result}`, 'tl-green');
    });
  }

  function skills() {
    const obj = {};
    T().skills.groups.forEach((g) => { obj[g.title] = g.items; });
    JSON.stringify(obj, null, 2).split('\n').forEach((ln) => print(ln, 'tl-json'));
  }

  function contact() {
    print(SITE.email);
    print(SITE.linkedin);
    print(SITE.github);
  }

  function downloadCv() {
    const a = document.createElement('a');
    a.href = SITE.cv;
    a.download = '';
    document.body.append(a);
    a.click();
    a.remove();
    print(L().term.cvDone, 'tl-green');
  }

  async function npmTest() {
    const st = App.status();
    const lt = L().term;
    print('> gokhan-portfolio@1.0.0 test', 'tl-dim');
    print('> playwright test', 'tl-dim');
    if (!st || !st.total || !Array.isArray(st.tests)) { print(lt.noTests, 'tl-warn'); return; }
    print('');
    for (const tc of st.tests) {
      const ok = tc.s !== 'unexpected';
      print(`  ${ok ? '✓' : '✗'} [${tc.p}] ${tc.t} (${(tc.d / 1000).toFixed(1)}s)`, ok ? 'tl-green' : 'tl-red');
      await sleep(14);
    }
    print('');
    print(fmt(lt.testsSummary, {
      passed: st.passed,
      failed: st.failed,
      time: (st.durationMs / 1000).toFixed(1),
      ago: st.finishedAt ? App.relTime(st.finishedAt) : '—'
    }), st.failed ? 'tl-red' : 'tl-green');
  }

  function cat(file) {
    const lt = L().term;
    const map = { 'about.txt': whoami, 'experience.log': experience, 'projects.md': projects, 'skills.json': skills, 'contact.md': contact };
    if (!file) return print('cat: <file>', 'tl-warn');
    if (file === 'cv.pdf') return print(lt.binary, 'tl-warn');
    if (map[file]) return map[file]();
    print(fmt(lt.noFile, { f: file }), 'tl-red');
  }

  async function sudo(args) {
    if (args.join(' ') !== 'hire-gokhan') { print('sudo: ' + (args.join(' ') || '?') + ' 🤨', 'tl-warn'); return; }
    const s = L().term.sudo;
    for (const ln of s) { print(ln, ln.includes('✓') ? 'tl-green' : ''); await sleep(450); }
    location.href = 'mailto:' + SITE.email + '?subject=' + encodeURIComponent(L().term.sudoSubject);
  }

  const COMMANDS = {
    help() { L().term.help.forEach(([c, d]) => print(`  ${c.padEnd(18)} ${d}`)); },
    whoami,
    ls() { print(files().join('   '), 'tl-blue'); },
    cat: (a) => cat(a[0]),
    experience,
    projects,
    skills,
    contact,
    cv: downloadCv,
    npm: (a) => (a[0] === 'test' || a[0] === 't' ? npmTest() : print('npm: try `npm test`', 'tl-warn')),
    bugs(a) {
      const bh = window.BugHunt;
      if (a[0] === 'start') { closeTerm(); bh.start(); return; }
      print(bh.isActive() ? fmt(L().term.bugs, { n: bh.count() }) : L().term.bugsIdle);
    },
    lang(a) {
      if (a[0] !== 'tr' && a[0] !== 'en') { print('lang tr | lang en', 'tl-warn'); return; }
      App.setLang(a[0]);
      print(L().term.langDone, 'tl-green');
    },
    chaos() { closeTerm(); setTimeout(chaos, 250); },
    inspect() { closeTerm(); setInspect(true); },
    sudo,
    clear() { out.innerHTML = ''; },
    exit() { closeTerm(); },
    pwd() { print('/home/gokhan/portfolio'); },
    date() { print(new Date().toString()); },
    echo: (a) => print(a.join(' '))
  };

  async function run(raw) {
    const [cmd, ...args] = raw.split(/\s+/);
    const fn = COMMANDS[cmd.toLowerCase()];
    if (!fn) { print(fmt(L().term.notFound, { cmd }), 'tl-red'); return; }
    busy = true;
    try { await fn(args); } finally { busy = false; }
  }

  function openTerm() {
    if (term.open) return;
    if (inspecting) setInspect(false);
    term.showModal();
    if (!out.childElementCount) {
      BANNER.forEach((b) => print(b, 'tl-green tl-banner'));
      print('');
      print(L().term.welcome, 'tl-dim');
      print('');
    }
    input.focus();
  }

  function closeTerm() { if (term.open) term.close(); }

  function setupTerminal() {
    document.getElementById('term-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      if (busy) return;
      const v = input.value.trim();
      input.value = '';
      print('❯ ' + v, 'tl-cmd');
      if (!v) return;
      history.push(v);
      hIndex = history.length;
      await run(v);
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowUp' && history.length) {
        e.preventDefault();
        hIndex = Math.max(0, hIndex - 1);
        input.value = history[hIndex];
      } else if (e.key === 'ArrowDown' && history.length) {
        e.preventDefault();
        hIndex = Math.min(history.length, hIndex + 1);
        input.value = history[hIndex] || '';
      } else if (e.key === 'Tab') {
        e.preventDefault();
        const v = input.value;
        const words = [...Object.keys(COMMANDS), 'npm test', 'sudo hire-gokhan', 'bugs start', 'lang en', 'lang tr', ...files().map((f) => 'cat ' + f)];
        const hit = words.find((w) => w.startsWith(v) && w !== v);
        if (hit) input.value = hit;
      } else if (e.key === 'l' && e.ctrlKey) {
        e.preventDefault();
        out.innerHTML = '';
      }
    });

    document.getElementById('term-close').addEventListener('click', closeTerm);
    term.addEventListener('click', (e) => { if (e.target === term) closeTerm(); });
    out.addEventListener('click', () => { if (!window.getSelection().toString()) input.focus(); });

    document.addEventListener('keydown', (e) => {
      const typing = e.target.closest && e.target.closest('input, textarea');
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        term.open ? closeTerm() : openTerm();
      } else if (e.key === '`' && !typing) {
        e.preventDefault();
        openTerm();
      } else if (e.key === 'Escape' && inspecting) {
        setInspect(false);
      }
    });
  }

  /* ---------- Laboratuvar butonları ---------- */
  function setupLab() {
    document.querySelectorAll('[data-lab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const what = btn.dataset.lab;
        if (what === 'terminal') openTerm();
        else if (what === 'inspect') setInspect(!inspecting);
        else if (what === 'chaos') chaos();
        else if (what === 'hunt') window.BugHunt.start();
      });
    });
  }

  setupSpotlight();
  setupCoverage();
  setupInspect();
  setupTerminal();
  setupLab();

  window.Lab = { chaos, setInspect, openTerm, locatorFor };
})();

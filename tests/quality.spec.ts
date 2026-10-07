import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './fixtures';
import type { Lang } from './pages/PortfolioPage';

test.describe('Quality gates', () => {
  for (const lang of ['tr', 'en'] satisfies Lang[]) {
    test(`no WCAG 2.1 AA accessibility violations (${lang})`, async ({ page, portfolio }) => {
      await portfolio.openIn(lang);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      const summary = results.violations.map(
        (v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`
      );
      expect(summary).toEqual([]);
    });
  }

  test('skip link is the first focusable element and jumps to content', async ({ page, portfolio, isMobile }) => {
    test.skip(isMobile, 'keyboard navigation is a desktop concern');
    await portfolio.open();
    await page.keyboard.press('Tab');
    await expect(portfolio.nav.skipLink).toBeFocused();
    await expect(portfolio.nav.skipLink).toBeInViewport();
    await page.keyboard.press('Enter');
    await expect(page.locator('#main')).toBeFocused();
  });

  test('no horizontal scrolling', async ({ page, portfolio }) => {
    await portfolio.open();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test('all images load and have alt text', async ({ page, portfolio }) => {
    await portfolio.open();
    const images = await page.locator('img').evaluateAll((els) =>
      (els as HTMLImageElement[]).map((img) => ({
        src: img.src,
        loaded: img.complete && img.naturalWidth > 0,
        alt: img.getAttribute('alt')
      }))
    );
    expect(images.length).toBeGreaterThan(0);
    for (const img of images) {
      expect(img.loaded, img.src).toBe(true);
      expect(img.alt, img.src).toBeTruthy();
    }
  });

  test('internal links and assets respond with 200', async ({ page, portfolio, request }) => {
    await portfolio.open();
    const paths = await page.evaluate(() => {
      const found = new Set<string>();
      document.querySelectorAll('a[href], link[href], script[src], img[src]').forEach((el) => {
        const raw = el.getAttribute('href') ?? el.getAttribute('src') ?? '';
        const url = new URL(raw, location.href);
        if (url.origin === location.origin && !raw.startsWith('#')) found.add(url.pathname);
      });
      return [...found];
    });
    expect(paths.length).toBeGreaterThan(3);
    for (const path of paths) {
      const res = await request.get(path);
      expect(res.status(), path).toBe(200);
    }
  });

  test('no links point to a source repo that is not configured yet', async ({ page, portfolio }) => {
    await portfolio.open();
    const repo = await page.evaluate(() => (window as unknown as { SITE: { repo: string } }).SITE.repo);
    if (!repo) await expect(page.locator('a[href*="github.com/yamangokhan/portfolio"], #footer-source')).toHaveCount(0);
  });

  test('unknown pages return the custom 404', async ({ request }) => {
    const res = await request.get('/bu-sayfa-yok');
    expect(res.status()).toBe(404);
    expect(await res.text()).toContain('404');
  });

  test('SEO and social meta tags are present', async ({ page, portfolio }) => {
    await portfolio.open();
    await expect(page).toHaveTitle(/Gökhan Yaman/);
    for (const sel of ['meta[name="description"]', 'meta[property="og:title"]', 'meta[property="og:image"]', 'link[rel="canonical"]']) {
      await expect(page.locator(sel), sel).toHaveCount(1);
    }
    const ld = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent()) ?? '{}') as { '@type'?: string };
    expect(ld['@type']).toBe('Person');
  });

  test('page weight stays under budget (same-origin, excluding CV)', async ({ page, portfolio }) => {
    await portfolio.open();
    const bytes = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const resources = (performance.getEntriesByType('resource') as PerformanceResourceTiming[])
        .filter((r) => new URL(r.name).origin === location.origin);
      return nav.encodedBodySize + resources.reduce((n, r) => n + r.encodedBodySize, 0);
    });
    expect(bytes).toBeLessThan(350 * 1024);
  });

  test('personal phone number and work email are not published', async ({ page, portfolio }) => {
    await portfolio.open();
    const html = await page.content();
    expect(html).not.toMatch(/553\s?870/);
    expect(html).not.toContain('@birtech.com');
  });
});

test.describe('Certificates', () => {
  test('list the Playwright certificate and link to real documents', async ({ page, portfolio, request }) => {
    await portfolio.open();
    const list = page.locator('#cert-list');
    await expect(list).toContainText('Introduction to Playwright');
    await expect(list).toContainText('176f2472');
    await expect(list).toContainText('YÖK Veri Analizi Okulu');
    const proofs = list.locator('a.cert-proof');
    await expect(proofs).toHaveCount(3);
    // ISTQB belgesi Turkish Testing Board'un resmi doğrulama sayfasında (Diplomasafe)
    await expect(list.locator('a.cert-proof[href^="https://app.diplomasafe.com/"]')).toHaveCount(1);
    const hrefs = await proofs.evaluateAll((els) => els.map((a) => a.getAttribute('href') ?? ''));
    for (const href of hrefs.filter((h) => !h.startsWith('http'))) {
      const res = await request.get(href);
      expect(res.status(), href).toBe(200);
      expect(res.headers()['content-type'], href).toMatch(/image\/jpeg|application\/pdf/);
    }
  });
});

test.describe('Analytics', () => {
  test('sends nothing to third parties while not configured, but still records events', async ({ page, portfolio }) => {
    await page.route('**/i18n.js', async (route) => {
      const res = await route.fetch();
      await route.fulfill({ response: res, body: `${await res.text()}
window.SITE.goatcounter = '';` });
    });
    const thirdParty: string[] = [];
    page.on('request', (r) => { if (r.url().includes('goatcounter') || r.url().includes('gc.zgo.at')) thirdParty.push(r.url()); });
    await portfolio.open();
    await portfolio.lab.use('terminal');
    expect(await page.evaluate(() => window.Analytics.enabled)).toBe(false);
    expect(await page.evaluate(() => window.Analytics.events())).toContain('lab-terminal');
    expect(thirdParty).toEqual([]);
  });

  test('loads the cookie-free GoatCounter script once a code is configured', async ({ page, portfolio }) => {
    await page.route('**/i18n.js', async (route) => {
      const res = await route.fetch();
      await route.fulfill({ response: res, body: `${await res.text()}\nwindow.SITE.goatcounter = 'test-site';` });
    });
    const counter = page.waitForRequest((r) => r.url().startsWith('https://gc.zgo.at/count.js'));
    await page.route('https://gc.zgo.at/**', (route) => route.fulfill({ body: '', contentType: 'text/javascript' }));
    await portfolio.open();
    await counter;
    await expect(page.locator('script[data-goatcounter="https://test-site.goatcounter.com/count"]')).toHaveCount(1);
    const cookies = await page.context().cookies();
    expect(cookies).toEqual([]);
  });
});

test.describe('Contact form', () => {
  test('is wired for Netlify Forms with a honeypot', async ({ portfolio }) => {
    const { contact } = portfolio;
    await portfolio.open();
    // Yerelde ham HTML'deki Netlify nitelikleri görünür; yayında Netlify formu işleyip bu nitelikleri kaldırır.
    if (!process.env.BASE_URL) {
      await expect(contact.form).toHaveAttribute('data-netlify', 'true');
      await expect(contact.form).toHaveAttribute('netlify-honeypot', 'bot-field');
    }
    await expect(contact.form).toHaveAttribute('method', /post/i);
    await expect(contact.form.locator('input[name="form-name"]')).toHaveValue('contact');
    await expect(contact.honeypot).toBeHidden();
  });

  test('blocks empty and invalid submissions', async ({ page, portfolio }) => {
    const { contact } = portfolio;
    await portfolio.open();
    const url = page.url();
    await contact.submit.click();
    expect(page.url()).toBe(url);
    expect((await contact.validity(contact.name)).valueMissing).toBe(true);

    await contact.fill({ name: 'Test Kullanıcı', email: 'gecersiz-adres', message: 'Merhaba' });
    await contact.submit.click();
    expect(page.url()).toBe(url);
    expect((await contact.validity(contact.email)).typeMismatch).toBe(true);
  });

  test('form fields have accessible labels', async ({ page, portfolio }) => {
    await portfolio.open();
    for (const label of ['Adın', 'E-posta adresin', 'Mesajın']) {
      await expect(page.getByLabel(label)).toBeVisible();
    }
  });
});

test.describe('Mobile menu', () => {
  test('opens, closes on link click and on Escape', async ({ page, portfolio, isMobile }) => {
    test.skip(!isMobile, 'only on small screens');
    const { menuToggle, links } = portfolio.nav;
    await portfolio.open();
    await expect(links).toBeHidden();
    await menuToggle.click();
    await expect(menuToggle).toHaveAttribute('aria-expanded', 'true');
    await expect(links).toBeVisible();
    await links.getByRole('link').first().click();
    await expect(links).toBeHidden();
    await menuToggle.click();
    await page.keyboard.press('Escape');
    await expect(links).toBeHidden();
    await expect(menuToggle).toHaveAttribute('aria-expanded', 'false');
  });
});

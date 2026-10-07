import { test, expect } from './fixtures';
import { aStatus } from './data/status';
import { SECTIONS } from './pages/components/Navigation';

test.describe('Terminal', () => {
  test('opens from the lab button and runs whoami', async ({ portfolio }) => {
    const { terminal } = portfolio;
    await portfolio.open();
    await terminal.open();
    await expect(terminal.input).toBeFocused();
    await terminal.run('whoami');
    await expect(terminal.output).toContainText('Senior Software Test Automation Engineer');
  });

  test('opens with Ctrl+K and closes with exit', async ({ portfolio, isMobile }) => {
    test.skip(isMobile, 'keyboard shortcut is a desktop concern');
    const { terminal } = portfolio;
    await portfolio.open();
    await terminal.openWithShortcut();
    await terminal.run('exit');
    await expect(terminal.dialog).toBeHidden();
  });

  test('help lists commands, unknown commands error, history works', async ({ portfolio }) => {
    const { terminal } = portfolio;
    await portfolio.open();
    await terminal.open();
    await terminal.run('help');
    await expect(terminal.output).toContainText('sudo hire-gokhan');
    await terminal.run('rm -rf /');
    await expect(terminal.lines('tl-red').last()).toContainText('komut bulunamadı: rm');
    await terminal.input.press('ArrowUp');
    await expect(terminal.input).toHaveValue('rm -rf /');
  });

  test('cat skills.json prints valid JSON with the real skills', async ({ portfolio }) => {
    const { terminal } = portfolio;
    await portfolio.open();
    await terminal.open();
    await terminal.run('cat skills.json');
    const json = await terminal.lines('tl-json').allTextContents();
    const parsed = JSON.parse(json.join('\n')) as Record<string, string[]>;
    expect(parsed['Otomasyon']).toContain('Selenium WebDriver');
  });

  test('npm test streams real results from test-status.json', async ({ portfolio }) => {
    const { terminal } = portfolio;
    await portfolio.status.mock(aStatus({
      passed: 2,
      total: 2,
      tests: [
        { t: 'Home page › loads', p: 'desktop', s: 'expected', d: 800 },
        { t: 'Bug hunt › starts', p: 'mobile', s: 'expected', d: 700 }
      ]
    }));
    await portfolio.open();
    await terminal.open();
    await terminal.run('npm test');
    await expect(terminal.output).toContainText('✓ [desktop] Home page › loads (0.8s)');
    await expect(terminal.output).toContainText('2 passed, 0 failed (1.5s)');
  });

  test('lang en switches the whole site', async ({ portfolio }) => {
    await portfolio.open();
    await portfolio.terminal.open();
    await portfolio.terminal.run('lang en');
    await expect(portfolio.html).toHaveAttribute('lang', 'en');
    await expect(portfolio.terminal.output).toContainText('Language switched.');
  });

  test('"bugs start" starts the hunt', async ({ portfolio }) => {
    const { terminal } = portfolio;
    await portfolio.open();
    await terminal.open();
    await terminal.run('bugs');
    await expect(terminal.output).toContainText('Bug avı kapalı');
    await terminal.run('bugs start');
    await expect(terminal.dialog).toBeHidden();
    await expect(portfolio.bugHunt.visibleBugs).toHaveCount(5);
  });
});

test.describe('Break the site', () => {
  test('breaks the layout, reports failures, then self-heals', async ({ page, portfolio }) => {
    const { lab } = portfolio;
    await portfolio.open();
    // Kırılma anı çok kısa sürebilir; transform alan öğeleri o anda kaydet
    await page.evaluate(() => {
      window.__broken = new Set();
      new MutationObserver((mutations) => {
        for (const m of mutations) {
          const el = m.target as HTMLElement;
          if (el.style?.transform.includes('rotate')) window.__broken.add(el.className);
        }
      }).observe(document.body, { subtree: true, attributes: true, attributeFilter: ['style'] });
    });

    await lab.use('chaos');
    await expect(lab.ciPanel).toBeVisible();
    await expect.poll(() => page.evaluate(() => [...window.__broken].some((c) => c.includes('stat')))).toBe(true);
    expect(await page.evaluate(() => window.__broken.size)).toBeGreaterThan(5);

    await expect(lab.ciPanel).toHaveAttribute('data-state', 'passed', { timeout: 10_000 });
    await expect(lab.ciLines.and(page.locator('.pass'))).toHaveCount(6);
    await expect(page.locator('[style*="rotate"]')).toHaveCount(0);
    await expect(page.locator('.glitch')).toHaveCount(0);
    await expect(portfolio.bugHunt.visibleBugs).toHaveCount(0);
  });
});

test.describe('Locator mode', () => {
  test.beforeEach(({ isMobile }) => {
    test.skip(isMobile, 'hover is a desktop concern');
  });

  test('shows a working Playwright locator and copies it on click', async ({ page, portfolio }) => {
    const { lab, bugHunt } = portfolio;
    await portfolio.open();
    await bugHunt.start();
    await lab.use('inspect');
    await expect(lab.button('inspect')).toHaveAttribute('aria-pressed', 'true');

    const heading = portfolio.sectionHeading('projects');
    await heading.scrollIntoViewIfNeeded();
    await heading.hover();
    await expect(lab.inspectLabel).toBeVisible();
    await expect(lab.inspectLabel).toContainText("page.getByRole('heading', { name: 'Projeler' })");

    // Sitenin ürettiği locator gerçekten çalışıyor mu?
    await expect(page.getByRole('heading', { name: 'Projeler' })).toHaveCount(1);

    // Tıklama ne navigasyon yapar ne de bug sayar
    const url = page.url();
    await bugHunt.bug('typo').click();
    expect(page.url()).toBe(url);
    await expect(bugHunt.count).toHaveText('0/5');
    await expect(bugHunt.bug('typo')).toHaveClass(/bugged/);
    await expect(portfolio.toasts).toContainText('Kopyalandı');

    await page.keyboard.press('Escape');
    await expect(lab.button('inspect')).toHaveAttribute('aria-pressed', 'false');
    await expect(lab.inspectLabel).toBeHidden();
  });

  test('form fields get getByLabel locators that resolve', async ({ page, portfolio }) => {
    await portfolio.open();
    await portfolio.lab.use('inspect');
    await portfolio.contact.email.scrollIntoViewIfNeeded();
    await portfolio.contact.email.hover();
    await expect(portfolio.lab.inspectLabel).toContainText("page.getByLabel('E-posta adresin')");
    await expect(page.getByLabel('E-posta adresin')).toHaveCount(1);
  });
});

test.describe('Coverage meter', () => {
  test('fills up to 100% as the visitor explores every section', async ({ portfolio }) => {
    await portfolio.open();
    expect(await portfolio.lab.coveragePercent()).toBeLessThan(100);
    await portfolio.scrollThrough(SECTIONS);
    await expect(portfolio.lab.coverage).toHaveAttribute('aria-valuenow', '100');
    await expect(portfolio.toasts).toContainText('Coverage %100');
  });
});

test.describe('Hero layout', () => {
  test('primary CTA comes before the playful lab row', async ({ portfolio, isMobile }) => {
    await portfolio.open();
    const cta = (await portfolio.primaryCta.boundingBox())!;
    const lab = (await portfolio.lab.row.boundingBox())!;
    // Mobilde laboratuvar CTA'nın altında; masaüstünde sağ sütunda
    if (isMobile) expect(lab.y).toBeGreaterThan(cta.y + cta.height);
    else expect(lab.x).toBeGreaterThan(cta.x + cta.width);
  });

  test('on mobile the floating bug button stays out of the way until the hunt starts', async ({ portfolio, isMobile }) => {
    test.skip(!isMobile, 'mobile only');
    await portfolio.open();
    await expect(portfolio.bugHunt.pill).toBeHidden();
    await portfolio.lab.use('hunt');
    await expect(portfolio.bugHunt.pill).toBeVisible();
  });

  test('nothing floats over the primary CTA', async ({ portfolio }) => {
    await portfolio.open();
    expect(await portfolio.isTopmostAt(portfolio.primaryCta)).toBe(true);
  });
});

test.describe('Marquee', () => {
  test('lists every skill and is hidden from screen readers', async ({ page, portfolio }) => {
    await portfolio.open();
    await expect(page.locator('.marquee')).toHaveAttribute('aria-hidden', 'true');
    await expect(portfolio.marquee).toContainText('Selenium WebDriver');
    await expect(portfolio.marquee).toContainText('Claude Code');
  });
});

import { test, expect } from './fixtures';
import { aStatus, hoursAgo } from './data/status';
import { SECTIONS } from './pages/components/Navigation';

test.describe('Home page', () => {
  test('loads without console or page errors', async ({ page, portfolio }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    await portfolio.open();
    await expect(portfolio.name).toHaveText('Gökhan Yaman');
    expect(errors).toEqual([]);
  });

  test('Gherkin scenario finishes with every step passed', async ({ portfolio }) => {
    await portfolio.open('/', { animate: true });
    await expect(portfolio.gherkin.locator('.g-step')).toHaveCount(5);
    await expect(portfolio.gherkin.locator('.g-step.passed')).toHaveCount(5);
    await expect(portfolio.gherkin.locator('.g-summary')).toContainText('5 adım (5 başarılı)');
  });

  for (const id of SECTIONS) {
    test(`navigation link scrolls to #${id}`, async ({ page, portfolio }) => {
      await portfolio.open();
      await portfolio.nav.goTo(id);
      await expect(portfolio.sectionHeading(id)).toBeInViewport();
      await expect(page).toHaveURL(new RegExp(`#${id}$`));
    });
  }

  test('experience renders as a passing test run', async ({ portfolio }) => {
    await portfolio.open();
    const run = portfolio.experienceRun;
    await expect(run.locator('.suite')).toHaveCount(3);
    const cases = await run.locator('.cases li').count();
    await expect(run.locator('.run-summary')).toHaveText(`✓ 3 suite · ${cases} test · hepsi geçti`);
    await expect(run).toContainText('Birtech Technology');
    await expect(run).toContainText('Hypnotes Inc.');
  });

  test('says what roles and work setups Gökhan is open to', async ({ portfolio }) => {
    await portfolio.open();
    const { looking } = portfolio;
    await expect(looking.locator('.open-badge')).toHaveText('Yeni fırsatlara açığım');
    for (const text of ['SDET', 'QA / Test Lead', 'İstanbul / Eskişehir hibrit', 'Taşınmaya açık']) {
      await expect(looking).toContainText(text);
    }
    // Recruiter kaydırmadan önce görmeli: iletişim butonunun üstünde
    const box = await looking.boundingBox();
    const cta = await portfolio.primaryCta.boundingBox();
    expect(box!.y).toBeLessThan(cta!.y);
  });

  test('availability block is translated', async ({ portfolio }) => {
    await portfolio.openIn('en');
    await expect(portfolio.looking.locator('.open-badge')).toHaveText('Open to new opportunities');
    await expect(portfolio.looking).toContainText('Open to relocation');
  });

  test('CV download link serves a PDF', async ({ portfolio, request }) => {
    await portfolio.open();
    const href = await portfolio.cvLink.getAttribute('href');
    const res = await request.get(href!);
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('application/pdf');
  });

  test('status badge shows a passing run from test-status.json', async ({ portfolio }) => {
    await portfolio.status.mock(aStatus({ finishedAt: hoursAgo(2), reportUrl: 'report/' }));
    await portfolio.open();
    const badge = portfolio.status.root;
    await expect(badge).toHaveAttribute('data-state', 'pass');
    await expect(badge).toContainText('42/42');
    await expect(badge).toContainText('2 saat önce');
    await expect(badge).toHaveAttribute('href', 'report/');
    await expect(portfolio.status.footerText).toHaveText('Bu site 42 otomatik testle korunuyor.');
  });

  test('status badge turns red when tests fail', async ({ portfolio }) => {
    await portfolio.status.mock(aStatus({ passed: 40, failed: 2 }));
    await portfolio.open();
    await expect(portfolio.status.root).toHaveAttribute('data-state', 'fail');
    await expect(portfolio.status.root).toContainText('2/42');
  });

  test('status badge degrades gracefully without test-status.json', async ({ portfolio }) => {
    await portfolio.status.mock(null);
    await portfolio.open();
    await expect(portfolio.status.root).toHaveAttribute('data-state', 'none');
    await expect(portfolio.status.root).not.toHaveAttribute('href', /.*/);
  });
});

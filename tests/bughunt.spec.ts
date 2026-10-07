import { test, expect } from './fixtures';
import { BUGS } from './pages/components/BugHunt';

test.describe('Bug hunt — off by default', () => {
  test('the site loads clean: no visible bugs', async ({ portfolio }) => {
    const { bugHunt } = portfolio;
    await portfolio.open();
    await expect(bugHunt.visibleBugs).toHaveCount(0);
    await expect(portfolio.experienceTitle).toHaveText('Deneyim');
    await expect(bugHunt.bug('date')).toHaveText('2024');
    await expect(bugHunt.bug('link')).not.toHaveAttribute('href', /.*/);
    await expect(bugHunt.bug('link')).toContainText('demo yok');
    await expect(bugHunt.pill).toContainText('Bug avı');
  });

  test('no intro toast interrupts the first visit', async ({ page, portfolio }) => {
    await page.goto('/');
    await page.waitForTimeout(2_500);
    await expect(portfolio.toasts.locator('.toast')).toHaveCount(0);
  });

  test('clicking would-be bugs does nothing while the hunt is off', async ({ portfolio }) => {
    await portfolio.open();
    await portfolio.bugHunt.bug('typo').click();
    await expect(portfolio.toasts.locator('.toast')).toHaveCount(0);
    await expect(portfolio.bugHunt.root).not.toHaveClass(/active/);
  });
});

test.describe('Bug hunt — started', () => {
  test('starting reveals 5 bugs', async ({ portfolio }) => {
    const { bugHunt } = portfolio;
    await portfolio.open();
    await bugHunt.start();
    await expect(bugHunt.count).toHaveText('0/5');
    for (const id of BUGS) await expect(bugHunt.bug(id)).toHaveClass(/bugged/);
    await expect(portfolio.experienceTitle).toHaveText('Denyeim');
    await expect(bugHunt.bug('date')).toHaveText('2O24');
    await expect(portfolio.toasts).toContainText('Av başladı');
  });

  test('can also be started from the floating panel', async ({ portfolio, isMobile }) => {
    test.skip(isMobile, 'the floating button is hidden on mobile until the hunt starts');
    await portfolio.open();
    await portfolio.bugHunt.startFromPanel();
    await expect(portfolio.bugHunt.visibleBugs).toHaveCount(5);
  });

  test('clicking a bug fixes it and updates the counter', async ({ portfolio }) => {
    const { bugHunt } = portfolio;
    await portfolio.open();
    await bugHunt.start();
    await bugHunt.find('typo');
    await expect(portfolio.experienceTitle).toHaveText('Deneyim');
    await expect(bugHunt.bug('typo')).toHaveClass(/fixed/);
    await expect(bugHunt.count).toHaveText('1/5');
    await expect(portfolio.toasts).toContainText('Yazım hatası');
  });

  test('the broken link does not navigate and turns into an honest label', async ({ page, portfolio }) => {
    const { bugHunt } = portfolio;
    await portfolio.open();
    await bugHunt.start();
    const before = page.url();
    await bugHunt.find('link');
    expect(page.url()).toBe(before);
    await expect(bugHunt.bug('link')).not.toHaveAttribute('href', /.*/);
    await expect(bugHunt.bug('link')).toContainText('demo yok');
  });

  test('clicking ordinary content does not count as a bug', async ({ page, portfolio }) => {
    await portfolio.open();
    await portfolio.bugHunt.start();
    await portfolio.sectionHeading('approach').click();
    await page.locator('.chip').first().click();
    await expect(portfolio.bugHunt.count).toHaveText('0/5');
  });

  test('finding all bugs opens the Bug Hunter dialog', async ({ portfolio }) => {
    const { bugHunt } = portfolio;
    await portfolio.open();
    await bugHunt.start();
    await bugHunt.find(...BUGS);
    await expect(bugHunt.dialog).toBeVisible();
    await expect(bugHunt.dialog.getByRole('heading')).toHaveText('🏆 Bug Avcısı');
    await expect(bugHunt.shareLink).toHaveAttribute('href', /linkedin\.com\/sharing/);
    await bugHunt.closeDialog.click();
    await expect(bugHunt.dialog).toBeHidden();
    await expect(bugHunt.count).toHaveText('5/5');
  });

  test('progress survives reload and language switch; ending the hunt cleans the site', async ({ page, portfolio }) => {
    const { bugHunt } = portfolio;
    await portfolio.open();
    await bugHunt.start();
    await bugHunt.find('typo', 'date');
    await page.reload();
    await expect(bugHunt.count).toHaveText('2/5');
    await expect(bugHunt.visibleBugs).toHaveCount(3);

    await portfolio.nav.switchLanguage();
    await expect(portfolio.experienceTitle).toHaveText('Experience');
    await expect(bugHunt.bug('date')).toHaveText('2024');

    await bugHunt.end();
    await expect(bugHunt.root).not.toHaveClass(/active/);
    await expect(bugHunt.visibleBugs).toHaveCount(0);
    await page.reload();
    await expect(bugHunt.visibleBugs).toHaveCount(0);
  });

  test('hint button points at an unfound bug', async ({ portfolio }) => {
    const { bugHunt } = portfolio;
    await portfolio.open();
    await bugHunt.start();
    await bugHunt.togglePanel();
    await bugHunt.hintButton.click();
    await expect(bugHunt.hint).toHaveText('En üstteki sayılardan biri hizasından kaymış.');
    await bugHunt.hintButton.click();
    await expect(bugHunt.hint).toContainText('imla');
  });
});

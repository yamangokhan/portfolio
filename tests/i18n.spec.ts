import { test, expect } from './fixtures';

test.describe('Language', () => {
  test('defaults to Turkish for a Turkish browser', async ({ portfolio }) => {
    await portfolio.open();
    await expect(portfolio.html).toHaveAttribute('lang', 'tr');
    await expect(portfolio.sectionHeading('approach')).toHaveText('Nasıl çalışırım');
  });

  test('toggle switches to English and the choice survives a reload', async ({ page, portfolio }) => {
    await portfolio.open();
    await portfolio.nav.switchLanguage();
    await expect(portfolio.html).toHaveAttribute('lang', 'en');
    await expect(portfolio.sectionHeading('approach')).toHaveText('How I work');
    await expect(page).toHaveTitle(/Test Automation Engineer/);
    await expect(portfolio.gherkin).toContainText('Feature:');

    await page.reload();
    await expect(portfolio.html).toHaveAttribute('lang', 'en');
    await expect(portfolio.nav.langToggle).toHaveText('TR');
  });

  test('?lang=en query parameter wins', async ({ portfolio }) => {
    await portfolio.openIn('en');
    await expect(portfolio.html).toHaveAttribute('lang', 'en');
    await expect(portfolio.sectionHeading('contact')).toHaveText('Let’s work together');
  });

  test.describe('with an English browser', () => {
    test.use({ locale: 'en-US' });

    test('defaults to English', async ({ portfolio }) => {
      await portfolio.open();
      await expect(portfolio.html).toHaveAttribute('lang', 'en');
    });
  });

  test('every rendered string exists in both languages', async ({ page, portfolio }) => {
    await portfolio.open();
    const missing = await page.evaluate(() => {
      type Node = Record<string, unknown>;
      const walk = (a: Node, b: Node, path: string, out: string[]): string[] => {
        for (const k of Object.keys(a)) {
          const av = a[k];
          if (!(k in b)) out.push(path + k);
          else if (av && typeof av === 'object') walk(av as Node, b[k] as Node, `${path}${k}.`, out);
        }
        return out;
      };
      const { tr, en } = window.I18N;
      return [...walk(tr, en, '', []), ...walk(en, tr, '', [])];
    });
    expect(missing).toEqual([]);
  });
});

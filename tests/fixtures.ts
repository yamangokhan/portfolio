import { test as base, expect } from '@playwright/test';
import { PortfolioPage } from './pages/PortfolioPage';

interface Fixtures {
  portfolio: PortfolioPage;
}

/** Her test hazır bir PortfolioPage alır: `test('...', async ({ portfolio }) => { ... })` */
export const test = base.extend<Fixtures>({
  portfolio: async ({ page }, use) => {
    // Testlerin ziyaretleri gerçek istatistiklere karışmasın: sayaç isteklerini sessizce karşıla
    await page.route('https://gc.zgo.at/**', (route) => route.fulfill({ body: '', contentType: 'text/javascript' }));
    await page.route('https://*.goatcounter.com/**', (route) => route.fulfill({ status: 204 }));
    await use(new PortfolioPage(page));
  }
});

export { expect };

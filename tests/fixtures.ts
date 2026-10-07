import { test as base, expect } from '@playwright/test';
import { PortfolioPage } from './pages/PortfolioPage';

interface Fixtures {
  portfolio: PortfolioPage;
}

/** Her test hazır bir PortfolioPage alır: `test('...', async ({ portfolio }) => { ... })` */
export const test = base.extend<Fixtures>({
  portfolio: async ({ page }, use) => {
    await use(new PortfolioPage(page));
  }
});

export { expect };

import type { Locator, Page } from '@playwright/test';
import type { TestStatus } from '../../data/status';

export type BadgeState = 'loading' | 'none' | 'pass' | 'fail';

/** Hero'daki "Bu site N/N testten geçti" rozeti. */
export class StatusBadge {
  readonly root: Locator;
  readonly footerText: Locator;

  constructor(private readonly page: Page) {
    this.root = page.locator('#status-badge');
    this.footerText = page.locator('#footer-tested');
  }

  /** test-status.json yanıtını taklit eder; null → 404 (dosya yok). */
  async mock(status: TestStatus | null): Promise<void> {
    await this.page.route('**/test-status.json', (route) =>
      status ? route.fulfill({ json: status }) : route.fulfill({ status: 404, body: '' })
    );
  }
}

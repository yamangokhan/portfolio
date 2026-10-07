import type { Locator, Page } from '@playwright/test';

export type LabTool = 'terminal' | 'inspect' | 'hunt' | 'chaos';

/** "Oyna" satırı: locator modu, siteyi kır ve coverage ölçer. */
export class Lab {
  readonly row: Locator;
  readonly ciPanel: Locator;
  readonly ciLines: Locator;
  readonly inspectLabel: Locator;
  readonly coverage: Locator;

  constructor(private readonly page: Page) {
    this.row = page.locator('.lab');
    this.ciPanel = page.locator('#ci');
    this.ciLines = page.locator('#ci-lines li');
    this.inspectLabel = page.locator('#inspect-label');
    this.coverage = page.locator('#cov');
  }

  button(tool: LabTool): Locator {
    return this.page.locator(`[data-lab="${tool}"]`);
  }

  async use(tool: LabTool): Promise<void> {
    await this.button(tool).click();
  }

  async coveragePercent(): Promise<number> {
    return Number(await this.coverage.getAttribute('aria-valuenow'));
  }
}

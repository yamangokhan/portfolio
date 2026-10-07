import { expect, type Locator, type Page } from '@playwright/test';

export class Terminal {
  readonly dialog: Locator;
  readonly input: Locator;
  readonly output: Locator;

  constructor(private readonly page: Page) {
    this.dialog = page.locator('#term');
    this.input = page.locator('#term-input');
    this.output = page.locator('#term-out');
  }

  async open(): Promise<void> {
    await this.page.locator('[data-lab="terminal"]').click();
    await expect(this.dialog).toBeVisible();
  }

  async openWithShortcut(): Promise<void> {
    await this.page.keyboard.press('Control+k');
    await expect(this.dialog).toBeVisible();
  }

  async run(command: string): Promise<void> {
    await this.input.fill(command);
    await this.input.press('Enter');
  }

  /** Çıktı satırları; renk sınıfına göre süzülebilir (ör. 'tl-red'). */
  lines(cls?: string): Locator {
    return this.output.locator(cls ? `.tl.${cls}` : '.tl');
  }
}

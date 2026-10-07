import { expect, type Locator, type Page } from '@playwright/test';

/** Sayfadaki sırayla saklı bug'lar. */
export const BUGS = ['align', 'typo', 'date', 'link', 'flip'] as const;
export type BugId = (typeof BUGS)[number];

export class BugHunt {
  readonly root: Locator;
  readonly pill: Locator;
  readonly panel: Locator;
  readonly count: Locator;
  readonly startButton: Locator;
  readonly endButton: Locator;
  readonly hintButton: Locator;
  readonly hint: Locator;
  readonly visibleBugs: Locator;
  readonly dialog: Locator;
  readonly shareLink: Locator;
  readonly closeDialog: Locator;

  constructor(private readonly page: Page) {
    this.root = page.locator('#bh');
    this.pill = page.locator('#bh-pill');
    this.panel = page.locator('#bh-panel');
    this.count = page.locator('#bh-count');
    this.startButton = page.locator('#bh-start');
    this.endButton = page.locator('#bh-reset');
    this.hintButton = page.locator('#bh-hint-btn');
    this.hint = page.locator('#bh-hint');
    this.visibleBugs = page.locator('.bugged');
    this.dialog = page.locator('#bh-dialog');
    this.shareLink = page.locator('#bh-share');
    this.closeDialog = page.locator('#bh-close');
  }

  bug(id: BugId): Locator {
    return this.page.locator(`[data-bug="${id}"]`);
  }

  /** Avı laboratuvar satırından başlatır ve paneli içeriğin önünden çeker. */
  async start(): Promise<void> {
    await this.page.locator('[data-lab="hunt"]').click();
    await expect(this.root).toHaveClass(/active/);
    await this.togglePanel();
    await expect(this.panel).toBeHidden();
  }

  /** Avı yüzen 🐞 panelinden başlatır (mobilde av başlamadan bu buton gizli). */
  async startFromPanel(): Promise<void> {
    await this.pill.click();
    await this.startButton.click();
    await expect(this.root).toHaveClass(/active/);
  }

  async togglePanel(): Promise<void> {
    await this.pill.click();
  }

  async find(...ids: BugId[]): Promise<void> {
    for (const id of ids) await this.bug(id).click();
  }

  async end(): Promise<void> {
    if (await this.panel.isHidden()) await this.togglePanel();
    await this.endButton.click();
  }
}

import { expect, type Locator, type Page } from '@playwright/test';

export const SECTIONS = ['approach', 'experience', 'projects', 'skills', 'certificates', 'contact'] as const;
export type SectionId = (typeof SECTIONS)[number];

export class Navigation {
  readonly menuToggle: Locator;
  readonly links: Locator;
  readonly langToggle: Locator;
  readonly skipLink: Locator;

  constructor(page: Page) {
    this.menuToggle = page.locator('#menu-toggle');
    this.links = page.locator('#nav-links');
    this.langToggle = page.locator('#lang-toggle');
    this.skipLink = page.locator('.skip-link');
  }

  link(id: SectionId): Locator {
    return this.links.locator(`a[href="#${id}"]`);
  }

  /** Hamburger menü yalnızca dar ekranlarda görünür. */
  async openMenuIfCollapsed(): Promise<void> {
    if (await this.menuToggle.isVisible()) {
      await this.menuToggle.click();
      await expect(this.links).toBeVisible();
    }
  }

  async goTo(id: SectionId): Promise<void> {
    await this.openMenuIfCollapsed();
    await this.link(id).click();
  }

  async switchLanguage(): Promise<void> {
    await this.langToggle.click();
  }
}

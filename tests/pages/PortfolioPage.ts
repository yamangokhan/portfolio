import { expect, type Locator, type Page } from '@playwright/test';
import { BugHunt } from './components/BugHunt';
import { ContactForm } from './components/ContactForm';
import { Lab } from './components/Lab';
import { Navigation, type SectionId } from './components/Navigation';
import { StatusBadge } from './components/StatusBadge';
import { Terminal } from './components/Terminal';

export type Lang = 'tr' | 'en';

export interface OpenOptions {
  /** Varsayılan: hareketi azaltılmış mod — animasyonlar beklenmez, testler deterministik olur. */
  animate?: boolean;
}

/** Portföy sayfasının Page Object'i; bileşenler ayrı sınıflarda. */
export class PortfolioPage {
  readonly nav: Navigation;
  readonly bugHunt: BugHunt;
  readonly terminal: Terminal;
  readonly lab: Lab;
  readonly contact: ContactForm;
  readonly status: StatusBadge;

  readonly html: Locator;
  readonly name: Locator;
  readonly gherkin: Locator;
  readonly looking: Locator;
  readonly primaryCta: Locator;
  readonly cvLink: Locator;
  readonly experienceRun: Locator;
  readonly experienceTitle: Locator;
  readonly toasts: Locator;
  readonly marquee: Locator;

  constructor(readonly page: Page) {
    this.nav = new Navigation(page);
    this.bugHunt = new BugHunt(page);
    this.terminal = new Terminal(page);
    this.lab = new Lab(page);
    this.contact = new ContactForm(page);
    this.status = new StatusBadge(page);

    this.html = page.locator('html');
    this.name = page.getByRole('heading', { level: 1 });
    this.gherkin = page.locator('#gherkin');
    this.looking = page.locator('#looking');
    this.primaryCta = page.locator('.hero-cta .btn-primary');
    this.cvLink = page.locator('.hero-cta a[download]');
    this.experienceRun = page.locator('#run');
    this.experienceTitle = page.locator('#experience-title');
    this.toasts = page.locator('#toasts');
    this.marquee = page.locator('#marquee');
  }

  async open(path = '/', { animate = false }: OpenOptions = {}): Promise<void> {
    if (!animate) await this.page.emulateMedia({ reducedMotion: 'reduce' });
    await this.page.goto(path);
    await expect(this.gherkin).toHaveAttribute('data-done', 'true', { timeout: 15_000 });
  }

  async openIn(lang: Lang): Promise<void> {
    await this.open(`/?lang=${lang}`);
  }

  section(id: SectionId): Locator {
    return this.page.locator(`#${id}`);
  }

  sectionHeading(id: SectionId): Locator {
    return this.section(id).locator('h2');
  }

  async scrollThrough(ids: readonly SectionId[]): Promise<void> {
    for (const id of ids) {
      await this.section(id).evaluate((el) => el.scrollIntoView({ block: 'center' }));
      // IntersectionObserver'ın bir sonraki karede tetiklenmesini bekle
      await this.page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
    }
    await this.page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  }

  /** Verilen noktadaki en üstteki öğe, hedefin kendisi ya da içindeki bir öğe mi? */
  async isTopmostAt(target: Locator): Promise<boolean> {
    await target.scrollIntoViewIfNeeded();
    const box = await target.boundingBox();
    if (!box) return false;
    return target.evaluate(
      (el, p) => {
        const hit = document.elementFromPoint(p.x, p.y);
        return !!hit && (hit === el || el.contains(hit));
      },
      { x: box.x + 12, y: box.y + box.height / 2 }
    );
  }
}

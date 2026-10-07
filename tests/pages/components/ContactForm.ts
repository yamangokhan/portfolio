import type { Locator, Page } from '@playwright/test';

export interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

export interface FieldValidity {
  valueMissing: boolean;
  typeMismatch: boolean;
}

export class ContactForm {
  readonly form: Locator;
  readonly name: Locator;
  readonly email: Locator;
  readonly message: Locator;
  readonly submit: Locator;
  readonly honeypot: Locator;

  constructor(page: Page) {
    this.form = page.locator('form[name="contact"]');
    this.name = page.locator('#f-name');
    this.email = page.locator('#f-email');
    this.message = page.locator('#f-message');
    this.submit = this.form.locator('button[type="submit"]');
    this.honeypot = this.form.locator('input[name="bot-field"]');
  }

  async fill(data: ContactMessage): Promise<void> {
    await this.name.fill(data.name);
    await this.email.fill(data.email);
    await this.message.fill(data.message);
  }

  /** Tarayıcının yerleşik form doğrulamasını okur. */
  validity(field: Locator): Promise<FieldValidity> {
    return field.evaluate((el) => {
      const { valueMissing, typeMismatch } = (el as HTMLInputElement | HTMLTextAreaElement).validity;
      return { valueMissing, typeMismatch };
    });
  }
}

import { Page } from "@playwright/test";

export class ContactPage {
  constructor(readonly page: Page) {}

  async navigateContact() {
    await this.page.goto("/contact");
  }

  async enterNameAndEmail(firstname: string,lastname: string,email: string) {
    await this.page.locator('[data-test="first-name"]').fill(firstname);
    await this.page.locator('[data-test="last-name"]').fill(lastname);
    await this.page.locator('[data-test="email"]').fill(email);
  }

  async selectSubject() {
    await this.page.locator('[data-test="subject"]').selectOption("Payments");
  }

  async enterMessage(message: string) {
    await this.page.locator('[data-test="message"]').fill(message);
  }

  async uploadAttachment(dir: string) {
    await this.page.locator('[data-test="attachment"]').setInputFiles(dir);
  }
}

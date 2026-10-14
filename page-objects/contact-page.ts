import { Page, Locator, FileChooser } from "@playwright/test";

export class ContactPage {
  readonly heading: Locator;
  readonly attachmentInput: Locator;

  constructor(readonly page: Page) {
    this.heading = this.page.getByRole("heading", { name: "Contact", exact: true });
    this.attachmentInput = this.page.locator('[data-test="attachment"]');
  }

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
    await this.attachmentInput.setInputFiles(dir);
  }

  async openAttachmentChooser(): Promise<FileChooser> {
    const fileChooser = this.page.waitForEvent("filechooser");
    await this.attachmentInput.click();
    return fileChooser;
  }
}

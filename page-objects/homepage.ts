import { Page } from "@playwright/test";

export class HomePage {
  constructor(readonly page: Page) {}


  async selectFirstProduct() {
    await this.page.goto("/");
    const product = this.page.locator(".container .card").first();
    await product.waitFor({ state: "visible" });
    await product.click();
    await Promise.all([
      this.page.waitForURL(/\/product/, { waitUntil: "domcontentloaded" }),
      product.click()
    ]);
  }
}

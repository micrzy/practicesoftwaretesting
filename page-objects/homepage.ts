import { Page } from "@playwright/test";

export class HomePage {
  constructor(readonly page: Page) {}


  async selectFirstProduct() {
    await this.page.goto("/");
    const products = this.page.locator(".container .card");
    await products.first().click();
    await this.page.waitForURL(/\/product/);
  }
}

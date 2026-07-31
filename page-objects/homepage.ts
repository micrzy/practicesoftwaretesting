import { Page } from "@playwright/test";

export class HomePage {
  constructor(readonly page: Page) {}


  async selectProductRandomly() {
    await this.page.goto("/");
    const products = this.page.locator(".container .card");
    const count = await products.count();
    await products.nth(Math.floor(Math.random() * count)).click();
    await this.page.waitForURL(/\/product/);
  }
}

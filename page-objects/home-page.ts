import { Page,expect } from "@playwright/test";

export class HomePage {
  constructor(readonly page: Page) {}


  async selectFirstProduct() {
    await this.page.goto("/");
    const product = this.page.locator('[data-test="product-name"]').first();
    await product.waitFor({ state: "visible" });
    await product.click()
    await expect(this.page).toHaveURL(/\/product/);
  }
}

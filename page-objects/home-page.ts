import { Page,Locator,expect } from "@playwright/test";

export class HomePage {
  constructor(readonly page: Page) {}

  productCard(productName: string): Locator {
    return this.page.locator('a[data-test^="product-"]').filter({
      has: this.page.locator('[data-test="product-name"]').getByText(productName, { exact: true }),
    });
  }

  async selectProduct() {
    await this.page.goto("/");
    const product = this.page.locator('[data-test="product-name"]').filter({has:this.page.getByText('Claw Hammer', {exact:true})});
    await product.waitFor({ state: "visible" });
    await product.click()
    await expect(this.page).toHaveURL(/\/product/);
  }
}

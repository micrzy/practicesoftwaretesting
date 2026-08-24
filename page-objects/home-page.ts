import { Page,expect } from "@playwright/test";

export class HomePage {
  constructor(readonly page: Page) {}


  async selectProduct() {
    await this.page.goto("/");
    const product = this.page.locator('[data-test="product-name"]').filter({has:this.page.getByText('Claw Hammer', {exact:true})});
    await product.waitFor({ state: "visible" });
    await product.click()
    await expect(this.page).toHaveURL(/\/product/);
  }
}

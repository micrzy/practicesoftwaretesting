import { Page, Locator } from "@playwright/test";

export class ProductPage {
  readonly name: Locator;
  readonly unitPrice: Locator;
  readonly description: Locator;
  readonly addToCartButton: Locator;

  constructor(readonly page: Page) {
    this.name = this.page.locator('[data-test="product-name"]');
    this.unitPrice = this.page.locator('[data-test="unit-price"]');
    this.description = this.page.locator('[data-test="product-description"]');
    this.addToCartButton = this.page.locator('[data-test="add-to-cart"]');
  }
}

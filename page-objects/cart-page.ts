import { Page, Locator } from "@playwright/test";

export class CartPage {
  readonly productTitle: Locator;
  readonly productQuantity: Locator;
  readonly productPrice: Locator;
  readonly cartTotal: Locator;
  readonly proceedToCheckoutButton: Locator;
  readonly loginSubmit: Locator;

  constructor(readonly page: Page) {
    this.productTitle = this.page.locator('[data-test="product-title"]');
    this.productQuantity = this.page.locator('[data-test="product-quantity"]');
    this.productPrice = this.page.locator('[data-test="product-price"]');
    this.cartTotal = this.page.locator('[data-test="cart-total"]');
    this.proceedToCheckoutButton = this.page.locator('[data-test="proceed-1"]');
    this.loginSubmit = this.page.locator('[data-test="login-submit"]');
  }
}

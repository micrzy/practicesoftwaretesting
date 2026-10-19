import { Page, Locator, expect } from "@playwright/test";

export class CheckoutPage {
  readonly proceedFromSignInButton: Locator;
  readonly street: Locator;
  readonly postalCode: Locator;
  readonly houseNumber: Locator;
  readonly proceedFromAddressButton: Locator;
  readonly paymentMethod: Locator;

  constructor(readonly page: Page) {
    this.proceedFromSignInButton = this.page.locator('[data-test="proceed-2"]');
    this.street = this.page.locator('[data-test="street"]');
    this.postalCode = this.page.locator('[data-test="postal_code"]');
    this.houseNumber = this.page.locator('[data-test="house_number"]');
    this.proceedFromAddressButton = this.page.locator('[data-test="proceed-3"]');
    this.paymentMethod = this.page.locator('[data-test="payment-method"]');
  }

  // From the sign-in step (user already signed in) to the payment step, selecting the given method
  async goToPaymentWith(paymentMethod: string, postalCode = "1234", houseNumber = "12") {
    await this.proceedFromSignInButton.click();
    // Street is prefilled from the user's profile once the address step has loaded
    await expect(this.street).not.toHaveValue("");
    await this.postalCode.fill(postalCode);
    await this.houseNumber.fill(houseNumber);
    await this.proceedFromAddressButton.click();
    await this.paymentMethod.selectOption({ label: paymentMethod });
  }
}

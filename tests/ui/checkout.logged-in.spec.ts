import { test, expect } from "../../page-objects/fixtures";
import { createCartWithProduct } from "../../utils/api-helpers";

test.describe("Checkout Process @smoke @regression", () => {
  test("should checkout successfully with a signed-in user", async ({
    request,
      page,
    poManager
  }) => {
    const cartId = await createCartWithProduct(request, 1);
    const quantity = 1;
    await page.addInitScript(
      ({ id, qty }) => {
        window.sessionStorage.setItem("cart_id", id);
        window.sessionStorage.setItem("cart_quantity", String(qty));
      },
      { id: cartId, qty: quantity },
    );

    await page.goto("/checkout");
    await poManager.cartPage.proceedToCheckoutButton.click();
    await poManager.checkoutPage.goToPaymentWith("Cash on Delivery");

      const button = page.locator('[data-test="finish"]');
      await button.click();
      const alert = page.locator('[data-test="payment-success-message"]');
      await expect(alert).toHaveText("Payment was successful");
      await expect(button.getByText("Confirm")).toBeVisible();

      await button.click();
      const confirmationMessage = page.locator('#order-confirmation');
      await expect(confirmationMessage).toBeVisible();
      const invoiceNumber = await confirmationMessage.locator('span').textContent();
      await expect(confirmationMessage).toContainText("Thanks for your order! Your invoice number is");

      await poManager.userProfile.goToInvoicesPage();
      const row = page.locator('tr', { hasText: invoiceNumber });
      await expect(row).toBeVisible();


  });
});

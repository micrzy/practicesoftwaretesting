import { test, expect } from "../../page-objects/fixtures";
import { createCartWithProduct } from "../../utils/api-helpers";

test.describe("Checkout Navigation Permissions @smoke @regression", () => {
  test("should redirect guest user to Sign-In step upon clicking proceed to checkout", async ({
    request,
    page,
  }) => {
    const cartId = await createCartWithProduct(request, 1);
    const quantity = 1;
   await page.addInitScript(({ id, qty }) => {
  window.sessionStorage.setItem("cart_id", id);
  window.sessionStorage.setItem("cart_quantity", String(qty));
}, { id: cartId, qty: quantity });
    
    await page.goto("/checkout");
    await page.locator('[data-test="proceed-1"]').click();
    const signInTab = page.locator('a[href="#signin-tab"]');
    const guestTab = page.locator('a[href="#guest-tab"]');

    await expect(signInTab).toHaveText("Sign in");
    await expect(guestTab).toHaveText("Continue as Guest");
  });
});

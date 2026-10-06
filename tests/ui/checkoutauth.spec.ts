import { test, expect } from "../../page-objects/fixtures";


async function setupCartAndProceed(
  page: any,
  poManager: any,
  isLogged: boolean = false,
) {
  if (isLogged) {
   await poManager.authPage.navigate();
   await poManager.authPage.loginViaEmailAndPassword(
      process.env.TEST_EMAIL!,
      process.env.TEST_PASSWORD!
    );
  }
  await poManager.homePage.selectProduct();
  await page.locator('[data-test="add-to-cart"]').click();
  await page.locator('[data-test="nav-cart"]').click();
  await page.locator('[data-test="proceed-1"]').click();
}

test.describe("Checkout Navigation Permissions @smoke @regression", () => {
 
  test("should redirect guest user to Sign-In step upon clicking proceed to checkout", async ({
    page,
    poManager,
  }) => {
    await setupCartAndProceed(page, poManager, false);

    const signInTab = page.locator('a[href="#signin-tab"]');
    const guestTab = page.locator('a[href="#guest-tab"]');

    await expect(signInTab).toHaveText("Sign in");
    await expect(guestTab).toHaveText("Continue as Guest");
  });

});

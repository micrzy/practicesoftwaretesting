/// <reference types="node" />
import { test, expect } from "../page-objects/fixtures";

test.describe("Test API Mock", () => {
  test.beforeEach(async ({ poManager, page }) => {
    await poManager.homePage.selectProduct();

    const increaseBtn = page.locator('[data-test="increase-quantity"]');
    await expect(increaseBtn).toBeEnabled({ timeout: 10000 });
    await increaseBtn.click();
    await page.locator('[data-test="add-to-cart"]').click();
    await page.locator('[data-test="nav-cart"]').click();
    await page.locator('[data-test="proceed-1"]').click();

    await poManager.authPage.loginViaEmailAndPassword(
      process.env.TEST_EMAIL!,
      process.env.TEST_PASSWORD!,
    );

    await page.locator('[data-test="proceed-2"]').click();

    await expect(page.locator('[data-test="street"]')).not.toHaveValue("");
    await page.locator('[data-test="postal_code"]').fill("1234");
    await page.locator('[data-test="house_number"]').fill("12");
    await page.locator('[data-test="proceed-3"]').click();

    await page
      .locator('[data-test="payment-method"]')
      .selectOption({ label: "Cash on Delivery" });
  });
  test("before checkout, intercept API and mock 500 Internal Server Error", async ({
    page,
  }) => {
    // Step 4: Setup API Mock 500
    let isMockTrigger = false;
    await page.route("**/payment/check", async (route) => {
      isMockTrigger = true;
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ message: "Internal Server Error" }),
      });
    });
    await page.locator('[data-test="finish"]').click();

    await expect(page.locator(".alert-danger")).toHaveText("Unknown error");
    expect(isMockTrigger).toBeTruthy();
  });

  test.fixme("should disable checkout button when payment action repeat in low network condition", async ({
    page,
  }) => {
    let requestCount = 0;
    await page.route("**/payment/check", async (route) => {
      requestCount++;
      await new Promise((r) => setTimeout(r, 3000));
      await route.continue();
    });

    const finishBtn = page.locator('[data-test="finish"]');

    await Promise.all([
      finishBtn.click(),
      finishBtn.click(),
      finishBtn.click(),
    ]);

    await expect.soft(finishBtn).toBeDisabled();
    expect.soft(requestCount).toBe(1);
  });
});

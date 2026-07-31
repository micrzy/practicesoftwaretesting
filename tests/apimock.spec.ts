import { test, expect } from "../page-objects/fixtures";

test.describe("Test API Mock", () => {
  test("before checkout, intercept API and mock 500 Internal Server Error", async ({
    poManager,
    page,
    
  }) => {
 
    await poManager.homePage.selectFirstProduct();

    await page.locator('[data-test="increase-quantity"]').click();
    await page.locator('[data-test="add-to-cart"]').click();
    await page.locator('[data-test="nav-cart"]').click();

    await page.locator('[data-test="proceed-1"]').click();

    await poManager.loginPage.loginViaEmailAndPassword(
      "admin@practicesoftwaretesting.com",
      "welcome01",
    );

    await page.locator('[data-test="proceed-2"]').click();

    await expect(page.locator('[data-test="street"]')).not.toHaveValue("");
    await page.locator('[data-test="postal_code"]').fill("1234");
    await page.locator('[data-test="house_number"]').fill("12");
    await page.locator('[data-test="proceed-3"]').click();

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

    await page
      .locator('[data-test="payment-method"]')
      .selectOption({ label: "Cash on Delivery" });
    await page.locator('[data-test="finish"]').click();

    await expect(page.locator(".alert-danger")).toHaveText("Unknown error");
    expect(isMockTrigger).toBeTruthy();
  });
});

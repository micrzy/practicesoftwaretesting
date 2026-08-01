import { test, expect } from "../page-objects/fixtures.ts";

test.describe("Login tests", () => {
  test.beforeEach(async ({ poManager }) => {
    await poManager.loginPage.navigate();
  });
  test("Login failed", async ({ poManager }) => {
    await poManager.loginPage.loginViaEmailAndPassword(
      "wrong@user.com",
      "123456",
    );
    await expect(poManager.loginPage.errorAlert).toContainText(
      "Invalid email or password",
    );
  });
  test("Login successful", async ({ page, poManager }) => {
    await poManager.loginPage.loginViaEmailAndPassword(
      process.env.TEST_EMAIL!,
      process.env.TEST_PASSWORD!,
    );

    console.log("Current URL:", page.url());
   
    console.log("Email defined?:", !!process.env.TEST_EMAIL);


    await expect(page).toHaveURL(/\/account/);
    await page.locator('[data-test="nav-menu"]').waitFor({ state: "visible" });
    await expect(page.locator('[data-test="nav-menu"]')).toContainText("Jack", {
      timeout: 10000,
    });
  });
});

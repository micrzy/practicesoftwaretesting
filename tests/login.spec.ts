import { test, expect } from "../page-objects/fixtures.ts";

test.describe("Login tests", () => {
  test.beforeEach(async ({ poManager }) => {
    await poManager.authPage.navigate();
  });
  
  test("Login failed", async ({ poManager }) => {
    await poManager.authPage.loginViaEmailAndPassword(
      "wrong@user.com",
      "123456",
    );
    await expect(poManager.authPage.errorAlert).toContainText(
      "Invalid email or password",
    );
  });
  test("Login successful", async ({ page, poManager }) => {
    await poManager.authPage.loginViaEmailAndPassword(
      process.env.TEST_EMAIL!,
      process.env.TEST_PASSWORD!,
    );

    await expect(page).toHaveURL(/\/account/);
    
    await expect(page.locator('[data-test="nav-menu"]')).toContainText("Jack");
  });
});

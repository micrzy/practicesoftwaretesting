import { test, expect } from "../page-objects/fixtures.ts";

test.describe("Login tests", () => {
  test("Login failed", async ({ loginPage }) => {
    await loginPage.loginViaEmailAndPassword("wrong@user.com", "123456");
    await expect(loginPage.errorAlert).toContainText(
      "Invalid email or password",
    );
  });
  test("Login successful", async ({ page, loginPage }) => {
    await loginPage.loginViaEmailAndPassword(
      "admin@practicesoftwaretesting.com",
      "welcome01",
    );
    await expect(page).toHaveURL(/\/admin\/dashboard/);
    await expect(page.locator('[data-test="nav-menu"]')).toContainText(
      "John Doe",
    );
  });
});

import { test, expect } from "../../page-objects/fixtures";

test.describe("Cart Quantity Operation", () => {
  test("should recalculate line total and show alert when updating item quantity", async ({
    page,
    poManager,
  }) => {
    await poManager.homePage.selectProduct();
    await page.locator('[data-test="add-to-cart"]').click();
    await page.locator('[data-test="nav-cart"]').click();

    const rawPrice = await page
      .locator('[data-test="product-price"]')
      .textContent();
    const unitPrice = parseFloat(rawPrice!.replace("$", ""));

    await page.locator('[data-test="product-quantity"]').clear();
    await page.locator('[data-test="product-quantity"]').fill("3");
    await page.locator('[data-test="product-quantity"]').press("Enter");

    await expect(
      page.getByRole("alert").filter({ hasText: "Product quantity updated." }),
    ).toBeVisible();

    const expectedTotalText = `$${(unitPrice * 3).toFixed(2)}`; 
    await expect(page.locator('[data-test="cart-total"]')).toHaveText(
      expectedTotalText,
    );

    await expect(page.locator('[data-test="product-price"]')).toHaveText(
      rawPrice!,
    );

  });
});

import { test, expect } from "../../page-objects/fixtures";

test.describe("Cart Quantity Operation @smoke @regression", () => {
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

  test("should add a product to the cart and proceed to checkout @SCRUM-6", async ({
    page,
    poManager,
  }) => {
    const productName = "Combination Pliers";
    let unitPrice = "";

    await test.step("Navigate to Practice Software Testing", async () => {
      await poManager.navBar.navigate();
    });

    await test.step(`Click the ${productName} product card`, async () => {
      await poManager.homePage.productCard(productName).click();
    });

    await test.step("Verify the product details page loads with title, price, and description", async () => {
      await expect(poManager.productPage.name).toHaveText(productName);
      await expect(poManager.productPage.unitPrice).toBeVisible();
      await expect(poManager.productPage.description).toBeVisible();
      unitPrice = (await poManager.productPage.unitPrice.textContent())!.trim();
    });

    await test.step("Click Add to cart", async () => {
      await poManager.productPage.addToCartButton.click();
      await expect(poManager.navBar.cartQuantity).toHaveText("1");
    });

    await test.step("Click the Shopping Cart icon", async () => {
      await poManager.navBar.cartLink.click();
    });

    await test.step("Verify the item is listed in the cart with correct price and quantity", async () => {
      await expect(poManager.cartPage.productTitle).toHaveText(productName);
      await expect(poManager.cartPage.productPrice).toHaveText(`$${unitPrice}`);
      await expect(poManager.cartPage.productQuantity).toHaveValue("1");
      await expect(poManager.cartPage.cartTotal).toHaveText(`$${unitPrice}`);
    });

    await test.step("Click Proceed to checkout", async () => {
      await poManager.cartPage.proceedToCheckoutButton.click();
      await expect(page).toHaveURL(/\/checkout$/);
      await expect(poManager.cartPage.loginSubmit).toBeVisible();
    });
  });
});

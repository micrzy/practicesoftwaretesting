import { test, expect } from "../../page-objects/fixtures";

test.describe("Multi-Tab Navigation", () => {
  test("should open external Unsplash link in a new tab and keep current product page open", async ({page,poManager}) => {

    await poManager.homePage.selectProduct()

    const hrefElement = page.locator(".figure-caption").locator('[target="_blank"]').first()

    const results= await Promise.all([
        page.waitForEvent('popup'),
        hrefElement.click()
    ])
    
    const newPage = results[0]
    expect(newPage.url()).toContain('unsplash.com');
    await newPage.close();
    expect(page.url()).toContain('/product');
  });
});

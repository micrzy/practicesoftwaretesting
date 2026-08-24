import { test, expect } from "../page-objects/fixtures";
import searchData from "../test-data/product.json";

test.describe("Data-Driven Search Tests", () => {
  for (const data of searchData) {
    test(`[Search] Query: "${data.keyword}" -> Should contain "${data.expectedItem}" and match all results`, async ({
      page,
    }) => {
      await page.goto("/");

      const searchInput = page.locator('[data-test="search-query"]');
      
      await searchInput.fill(data.keyword);

      const responsePromise = page.waitForResponse((response) =>
        response.url().includes("/products/search") && response.status() === 200
      );
      await page.locator('[data-test="search-submit"]').click();

      await responsePromise;

      const productTitle = page.locator(".card-title");
      await expect(
        productTitle.getByText(data.expectedItem, { exact: true }),
      ).toBeVisible();

      const titles = await productTitle.allTextContents();
      expect(titles.length).toBeGreaterThan(0);
      for (const title of titles) {
        expect(title.toLowerCase()).toContain(data.keyword.toLowerCase());
      }
    });
  }
});

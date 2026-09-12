import { test, expect } from "../../page-objects/fixtures";
import i18nData from "../../test-data/i18n-labels.json";

test.describe("UI Localization & i18n Test", () => {
  for (const lang of ["DE", "NL"] as const) {
    test(`should display correct UI lables when switched to ${lang}`, async ({
      page,
    }) => {
      const expected = i18nData[lang];

      await page.goto("/");
      await page.locator('[data-test="language-select"]').click();
      await page.getByRole("menuitem", { name: `${lang}` }).click();

      // Nav Bar
      const navBar = page.locator('#navbarSupportedContent');
      await expect(navBar).toContainText(expected.nav.home);
      await expect(navBar).toContainText(expected.nav.categories);
      await expect(navBar).toContainText(expected.nav.contact);
      await expect(navBar).toContainText(expected.nav.signIn);

      // Sidebar
      const sidebar = page.locator("#filters");
      await expect(sidebar).toContainText(expected.sidebar.sort);
      await expect(sidebar).toContainText(expected.sidebar.priceRange);
      await expect(sidebar).toContainText(expected.sidebar.search);
      await expect(sidebar).toContainText(expected.sidebar.byCategory);
      await expect(sidebar).toContainText(expected.sidebar.filter);
    });
  }
});

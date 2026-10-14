import { Page, Locator } from "@playwright/test";

export class CategoryPage {
  readonly pageTitle: Locator;

  constructor(readonly page: Page) {
    this.pageTitle = this.page.locator('[data-test="page-title"]');
  }
}

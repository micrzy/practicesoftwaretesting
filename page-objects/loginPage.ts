import { Page } from "@playwright/test";

export class LoginPage {
  constructor(readonly page: Page) {}

  async navigate() {
    await this.page.goto("/");

    console.log("number 1" + " " + this.page.url());

    await this.page.waitForLoadState("networkidle");
    await this.page.locator('[data-test="nav-sign-in"]').click();
  }

  async loginViaEmailAndPassword(email: string, password: string) {
    await this.page.locator('[data-test="email"]').fill(email);
    await this.page.locator('[data-test="password"]').fill(password);
    await this.page.locator('[data-test="login-submit"]').click();
  }

  get errorAlert() {
    return this.page.locator('[data-test="login-error"]');
  }
}

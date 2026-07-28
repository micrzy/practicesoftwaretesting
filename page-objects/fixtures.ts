import { test as base, Page } from "@playwright/test";
import { LoginPage } from "../page-objects/loginPage";
import { FilterSlideBarComponent } from "../components/FilterSlideBarComponent";

type Myfixture = {
  loginPage: LoginPage;
  filterSlideBarComponent: FilterSlideBarComponent;
};
export const test = base.extend<Myfixture>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await use(loginPage);
  },
  filterSlideBarComponent: async ({ page }, use) => {
    const filterSlideBarComponent = new FilterSlideBarComponent(page);
    await page.goto("/");
    await use(filterSlideBarComponent);
  },
});

export { expect } from "@playwright/test";

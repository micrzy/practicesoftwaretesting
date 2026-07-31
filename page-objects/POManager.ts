import {Page} from "@playwright/test"
import { LoginPage } from "./loginPage"
import { HomePage } from "./homepage"
import { FilterSlideBarComponent } from "../components/FilterSlideBarComponent"

export class POManager {
  readonly page: Page;
  readonly loginPage: LoginPage;
  readonly homePage: HomePage;
  readonly filterSlideBar: FilterSlideBarComponent;

  constructor(page: Page) {
    this.page = page;
    this.loginPage = new LoginPage(page);
    this.homePage = new HomePage(page);
    this.filterSlideBar = new FilterSlideBarComponent(page);
  }
}
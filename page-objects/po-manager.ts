import {Page} from "@playwright/test"
import { AuthPage } from "./auth-page"
import { HomePage } from "./home-page"
import { FilterSlideBarComponent } from "../components/filterslidebar-component"
import { ContactPage } from "./contact-page"
import { UserProfile } from "./user-profile.page"

export class POManager {
  readonly page: Page;
  readonly authPage: AuthPage;
  readonly homePage: HomePage;
  readonly filterSlideBar: FilterSlideBarComponent;
  readonly contactPage: ContactPage;
  readonly userProfile: UserProfile

  constructor(page: Page) {
    this.page = page;
    this.authPage = new AuthPage(page);
    this.homePage = new HomePage(page);
    this.filterSlideBar = new FilterSlideBarComponent(page);
    this.contactPage = new ContactPage(page)
    this.userProfile = new UserProfile(page)
  }
}
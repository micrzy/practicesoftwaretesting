import {Page} from "@playwright/test"
import { AuthPage } from "./auth-page"
import { HomePage } from "./home-page"
import { FilterSlideBarComponent } from "../components/filterslidebar-component"
import { NavBarComponent } from "../components/navbar-component"
import { ContactPage } from "./contact-page"
import { UserProfile } from "./user-profile.page"
import { CategoryPage } from "./category-page"
import { ProductPage } from "./product-page"
import { CartPage } from "./cart-page"

export class POManager {
  readonly page: Page;
  readonly authPage: AuthPage;
  readonly homePage: HomePage;
  readonly filterSlideBar: FilterSlideBarComponent;
  readonly navBar: NavBarComponent;
  readonly contactPage: ContactPage;
  readonly userProfile: UserProfile
  readonly categoryPage: CategoryPage
  readonly productPage: ProductPage
  readonly cartPage: CartPage

  constructor(page: Page) {
    this.page = page;
    this.authPage = new AuthPage(page);
    this.homePage = new HomePage(page);
    this.filterSlideBar = new FilterSlideBarComponent(page);
    this.navBar = new NavBarComponent(page);
    this.contactPage = new ContactPage(page)
    this.userProfile = new UserProfile(page)
    this.categoryPage = new CategoryPage(page)
    this.productPage = new ProductPage(page)
    this.cartPage = new CartPage(page)
  }
}
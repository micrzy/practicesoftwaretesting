import {Page,Locator} from "@playwright/test"

/**
 * Represents the top navigation bar, including the "Categories" dropdown.
 */

export class NavBarComponent{

     readonly categoriesToggle:Locator;
     readonly categoriesMenu:Locator;
     readonly contactLink:Locator;
     readonly cartLink:Locator;
     readonly cartQuantity:Locator;

    constructor(readonly page:Page){
       this.categoriesToggle = this.page.locator('[data-test="nav-categories"]')
       this.categoriesMenu = this.page.locator('[data-test="nav-categories"] + .dropdown-menu')
       this.contactLink = this.page.locator('[data-test="nav-contact"]')
       this.cartLink = this.page.locator('[data-test="nav-cart"]')
       this.cartQuantity = this.page.locator('[data-test="cart-quantity"]')
    }

     async navigate(){
        await this.page.goto('/')
    }

    categoryLink(categoryName:string):Locator{
        const slug = categoryName.toLowerCase().replace(/\s+/g, '-')
        return this.page.locator(`[data-test="nav-${slug}"]`)
    }

    // --- Categories Dropdown ---
    async openCategories(){
        await this.categoriesToggle.hover()
        await this.categoriesToggle.click()
    }

    async selectCategory(categoryName:string){
        const link = this.categoryLink(categoryName)
        await link.hover()
        await link.click()
    }
}

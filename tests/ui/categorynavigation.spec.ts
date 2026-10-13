import {test, expect} from "../../page-objects/fixtures"

const categories = ['Hand Tools', 'Power Tools', 'Other', 'Special Tools']

test.describe("Categories Dropdown Navigation @SCRUM-2 @smoke @regression",()=>{
    test("should navigate to Power Tools via categories dropdown",async({poManager,page,pageErrors})=>{

        await test.step("Navigate to the home page", async()=>{
            await poManager.navBar.navigate()
        })

        await test.step("Locate the Categories dropdown in the navigation bar", async()=>{
            await poManager.navBar.categoriesToggle.waitFor()
        })

        await test.step("Open the Categories dropdown", async()=>{
            await poManager.navBar.openCategories()
            await expect(poManager.navBar.categoriesMenu).toBeVisible()
            for(const category of categories){
                await expect(poManager.navBar.categoriesMenu.getByRole('link', {name: category, exact: true})).toBeVisible()
            }
        })

        await test.step("Click Power Tools", async()=>{
            const categoryProductsResponse = page.waitForResponse((response) =>
                response.url().includes('/products') && (response.request().postData() ?? '').includes('by_category'))
            await poManager.navBar.selectCategory('Power Tools')
            await categoryProductsResponse
            await expect(page).toHaveURL(/\/category\/power-tools$/)
        })

        await test.step("Verify the page loads without errors", async()=>{
            expect(pageErrors, pageErrors.join('\n')).toEqual([])
        })
    })
})

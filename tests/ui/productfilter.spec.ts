import {test, expect} from "../../page-objects/fixtures"     

test.describe("Product Filter @regression",()=>{
    test("verify filted product via API response interception",async({poManager,page})=>{

        await poManager.filterSlideBar.navigate()
        
        await poManager.filterSlideBar.checkOption('Hand Tools')
        
        const brandResponsePromise = page.waitForResponse((response) => {
            return response.url().includes("/products") && response.request().method() === "QUERY"&&(response.request().postData() ?? "").includes("by_brand")
        })
        
        await poManager.filterSlideBar.checkOption('ForgeFlex Tools')

        const brandResponse = await brandResponsePromise
        const body = await brandResponse.json()
        const products = body?.data

        expect(products.length).toBeGreaterThan(0)
        for(const product of products){
            expect(product.brand.name).toBe('ForgeFlex Tools')
        }  
    })
    
})
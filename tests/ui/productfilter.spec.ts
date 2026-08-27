import {test, expect} from "../../page-objects/fixtures"     

test.describe("Product Filter",()=>{
    test("verify filted product via API response interception",async({poManager,page})=>{

        await poManager.filterSlideBar.navigate()

        let latestProducts: any[] = []

        page.on("response",async(response)=>{
            if(response.url().includes("/products")&&response.request().method()==="QUERY"){
                 try{ 
                    const body = await response.json()
                 if(body?.data){
                    latestProducts = body.data

                 }
                 }catch(e){

                 }
            }
        })
        await poManager.filterSlideBar.checkOption('Hand Tools')
        await poManager.filterSlideBar.checkOption('ForgeFlex Tools')

        await page.waitForTimeout(1500)
        expect(latestProducts.length).toBeGreaterThan(0)
        for(const product of latestProducts){
            expect(product.brand.name).toBe('ForgeFlex Tools')
        }  
    })
    
})
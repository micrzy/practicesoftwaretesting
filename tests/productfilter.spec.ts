import {test, expect} from "../page-objects/fixtures"     

test.describe("Product Filter",()=>{
    test("verify filted product via API response interception",async({filterSlideBarComponent,page})=>{

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
        await filterSlideBarComponent.checkOption('Hand Tools')
        await filterSlideBarComponent.checkOption('ForgeFlex Tools')

        await page.waitForTimeout(1500)
        expect(latestProducts.length).toBeGreaterThan(0)
        for(const product of latestProducts){
            expect(product.brand.name).toBe('ForgeFlex Tools')
        }  
    })
    
})
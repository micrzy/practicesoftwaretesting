import {test,expect} from "../page-objects/fixtures"


test("homepage screenshot should match baseline image", async({page})=>{
    await page.goto('/')
    await page.waitForLoadState("networkidle");

   await expect(page).toHaveScreenshot("homepage-baseline.png", {
    maxDiffPixelRatio: 0.05
  });
   

})
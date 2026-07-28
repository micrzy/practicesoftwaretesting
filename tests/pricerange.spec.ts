import { test, expect } from "../page-objects/fixtures";

test.describe("Test Price Range Slide", () => {
  test("slide max price to 30, make sure price for all products presented on page are lower or equal than 30 ", async ({
    filterSlideBarComponent,
    page,
  }) => {
    const responsePromise = page.waitForResponse(async(response)=>{
      const isTargetUrl =
        response.url().includes("/products") &&
        response.request().method() === "QUERY";
      if (!isTargetUrl) return false;

      try {
        const body = await response.json();
        const products = body?.data||[];

        return (
            products.length > 0 &&
            products.every((product:any) => product.price <= 30)
        )
        
      } catch {
        return false;
      }
    });
    await filterSlideBarComponent.setMaxPrice(30);
    const response = await responsePromise
    expect(response.status()).toBe(200)

  });
});

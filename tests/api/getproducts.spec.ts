import { test, expect } from "../../page-objects/fixtures";
import { API_URL } from "../../utils/env";
import { productSchema } from "../../tests/api/schemas/product.schema"; 
import { z } from "zod";

test.describe("Get Products info from API @smoke @regression", () => {
  test("should get products list", async ({ request }) => {
    const response = await request.fetch(
      `${API_URL}/products`,
      {
        method:"QUERY",
        data: {
          page: "1",
          is_rental: "false",
        },
      },
    );

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    const products = responseBody.data

    const result = productSchema.array().safeParse(products);
    expect(result.success,result.error && z.prettifyError(result.error)).toBe(true);

   
   });

   test("should get products list in price 5 to 130", async ({ request }) => {
    const response = await request.fetch(
      `${API_URL}/products`,
      {
        method:"QUERY",
        data: {
          page: "2",
          between: "price,5,130",
          is_rental: "false",
        },
      },
    );

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    const products = responseBody.data
    
    for(const product of products){
      
      expect(product.price).toBeGreaterThan(5)
      expect(product.price).toBeLessThan(130)
    }
    

   });
});

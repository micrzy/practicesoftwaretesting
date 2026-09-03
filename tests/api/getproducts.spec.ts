import { test, expect } from "../../page-objects/fixtures";

test.describe("Get Products info from API", () => {
  test("should get products list", async ({ request }) => {
    const response = await request.fetch(
      "https://api.practicesoftwaretesting.com/products",
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
    const firstProduct = products[0]

    expect(firstProduct).toHaveProperty('id')
    expect(firstProduct).toHaveProperty('name')
    expect(firstProduct).toHaveProperty('category')
    expect(typeof firstProduct.price).toBe('number')

  //   const products = Array.isArray(responseBody)? responseBody: responseBody.data;
  //   products.forEach((product: any) => {
  //     expect(product).toEqual(
  //       expect.objectContaining({
  //         id: expect.anything(),
  //         name: expect.anything(),
  //         price: expect.any(Number),
  //         category: expect.anything(),
  //       }),
  //     );
  //   });
   });

   test("should get products list in price 5 to 130", async ({ request }) => {
    const response = await request.fetch(
      "https://api.practicesoftwaretesting.com/products",
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

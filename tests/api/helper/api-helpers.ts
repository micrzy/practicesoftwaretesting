import { APIRequestContext } from "@playwright/test";

/**
 * Dynamically retrieve valid product ID
 */
export async function getThirdProductId(request: APIRequestContext): Promise<string> {
  const queryProductsResponse = await request.fetch(
    "https://api.practicesoftwaretesting.com/products",
    {
      method: "QUERY",
      data: {
        page: 1,
        is_rental: false,
      },
    }
  );

  const queryProductsResponseBody = await queryProductsResponse.json();
  const thirdProduct = queryProductsResponseBody.data[2];
  
  return thirdProduct.id;
}
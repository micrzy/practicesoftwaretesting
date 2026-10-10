import { API_URL } from "./env";
import { APIRequestContext, expect } from "@playwright/test";

/**
 * Dynamically retrieve valid product ID
 */
export async function getThirdProductId(
  request: APIRequestContext,
): Promise<string> {
  const queryProductsResponse = await request.fetch(`${API_URL}/products`, {
    method: "QUERY",
    data: {
      page: 1,
      is_rental: false,
    },
  });

  const queryProductsResponseBody = await queryProductsResponse.json();
  const thirdProduct = queryProductsResponseBody.data[2];

  return thirdProduct.id;
}

export async function createCartWithProduct(
  request: APIRequestContext,
  quantity = 1,
): Promise<string> {
  const cartResponse = await request.post(`${API_URL}/carts`);

  expect(cartResponse.status()).toBe(201);

  const cartResponseBody = await cartResponse.json();
  const cartId = cartResponseBody.id;
  const productId = await getThirdProductId(request);

  const updateCartResponse = await request.post(`${API_URL}/carts/${cartId}`, {
    data: {
      product_id: productId,
      quantity: quantity,
    },
  });
  expect(updateCartResponse.status()).toBe(200);
  return cartId;
}

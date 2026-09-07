import { test, expect } from "../../page-objects/fixtures";
import { getThirdProductId } from "./helper/api-helpers";

test.describe("Favorites API Management", () => {
  test("should complete favorites lifecycle: add, verify, and delete", async ({
    request,
    apiToken,
  }) => {
    const productId = await getThirdProductId(request);

    const response = await request.post(
      "https://api.practicesoftwaretesting.com/favorites",
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
        data: {
          product_id: productId,
        },
      },
    );

    expect(response.status()).toBe(201);

    const getFavoriteResponse = await request.get(
      "https://api.practicesoftwaretesting.com/favorites",
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      },
    );

    const getFavoriteBody = await getFavoriteResponse.json();
    const products = Array.isArray(getFavoriteBody)
      ? getFavoriteBody
      : getFavoriteBody.data;

   const targetFavorite = products.find(
      (item) => item.product_id === productId,
    );

    expect(targetFavorite).toBeDefined();

    const favoriteId = targetFavorite.id;

    //  DELETE product from favorite list
    const deleteResponse = await request.delete(
      `https://api.practicesoftwaretesting.com/favorites/${favoriteId}`,
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      },
    );

    expect(deleteResponse.status()).toBe(204)
  });
});

/// <reference types="node" />
import { test, expect } from "../../page-objects/fixtures";

test.describe("User Auth API Test", () => {
  test("should return 401 when accessing without token", async ({
    request,
  }) => {
    const response = await request.get(
      "https://api.practicesoftwaretesting.com/favorites",
    );
    expect(response.status()).toBe(401);
  });

  test("should return 200 and user profile when accessing with valid token", async ({
    request,
  }) => {
    const login_response = await request.post(
      "https://api.practicesoftwaretesting.com/users/login",

      {
        data: {
          email: process.env.TEST_EMAIL!,

          password: process.env.TEST_PASSWORD!,
        },
      },
    );

    const responseBody = await login_response.json();
    const access_token = responseBody.access_token;

    const response = await request.get(
      "https://api.practicesoftwaretesting.com/favorites",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    expect(response.status()).toBe(200);
  });
});

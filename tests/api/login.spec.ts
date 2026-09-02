/// <reference types="node" />
import { APIRequestContext } from "@playwright/test";
import { test, expect } from "../../page-objects/fixtures";

test.describe("Login Function API test", () => {
  async function APILogin(
    email: string,
    password: string,
    request: APIRequestContext,
  ) {
    const response = await request.post(
      "https://api.practicesoftwaretesting.com/users/login",
      {
        data: {
          email: email,
          password: password,
        },
      },
    );
    return response;
  }
  test("should get response 200 and response body contain access_token when email and password are valid", async ({
    request,
  }) => {
    const response = await APILogin(
      process.env.TEST_EMAIL!,
      process.env.TEST_PASSWORD!,
      request,
    );
    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    expect(responseBody).toHaveProperty("access_token");
  });

  test("should get response 401 when email or password is invalid", async ({
    request,
  }) => {
    const response = await APILogin("test@test.com", "test12345", request);
    expect(response.status()).toBe(401);

    const responseBody = await response.json();
    expect(responseBody.message || responseBody.error).toBe("Unauthorized");
  });
});

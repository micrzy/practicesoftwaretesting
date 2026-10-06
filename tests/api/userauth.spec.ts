/// <reference types="node" />
import { test, expect } from "../../page-objects/fixtures";
import { API_URL } from "../../utils/env";

test.describe("User Auth API Test", () => {
  test("should return 401 when accessing without token", async ({
    request,
  }) => {
    const response = await request.get(
      `${API_URL}/favorites`,
    );
    expect(response.status()).toBe(401);
  });

  test("should return 200 and user profile when accessing with valid token", async ({
    request,apiToken
  }) => {

    const response = await request.get(
      `${API_URL}/favorites`,
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      },
    );
    expect(response.status()).toBe(200);
  });
});

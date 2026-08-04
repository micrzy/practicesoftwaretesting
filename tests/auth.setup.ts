/// <reference types="node" />
import { test as setup, expect } from "@playwright/test";

const authFile = "./.auth/user.json";

setup("authentication", async ({ request, page }) => {
  const response = await request.post(
    "https://api.practicesoftwaretesting.com/users/login",

    {
      data: {
        email: process.env.TEST_EMAIL!,

        password: process.env.TEST_PASSWORD!,
      },
    },
  );

  expect(response.status()).toBe(200);

  const responseBody = await response.json();

  const accessToken = responseBody.access_token;

  await page.goto("/");

  await page.evaluate((token) => {
    window.localStorage.setItem("auth-token", token);
  }, accessToken);

  await page.context().storageState({ path: authFile });
});

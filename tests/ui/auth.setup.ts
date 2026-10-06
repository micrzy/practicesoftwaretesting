/// <reference types="node" />
import { test as setup, expect } from "@playwright/test";
import { API_URL } from "../../utils/env";

const authFile = "./.auth/user.json";

setup("authentication", async ({ request, page }) => {
  const response = await request.post(
    `${API_URL}/users/login`,

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

  process.env.TEST_TOKEN = accessToken;

  await page.goto("/");

  await page.evaluate((token) => {
    window.localStorage.setItem("auth-token", token);
  }, accessToken);

  await page.context().storageState({ path: authFile });
});

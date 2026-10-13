/// <reference types="node" />
import { test as base, Page } from "@playwright/test";
import { POManager } from "./po-manager";
import { API_URL } from "../utils/env";


export const test = base.extend< {poManager: POManager;apiToken: string;pageErrors: string[]}>({
  poManager: async ({ page }, use) => {

    await use(new POManager(page));
  },

  // Collects uncaught page errors, failed requests and HTTP error responses
  pageErrors: async ({ page }, use) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
    page.on("requestfailed", (request) =>
      errors.push(`requestfailed: ${request.url()} -> ${request.failure()?.errorText}`)
    );
    page.on("response", (response) => {
      // The anonymous auth check (GET /users/me -> 401) is expected for guests
      const expectedAuthCheck = response.status() === 401 && response.url().endsWith("/users/me");
      if (response.status() >= 400 && !expectedAuthCheck) {
        errors.push(`response: ${response.url()} -> ${response.status()}`);
      }
    });
    await use(errors);
  },
  
  apiToken: async ({ request }, use) => {
    const loginResponse = await request.post(
      `${API_URL}/users/login`,
      {
        data: {
          email: process.env.TEST_EMAIL!,
          password: process.env.TEST_PASSWORD!,
        },
      }
    );

    const responseBody = await loginResponse.json();
    await use(responseBody.access_token);
  },
});
  

export { expect } from "@playwright/test";


/// <reference types="node" />
import { test as base, Page } from "@playwright/test";
import { POManager } from "./po-manager";


export const test = base.extend< {poManager: POManager;apiToken: string}>({
  poManager: async ({ page }, use) => {
   
    await use(new POManager(page));
  },
  
  apiToken: async ({ request }, use) => {
    const loginResponse = await request.post(
      "https://api.practicesoftwaretesting.com/users/login",
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


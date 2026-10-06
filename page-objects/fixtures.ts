/// <reference types="node" />
import { test as base, Page } from "@playwright/test";
import { POManager } from "./po-manager";
import { API_URL } from "../utils/env";


export const test = base.extend< {poManager: POManager;apiToken: string}>({
  poManager: async ({ page }, use) => {
   
    await use(new POManager(page));
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


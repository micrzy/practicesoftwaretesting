import { test as base, Page } from "@playwright/test";
import { POManager } from "./po-manager";


export const test = base.extend< {poManager: POManager}>({
  poManager: async ({ page }, use) => {
   
    await use(new POManager(page));
  }
  
});

export { expect } from "@playwright/test";

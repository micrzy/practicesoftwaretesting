/// <reference types="node" />
import { test as setup } from "../page-objects/fixtures";

const authFile = "./.auth/user.json";

setup("authentication", async ({ page,poManager  }) => {
  const email = process.env.TEST_EMAIL!;
  const password = process.env.TEST_PASSWORD!;
  await poManager.loginPage.navigate()
  await poManager.loginPage.loginViaEmailAndPassword(email, password);

  await page.waitForURL("**/admin/dashboard");

  await page.context().storageState({ path: authFile });
});

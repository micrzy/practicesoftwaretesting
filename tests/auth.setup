/// <reference types="node" />
import { test as setup } from "../page-objects/fixtures";

const authFile = "./.auth/user.json";

setup("authentication", async ({ page,poManager  }) => {
  const email = process.env.TEST_EMAIL!;
  const password = process.env.TEST_PASSWORD!;
  await poManager.authPage.navigate()
  await poManager.authPage.loginViaEmailAndPassword(email, password);

  await page.waitForURL(/\/account/);

  await page.context().storageState({ path: authFile });
});

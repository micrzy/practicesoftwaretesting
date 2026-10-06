/// <reference types="node" />
import { test, expect } from "../../page-objects/fixtures";
import fs from "fs";

test.describe("invoices testing", () => {
  test("should successfully download invoice by click detail button with a login account", async ({
    page,
    poManager,
  }) => {
    await poManager.userProfile.goToInvoicesPage();
    const invoiceNumber = await poManager.userProfile.getFirstInvoiceNumber();

    const downloadPromise = page.waitForEvent("download");
    await poManager.userProfile.downloadInvoiceByNumber(invoiceNumber);
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toMatch(/\.pdf$/);

    // Save into this test's output folder instead of the repo
    const filePath = test.info().outputPath(download.suggestedFilename());
    await download.saveAs(filePath);

    expect(fs.statSync(filePath).size).toBeGreaterThan(0);
  });
});

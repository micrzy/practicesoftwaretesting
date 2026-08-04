/// <reference types="node" />
import { test, expect } from "../page-objects/fixtures";
import path from "path";
import fs from "fs";

test.describe("invoices testing", () => {
  test("should successfully download invoice by click detail button with a login account", async ({
    page,
    poManager,
  }) => {
    await poManager.userProfile.goToInvoicesPage();

    const downloadPromise = page.waitForEvent("download");

    await poManager.userProfile.downloadInvoiceByNumber("INV-20260000024");

    const download = await downloadPromise;

    const fileName =
      download.suggestedFilename() || "invoice-INV-20260000024.pdf";

    const dirPath = path.join(__dirname, "fixtures");
    const filePath = path.join(dirPath, fileName);

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // try {
      await download.saveAs(filePath);

      expect(download.suggestedFilename()).toContain(".pdf");
      const fileStats = fs.statSync(filePath);

      expect(fileStats.size).toBeGreaterThan(0);
    // } finally {
    //   if (fs.existsSync(filePath)) {
    //     fs.unlinkSync(filePath);
    //   }
    // }
  });
});

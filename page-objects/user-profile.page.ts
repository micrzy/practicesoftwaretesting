import { Page, expect } from "@playwright/test";

export class UserProfile {
  constructor(readonly page: Page) {}

  async goToInvoicesPage() {
    await this.page.goto('/account/invoices')
  }

  async getFirstInvoiceNumber(): Promise<string> {
    const firstRow = this.page.getByRole('row').filter({ hasText: /INV-\d+/ }).first();
    const rowText = await firstRow.textContent();
    return rowText!.match(/INV-\d+/)![0];
  }

  async downloadInvoiceByNumber(invoiceNumber: string) {
    const row = this.page.locator('tr', { hasText: invoiceNumber });
    await row.locator('a', { hasText: 'Details' }).click()
    const downloadButton = this.page.getByRole('button', { name: 'Download PDF' });
    // The button stays disabled until the backend queue has generated the PDF
    await expect(downloadButton, `PDF for ${invoiceNumber} not generated yet`).toBeEnabled();
    await downloadButton.click()
  }

  //async updateProfile() {}
}

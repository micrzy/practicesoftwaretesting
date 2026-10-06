import { Page } from "@playwright/test";

export class UserProfile {
  constructor(readonly page: Page) {}

  async goToInvoicesPage() {
    await this.page.goto('/account/invoices')
  }

 async downloadInvoiceByNumber(invoiceNumber: string) {
  const row = this.page.locator('tr', { hasText: invoiceNumber });
  await row.locator('a', { hasText: 'Details' }).click()
  await this.page.getByRole('button',{ name:'Download PDF'}).click()  
}

  //async updateProfile() {}
}

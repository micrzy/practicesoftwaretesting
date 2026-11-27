/// <reference types="node" />
import { test, expect } from "../../page-objects/fixtures";
import { API_URL } from "../../utils/env";
import { loginViaApi } from "../../utils/api-helpers";

test.describe("Invoice access between customers API @SCRUM-8 @regression", () => {
  let tokenA: string;
  let tokenB: string;
  let invoiceId: string;
  let invoiceNumber: string;

  test.beforeEach(async ({ request }) => {
    await test.step("Log in via API as customer A and get the id of one of A's invoices from GET /invoices", async () => {
      tokenA = await loginViaApi(request, process.env.TEST_EMAIL!, process.env.TEST_PASSWORD!);

      const invoicesResponse = await request.get(`${API_URL}/invoices`, {
        headers: { Authorization: `Bearer ${tokenA}` },
      });
      expect(invoicesResponse.status()).toBe(200);

      const invoices = (await invoicesResponse.json()).data;
      expect(invoices.length, "customer A needs at least one invoice").toBeGreaterThan(0);
      invoiceId = invoices[0].id;
      invoiceNumber = invoices[0].invoice_number;
    });

    await test.step("Log in via API as customer B", async () => {
      tokenB = await loginViaApi(request, process.env.TEST_EMAIL1!, process.env.TEST_PASSWORD1!);
    });
  });

  test("customer B cannot read customer A's invoice", async ({ request }) => {
    await test.step("As customer B, send GET /invoices/{A's invoice id}", async () => {
      const response = await request.get(`${API_URL}/invoices/${invoiceId}`, {
        headers: { Authorization: `Bearer ${tokenB}` },
      });

      expect([403, 404]).toContain(response.status());
      expect(await response.text()).not.toContain(invoiceNumber);
    });
  });

  test("customer B cannot download customer A's invoice PDF", async ({ request }) => {
    await test.step("As customer B, send GET /invoices/{A's invoice id}/download-pdf", async () => {
      const response = await request.get(`${API_URL}/invoices/${invoiceId}/download-pdf`, {
        headers: { Authorization: `Bearer ${tokenB}` },
      });

      expect([403, 404]).toContain(response.status());
      expect(response.headers()["content-type"] ?? "").not.toContain("application/pdf");
    });
  });

  test("customer B's invoice list does not contain customer A's invoice", async ({ request }) => {
    await test.step("As customer B, send GET /invoices", async () => {
      const response = await request.get(`${API_URL}/invoices`, {
        headers: { Authorization: `Bearer ${tokenB}` },
      });

      const body = await response.text();
      expect(body).not.toContain(invoiceId);
      expect(body).not.toContain(invoiceNumber);
    });
  });

  test("customer A can read their own invoice", async ({ request }) => {
    await test.step("As customer A, send GET /invoices/{A's invoice id}", async () => {
      const response = await request.get(`${API_URL}/invoices/${invoiceId}`, {
        headers: { Authorization: `Bearer ${tokenA}` },
      });

      expect(response.status()).toBe(200);
      expect((await response.json()).invoice_number).toBe(invoiceNumber);
    });
  });
});

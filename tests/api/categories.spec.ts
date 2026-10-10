import { test, expect } from "../../page-objects/fixtures";
import { API_URL } from "../../utils/env";
import { categorySchema } from "../../tests/api/schemas/category.schema"; 
import { z } from "zod";

test.describe("Get Categories info from API @smoke @regression", () => {
    test("should get categories list", async ({ request }) => {
    const response = await request.get(`${API_URL}/categories`);
    expect(response.status()).toBe(200);
        
    const categories = await response.json();
    const result = categorySchema.array().safeParse(categories);
        
    expect(result.success, result.error && z.prettifyError(result.error)).toBe(true);
    });
});
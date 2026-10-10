import { test, expect } from "../../page-objects/fixtures";
import { API_URL } from "../../utils/env";
import { brandSchema } from "../../tests/api/schemas/brand.schema"; 
import { error404Schema, error422Schema } from "../../tests/api/schemas/error.schema";
import { z } from "zod";

test.describe("Get Brands info from API @smoke @regression", () => {
    test("should get brands list", async ({ request }) => {
    const response = await request.get(`${API_URL}/brands`);
    expect(response.status()).toBe(200);
    
    const brands = await response.json();
    const result = brandSchema.array().safeParse(brands);

    expect(result.success,result.error && z.prettifyError(result.error)).toBe(true);
   
    });
  test("should return 404 for non-existing brand", async ({ request }) => {
    const response = await request.get(`${API_URL}/brands/non-existing-brand`);
    expect(response.status()).toBe(404);
    const errorResponse = await response.json(); 
    const result = error404Schema.safeParse(errorResponse);
    expect(result.success,result.error && z.prettifyError(result.error)).toBe(true);
    expect(errorResponse.message).toBe("Requested item not found");
  });

 test("should return 422 for empty field entry", async ({ request }) => {
   const response = await request.post(`${API_URL}/brands`, {data: {}});
   expect(response.status()).toBe(422);
   const errorResponse = await response.json(); 
   
   const result = error422Schema.safeParse(errorResponse);
   expect(result.success,result.error && z.prettifyError(result.error)).toBe(true);
   expect(errorResponse.name[0]).toBe("The name field is required.");
   expect(errorResponse.slug[0]).toBe("The slug field is required.");
 });
});
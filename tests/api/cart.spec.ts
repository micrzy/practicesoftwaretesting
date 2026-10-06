import { test, expect } from "../../page-objects/fixtures";
import {getThirdProductId} from "./helper/api-helpers"
import { API_URL } from "../../utils/env";

test.describe("Shopping Cart Management @regression",()=>{
    test("should complete shopping cart lifecycle: create, add item, and verify",async({request})=>{

        const cartResponse = await request.post(`${API_URL}/carts`)
        expect(cartResponse.status()).toBe(201)

        const cartResponseBody = await cartResponse.json()
        let cartId = cartResponseBody.id
         const productId = await getThirdProductId(request)

        const updateCartResponse = await request.post(
            `${API_URL}/carts/${cartId}`,
            {
                data:
                {
                    product_id: productId, 
                    quantity: 4
                }
            } 
        
        )
        expect(updateCartResponse.status()).toBe(200)

        const getCartInfoResponse = await request.get(`${API_URL}/carts/${cartId}`)
        expect(getCartInfoResponse.status()).toBe(200)

        const getCartInfoResponseBody = await getCartInfoResponse.json()
        const firstCartItem = getCartInfoResponseBody.cart_items[0]

        expect(firstCartItem.product_id).toBe(productId)
        expect(firstCartItem.quantity).toBe(4)
    })

   
})
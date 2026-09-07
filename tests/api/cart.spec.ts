import { test, expect } from "../../page-objects/fixtures";
import {getThirdProductId} from "./helper/api-helpers"

test.describe("Shopping Cart Management",()=>{
    test("should complete shopping cart lifecycle: create, add item, and verify",async({request})=>{

        const cartResponse = await request.post("https://api.practicesoftwaretesting.com/carts")
        expect(cartResponse.status()).toBe(201)

        const cartResponseBody = await cartResponse.json()
        let cartId = cartResponseBody.id
         const productId = await getThirdProductId(request)

        const updateCartResponse = await request.post(
            `https://api.practicesoftwaretesting.com/carts/${cartId}`,
            {
                data:
                {
                    product_id: productId, 
                    quantity: 4
                }
            } 
        
        )
        expect(updateCartResponse.status()).toBe(200)

        const getCartInfoResponse = await request.get(`https://api.practicesoftwaretesting.com/carts/${cartId}`)
        expect(getCartInfoResponse.status()).toBe(200)

        const getCartInfoResponseBody = await getCartInfoResponse.json()
        const firstCartItem = getCartInfoResponseBody.cart_items[0]

        expect(firstCartItem.product_id).toBe(productId)
        expect(firstCartItem.quantity).toBe(4)
    })

   
})
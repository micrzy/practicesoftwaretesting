import {z} from "zod";

export const productSchema = z.object({
    id: z.string(),
    name: z.string().min(1).max(100),
    price: z.number().min(0),
    is_rental: z.boolean(),
    brand: z.object({
        id: z.string(),
        name: z.string().min(1).max(100),
    })
});
import { z } from "zod";

export const error404Schema = z.object({
  message: z.string(),
});
export const error422Schema = z.object({
  name: z.array(z.string()),
  slug: z.array(z.string()),
});


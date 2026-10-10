import { z } from "zod";

export const brandSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
});

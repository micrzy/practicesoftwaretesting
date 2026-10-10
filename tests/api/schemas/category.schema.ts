import { z } from "zod";

export const categorySchema = z.object({
  id: z.string(),
  parent_id: z.string().nullable(),
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100),
});

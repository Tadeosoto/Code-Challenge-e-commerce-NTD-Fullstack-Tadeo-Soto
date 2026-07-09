import { z } from "zod";

export const roleLoginSchema = z.object({
  role: z.enum(["BUYER", "SELLER", "OWNER"]),
});

export type RoleLoginInput = z.infer<typeof roleLoginSchema>;

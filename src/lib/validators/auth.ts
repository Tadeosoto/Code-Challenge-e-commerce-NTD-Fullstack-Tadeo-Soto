import { z } from "zod";

export const roleLoginSchema = z.object({
  role: z.enum(["BUYER", "SELLER", "OWNER"]),
  username: z.string().trim().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type RoleLoginInput = z.infer<typeof roleLoginSchema>;

import { z } from "zod";

export const updateUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

export type UpdateUserFormData = z.infer<typeof updateUserSchema>;

import { z } from "zod";

export const updateUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

export type UpdateUserFormData = z.infer<typeof updateUserSchema>;

export const createAdminUserSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .optional()
    .or(z.literal("")),
  email: z.string().email("Invalid email address"),
  role: z.enum(["USER", "ADMIN"]),
});

export type CreateAdminUserFormData = z.infer<typeof createAdminUserSchema>;

export const editAdminUserSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .optional()
    .or(z.literal("")),
  email: z.string().email("Invalid email address"),
});

export type EditAdminUserFormData = z.infer<typeof editAdminUserSchema>;

import { z } from "zod";

// Same rules the API enforces (zaydoun-api auth.validation.ts → passwordSchema).
// Messages are keys in messages/<locale>/common.json → "validation"; the hint
// is "validation.passwordHint".
export const passwordRule = z
  .string()
  .min(8, "passwordMin")
  .max(100, "passwordMax")
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "passwordWeak");

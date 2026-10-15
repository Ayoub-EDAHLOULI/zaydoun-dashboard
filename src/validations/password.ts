import { z } from "zod";

// Same rules the API enforces (zaydoun-api auth.validation.ts → passwordSchema)
export const PASSWORD_HINT = "8+ characters, with A–Z, a–z and 0–9.";

export const passwordRule = z
  .string()
  .min(8, "Use at least 8 characters.")
  .max(100, "Use at most 100 characters.")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Include an uppercase letter, a lowercase letter and a number.",
  );

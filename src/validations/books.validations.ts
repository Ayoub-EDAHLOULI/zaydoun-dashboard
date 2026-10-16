import { z } from "zod";

// Messages are keys in messages/<locale>/library.json → upload.errors
export const uploadBookSchema = z.object({
  title: z.string().min(1, "titleRequired").max(255, "tooLong"),
  author: z.string().max(255, "tooLong").optional(),
  language: z.string().length(2, "languageCode").toLowerCase().default("ar"),
});

export type UploadBookFormData = z.infer<typeof uploadBookSchema>;

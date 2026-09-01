import { z } from "zod";
import { ContentStatus } from "@/generated/prisma/browser";
import { slugify } from "@/lib/validations/post";

export const projectSchema = z.object({
  title: z.string().trim().min(3, "Le titre est trop court.").max(200),
  slug: z
    .string()
    .trim()
    .min(3, "Le slug est trop court.")
    .max(200)
    .transform(slugify)
    .refine((s) => s.length > 0, "Slug invalide."),
  summary: z.string().trim().min(10, "Le résumé est trop court.").max(400),
  contentHtml: z.string().trim().min(1, "Le contenu ne peut pas être vide."),
  category: z.string().trim().max(80).optional().or(z.literal("")),
  status: z.enum(ContentStatus),
  coverImageId: z.string().optional().or(z.literal("")),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;

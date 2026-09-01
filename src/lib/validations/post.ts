import { z } from "zod";
import { ContentStatus } from "@/generated/prisma/browser";

function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const postSchema = z.object({
  title: z.string().trim().min(3, "Le titre est trop court.").max(200),
  slug: z
    .string()
    .trim()
    .min(3, "Le slug est trop court.")
    .max(200)
    .transform(slugify)
    .refine((s) => s.length > 0, "Slug invalide."),
  excerpt: z.string().trim().min(10, "Le résumé est trop court.").max(400),
  contentHtml: z.string().trim().min(1, "Le contenu ne peut pas être vide."),
  category: z.string().trim().max(80).optional().or(z.literal("")),
  status: z.enum(ContentStatus),
  publishedAt: z.string().optional().or(z.literal("")),
  coverImageId: z.string().optional().or(z.literal("")),
});

export type PostFormValues = z.infer<typeof postSchema>;
export { slugify };

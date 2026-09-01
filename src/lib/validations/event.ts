import { z } from "zod";
import { ContentStatus } from "@/generated/prisma/browser";
import { slugify } from "@/lib/validations/post";

export const eventSchema = z.object({
  title: z.string().trim().min(3, "Le titre est trop court.").max(200),
  slug: z
    .string()
    .trim()
    .min(3, "Le slug est trop court.")
    .max(200)
    .transform(slugify)
    .refine((s) => s.length > 0, "Slug invalide."),
  description: z.string().trim().min(10, "La description est trop courte.").max(400),
  contentHtml: z.string().trim().optional().or(z.literal("")),
  location: z.string().trim().max(200).optional().or(z.literal("")),
  startAt: z.string().min(1, "La date de début est requise."),
  endAt: z.string().optional().or(z.literal("")),
  status: z.enum(ContentStatus),
  coverImageId: z.string().optional().or(z.literal("")),
});

export type EventFormValues = z.infer<typeof eventSchema>;

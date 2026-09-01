import { z } from "zod";
import { ContentStatus } from "@/generated/prisma/browser";
import { slugify } from "@/lib/validations/post";
import { getVideoEmbedUrl } from "@/lib/video";

export const conferenceSchema = z.object({
  title: z.string().trim().min(3, "Le titre est trop court.").max(200),
  slug: z
    .string()
    .trim()
    .min(3, "Le slug est trop court.")
    .max(200)
    .transform(slugify)
    .refine((s) => s.length > 0, "Slug invalide."),
  description: z.string().trim().min(10, "La description est trop courte.").max(600),
  videoUrl: z
    .string()
    .trim()
    .url("Lien vidéo invalide.")
    .refine((v) => getVideoEmbedUrl(v) !== null, "Utilisez un lien YouTube ou Vimeo."),
  location: z.string().trim().max(200).optional().or(z.literal("")),
  eventDate: z.string().optional().or(z.literal("")),
  status: z.enum(ContentStatus),
  coverImageId: z.string().optional().or(z.literal("")),
});

export type ConferenceFormValues = z.infer<typeof conferenceSchema>;

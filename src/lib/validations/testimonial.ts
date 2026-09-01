import { z } from "zod";
import { ContentStatus, TestimonialCategory, TestimonialFormat } from "@/generated/prisma/browser";
import { getVideoEmbedUrl } from "@/lib/video";

export const testimonialSchema = z
  .object({
    authorName: z.string().trim().min(2, "Le nom est trop court.").max(200),
    authorRole: z.string().trim().max(200).optional().or(z.literal("")),
    category: z.enum(TestimonialCategory),
    format: z.enum(TestimonialFormat),
    quote: z.string().trim().max(2000).optional().or(z.literal("")),
    videoUrl: z.string().trim().max(500).optional().or(z.literal("")),
    audioMediaId: z.string().optional().or(z.literal("")),
    photoMediaId: z.string().optional().or(z.literal("")),
    status: z.enum(ContentStatus),
  })
  .superRefine((data, ctx) => {
    if (data.format === TestimonialFormat.TEXT && !data.quote) {
      ctx.addIssue({ code: "custom", message: "Le témoignage texte est requis.", path: ["quote"] });
    }
    if (data.format === TestimonialFormat.VIDEO) {
      if (!data.videoUrl) {
        ctx.addIssue({ code: "custom", message: "Le lien vidéo est requis.", path: ["videoUrl"] });
      } else if (!getVideoEmbedUrl(data.videoUrl)) {
        ctx.addIssue({ code: "custom", message: "Utilisez un lien YouTube ou Vimeo.", path: ["videoUrl"] });
      }
    }
    if (data.format === TestimonialFormat.AUDIO && !data.audioMediaId) {
      ctx.addIssue({ code: "custom", message: "Le fichier audio est requis.", path: ["audioMediaId"] });
    }
  });

export type TestimonialFormValues = z.infer<typeof testimonialSchema>;

export const TESTIMONIAL_CATEGORY_LABELS: Record<TestimonialCategory, string> = {
  [TestimonialCategory.KITS_SCOLAIRES]: "Kits scolaires",
  [TestimonialCategory.KITS_ALIMENTAIRES]: "Kits alimentaires",
  [TestimonialCategory.PEUPLES_NATIONS]: "Peuples & nations",
  [TestimonialCategory.PERSONNES]: "Personnes",
};

export const TESTIMONIAL_FORMAT_LABELS: Record<TestimonialFormat, string> = {
  [TestimonialFormat.VIDEO]: "Vidéo",
  [TestimonialFormat.AUDIO]: "Audio",
  [TestimonialFormat.TEXT]: "Texte",
};

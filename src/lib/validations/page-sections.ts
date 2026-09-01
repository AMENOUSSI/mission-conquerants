import { z } from "zod";

export const heroSection = z.object({
  type: z.literal("hero"),
  data: z.object({
    eyebrow: z.string().optional(),
    title: z.string().min(1),
    subtitle: z.string().optional(),
  }),
});

export const richtextSection = z.object({
  type: z.literal("richtext"),
  data: z.object({
    title: z.string().optional(),
    html: z.string().min(1),
  }),
});

export const statsSection = z.object({
  type: z.literal("stats"),
  data: z.object({
    items: z.array(z.object({ value: z.string().min(1), label: z.string().min(1) })).min(1),
  }),
});

export const pageSectionSchema = z.discriminatedUnion("type", [
  heroSection,
  richtextSection,
  statsSection,
]);

export const pageSectionsSchema = z.array(pageSectionSchema);
export type PageSection = z.infer<typeof pageSectionSchema>;

export const pageSchema = z.object({
  title: z.string().trim().min(3, "Le titre est trop court.").max(200),
  slug: z.string().trim().min(2, "Le slug est trop court.").max(200),
  seoTitle: z.string().trim().max(200).optional().or(z.literal("")),
  seoDescription: z.string().trim().max(300).optional().or(z.literal("")),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  sections: z.string().min(1), // JSON-encoded PageSection[]
});

import { z } from "zod";

export const siteSettingsSchema = z.object({
  siteName: z.string().trim().min(2).max(150),
  tagline: z.string().trim().min(2).max(200),
  contactEmail: z.string().trim().email("Adresse e-mail invalide."),
  contactPhone: z.string().trim().max(50).optional().or(z.literal("")),
  address: z.string().trim().max(300).optional().or(z.literal("")),
  facebookUrl: z.string().trim().url("URL invalide.").optional().or(z.literal("")),
  instagramUrl: z.string().trim().url("URL invalide.").optional().or(z.literal("")),
  youtubeUrl: z.string().trim().url("URL invalide.").optional().or(z.literal("")),
  footerNote: z.string().trim().min(2).max(200),
  heroTitle: z.string().trim().min(5).max(200),
  heroSubtitle: z.string().trim().min(5).max(300),
  missionText: z.string().trim().min(10).max(1000),
  visionText: z.string().trim().min(10).max(1000),
});

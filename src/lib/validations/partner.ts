import { z } from "zod";

export const partnerSchema = z.object({
  name: z.string().trim().min(2, "Le nom est trop court.").max(150),
  url: z.string().trim().url("URL invalide.").optional().or(z.literal("")),
  logoMediaId: z.string().min(1, "Un logo est requis."),
  order: z.coerce.number().int().default(0),
  active: z.coerce.boolean(),
});

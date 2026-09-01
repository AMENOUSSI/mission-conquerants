import { z } from "zod";
import { Role } from "@/generated/prisma/browser";

export const createUserSchema = z.object({
  name: z.string().trim().min(2, "Le nom est trop court.").max(120),
  email: z.string().trim().email("Adresse e-mail invalide."),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères.").max(200),
  role: z.enum(Role),
});

export const updateUserSchema = z.object({
  name: z.string().trim().min(2, "Le nom est trop court.").max(120),
  role: z.enum(Role),
  active: z.coerce.boolean(),
  password: z
    .string()
    .max(200)
    .optional()
    .or(z.literal(""))
    .refine((v) => !v || v.length >= 8, "Le mot de passe doit contenir au moins 8 caractères."),
});

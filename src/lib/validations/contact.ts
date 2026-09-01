import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, "Veuillez indiquer votre nom.").max(120),
  email: z.string().trim().email("Adresse e-mail invalide."),
  subject: z.string().trim().max(150).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Votre message est trop court.").max(4000),
  // Honeypot field: real users never fill this, bots often do.
  company: z.string().max(0).optional().or(z.literal("")),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

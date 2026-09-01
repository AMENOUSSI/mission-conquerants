"use server";

import { prisma } from "@/lib/prisma";
import { contactFormSchema } from "@/lib/validations/contact";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<"name" | "email" | "subject" | "message", string>>;
};

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
    company: formData.get("company"),
  };

  const parsed = contactFormSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: ContactFormState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (typeof field === "string") {
        fieldErrors[field as keyof typeof fieldErrors] = issue.message;
      }
    }
    return {
      status: "error",
      message: "Veuillez corriger les champs indiqués ci-dessous.",
      fieldErrors,
    };
  }

  // Honeypot tripped: silently pretend success so bots move on.
  if (parsed.data.company) {
    return { status: "success" };
  }

  await prisma.contact.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      subject: parsed.data.subject || null,
      message: parsed.data.message,
    },
  });

  return { status: "success" };
}

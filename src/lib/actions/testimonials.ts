"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireContentAccess } from "@/lib/rbac";
import { testimonialSchema } from "@/lib/validations/testimonial";
import { ContentStatus } from "@/generated/prisma/client";
import type { ActionResult } from "@/lib/actions/media";

function parseFormData(formData: FormData) {
  return testimonialSchema.safeParse({
    authorName: formData.get("authorName"),
    authorRole: formData.get("authorRole") ?? "",
    category: formData.get("category"),
    format: formData.get("format"),
    quote: formData.get("quote") ?? "",
    videoUrl: formData.get("videoUrl") ?? "",
    audioMediaId: formData.get("audioMediaId") ?? "",
    photoMediaId: formData.get("photoMediaId") ?? "",
    status: formData.get("status"),
  });
}

export async function createTestimonial(formData: FormData): Promise<ActionResult<{ id: string }>> {
  const { user, forceDraft } = await requireContentAccess();
  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  }

  const status = forceDraft ? ContentStatus.DRAFT : parsed.data.status;

  const testimonial = await prisma.testimonial.create({
    data: {
      authorName: parsed.data.authorName,
      authorRole: parsed.data.authorRole || null,
      category: parsed.data.category,
      format: parsed.data.format,
      quote: parsed.data.quote || null,
      videoUrl: parsed.data.videoUrl || null,
      audioMediaId: parsed.data.audioMediaId || null,
      photoMediaId: parsed.data.photoMediaId || null,
      status,
      publishedAt: status === ContentStatus.PUBLISHED ? new Date() : null,
      authorId: user.id,
    },
  });

  revalidatePath("/admin/temoignages");
  revalidatePath("/temoignages");
  revalidatePath("/");
  redirect(`/admin/temoignages/${testimonial.id}`);
}

export async function updateTestimonial(id: string, formData: FormData): Promise<ActionResult> {
  const existing = await prisma.testimonial.findUnique({ where: { id } });
  if (!existing) return { success: false, message: "Témoignage introuvable." };

  const { forceDraft } = await requireContentAccess(existing.authorId);
  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  }

  const status = forceDraft ? ContentStatus.DRAFT : parsed.data.status;

  await prisma.testimonial.update({
    where: { id },
    data: {
      authorName: parsed.data.authorName,
      authorRole: parsed.data.authorRole || null,
      category: parsed.data.category,
      format: parsed.data.format,
      quote: parsed.data.quote || null,
      videoUrl: parsed.data.videoUrl || null,
      audioMediaId: parsed.data.audioMediaId || null,
      photoMediaId: parsed.data.photoMediaId || null,
      status,
      publishedAt:
        status === ContentStatus.PUBLISHED && !existing.publishedAt ? new Date() : existing.publishedAt,
    },
  });

  revalidatePath("/admin/temoignages");
  revalidatePath("/temoignages");
  revalidatePath("/");
  return { success: true };
}

export async function deleteTestimonial(id: string): Promise<ActionResult> {
  try {
    const existing = await prisma.testimonial.findUnique({ where: { id } });
    if (!existing) return { success: false, message: "Témoignage introuvable." };
    await requireContentAccess(existing.authorId);
    await prisma.testimonial.delete({ where: { id } });
    revalidatePath("/admin/temoignages");
    revalidatePath("/temoignages");
    revalidatePath("/");
    return { success: true };
  } catch {
    return { success: false, message: "Suppression impossible." };
  }
}

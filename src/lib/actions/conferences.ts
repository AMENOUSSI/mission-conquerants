"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireContentAccess } from "@/lib/rbac";
import { conferenceSchema } from "@/lib/validations/conference";
import { ContentStatus } from "@/generated/prisma/client";
import type { ActionResult } from "@/lib/actions/media";

function parseFormData(formData: FormData) {
  return conferenceSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    videoUrl: formData.get("videoUrl"),
    location: formData.get("location"),
    eventDate: formData.get("eventDate"),
    status: formData.get("status"),
    coverImageId: formData.get("coverImageId") ?? "",
  });
}

export async function createConference(formData: FormData): Promise<ActionResult<{ id: string }>> {
  const { user, forceDraft } = await requireContentAccess();
  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  }

  const status = forceDraft ? ContentStatus.DRAFT : parsed.data.status;

  const conference = await prisma.conference.create({
    data: {
      title: parsed.data.title,
      slug: parsed.data.slug,
      description: parsed.data.description,
      videoUrl: parsed.data.videoUrl,
      location: parsed.data.location || null,
      eventDate: parsed.data.eventDate ? new Date(parsed.data.eventDate) : null,
      status,
      publishedAt: status === ContentStatus.PUBLISHED ? new Date() : null,
      coverImageId: parsed.data.coverImageId || null,
      authorId: user.id,
    },
  });

  revalidatePath("/admin/conferences");
  revalidatePath("/conferences");
  revalidatePath("/");
  redirect(`/admin/conferences/${conference.id}`);
}

export async function updateConference(id: string, formData: FormData): Promise<ActionResult> {
  const existing = await prisma.conference.findUnique({ where: { id } });
  if (!existing) return { success: false, message: "Conférence introuvable." };

  const { forceDraft } = await requireContentAccess(existing.authorId);
  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  }

  const status = forceDraft ? ContentStatus.DRAFT : parsed.data.status;

  await prisma.conference.update({
    where: { id },
    data: {
      title: parsed.data.title,
      slug: parsed.data.slug,
      description: parsed.data.description,
      videoUrl: parsed.data.videoUrl,
      location: parsed.data.location || null,
      eventDate: parsed.data.eventDate ? new Date(parsed.data.eventDate) : null,
      status,
      publishedAt:
        status === ContentStatus.PUBLISHED && !existing.publishedAt ? new Date() : existing.publishedAt,
      coverImageId: parsed.data.coverImageId || null,
    },
  });

  revalidatePath("/admin/conferences");
  revalidatePath("/conferences");
  revalidatePath(`/conferences/${parsed.data.slug}`);
  revalidatePath("/");
  return { success: true };
}

export async function deleteConference(id: string): Promise<ActionResult> {
  try {
    const existing = await prisma.conference.findUnique({ where: { id } });
    if (!existing) return { success: false, message: "Conférence introuvable." };
    await requireContentAccess(existing.authorId);
    await prisma.conference.delete({ where: { id } });
    revalidatePath("/admin/conferences");
    revalidatePath("/conferences");
    revalidatePath("/");
    return { success: true };
  } catch {
    return { success: false, message: "Suppression impossible." };
  }
}

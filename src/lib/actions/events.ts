"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireContentAccess } from "@/lib/rbac";
import { eventSchema } from "@/lib/validations/event";
import { ContentStatus } from "@/generated/prisma/client";
import type { ActionResult } from "@/lib/actions/media";

function parseFormData(formData: FormData) {
  return eventSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    contentHtml: formData.get("contentHtml"),
    location: formData.get("location"),
    startAt: formData.get("startAt"),
    endAt: formData.get("endAt"),
    status: formData.get("status"),
    coverImageId: formData.get("coverImageId") ?? "",
  });
}

export async function createEvent(formData: FormData): Promise<ActionResult<{ id: string }>> {
  const { user, forceDraft } = await requireContentAccess();
  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  }

  const status = forceDraft ? ContentStatus.DRAFT : parsed.data.status;

  const event = await prisma.event.create({
    data: {
      title: parsed.data.title,
      slug: parsed.data.slug,
      description: parsed.data.description,
      contentHtml: parsed.data.contentHtml || null,
      location: parsed.data.location || null,
      startAt: new Date(parsed.data.startAt),
      endAt: parsed.data.endAt ? new Date(parsed.data.endAt) : null,
      status,
      publishedAt: status === ContentStatus.PUBLISHED ? new Date() : null,
      coverImageId: parsed.data.coverImageId || null,
      authorId: user.id,
    },
  });

  revalidatePath("/admin/evenements");
  revalidatePath("/evenements");
  redirect(`/admin/evenements/${event.id}`);
}

export async function updateEvent(id: string, formData: FormData): Promise<ActionResult> {
  const existing = await prisma.event.findUnique({ where: { id } });
  if (!existing) return { success: false, message: "Événement introuvable." };

  const { forceDraft } = await requireContentAccess(existing.authorId);
  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  }

  const status = forceDraft ? ContentStatus.DRAFT : parsed.data.status;

  await prisma.event.update({
    where: { id },
    data: {
      title: parsed.data.title,
      slug: parsed.data.slug,
      description: parsed.data.description,
      contentHtml: parsed.data.contentHtml || null,
      location: parsed.data.location || null,
      startAt: new Date(parsed.data.startAt),
      endAt: parsed.data.endAt ? new Date(parsed.data.endAt) : null,
      status,
      publishedAt:
        status === ContentStatus.PUBLISHED && !existing.publishedAt ? new Date() : existing.publishedAt,
      coverImageId: parsed.data.coverImageId || null,
    },
  });

  revalidatePath("/admin/evenements");
  revalidatePath("/evenements");
  revalidatePath(`/evenements/${parsed.data.slug}`);
  return { success: true };
}

export async function deleteEvent(id: string): Promise<ActionResult> {
  try {
    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) return { success: false, message: "Événement introuvable." };
    await requireContentAccess(existing.authorId);
    await prisma.event.delete({ where: { id } });
    revalidatePath("/admin/evenements");
    revalidatePath("/evenements");
    return { success: true };
  } catch {
    return { success: false, message: "Suppression impossible." };
  }
}

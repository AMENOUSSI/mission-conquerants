"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireContentAccess } from "@/lib/rbac";
import { projectSchema } from "@/lib/validations/project";
import { ContentStatus } from "@/generated/prisma/client";
import type { ActionResult } from "@/lib/actions/media";

function parseFormData(formData: FormData) {
  return projectSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    summary: formData.get("summary"),
    contentHtml: formData.get("contentHtml"),
    category: formData.get("category"),
    status: formData.get("status"),
    coverImageId: formData.get("coverImageId") ?? "",
  });
}

export async function createProject(formData: FormData): Promise<ActionResult<{ id: string }>> {
  const { user, forceDraft } = await requireContentAccess();
  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  }

  const status = forceDraft ? ContentStatus.DRAFT : parsed.data.status;

  const project = await prisma.project.create({
    data: {
      title: parsed.data.title,
      slug: parsed.data.slug,
      summary: parsed.data.summary,
      contentHtml: parsed.data.contentHtml,
      category: parsed.data.category || null,
      status,
      publishedAt: status === ContentStatus.PUBLISHED ? new Date() : null,
      coverImageId: parsed.data.coverImageId || null,
      authorId: user.id,
    },
  });

  revalidatePath("/admin/projets");
  revalidatePath("/activites-projets");
  redirect(`/admin/projets/${project.id}`);
}

export async function updateProject(id: string, formData: FormData): Promise<ActionResult> {
  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing) return { success: false, message: "Projet introuvable." };

  const { forceDraft } = await requireContentAccess(existing.authorId);
  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  }

  const status = forceDraft ? ContentStatus.DRAFT : parsed.data.status;

  await prisma.project.update({
    where: { id },
    data: {
      title: parsed.data.title,
      slug: parsed.data.slug,
      summary: parsed.data.summary,
      contentHtml: parsed.data.contentHtml,
      category: parsed.data.category || null,
      status,
      publishedAt:
        status === ContentStatus.PUBLISHED && !existing.publishedAt ? new Date() : existing.publishedAt,
      coverImageId: parsed.data.coverImageId || null,
    },
  });

  revalidatePath("/admin/projets");
  revalidatePath("/activites-projets");
  revalidatePath(`/activites-projets/${parsed.data.slug}`);
  return { success: true };
}

export async function deleteProject(id: string): Promise<ActionResult> {
  try {
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) return { success: false, message: "Projet introuvable." };
    await requireContentAccess(existing.authorId);
    await prisma.project.delete({ where: { id } });
    revalidatePath("/admin/projets");
    revalidatePath("/activites-projets");
    return { success: true };
  } catch {
    return { success: false, message: "Suppression impossible." };
  }
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { pageSchema, pageSectionsSchema } from "@/lib/validations/page-sections";
import { slugify } from "@/lib/validations/post";
import { ContentStatus, Role, type Prisma } from "@/generated/prisma/client";
import type { ActionResult } from "@/lib/actions/media";

function parseFormData(formData: FormData) {
  return pageSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    seoTitle: formData.get("seoTitle"),
    seoDescription: formData.get("seoDescription"),
    status: formData.get("status"),
    sections: formData.get("sections"),
  });
}

function parseSections(raw: string): { ok: true; sections: Prisma.InputJsonValue } | { ok: false; message: string } {
  try {
    const json = JSON.parse(raw);
    const result = pageSectionsSchema.safeParse(json);
    if (!result.success) return { ok: false, message: "Le contenu des blocs est invalide." };
    return { ok: true, sections: result.data as unknown as Prisma.InputJsonValue };
  } catch {
    return { ok: false, message: "Le contenu des blocs est invalide." };
  }
}

export async function createPage(formData: FormData): Promise<ActionResult<{ id: string }>> {
  const user = await requireRole(Role.EDITOR);
  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  }
  const sections = parseSections(parsed.data.sections);
  if (!sections.ok) return { success: false, message: sections.message };

  const page = await prisma.page.create({
    data: {
      title: parsed.data.title,
      slug: slugify(parsed.data.slug),
      seoTitle: parsed.data.seoTitle || null,
      seoDescription: parsed.data.seoDescription || null,
      status: parsed.data.status as ContentStatus,
      publishedAt: parsed.data.status === "PUBLISHED" ? new Date() : null,
      sections: sections.sections,
      authorId: user.id,
    },
  });

  revalidatePath("/admin/pages");
  redirect(`/admin/pages/${page.id}`);
}

export async function updatePage(id: string, formData: FormData): Promise<ActionResult> {
  await requireRole(Role.EDITOR);
  const existing = await prisma.page.findUnique({ where: { id } });
  if (!existing) return { success: false, message: "Page introuvable." };

  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  }
  const sections = parseSections(parsed.data.sections);
  if (!sections.ok) return { success: false, message: sections.message };

  await prisma.page.update({
    where: { id },
    data: {
      title: parsed.data.title,
      slug: slugify(parsed.data.slug),
      seoTitle: parsed.data.seoTitle || null,
      seoDescription: parsed.data.seoDescription || null,
      status: parsed.data.status as ContentStatus,
      publishedAt:
        parsed.data.status === "PUBLISHED" && !existing.publishedAt ? new Date() : existing.publishedAt,
      sections: sections.sections,
    },
  });

  revalidatePath("/admin/pages");
  revalidatePath(`/${slugify(parsed.data.slug)}`);
  return { success: true };
}

export async function deletePage(id: string): Promise<ActionResult> {
  try {
    await requireRole(Role.EDITOR);
    await prisma.page.delete({ where: { id } });
    revalidatePath("/admin/pages");
    return { success: true };
  } catch {
    return { success: false, message: "Suppression impossible." };
  }
}

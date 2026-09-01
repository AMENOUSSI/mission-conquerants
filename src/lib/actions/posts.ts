"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireContentAccess } from "@/lib/rbac";
import { postSchema } from "@/lib/validations/post";
import { ContentStatus } from "@/generated/prisma/client";
import type { ActionResult } from "@/lib/actions/media";

function parseFormData(formData: FormData) {
  return postSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    contentHtml: formData.get("contentHtml"),
    category: formData.get("category"),
    status: formData.get("status"),
    // Neither field is a real DOM input in PostForm (publishedAt isn't
    // exposed in the UI; coverImageId is only added via JS from
    // MediaPicker) — FormData.get() returns null (not undefined) when a
    // key was never set, which fails Zod's .optional(). Normalize to ""
    // so it matches z.literal("").
    publishedAt: formData.get("publishedAt") ?? "",
    coverImageId: formData.get("coverImageId") ?? "",
  });
}

export async function createPost(formData: FormData): Promise<ActionResult<{ id: string }>> {
  const { user, forceDraft } = await requireContentAccess();
  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  }

  const status = forceDraft ? ContentStatus.DRAFT : parsed.data.status;

  const post = await prisma.post.create({
    data: {
      title: parsed.data.title,
      slug: parsed.data.slug,
      excerpt: parsed.data.excerpt,
      contentHtml: parsed.data.contentHtml,
      category: parsed.data.category || null,
      status,
      publishedAt: status === ContentStatus.PUBLISHED ? new Date() : parsed.data.publishedAt || null,
      coverImageId: parsed.data.coverImageId || null,
      authorId: user.id,
    },
  });

  revalidatePath("/admin/articles");
  revalidatePath("/actualites");
  redirect(`/admin/articles/${post.id}`);
}

export async function updatePost(id: string, formData: FormData): Promise<ActionResult> {
  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) return { success: false, message: "Article introuvable." };

  const { forceDraft } = await requireContentAccess(existing.authorId);
  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  }

  const status = forceDraft ? ContentStatus.DRAFT : parsed.data.status;

  await prisma.post.update({
    where: { id },
    data: {
      title: parsed.data.title,
      slug: parsed.data.slug,
      excerpt: parsed.data.excerpt,
      contentHtml: parsed.data.contentHtml,
      category: parsed.data.category || null,
      status,
      publishedAt:
        status === ContentStatus.PUBLISHED && !existing.publishedAt
          ? new Date()
          : parsed.data.publishedAt || existing.publishedAt,
      coverImageId: parsed.data.coverImageId || null,
    },
  });

  revalidatePath("/admin/articles");
  revalidatePath("/actualites");
  revalidatePath(`/actualites/${parsed.data.slug}`);
  return { success: true };
}

export async function deletePost(id: string): Promise<ActionResult> {
  try {
    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing) return { success: false, message: "Article introuvable." };
    await requireContentAccess(existing.authorId);
    await prisma.post.delete({ where: { id } });
    revalidatePath("/admin/articles");
    revalidatePath("/actualites");
    return { success: true };
  } catch {
    return { success: false, message: "Suppression impossible." };
  }
}

"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser, requireRole, ForbiddenError, UnauthenticatedError } from "@/lib/rbac";
import { uploadMedia, deleteMedia } from "@/lib/blob";
import { Role } from "@/generated/prisma/client";

export type ActionResult<T = undefined> = { success: boolean; message?: string; data?: T };

export async function uploadMediaAction(formData: FormData): Promise<ActionResult<{ id: string; url: string }>> {
  try {
    const user = await requireUser();
    const file = formData.get("file");
    const altText = formData.get("altText");

    if (!(file instanceof File) || file.size === 0) {
      return { success: false, message: "Aucun fichier sélectionné." };
    }

    const uploaded = await uploadMedia(file);

    const media = await prisma.media.create({
      data: {
        ...uploaded,
        altText: typeof altText === "string" && altText ? altText : null,
        uploadedById: user.id,
      },
    });

    revalidatePath("/admin/medias");
    return { success: true, data: { id: media.id, url: media.url } };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Le téléversement a échoué." };
  }
}

export async function deleteMediaAction(id: string): Promise<ActionResult> {
  try {
    await requireRole(Role.EDITOR);
    const media = await prisma.media.findUnique({ where: { id } });
    if (!media) return { success: false, message: "Média introuvable." };

    await deleteMedia(media.pathname).catch(() => {
      // Local seed assets under /seed-media aren't in Blob storage — ignore.
    });
    await prisma.media.delete({ where: { id } });

    revalidatePath("/admin/medias");
    return { success: true };
  } catch (error) {
    if (error instanceof UnauthenticatedError || error instanceof ForbiddenError) {
      return { success: false, message: error.message };
    }
    return {
      success: false,
      message: "Suppression impossible : ce média est peut-être encore utilisé ailleurs.",
    };
  }
}

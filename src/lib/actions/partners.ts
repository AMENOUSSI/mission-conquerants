"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { partnerSchema } from "@/lib/validations/partner";
import { Role } from "@/generated/prisma/client";
import type { ActionResult } from "@/lib/actions/media";

function parseFormData(formData: FormData) {
  return partnerSchema.safeParse({
    name: formData.get("name"),
    url: formData.get("url"),
    logoMediaId: formData.get("logoMediaId"),
    order: formData.get("order"),
    active: formData.get("active"),
  });
}

export async function createPartner(formData: FormData): Promise<ActionResult> {
  await requireRole(Role.EDITOR);
  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  }

  await prisma.partner.create({
    data: {
      name: parsed.data.name,
      url: parsed.data.url || null,
      logoMediaId: parsed.data.logoMediaId,
      order: parsed.data.order,
      active: parsed.data.active,
    },
  });

  revalidatePath("/admin/partenaires");
  revalidatePath("/partenaires");
  revalidatePath("/");
  redirect("/admin/partenaires");
}

export async function updatePartner(id: string, formData: FormData): Promise<ActionResult> {
  await requireRole(Role.EDITOR);
  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  }

  await prisma.partner.update({
    where: { id },
    data: {
      name: parsed.data.name,
      url: parsed.data.url || null,
      logoMediaId: parsed.data.logoMediaId,
      order: parsed.data.order,
      active: parsed.data.active,
    },
  });

  revalidatePath("/admin/partenaires");
  revalidatePath("/partenaires");
  revalidatePath("/");
  return { success: true };
}

export async function deletePartner(id: string): Promise<ActionResult> {
  try {
    await requireRole(Role.EDITOR);
    await prisma.partner.delete({ where: { id } });
    revalidatePath("/admin/partenaires");
    revalidatePath("/partenaires");
    revalidatePath("/");
    return { success: true };
  } catch {
    return { success: false, message: "Suppression impossible." };
  }
}

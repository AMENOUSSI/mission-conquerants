"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { Role } from "@/generated/prisma/client";
import type { ActionResult } from "@/lib/actions/media";

export async function markContactRead(id: string, read: boolean): Promise<ActionResult> {
  try {
    await requireRole(Role.EDITOR);
    await prisma.contact.update({ where: { id }, data: { read } });
    revalidatePath("/admin/messages");
    return { success: true };
  } catch {
    return { success: false, message: "Action impossible." };
  }
}

export async function deleteContact(id: string): Promise<ActionResult> {
  try {
    await requireRole(Role.EDITOR);
    await prisma.contact.delete({ where: { id } });
    revalidatePath("/admin/messages");
    return { success: true };
  } catch {
    return { success: false, message: "Suppression impossible." };
  }
}

"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { createUserSchema, updateUserSchema } from "@/lib/validations/user";
import { Role } from "@/generated/prisma/client";
import type { ActionResult } from "@/lib/actions/media";

/** Only a Super Admin may create or edit another Super Admin's role. */
function assertRoleAssignable(actingRole: Role, targetRole: Role) {
  if (targetRole === Role.SUPER_ADMIN && actingRole !== Role.SUPER_ADMIN) {
    throw new Error("Seul un Super Admin peut attribuer ce rôle.");
  }
}

export async function createUser(formData: FormData): Promise<ActionResult> {
  try {
    const actor = await requireRole(Role.ADMIN);
    const parsed = createUserSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      role: formData.get("role"),
    });
    if (!parsed.success) {
      return { success: false, message: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
    }

    assertRoleAssignable(actor.role, parsed.data.role);

    const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
    if (existing) return { success: false, message: "Cette adresse e-mail est déjà utilisée." };

    const passwordHash = await bcrypt.hash(parsed.data.password, 12);
    await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        passwordHash,
        role: parsed.data.role,
      },
    });

    revalidatePath("/admin/utilisateurs");
    return { success: true };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Action impossible." };
  }
}

export async function updateUser(id: string, formData: FormData): Promise<ActionResult> {
  try {
    const actor = await requireRole(Role.ADMIN);
    const parsed = updateUserSchema.safeParse({
      name: formData.get("name"),
      role: formData.get("role"),
      active: formData.get("active"),
      password: formData.get("password"),
    });
    if (!parsed.success) {
      return { success: false, message: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
    }

    assertRoleAssignable(actor.role, parsed.data.role);

    if (actor.id === id && !parsed.data.active) {
      return { success: false, message: "Vous ne pouvez pas désactiver votre propre compte." };
    }
    if (actor.id === id && parsed.data.role !== actor.role) {
      return { success: false, message: "Vous ne pouvez pas modifier votre propre rôle." };
    }

    await prisma.user.update({
      where: { id },
      data: {
        name: parsed.data.name,
        role: parsed.data.role,
        active: parsed.data.active,
        ...(parsed.data.password
          ? { passwordHash: await bcrypt.hash(parsed.data.password, 12) }
          : {}),
      },
    });

    revalidatePath("/admin/utilisateurs");
    return { success: true };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Action impossible." };
  }
}

export async function deleteUser(id: string): Promise<ActionResult> {
  try {
    const actor = await requireRole(Role.ADMIN);
    if (actor.id === id) {
      return { success: false, message: "Vous ne pouvez pas supprimer votre propre compte." };
    }
    const target = await prisma.user.findUnique({ where: { id } });
    if (!target) return { success: false, message: "Utilisateur introuvable." };
    assertRoleAssignable(actor.role, target.role);

    await prisma.user.delete({ where: { id } });
    revalidatePath("/admin/utilisateurs");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Suppression impossible : cet utilisateur est probablement l'auteur de contenus existants.",
    };
  }
}

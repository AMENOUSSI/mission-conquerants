"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { siteSettingsSchema } from "@/lib/validations/site-settings";
import { Role } from "@/generated/prisma/client";
import type { ActionResult } from "@/lib/actions/media";

export async function updateSiteSettings(formData: FormData): Promise<ActionResult> {
  await requireRole(Role.SUPER_ADMIN);

  const parsed = siteSettingsSchema.safeParse({
    siteName: formData.get("siteName"),
    tagline: formData.get("tagline"),
    contactEmail: formData.get("contactEmail"),
    contactPhone: formData.get("contactPhone"),
    address: formData.get("address"),
    facebookUrl: formData.get("facebookUrl"),
    instagramUrl: formData.get("instagramUrl"),
    youtubeUrl: formData.get("youtubeUrl"),
    footerNote: formData.get("footerNote"),
    heroTitle: formData.get("heroTitle"),
    heroSubtitle: formData.get("heroSubtitle"),
    missionText: formData.get("missionText"),
    visionText: formData.get("visionText"),
    donationBankName: formData.get("donationBankName"),
    donationBankAccountName: formData.get("donationBankAccountName"),
    donationBankAccountNumber: formData.get("donationBankAccountNumber"),
    donationMixxTogoNumber: formData.get("donationMixxTogoNumber"),
    donationMoovFloozNumbers: formData.get("donationMoovFloozNumbers"),
  });

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  }

  await prisma.siteSettings.update({
    where: { id: "singleton" },
    data: {
      ...parsed.data,
      contactPhone: parsed.data.contactPhone || null,
      address: parsed.data.address || null,
      facebookUrl: parsed.data.facebookUrl || null,
      instagramUrl: parsed.data.instagramUrl || null,
      youtubeUrl: parsed.data.youtubeUrl || null,
      donationBankName: parsed.data.donationBankName || null,
      donationBankAccountName: parsed.data.donationBankAccountName || null,
      donationBankAccountNumber: parsed.data.donationBankAccountNumber || null,
      donationMixxTogoNumber: parsed.data.donationMixxTogoNumber || null,
      donationMoovFloozNumbers: parsed.data.donationMoovFloozNumbers || null,
    },
  });

  revalidatePath("/", "layout");
  return { success: true };
}

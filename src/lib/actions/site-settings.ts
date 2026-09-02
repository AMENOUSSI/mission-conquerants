"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { siteSettingsSchema } from "@/lib/validations/site-settings";
import { Role, Prisma } from "@/generated/prisma/client";
import type { ActionResult } from "@/lib/actions/media";

export async function updateSiteSettings(formData: FormData): Promise<ActionResult> {
  await requireRole(Role.SUPER_ADMIN);

  const parsed = siteSettingsSchema.safeParse({
    siteName: formData.get("siteName"),
    tagline: formData.get("tagline"),
    contactEmail: formData.get("contactEmail"),
    contactPhone: formData.get("contactPhone"),
    whatsappNumber: formData.get("whatsappNumber"),
    address: formData.get("address"),
    facebookUrl: formData.get("facebookUrl"),
    instagramUrl: formData.get("instagramUrl"),
    youtubeUrl: formData.get("youtubeUrl"),
    footerNote: formData.get("footerNote"),
    heroTitle: formData.get("heroTitle"),
    heroSubtitle: formData.get("heroSubtitle"),
    missionText: formData.get("missionText"),
    visionText: formData.get("visionText"),
    heroVerseText: formData.get("heroVerseText"),
    heroVerseReference: formData.get("heroVerseReference"),
    donationBankName: formData.get("donationBankName"),
    donationBankAccountName: formData.get("donationBankAccountName"),
    donationBankAccountNumber: formData.get("donationBankAccountNumber"),
    donationMixxTogoNumber: formData.get("donationMixxTogoNumber"),
    donationMoovFloozNumbers: formData.get("donationMoovFloozNumbers"),
    stat1Value: formData.get("stat1Value"),
    stat1Label: formData.get("stat1Label"),
    stat2Value: formData.get("stat2Value"),
    stat2Label: formData.get("stat2Label"),
    stat3Value: formData.get("stat3Value"),
    stat3Label: formData.get("stat3Label"),
  });

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  }

  const { stat1Value, stat1Label, stat2Value, stat2Label, stat3Value, stat3Label, ...rest } = parsed.data;
  const stats = [
    { value: stat1Value ?? "", label: stat1Label ?? "" },
    { value: stat2Value ?? "", label: stat2Label ?? "" },
    { value: stat3Value ?? "", label: stat3Label ?? "" },
  ].filter((stat) => stat.value && stat.label);

  await prisma.siteSettings.update({
    where: { id: "singleton" },
    data: {
      ...rest,
      contactPhone: rest.contactPhone || null,
      whatsappNumber: rest.whatsappNumber || null,
      address: rest.address || null,
      facebookUrl: rest.facebookUrl || null,
      instagramUrl: rest.instagramUrl || null,
      youtubeUrl: rest.youtubeUrl || null,
      donationBankName: rest.donationBankName || null,
      donationBankAccountName: rest.donationBankAccountName || null,
      donationBankAccountNumber: rest.donationBankAccountNumber || null,
      donationMixxTogoNumber: rest.donationMixxTogoNumber || null,
      donationMoovFloozNumbers: rest.donationMoovFloozNumbers || null,
      stats: stats.length > 0 ? stats : Prisma.JsonNull,
    },
  });

  revalidatePath("/", "layout");
  return { success: true };
}

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { SiteSettingsForm } from "@/components/admin/SiteSettingsForm";
import { requireRole } from "@/lib/rbac";
import { getSiteSettings, parseStats } from "@/lib/site-settings";
import { updateSiteSettings } from "@/lib/actions/site-settings";
import { Role } from "@/generated/prisma/client";

export default async function SiteSettingsPage() {
  await requireRole(Role.SUPER_ADMIN);
  const settings = await getSiteSettings();
  const stats = parseStats(settings.stats);

  return (
    <div>
      <AdminPageHeader
        title="Paramètres du site"
        description="Coordonnées, réseaux sociaux et contenu de la page d'accueil."
      />
      <SiteSettingsForm
        action={updateSiteSettings}
        initialValues={{
          ...settings,
          stat1Value: stats[0]?.value ?? "",
          stat1Label: stats[0]?.label ?? "",
          stat2Value: stats[1]?.value ?? "",
          stat2Label: stats[1]?.label ?? "",
          stat3Value: stats[2]?.value ?? "",
          stat3Label: stats[2]?.label ?? "",
        }}
      />
    </div>
  );
}

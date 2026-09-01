import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { SiteSettingsForm } from "@/components/admin/SiteSettingsForm";
import { requireRole } from "@/lib/rbac";
import { getSiteSettings } from "@/lib/site-settings";
import { updateSiteSettings } from "@/lib/actions/site-settings";
import { Role } from "@/generated/prisma/client";

export default async function SiteSettingsPage() {
  await requireRole(Role.SUPER_ADMIN);
  const settings = await getSiteSettings();

  return (
    <div>
      <AdminPageHeader
        title="Paramètres du site"
        description="Coordonnées, réseaux sociaux et contenu de la page d'accueil."
      />
      <SiteSettingsForm action={updateSiteSettings} initialValues={settings} />
    </div>
  );
}

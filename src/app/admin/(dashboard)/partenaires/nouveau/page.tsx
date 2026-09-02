import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { PartnerForm } from "@/components/admin/PartnerForm";
import { requireRole } from "@/lib/rbac";
import { getMediaLibrary } from "@/lib/content";
import { createPartner } from "@/lib/actions/partners";
import { MediaType, Role } from "@/generated/prisma/client";

export default async function NewPartnerPage() {
  await requireRole(Role.EDITOR);
  const media = (await getMediaLibrary()).filter((m) => m.type === MediaType.IMAGE);

  return (
    <div>
      <AdminPageHeader
        title="Nouveau partenaire"
        description="Ajoutez une organisation partenaire."
        backHref="/admin/partenaires"
      />
      <PartnerForm action={createPartner} media={media} submitLabel="Créer le partenaire" />
    </div>
  );
}

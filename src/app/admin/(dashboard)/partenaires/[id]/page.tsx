import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { PartnerForm } from "@/components/admin/PartnerForm";
import { requireRole } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { getMediaLibrary } from "@/lib/content";
import { updatePartner } from "@/lib/actions/partners";
import { MediaType, Role } from "@/generated/prisma/client";

export default async function EditPartnerPage({
  params,
}: PageProps<"/admin/partenaires/[id]">) {
  const { id } = await params;
  await requireRole(Role.EDITOR);
  const [partner, media] = await Promise.all([
    prisma.partner.findUnique({ where: { id }, include: { logoMedia: true } }),
    getMediaLibrary(),
  ]);
  if (!partner) notFound();

  const images = media.filter((m) => m.type === MediaType.IMAGE);

  return (
    <div>
      <AdminPageHeader title="Modifier le partenaire" description={partner.name} backHref="/admin/partenaires" />
      <PartnerForm
        action={updatePartner.bind(null, partner.id)}
        media={images}
        submitLabel="Enregistrer les modifications"
        initialValues={{
          name: partner.name,
          url: partner.url ?? undefined,
          order: partner.order,
          active: partner.active,
          logoMedia: {
            id: partner.logoMedia.id,
            url: partner.logoMedia.url,
            altText: partner.logoMedia.altText,
          },
        }}
      />
    </div>
  );
}

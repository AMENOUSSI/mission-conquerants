import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { TestimonialForm } from "@/components/admin/TestimonialForm";
import { requireUser } from "@/lib/rbac";
import { getMediaLibrary } from "@/lib/content";
import { createTestimonial } from "@/lib/actions/testimonials";
import { MediaType } from "@/generated/prisma/client";

export default async function NewTestimonialPage() {
  const user = await requireUser();
  const media = await getMediaLibrary();
  const images = media.filter((m) => m.type === MediaType.IMAGE);
  const audioFiles = media
    .filter((m) => m.type === MediaType.AUDIO)
    .map((m) => ({ id: m.id, url: m.url, filename: m.filename }));

  return (
    <div>
      <AdminPageHeader
        title="Nouveau témoignage"
        description="Ajoutez le témoignage d'un bénéficiaire (kits scolaires, alimentaires, peuples, personnes)."
        backHref="/admin/temoignages"
      />
      <TestimonialForm
        action={createTestimonial}
        images={images}
        audioFiles={audioFiles}
        userRole={user.role}
        submitLabel="Créer le témoignage"
      />
    </div>
  );
}

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ConferenceForm } from "@/components/admin/ConferenceForm";
import { requireUser } from "@/lib/rbac";
import { getMediaLibrary } from "@/lib/content";
import { createConference } from "@/lib/actions/conferences";
import { MediaType } from "@/generated/prisma/client";

export default async function NewConferencePage() {
  const user = await requireUser();
  const media = (await getMediaLibrary()).filter((m) => m.type === MediaType.IMAGE);

  return (
    <div>
      <AdminPageHeader
        title="Nouvelle conférence"
        description="Publiez le résumé vidéo d'une conférence."
        backHref="/admin/conferences"
      />
      <ConferenceForm action={createConference} media={media} userRole={user.role} submitLabel="Créer la conférence" />
    </div>
  );
}

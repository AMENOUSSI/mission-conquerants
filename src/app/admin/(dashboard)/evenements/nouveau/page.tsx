import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { EventForm } from "@/components/admin/EventForm";
import { requireUser } from "@/lib/rbac";
import { getMediaLibrary } from "@/lib/content";
import { createEvent } from "@/lib/actions/events";
import { MediaType } from "@/generated/prisma/client";

export default async function NewEventPage() {
  const user = await requireUser();
  const media = (await getMediaLibrary()).filter((m) => m.type === MediaType.IMAGE);

  return (
    <div>
      <AdminPageHeader title="Nouvel événement" description="Planifiez un séminaire ou un rassemblement." />
      <EventForm action={createEvent} media={media} userRole={user.role} submitLabel="Créer l'événement" />
    </div>
  );
}

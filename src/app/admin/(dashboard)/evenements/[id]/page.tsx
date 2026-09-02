import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { EventForm } from "@/components/admin/EventForm";
import { requireUser } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { getMediaLibrary } from "@/lib/content";
import { updateEvent } from "@/lib/actions/events";
import { MediaType } from "@/generated/prisma/client";

export default async function EditEventPage({
  params,
}: PageProps<"/admin/evenements/[id]">) {
  const { id } = await params;
  const user = await requireUser();
  const [event, media] = await Promise.all([
    prisma.event.findUnique({ where: { id }, include: { coverImage: true } }),
    getMediaLibrary(),
  ]);
  if (!event) notFound();

  const images = media.filter((m) => m.type === MediaType.IMAGE);

  return (
    <div>
      <AdminPageHeader title="Modifier l'événement" description={event.title} backHref="/admin/evenements" />
      <EventForm
        action={updateEvent.bind(null, event.id)}
        media={images}
        userRole={user.role}
        submitLabel="Enregistrer les modifications"
        initialValues={{
          title: event.title,
          slug: event.slug,
          description: event.description,
          contentHtml: event.contentHtml ?? "",
          location: event.location ?? undefined,
          startAt: event.startAt.toISOString(),
          endAt: event.endAt?.toISOString(),
          status: event.status,
          coverImage: event.coverImage
            ? { id: event.coverImage.id, url: event.coverImage.url, altText: event.coverImage.altText }
            : null,
        }}
      />
    </div>
  );
}

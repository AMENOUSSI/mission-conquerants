import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ConferenceForm } from "@/components/admin/ConferenceForm";
import { requireUser } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { getMediaLibrary } from "@/lib/content";
import { updateConference } from "@/lib/actions/conferences";
import { MediaType } from "@/generated/prisma/client";

export default async function EditConferencePage({
  params,
}: PageProps<"/admin/conferences/[id]">) {
  const { id } = await params;
  const user = await requireUser();
  const [conference, media] = await Promise.all([
    prisma.conference.findUnique({ where: { id }, include: { coverImage: true } }),
    getMediaLibrary(),
  ]);
  if (!conference) notFound();

  const images = media.filter((m) => m.type === MediaType.IMAGE);

  return (
    <div>
      <AdminPageHeader title="Modifier la conférence" description={conference.title} backHref="/admin/conferences" />
      <ConferenceForm
        action={updateConference.bind(null, conference.id)}
        media={images}
        userRole={user.role}
        submitLabel="Enregistrer les modifications"
        initialValues={{
          title: conference.title,
          slug: conference.slug,
          description: conference.description,
          videoUrl: conference.videoUrl,
          location: conference.location ?? undefined,
          eventDate: conference.eventDate?.toISOString(),
          status: conference.status,
          coverImage: conference.coverImage
            ? { id: conference.coverImage.id, url: conference.coverImage.url, altText: conference.coverImage.altText }
            : null,
        }}
      />
    </div>
  );
}

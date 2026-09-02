import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { TestimonialForm } from "@/components/admin/TestimonialForm";
import { requireUser } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { getMediaLibrary } from "@/lib/content";
import { updateTestimonial } from "@/lib/actions/testimonials";
import { MediaType } from "@/generated/prisma/client";

export default async function EditTestimonialPage({
  params,
}: PageProps<"/admin/temoignages/[id]">) {
  const { id } = await params;
  const user = await requireUser();
  const [testimonial, media] = await Promise.all([
    prisma.testimonial.findUnique({ where: { id }, include: { audioMedia: true, photoMedia: true } }),
    getMediaLibrary(),
  ]);
  if (!testimonial) notFound();

  const images = media.filter((m) => m.type === MediaType.IMAGE);
  const audioFiles = media
    .filter((m) => m.type === MediaType.AUDIO)
    .map((m) => ({ id: m.id, url: m.url, filename: m.filename }));

  return (
    <div>
      <AdminPageHeader
        title="Modifier le témoignage"
        description={testimonial.authorName}
        backHref="/admin/temoignages"
      />
      <TestimonialForm
        action={updateTestimonial.bind(null, testimonial.id)}
        images={images}
        audioFiles={audioFiles}
        userRole={user.role}
        submitLabel="Enregistrer les modifications"
        initialValues={{
          authorName: testimonial.authorName,
          authorRole: testimonial.authorRole ?? undefined,
          category: testimonial.category,
          format: testimonial.format,
          quote: testimonial.quote ?? undefined,
          videoUrl: testimonial.videoUrl ?? undefined,
          status: testimonial.status,
          audioMedia: testimonial.audioMedia
            ? { id: testimonial.audioMedia.id, url: testimonial.audioMedia.url, filename: testimonial.audioMedia.filename }
            : null,
          photoMedia: testimonial.photoMedia
            ? { id: testimonial.photoMedia.id, url: testimonial.photoMedia.url, altText: testimonial.photoMedia.altText }
            : null,
        }}
      />
    </div>
  );
}

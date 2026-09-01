import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { requireUser } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { getMediaLibrary } from "@/lib/content";
import { updateProject } from "@/lib/actions/projects";
import { MediaType } from "@/generated/prisma/client";

export default async function EditProjectPage({
  params,
}: PageProps<"/admin/projets/[id]">) {
  const { id } = await params;
  const user = await requireUser();
  const [project, media] = await Promise.all([
    prisma.project.findUnique({ where: { id }, include: { coverImage: true } }),
    getMediaLibrary(),
  ]);
  if (!project) notFound();

  const images = media.filter((m) => m.type === MediaType.IMAGE);

  return (
    <div>
      <AdminPageHeader title="Modifier le projet" description={project.title} />
      <ProjectForm
        action={updateProject.bind(null, project.id)}
        media={images}
        userRole={user.role}
        submitLabel="Enregistrer les modifications"
        initialValues={{
          title: project.title,
          slug: project.slug,
          summary: project.summary,
          contentHtml: project.contentHtml,
          category: project.category ?? undefined,
          status: project.status,
          coverImage: project.coverImage
            ? { id: project.coverImage.id, url: project.coverImage.url, altText: project.coverImage.altText }
            : null,
        }}
      />
    </div>
  );
}

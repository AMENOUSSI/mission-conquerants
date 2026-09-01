import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { requireUser } from "@/lib/rbac";
import { getMediaLibrary } from "@/lib/content";
import { createProject } from "@/lib/actions/projects";
import { MediaType } from "@/generated/prisma/client";

export default async function NewProjectPage() {
  const user = await requireUser();
  const media = (await getMediaLibrary()).filter((m) => m.type === MediaType.IMAGE);

  return (
    <div>
      <AdminPageHeader title="Nouveau projet" description="Présentez une nouvelle activité." />
      <ProjectForm action={createProject} media={media} userRole={user.role} submitLabel="Créer le projet" />
    </div>
  );
}

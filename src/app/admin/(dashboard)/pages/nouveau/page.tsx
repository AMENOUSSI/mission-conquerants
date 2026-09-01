import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { PageForm } from "@/components/admin/PageForm";
import { requireRole } from "@/lib/rbac";
import { createPage } from "@/lib/actions/pages";
import { Role } from "@/generated/prisma/client";

export default async function NewPagePage() {
  await requireRole(Role.EDITOR);

  return (
    <div>
      <AdminPageHeader title="Nouvelle page" description="Créez une page libre pour le site." />
      <PageForm action={createPage} submitLabel="Créer la page" />
    </div>
  );
}

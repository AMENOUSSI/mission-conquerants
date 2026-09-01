import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { UserForm } from "@/components/admin/UserForm";
import { requireRole } from "@/lib/rbac";
import { createUser } from "@/lib/actions/users";
import { Role } from "@/generated/prisma/client";

export default async function NewUserPage() {
  const actor = await requireRole(Role.ADMIN);

  return (
    <div>
      <AdminPageHeader title="Nouvel utilisateur" description="Créez un compte pour un membre de l'équipe." />
      <UserForm action={createUser} mode="create" actingRole={actor.role} />
    </div>
  );
}

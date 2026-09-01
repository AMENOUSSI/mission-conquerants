import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { UserForm } from "@/components/admin/UserForm";
import { requireRole } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { updateUser } from "@/lib/actions/users";
import { Role } from "@/generated/prisma/client";

export default async function EditUserPage({
  params,
}: PageProps<"/admin/utilisateurs/[id]">) {
  const { id } = await params;
  const actor = await requireRole(Role.ADMIN);
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) notFound();

  return (
    <div>
      <AdminPageHeader title="Modifier l'utilisateur" description={user.email} />
      <UserForm
        action={updateUser.bind(null, user.id)}
        mode="edit"
        actingRole={actor.role}
        initialValues={{ name: user.name, email: user.email, role: user.role, active: user.active }}
      />
    </div>
  );
}

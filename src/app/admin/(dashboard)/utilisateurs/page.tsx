import Link from "next/link";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { requireRole } from "@/lib/rbac";
import { ROLE_LABELS } from "@/lib/admin-nav";
import { prisma } from "@/lib/prisma";
import { deleteUser } from "@/lib/actions/users";
import { Role } from "@/generated/prisma/client";
import type { User } from "@/generated/prisma/client";

export default async function UsersListPage() {
  await requireRole(Role.ADMIN);
  const users = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });

  const columns: Column<User>[] = [
    {
      header: "Nom",
      cell: (u) => (
        <div>
          <p className="font-medium text-ink-900">{u.name}</p>
          <p className="text-xs text-ink-500">{u.email}</p>
        </div>
      ),
    },
    { header: "Rôle", cell: (u) => <Badge variant="outline">{ROLE_LABELS[u.role]}</Badge> },
    {
      header: "Statut",
      cell: (u) =>
        u.active ? (
          <Badge className="bg-navy-900 text-white">Actif</Badge>
        ) : (
          <Badge variant="outline" className="text-ink-500">
            Désactivé
          </Badge>
        ),
    },
    {
      header: "",
      className: "text-right",
      cell: (u) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/admin/utilisateurs/${u.id}`}>Modifier</Link>
          </Button>
          <DeleteButton action={deleteUser.bind(null, u.id)} itemLabel="l'utilisateur" />
        </div>
      ),
    },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Utilisateurs"
        description="Gérez les comptes et les rôles de l'équipe d'administration."
        action={
          <Button asChild>
            <Link href="/admin/utilisateurs/nouveau">
              <Plus size={16} weight="bold" />
              Nouvel utilisateur
            </Link>
          </Button>
        }
      />
      <DataTable columns={columns} rows={users} emptyMessage="Aucun utilisateur." />
    </div>
  );
}

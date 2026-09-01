import Link from "next/link";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Button } from "@/components/ui/button";
import { requireRole } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { deletePage } from "@/lib/actions/pages";
import { formatDate } from "@/lib/format";
import { Role } from "@/generated/prisma/client";
import type { Page } from "@/generated/prisma/client";

export default async function PagesListPage() {
  await requireRole(Role.EDITOR);
  const pages = await prisma.page.findMany({ orderBy: { updatedAt: "desc" } });

  const columns: Column<Page>[] = [
    {
      header: "Titre",
      cell: (p) => (
        <div>
          <p className="font-medium text-ink-900">{p.title}</p>
          <p className="text-xs text-ink-500">/{p.slug}</p>
        </div>
      ),
    },
    { header: "Statut", cell: (p) => <StatusBadge status={p.status} /> },
    { header: "Mis à jour", cell: (p) => formatDate(p.updatedAt) },
    {
      header: "",
      className: "text-right",
      cell: (p) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/admin/pages/${p.id}`}>Modifier</Link>
          </Button>
          <DeleteButton action={deletePage.bind(null, p.id)} itemLabel="la page" />
        </div>
      ),
    },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Pages"
        description="Pages libres du site (À propos, etc.)."
        action={
          <Button asChild>
            <Link href="/admin/pages/nouveau">
              <Plus size={16} weight="bold" />
              Nouvelle page
            </Link>
          </Button>
        }
      />
      <DataTable columns={columns} rows={pages} emptyMessage="Aucune page pour le moment." />
    </div>
  );
}

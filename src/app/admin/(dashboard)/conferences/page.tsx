import Link from "next/link";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { requireUser, canPublish } from "@/lib/rbac";
import { deleteConference } from "@/lib/actions/conferences";
import { formatDate } from "@/lib/format";
import type { Conference } from "@/generated/prisma/client";

export default async function ConferencesListPage() {
  const user = await requireUser();
  const isEditorOrAbove = canPublish(user.role);

  const conferences = await prisma.conference.findMany({
    where: isEditorOrAbove ? {} : { authorId: user.id },
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true } } },
  });

  const columns: Column<Conference & { author: { name: string } }>[] = [
    { header: "Titre", cell: (c) => <span className="font-medium text-ink-900">{c.title}</span> },
    { header: "Statut", cell: (c) => <StatusBadge status={c.status} /> },
    { header: "Date", cell: (c) => (c.eventDate ? formatDate(c.eventDate) : "—") },
    { header: "Auteur", cell: (c) => c.author.name },
    {
      header: "",
      className: "text-right",
      cell: (c) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/admin/conferences/${c.id}`}>Modifier</Link>
          </Button>
          <DeleteButton action={deleteConference.bind(null, c.id)} itemLabel="la conférence" />
        </div>
      ),
    },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Conférences"
        description="Résumés vidéo des conférences et sessions d'enseignement."
        action={
          <Button asChild>
            <Link href="/admin/conferences/nouveau">
              <Plus size={16} weight="bold" />
              Nouvelle conférence
            </Link>
          </Button>
        }
      />
      <DataTable columns={columns} rows={conferences} emptyMessage="Aucune conférence pour le moment." />
    </div>
  );
}

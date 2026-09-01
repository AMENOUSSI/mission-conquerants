import Link from "next/link";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { requireUser, canPublish } from "@/lib/rbac";
import { deleteEvent } from "@/lib/actions/events";
import { formatDate } from "@/lib/format";
import type { Event } from "@/generated/prisma/client";

export default async function EventsListPage() {
  const user = await requireUser();
  const isEditorOrAbove = canPublish(user.role);

  const events = await prisma.event.findMany({
    where: isEditorOrAbove ? {} : { authorId: user.id },
    orderBy: { startAt: "desc" },
    include: { author: { select: { name: true } } },
  });

  const columns: Column<Event & { author: { name: string } }>[] = [
    { header: "Titre", cell: (e) => <span className="font-medium text-ink-900">{e.title}</span> },
    { header: "Statut", cell: (e) => <StatusBadge status={e.status} /> },
    { header: "Date", cell: (e) => formatDate(e.startAt) },
    { header: "Auteur", cell: (e) => e.author.name },
    {
      header: "",
      className: "text-right",
      cell: (e) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/admin/evenements/${e.id}`}>Modifier</Link>
          </Button>
          <DeleteButton action={deleteEvent.bind(null, e.id)} itemLabel="l'événement" />
        </div>
      ),
    },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Événements"
        description="Gérez les séminaires, rassemblements et déplacements."
        action={
          <Button asChild>
            <Link href="/admin/evenements/nouveau">
              <Plus size={16} weight="bold" />
              Nouvel événement
            </Link>
          </Button>
        }
      />
      <DataTable columns={columns} rows={events} emptyMessage="Aucun événement pour le moment." />
    </div>
  );
}

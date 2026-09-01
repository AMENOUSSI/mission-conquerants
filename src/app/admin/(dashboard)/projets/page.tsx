import Link from "next/link";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { requireUser, canPublish } from "@/lib/rbac";
import { deleteProject } from "@/lib/actions/projects";
import { formatDate } from "@/lib/format";
import type { Project } from "@/generated/prisma/client";

export default async function ProjectsListPage() {
  const user = await requireUser();
  const isEditorOrAbove = canPublish(user.role);

  const projects = await prisma.project.findMany({
    where: isEditorOrAbove ? {} : { authorId: user.id },
    orderBy: { updatedAt: "desc" },
    include: { author: { select: { name: true } } },
  });

  const columns: Column<Project & { author: { name: string } }>[] = [
    { header: "Titre", cell: (p) => <span className="font-medium text-ink-900">{p.title}</span> },
    { header: "Statut", cell: (p) => <StatusBadge status={p.status} /> },
    { header: "Auteur", cell: (p) => p.author.name },
    { header: "Mis à jour", cell: (p) => formatDate(p.updatedAt) },
    {
      header: "",
      className: "text-right",
      cell: (p) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/admin/projets/${p.id}`}>Modifier</Link>
          </Button>
          <DeleteButton action={deleteProject.bind(null, p.id)} itemLabel="le projet" />
        </div>
      ),
    },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Projets"
        description="Gérez les activités et projets présentés sur le site."
        action={
          <Button asChild>
            <Link href="/admin/projets/nouveau">
              <Plus size={16} weight="bold" />
              Nouveau projet
            </Link>
          </Button>
        }
      />
      <DataTable columns={columns} rows={projects} emptyMessage="Aucun projet pour le moment." />
    </div>
  );
}

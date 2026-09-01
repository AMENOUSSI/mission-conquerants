import Link from "next/link";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { requireUser, canPublish } from "@/lib/rbac";
import { deletePost } from "@/lib/actions/posts";
import { formatDate } from "@/lib/format";
import type { Post } from "@/generated/prisma/client";

export default async function ArticlesListPage() {
  const user = await requireUser();
  const isEditorOrAbove = canPublish(user.role);

  const posts = await prisma.post.findMany({
    where: isEditorOrAbove ? {} : { authorId: user.id },
    orderBy: { updatedAt: "desc" },
    include: { author: { select: { name: true } } },
  });

  const columns: Column<Post & { author: { name: string } }>[] = [
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
            <Link href={`/admin/articles/${p.id}`}>Modifier</Link>
          </Button>
          <DeleteButton action={deletePost.bind(null, p.id)} itemLabel="l'article" />
        </div>
      ),
    },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Articles"
        description="Gérez les actualités publiées sur le site."
        action={
          <Button asChild>
            <Link href="/admin/articles/nouveau">
              <Plus size={16} weight="bold" />
              Nouvel article
            </Link>
          </Button>
        }
      />
      <DataTable columns={columns} rows={posts} emptyMessage="Aucun article pour le moment." />
    </div>
  );
}

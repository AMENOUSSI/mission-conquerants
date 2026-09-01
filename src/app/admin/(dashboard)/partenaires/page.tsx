import Link from "next/link";
import Image from "next/image";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { requireRole } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { deletePartner } from "@/lib/actions/partners";
import { Role } from "@/generated/prisma/client";
import type { Partner, Media } from "@/generated/prisma/client";

export default async function PartnersListPage() {
  await requireRole(Role.EDITOR);
  const partners = await prisma.partner.findMany({
    orderBy: { order: "asc" },
    include: { logoMedia: true },
  });

  const columns: Column<Partner & { logoMedia: Media }>[] = [
    {
      header: "Logo",
      cell: (p) => (
        <div className="relative size-10 overflow-hidden rounded-md border border-ink-200 bg-surface-muted">
          <Image src={p.logoMedia.url} alt={p.name} fill className="object-contain" />
        </div>
      ),
    },
    { header: "Nom", cell: (p) => <span className="font-medium text-ink-900">{p.name}</span> },
    { header: "Ordre", cell: (p) => p.order },
    {
      header: "Statut",
      cell: (p) =>
        p.active ? (
          <Badge className="bg-navy-900 text-white">Visible</Badge>
        ) : (
          <Badge variant="outline" className="text-ink-500">
            Masqué
          </Badge>
        ),
    },
    {
      header: "",
      className: "text-right",
      cell: (p) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/admin/partenaires/${p.id}`}>Modifier</Link>
          </Button>
          <DeleteButton action={deletePartner.bind(null, p.id)} itemLabel="le partenaire" />
        </div>
      ),
    },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Partenaires"
        description="Organisations et ministères affichés sur le site."
        action={
          <Button asChild>
            <Link href="/admin/partenaires/nouveau">
              <Plus size={16} weight="bold" />
              Nouveau partenaire
            </Link>
          </Button>
        }
      />
      <DataTable columns={columns} rows={partners} emptyMessage="Aucun partenaire pour le moment." />
    </div>
  );
}

import Link from "next/link";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { requireUser, canPublish } from "@/lib/rbac";
import { deleteTestimonial } from "@/lib/actions/testimonials";
import { TESTIMONIAL_CATEGORY_LABELS, TESTIMONIAL_FORMAT_LABELS } from "@/lib/validations/testimonial";
import type { Testimonial } from "@/generated/prisma/client";

export default async function TestimonialsListPage() {
  const user = await requireUser();
  const isEditorOrAbove = canPublish(user.role);

  const testimonials = await prisma.testimonial.findMany({
    where: isEditorOrAbove ? {} : { authorId: user.id },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    include: { author: { select: { name: true } } },
  });

  const columns: Column<Testimonial & { author: { name: string } }>[] = [
    { header: "Nom", cell: (t) => <span className="font-medium text-ink-900">{t.authorName}</span> },
    { header: "Catégorie", cell: (t) => TESTIMONIAL_CATEGORY_LABELS[t.category] },
    { header: "Format", cell: (t) => TESTIMONIAL_FORMAT_LABELS[t.format] },
    { header: "Statut", cell: (t) => <StatusBadge status={t.status} /> },
    {
      header: "",
      className: "text-right",
      cell: (t) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/admin/temoignages/${t.id}`}>Modifier</Link>
          </Button>
          <DeleteButton action={deleteTestimonial.bind(null, t.id)} itemLabel="le témoignage" />
        </div>
      ),
    },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Témoignages"
        description="Témoignages des bénéficiaires des kits scolaires, alimentaires et des actions de la mission."
        action={
          <Button asChild>
            <Link href="/admin/temoignages/nouveau">
              <Plus size={16} weight="bold" />
              Nouveau témoignage
            </Link>
          </Button>
        }
      />
      <DataTable columns={columns} rows={testimonials} emptyMessage="Aucun témoignage pour le moment." />
    </div>
  );
}

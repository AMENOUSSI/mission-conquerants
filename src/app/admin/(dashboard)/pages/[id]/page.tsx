import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { PageForm } from "@/components/admin/PageForm";
import { requireRole } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { updatePage } from "@/lib/actions/pages";
import { pageSectionsSchema } from "@/lib/validations/page-sections";
import { Role } from "@/generated/prisma/client";

export default async function EditPagePage({
  params,
}: PageProps<"/admin/pages/[id]">) {
  const { id } = await params;
  await requireRole(Role.EDITOR);
  const page = await prisma.page.findUnique({ where: { id } });
  if (!page) notFound();

  const parsedSections = pageSectionsSchema.safeParse(page.sections);

  return (
    <div>
      <AdminPageHeader title="Modifier la page" description={page.title} />
      <PageForm
        action={updatePage.bind(null, page.id)}
        submitLabel="Enregistrer les modifications"
        initialValues={{
          title: page.title,
          slug: page.slug,
          seoTitle: page.seoTitle ?? undefined,
          seoDescription: page.seoDescription ?? undefined,
          status: page.status === "SCHEDULED" ? "DRAFT" : page.status,
          sections: parsedSections.success ? parsedSections.data : [],
        }}
      />
    </div>
  );
}

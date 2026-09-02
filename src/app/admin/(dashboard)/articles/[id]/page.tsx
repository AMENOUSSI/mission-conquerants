import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { PostForm } from "@/components/admin/PostForm";
import { requireUser } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { getMediaLibrary } from "@/lib/content";
import { updatePost } from "@/lib/actions/posts";
import { MediaType } from "@/generated/prisma/client";

export default async function EditArticlePage({
  params,
}: PageProps<"/admin/articles/[id]">) {
  const { id } = await params;
  const user = await requireUser();
  const [post, media] = await Promise.all([
    prisma.post.findUnique({ where: { id }, include: { coverImage: true } }),
    getMediaLibrary(),
  ]);
  if (!post) notFound();

  const images = media.filter((m) => m.type === MediaType.IMAGE);

  return (
    <div>
      <AdminPageHeader title="Modifier l'article" description={post.title} backHref="/admin/articles" />
      <PostForm
        action={updatePost.bind(null, post.id)}
        media={images}
        userRole={user.role}
        submitLabel="Enregistrer les modifications"
        initialValues={{
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          contentHtml: post.contentHtml,
          category: post.category ?? undefined,
          status: post.status,
          coverImage: post.coverImage
            ? { id: post.coverImage.id, url: post.coverImage.url, altText: post.coverImage.altText }
            : null,
        }}
      />
    </div>
  );
}

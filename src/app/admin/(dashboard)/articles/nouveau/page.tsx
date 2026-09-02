import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { PostForm } from "@/components/admin/PostForm";
import { requireUser } from "@/lib/rbac";
import { getMediaLibrary } from "@/lib/content";
import { createPost } from "@/lib/actions/posts";
import { MediaType } from "@/generated/prisma/client";

export default async function NewArticlePage() {
  const user = await requireUser();
  const media = (await getMediaLibrary()).filter((m) => m.type === MediaType.IMAGE);

  return (
    <div>
      <AdminPageHeader
        title="Nouvel article"
        description="Rédigez une nouvelle actualité."
        backHref="/admin/articles"
      />
      <PostForm action={createPost} media={media} userRole={user.role} submitLabel="Créer l'article" />
    </div>
  );
}

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { MediaLibraryGrid } from "@/components/admin/MediaLibraryGrid";
import { requireUser } from "@/lib/rbac";
import { getMediaLibrary } from "@/lib/content";

export default async function MediaLibraryPage() {
  await requireUser();
  const media = await getMediaLibrary();

  return (
    <div>
      <AdminPageHeader
        title="Bibliothèque média"
        description="Images, vidéos et PDF utilisés sur le site."
      />
      <MediaLibraryGrid
        initialMedia={media.map((m) => ({
          id: m.id,
          url: m.url,
          type: m.type,
          filename: m.filename,
          altText: m.altText,
          createdAt: m.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}

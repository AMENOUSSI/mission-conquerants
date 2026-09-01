import type { Metadata } from "next";
import { PageHeader } from "@/components/public/PageHeader";
import { Container } from "@/components/public/Container";
import { EmptyState } from "@/components/public/EmptyState";
import { Lightbox } from "@/components/public/Lightbox";
import { getGalleryMedia } from "@/lib/content";
import { MediaType } from "@/generated/prisma/client";

export const metadata: Metadata = {
  title: "Galerie",
  description: "Photos et vidéos des activités et rencontres de la Mission Les Conquérants.",
};

export default async function GalleryPage() {
  const media = await getGalleryMedia();
  const images = media.filter((m) => m.type === MediaType.IMAGE);

  return (
    <>
      <PageHeader
        title="Galerie"
        subtitle="Photos et vidéos prises sur le terrain, lors de nos rencontres et déplacements."
      />
      <section className="py-14 sm:py-16">
        <Container>
          {images.length === 0 ? (
            <EmptyState message="La galerie est vide pour le moment. Revenez bientôt." />
          ) : (
            <Lightbox images={images} />
          )}
        </Container>
      </section>
    </>
  );
}

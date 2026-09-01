import type { Metadata } from "next";
import { PageHeader } from "@/components/public/PageHeader";
import { Container } from "@/components/public/Container";
import { ContentCard } from "@/components/public/ContentCard";
import { EmptyState } from "@/components/public/EmptyState";
import { Reveal } from "@/components/public/Reveal";
import { getPublishedPosts } from "@/lib/content";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Actualités",
  description: "Les dernières nouvelles et récits de terrain de la Mission Les Conquérants.",
};

export default async function PostsPage() {
  const posts = await getPublishedPosts();

  return (
    <>
      <PageHeader
        title="Actualités"
        subtitle="Récits de terrain, nouvelles et témoignages de la mission."
      />
      <section className="py-14 sm:py-16">
        <Container>
          {posts.length === 0 ? (
            <EmptyState message="Aucun article publié pour le moment. Revenez bientôt." />
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, i) => (
                <Reveal key={post.id} delay={(i % 3) * 0.06}>
                  <ContentCard
                    href={`/actualites/${post.slug}`}
                    imageSrc={post.coverImage?.url}
                    imageAlt={post.coverImage?.altText ?? post.title}
                    meta={post.publishedAt ? formatDate(post.publishedAt) : undefined}
                    title={post.title}
                    excerpt={post.excerpt}
                  />
                </Reveal>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import { PageHeader } from "@/components/public/PageHeader";
import { Container } from "@/components/public/Container";
import { ContentCard } from "@/components/public/ContentCard";
import { EmptyState } from "@/components/public/EmptyState";
import { Reveal } from "@/components/public/Reveal";
import { getPublishedProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Activités & Projets",
  description:
    "Les projets et activités de la Mission Les Conquérants auprès des communautés non atteintes.",
};

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();

  return (
    <>
      <PageHeader
        title="Activités & projets"
        subtitle="Ce que nous mettons en œuvre auprès des communautés que nous accompagnons, sur le terrain."
      />
      <section className="py-14 sm:py-16">
        <Container>
          {projects.length === 0 ? (
            <EmptyState message="Aucun projet publié pour le moment. Revenez bientôt." />
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, i) => (
                <Reveal key={project.id} delay={(i % 3) * 0.06}>
                  <ContentCard
                    href={`/activites-projets/${project.slug}`}
                    imageSrc={project.coverImage?.url}
                    imageAlt={project.coverImage?.altText ?? project.title}
                    meta={project.category ?? undefined}
                    title={project.title}
                    excerpt={project.summary}
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

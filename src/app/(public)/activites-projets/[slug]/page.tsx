import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Container } from "@/components/public/Container";
import { RichContent } from "@/components/public/RichContent";
import { Reveal } from "@/components/public/Reveal";
import { getProjectBySlug } from "@/lib/content";

export async function generateMetadata({
  params,
}: PageProps<"/activites-projets/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return { title: project.title, description: project.summary };
}

export default async function ProjectDetailPage({
  params,
}: PageProps<"/activites-projets/[slug]">) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <article className="py-12 sm:py-16">
      <Container className="max-w-3xl">
        <Reveal>
          {project.category && (
            <p className="text-xs font-medium tracking-wide text-accent-700 uppercase">
              {project.category}
            </p>
          )}
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
            {project.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-ink-500">{project.summary}</p>
        </Reveal>

        {project.coverImage && (
          <Reveal delay={0.08} className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-surface-muted">
            <Image
              src={project.coverImage.url}
              alt={project.coverImage.altText ?? project.title}
              fill
              sizes="(min-width: 1024px) 768px, 100vw"
              className="object-cover"
              priority
            />
          </Reveal>
        )}

        <Reveal delay={0.14}>
          <RichContent html={project.contentHtml} className="mt-8" />
        </Reveal>
      </Container>
    </article>
  );
}

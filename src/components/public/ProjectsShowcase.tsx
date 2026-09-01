import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/public/Reveal";
import type { getPublishedProjects } from "@/lib/content";

type Project = Awaited<ReturnType<typeof getPublishedProjects>>[number];

function ProjectTile({
  project,
  size,
  delay,
}: {
  project: Project;
  size: "large" | "small";
  delay: number;
}) {
  return (
    <Reveal delay={delay} className={size === "large" ? "lg:row-span-2" : ""}>
      <Link href={`/activites-projets/${project.slug}`} className="group block h-full">
        <div
          className={`relative w-full overflow-hidden rounded-2xl bg-surface-muted ${
            size === "large" ? "aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[26rem]" : "aspect-[16/10]"
          }`}
        >
          {project.coverImage ? (
            <Image
              src={project.coverImage.url}
              alt={project.coverImage.altText ?? project.title}
              fill
              sizes={size === "large" ? "(min-width: 1024px) 640px, 100vw" : "(min-width: 1024px) 380px, 100vw"}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-accent-100 text-accent-700">
              <span className="font-display text-2xl font-semibold">MLC</span>
            </div>
          )}
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/15 to-transparent"
          />
          <div className="absolute inset-x-0 bottom-0 p-5">
            {project.category && (
              <p className="text-xs font-medium tracking-wide text-white/80 uppercase">
                {project.category}
              </p>
            )}
            <h3
              className={`mt-1.5 font-display leading-snug font-semibold text-white ${
                size === "large" ? "text-2xl sm:text-3xl" : "text-lg"
              }`}
            >
              {project.title}
            </h3>
            {size === "large" && (
              <p className="mt-2 line-clamp-2 max-w-md text-sm leading-relaxed text-white/85">
                {project.summary}
              </p>
            )}
            <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-white group-hover:text-accent-300">
              Découvrir
              <ArrowRight size={14} weight="bold" />
            </span>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}

export function ProjectsShowcase({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null;

  const [primary, ...rest] = projects;

  if (rest.length === 0) {
    return <ProjectTile project={primary} size="large" delay={0} />;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ProjectTile project={primary} size="large" delay={0} />
      <div className="grid gap-6">
        {rest.map((project, i) => (
          <ProjectTile key={project.id} project={project} size="small" delay={(i + 1) * 0.08} />
        ))}
      </div>
    </div>
  );
}

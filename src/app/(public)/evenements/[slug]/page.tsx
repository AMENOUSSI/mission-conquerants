import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CalendarBlank, MapPin } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/public/Container";
import { RichContent } from "@/components/public/RichContent";
import { Reveal } from "@/components/public/Reveal";
import { getEventBySlug } from "@/lib/content";
import { formatDate } from "@/lib/format";

export async function generateMetadata({
  params,
}: PageProps<"/evenements/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return {};
  return { title: event.title, description: event.description };
}

export default async function EventDetailPage({
  params,
}: PageProps<"/evenements/[slug]">) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  return (
    <article className="py-12 sm:py-16">
      <Container className="max-w-3xl">
        <Reveal>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm font-medium text-accent-700">
            <span className="flex items-center gap-1.5">
              <CalendarBlank size={16} weight="bold" />
              {formatDate(event.startAt)}
            </span>
            {event.location && (
              <span className="flex items-center gap-1.5 text-ink-500">
                <MapPin size={16} />
                {event.location}
              </span>
            )}
          </div>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
            {event.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-ink-500">{event.description}</p>
        </Reveal>

        {event.coverImage && (
          <Reveal delay={0.08} className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-surface-muted">
            <Image
              src={event.coverImage.url}
              alt={event.coverImage.altText ?? event.title}
              fill
              sizes="(min-width: 1024px) 768px, 100vw"
              className="object-cover"
              priority
            />
          </Reveal>
        )}

        {event.contentHtml && (
          <Reveal delay={0.14}>
            <RichContent html={event.contentHtml} className="mt-8" />
          </Reveal>
        )}
      </Container>
    </article>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarBlank, MapPin } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/public/Container";
import { VideoEmbed } from "@/components/public/VideoEmbed";
import { Reveal } from "@/components/public/Reveal";
import { getConferenceBySlug } from "@/lib/content";
import { formatDate } from "@/lib/format";

export async function generateMetadata({
  params,
}: PageProps<"/conferences/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const conference = await getConferenceBySlug(slug);
  if (!conference) return {};
  return { title: conference.title, description: conference.description };
}

export default async function ConferenceDetailPage({
  params,
}: PageProps<"/conferences/[slug]">) {
  const { slug } = await params;
  const conference = await getConferenceBySlug(slug);
  if (!conference) notFound();

  return (
    <article className="py-12 sm:py-16">
      <Container className="max-w-3xl">
        <Reveal>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm font-medium text-accent-700">
            {conference.eventDate && (
              <span className="flex items-center gap-1.5">
                <CalendarBlank size={16} weight="bold" />
                {formatDate(conference.eventDate)}
              </span>
            )}
            {conference.location && (
              <span className="flex items-center gap-1.5 text-ink-500">
                <MapPin size={16} />
                {conference.location}
              </span>
            )}
          </div>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
            {conference.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-ink-500">{conference.description}</p>
        </Reveal>

        <Reveal delay={0.08}>
          <VideoEmbed url={conference.videoUrl} title={conference.title} className="mt-8" />
        </Reveal>
      </Container>
    </article>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CalendarBlank, VideoCamera } from "@phosphor-icons/react/dist/ssr";
import { PageHeader } from "@/components/public/PageHeader";
import { Container } from "@/components/public/Container";
import { EmptyState } from "@/components/public/EmptyState";
import { Reveal } from "@/components/public/Reveal";
import { getPublishedConferences } from "@/lib/content";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Conférences",
  description: "Résumés vidéo des conférences et sessions d'enseignement de la Mission Les Conquérants.",
};

export default async function ConferencesPage() {
  const conferences = await getPublishedConferences();

  return (
    <>
      <PageHeader
        title="Conférences"
        subtitle="Résumés vidéo de nos conférences, séminaires et sessions d'enseignement."
      />
      <section className="py-14 sm:py-16">
        <Container>
          {conferences.length === 0 ? (
            <EmptyState message="Aucune conférence publiée pour le moment. Revenez bientôt." />
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {conferences.map((conference, i) => (
                <Reveal key={conference.id} delay={(i % 6) * 0.05}>
                  <Link href={`/conferences/${conference.slug}`} className="group block">
                    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-navy-900">
                      {conference.coverImage ? (
                        <Image
                          src={conference.coverImage.url}
                          alt={conference.coverImage.altText ?? conference.title}
                          fill
                          sizes="(min-width: 1024px) 400px, 100vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center text-white/40">
                          <VideoCamera size={32} weight="duotone" />
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center bg-navy-900/20 opacity-0 transition-opacity group-hover:opacity-100">
                        <span className="flex size-12 items-center justify-center rounded-full bg-white/90 text-navy-900">
                          <VideoCamera size={22} weight="fill" />
                        </span>
                      </div>
                    </div>
                    {conference.eventDate && (
                      <p className="mt-3 flex items-center gap-1.5 text-xs font-medium tracking-wide text-accent-700 uppercase">
                        <CalendarBlank size={14} weight="bold" />
                        {formatDate(conference.eventDate)}
                      </p>
                    )}
                    <h2 className="mt-1.5 font-display text-lg font-semibold text-ink-900 group-hover:text-accent-700">
                      {conference.title}
                    </h2>
                    <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink-500">
                      {conference.description}
                    </p>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}

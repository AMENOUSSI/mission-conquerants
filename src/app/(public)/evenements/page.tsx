import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CalendarBlank, MapPin } from "@phosphor-icons/react/dist/ssr";
import { PageHeader } from "@/components/public/PageHeader";
import { Container } from "@/components/public/Container";
import { EmptyState } from "@/components/public/EmptyState";
import { Reveal } from "@/components/public/Reveal";
import { getPublishedEvents } from "@/lib/content";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Événements",
  description: "Les rassemblements, séminaires et déplacements de la Mission Les Conquérants.",
};

export default async function EventsPage() {
  const events = await getPublishedEvents();

  return (
    <>
      <PageHeader
        title="Événements"
        subtitle="Séminaires, rassemblements et déplacements sur le terrain."
      />
      <section className="py-14 sm:py-16">
        <Container className="max-w-3xl">
          {events.length === 0 ? (
            <EmptyState message="Aucun événement publié pour le moment. Revenez bientôt." />
          ) : (
            <ul className="flex flex-col divide-y divide-ink-200">
              {events.map((event, i) => (
                <Reveal key={event.id} delay={(i % 4) * 0.05}>
                  <li className="py-8 first:pt-0">
                    <Link href={`/evenements/${event.slug}`} className="group grid gap-5 sm:grid-cols-[9rem_1fr]">
                      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-surface-muted sm:aspect-square">
                        {event.coverImage ? (
                          <Image
                            src={event.coverImage.url}
                            alt={event.coverImage.altText ?? event.title}
                            fill
                            sizes="144px"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex size-full items-center justify-center bg-accent-100 text-accent-700">
                            <CalendarBlank size={28} weight="duotone" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-accent-700 uppercase">
                          <CalendarBlank size={14} weight="bold" />
                          {formatDate(event.startAt)}
                        </p>
                        <h2 className="mt-1.5 font-display text-lg font-semibold text-ink-900 group-hover:text-accent-700">
                          {event.title}
                        </h2>
                        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink-500">
                          {event.description}
                        </p>
                        {event.location && (
                          <p className="mt-2 flex items-center gap-1.5 text-xs text-ink-500">
                            <MapPin size={14} />
                            {event.location}
                          </p>
                        )}
                      </div>
                    </Link>
                  </li>
                </Reveal>
              ))}
            </ul>
          )}
        </Container>
      </section>
    </>
  );
}

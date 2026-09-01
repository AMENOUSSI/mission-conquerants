import Image from "next/image";
import Link from "next/link";
import { CalendarBlank, MapPin, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/public/Reveal";
import { MissionsCarousel } from "@/components/public/MissionsCarousel";
import { formatDate } from "@/lib/format";
import type { getUpcomingEvents } from "@/lib/content";

type MissionEvent = Awaited<ReturnType<typeof getUpcomingEvents>>[number];

export function MissionsShowcase({ events }: { events: MissionEvent[] }) {
  if (events.length === 0) return null;

  const [primary, ...rest] = events;

  return (
    <div className="flex flex-col gap-14">
      <Reveal>
        <Link href={`/evenements/${primary.slug}`} className="group grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-surface-muted lg:aspect-auto">
            {primary.coverImage ? (
              <Image
                src={primary.coverImage.url}
                alt={primary.coverImage.altText ?? primary.title}
                fill
                sizes="(min-width: 1024px) 640px, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex size-full items-center justify-center bg-accent-100 text-accent-700">
                <CalendarBlank size={40} weight="duotone" />
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center">
            <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-accent-700 uppercase">
              <CalendarBlank size={14} weight="bold" />
              {formatDate(primary.startAt)}
            </p>
            <h3 className="mt-3 font-display text-2xl leading-snug font-semibold text-ink-900 sm:text-3xl">
              {primary.title}
            </h3>
            {primary.location && (
              <p className="mt-2 flex items-center gap-1.5 text-sm text-ink-500">
                <MapPin size={15} />
                {primary.location}
              </p>
            )}
            <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-ink-500 sm:text-base">
              {primary.description}
            </p>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-700 group-hover:text-accent-600">
              Voir la mission
              <ArrowRight size={15} weight="bold" />
            </span>
          </div>
        </Link>
      </Reveal>

      {rest.length > 0 && <MissionsCarousel events={rest} />}
    </div>
  );
}

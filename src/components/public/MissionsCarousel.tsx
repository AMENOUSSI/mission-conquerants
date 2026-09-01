"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  CalendarBlank,
  CaretLeft,
  CaretRight,
  MapPin,
  ArrowRight,
} from "@phosphor-icons/react/dist/ssr";
import { formatDate } from "@/lib/format";
import type { getUpcomingEvents } from "@/lib/content";

type MissionEvent = Awaited<ReturnType<typeof getUpcomingEvents>>[number];

export function MissionsCarousel({ events }: { events: MissionEvent[] }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const reduce = useReducedMotion();

  function scrollByCard(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-mission-card]");
    const amount = (card?.offsetWidth ?? 320) + 24;
    track.scrollBy({ left: amount * direction, behavior: reduce ? "auto" : "smooth" });
  }

  return (
    <div className="relative">
      <ul
        ref={trackRef}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-4 pb-2 sm:-mx-6 sm:px-6"
      >
        {events.map((event, i) => (
          <motion.li
            key={event.id}
            data-mission-card
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="w-[78%] shrink-0 snap-start sm:w-[340px]"
          >
            <Link href={`/evenements/${event.slug}`} className="group block h-full">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-surface-muted">
                {event.coverImage ? (
                  <Image
                    src={event.coverImage.url}
                    alt={event.coverImage.altText ?? event.title}
                    fill
                    sizes="(min-width: 640px) 340px, 78vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center bg-accent-100 text-accent-700">
                    <CalendarBlank size={32} weight="duotone" />
                  </div>
                )}
                <div
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/25 to-transparent"
                />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-white uppercase">
                    <CalendarBlank size={14} weight="bold" />
                    {formatDate(event.startAt)}
                  </p>
                  <h3 className="mt-1.5 font-display text-lg leading-snug font-semibold text-white">
                    {event.title}
                  </h3>
                  {event.location && (
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-white/85">
                      <MapPin size={14} />
                      {event.location}
                    </p>
                  )}
                </div>
              </div>

              <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ink-500">
                {event.description}
              </p>
              <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-700 group-hover:text-accent-600">
                Voir la mission
                <ArrowRight size={15} weight="bold" />
              </span>
            </Link>
          </motion.li>
        ))}
      </ul>

      <div className="mt-4 hidden items-center justify-end gap-2 sm:flex">
        <button
          type="button"
          onClick={() => scrollByCard(-1)}
          aria-label="Mission précédente"
          className="flex size-10 items-center justify-center rounded-full border border-ink-200 text-ink-700 transition-colors hover:border-accent-500 hover:text-accent-700 active:translate-y-px"
        >
          <CaretLeft size={18} weight="bold" />
        </button>
        <button
          type="button"
          onClick={() => scrollByCard(1)}
          aria-label="Mission suivante"
          className="flex size-10 items-center justify-center rounded-full border border-ink-200 text-ink-700 transition-colors hover:border-accent-500 hover:text-accent-700 active:translate-y-px"
        >
          <CaretRight size={18} weight="bold" />
        </button>
      </div>
    </div>
  );
}

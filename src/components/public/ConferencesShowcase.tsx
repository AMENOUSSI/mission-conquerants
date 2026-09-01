import Image from "next/image";
import Link from "next/link";
import { CalendarBlank, VideoCamera, Play } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/public/Reveal";
import { formatDate } from "@/lib/format";
import type { getPublishedConferences } from "@/lib/content";

type Conference = Awaited<ReturnType<typeof getPublishedConferences>>[number];

export function ConferencesShowcase({ conferences }: { conferences: Conference[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {conferences.map((conference, i) => (
        <Reveal key={conference.id} delay={i * 0.08}>
          <Link href={`/conferences/${conference.slug}`} className="group block">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-navy-900">
              {conference.coverImage ? (
                <Image
                  src={conference.coverImage.url}
                  alt={conference.coverImage.altText ?? conference.title}
                  fill
                  sizes="(min-width: 1024px) 360px, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex size-full items-center justify-center text-white/40">
                  <VideoCamera size={32} weight="duotone" />
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-navy-900/30 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="flex size-11 items-center justify-center rounded-full bg-white/90 text-navy-900">
                  <Play size={18} weight="fill" />
                </span>
              </div>
            </div>
            {conference.eventDate && (
              <p className="mt-3 flex items-center gap-1.5 text-xs font-medium tracking-wide text-accent-700 uppercase">
                <CalendarBlank size={14} weight="bold" />
                {formatDate(conference.eventDate)}
              </p>
            )}
            <h3 className="mt-1.5 font-display text-base font-semibold text-ink-900 group-hover:text-accent-700">
              {conference.title}
            </h3>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}

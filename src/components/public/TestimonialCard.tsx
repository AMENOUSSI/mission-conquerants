import Image from "next/image";
import { Quotes, User } from "@phosphor-icons/react/dist/ssr";
import { VideoEmbed } from "@/components/public/VideoEmbed";
import { TESTIMONIAL_CATEGORY_LABELS } from "@/lib/validations/testimonial";
import { TestimonialFormat } from "@/generated/prisma/client";
import type { getPublishedTestimonials } from "@/lib/content";

type Testimonial = Awaited<ReturnType<typeof getPublishedTestimonials>>[number];

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-ink-200 bg-surface p-6">
      <span className="w-fit rounded-full bg-accent-100 px-3 py-1 text-xs font-medium text-accent-700">
        {TESTIMONIAL_CATEGORY_LABELS[testimonial.category]}
      </span>

      {testimonial.format === TestimonialFormat.VIDEO && testimonial.videoUrl && (
        <VideoEmbed url={testimonial.videoUrl} title={testimonial.authorName} />
      )}

      {testimonial.format === TestimonialFormat.AUDIO && testimonial.audioMedia && (
        <audio src={testimonial.audioMedia.url} controls className="w-full" />
      )}

      {testimonial.quote && (
        <p className="relative text-sm leading-relaxed text-ink-700">
          <Quotes size={20} weight="fill" className="mb-1 text-accent-300" />
          {testimonial.quote}
        </p>
      )}

      <div className="mt-auto flex items-center gap-3 border-t border-ink-200 pt-4">
        {testimonial.photoMedia ? (
          <div className="relative size-10 shrink-0 overflow-hidden rounded-full bg-surface-muted">
            <Image
              src={testimonial.photoMedia.url}
              alt={testimonial.photoMedia.altText ?? testimonial.authorName}
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>
        ) : (
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent-100 text-accent-600">
            <User size={18} weight="bold" />
          </span>
        )}
        <div>
          <p className="font-display text-sm font-semibold text-ink-900">{testimonial.authorName}</p>
          {testimonial.authorRole && <p className="text-xs text-ink-500">{testimonial.authorRole}</p>}
        </div>
      </div>
    </div>
  );
}

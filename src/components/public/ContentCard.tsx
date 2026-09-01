import Image from "next/image";
import Link from "next/link";

export function ContentCard({
  href,
  imageSrc,
  imageAlt,
  meta,
  title,
  excerpt,
}: {
  href: string;
  imageSrc?: string | null;
  imageAlt: string;
  meta?: string;
  title: string;
  excerpt: string;
}) {
  return (
    <Link href={href} className="group block">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-surface-muted">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(min-width: 1024px) 380px, 90vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-accent-100 text-accent-700">
            <span className="font-display text-2xl font-semibold">MLC</span>
          </div>
        )}
      </div>
      {meta && (
        <p className="mt-4 text-xs font-medium tracking-wide text-accent-700 uppercase">
          {meta}
        </p>
      )}
      <h3 className="mt-1.5 font-display text-lg font-semibold text-ink-900 group-hover:text-accent-700">
        {title}
      </h3>
      <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink-500">
        {excerpt}
      </p>
    </Link>
  );
}

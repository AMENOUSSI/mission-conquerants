import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

export function SectionHeading({
  title,
  subtitle,
  viewAllHref,
  viewAllLabel = "Tout voir",
}: {
  title: string;
  subtitle?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="font-display text-2xl font-semibold text-ink-900 sm:text-3xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 max-w-xl text-sm text-ink-500 sm:text-base">{subtitle}</p>
        )}
      </div>
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-accent-700 hover:text-accent-600"
        >
          {viewAllLabel}
          <ArrowRight size={15} weight="bold" />
        </Link>
      )}
    </div>
  );
}

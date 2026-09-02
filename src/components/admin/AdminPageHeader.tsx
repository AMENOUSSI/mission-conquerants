import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";

export function AdminPageHeader({
  title,
  description,
  action,
  backHref,
  backLabel = "Retour à la liste",
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  /** Route to the resource's list page. Shown as a back link above the title. */
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        {backHref && (
          <Link
            href={backHref}
            className="mb-2 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 transition-colors hover:text-ink-900"
          >
            <ArrowLeft size={16} weight="bold" />
            {backLabel}
          </Link>
        )}
        <h1 className="font-display text-2xl font-semibold text-ink-900">{title}</h1>
        {description && <p className="mt-1 text-sm text-ink-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}

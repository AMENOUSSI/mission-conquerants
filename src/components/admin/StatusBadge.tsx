import { Badge } from "@/components/ui/badge";
import { ContentStatus } from "@/generated/prisma/client";

const LABELS: Record<ContentStatus, string> = {
  [ContentStatus.DRAFT]: "Brouillon",
  [ContentStatus.SCHEDULED]: "Programmé",
  [ContentStatus.PUBLISHED]: "Publié",
};

const STYLES: Record<ContentStatus, string> = {
  [ContentStatus.DRAFT]: "bg-surface-muted text-ink-500 border-ink-200",
  [ContentStatus.SCHEDULED]: "bg-accent-100 text-accent-700 border-transparent",
  [ContentStatus.PUBLISHED]: "bg-navy-900 text-white border-transparent",
};

export function StatusBadge({ status }: { status: ContentStatus }) {
  return (
    <Badge variant="outline" className={STYLES[status]}>
      {LABELS[status]}
    </Badge>
  );
}

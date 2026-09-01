export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-ink-200 bg-surface-muted/60 px-6 py-16 text-center">
      <p className="text-sm text-ink-500">{message}</p>
    </div>
  );
}

// Abstract wireframe-globe mark echoing the official logo (concentric
// meridian lines + the orbit ring that circles it) without reproducing the
// logo artwork itself. Reused as the small header/footer mark and as the
// seed for the larger decorative GlobeGraphic.
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
      <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1.4" strokeOpacity="0.9" />
      <ellipse cx="16" cy="16" rx="12" ry="5" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
      <ellipse cx="16" cy="16" rx="5" ry="12" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
      <path
        d="M2.5 20C8 14.5 24 17 29.5 10.5"
        stroke="var(--color-accent-500)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

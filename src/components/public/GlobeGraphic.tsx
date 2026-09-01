// Recurring decorative motif derived from the logo's wireframe globe: a
// sphere built from meridian/latitude ellipses, the signature orbit ring,
// and a couple of lit nodes joined by connection arcs (reaching nations).
// Pure server-rendered SVG — the slow rotation is CSS only and collapses
// under prefers-reduced-motion via Tailwind's motion-reduce variant.
export function GlobeGraphic({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 400" fill="none" aria-hidden="true" className={className}>
      <circle cx="200" cy="200" r="158" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1" />

      <g className="origin-center animate-spin motion-reduce:animate-none [animation-duration:90s]">
        <ellipse cx="200" cy="200" rx="158" ry="52" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1" />
        <ellipse cx="200" cy="200" rx="158" ry="105" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1" />
        <ellipse cx="200" cy="200" rx="52" ry="158" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1" />
        <ellipse cx="200" cy="200" rx="105" ry="158" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1" />
      </g>

      <ellipse
        cx="200"
        cy="200"
        rx="192"
        ry="66"
        stroke="var(--color-accent-500)"
        strokeOpacity="0.55"
        strokeWidth="1.5"
        transform="rotate(-16 200 200)"
      />

      <g className="origin-center animate-spin motion-reduce:animate-none [animation-direction:reverse] [animation-duration:140s]">
        <circle cx="128" cy="138" r="4" fill="var(--color-accent-500)" />
        <circle cx="272" cy="176" r="3" fill="white" fillOpacity="0.85" />
        <circle cx="222" cy="272" r="3.5" fill="var(--color-accent-500)" />
        <path d="M128 138 Q 200 96 272 176" stroke="var(--color-accent-500)" strokeOpacity="0.55" strokeWidth="1.1" />
        <path d="M272 176 Q 262 232 222 272" stroke="var(--color-accent-500)" strokeOpacity="0.4" strokeWidth="1.1" />
      </g>
    </svg>
  );
}

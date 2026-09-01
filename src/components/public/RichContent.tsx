import DOMPurify from "isomorphic-dompurify";

export function RichContent({ html, className = "" }: { html: string; className?: string }) {
  const clean = DOMPurify.sanitize(html);

  return (
    <div
      className={`prose-content max-w-none text-ink-700 [&_a]:text-accent-700 [&_a]:underline [&_a]:underline-offset-2 [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-ink-900 [&_h3]:mt-6 [&_h3]:font-display [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-ink-900 [&_p]:mt-4 [&_p]:leading-relaxed [&_p:first-child]:mt-0 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-1.5 ${className}`}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}

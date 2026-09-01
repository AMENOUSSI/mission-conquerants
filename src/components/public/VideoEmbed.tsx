import { getVideoEmbedUrl } from "@/lib/video";

export function VideoEmbed({ url, title, className = "" }: { url: string; title: string; className?: string }) {
  const embedUrl = getVideoEmbedUrl(url);
  if (!embedUrl) return null;

  return (
    <div className={`relative aspect-video w-full overflow-hidden rounded-xl bg-navy-900 ${className}`}>
      <iframe
        src={embedUrl}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 size-full"
      />
    </div>
  );
}

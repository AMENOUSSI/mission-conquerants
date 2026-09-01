import Image from "next/image";
import Link from "next/link";
import { CalendarBlank } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/public/Reveal";
import { formatDate } from "@/lib/format";
import type { getPublishedPosts } from "@/lib/content";

type Post = Awaited<ReturnType<typeof getPublishedPosts>>[number];

function PostImage({ post, className }: { post: Post; className: string }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-surface-muted ${className}`}>
      {post.coverImage ? (
        <Image
          src={post.coverImage.url}
          alt={post.coverImage.altText ?? post.title}
          fill
          sizes="(min-width: 1024px) 560px, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="flex size-full items-center justify-center bg-accent-100 text-accent-700">
          <CalendarBlank size={28} weight="duotone" />
        </div>
      )}
    </div>
  );
}

export function NewsSection({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null;

  if (posts.length === 1) {
    const post = posts[0];
    return (
      <Reveal>
        <Link
          href={`/actualites/${post.slug}`}
          className="group grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-12"
        >
          <PostImage post={post} className="aspect-[16/10] w-full lg:aspect-[4/3]" />
          <div>
            {post.publishedAt && (
              <p className="text-xs font-medium tracking-wide text-accent-700 uppercase">
                {formatDate(post.publishedAt)}
              </p>
            )}
            <h3 className="mt-2 font-display text-2xl leading-snug font-semibold text-ink-900 sm:text-3xl">
              {post.title}
            </h3>
            <p className="mt-3 max-w-lg text-base leading-relaxed text-ink-500">{post.excerpt}</p>
          </div>
        </Link>
      </Reveal>
    );
  }

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post, i) => (
        <Reveal key={post.id} delay={i * 0.06}>
          <Link href={`/actualites/${post.slug}`} className="group block">
            <PostImage post={post} className="aspect-[16/10] w-full" />
            {post.publishedAt && (
              <p className="mt-4 text-xs font-medium tracking-wide text-accent-700 uppercase">
                {formatDate(post.publishedAt)}
              </p>
            )}
            <h3 className="mt-1.5 font-display text-lg font-semibold text-ink-900 group-hover:text-accent-700">
              {post.title}
            </h3>
            <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink-500">
              {post.excerpt}
            </p>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}

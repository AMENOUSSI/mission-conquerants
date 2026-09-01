import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Container } from "@/components/public/Container";
import { RichContent } from "@/components/public/RichContent";
import { Reveal } from "@/components/public/Reveal";
import { getPostBySlug } from "@/lib/content";
import { formatDate } from "@/lib/format";

export async function generateMetadata({
  params,
}: PageProps<"/actualites/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function PostDetailPage({
  params,
}: PageProps<"/actualites/[slug]">) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="py-12 sm:py-16">
      <Container className="max-w-3xl">
        <Reveal>
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium tracking-wide text-accent-700 uppercase">
            {post.category && <span>{post.category}</span>}
            {post.publishedAt && (
              <>
                <span aria-hidden className="text-ink-200">
                  /
                </span>
                <span className="text-ink-500 normal-case">{formatDate(post.publishedAt)}</span>
              </>
            )}
          </div>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-ink-500">{post.excerpt}</p>
          {post.author?.name && (
            <p className="mt-4 text-sm text-ink-500">Par {post.author.name}</p>
          )}
        </Reveal>

        {post.coverImage && (
          <Reveal delay={0.08} className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-surface-muted">
            <Image
              src={post.coverImage.url}
              alt={post.coverImage.altText ?? post.title}
              fill
              sizes="(min-width: 1024px) 768px, 100vw"
              className="object-cover"
              priority
            />
          </Reveal>
        )}

        <Reveal delay={0.14}>
          <RichContent html={post.contentHtml} className="mt-8" />
        </Reveal>
      </Container>
    </article>
  );
}

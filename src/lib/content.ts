import { prisma } from "@/lib/prisma";
import { ContentStatus } from "@/generated/prisma/client";

const published = { status: ContentStatus.PUBLISHED } as const;

export function getPublishedPosts(limit?: number) {
  return prisma.post.findMany({
    where: published,
    orderBy: { publishedAt: "desc" },
    take: limit,
    include: { coverImage: true },
  });
}

export function getPostBySlug(slug: string) {
  return prisma.post.findFirst({
    where: { slug, ...published },
    include: { coverImage: true, author: { select: { name: true } } },
  });
}

export function getPublishedEvents(limit?: number) {
  return prisma.event.findMany({
    where: published,
    orderBy: { startAt: "asc" },
    take: limit,
    include: { coverImage: true },
  });
}

export function getUpcomingEvents(limit?: number) {
  return prisma.event.findMany({
    where: { ...published, startAt: { gte: new Date() } },
    orderBy: { startAt: "asc" },
    take: limit,
    include: { coverImage: true },
  });
}

export function getEventBySlug(slug: string) {
  return prisma.event.findFirst({
    where: { slug, ...published },
    include: { coverImage: true },
  });
}

export function getPublishedProjects(limit?: number) {
  return prisma.project.findMany({
    where: published,
    orderBy: { publishedAt: "desc" },
    take: limit,
    include: { coverImage: true },
  });
}

export function getProjectBySlug(slug: string) {
  return prisma.project.findFirst({
    where: { slug, ...published },
    include: { coverImage: true },
  });
}

export function getPublishedConferences(limit?: number) {
  return prisma.conference.findMany({
    where: published,
    orderBy: { publishedAt: "desc" },
    take: limit,
    include: { coverImage: true },
  });
}

export function getConferenceBySlug(slug: string) {
  return prisma.conference.findFirst({
    where: { slug, ...published },
    include: { coverImage: true },
  });
}

export function getPublishedTestimonials(options?: {
  limit?: number;
  category?: import("@/generated/prisma/client").TestimonialCategory;
}) {
  return prisma.testimonial.findMany({
    where: { ...published, ...(options?.category ? { category: options.category } : {}) },
    orderBy: [{ order: "asc" }, { publishedAt: "desc" }],
    take: options?.limit,
    include: { audioMedia: true, photoMedia: true },
  });
}

export function getActivePartners() {
  return prisma.partner.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
    include: { logoMedia: true },
  });
}

export function getPublishedPageBySlug(slug: string) {
  return prisma.page.findFirst({
    where: { slug, status: ContentStatus.PUBLISHED },
  });
}

export function getMediaLibrary(limit?: number) {
  return prisma.media.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

// Partner logos live in the same media pool as field photos but aren't
// "moments from the field" — keep them out of the public photo gallery.
export function getGalleryMedia(limit?: number) {
  return prisma.media.findMany({
    where: { partnerLogoFor: { none: {} } },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

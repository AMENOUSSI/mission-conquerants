import "server-only";
import { put, del } from "@vercel/blob";
import { MediaType } from "@/generated/prisma/client";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const AUDIO_TYPES = ["audio/mpeg", "audio/mp4", "audio/wav", "audio/ogg", "audio/webm", "audio/x-m4a"];
const PDF_TYPES = ["application/pdf"];

export const ACCEPTED_MEDIA_TYPES = [...IMAGE_TYPES, ...VIDEO_TYPES, ...AUDIO_TYPES, ...PDF_TYPES];
export const MAX_UPLOAD_BYTES = 100 * 1024 * 1024; // 100MB (video-friendly)

export function mediaTypeFromMime(mime: string): MediaType {
  if (IMAGE_TYPES.includes(mime)) return MediaType.IMAGE;
  if (VIDEO_TYPES.includes(mime)) return MediaType.VIDEO;
  if (AUDIO_TYPES.includes(mime)) return MediaType.AUDIO;
  return MediaType.PDF;
}

export async function uploadMedia(file: File) {
  if (!ACCEPTED_MEDIA_TYPES.includes(file.type)) {
    throw new Error(`Type de fichier non autorisé : ${file.type}`);
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("Fichier trop volumineux (max 100 Mo).");
  }

  const blob = await put(`medias/${Date.now()}-${file.name}`, file, {
    access: "public",
    addRandomSuffix: true,
  });

  return {
    url: blob.url,
    pathname: blob.pathname,
    type: mediaTypeFromMime(file.type),
    filename: file.name,
    size: file.size,
  };
}

export async function deleteMedia(pathname: string) {
  await del(pathname);
}

"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { MediaPicker, type MediaItem } from "@/components/admin/MediaPicker";
import { ContentStatus, Role } from "@/generated/prisma/browser";
import { slugify } from "@/lib/validations/post";
import type { ActionResult } from "@/lib/actions/media";

type ProjectInitialValues = {
  title?: string;
  slug?: string;
  summary?: string;
  contentHtml?: string;
  category?: string;
  status?: ContentStatus;
  coverImage?: MediaItem | null;
};

export function ProjectForm({
  action,
  initialValues,
  media,
  userRole,
  submitLabel = "Enregistrer",
}: {
  action: (formData: FormData) => Promise<ActionResult<unknown> | void>;
  initialValues?: ProjectInitialValues;
  media: MediaItem[];
  userRole: Role;
  submitLabel?: string;
}) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [slug, setSlug] = useState(initialValues?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initialValues?.slug));
  const [contentHtml, setContentHtml] = useState(initialValues?.contentHtml ?? "");
  const [status, setStatus] = useState<ContentStatus>(initialValues?.status ?? ContentStatus.DRAFT);
  const [coverImage, setCoverImage] = useState<MediaItem | null>(initialValues?.coverImage ?? null);
  const [isPending, startTransition] = useTransition();

  const canPublish = userRole !== Role.CONTRIBUTOR;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("contentHtml", contentHtml);
    formData.set("status", status);
    if (coverImage) formData.set("coverImageId", coverImage.id);

    startTransition(async () => {
      const result = await action(formData);
      if (result && !result.success) {
        toast.error(result.message ?? "Une erreur est survenue.");
      } else if (result?.success) {
        toast.success("Enregistré.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid gap-2">
        <Label htmlFor="title">Titre</Label>
        <Input
          id="title"
          name="title"
          required
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (!slugTouched) setSlug(slugify(e.target.value));
          }}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="slug">Slug (URL)</Label>
        <Input
          id="slug"
          name="slug"
          required
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value);
            setSlugTouched(true);
          }}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="summary">Résumé</Label>
        <Textarea id="summary" name="summary" rows={2} required defaultValue={initialValues?.summary} />
      </div>

      <div className="grid gap-2 sm:max-w-xs">
        <Label htmlFor="category">Catégorie (facultatif)</Label>
        <Input id="category" name="category" defaultValue={initialValues?.category} />
      </div>

      <div className="grid gap-2">
        <Label>Image de couverture</Label>
        <MediaPicker value={coverImage} media={media} onChange={setCoverImage} />
      </div>

      <div className="grid gap-2">
        <Label>Contenu</Label>
        <RichTextEditor value={contentHtml} onChange={setContentHtml} />
      </div>

      {canPublish ? (
        <div className="grid gap-2 sm:max-w-xs">
          <Label>Statut</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as ContentStatus)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ContentStatus.DRAFT}>Brouillon</SelectItem>
              <SelectItem value={ContentStatus.PUBLISHED}>Publié</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ) : (
        <p className="text-sm text-ink-500">
          Votre contenu sera enregistré comme brouillon. Un éditeur devra le publier.
        </p>
      )}

      <div>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Enregistrement..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}

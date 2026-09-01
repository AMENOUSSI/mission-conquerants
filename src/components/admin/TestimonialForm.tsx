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
import { MediaPicker, type MediaItem } from "@/components/admin/MediaPicker";
import { AudioPicker, type AudioItem } from "@/components/admin/AudioPicker";
import { ContentStatus, Role, TestimonialCategory, TestimonialFormat } from "@/generated/prisma/browser";
import { TESTIMONIAL_CATEGORY_LABELS, TESTIMONIAL_FORMAT_LABELS } from "@/lib/validations/testimonial";
import type { ActionResult } from "@/lib/actions/media";

type TestimonialInitialValues = {
  authorName?: string;
  authorRole?: string;
  category?: TestimonialCategory;
  format?: TestimonialFormat;
  quote?: string;
  videoUrl?: string;
  status?: ContentStatus;
  audioMedia?: AudioItem | null;
  photoMedia?: MediaItem | null;
};

export function TestimonialForm({
  action,
  initialValues,
  images,
  audioFiles,
  userRole,
  submitLabel = "Enregistrer",
}: {
  action: (formData: FormData) => Promise<ActionResult<unknown> | void>;
  initialValues?: TestimonialInitialValues;
  images: MediaItem[];
  audioFiles: AudioItem[];
  userRole: Role;
  submitLabel?: string;
}) {
  const [category, setCategory] = useState<TestimonialCategory>(
    initialValues?.category ?? TestimonialCategory.PERSONNES,
  );
  const [format, setFormat] = useState<TestimonialFormat>(initialValues?.format ?? TestimonialFormat.TEXT);
  const [status, setStatus] = useState<ContentStatus>(initialValues?.status ?? ContentStatus.DRAFT);
  const [photoMedia, setPhotoMedia] = useState<MediaItem | null>(initialValues?.photoMedia ?? null);
  const [audioMedia, setAudioMedia] = useState<AudioItem | null>(initialValues?.audioMedia ?? null);
  const [isPending, startTransition] = useTransition();

  const canPublish = userRole !== Role.CONTRIBUTOR;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("category", category);
    formData.set("format", format);
    formData.set("status", status);
    if (photoMedia) formData.set("photoMediaId", photoMedia.id);
    if (audioMedia) formData.set("audioMediaId", audioMedia.id);

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
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="authorName">Nom du bénéficiaire</Label>
          <Input id="authorName" name="authorName" required defaultValue={initialValues?.authorName} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="authorRole">Précision (facultatif)</Label>
          <Input
            id="authorRole"
            name="authorRole"
            placeholder="Ex. : Parent d'élève, Atakpamé"
            defaultValue={initialValues?.authorRole}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label>Catégorie</Label>
          <Select value={category} onValueChange={(v) => setCategory(v as TestimonialCategory)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(TestimonialCategory).map((c) => (
                <SelectItem key={c} value={c}>
                  {TESTIMONIAL_CATEGORY_LABELS[c]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label>Format du témoignage</Label>
          <Select value={format} onValueChange={(v) => setFormat(v as TestimonialFormat)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(TestimonialFormat).map((f) => (
                <SelectItem key={f} value={f}>
                  {TESTIMONIAL_FORMAT_LABELS[f]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {format === TestimonialFormat.TEXT && (
        <div className="grid gap-2">
          <Label htmlFor="quote">Témoignage</Label>
          <Textarea id="quote" name="quote" rows={5} defaultValue={initialValues?.quote} />
        </div>
      )}

      {format === TestimonialFormat.VIDEO && (
        <div className="grid gap-2">
          <Label htmlFor="videoUrl">Lien vidéo (YouTube ou Vimeo, 2 min max recommandé)</Label>
          <Input
            id="videoUrl"
            name="videoUrl"
            type="url"
            placeholder="https://www.youtube.com/watch?v=..."
            defaultValue={initialValues?.videoUrl}
          />
        </div>
      )}

      {format === TestimonialFormat.AUDIO && (
        <div className="grid gap-2">
          <Label>Fichier audio (2 min max recommandé)</Label>
          <AudioPicker value={audioMedia} media={audioFiles} onChange={setAudioMedia} />
        </div>
      )}

      {format !== TestimonialFormat.TEXT && (
        <div className="grid gap-2">
          <Label htmlFor="quote">Légende / citation courte (facultatif)</Label>
          <Textarea id="quote" name="quote" rows={2} defaultValue={initialValues?.quote} />
        </div>
      )}

      <div className="grid gap-2">
        <Label>Photo (facultatif)</Label>
        <MediaPicker value={photoMedia} media={images} onChange={setPhotoMedia} />
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

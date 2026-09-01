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
import { PageSectionsEditor } from "@/components/admin/PageSectionsEditor";
import { slugify } from "@/lib/validations/post";
import type { PageSection } from "@/lib/validations/page-sections";
import type { ActionResult } from "@/lib/actions/media";

type PageInitialValues = {
  title?: string;
  slug?: string;
  seoTitle?: string;
  seoDescription?: string;
  status?: "DRAFT" | "PUBLISHED";
  sections?: PageSection[];
};

export function PageForm({
  action,
  initialValues,
  submitLabel = "Enregistrer",
}: {
  action: (formData: FormData) => Promise<ActionResult<unknown> | void>;
  initialValues?: PageInitialValues;
  submitLabel?: string;
}) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [slug, setSlug] = useState(initialValues?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initialValues?.slug));
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

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

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="seoTitle">Titre SEO (facultatif)</Label>
          <Input id="seoTitle" name="seoTitle" defaultValue={initialValues?.seoTitle} />
        </div>
        <div className="grid gap-2 sm:max-w-xs">
          <Label>Statut</Label>
          <Select name="status" defaultValue={initialValues?.status ?? "DRAFT"}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DRAFT">Brouillon</SelectItem>
              <SelectItem value="PUBLISHED">Publié</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="seoDescription">Description SEO (facultatif)</Label>
        <Textarea id="seoDescription" name="seoDescription" rows={2} defaultValue={initialValues?.seoDescription} />
      </div>

      <div className="grid gap-2">
        <Label>Contenu de la page</Label>
        <PageSectionsEditor initialSections={initialValues?.sections ?? []} />
      </div>

      <div>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Enregistrement..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { MediaPicker, type MediaItem } from "@/components/admin/MediaPicker";
import type { ActionResult } from "@/lib/actions/media";

type PartnerInitialValues = {
  name?: string;
  url?: string;
  order?: number;
  active?: boolean;
  logoMedia?: MediaItem | null;
};

export function PartnerForm({
  action,
  initialValues,
  media,
  submitLabel = "Enregistrer",
}: {
  action: (formData: FormData) => Promise<ActionResult | void>;
  initialValues?: PartnerInitialValues;
  media: MediaItem[];
  submitLabel?: string;
}) {
  const router = useRouter();
  const [logo, setLogo] = useState<MediaItem | null>(initialValues?.logoMedia ?? null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!logo) {
      toast.error("Veuillez choisir un logo.");
      return;
    }
    const formData = new FormData(e.currentTarget);
    formData.set("logoMediaId", logo.id);

    startTransition(async () => {
      const result = await action(formData);
      if (result && !result.success) {
        toast.error(result.message ?? "Une erreur est survenue.");
      } else if (result?.success) {
        toast.success("Enregistré.");
        router.push("/admin/partenaires");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-5">
      <div className="grid gap-2">
        <Label htmlFor="name">Nom</Label>
        <Input id="name" name="name" required defaultValue={initialValues?.name} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="url">Site web (facultatif)</Label>
        <Input id="url" name="url" type="url" placeholder="https://" defaultValue={initialValues?.url} />
      </div>

      <div className="grid gap-2">
        <Label>Logo</Label>
        <MediaPicker value={logo} media={media} onChange={setLogo} />
      </div>

      <div className="grid gap-2 sm:max-w-32">
        <Label htmlFor="order">Ordre d&apos;affichage</Label>
        <Input id="order" name="order" type="number" defaultValue={initialValues?.order ?? 0} />
      </div>

      <div className="flex items-center justify-between rounded-lg border border-ink-200 px-4 py-3">
        <div>
          <p className="text-sm font-medium text-ink-900">Visible sur le site</p>
          <p className="text-xs text-ink-500">Désactivez pour masquer sans supprimer.</p>
        </div>
        <Switch name="active" defaultChecked={initialValues?.active ?? true} />
      </div>

      <div>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Enregistrement..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}

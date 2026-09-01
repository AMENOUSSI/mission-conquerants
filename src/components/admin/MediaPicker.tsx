"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { ImageSquare, UploadSimple, X } from "@phosphor-icons/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { uploadMediaAction } from "@/lib/actions/media";
import { cn } from "@/lib/utils";

export type MediaItem = { id: string; url: string; altText: string | null };

export function MediaPicker({
  value,
  media,
  onChange,
}: {
  value: MediaItem | null;
  media: MediaItem[];
  onChange: (media: MediaItem | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const [library, setLibrary] = useState(media);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleUpload(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    startTransition(async () => {
      const result = await uploadMediaAction(formData);
      if (result.success && result.data) {
        const newItem = { id: result.data.id, url: result.data.url, altText: null };
        setLibrary((prev) => [newItem, ...prev]);
        onChange(newItem);
        setOpen(false);
        toast.success("Image téléversée.");
      } else {
        toast.error(result.message ?? "Le téléversement a échoué.");
      }
    });
  }

  return (
    <div>
      {value ? (
        <div className="relative aspect-video w-full max-w-xs overflow-hidden rounded-lg border border-ink-200 bg-surface-muted">
          <Image src={value.url} alt={value.altText ?? ""} fill className="object-cover" />
          <button
            type="button"
            onClick={() => onChange(null)}
            aria-label="Retirer l'image"
            className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-navy-900/70 text-white hover:bg-navy-900"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button
              type="button"
              className="flex aspect-video w-full max-w-xs flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-ink-200 bg-surface-muted/60 text-ink-500 hover:border-accent-500 hover:text-accent-700"
            >
              <ImageSquare size={24} />
              <span className="text-sm font-medium">Choisir une image</span>
            </button>
          </DialogTrigger>
          <MediaDialogContent
            library={library}
            isPending={isPending}
            fileInputRef={fileInputRef}
            onPick={(item) => {
              onChange(item);
              setOpen(false);
            }}
            onUpload={handleUpload}
          />
        </Dialog>
      )}
      {value && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button type="button" variant="outline" size="sm" className="mt-2">
              Changer l&apos;image
            </Button>
          </DialogTrigger>
          <MediaDialogContent
            library={library}
            isPending={isPending}
            fileInputRef={fileInputRef}
            onPick={(item) => {
              onChange(item);
              setOpen(false);
            }}
            onUpload={handleUpload}
          />
        </Dialog>
      )}
    </div>
  );
}

function MediaDialogContent({
  library,
  isPending,
  fileInputRef,
  onPick,
  onUpload,
}: {
  library: MediaItem[];
  isPending: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onPick: (item: MediaItem) => void;
  onUpload: (file: File) => void;
}) {
  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Choisir une image</DialogTitle>
      </DialogHeader>
      <Tabs defaultValue="library">
        <TabsList>
          <TabsTrigger value="library">Bibliothèque</TabsTrigger>
          <TabsTrigger value="upload">Téléverser</TabsTrigger>
        </TabsList>
        <TabsContent value="library" className="mt-4">
          {library.length === 0 ? (
            <p className="py-10 text-center text-sm text-ink-500">
              Aucune image dans la bibliothèque pour le moment.
            </p>
          ) : (
            <div className="grid max-h-96 grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-4">
              {library.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onPick(item)}
                  className={cn(
                    "relative aspect-square overflow-hidden rounded-lg border border-ink-200 hover:ring-2 hover:ring-accent-500",
                  )}
                >
                  <Image src={item.url} alt={item.altText ?? ""} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="upload" className="mt-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onUpload(file);
            }}
          />
          <button
            type="button"
            disabled={isPending}
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-ink-200 bg-surface-muted/60 py-14 text-ink-500 hover:border-accent-500 hover:text-accent-700 disabled:opacity-60"
          >
            <UploadSimple size={24} />
            <span className="text-sm font-medium">
              {isPending ? "Téléversement..." : "Cliquez pour choisir un fichier"}
            </span>
          </button>
        </TabsContent>
      </Tabs>
    </DialogContent>
  );
}

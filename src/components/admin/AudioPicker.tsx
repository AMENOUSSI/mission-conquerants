"use client";

import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { MusicNotes, UploadSimple, X } from "@phosphor-icons/react";
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

export type AudioItem = { id: string; url: string; filename: string };

export function AudioPicker({
  value,
  media,
  onChange,
}: {
  value: AudioItem | null;
  media: AudioItem[];
  onChange: (media: AudioItem | null) => void;
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
        const newItem = { id: result.data.id, url: result.data.url, filename: file.name };
        setLibrary((prev) => [newItem, ...prev]);
        onChange(newItem);
        setOpen(false);
        toast.success("Fichier audio téléversé.");
      } else {
        toast.error(result.message ?? "Le téléversement a échoué.");
      }
    });
  }

  return (
    <div>
      {value ? (
        <div className="flex w-full max-w-sm items-center gap-3 rounded-lg border border-ink-200 bg-surface-muted p-3">
          <audio src={value.url} controls className="h-9 flex-1" />
          <button
            type="button"
            onClick={() => onChange(null)}
            aria-label="Retirer le fichier audio"
            className="flex size-7 shrink-0 items-center justify-center rounded-full bg-navy-900/70 text-white hover:bg-navy-900"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button
              type="button"
              className="flex w-full max-w-sm flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-ink-200 bg-surface-muted/60 py-8 text-ink-500 hover:border-accent-500 hover:text-accent-700"
            >
              <MusicNotes size={24} />
              <span className="text-sm font-medium">Choisir un fichier audio</span>
            </button>
          </DialogTrigger>
          <AudioDialogContent
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
              Changer le fichier
            </Button>
          </DialogTrigger>
          <AudioDialogContent
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

function AudioDialogContent({
  library,
  isPending,
  fileInputRef,
  onPick,
  onUpload,
}: {
  library: AudioItem[];
  isPending: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onPick: (item: AudioItem) => void;
  onUpload: (file: File) => void;
}) {
  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Choisir un fichier audio</DialogTitle>
      </DialogHeader>
      <Tabs defaultValue="library">
        <TabsList>
          <TabsTrigger value="library">Bibliothèque</TabsTrigger>
          <TabsTrigger value="upload">Téléverser</TabsTrigger>
        </TabsList>
        <TabsContent value="library" className="mt-4">
          {library.length === 0 ? (
            <p className="py-10 text-center text-sm text-ink-500">
              Aucun fichier audio dans la bibliothèque pour le moment.
            </p>
          ) : (
            <div className="flex max-h-96 flex-col gap-2 overflow-y-auto">
              {library.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onPick(item)}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg border border-ink-200 p-2.5 text-left text-sm hover:border-accent-500 hover:bg-accent-50",
                  )}
                >
                  <MusicNotes size={18} className="shrink-0 text-accent-600" />
                  <span className="truncate">{item.filename}</span>
                </button>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="upload" className="mt-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
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

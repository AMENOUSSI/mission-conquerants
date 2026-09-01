"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { UploadSimple, Trash, VideoCamera, FilePdf } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { uploadMediaAction, deleteMediaAction } from "@/lib/actions/media";
import { MediaType } from "@/generated/prisma/browser";

export type MediaLibraryItem = {
  id: string;
  url: string;
  type: MediaType;
  filename: string;
  altText: string | null;
  createdAt: string;
};

export function MediaLibraryGrid({ initialMedia }: { initialMedia: MediaLibraryItem[] }) {
  const [items, setItems] = useState(initialMedia);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleUpload(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    startTransition(async () => {
      const result = await uploadMediaAction(formData);
      if (result.success && result.data) {
        setItems((prev) => [
          {
            id: result.data!.id,
            url: result.data!.url,
            type: file.type.startsWith("video")
              ? MediaType.VIDEO
              : file.type === "application/pdf"
                ? MediaType.PDF
                : MediaType.IMAGE,
            filename: file.name,
            altText: null,
            createdAt: new Date().toISOString(),
          },
          ...prev,
        ]);
        toast.success("Fichier téléversé.");
      } else {
        toast.error(result.message ?? "Le téléversement a échoué.");
      }
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteMediaAction(id);
      if (result.success) {
        setItems((prev) => prev.filter((item) => item.id !== id));
        toast.success("Média supprimé.");
      } else {
        toast.error(result.message ?? "Suppression impossible.");
      }
    });
  }

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*,application/pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
          e.target.value = "";
        }}
      />
      <Button type="button" disabled={isPending} onClick={() => fileInputRef.current?.click()}>
        <UploadSimple size={16} weight="bold" />
        {isPending ? "Téléversement..." : "Téléverser un fichier"}
      </Button>

      {items.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-ink-200 bg-surface-muted/60 px-6 py-16 text-center text-sm text-ink-500">
          La bibliothèque est vide. Téléversez votre première image.
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative aspect-square overflow-hidden rounded-lg border border-ink-200 bg-surface-muted"
            >
              {item.type === MediaType.IMAGE ? (
                <Image src={item.url} alt={item.altText ?? item.filename} fill className="object-cover" />
              ) : (
                <div className="flex size-full flex-col items-center justify-center gap-1.5 p-3 text-center text-ink-500">
                  {item.type === MediaType.VIDEO ? <VideoCamera size={24} /> : <FilePdf size={24} />}
                  <span className="line-clamp-2 text-xs">{item.filename}</span>
                </div>
              )}
              <div className="absolute inset-0 flex items-end justify-end bg-navy-900/0 p-2 opacity-0 transition-opacity group-hover:bg-navy-900/30 group-hover:opacity-100">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      className="bg-white/90 text-destructive hover:bg-white"
                      aria-label="Supprimer"
                    >
                      <Trash size={14} />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Supprimer ce fichier ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Si ce média est encore utilisé sur le site, la suppression sera refusée.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(item.id)}
                        className="bg-destructive text-white hover:bg-destructive/90"
                      >
                        Supprimer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

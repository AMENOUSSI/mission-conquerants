"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Envelope, EnvelopeOpen, Trash } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { markContactRead, deleteContact } from "@/lib/actions/contacts";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  read: boolean;
  createdAt: string;
};

export function MessageInbox({ initialMessages }: { initialMessages: ContactMessage[] }) {
  const [messages, setMessages] = useState(initialMessages);
  const [active, setActive] = useState<ContactMessage | null>(null);
  const [isPending, startTransition] = useTransition();

  function openMessage(message: ContactMessage) {
    setActive(message);
    if (!message.read) {
      startTransition(async () => {
        await markContactRead(message.id, true);
        setMessages((prev) => prev.map((m) => (m.id === message.id ? { ...m, read: true } : m)));
      });
    }
  }

  function toggleRead(message: ContactMessage) {
    startTransition(async () => {
      const result = await markContactRead(message.id, !message.read);
      if (result.success) {
        setMessages((prev) =>
          prev.map((m) => (m.id === message.id ? { ...m, read: !message.read } : m)),
        );
      }
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteContact(id);
      if (result.success) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        setActive(null);
        toast.success("Message supprimé.");
      } else {
        toast.error(result.message ?? "Suppression impossible.");
      }
    });
  }

  if (messages.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-ink-200 bg-surface-muted/60 px-6 py-16 text-center text-sm text-ink-500">
        Aucun message reçu pour le moment.
      </div>
    );
  }

  return (
    <>
      <ul className="divide-y divide-ink-200 overflow-hidden rounded-xl border border-ink-200 bg-surface">
        {messages.map((message) => (
          <li key={message.id}>
            <button
              type="button"
              onClick={() => openMessage(message)}
              className={cn(
                "flex w-full items-start gap-3 px-4 py-3.5 text-left hover:bg-surface-muted",
                !message.read && "bg-accent-100/40",
              )}
            >
              {message.read ? (
                <EnvelopeOpen size={18} className="mt-0.5 shrink-0 text-ink-500" />
              ) : (
                <Envelope size={18} weight="fill" className="mt-0.5 shrink-0 text-accent-600" />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className={cn("truncate text-sm", !message.read ? "font-semibold text-ink-900" : "text-ink-900")}>
                    {message.name}
                    <span className="ml-2 font-normal text-ink-500">{message.email}</span>
                  </p>
                  <span className="shrink-0 text-xs text-ink-500">{formatDateTime(message.createdAt)}</span>
                </div>
                <p className="mt-0.5 truncate text-sm text-ink-500">
                  {message.subject || message.message}
                </p>
              </div>
              {!message.read && <Badge className="shrink-0 bg-accent-600 text-white">Nouveau</Badge>}
            </button>
          </li>
        ))}
      </ul>

      <Dialog open={Boolean(active)} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent>
          {active && (
            <>
              <DialogHeader>
                <DialogTitle>{active.subject || "Message de contact"}</DialogTitle>
                <DialogDescription>
                  {active.name} · {active.email} · {formatDateTime(active.createdAt)}
                </DialogDescription>
              </DialogHeader>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink-700">{active.message}</p>
              <DialogFooter className="mt-2 gap-2 sm:justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleDelete(active.id)}
                  disabled={isPending}
                >
                  <Trash size={16} />
                  Supprimer
                </Button>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => toggleRead(active)} disabled={isPending}>
                    Marquer {active.read ? "non lu" : "lu"}
                  </Button>
                  <Button asChild>
                    <a href={`mailto:${active.email}`}>Répondre</a>
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

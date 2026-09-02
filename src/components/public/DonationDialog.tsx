"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Bank, Check, Copy, DeviceMobile } from "@phosphor-icons/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { getSiteSettings } from "@/lib/site-settings";

type DonationSettings = Pick<
  Awaited<ReturnType<typeof getSiteSettings>>,
  | "donationBankName"
  | "donationBankAccountName"
  | "donationBankAccountNumber"
  | "donationMixxTogoNumber"
  | "donationMoovFloozNumbers"
>;

function CopyableRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value.replace(/\s+/g, ""));
      setCopied(true);
      toast.success("Copié dans le presse-papiers.");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Impossible de copier automatiquement.");
    }
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/40 px-3 py-2.5">
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate font-mono text-sm font-semibold tracking-wide text-foreground">
          {value}
        </p>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={`Copier : ${label}`}
        className="flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent-100 hover:text-accent-700"
      >
        {copied ? <Check size={16} weight="bold" /> : <Copy size={16} />}
      </button>
    </div>
  );
}

/**
 * Drop-in replacement for the "Nous soutenir" link: renders as the same
 * button, but opens a dialog with our donation accounts (from SiteSettings,
 * editable in /admin/parametres) instead of navigating away.
 */
export function DonationDialog({
  className,
  children,
  onOpenChange,
  settings,
}: {
  className?: string;
  children: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
  settings: DonationSettings;
}) {
  const bankAccountNumber = settings.donationBankAccountNumber?.trim();
  const mixxTogoNumber = settings.donationMixxTogoNumber?.trim();
  const moovFloozNumbers =
    settings.donationMoovFloozNumbers
      ?.split(",")
      .map((n) => n.trim())
      .filter(Boolean) ?? [];

  const hasAnyDonationInfo = Boolean(bankAccountNumber) || Boolean(mixxTogoNumber) || moovFloozNumbers.length > 0;

  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger className={className}>{children}</DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            Faire un <span className="text-accent-600">don</span>
          </DialogTitle>
          <DialogDescription>
            Merci de soutenir la mission via l&apos;un des comptes ci-dessous.
          </DialogDescription>
        </DialogHeader>

        {hasAnyDonationInfo ? (
          <div className="space-y-4">
            {bankAccountNumber && (
              <div className="rounded-xl border border-border p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Bank size={18} weight="fill" className="text-accent-600" />
                  {settings.donationBankName?.trim() || "Compte bancaire"}
                </div>
                <div className="mt-3 space-y-2">
                  {settings.donationBankAccountName?.trim() && (
                    <CopyableRow label="Nom du compte" value={settings.donationBankAccountName.trim()} />
                  )}
                  <CopyableRow label="Numéro du compte" value={bankAccountNumber} />
                </div>
              </div>
            )}

            {mixxTogoNumber && (
              <div className="rounded-xl border border-border p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <DeviceMobile size={18} weight="fill" className="text-accent-600" />
                  Mixx Togo
                </div>
                <div className="mt-3 space-y-2">
                  <CopyableRow label="Numéro" value={mixxTogoNumber} />
                </div>
              </div>
            )}

            {moovFloozNumbers.length > 0 && (
              <div className="rounded-xl border border-border p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <DeviceMobile size={18} weight="fill" className="text-accent-600" />
                  Moov Money Flooz
                </div>
                <div className="mt-3 space-y-2">
                  {moovFloozNumbers.map((number) => (
                    <CopyableRow key={number} label="Numéro" value={number} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Aucune information de don n&apos;est disponible pour le moment.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}

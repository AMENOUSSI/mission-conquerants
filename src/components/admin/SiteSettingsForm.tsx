"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ActionResult } from "@/lib/actions/media";

type SiteSettingsValues = {
  siteName: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string | null;
  whatsappNumber: string | null;
  address: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  youtubeUrl: string | null;
  footerNote: string;
  heroTitle: string;
  heroSubtitle: string;
  missionText: string;
  visionText: string;
  heroVerseText: string;
  heroVerseReference: string;
  donationBankName: string | null;
  donationBankAccountName: string | null;
  donationBankAccountNumber: string | null;
  donationMixxTogoNumber: string | null;
  donationMoovFloozNumbers: string | null;
};

export function SiteSettingsForm({
  action,
  initialValues,
}: {
  action: (formData: FormData) => Promise<ActionResult>;
  initialValues: SiteSettingsValues;
}) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await action(formData);
      if (result.success) {
        toast.success("Paramètres enregistrés.");
      } else {
        toast.error(result.message ?? "Une erreur est survenue.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-6">
      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="home">Page d&apos;accueil</TabsTrigger>
          <TabsTrigger value="donations">Dons</TabsTrigger>
        </TabsList>

        <TabsContent value="general" forceMount className="mt-6 flex flex-col gap-5 data-[state=inactive]:hidden">
          <div className="grid gap-2">
            <Label htmlFor="siteName">Nom du site</Label>
            <Input id="siteName" name="siteName" required defaultValue={initialValues.siteName} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tagline">Slogan</Label>
            <Input id="tagline" name="tagline" required defaultValue={initialValues.tagline} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="contactEmail">E-mail de contact</Label>
            <Input
              id="contactEmail"
              name="contactEmail"
              type="email"
              required
              defaultValue={initialValues.contactEmail}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="contactPhone">Téléphone (facultatif)</Label>
            <Input id="contactPhone" name="contactPhone" defaultValue={initialValues.contactPhone ?? ""} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="whatsappNumber">Numéro WhatsApp (facultatif)</Label>
            <Input
              id="whatsappNumber"
              name="whatsappNumber"
              placeholder="+228 91 39 42 43"
              defaultValue={initialValues.whatsappNumber ?? ""}
            />
            <p className="text-xs text-muted-foreground">
              Avec l&apos;indicatif pays. Fait apparaître le bouton WhatsApp et l&apos;icône dans le pied de
              page sur le site public ; laisser vide pour les masquer.
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="address">Adresse (facultatif)</Label>
            <Input id="address" name="address" defaultValue={initialValues.address ?? ""} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="facebookUrl">Facebook (facultatif)</Label>
            <Input id="facebookUrl" name="facebookUrl" type="url" defaultValue={initialValues.facebookUrl ?? ""} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="instagramUrl">Instagram (facultatif)</Label>
            <Input
              id="instagramUrl"
              name="instagramUrl"
              type="url"
              defaultValue={initialValues.instagramUrl ?? ""}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="youtubeUrl">YouTube (facultatif)</Label>
            <Input id="youtubeUrl" name="youtubeUrl" type="url" defaultValue={initialValues.youtubeUrl ?? ""} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="footerNote">Mention en pied de page</Label>
            <Input id="footerNote" name="footerNote" required defaultValue={initialValues.footerNote} />
          </div>
        </TabsContent>

        <TabsContent value="home" forceMount className="mt-6 flex flex-col gap-5 data-[state=inactive]:hidden">
          <div className="grid gap-2">
            <Label htmlFor="heroTitle">Titre principal</Label>
            <Textarea id="heroTitle" name="heroTitle" required rows={2} defaultValue={initialValues.heroTitle} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="heroSubtitle">Sous-titre</Label>
            <Textarea
              id="heroSubtitle"
              name="heroSubtitle"
              required
              rows={2}
              defaultValue={initialValues.heroSubtitle}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="missionText">Texte de mission</Label>
            <Textarea id="missionText" name="missionText" required rows={4} defaultValue={initialValues.missionText} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="visionText">Texte de vision</Label>
            <Textarea id="visionText" name="visionText" required rows={4} defaultValue={initialValues.visionText} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="heroVerseText">Verset (sous les boutons de l&apos;accueil)</Label>
            <Textarea
              id="heroVerseText"
              name="heroVerseText"
              required
              rows={3}
              defaultValue={initialValues.heroVerseText}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="heroVerseReference">Référence du verset</Label>
            <Input
              id="heroVerseReference"
              name="heroVerseReference"
              required
              defaultValue={initialValues.heroVerseReference}
            />
          </div>
        </TabsContent>

        <TabsContent
          value="donations"
          forceMount
          className="mt-6 flex flex-col gap-5 data-[state=inactive]:hidden"
        >
          <p className="text-sm text-muted-foreground">
            Comptes affichés dans la fenêtre &laquo;&nbsp;Faire un don&nbsp;&raquo; ouverte par le
            bouton &laquo;&nbsp;Nous soutenir&nbsp;&raquo;. Laisser un champ vide masque le bloc
            correspondant.
          </p>
          <div className="grid gap-2">
            <Label htmlFor="donationBankName">Nom de la banque</Label>
            <Input
              id="donationBankName"
              name="donationBankName"
              placeholder="Bank of Africa"
              defaultValue={initialValues.donationBankName ?? ""}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="donationBankAccountName">Nom du compte</Label>
            <Input
              id="donationBankAccountName"
              name="donationBankAccountName"
              placeholder="MISSION LES CONQUERANTS"
              defaultValue={initialValues.donationBankAccountName ?? ""}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="donationBankAccountNumber">Numéro du compte</Label>
            <Input
              id="donationBankAccountNumber"
              name="donationBankAccountNumber"
              placeholder="00 17 72 20 00 03"
              defaultValue={initialValues.donationBankAccountNumber ?? ""}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="donationMixxTogoNumber">Numéro Mixx Togo</Label>
            <Input
              id="donationMixxTogoNumber"
              name="donationMixxTogoNumber"
              placeholder="+228 91 39 42 43"
              defaultValue={initialValues.donationMixxTogoNumber ?? ""}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="donationMoovFloozNumbers">Numéros Moov Money Flooz</Label>
            <Input
              id="donationMoovFloozNumbers"
              name="donationMoovFloozNumbers"
              placeholder="+228 98 85 25 09, +228 98 50 32 53"
              defaultValue={initialValues.donationMoovFloozNumbers ?? ""}
            />
            <p className="text-xs text-muted-foreground">Séparez plusieurs numéros par une virgule.</p>
          </div>
        </TabsContent>
      </Tabs>

      <div>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Enregistrement..." : "Enregistrer les paramètres"}
        </Button>
      </div>
    </form>
  );
}

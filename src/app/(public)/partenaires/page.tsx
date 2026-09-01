import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/public/PageHeader";
import { Container } from "@/components/public/Container";
import { EmptyState } from "@/components/public/EmptyState";
import { Reveal } from "@/components/public/Reveal";
import { getActivePartners } from "@/lib/content";

export const metadata: Metadata = {
  title: "Partenaires",
  description: "Les organisations et ministères qui accompagnent la Mission Les Conquérants.",
};

export default async function PartnersPage() {
  const partners = await getActivePartners();

  return (
    <>
      <PageHeader
        title="Partenaires"
        subtitle="Les organisations et ministères qui accompagnent notre travail auprès des communautés."
      />
      <section className="py-14 sm:py-16">
        <Container>
          {partners.length === 0 ? (
            <EmptyState message="Aucun partenaire à afficher pour le moment." />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {partners.map((partner, i) => {
                const card = (
                  <div className="flex h-full flex-col items-center justify-center gap-4 rounded-2xl border border-ink-200 bg-surface p-8 text-center transition-colors hover:border-accent-500">
                    <Image
                      src={partner.logoMedia.url}
                      alt={partner.logoMedia.altText ?? partner.name}
                      width={160}
                      height={64}
                      className="h-14 w-auto object-contain"
                    />
                    <p className="text-sm font-medium text-ink-700">{partner.name}</p>
                  </div>
                );
                return (
                  <Reveal key={partner.id} delay={(i % 3) * 0.06}>
                    {partner.url ? (
                      <a href={partner.url} target="_blank" rel="noreferrer noopener" className="block h-full">
                        {card}
                      </a>
                    ) : (
                      card
                    )}
                  </Reveal>
                );
              })}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PageSections } from "@/components/public/PageSections";
import { FounderBio } from "@/components/public/FounderBio";
import { MissionVisionSplit } from "@/components/public/MissionVisionSplit";
import { OperationAreas } from "@/components/public/OperationAreas";
import { Leadership } from "@/components/public/Leadership";
import { StatsStrip } from "@/components/public/StatsStrip";
import { Container } from "@/components/public/Container";
import { Reveal } from "@/components/public/Reveal";
import { getPublishedPageBySlug } from "@/lib/content";
import { getSiteSettings } from "@/lib/site-settings";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublishedPageBySlug("a-propos");
  if (!page) return {};
  return { title: page.seoTitle ?? page.title, description: page.seoDescription ?? undefined };
}

export default async function AboutPage() {
  const [page, settings] = await Promise.all([
    getPublishedPageBySlug("a-propos"),
    getSiteSettings(),
  ]);
  if (!page) notFound();

  return (
    <>
      <PageSections sections={page.sections} />

      <FounderBio />

      <MissionVisionSplit missionText={settings.missionText} visionText={settings.visionText} />

      <OperationAreas />

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-surface-muted">
              <Image
                src="/seed-media/equipe-mission.jpg"
                alt="L'équipe de la Mission Les Conquérants sur le terrain"
                fill
                sizes="(min-width: 1024px) 560px, 100vw"
                className="object-cover"
              />
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="font-display text-2xl font-semibold text-ink-900 sm:text-3xl">
                Une équipe engagée sur le terrain
              </h2>
              <p className="mt-4 text-base leading-relaxed text-ink-700">
                Nos équipes se déplacent régulièrement pour rencontrer les communautés que
                nous accompagnons, écouter leurs besoins et évangéliser dans les milieux non
                atteints. Chaque déplacement est porté par l&apos;intercession et se poursuit
                par un engagement concret auprès des familles rencontrées.
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      <Leadership />

      <StatsStrip stats={settings.stats} />
    </>
  );
}

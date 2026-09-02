import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/public/Container";
import { Reveal } from "@/components/public/Reveal";
import { GlobeGraphic } from "@/components/public/GlobeGraphic";
import { DonationDialog } from "@/components/public/DonationDialog";
import type { getSiteSettings } from "@/lib/site-settings";

export function FinalCta({
  settings,
}: {
  settings: Awaited<ReturnType<typeof getSiteSettings>>;
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-accent-700 via-accent-600 to-accent-500 py-20 sm:py-32">
      <GlobeGraphic className="pointer-events-none absolute -bottom-40 -left-40 size-[36rem] text-white/10" />
      {/* Verset en watermark derrière le contenu */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden px-8 select-none"
      >
        <p className="max-w-5xl text-center font-display text-[2.2rem] leading-tight font-black text-white/8 sm:text-[3.5rem] lg:text-[4.5rem]">
          Je cherchai parmi eux un homme qui élevât une muraille…
        </p>
      </span>

      <Container className="relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold tracking-[0.25em] text-white/60 uppercase">
            Ézéchiel 22:30
          </p>
          <h2 className="mt-5 font-display text-3xl leading-[1.1] font-semibold tracking-tight text-white sm:text-5xl">
            Qui se tiendra dans la brèche ?
          </h2>
          <p className="mt-5 max-w-lg mx-auto text-base leading-relaxed text-white/85 sm:text-lg">
            Une génération est appelée à se lever. Serez-vous de ceux qui répondent à l&apos;appel ?
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-accent-700 shadow-lg transition-all hover:bg-white/95 hover:shadow-xl active:translate-y-px"
            >
              Rejoindre la mission
              <ArrowRight size={16} weight="bold" />
            </Link>
            <DonationDialog
              settings={settings}
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/50 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white/80 hover:bg-white/10 active:translate-y-px"
            >
              Nous soutenir
            </DonationDialog>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

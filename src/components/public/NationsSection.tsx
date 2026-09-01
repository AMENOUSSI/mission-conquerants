import { Container } from "@/components/public/Container";
import { Reveal } from "@/components/public/Reveal";
import { GlobeGraphic } from "@/components/public/GlobeGraphic";

const DOMAINS = [
  "Intercession",
  "Évangélisation",
  "Formation des leaders",
  "Conférences & séminaires",
  "Œuvres sociales",
];

export function NationsSection() {
  return (
    <section className="relative overflow-hidden bg-navy-900 py-24 sm:py-32">
      <GlobeGraphic className="pointer-events-none absolute top-1/2 left-1/2 size-[46rem] -translate-x-1/2 -translate-y-1/2 text-white/10 sm:size-[60rem]" />

      <Container className="relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium tracking-[0.22em] text-accent-400 uppercase">
            Notre portée
          </p>
          <h2 className="mt-5 font-display text-3xl leading-[1.1] font-semibold tracking-tight text-white sm:text-5xl">
            Notre appel ne s&apos;arrête pas à une frontière.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-navy-100 sm:text-lg">
            De notre communauté jusqu&apos;aux extrémités de la terre.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-12 flex flex-wrap items-center justify-center gap-3">
          {DOMAINS.map((domain) => (
            <span
              key={domain}
              className="rounded-full border border-white/20 bg-white/8 px-5 py-2.5 text-xs font-semibold tracking-wide text-navy-100 uppercase transition-colors duration-200 hover:border-accent-500/60 hover:bg-accent-600/20 hover:text-white"
            >
              {domain}
            </span>
          ))}
        </Reveal>

        {/* Verset ancre — Ézéchiel 22:30 */}
        <Reveal delay={0.2} className="mt-16 flex justify-center">
          <div className="flex items-center gap-6">
            <span aria-hidden className="h-px w-12 bg-white/20" />
            <p className="text-center text-xs font-medium tracking-[0.2em] text-white/35 uppercase">
              Ézéchiel 22:30
            </p>
            <span aria-hidden className="h-px w-12 bg-white/20" />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

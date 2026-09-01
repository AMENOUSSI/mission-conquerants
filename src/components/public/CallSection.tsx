import Image from "next/image";
import { Container } from "@/components/public/Container";
import { Reveal } from "@/components/public/Reveal";

export function CallSection({ missionText }: { missionText: string }) {
  return (
    <section id="appel" className="relative overflow-hidden bg-surface py-20 sm:py-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
          <Reveal>
            <div className="flex items-start gap-4">
              <span aria-hidden className="mt-2 h-16 w-[3px] shrink-0 rounded-full bg-accent-500" />
              <div>
                <p className="text-xs font-medium tracking-[0.22em] text-accent-700 uppercase">
                  Notre appel
                </p>
                <h2 className="mt-2 font-display text-3xl leading-[1.1] font-semibold tracking-tight text-ink-900 sm:text-5xl">
                  Nous sommes ceux qui se lèvent.
                </h2>
              </div>
            </div>
            <p className="mt-6 font-display text-6xl font-bold tracking-tight text-accent-600 sm:text-8xl">
              Nous.
            </p>
            <p className="mt-8 max-w-lg text-base leading-relaxed text-ink-700 sm:text-lg">
              {missionText}
            </p>
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-ink-500">
              Mission Les Conquérants est un mouvement d&apos;intercesseurs et d&apos;évangélistes
              engagés au Togo, portés par un seul appel : se tenir dans la brèche pour leur
              génération.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="relative lg:mt-10">
            <div className="relative aspect-[4/5] w-full max-w-md overflow-hidden rounded-3xl bg-surface-muted lg:ml-auto">
              <Image
                src="/seed-media/distribution-fournitures.jpg"
                alt="Une équipe de la Mission Les Conquérants sur le terrain, au service d'une communauté"
                fill
                sizes="(min-width: 1024px) 420px, 90vw"
                className="object-cover"
              />
            </div>
            <div
              aria-hidden
              className="absolute -bottom-6 -left-6 -z-10 hidden size-32 rounded-3xl border border-accent-500/40 sm:block"
            />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

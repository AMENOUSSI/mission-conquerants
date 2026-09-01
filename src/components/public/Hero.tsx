import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/public/Container";
import { Reveal } from "@/components/public/Reveal";
import { GlobeGraphic } from "@/components/public/GlobeGraphic";

export function Hero({
  title,
  subtitle,
  imageSrc,
  imageAlt,
}: {
  title: string;
  subtitle: string;
  imageSrc: string;
  imageAlt: string;
}) {
  return (
    <section className="relative -mt-16 min-h-[100dvh] overflow-hidden bg-navy-900 pt-16">
      <div className="absolute inset-0 -z-20">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_35%] saturate-[0.85] contrast-[1.05]"
        />
      </div>
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-900 via-navy-900/55 to-navy-900/10"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-900/90 via-navy-900/45 to-navy-900/10"
      />

      <GlobeGraphic className="pointer-events-none absolute -top-28 -right-32 hidden size-[34rem] text-white/20 sm:block" />

      <Container className="relative flex min-h-[calc(100dvh-4rem)] flex-col justify-between py-16 sm:py-20">
        <div className="flex flex-1 flex-col justify-center">
          <Reveal>
            <p className="text-xs font-medium tracking-[0.22em] text-accent-400 uppercase">
              Ézéchiel 22:30
            </p>
            <h1 className="mt-5 max-w-3xl font-display text-4xl leading-[1.08] font-semibold tracking-tight text-white sm:text-6xl lg:text-[4.25rem]">
              {title}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-navy-100 sm:text-lg">
              {subtitle}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-accent-600 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-accent-700 active:translate-y-px"
              >
                Rejoindre la mission
                <ArrowRight size={16} weight="bold" />
              </Link>
              <Link
                href="/a-propos"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10 active:translate-y-px"
              >
                Découvrir notre vision
              </Link>
            </div>
          </Reveal>
        </div>

        {/* Verset de référence — Ézéchiel 22:30 */}
        <Reveal delay={0.35}>
          <div className="mb-8 pt-10 sm:mb-10 sm:pt-14">
            <div className="flex items-start gap-4">
              <span aria-hidden className="mt-1 h-px w-10 shrink-0 bg-accent-500/60" />
              <blockquote className="max-w-xl">
                <p className="font-display text-sm leading-relaxed text-white/60 italic sm:text-base">
                  &ldquo;Je cherchai parmi eux un homme qui élevât une muraille, et qui se tînt à la brèche devant moi pour le pays…&rdquo;
                </p>
                <footer className="mt-2 text-xs font-semibold tracking-[0.18em] text-accent-400 uppercase">
                  Ézéchiel 22:30
                </footer>
              </blockquote>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

import { Compass, Target } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/public/Container";
import { Reveal } from "@/components/public/Reveal";

export function MissionVisionSplit({
  missionText,
  visionText,
}: {
  missionText: string;
  visionText: string;
}) {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="grid gap-6 md:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-2xl border border-ink-200 bg-surface p-8">
              <Target size={28} weight="duotone" className="text-accent-600" />
              <h2 className="mt-4 font-display text-xl font-semibold text-ink-900">
                Notre mission
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-700 sm:text-base">
                {missionText}
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="h-full rounded-2xl border border-ink-200 bg-surface p-8">
              <Compass size={28} weight="duotone" className="text-accent-600" />
              <h2 className="mt-4 font-display text-xl font-semibold text-ink-900">
                Notre vision
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-700 sm:text-base">
                {visionText}
              </p>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

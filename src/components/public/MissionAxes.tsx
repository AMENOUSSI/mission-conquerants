import {
  HandsPraying,
  GraduationCap,
  Megaphone,
  HandHeart,
} from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/public/Container";
import { Reveal } from "@/components/public/Reveal";

const AXES = [
  {
    number: "01",
    icon: HandsPraying,
    title: "Intercéder",
    text: "Se tenir dans la brèche.",
  },
  {
    number: "02",
    icon: GraduationCap,
    title: "Équiper",
    text: "Former une génération pour le Royaume.",
  },
  {
    number: "03",
    icon: Megaphone,
    title: "Évangéliser",
    text: "Porter l'Évangile jusqu'aux nations.",
  },
  {
    number: "04",
    icon: HandHeart,
    title: "Impacter",
    text: "Transformer des vies et des communautés.",
  },
];

export function MissionAxes() {
  return (
    <section id="mission" className="border-t border-ink-200 bg-surface-muted py-20 sm:py-28">
      <Container>
        <Reveal>
          <h2 className="max-w-xl font-display text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
            Notre mission
          </h2>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-ink-500">
            Quatre expressions concrètes d&apos;un même appel.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-x-12 gap-y-10 sm:grid-cols-2">
          {AXES.map((axis, i) => (
            <Reveal key={axis.number} delay={i * 0.07}>
              <div className="group relative overflow-hidden rounded-2xl border border-ink-200 bg-surface p-6 transition-all duration-300 hover:border-accent-500/40 hover:shadow-lg">
                {/* numéro décoratif en arrière-plan */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-2 -bottom-4 font-display text-[7rem] font-black leading-none text-ink-100 select-none transition-colors duration-300 group-hover:text-accent-100"
                >
                  {axis.number}
                </span>
                <div className="relative">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-100 text-accent-600 transition-colors duration-300 group-hover:bg-accent-600 group-hover:text-white">
                    <axis.icon size={22} weight="bold" />
                  </div>
                  <h3 className="mt-4 font-display text-xl font-semibold text-ink-900 sm:text-2xl">
                    {axis.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-500 sm:text-base">
                    {axis.text}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

import Image from "next/image";
import { GraduationCap, HandsPraying, UsersThree, HandHeart } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/public/Container";
import { Reveal } from "@/components/public/Reveal";

const MILESTONES = [
  {
    icon: HandsPraying,
    label: "L'appel",
    text: "Matthieu 9.36-38 — le Saint-Esprit lui enseigne l'importance de l'intercession ; l'appel à l'intercession et à l'évangélisation devient un fardeau pour son âme.",
  },
  {
    icon: GraduationCap,
    label: "Formation",
    text: "International School Of Ministry (ISOM), 2014-2015 — École des Disciples de Jeunesse en Mission, base de Lomé, 2018-2019.",
  },
  {
    icon: HandHeart,
    label: "Engagement",
    text: "Volontaire de la Fraternité Internationale de Prison au Togo, évangélisation en milieu carcéral de 2013 à 2023.",
  },
  {
    icon: UsersThree,
    label: "Famille",
    text: "Marié à Djedje Messiga Yawa, avec qui il a trois enfants : Nathanaëlle, Rhode et Samuel.",
  },
];

export function FounderBio() {
  return (
    <section id="fondateur" className="border-t border-ink-200 py-20 sm:py-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <Reveal className="lg:sticky lg:top-24 lg:self-start">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-surface-muted">
              <Image
                src="/seed-media/fondateur-anani-assigbe.jpg"
                alt="Anani Assigbe, fondateur de la Mission Les Conquérants"
                fill
                sizes="(min-width: 1024px) 420px, 100vw"
                className="object-cover"
              />
            </div>
            <p className="mt-4 font-display text-lg font-semibold text-ink-900">Anani Assigbe</p>
            <p className="text-sm leading-relaxed text-ink-500">
              Fondateur et coordinateur international, Lomé — Togo
            </p>
          </Reveal>

          <div>
            <Reveal>
              <p className="text-xs font-medium tracking-[0.18em] text-accent-600 uppercase">
                Le fondateur
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
                Un fardeau devenu mission
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-700">
                Missionnaire, conquérant de l&apos;armée du Seigneur Jésus-Christ sur la terre,
                Anani Assigbe réside à Lomé, au Togo. C&apos;est au cœur d&apos;une saison de
                rencontres surnaturelles, en 2018-2019, que Dieu lui enseigne l&apos;importance de
                l&apos;intercession dans son œuvre — un appel qui devient dès lors un fardeau pour
                son âme.
              </p>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-700">
                C&apos;est de ce fardeau qu&apos;est née, en septembre 2019 à Atakpamé, la Mission
                Les Conquérants : un mouvement de réveil appelé à porter la lumière et le salut de
                Dieu partout dans le monde, selon Ésaïe 49.6-8 — intercéder pour les nations,
                évangéliser les milieux non atteints, impacter des vies par la transformation, et
                démontrer l&apos;amour de Dieu à travers des œuvres sociales et une assistance
                spirituelle.
              </p>
            </Reveal>

            <ul className="mt-10 grid gap-6 border-t border-ink-200 pt-8 sm:grid-cols-2">
              {MILESTONES.map((item, i) => (
                <Reveal key={item.label} delay={i * 0.06}>
                  <li className="flex items-start gap-3.5">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent-100 text-accent-600">
                      <item.icon size={18} weight="bold" />
                    </span>
                    <div>
                      <p className="font-display text-sm font-semibold text-ink-900">
                        {item.label}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-ink-500">{item.text}</p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ul>

            <Reveal delay={0.15}>
              <p className="mt-8 max-w-2xl border-t border-ink-200 pt-8 text-sm leading-relaxed text-ink-500">
                C&apos;est aussi dans cette saison qu&apos;il rencontre Ruth puis Guy Mattana, qui
                deviennent des partenaires efficaces de la mission. Depuis 2019, ce partenariat
                permet chaque année une distribution de kits scolaires aux enfants orphelins et
                défavorisés à la rentrée, et de kits alimentaires à Noël, à Lomé, à Atakpamé et au
                village d&apos;Itokubê. Depuis 2021, l&apos;association Mattana, Cœur de
                missionnaire, basée à Saint-Julien en France, est notre partenaire financier et
                spirituel principal — toute notre gratitude à elle, ainsi qu&apos;à tous nos
                donateurs qui contribuent à l&apos;agrandissement du royaume de Dieu.
              </p>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}

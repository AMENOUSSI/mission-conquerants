import {
  HandsPraying,
  Megaphone,
  GraduationCap,
  UsersThree,
  HandHeart,
} from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/public/Container";
import { Reveal } from "@/components/public/Reveal";
import { SectionHeading } from "@/components/public/SectionHeading";

const DOMAINS = [
  {
    icon: HandsPraying,
    title: "Intercession",
    text: "Prier pour les nations et pour l'urgence du salut des âmes.",
  },
  {
    icon: Megaphone,
    title: "Évangélisation",
    text: "Porter la lumière de Jésus-Christ dans les milieux non atteints.",
  },
  {
    icon: GraduationCap,
    title: "Formation des leaders",
    text: "Préparer une génération à connaître Dieu et à rester ferme.",
  },
  {
    icon: UsersThree,
    title: "Conférences & séminaires",
    text: "Rassembler l'Église pour embraser et maintenir la flamme du réveil.",
  },
  {
    icon: HandHeart,
    title: "Œuvres sociales",
    text: "Soutenir les orphelins, les veuves et les personnes vulnérables.",
  },
];

export function OperationAreas() {
  return (
    <section className="border-t border-ink-200 py-16 sm:py-20">
      <Container>
        <Reveal>
          <SectionHeading
            title="Nos domaines d'action"
            subtitle="Cinq axes concrets à travers lesquels la mission se déploie sur le terrain."
          />
        </Reveal>
        <div className="mt-10 grid grid-cols-1 divide-y divide-ink-200 rounded-2xl border border-ink-200 bg-surface sm:grid-cols-5 sm:divide-x sm:divide-y-0">
          {DOMAINS.map((domain, i) => (
            <Reveal key={domain.title} delay={i * 0.05} className="p-6">
              <domain.icon size={26} weight="duotone" className="text-accent-600" />
              <h3 className="mt-4 font-display text-base font-semibold text-ink-900">
                {domain.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">{domain.text}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

import { Container } from "@/components/public/Container";
import { Reveal } from "@/components/public/Reveal";

type Stat = { value: string; label: string };

function isStatArray(value: unknown): value is Stat[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        "value" in item &&
        "label" in item,
    )
  );
}

export function StatsStrip({ stats }: { stats: unknown }) {
  if (!isStatArray(stats) || stats.length === 0) return null;

  return (
    <section className="bg-navy-900 py-14 sm:py-16">
      <Container>
        <Reveal>
          <dl className="grid grid-cols-1 gap-8 divide-y divide-white/10 sm:grid-cols-3 sm:gap-6 sm:divide-y-0">
            {stats.map((stat) => (
              <div key={stat.label} className="pt-6 text-center first:pt-0 sm:pt-0">
                <dd className="font-display text-4xl font-semibold text-white sm:text-5xl">
                  {stat.value}
                </dd>
                <dt className="mt-1 text-sm text-navy-200">{stat.label}</dt>
              </div>
            ))}
          </dl>
        </Reveal>
      </Container>
    </section>
  );
}

import { Container } from "@/components/public/Container";
import { Reveal } from "@/components/public/Reveal";

export function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="border-b border-ink-200 bg-surface py-12 sm:py-16">
      <Container>
        <Reveal>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-500">
              {subtitle}
            </p>
          )}
        </Reveal>
      </Container>
    </section>
  );
}

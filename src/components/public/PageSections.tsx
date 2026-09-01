import { Container } from "@/components/public/Container";
import { Reveal } from "@/components/public/Reveal";
import { RichContent } from "@/components/public/RichContent";
import { pageSectionsSchema as sectionsSchema } from "@/lib/validations/page-sections";

/** The admin's typed section blocks for freeform Pages (see Page.sections in the schema). */
export function PageSections({ sections }: { sections: unknown }) {
  const parsed = sectionsSchema.safeParse(sections);
  if (!parsed.success) return null;

  return (
    <>
      {parsed.data.map((section, i) => {
        if (section.type === "hero") {
          return (
            <section key={i} className="border-b border-ink-200 bg-surface py-14 sm:py-20">
              <Container className="max-w-3xl">
                <Reveal>
                  {section.data.eyebrow && (
                    <p className="text-sm font-medium text-accent-700">{section.data.eyebrow}</p>
                  )}
                  <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
                    {section.data.title}
                  </h1>
                  {section.data.subtitle && (
                    <p className="mt-4 text-lg leading-relaxed text-ink-500">
                      {section.data.subtitle}
                    </p>
                  )}
                </Reveal>
              </Container>
            </section>
          );
        }

        if (section.type === "richtext") {
          return (
            <section key={i} className="py-14 sm:py-16">
              <Container className="max-w-3xl">
                <Reveal>
                  {section.data.title && (
                    <h2 className="font-display text-2xl font-semibold text-ink-900">
                      {section.data.title}
                    </h2>
                  )}
                  <RichContent html={section.data.html} className={section.data.title ? "mt-4" : ""} />
                </Reveal>
              </Container>
            </section>
          );
        }

        if (section.type === "stats") {
          return (
            <section key={i} className="bg-navy-900 py-14 sm:py-16">
              <Container>
                <Reveal>
                  <dl className="grid grid-cols-1 gap-8 sm:grid-cols-3">
                    {section.data.items.map((stat) => (
                      <div key={stat.label} className="text-center">
                        <dd className="font-display text-4xl font-semibold text-white">
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

        return null;
      })}
    </>
  );
}

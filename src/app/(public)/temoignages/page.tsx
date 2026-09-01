import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/public/PageHeader";
import { Container } from "@/components/public/Container";
import { EmptyState } from "@/components/public/EmptyState";
import { Reveal } from "@/components/public/Reveal";
import { TestimonialCard } from "@/components/public/TestimonialCard";
import { getPublishedTestimonials } from "@/lib/content";
import { TestimonialCategory } from "@/generated/prisma/client";
import { TESTIMONIAL_CATEGORY_LABELS } from "@/lib/validations/testimonial";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Témoignages",
  description:
    "Témoignages des bénéficiaires des kits scolaires, des kits alimentaires et des actions de la Mission Les Conquérants.",
};

export default async function TestimonialsPage({
  searchParams,
}: PageProps<"/temoignages">) {
  const { categorie } = await searchParams;
  const activeCategory =
    typeof categorie === "string" &&
    (Object.values(TestimonialCategory) as string[]).includes(categorie)
      ? (categorie as TestimonialCategory)
      : undefined;

  const testimonials = await getPublishedTestimonials({ category: activeCategory });

  const filters = [
    { label: "Tous", value: undefined },
    ...Object.values(TestimonialCategory).map((c) => ({
      label: TESTIMONIAL_CATEGORY_LABELS[c],
      value: c,
    })),
  ];

  return (
    <>
      <PageHeader
        title="Témoignages"
        subtitle="Ce que vivent les personnes et communautés touchées par la mission — kits scolaires, kits alimentaires, évangélisation et œuvres sociales."
      />
      <section className="py-14 sm:py-16">
        <Container>
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => {
              const href = filter.value ? `/temoignages?categorie=${filter.value}` : "/temoignages";
              const isActive = activeCategory === filter.value;
              return (
                <Link
                  key={filter.label}
                  href={href}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-navy-900 text-white"
                      : "bg-surface-muted text-ink-500 hover:bg-accent-100 hover:text-accent-700",
                  )}
                >
                  {filter.label}
                </Link>
              );
            })}
          </div>

          {testimonials.length === 0 ? (
            <div className="mt-10">
              <EmptyState message="Aucun témoignage publié pour le moment. Revenez bientôt." />
            </div>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial, i) => (
                <Reveal key={testimonial.id} delay={(i % 6) * 0.05}>
                  <TestimonialCard testimonial={testimonial} />
                </Reveal>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}

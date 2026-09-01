import { Reveal } from "@/components/public/Reveal";
import { TestimonialCard } from "@/components/public/TestimonialCard";
import type { getPublishedTestimonials } from "@/lib/content";

type Testimonial = Awaited<ReturnType<typeof getPublishedTestimonials>>[number];

export function TestimonialsShowcase({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <div className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
      {testimonials.map((testimonial, i) => (
        <Reveal
          key={testimonial.id}
          delay={i * 0.08}
          className="w-[85%] shrink-0 snap-start sm:w-[380px]"
        >
          <TestimonialCard testimonial={testimonial} />
        </Reveal>
      ))}
    </div>
  );
}

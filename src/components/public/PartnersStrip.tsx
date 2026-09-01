import Image from "next/image";
import { Container } from "@/components/public/Container";
import { Reveal } from "@/components/public/Reveal";

type PartnerItem = {
  id: string;
  name: string;
  url: string | null;
  logoMedia: { url: string; altText: string | null };
};

export function PartnersStrip({ partners }: { partners: PartnerItem[] }) {
  if (partners.length === 0) return null;

  return (
    <section className="py-14 sm:py-16">
      <Container>
        <Reveal>
          <p className="text-center text-sm font-medium text-ink-500">
            Ils accompagnent la mission
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {partners.map((partner) => {
              const logo = (
                <Image
                  src={partner.logoMedia.url}
                  alt={partner.logoMedia.altText ?? partner.name}
                  width={140}
                  height={56}
                  className="h-12 w-auto object-contain grayscale transition-all hover:grayscale-0"
                />
              );
              return partner.url ? (
                <a key={partner.id} href={partner.url} target="_blank" rel="noreferrer noopener">
                  {logo}
                </a>
              ) : (
                <span key={partner.id}>{logo}</span>
              );
            })}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

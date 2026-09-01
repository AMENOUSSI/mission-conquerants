import type { Metadata } from "next";
import { EnvelopeSimple, Phone, MapPin } from "@phosphor-icons/react/dist/ssr";
import { PageHeader } from "@/components/public/PageHeader";
import { Container } from "@/components/public/Container";
import { Reveal } from "@/components/public/Reveal";
import { ContactForm } from "@/components/public/ContactForm";
import { getSiteSettings } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez la Mission Les Conquérants.",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <PageHeader
        title="Contact"
        subtitle="Une question, un projet, une envie de nous rejoindre ? Écrivez-nous."
      />
      <section className="py-14 sm:py-16">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <Reveal>
              <h2 className="font-display text-xl font-semibold text-ink-900">
                Nos coordonnées
              </h2>
              <ul className="mt-6 flex flex-col gap-5 text-sm">
                <li className="flex items-start gap-3">
                  <EnvelopeSimple size={20} className="mt-0.5 shrink-0 text-accent-600" />
                  <div>
                    <p className="font-medium text-ink-900">E-mail</p>
                    <a
                      href={`mailto:${settings.contactEmail}`}
                      className="text-ink-500 hover:text-accent-700"
                    >
                      {settings.contactEmail}
                    </a>
                  </div>
                </li>
                {settings.contactPhone && (
                  <li className="flex items-start gap-3">
                    <Phone size={20} className="mt-0.5 shrink-0 text-accent-600" />
                    <div>
                      <p className="font-medium text-ink-900">Téléphone</p>
                      <a
                        href={`tel:${settings.contactPhone}`}
                        className="text-ink-500 hover:text-accent-700"
                      >
                        {settings.contactPhone}
                      </a>
                    </div>
                  </li>
                )}
                {settings.address && (
                  <li className="flex items-start gap-3">
                    <MapPin size={20} className="mt-0.5 shrink-0 text-accent-600" />
                    <div>
                      <p className="font-medium text-ink-900">Adresse</p>
                      <p className="text-ink-500">{settings.address}</p>
                    </div>
                  </li>
                )}
              </ul>
            </Reveal>

            <Reveal delay={0.08}>
              <ContactForm />
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}

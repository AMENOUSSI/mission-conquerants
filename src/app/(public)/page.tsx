import { Hero } from "@/components/public/Hero";
import { CallSection } from "@/components/public/CallSection";
import { MissionAxes } from "@/components/public/MissionAxes";
import { NationsSection } from "@/components/public/NationsSection";
import { MissionsShowcase } from "@/components/public/MissionsShowcase";
import { ProjectsShowcase } from "@/components/public/ProjectsShowcase";
import { NewsSection } from "@/components/public/NewsSection";
import { ConferencesShowcase } from "@/components/public/ConferencesShowcase";
import { TestimonialsShowcase } from "@/components/public/TestimonialsShowcase";
import { SectionHeading } from "@/components/public/SectionHeading";
import { Container } from "@/components/public/Container";
import { Reveal } from "@/components/public/Reveal";
import { PartnersStrip } from "@/components/public/PartnersStrip";
import { FinalCta } from "@/components/public/FinalCta";
import { getSiteSettings } from "@/lib/site-settings";
import {
  getPublishedProjects,
  getUpcomingEvents,
  getPublishedPosts,
  getPublishedConferences,
  getPublishedTestimonials,
  getActivePartners,
} from "@/lib/content";

export default async function HomePage() {
  const [settings, projects, missions, posts, conferences, testimonials, partners] = await Promise.all([
    getSiteSettings(),
    getPublishedProjects(3),
    getUpcomingEvents(6),
    getPublishedPosts(3),
    getPublishedConferences(3),
    getPublishedTestimonials({ limit: 6 }),
    getActivePartners(),
  ]);

  return (
    <>
      <Hero
        title={settings.heroTitle}
        subtitle={settings.heroSubtitle}
        imageSrc="/seed-media/equipe-mission.jpg"
        imageAlt="L'équipe de la Mission Les Conquérants sur le terrain"
      />

      <CallSection missionText={settings.missionText} />

      <MissionAxes />

      <NationsSection />

      {missions.length > 0 && (
        <section className="border-t border-ink-200 py-16 sm:py-24">
          <Container>
            <Reveal>
              <SectionHeading
                title="Prochaines missions"
                subtitle="Des hommes et des femmes envoyés sur le terrain."
                viewAllHref="/evenements"
              />
            </Reveal>
            <div className="mt-12">
              <MissionsShowcase events={missions} />
            </div>
          </Container>
        </section>
      )}

      {projects.length > 0 && (
        <section className="border-t border-ink-200 bg-surface-muted py-16 sm:py-24">
          <Container>
            <Reveal>
              <SectionHeading
                title="Activités & projets"
                subtitle="Ce que nous mettons en œuvre auprès des communautés que nous accompagnons."
                viewAllHref="/activites-projets"
              />
            </Reveal>
            <div className="mt-12">
              <ProjectsShowcase projects={projects} />
            </div>
          </Container>
        </section>
      )}

      {posts.length > 0 && (
        <section className="border-t border-ink-200 py-16 sm:py-24">
          <Container>
            <Reveal>
              <SectionHeading title="Actualités" viewAllHref="/actualites" />
            </Reveal>
            <div className="mt-12">
              <NewsSection posts={posts} />
            </div>
          </Container>
        </section>
      )}

      {conferences.length > 0 && (
        <section className="border-t border-ink-200 bg-surface-muted py-16 sm:py-24">
          <Container>
            <Reveal>
              <SectionHeading
                title="Conférences"
                subtitle="Résumés vidéo de nos conférences et sessions d'enseignement."
                viewAllHref="/conferences"
              />
            </Reveal>
            <div className="mt-12">
              <ConferencesShowcase conferences={conferences} />
            </div>
          </Container>
        </section>
      )}

      {testimonials.length > 0 && (
        <section className="border-t border-ink-200 py-16 sm:py-24">
          <Container>
            <Reveal>
              <SectionHeading
                title="Témoignages"
                subtitle="Ce que vivent les personnes et communautés touchées par la mission."
                viewAllHref="/temoignages"
              />
            </Reveal>
            <div className="mt-12">
              <TestimonialsShowcase testimonials={testimonials} />
            </div>
          </Container>
        </section>
      )}

      <PartnersStrip partners={partners} />

      <FinalCta />
    </>
  );
}

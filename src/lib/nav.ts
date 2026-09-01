// The header CTA is "Nous soutenir" (support/donation intent), so "Contact"
// lives in the regular nav list without creating a duplicate-intent CTA.
export const PRIMARY_NAV = [
  { href: "/", label: "Accueil" },
  { href: "/a-propos", label: "À propos" },
  { href: "/activites-projets", label: "Projets" },
  { href: "/evenements", label: "Événements" },
  { href: "/actualites", label: "Actualités" },
  { href: "/contact", label: "Contact" },
] as const;

export const MOBILE_NAV = PRIMARY_NAV;

export const FOOTER_NAV = [
  ...PRIMARY_NAV,
  { href: "/conferences", label: "Conférences" },
  { href: "/temoignages", label: "Témoignages" },
  { href: "/galerie", label: "Galerie" },
  { href: "/partenaires", label: "Partenaires" },
] as const;

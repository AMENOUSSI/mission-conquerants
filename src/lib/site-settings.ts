import { prisma } from "@/lib/prisma";
import { cache } from "react";

const FALLBACK_SETTINGS = {
  id: "singleton",
  siteName: "Mission Les Conquérants",
  tagline: "Être la lumière des nations",
  contactEmail: "contact@missionlesconquerants.org",
  contactPhone: null as string | null,
  address: null as string | null,
  facebookUrl: null as string | null,
  instagramUrl: null as string | null,
  youtubeUrl: null as string | null,
  footerNote: "Mission Les Conquérants, Ézéchiel 22:30",
  heroTitle: "Qui se tiendra dans la brèche ?",
  heroSubtitle:
    "Une génération debout, appelée à se tenir dans la brèche et à porter la lumière du Christ jusqu'aux nations.",
  missionText:
    "Intercéder pour les nations, évangéliser les milieux non atteints, impacter pour que des vies soient transformées, et apporter un soutien social et spirituel qui démontre l'amour de Dieu.",
  visionText:
    "Être la lumière des nations et porter le salut de Jésus-Christ jusqu'aux extrémités de la terre.",
  stats: null as unknown,
  updatedAt: new Date(0),
};

/** Cached per-request: every page/layout reads the same settings without duplicate queries. */
export const getSiteSettings = cache(async () => {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: "singleton" },
    });
    return settings ?? FALLBACK_SETTINGS;
  } catch {
    return FALLBACK_SETTINGS;
  }
});

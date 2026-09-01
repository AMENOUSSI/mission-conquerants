import "dotenv/config";
import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { PrismaClient, Prisma, Role, ContentStatus, MediaType } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  // --- Super admin ---------------------------------------------------
  // Password is only ever set on first creation — re-running the seed
  // must never silently change (or misleadingly reprint) an admin's
  // real, possibly-since-changed password.
  const adminEmail = "admin@missionlesconquerants.org";
  let admin = await prisma.user.findUnique({ where: { email: adminEmail } });
  let generatedPassword: string | null = null;

  if (!admin) {
    generatedPassword = randomBytes(9).toString("base64url");
    const passwordHash = await bcrypt.hash(generatedPassword, 12);
    admin = await prisma.user.create({
      data: {
        name: "Super Administrateur",
        email: adminEmail,
        passwordHash,
        role: Role.SUPER_ADMIN,
        active: true,
      },
    });
  }

  // --- Site settings (singleton) — everything editable from /admin -------
  const siteSettingsData = {
    siteName: "Mission Les Conquérants",
    tagline: "Être la lumière des nations",
    contactEmail: "missionlesconquerants@gmail.com",
    contactPhone: "+228 91 39 42 43",
    address: "Togo",
    facebookUrl: null,
    instagramUrl: null,
    youtubeUrl: null,
    footerNote: "Mission Les Conquérants, Ézéchiel 22:30",
    heroTitle: "Qui se tiendra dans la brèche ?",
    heroSubtitle:
      "Une génération debout, appelée à se tenir dans la brèche et à porter la lumière du Christ jusqu'aux nations.",
    missionText:
      "Intercéder pour les nations, évangéliser les milieux non atteints, impacter pour que des vies soient transformées, et apporter un soutien social et spirituel qui démontre l'amour de Dieu.",
    visionText:
      "Être la lumière des nations et porter le salut de Jésus-Christ jusqu'aux extrémités de la terre.",
    // No verified figures exist yet for community count or founding year
    // (nothing in the source materials confirms them) — leave unset rather
    // than invent precise-looking numbers. Set from /admin once real data
    // is available.
    stats: Prisma.JsonNull,
  };

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: siteSettingsData,
    create: {
      id: "singleton",
      ...siteSettingsData,
    },
  });

  // --- Media (seeded from the mission's real field photos) --------------
  const media = {
    fournitures: await upsertMedia(
      "distribution-fournitures",
      "/seed-media/distribution-fournitures.jpg",
      "Distribution de fournitures scolaires à des enfants de la communauté",
      admin.id,
    ),
    equipe: await upsertMedia(
      "equipe-mission",
      "/seed-media/equipe-mission.jpg",
      "L'équipe de la Mission Les Conquérants en déplacement sur le terrain",
      admin.id,
    ),
    partenaireLogo: await upsertMedia(
      "partenaire-mattana-coeur",
      "/seed-media/partenaire-mattana-coeur.jpg",
      "Logo du partenaire Mattana, Cœur de missionnaire",
      admin.id,
    ),
  };

  // --- Projects (Activités & Projets) ------------------------------------
  await prisma.project.upsert({
    where: { slug: "distribution-fournitures-scolaires" },
    update: {},
    create: {
      slug: "distribution-fournitures-scolaires",
      title: "Distribution de fournitures scolaires",
      summary:
        "Un appui concret aux familles pour que les enfants des communautés que nous visitons puissent rester à l'école.",
      contentHtml:
        "<p>Dans plusieurs communautés non atteintes, l'accès à l'école reste un obstacle pour de nombreuses familles. La Mission Les Conquérants organise régulièrement des distributions de cahiers, de manuels et de fournitures scolaires, en complément de son travail d'évangélisation et de soutien spirituel.</p><p>Ce projet s'inscrit directement dans notre mission : apporter un soutien social et spirituel qui démontre concrètement l'amour de Dieu aux personnes que nous rencontrons.</p>",
      category: "Éducation & soutien social",
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date("2024-08-20"),
      coverImageId: media.fournitures.id,
      authorId: admin.id,
    },
  });

  await prisma.project.upsert({
    where: { slug: "intercession-pour-les-nations" },
    update: {},
    create: {
      slug: "intercession-pour-les-nations",
      title: "Intercession pour les nations",
      summary:
        "Un engagement constant de prière pour les nations et les milieux non atteints par l'Évangile.",
      contentHtml:
        "<p>Avant chaque déplacement, chaque rencontre et chaque projet, la Mission Les Conquérants place l'intercession au centre de son travail. Nos équipes se rassemblent régulièrement pour prier pour les nations, pour les milieux non atteints, et pour que des vies soient transformées.</p>",
      category: "Vie spirituelle",
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date("2024-06-10"),
      authorId: admin.id,
    },
  });

  // --- Events (missions) ----------------------------------------------
  await prisma.event.upsert({
    where: { slug: "seminaire-evg" },
    update: {},
    create: {
      slug: "seminaire-evg",
      title: "Séminaire EVG",
      description:
        "Un temps de formation et d'enseignement pour équiper les membres et contributeurs de la mission.",
      contentHtml:
        "<p>Le Séminaire EVG rassemble les membres de la Mission Les Conquérants autour d'un temps d'enseignement, de formation et de communion, en lien direct avec notre vision : être la lumière des nations.</p>",
      location: "Togo",
      startAt: new Date("2024-09-28"),
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date("2024-09-01"),
      coverImageId: media.equipe.id,
      authorId: admin.id,
    },
  });

  await prisma.event.upsert({
    where: { slug: "seminaire-formation-des-leaders" },
    update: {},
    create: {
      slug: "seminaire-formation-des-leaders",
      title: "Séminaire de formation des leaders",
      description:
        "Préparer une génération à connaître Dieu et à rester ferme dans la marche avec Lui.",
      contentHtml:
        "<p>Ce séminaire rassemble les jeunes responsables et futurs leaders de la mission autour d'un enseignement approfondi sur la marche chrétienne, l'intercession et le ministère apostolique et prophétique.</p>",
      location: "Lomé, Togo",
      startAt: new Date("2026-10-17"),
      endAt: new Date("2026-10-19"),
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date(),
      coverImageId: media.equipe.id,
      authorId: admin.id,
    },
  });

  await prisma.event.upsert({
    where: { slug: "campagne-evangelisation-plateaux" },
    update: {},
    create: {
      slug: "campagne-evangelisation-plateaux",
      title: "Campagne d'évangélisation en région des Plateaux",
      description:
        "Une équipe se déplace pour évangéliser et démontrer l'amour de Dieu dans les milieux non atteints.",
      contentHtml:
        "<p>Sous la coordination de la région des Plateaux, cette campagne mêle évangélisation de terrain, intercession et assistance sociale auprès des familles rencontrées.</p>",
      location: "Région des Plateaux, Togo",
      startAt: new Date("2026-11-08"),
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date(),
      coverImageId: media.equipe.id,
      authorId: admin.id,
    },
  });

  await prisma.event.upsert({
    where: { slug: "conference-annuelle-intercesseurs" },
    update: {},
    create: {
      slug: "conference-annuelle-intercesseurs",
      title: "Conférence annuelle des intercesseurs",
      description:
        "Un rassemblement pour intercéder pour les nations et embraser la flamme du réveil dans l'Église.",
      contentHtml:
        "<p>La Conférence annuelle des intercesseurs réunit les partenaires et contributeurs de la mission autour de l'importance du ministère d'intercession dans le monde chrétien.</p>",
      location: "Lomé, Togo",
      startAt: new Date("2026-12-05"),
      endAt: new Date("2026-12-06"),
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date(),
      coverImageId: media.equipe.id,
      authorId: admin.id,
    },
  });

  await prisma.event.upsert({
    where: { slug: "mission-oeuvres-sociales" },
    update: {},
    create: {
      slug: "mission-oeuvres-sociales",
      title: "Mission d'œuvres sociales",
      description:
        "Assistance sociale et spirituelle aux orphelins, aux veuves, aux malades et aux personnes vulnérables.",
      contentHtml:
        "<p>Cette mission de terrain associe distribution de fournitures, visites aux familles vulnérables et temps d'évangélisation, en cohérence avec notre engagement social et spirituel.</p>",
      location: "Togo",
      startAt: new Date("2027-01-24"),
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date(),
      coverImageId: media.fournitures.id,
      authorId: admin.id,
    },
  });

  // --- Posts (Articles / Actualités) ----------------------------------
  await prisma.post.upsert({
    where: { slug: "mission-sur-le-terrain" },
    update: {},
    create: {
      slug: "mission-sur-le-terrain",
      title: "Une mission sur le terrain",
      excerpt:
        "Retour sur un déplacement récent de l'équipe pour rencontrer et servir une communauté non atteinte.",
      contentHtml:
        "<p>Cette année encore, l'équipe de la Mission Les Conquérants s'est rendue sur le terrain pour rencontrer une communauté isolée. Ces déplacements sont l'occasion d'évangéliser, d'écouter, et d'apporter un soutien concret aux familles rencontrées.</p><p>Chaque visite renforce notre conviction : porter le salut de Jésus-Christ jusqu'aux extrémités de la terre commence par aller à la rencontre des personnes, là où elles se trouvent.</p>",
      category: "Actualités",
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date("2024-08-26"),
      coverImageId: media.equipe.id,
      authorId: admin.id,
    },
  });

  // --- Partners --------------------------------------------------------
  await prisma.partner.upsert({
    where: { id: "partner-mattana-coeur" },
    update: {},
    create: {
      id: "partner-mattana-coeur",
      name: "Mattana, Cœur de missionnaire",
      url: null,
      logoMediaId: media.partenaireLogo.id,
      order: 0,
      active: true,
    },
  });

  // --- About page (freeform Page with section blocks) -------------------
  const aboutPageData = {
    title: "À propos / Vision",
    status: ContentStatus.PUBLISHED,
    publishedAt: new Date(),
    seoTitle: "À propos",
    seoDescription:
      "Découvrez la mission et la vision de Mission Les Conquérants : intercession, évangélisation, et soutien aux communautés non atteintes.",
    sections: [
      {
        type: "hero",
        data: {
          eyebrow: "Ézéchiel 22:30",
          title: "Être la lumière des nations",
          subtitle:
            "Porter le salut de Jésus-Christ jusqu'aux extrémités de la terre.",
        },
      },
    ],
  };

  await prisma.page.upsert({
    where: { slug: "a-propos" },
    update: aboutPageData,
    create: { slug: "a-propos", authorId: admin.id, ...aboutPageData },
  });

  console.log("\nSeed terminé.");
  if (generatedPassword) {
    console.log("Compte admin créé :");
    console.log(`  email    : ${adminEmail}`);
    console.log(`  password : ${generatedPassword}`);
    console.log("→ Changez ce mot de passe après la première connexion.\n");
  } else {
    console.log(`Compte admin déjà existant (${adminEmail}) — mot de passe inchangé.\n`);
  }
}

async function upsertMedia(id: string, url: string, altText: string, uploadedById: string) {
  return prisma.media.upsert({
    where: { id },
    update: {},
    create: {
      id,
      url,
      pathname: url,
      type: MediaType.IMAGE,
      filename: url.split("/").pop() ?? id,
      size: 0,
      altText,
      uploadedById,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

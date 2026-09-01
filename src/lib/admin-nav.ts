import { Role } from "@/generated/prisma/browser";

const RANK: Record<Role, number> = {
  [Role.SUPER_ADMIN]: 4,
  [Role.ADMIN]: 3,
  [Role.EDITOR]: 2,
  [Role.CONTRIBUTOR]: 1,
};

export const NAV_ICON_KEYS = [
  "dashboard",
  "pages",
  "articles",
  "events",
  "projects",
  "conferences",
  "testimonials",
  "media",
  "partners",
  "messages",
  "users",
  "settings",
] as const;
export type NavIconKey = (typeof NAV_ICON_KEYS)[number];

export type AdminNavItem = {
  href: string;
  label: string;
  icon: NavIconKey;
  minRole: Role;
};

// Icon identity is resolved client-side (see AdminNavIcon) — a component
// reference isn't serializable across the Server → Client Component
// boundary, so this list stays plain data.
export const ADMIN_NAV: AdminNavItem[] = [
  { href: "/admin", label: "Tableau de bord", icon: "dashboard", minRole: Role.CONTRIBUTOR },
  { href: "/admin/pages", label: "Pages", icon: "pages", minRole: Role.EDITOR },
  { href: "/admin/articles", label: "Articles", icon: "articles", minRole: Role.CONTRIBUTOR },
  { href: "/admin/evenements", label: "Événements", icon: "events", minRole: Role.CONTRIBUTOR },
  { href: "/admin/projets", label: "Projets", icon: "projects", minRole: Role.CONTRIBUTOR },
  { href: "/admin/conferences", label: "Conférences", icon: "conferences", minRole: Role.CONTRIBUTOR },
  { href: "/admin/temoignages", label: "Témoignages", icon: "testimonials", minRole: Role.CONTRIBUTOR },
  { href: "/admin/medias", label: "Médias", icon: "media", minRole: Role.CONTRIBUTOR },
  { href: "/admin/partenaires", label: "Partenaires", icon: "partners", minRole: Role.EDITOR },
  { href: "/admin/messages", label: "Messages", icon: "messages", minRole: Role.EDITOR },
  { href: "/admin/utilisateurs", label: "Utilisateurs", icon: "users", minRole: Role.ADMIN },
  { href: "/admin/parametres", label: "Paramètres", icon: "settings", minRole: Role.SUPER_ADMIN },
];

export function navForRole(role: Role) {
  return ADMIN_NAV.filter((item) => RANK[role] >= RANK[item.minRole]);
}

export const ROLE_LABELS: Record<Role, string> = {
  [Role.SUPER_ADMIN]: "Super Admin",
  [Role.ADMIN]: "Admin",
  [Role.EDITOR]: "Éditeur",
  [Role.CONTRIBUTOR]: "Contributeur",
};

"use client";

import {
  SquaresFour,
  FileText,
  Newspaper,
  CalendarBlank,
  Briefcase,
  VideoCamera,
  Quotes,
  Image as ImageIcon,
  Handshake,
  Envelope,
  Users,
  Gear,
} from "@phosphor-icons/react";
import type { NavIconKey } from "@/lib/admin-nav";

const ICONS: Record<NavIconKey, typeof SquaresFour> = {
  dashboard: SquaresFour,
  pages: FileText,
  articles: Newspaper,
  events: CalendarBlank,
  projects: Briefcase,
  conferences: VideoCamera,
  testimonials: Quotes,
  media: ImageIcon,
  partners: Handshake,
  messages: Envelope,
  users: Users,
  settings: Gear,
};

export function AdminNavIcon({
  icon,
  size = 18,
  weight,
}: {
  icon: NavIconKey;
  size?: number;
  weight?: "regular" | "fill";
}) {
  const Icon = ICONS[icon];
  return <Icon size={size} weight={weight} />;
}

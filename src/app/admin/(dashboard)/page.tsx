import Link from "next/link";
import {
  Newspaper,
  CalendarBlank,
  Briefcase,
  Envelope,
} from "@phosphor-icons/react/dist/ssr";
import { requireUser } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/format";
import { ContentStatus } from "@/generated/prisma/client";

export default async function AdminDashboardPage() {
  const user = await requireUser();

  const [postCount, eventCount, projectCount, unreadCount, recentMessages] = await Promise.all([
    prisma.post.count({ where: { status: ContentStatus.PUBLISHED } }),
    prisma.event.count({ where: { status: ContentStatus.PUBLISHED } }),
    prisma.project.count({ where: { status: ContentStatus.PUBLISHED } }),
    prisma.contact.count({ where: { read: false } }),
    prisma.contact.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  const stats = [
    { label: "Articles publiés", value: postCount, icon: Newspaper, href: "/admin/articles" },
    { label: "Événements publiés", value: eventCount, icon: CalendarBlank, href: "/admin/evenements" },
    { label: "Projets publiés", value: projectCount, icon: Briefcase, href: "/admin/projets" },
    { label: "Messages non lus", value: unreadCount, icon: Envelope, href: "/admin/messages" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-900">
        Bonjour, {user.name?.split(" ")[0] ?? "bienvenue"}
      </h1>
      <p className="mt-1 text-sm text-ink-500">Aperçu du contenu du site.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-xl border border-ink-200 bg-surface p-5 transition-colors hover:border-accent-500"
          >
            <stat.icon size={22} className="text-accent-600" weight="duotone" />
            <p className="mt-3 font-display text-3xl font-semibold text-ink-900">{stat.value}</p>
            <p className="mt-1 text-sm text-ink-500">{stat.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="font-display text-lg font-semibold text-ink-900">Derniers messages</h2>
        {recentMessages.length === 0 ? (
          <p className="mt-3 text-sm text-ink-500">Aucun message reçu pour le moment.</p>
        ) : (
          <ul className="mt-3 divide-y divide-ink-200 overflow-hidden rounded-xl border border-ink-200 bg-surface">
            {recentMessages.map((message) => (
              <li key={message.id} className="flex items-center justify-between gap-4 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink-900">{message.name}</p>
                  <p className="truncate text-sm text-ink-500">{message.subject || message.message}</p>
                </div>
                <span className="shrink-0 text-xs text-ink-500">{formatDateTime(message.createdAt)}</span>
              </li>
            ))}
          </ul>
        )}
        <Link href="/admin/messages" className="mt-3 inline-block text-sm font-semibold text-accent-700 hover:text-accent-600">
          Voir tous les messages →
        </Link>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandMark } from "@/components/public/BrandMark";
import { AdminNavIcon } from "@/components/admin/AdminNavIcon";
import type { AdminNavItem } from "@/lib/admin-nav";
import { cn } from "@/lib/utils";

export function AdminSidebar({ items }: { items: AdminNavItem[] }) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-ink-200 bg-surface lg:flex">
      <div className="flex h-16 items-center gap-2 border-b border-ink-200 px-5 font-display text-base font-semibold text-ink-900">
        <BrandMark className="size-6" />
        Administration
      </div>
      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="flex flex-col gap-0.5">
          {items.map((item) => {
            const isActive =
              item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-accent-100 text-accent-700"
                      : "text-ink-700 hover:bg-surface-muted hover:text-ink-900",
                  )}
                >
                  <AdminNavIcon icon={item.icon} weight={isActive ? "fill" : "regular"} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { SignOut, User as UserIcon, List, X } from "@phosphor-icons/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AdminNavIcon } from "@/components/admin/AdminNavIcon";
import { ROLE_LABELS, type AdminNavItem } from "@/lib/admin-nav";
import type { Role } from "@/generated/prisma/browser";
import { cn } from "@/lib/utils";

export function AdminTopbar({
  name,
  role,
  navItems,
}: {
  name: string;
  role: Role;
  navItems: AdminNavItem[];
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="relative flex h-16 shrink-0 items-center justify-between border-b border-ink-200 bg-surface px-4 sm:px-6">
      <button
        type="button"
        aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
        onClick={() => setMobileOpen((v) => !v)}
        className="flex size-9 items-center justify-center rounded-lg text-ink-700 hover:bg-surface-muted lg:hidden"
      >
        {mobileOpen ? <X size={20} /> : <List size={20} />}
      </button>

      <p className="hidden text-sm font-medium text-ink-500 lg:block">
        <span className="text-ink-900">{ROLE_LABELS[role]}</span>
      </p>

      {mobileOpen && (
        <nav className="absolute inset-x-0 top-full z-30 border-b border-ink-200 bg-surface p-3 shadow-lg lg:hidden">
          <ul className="flex flex-col gap-0.5">
            {navItems.map((item) => {
              const isActive =
                item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium",
                      isActive ? "bg-accent-100 text-accent-700" : "text-ink-700 hover:bg-surface-muted",
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
      )}

      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2.5 rounded-full outline-none focus-visible:ring-3 focus-visible:ring-accent-500/30">
          <Avatar className="size-8">
            <AvatarFallback className="bg-accent-100 text-xs font-semibold text-accent-700">
              {initials || <UserIcon size={16} />}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel className="truncate">{name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => signOut({ callbackUrl: "/admin/connexion" })}>
            <SignOut size={16} />
            Se déconnecter
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

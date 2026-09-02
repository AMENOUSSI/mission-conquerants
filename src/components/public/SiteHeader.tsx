"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { SiteLogo } from "@/components/public/SiteLogo";
import { MobileNav } from "@/components/public/MobileNav";
import { DonationDialog } from "@/components/public/DonationDialog";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PRIMARY_NAV, MOBILE_NAV } from "@/lib/nav";
import type { getSiteSettings } from "@/lib/site-settings";

// Header chrome is deliberately always-navy (like the footer) so it stays
// legible over both the light page body and the dark homepage hero. On the
// homepage only, it starts fully transparent over the hero photo and turns
// solid navy/blur once the visitor scrolls past it — everywhere else it is
// solid from the first frame.
export function SiteHeader({
  settings,
}: {
  settings: Awaited<ReturnType<typeof getSiteSettings>>;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 48);
  });

  const transparent = isHome && !scrolled;

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-300 ${
        transparent ? "bg-transparent" : "border-b border-white/10 bg-navy-900/95 backdrop-blur"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-base font-semibold tracking-tight text-white sm:text-lg"
        >
          <SiteLogo className="size-9" />
          <span>{settings.siteName}</span>
        </Link>

        <nav className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {PRIMARY_NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group relative px-3 py-2 text-sm font-medium text-navy-100 transition-colors hover:text-white"
                >
                  {item.label}
                  <span
                    aria-hidden
                    className="absolute inset-x-3 bottom-0 h-[2px] origin-left scale-x-0 rounded-full bg-accent-500 transition-transform duration-200 group-hover:scale-x-100"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle className="flex size-9 shrink-0 items-center justify-center rounded-full text-navy-100 transition-colors hover:bg-white/10 hover:text-white" />
          <DonationDialog
            settings={settings}
            className="shrink-0 rounded-full bg-accent-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-700 active:translate-y-px"
          >
            Nous soutenir
          </DonationDialog>
        </div>

        <MobileNav items={MOBILE_NAV} settings={settings} />
      </div>
    </header>
  );
}

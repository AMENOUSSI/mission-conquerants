import Link from "next/link";
import { SiteLogo } from "@/components/public/SiteLogo";
import {
  FacebookLogo,
  InstagramLogo,
  YoutubeLogo,
  WhatsappLogo,
  EnvelopeSimple,
  Phone,
  MapPin,
} from "@phosphor-icons/react/dist/ssr";
import { FOOTER_NAV } from "@/lib/nav";
import { whatsappLink } from "@/lib/format";
import type { getSiteSettings } from "@/lib/site-settings";

const ACTIONS = [
  "Intercession",
  "Évangélisation",
  "Formation des leaders",
  "Conférences & séminaires",
  "Œuvres sociales",
];

export function SiteFooter({
  settings,
}: {
  settings: Awaited<ReturnType<typeof getSiteSettings>>;
}) {
  const socialLinks = [
    { href: settings.facebookUrl, label: "Facebook", Icon: FacebookLogo },
    { href: settings.instagramUrl, label: "Instagram", Icon: InstagramLogo },
    { href: settings.youtubeUrl, label: "YouTube", Icon: YoutubeLogo },
    {
      href: settings.whatsappNumber ? whatsappLink(settings.whatsappNumber) : null,
      label: "WhatsApp",
      Icon: WhatsappLogo,
    },
  ].filter((s): s is typeof s & { href: string } => Boolean(s.href));

  return (
    <footer className="border-t border-navy-200 bg-navy-900 text-navy-100">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr_0.9fr_0.9fr]">
          <div>
            <div className="flex items-center gap-2 font-display text-lg font-semibold text-white">
              <SiteLogo className="size-9" />
              {settings.siteName}
            </div>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-navy-200">
              {settings.tagline}
            </p>
            {socialLinks.length > 0 && (
              <ul className="mt-5 flex items-center gap-3">
                {socialLinks.map(({ href, label, Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={label}
                      className="flex size-9 items-center justify-center rounded-full bg-white/5 text-navy-100 transition-colors hover:bg-accent-600 hover:text-white"
                    >
                      <Icon size={18} weight="fill" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <h2 className="text-sm font-semibold text-white">Navigation</h2>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm text-navy-200">
              {FOOTER_NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group relative inline-flex transition-colors hover:text-white"
                  >
                    {item.label}
                    <span
                      aria-hidden
                      className="absolute inset-x-0 bottom-0 h-[1.5px] origin-left scale-x-0 rounded-full bg-accent-500 transition-transform duration-200 group-hover:scale-x-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-white">Nos actions</h2>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm text-navy-200">
              {ACTIONS.map((action) => (
                <li key={action}>{action}</li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-white">Contact</h2>
            <ul className="mt-4 flex flex-col gap-3 text-sm text-navy-200">
              <li className="flex items-start gap-2.5">
                <EnvelopeSimple size={18} className="mt-0.5 shrink-0 text-accent-500" />
                <a href={`mailto:${settings.contactEmail}`} className="hover:text-white">
                  {settings.contactEmail}
                </a>
              </li>
              {settings.contactPhone && (
                <li className="flex items-start gap-2.5">
                  <Phone size={18} className="mt-0.5 shrink-0 text-accent-500" />
                  <a href={`tel:${settings.contactPhone}`} className="hover:text-white">
                    {settings.contactPhone}
                  </a>
                </li>
              )}
              {settings.address && (
                <li className="flex items-start gap-2.5">
                  <MapPin size={18} className="mt-0.5 shrink-0 text-accent-500" />
                  <span>{settings.address}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-8">
          <p className="font-display text-lg font-semibold tracking-tight text-white sm:text-xl">
            Une mission. Une passion. Un Royaume.
          </p>
          <div className="mt-4 flex flex-col gap-2 text-xs text-navy-500 sm:flex-row sm:items-center sm:justify-between">
            <p>{settings.footerNote}</p>
            <p>© {new Date().getFullYear()} {settings.siteName}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

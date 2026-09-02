import { SiteHeader } from "@/components/public/SiteHeader";
import { SiteFooter } from "@/components/public/SiteFooter";
import { FloatingActions } from "@/components/public/FloatingActions";
import { getSiteSettings } from "@/lib/site-settings";

// Every page under this group reads live content from the CMS (Prisma), and
// admins expect edits to appear immediately — never a stale build-time snapshot.
export const dynamic = "force-dynamic";

export default async function PublicLayout({ children }: LayoutProps<"/">) {
  const settings = await getSiteSettings();

  return (
    <>
      <SiteHeader settings={settings} />
      <main className="flex-1">{children}</main>
      <SiteFooter settings={settings} />
      <FloatingActions whatsappNumber={settings.whatsappNumber} />
    </>
  );
}

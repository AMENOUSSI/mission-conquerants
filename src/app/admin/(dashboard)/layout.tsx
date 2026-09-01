import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { navForRole } from "@/lib/admin-nav";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const session = await auth();
  if (!session?.user) redirect("/admin/connexion");

  const navItems = navForRole(session.user.role);

  return (
    <div className="flex min-h-dvh bg-bg">
      <AdminSidebar items={navItems} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar name={session.user.name ?? session.user.email ?? "Utilisateur"} role={session.user.role} navItems={navItems} />
        <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

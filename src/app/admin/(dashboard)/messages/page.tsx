import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { MessageInbox } from "@/components/admin/MessageInbox";
import { requireRole } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { Role } from "@/generated/prisma/client";

export default async function MessagesPage() {
  await requireRole(Role.EDITOR);
  const messages = await prisma.contact.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <AdminPageHeader
        title="Messages"
        description="Messages reçus depuis le formulaire de contact du site."
      />
      <MessageInbox
        initialMessages={messages.map((m) => ({
          ...m,
          createdAt: m.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}

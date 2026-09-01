"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Role } from "@/generated/prisma/browser";
import { ROLE_LABELS } from "@/lib/admin-nav";
import type { ActionResult } from "@/lib/actions/media";

const ASSIGNABLE_ROLES = [Role.CONTRIBUTOR, Role.EDITOR, Role.ADMIN, Role.SUPER_ADMIN];

export function UserForm({
  action,
  mode,
  actingRole,
  initialValues,
}: {
  action: (formData: FormData) => Promise<ActionResult>;
  mode: "create" | "edit";
  actingRole: Role;
  initialValues?: { name?: string; email?: string; role?: Role; active?: boolean };
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const roleOptions = ASSIGNABLE_ROLES.filter(
    (r) => r !== Role.SUPER_ADMIN || actingRole === Role.SUPER_ADMIN,
  );

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await action(formData);
      if (result.success) {
        toast.success("Enregistré.");
        router.push("/admin/utilisateurs");
      } else {
        toast.error(result.message ?? "Une erreur est survenue.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-5">
      <div className="grid gap-2">
        <Label htmlFor="name">Nom complet</Label>
        <Input id="name" name="name" required defaultValue={initialValues?.name} />
      </div>

      {mode === "create" && (
        <div className="grid gap-2">
          <Label htmlFor="email">Adresse e-mail</Label>
          <Input id="email" name="email" type="email" required />
        </div>
      )}

      {mode === "edit" && (
        <div className="grid gap-2">
          <Label>Adresse e-mail</Label>
          <p className="text-sm text-ink-500">{initialValues?.email}</p>
        </div>
      )}

      <div className="grid gap-2">
        <Label htmlFor="password">
          Mot de passe {mode === "edit" && <span className="font-normal text-ink-500">(laisser vide pour ne pas changer)</span>}
        </Label>
        <Input id="password" name="password" type="password" required={mode === "create"} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="role">Rôle</Label>
        <Select name="role" defaultValue={initialValues?.role ?? Role.CONTRIBUTOR}>
          <SelectTrigger id="role">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {roleOptions.map((role) => (
              <SelectItem key={role} value={role}>
                {ROLE_LABELS[role]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* Select's value isn't a native form field by default in some setups; ensure it's submitted */}
      </div>

      {mode === "edit" && (
        <div className="flex items-center justify-between rounded-lg border border-ink-200 px-4 py-3">
          <div>
            <p className="text-sm font-medium text-ink-900">Compte actif</p>
            <p className="text-xs text-ink-500">Un compte désactivé ne peut plus se connecter.</p>
          </div>
          <Switch name="active" defaultChecked={initialValues?.active ?? true} />
        </div>
      )}

      <div>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Enregistrement..." : mode === "create" ? "Créer le compte" : "Enregistrer"}
        </Button>
      </div>
    </form>
  );
}

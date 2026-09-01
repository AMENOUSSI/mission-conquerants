import type { Metadata } from "next";
import { Suspense } from "react";
import { BrandMark } from "@/components/public/BrandMark";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Connexion",
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-navy-900 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-surface p-8 shadow-xl">
        <div className="flex items-center gap-2 font-display text-lg font-semibold text-ink-900">
          <BrandMark className="size-7" />
          Administration
        </div>
        <p className="mt-1.5 text-sm text-ink-500">
          Connectez-vous pour gérer le contenu du site.
        </p>
        <div className="mt-6">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

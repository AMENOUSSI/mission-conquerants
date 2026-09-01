import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-sm font-semibold text-accent-700">404</p>
      <h1 className="mt-2 font-display text-2xl font-semibold text-ink-900 sm:text-3xl">
        Page introuvable
      </h1>
      <p className="mt-3 max-w-sm text-sm text-ink-500">
        La page que vous cherchez n&apos;existe pas ou a été déplacée.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-accent-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-700"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}

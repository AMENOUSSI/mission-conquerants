"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "@phosphor-icons/react";

const subscribeNoop = () => () => {};

/** True only once hydrated on the client — resolvedTheme is unknown on the server. */
function useMounted() {
  return useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
}

/**
 * Renders an empty placeholder until mounted: resolvedTheme is unknown on
 * the server, so painting an icon before hydration risks a mismatch.
 */
export function ThemeToggle({
  className,
  children,
}: {
  className?: string;
  /** Optional visible label, for contexts (e.g. a menu row) where an icon alone isn't enough. */
  children?: (isDark: boolean) => React.ReactNode;
}) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();

  if (!mounted) {
    return <span aria-hidden className={className} />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Passer au thème clair" : "Passer au thème sombre"}
      className={className}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
      {children?.(isDark)}
    </button>
  );
}

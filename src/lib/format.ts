const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const dateTimeFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatDate(date: Date | string) {
  return dateFormatter.format(new Date(date));
}

export function formatDateTime(date: Date | string) {
  return dateTimeFormatter.format(new Date(date));
}

/** Builds a wa.me deep link from a phone number in any human-typed format. */
export function whatsappLink(number: string, message?: string) {
  const digits = number.replace(/[^0-9]/g, "");
  const query = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${digits}${query}`;
}

/** "Aujourd'hui" / "Demain" / "Dans N jours" — day-granularity, ignores time of day. */
export function formatRelativeDays(date: Date | string) {
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffDays = Math.round(
    (startOfDay(new Date(date)).getTime() - startOfDay(new Date()).getTime()) / 86_400_000,
  );
  if (diffDays <= 0) return "Aujourd'hui";
  if (diffDays === 1) return "Demain";
  return `dans ${diffDays} jours`;
}

/** True if `date` is within the last `days` days (used for a "Nouveau" badge). */
export function isRecent(date: Date | string | null | undefined, days: number) {
  if (!date) return false;
  return Date.now() - new Date(date).getTime() < days * 86_400_000;
}

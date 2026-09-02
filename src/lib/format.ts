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

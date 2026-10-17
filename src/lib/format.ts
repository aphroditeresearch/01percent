/** "2026-10-10" → "10 Oct 2026". Fixed locale and UTC so server and client render the same text. */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** "2026-10-20T14:00:00Z" → "Tue 20 Oct · 14:00 UTC". Fixed locale/zone so server and client match. */
export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const date = d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
  const time = d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "UTC", hour12: false });
  return `${date} · ${time} UTC`;
}

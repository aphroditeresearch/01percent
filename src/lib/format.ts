/** "2026-10-10" → "10 Oct 2026". Fixed locale and UTC so server and client render the same text. */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

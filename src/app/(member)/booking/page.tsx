import type { Metadata } from "next";
import { NotYet, PageTitle, Pill, buttonStyles } from "@/components/ui/primitives";
import { cn } from "@/lib/cn";
import { formatDateTime } from "@/lib/format";
import { getBookingSlots } from "@/server/data";
import { requireFeature } from "@/server/features";
import { getTenant } from "@/server/tenant";

export const metadata: Metadata = { title: "Booking" };

export default async function BookingPage() {
  const tenant = await getTenant();
  requireFeature(tenant, "booking");
  const slots = await getBookingSlots(tenant);

  return (
    <div className="space-y-14">
      <header className="space-y-6 border-t border-ink pt-8">
        <PageTitle className="text-4xl sm:text-5xl">Booking</PageTitle>
        <p className="max-w-xl text-muted">
          1-1 time on the calendar — chart review, trade breakdowns, or whatever you&rsquo;re stuck on.
          Spots are limited, first requested gets the slot.
        </p>
      </header>

      {slots.length === 0 ? (
        <p className="border-t border-line py-10 text-muted">No slots open right now — check back soon.</p>
      ) : (
        <ul className="border-b border-line">
          {slots.map((slot) => {
            const spotsLeft = slot.spotsTotal - slot.spotsTaken;
            const full = spotsLeft <= 0;
            return (
              <li
                key={slot.id}
                className="flex flex-col gap-4 border-t border-line py-6 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-1">
                  <p className="font-semibold text-ink">{formatDateTime(slot.startsAt)}</p>
                  <p className="text-sm text-muted">
                    {slot.format} · {slot.durationMinutes} min
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  {full ? (
                    <Pill>Full</Pill>
                  ) : (
                    <Pill tone="success">
                      {spotsLeft} spot{spotsLeft === 1 ? "" : "s"} left
                    </Pill>
                  )}
                  <div className="flex flex-col items-end gap-1">
                    <button type="button" disabled className={cn(buttonStyles.outline, "px-5 py-3 text-xs")}>
                      {full ? "Join waitlist" : "Request this slot"}
                    </button>
                    <NotYet>Booking requests arrive with the database in Phase 2 (demo).</NotYet>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

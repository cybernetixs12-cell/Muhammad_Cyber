import type { PositionResult } from "@/types/waitlist";

interface TicketCardProps {
  position: PositionResult;
  onDone: () => void;
}

function partiesAheadText(count: number): string {
  if (count === 0) return "You're next!";
  return `${count} ${count === 1 ? "party" : "parties"} ahead`;
}

export function TicketCard({ position, onDone }: TicketCardProps) {
  const removed = position.status === "REMOVED";

  return (
    <section aria-labelledby="ticket-heading" className="space-y-4 text-center">
      <h2 id="ticket-heading" className="text-sm font-medium uppercase tracking-wide text-slate-500">
        Your Ticket
      </h2>
      <p className="text-5xl font-bold">#{position.ticketNumber}</p>

      {removed ? (
        <p className="text-lg text-slate-700">You are no longer on the waitlist.</p>
      ) : (
        <p className="text-xl font-semibold text-indigo-700" aria-live="polite">
          {partiesAheadText(position.partiesAhead)}
        </p>
      )}

      <p className="text-sm text-slate-500">
        {position.name} · party of {position.partySize}
      </p>

      {removed && (
        <button
          type="button"
          onClick={onDone}
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base font-semibold hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          Join again
        </button>
      )}
    </section>
  );
}

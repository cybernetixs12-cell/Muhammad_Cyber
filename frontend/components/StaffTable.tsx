"use client";

import { ApiError } from "@/lib/api";
import { useRemoveParty } from "@/hooks/useWaitlist";
import type { StaffWaitlistItem } from "@/types/waitlist";

interface StaffTableProps {
  items: StaffWaitlistItem[];
}

const timeFormat = new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit" });

export function StaffTable({ items }: StaffTableProps) {
  const remove = useRemoveParty();
  const removingTicket = remove.isPending ? remove.variables : null;

  if (items.length === 0) {
    return <p className="py-8 text-center text-slate-500">No parties are waiting.</p>;
  }

  return (
    <div>
      {remove.isError && (
        <p role="alert" className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
          {remove.error instanceof ApiError ? remove.error.message : "Could not remove the party."}
        </p>
      )}
      <div className="overflow-x-auto rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-600">
            <tr>
              <th scope="col" className="px-4 py-3">Ticket</th>
              <th scope="col" className="px-4 py-3">Name</th>
              <th scope="col" className="px-4 py-3">Party Size</th>
              <th scope="col" className="px-4 py-3">Joined</th>
              <th scope="col" className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {items.map((item) => (
              <tr key={item.ticketNumber}>
                <td className="px-4 py-3 font-semibold">#{item.ticketNumber}</td>
                <td className="px-4 py-3">{item.name}</td>
                <td className="px-4 py-3">{item.partySize}</td>
                <td className="px-4 py-3">
                  <time dateTime={item.joinedAt}>{timeFormat.format(new Date(item.joinedAt))}</time>
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => remove.mutate(item.ticketNumber)}
                    disabled={removingTicket === item.ticketNumber}
                    aria-label={`Remove ticket ${item.ticketNumber}, ${item.name}`}
                    className="rounded-md border border-red-300 px-3 py-1.5 font-medium text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200 disabled:opacity-50"
                  >
                    {removingTicket === item.ticketNumber ? "Removing…" : "Remove"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

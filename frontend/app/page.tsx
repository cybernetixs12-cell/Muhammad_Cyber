"use client";

import { useEffect } from "react";
import { JoinForm } from "@/components/JoinForm";
import { TicketCard } from "@/components/TicketCard";
import { ApiError } from "@/lib/api";
import { useStoredTicket } from "@/hooks/useStoredTicket";
import { usePosition } from "@/hooks/useWaitlist";

export default function CustomerPage() {
  const { ticketNumber, loaded, save, clear } = useStoredTicket();
  const position = usePosition(ticketNumber);

  // A stored ticket the server doesn't know (e.g. database reset) is discarded.
  const notFound = position.error instanceof ApiError && position.error.status === 404;
  useEffect(() => {
    if (notFound) clear();
  }, [notFound, clear]);

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Restaurant Waitlist</h1>

      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        {!loaded ? (
          <p className="text-center text-slate-500">Loading…</p>
        ) : ticketNumber === null ? (
          <JoinForm onJoined={save} />
        ) : position.data ? (
          <TicketCard position={position.data} onDone={clear} />
        ) : position.isError && !notFound ? (
          <div role="alert" className="space-y-3 text-center">
            <p className="text-red-800">
              {position.error instanceof ApiError
                ? position.error.message
                : "Could not load your ticket."}
            </p>
            <button
              type="button"
              onClick={() => position.refetch()}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-semibold hover:bg-slate-100"
            >
              Try again
            </button>
          </div>
        ) : (
          <p className="text-center text-slate-500">Loading your ticket…</p>
        )}
      </div>
    </main>
  );
}

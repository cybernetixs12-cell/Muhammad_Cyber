"use client";

import { StaffTable } from "@/components/StaffTable";
import { ApiError } from "@/lib/api";
import { useStaffWaitlist } from "@/hooks/useWaitlist";

export default function StaffPage() {
  const waitlist = useStaffWaitlist();

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Staff Waitlist</h1>

      {waitlist.isPending ? (
        <p className="text-slate-500">Loading…</p>
      ) : waitlist.isError ? (
        <div role="alert" className="space-y-3">
          <p className="text-red-800">
            {waitlist.error instanceof ApiError
              ? waitlist.error.message
              : "Could not load the waitlist."}
          </p>
          <button
            type="button"
            onClick={() => waitlist.refetch()}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-semibold hover:bg-slate-100"
          >
            Try again
          </button>
        </div>
      ) : (
        <StaffTable items={waitlist.data} />
      )}
    </main>
  );
}

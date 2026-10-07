"use client";

import { useState, type FormEvent } from "react";
import { ApiError } from "@/lib/api";
import { useJoinWaitlist } from "@/hooks/useWaitlist";
import { joinWaitlistFormSchema } from "@/schemas/joinWaitlist";

interface JoinFormProps {
  onJoined: (ticketNumber: number) => void;
}

type FieldErrors = Partial<Record<"name" | "partySize", string>>;

export function JoinForm({ onJoined }: JoinFormProps) {
  const [name, setName] = useState("");
  const [partySize, setPartySize] = useState("2");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const join = useJoinWaitlist();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = joinWaitlistFormSchema.safeParse({ name, partySize });
    if (!parsed.success) {
      const errors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if ((field === "name" || field === "partySize") && !errors[field]) {
          errors[field] = issue.message;
        }
      }
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    join.mutate(
      { name: parsed.data.name, partySize: parsed.data.partySize },
      { onSuccess: (result) => onJoined(result.ticketNumber) },
    );
  }

  const serverError = join.error
    ? join.error instanceof ApiError
      ? join.error.message
      : "Something went wrong. Please try again."
    : null;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-invalid={fieldErrors.name ? true : undefined}
          aria-describedby={fieldErrors.name ? "name-error" : undefined}
          className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-base focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        />
        {fieldErrors.name && (
          <p id="name-error" role="alert" className="mt-1 text-sm text-red-700">
            {fieldErrors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="partySize" className="block text-sm font-medium">
          Party size
        </label>
        <input
          id="partySize"
          name="partySize"
          type="number"
          inputMode="numeric"
          min={1}
          step={1}
          value={partySize}
          onChange={(e) => setPartySize(e.target.value)}
          aria-invalid={fieldErrors.partySize ? true : undefined}
          aria-describedby={fieldErrors.partySize ? "partySize-error" : undefined}
          className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-base focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        />
        {fieldErrors.partySize && (
          <p id="partySize-error" role="alert" className="mt-1 text-sm text-red-700">
            {fieldErrors.partySize}
          </p>
        )}
      </div>

      {serverError && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={join.isPending}
        className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-base font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {join.isPending ? "Joining…" : "Join Waitlist"}
      </button>
    </form>
  );
}

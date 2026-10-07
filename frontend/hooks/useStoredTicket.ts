"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "waitlist.ticketNumber";

/** Remembers the customer's ticket across refreshes (localStorage only, no accounts). */
export function useStoredTicket() {
  const [ticketNumber, setTicketNumber] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Read after mount to avoid a server/client hydration mismatch.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const parsed = raw === null ? NaN : Number(raw);
      if (Number.isInteger(parsed) && parsed > 0) setTicketNumber(parsed);
    } catch {
      // storage unavailable (private mode); the app still works for this session
    }
    setLoaded(true);
  }, []);

  const save = useCallback((value: number) => {
    setTicketNumber(value);
    try {
      window.localStorage.setItem(STORAGE_KEY, String(value));
    } catch {
      // ignore
    }
  }, []);

  const clear = useCallback(() => {
    setTicketNumber(null);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return { ticketNumber, loaded, save, clear };
}

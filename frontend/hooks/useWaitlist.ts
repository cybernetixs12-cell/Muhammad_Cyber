"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, ApiError } from "@/lib/api";

const POLL_INTERVAL_MS = 5000;

export const queryKeys = {
  position: (ticketNumber: number) => ["position", ticketNumber] as const,
  staffWaitlist: ["staff", "waitlist"] as const,
};

export function useJoinWaitlist() {
  return useMutation({ mutationFn: api.join });
}

/** Customer position; polls so "parties ahead" updates without a manual refresh. */
export function usePosition(ticketNumber: number | null) {
  return useQuery({
    queryKey: queryKeys.position(ticketNumber ?? -1),
    queryFn: () => api.getPosition(ticketNumber as number),
    enabled: ticketNumber !== null,
    refetchInterval: POLL_INTERVAL_MS,
    retry: (count, error) => !(error instanceof ApiError && error.status === 404) && count < 2,
  });
}

export function useStaffWaitlist() {
  return useQuery({
    queryKey: queryKeys.staffWaitlist,
    queryFn: api.listWaiting,
    refetchInterval: POLL_INTERVAL_MS,
  });
}

export function useRemoveParty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.remove,
    onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.staffWaitlist }),
  });
}

import type { JoinResult, PositionResult, StaffWaitlistItem } from "@/types/waitlist";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers },
      cache: "no-store",
    });
  } catch {
    throw new ApiError(0, "NETWORK_ERROR", "Cannot reach the server. Please try again.");
  }

  if (!response.ok) {
    let code = "UNKNOWN_ERROR";
    let message = "Something went wrong. Please try again.";
    try {
      const body = (await response.json()) as { error?: { code?: string; message?: string } };
      code = body.error?.code ?? code;
      message = body.error?.message ?? message;
    } catch {
      // non-JSON error body; keep defaults
    }
    throw new ApiError(response.status, code, message);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export const api = {
  join: (payload: { name: string; partySize: number }) =>
    request<JoinResult>("/api/waitlist", { method: "POST", body: JSON.stringify(payload) }),
  getPosition: (ticketNumber: number) =>
    request<PositionResult>(`/api/waitlist/${ticketNumber}`),
  listWaiting: () => request<StaffWaitlistItem[]>("/api/staff/waitlist"),
  remove: (ticketNumber: number) =>
    request<void>(`/api/staff/waitlist/${ticketNumber}`, { method: "DELETE" }),
};

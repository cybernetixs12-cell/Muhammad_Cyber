export type WaitlistStatus = "WAITING" | "REMOVED";

export interface JoinResult {
  ticketNumber: number;
  partiesAhead: number;
}

export interface PositionResult {
  ticketNumber: number;
  name: string;
  partySize: number;
  partiesAhead: number;
  status: WaitlistStatus;
}

export interface StaffWaitlistItem {
  ticketNumber: number;
  name: string;
  partySize: number;
  joinedAt: string;
}

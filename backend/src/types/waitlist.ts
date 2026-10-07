export type WaitlistStatus = "WAITING" | "REMOVED";

export interface WaitlistEntry {
  id: string;
  ticketNumber: number;
  customerName: string;
  partySize: number;
  status: WaitlistStatus;
  joinedAt: Date;
  removedAt: Date | null;
}

export interface NewWaitlistEntry {
  customerName: string;
  partySize: number;
}

// API response shapes
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

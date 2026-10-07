import { NewWaitlistEntry, WaitlistEntry } from "../types/waitlist";

/**
 * Persistence abstraction used by the service layer (DIP).
 * Contains no business rules.
 */
export interface IWaitlistRepository {
  /** Persists a new WAITING entry; the database assigns the ticket number. */
  create(data: NewWaitlistEntry): Promise<WaitlistEntry>;

  findByTicketNumber(ticketNumber: number): Promise<WaitlistEntry | null>;

  /** WAITING entries ordered by join order (ascending ticket number). */
  findWaiting(): Promise<WaitlistEntry[]>;

  /** Number of WAITING entries with a smaller ticket number (i.e. joined earlier). */
  countWaitingBefore(ticketNumber: number): Promise<number>;

  /**
   * Atomically moves a WAITING entry to REMOVED.
   * Returns false if no WAITING entry with that ticket exists.
   */
  remove(ticketNumber: number): Promise<boolean>;
}

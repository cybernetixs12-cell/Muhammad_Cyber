import { IWaitlistRepository } from "../../src/repositories/IWaitlistRepository";
import { NewWaitlistEntry, WaitlistEntry } from "../../src/types/waitlist";

/**
 * Test double that mimics the database contract: a monotonically increasing
 * sequence that is never reset, and soft removal. Has an artificial async gap
 * so concurrent callers genuinely interleave.
 */
export class InMemoryWaitlistRepository implements IWaitlistRepository {
  private entries: WaitlistEntry[] = [];
  private sequence = 1000;

  async create(data: NewWaitlistEntry): Promise<WaitlistEntry> {
    const ticketNumber = ++this.sequence; // atomic, like nextval()
    await new Promise((resolve) => setImmediate(resolve));
    const entry: WaitlistEntry = {
      id: `id-${ticketNumber}`,
      ticketNumber,
      customerName: data.customerName,
      partySize: data.partySize,
      status: "WAITING",
      joinedAt: new Date(),
      removedAt: null,
    };
    this.entries.push(entry);
    return entry;
  }

  async findByTicketNumber(ticketNumber: number): Promise<WaitlistEntry | null> {
    return this.entries.find((e) => e.ticketNumber === ticketNumber) ?? null;
  }

  async findWaiting(): Promise<WaitlistEntry[]> {
    return this.entries
      .filter((e) => e.status === "WAITING")
      .sort((a, b) => a.ticketNumber - b.ticketNumber);
  }

  async countWaitingBefore(ticketNumber: number): Promise<number> {
    return this.entries.filter((e) => e.status === "WAITING" && e.ticketNumber < ticketNumber)
      .length;
  }

  async remove(ticketNumber: number): Promise<boolean> {
    const entry = this.entries.find((e) => e.ticketNumber === ticketNumber);
    if (!entry || entry.status !== "WAITING") return false;
    entry.status = "REMOVED";
    entry.removedAt = new Date();
    return true;
  }
}

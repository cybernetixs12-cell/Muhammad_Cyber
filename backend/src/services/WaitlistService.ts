import { ConflictError, NotFoundError } from "../errors/AppError";
import { IWaitlistRepository } from "../repositories/IWaitlistRepository";
import { JoinWaitlistInput } from "../schemas/waitlist.schema";
import { JoinResult, PositionResult, StaffWaitlistItem } from "../types/waitlist";

/**
 * Business rules for the waitlist. Framework-agnostic: no Express, no Prisma.
 *
 * Join order is defined by ticket number (assigned by a database sequence), so
 * ordering and "parties ahead" always agree with each other.
 */
export class WaitlistService {
  constructor(private readonly repository: IWaitlistRepository) {}

  async join(input: JoinWaitlistInput): Promise<JoinResult> {
    const entry = await this.repository.create({
      customerName: input.name,
      partySize: input.partySize,
    });
    const partiesAhead = await this.repository.countWaitingBefore(entry.ticketNumber);
    return { ticketNumber: entry.ticketNumber, partiesAhead };
  }

  async getPosition(ticketNumber: number): Promise<PositionResult> {
    const entry = await this.repository.findByTicketNumber(ticketNumber);
    if (!entry) {
      throw new NotFoundError(`Ticket #${ticketNumber} was not found.`);
    }
    // Parties ahead is counted in parties (rows), never in people (partySize).
    const partiesAhead =
      entry.status === "WAITING"
        ? await this.repository.countWaitingBefore(entry.ticketNumber)
        : 0;
    return {
      ticketNumber: entry.ticketNumber,
      name: entry.customerName,
      partySize: entry.partySize,
      partiesAhead,
      status: entry.status,
    };
  }

  async listWaiting(): Promise<StaffWaitlistItem[]> {
    const entries = await this.repository.findWaiting();
    return entries.map((e) => ({
      ticketNumber: e.ticketNumber,
      name: e.customerName,
      partySize: e.partySize,
      joinedAt: e.joinedAt.toISOString(),
    }));
  }

  async remove(ticketNumber: number): Promise<void> {
    const removed = await this.repository.remove(ticketNumber);
    if (removed) return;

    const entry = await this.repository.findByTicketNumber(ticketNumber);
    if (!entry) {
      throw new NotFoundError(`Ticket #${ticketNumber} was not found.`);
    }
    throw new ConflictError(`Ticket #${ticketNumber} has already been removed.`);
  }
}

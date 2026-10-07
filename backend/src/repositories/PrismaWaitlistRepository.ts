import { PrismaClient } from "@prisma/client";
import { NewWaitlistEntry, WaitlistEntry } from "../types/waitlist";
import { IWaitlistRepository } from "./IWaitlistRepository";

export class PrismaWaitlistRepository implements IWaitlistRepository {
  constructor(private readonly prisma: PrismaClient) {}

  create(data: NewWaitlistEntry): Promise<WaitlistEntry> {
    // ticketNumber is omitted on purpose: PostgreSQL's sequence assigns it.
    return this.prisma.waitlistEntry.create({
      data: { customerName: data.customerName, partySize: data.partySize },
    });
  }

  findByTicketNumber(ticketNumber: number): Promise<WaitlistEntry | null> {
    return this.prisma.waitlistEntry.findUnique({ where: { ticketNumber } });
  }

  findWaiting(): Promise<WaitlistEntry[]> {
    return this.prisma.waitlistEntry.findMany({
      where: { status: "WAITING" },
      orderBy: { ticketNumber: "asc" },
    });
  }

  countWaitingBefore(ticketNumber: number): Promise<number> {
    return this.prisma.waitlistEntry.count({
      where: { status: "WAITING", ticketNumber: { lt: ticketNumber } },
    });
  }

  async remove(ticketNumber: number): Promise<boolean> {
    // Single conditional UPDATE: safe if two staff members click Remove at once.
    const result = await this.prisma.waitlistEntry.updateMany({
      where: { ticketNumber, status: "WAITING" },
      data: { status: "REMOVED", removedAt: new Date() },
    });
    return result.count > 0;
  }
}

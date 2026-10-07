import { ConflictError, NotFoundError } from "../src/errors/AppError";
import { WaitlistService } from "../src/services/WaitlistService";
import { InMemoryWaitlistRepository } from "./helpers/InMemoryWaitlistRepository";

describe("WaitlistService", () => {
  let service: WaitlistService;

  beforeEach(() => {
    service = new WaitlistService(new InMemoryWaitlistRepository());
  });

  describe("tickets", () => {
    it("gives different customers different tickets", async () => {
      const a = await service.join({ name: "A", partySize: 2 });
      const b = await service.join({ name: "B", partySize: 2 });
      expect(a.ticketNumber).not.toBe(b.ticketNumber);
    });

    it("never reuses a removed ticket", async () => {
      const a = await service.join({ name: "A", partySize: 2 });
      await service.remove(a.ticketNumber);
      const next = await service.join({ name: "B", partySize: 2 });
      expect(next.ticketNumber).not.toBe(a.ticketNumber);
      expect(next.ticketNumber).toBeGreaterThan(a.ticketNumber);
    });

    it("issues unique tickets under concurrent joins", async () => {
      const results = await Promise.all(
        Array.from({ length: 50 }, (_, i) => service.join({ name: `P${i}`, partySize: 2 })),
      );
      const tickets = results.map((r) => r.ticketNumber);
      expect(new Set(tickets).size).toBe(50);
    });
  });

  describe("ordering", () => {
    it("lists waiting parties in join order", async () => {
      const a = await service.join({ name: "A", partySize: 10 });
      const b = await service.join({ name: "B", partySize: 2 });
      const c = await service.join({ name: "C", partySize: 6 });
      const list = await service.listWaiting();
      expect(list.map((i) => i.ticketNumber)).toEqual([
        a.ticketNumber,
        b.ticketNumber,
        c.ticketNumber,
      ]);
      expect(list.map((i) => i.name)).toEqual(["A", "B", "C"]);
    });
  });

  describe("parties ahead", () => {
    it("counts parties, not people, and updates as parties leave", async () => {
      const a = await service.join({ name: "A", partySize: 10 });
      const b = await service.join({ name: "B", partySize: 2 });
      const c = await service.join({ name: "C", partySize: 6 });

      expect((await service.getPosition(c.ticketNumber)).partiesAhead).toBe(2);

      await service.remove(b.ticketNumber);
      expect((await service.getPosition(c.ticketNumber)).partiesAhead).toBe(1);

      await service.remove(a.ticketNumber);
      expect((await service.getPosition(c.ticketNumber)).partiesAhead).toBe(0);
    });

    it("returns partiesAhead on join", async () => {
      await service.join({ name: "A", partySize: 4 });
      const b = await service.join({ name: "B", partySize: 1 });
      expect(b.partiesAhead).toBe(1);
    });

    it("removed parties disappear from the staff list", async () => {
      const a = await service.join({ name: "A", partySize: 2 });
      await service.join({ name: "B", partySize: 2 });
      await service.remove(a.ticketNumber);
      const list = await service.listWaiting();
      expect(list.map((i) => i.name)).toEqual(["B"]);
    });
  });

  describe("errors", () => {
    it("throws NotFoundError for an unknown ticket", async () => {
      await expect(service.getPosition(9999)).rejects.toBeInstanceOf(NotFoundError);
      await expect(service.remove(9999)).rejects.toBeInstanceOf(NotFoundError);
    });

    it("throws ConflictError when removing twice", async () => {
      const a = await service.join({ name: "A", partySize: 2 });
      await service.remove(a.ticketNumber);
      await expect(service.remove(a.ticketNumber)).rejects.toBeInstanceOf(ConflictError);
    });

    it("reports REMOVED status for a removed ticket", async () => {
      const a = await service.join({ name: "A", partySize: 2 });
      await service.remove(a.ticketNumber);
      const position = await service.getPosition(a.ticketNumber);
      expect(position.status).toBe("REMOVED");
      expect(position.partiesAhead).toBe(0);
    });
  });
});

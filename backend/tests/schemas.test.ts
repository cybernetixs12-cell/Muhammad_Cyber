import { joinWaitlistSchema } from "../src/schemas/waitlist.schema";

describe("joinWaitlistSchema", () => {
  const parse = (name: unknown, partySize: unknown) =>
    joinWaitlistSchema.safeParse({ name, partySize });

  it("rejects an empty name", () => {
    expect(parse("", 2).success).toBe(false);
  });

  it("rejects a whitespace-only name", () => {
    expect(parse("   ", 2).success).toBe(false);
  });

  it("rejects party size 0", () => {
    expect(parse("Ann", 0).success).toBe(false);
  });

  it("rejects negative party size", () => {
    expect(parse("Ann", -1).success).toBe(false);
  });

  it("rejects non-integer party size", () => {
    expect(parse("Ann", 1.5).success).toBe(false);
  });

  it("rejects a party size sent as a string", () => {
    expect(parse("Ann", "2").success).toBe(false);
  });

  it("accepts party size 1 and 2", () => {
    expect(parse("Ann", 1).success).toBe(true);
    expect(parse("Ann", 2).success).toBe(true);
  });

  it("trims the name", () => {
    const result = parse("  Ann  ", 2);
    expect(result.success && result.data.name).toBe("Ann");
  });
});

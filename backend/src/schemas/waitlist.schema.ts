import { z } from "zod";

export const joinWaitlistSchema = z.object({
  name: z
    .string({ required_error: "Name is required.", invalid_type_error: "Name must be text." })
    .trim()
    .min(1, "Name cannot be empty.")
    .max(100, "Name must be 100 characters or fewer."),
  partySize: z
    .number({
      required_error: "Party size is required.",
      invalid_type_error: "Party size must be a number.",
    })
    .int("Party size must be a whole number.")
    .positive("Party size must be greater than zero.")
    .max(1000, "Party size is too large."),
});

export const ticketParamSchema = z.object({
  ticketNumber: z.coerce
    .number({ invalid_type_error: "Ticket number must be a number." })
    .int("Ticket number must be a whole number.")
    .positive("Ticket number must be greater than zero."),
});

export type JoinWaitlistInput = z.infer<typeof joinWaitlistSchema>;
export type TicketParams = z.infer<typeof ticketParamSchema>;

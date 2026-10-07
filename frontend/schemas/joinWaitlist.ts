import { z } from "zod";

/**
 * Form values arrive as strings from <input>. This mirrors the backend rules for
 * fast feedback only; the backend remains the authority.
 */
export const joinWaitlistFormSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name.").max(100, "Name is too long."),
  partySize: z
    .string()
    .trim()
    .min(1, "Please enter your party size.")
    .transform((value) => Number(value))
    .pipe(
      z
        .number({ invalid_type_error: "Party size must be a number." })
        .int("Party size must be a whole number.")
        .positive("Party size must be greater than zero.")
        .max(1000, "Party size is too large."),
    ),
});

export type JoinWaitlistFormInput = z.input<typeof joinWaitlistFormSchema>;
export type JoinWaitlistPayload = z.output<typeof joinWaitlistFormSchema>;

-- CreateEnum
CREATE TYPE "WaitlistStatus" AS ENUM ('WAITING', 'REMOVED');

-- CreateTable
CREATE TABLE "waitlist_entries" (
    "id" TEXT NOT NULL,
    "ticketNumber" SERIAL NOT NULL,
    "customerName" TEXT NOT NULL,
    "partySize" INTEGER NOT NULL,
    "status" "WaitlistStatus" NOT NULL DEFAULT 'WAITING',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "removedAt" TIMESTAMP(3),

    CONSTRAINT "waitlist_entries_pkey" PRIMARY KEY ("id"),
    -- Database-level invariants (backend validation is authoritative, DB is the safety net)
    CONSTRAINT "waitlist_entries_party_size_positive" CHECK ("partySize" > 0),
    CONSTRAINT "waitlist_entries_name_not_blank" CHECK (length(btrim("customerName")) > 0),
    CONSTRAINT "waitlist_entries_removed_at_matches_status" CHECK (
        ("status" = 'REMOVED' AND "removedAt" IS NOT NULL) OR
        ("status" = 'WAITING' AND "removedAt" IS NULL)
    )
);

-- CreateIndex
CREATE UNIQUE INDEX "waitlist_entries_ticketNumber_key" ON "waitlist_entries"("ticketNumber");

-- CreateIndex
CREATE INDEX "waitlist_entries_status_ticketNumber_idx" ON "waitlist_entries"("status", "ticketNumber");

-- Tickets start at 1001. The sequence is never reset, so numbers are never reused.
ALTER SEQUENCE "waitlist_entries_ticketNumber_seq" RESTART WITH 1001;

import { PrismaClient } from "@prisma/client";
import { createApp } from "./app";
import { loadConfig } from "./config/env";
import { PrismaWaitlistRepository } from "./repositories/PrismaWaitlistRepository";
import { WaitlistService } from "./services/WaitlistService";

// Composition root: the only place concrete classes are wired together.
const config = loadConfig();
const prisma = new PrismaClient();
const waitlistService = new WaitlistService(new PrismaWaitlistRepository(prisma));
const app = createApp({ frontendUrl: config.frontendUrl, waitlistService });

const server = app.listen(config.port, () => {
  console.log(`Waitlist API listening on http://localhost:${config.port}`);
});

async function shutdown(): Promise<void> {
  server.close();
  await prisma.$disconnect();
  process.exit(0);
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

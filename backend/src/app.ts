import cors from "cors";
import express, { Express } from "express";
import { WaitlistController } from "./controllers/WaitlistController";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { createWaitlistRouter } from "./routes/waitlist.routes";
import { WaitlistService } from "./services/WaitlistService";

export interface AppOptions {
  frontendUrl: string;
  waitlistService: WaitlistService;
}

/** Builds the Express app. Kept separate from server.ts so it can be tested without a port. */
export function createApp({ frontendUrl, waitlistService }: AppOptions): Express {
  const app = express();

  app.use(cors({ origin: frontendUrl }));
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });
  app.use("/api", createWaitlistRouter(new WaitlistController(waitlistService)));

  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}

import { Router } from "express";
import { WaitlistController } from "../controllers/WaitlistController";

export function createWaitlistRouter(controller: WaitlistController): Router {
  const router = Router();

  // Customer
  router.post("/waitlist", controller.join);
  router.get("/waitlist/:ticketNumber", controller.getPosition);

  // Staff
  router.get("/staff/waitlist", controller.listWaiting);
  router.delete("/staff/waitlist/:ticketNumber", controller.remove);

  return router;
}

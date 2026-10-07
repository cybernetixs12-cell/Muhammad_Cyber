import { NextFunction, Request, RequestHandler, Response } from "express";
import { joinWaitlistSchema, ticketParamSchema } from "../schemas/waitlist.schema";
import { WaitlistService } from "../services/WaitlistService";

/** Express 4 does not catch rejected promises; forward them to the error handler. */
const asyncHandler =
  (fn: (req: Request, res: Response) => Promise<void>): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    fn(req, res).catch(next);
  };

/** HTTP only: parse input, call the service, shape the response. */
export class WaitlistController {
  constructor(private readonly service: WaitlistService) {}

  join = asyncHandler(async (req, res) => {
    const input = joinWaitlistSchema.parse(req.body);
    const result = await this.service.join(input);
    res.status(201).json(result);
  });

  getPosition = asyncHandler(async (req, res) => {
    const { ticketNumber } = ticketParamSchema.parse(req.params);
    res.json(await this.service.getPosition(ticketNumber));
  });

  listWaiting = asyncHandler(async (_req, res) => {
    res.json(await this.service.listWaiting());
  });

  remove = asyncHandler(async (req, res) => {
    const { ticketNumber } = ticketParamSchema.parse(req.params);
    await this.service.remove(ticketNumber);
    res.status(204).send();
  });
}

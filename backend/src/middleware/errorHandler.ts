import { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "../errors/AppError";

interface ErrorBody {
  success: false;
  error: { code: string; message: string };
}

const body = (code: string, message: string): ErrorBody => ({
  success: false,
  error: { code, message },
});

export const notFoundHandler: RequestHandler = (_req, res) => {
  res.status(404).json(body("NOT_FOUND", "Route not found."));
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    const message = err.issues[0]?.message ?? "Invalid request.";
    res.status(400).json(body("VALIDATION_ERROR", message));
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json(body(err.code, err.message));
    return;
  }

  // Malformed JSON body from express.json()
  if (err instanceof SyntaxError && "body" in err) {
    res.status(400).json(body("VALIDATION_ERROR", "Request body is not valid JSON."));
    return;
  }

  // Log details server-side only; never leak internals to the client.
  console.error(err);
  res.status(500).json(body("INTERNAL_ERROR", "Something went wrong."));
};

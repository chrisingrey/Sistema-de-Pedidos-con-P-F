import { NextFunction } from "express";
import { Request, Response } from "express";

export default function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (res.headersSent) return next(err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Internal Server Error" });
}

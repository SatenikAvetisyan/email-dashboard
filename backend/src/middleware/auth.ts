import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config.js";

export interface AuthRequest extends Request { user?: { id: string; email: string } }

export function auth(req: AuthRequest, res: Response, next: NextFunction) {
  const h = req.headers.authorization;
  if (!h?.startsWith("Bearer ")) return res.status(401).json({ error: "No token" });
  try {
    const payload = jwt.verify(h.slice(7), config.jwtSecret) as any;
    req.user = { id: payload.id, email: payload.email };
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

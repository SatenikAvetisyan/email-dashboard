import { Response } from "express";
import { Types } from "mongoose";
import { fetchLatest } from "../services/imap.service.js";
import { Email } from "../models/Email.js";

export async function syncInbox(req: any, res: Response) {
  const userId = new Types.ObjectId(req.user.id);
  const limit = Number(req.query.limit || 20);
  const docs = await fetchLatest(userId, limit);
  res.json({ synced: docs.length });
}

// (Se añadirán más handlers en otras ramas: list/search/detail/summarize)
export async function listEmails(req: any, res: Response) {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 20);
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Email.find({ userId: req.user.id }).sort({ date: -1 }).skip(skip).limit(limit),
    Email.countDocuments({ userId: req.user.id })
  ]);

  res.json({ items, total, page, pages: Math.ceil(total / limit) });
}

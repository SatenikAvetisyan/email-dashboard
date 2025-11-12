import { Response } from "express";
import { Types } from "mongoose";
import { fetchLatest } from "../services/imap.service.js";
import { listEmails, getEmailById, runAISummary, updateFlag } from "../services/email.service.js";
import { Email } from "../models/Email.js";

/**
 * POST /api/emails/sync
 * Sincroniza los últimos N correos desde IMAP a MongoDB
 */
export async function syncInbox(req: any, res: Response) {
  try {
    const userId = new Types.ObjectId(req.user.id);
    const limit = Number(req.query.limit || 20);

    const docs = await fetchLatest(userId, limit);
    res.json({ synced: docs.length });
  } catch (e) {
    console.error("syncInbox error:", e);
    res.status(500).json({ error: "Error syncing inbox" });
  }
}

/**
 * GET /api/emails?q=&page=&limit=
 * Búsqueda + paginación con índice de texto
 */
export async function search(req: any, res: Response) {
  try {
    const { q, page = 1, limit = 20 } = req.query as any;

    const result = await listEmails(req.user.id, q, Number(page), Number(limit));

    res.json(result);
  } catch (e) {
    console.error("email search error:", e);
    res.status(500).json({ error: "Error searching emails" });
  }
}
export async function detail(req: any, res: Response) {
  try {
    const { id } = req.params;
    const email = await getEmailById(id, req.user.id);
    if (!email) return res.status(404).json({ error: "Email not found" });
    res.json(email);
  } catch (e) {
    console.error("email detail error:", e);
    res.status(500).json({ error: "Error getting email detail" });
  }
}

export async function summarize(req: any, res: Response) {
  try {
    const { id } = req.params;
    const result = await runAISummary(id, req.user.id);
    if (!result) return res.status(404).json({ error: "Email not found" });
    res.json(result);
  } catch (e) {
    console.error("email summarize error:", e);
    res.status(500).json({ error: "Error summarizing email" });
  }
}

export async function setFlag(req: any, res: Response) {
  try {
    const { id } = req.params;
    const { flag, value } = req.body as { flag?: string; value?: boolean };

    if (typeof flag !== "string" || typeof value !== "boolean") {
      return res.status(400).json({ error: "flag(string) and value(boolean) required" });
    }

    const result = await updateFlag(id, req.user.id, flag, value);
    if (!result) return res.status(404).json({ error: "Email not found" });

    res.json(result);
  } catch (e: any) {
    if (e?.message === "Unsupported flag") {
      return res.status(400).json({ error: "Unsupported flag. Use Seen or Flagged." });
    }
    if (e?.message === "Invalid email id") {
      return res.status(400).json({ error: "Invalid email id" });
    }
    console.error("email setFlag error:", e);
    res.status(500).json({ error: "Error updating flag" });
  }
}

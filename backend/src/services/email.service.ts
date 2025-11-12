import { Email } from "../models/Email.js";
import { summarizeEmail } from "./ai.service.js";
import { Types } from "mongoose";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export async function listEmails(
  userId: string,
  q?: string,
  page = 1,
  limit = 20
) {
  const safePage = clamp(Number(page) || 1, 1, 10_000);
  const safeLimit = clamp(Number(limit) || 20, 1, 100);
  const skip = (safePage - 1) * safeLimit;

  const filter: any = { userId };
  let projection: any = {};
  let sort: any = { date: -1 };

  if (q && q.trim()) {
    filter.$text = { $search: q.trim() };
    projection = { score: { $meta: "textScore" } };
    sort = { score: { $meta: "textScore" }, date: -1 };
  }

  const [items, total] = await Promise.all([
    Email.find(filter, projection).sort(sort).skip(skip).limit(safeLimit).lean(),
    Email.countDocuments(filter)
  ]);

  return {
    items,
    total,
    page: safePage,
    pages: Math.ceil(total / safeLimit),
    limit: safeLimit,
    q: q || ""
  };
}

export async function getEmailById(emailId: string, userId: string) {
    if (!Types.ObjectId.isValid(emailId)) return null;
    return Email.findOne({ _id: emailId, userId }).lean();
}

export async function runAISummary(emailId: string, userId: string) {
    if (!Types.ObjectId.isValid(emailId)) throw new Error("Invalid email id");
  
    const email = await Email.findOne({ _id: emailId, userId });
    if (!email) return null;
  
    const base = email.text || email.html || email.snippet || email.subject || "";
    const { summary, keywords } = await summarizeEmail(base);
  
    email.aiSummary = summary;
    email.aiKeywords = keywords;
    await email.save();
  
    return { id: email.id, aiSummary: summary, aiKeywords: keywords };
  }
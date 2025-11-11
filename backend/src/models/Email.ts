import { Schema, model, Types } from "mongoose";

export interface IEmail {
  userId: Types.ObjectId;
  messageId: string;     // UID/Message-ID del servidor
  subject: string;
  from: string;
  to: string[];
  date: Date;
  snippet: string;
  folder: string;        // INBOX, etc.
  flags: string[];       // Seen, Answered, etc.
  aiSummary?: string;
  aiKeywords?: string[];
}

const schema = new Schema<IEmail>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  messageId: { type: String, index: true, required: true },
  subject: String,
  from: String,
  to: [String],
  date: Date,
  snippet: String,
  folder: { type: String, default: "INBOX" },
  flags: { type: [String], default: [] },
  aiSummary: String,
  aiKeywords: [String]
}, { timestamps: true });

schema.index({ userId: 1, date: -1 });
schema.index({ userId: 1, subject: "text" });

export const Email = model<IEmail>("Email", schema);

import { Schema, model, Types } from "mongoose";

export interface IEmail {
  userId: Types.ObjectId;
  messageId: string;
  subject: string;
  from: string;
  to: string[];
  date: Date;
  snippet: string;
  text: string;
  html: string;
  folder: string;
  flags: string[];
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
  text: String,
  html: String,
  folder: { type: String, default: "INBOX" },
  flags: { type: [String], default: [] },
  aiSummary: String,
  aiKeywords: [String]
}, { timestamps: true });

// Orden por fecha dentro de cada usuario
schema.index({ userId: 1, date: -1 });

// Índice de texto para búsqueda por asunto, remitente y snippet
schema.index(
  { subject: "text", from: "text", snippet: "text" },
  { weights: { subject: 5, from: 3, snippet: 1 }, name: "EmailTextIndex" }
);

export const Email = model<IEmail>("Email", schema);

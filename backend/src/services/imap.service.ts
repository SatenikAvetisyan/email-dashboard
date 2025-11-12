import { ImapFlow } from "imapflow";
import { config } from "../config.js";
import { Email } from "../models/Email.js";
import { Types } from "mongoose";

let client: ImapFlow | null = null;

export async function connectIMAP() {
  client = new ImapFlow({
    host: config.imap.host,
    port: config.imap.port,
    secure: config.imap.secure,
    auth: { user: config.imap.user, pass: config.imap.pass }
  });

  await client.connect();
  console.log("📡 IMAP conectado");
}

/**
 * Trae los últimos N mensajes de INBOX y los guarda/actualiza por (userId, messageId)
 */
export async function fetchLatest(userId: Types.ObjectId, limit = 20) {
  if (!client) throw new Error("IMAP not connected");

  await client.mailboxOpen("INBOX");
  const lock = await client.getMailboxLock("INBOX");
  try {
    const exists = client.mailbox && typeof client.mailbox === 'object' ? client.mailbox.exists : 0;
    const startSeq = Math.max(1, exists - limit + 1);
    const synced: any[] = [];

    for await (const msg of client.fetch({ seq: `${startSeq}:*` }, { envelope: true, flags: true, source: true })) {
      const subject = msg.envelope?.subject || "";
      const from = msg.envelope?.from?.map(a => `${a.name || ""} <${a.address || ""}>`).join(", ") || "";
      const to = (msg.envelope?.to || []).map((a: any) => a.address);
      const date = msg.envelope?.date ? new Date(msg.envelope.date) : new Date();

      // Parse superfácil del raw para obtener un snippet
      const raw = msg.source?.toString("utf8") || "";
      const snippet = raw.slice(0, 160).replace(/\s+/g, " ").trim();

      const doc = {
        userId,
        messageId: String(msg.uid),
        subject,
        from,
        to,
        date,
        snippet,
        folder: "INBOX",
        flags: Array.from(msg.flags || [])
      };

      await Email.updateOne(
        { userId, messageId: doc.messageId },
        { $set: doc },
        { upsert: true }
      );

      synced.push(doc);
    }

    return synced.slice(-limit);
  } finally {
    lock.release();
  }
}

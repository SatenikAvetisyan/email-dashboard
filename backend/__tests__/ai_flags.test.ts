import request from "supertest";
import { app } from "../src/app";
import { startTestDB, stopTestDB } from "./setup";
import { User } from "../src/models/User";
import { Email } from "../src/models/Email";
import jwt from "jsonwebtoken";
import { config } from "../src/config";

const auth = async () => {
  const u = await User.create({ email: "b@b.com", passwordHash: "x" });
  const token = jwt.sign({ id: u.id, email: u.email }, config.jwtSecret);
  return { u, token: `Bearer ${token}` };
};

beforeAll(startTestDB);
afterAll(stopTestDB);

describe("ai & flags", () => {
  it("summarize + flags", async () => {
    const { u, token } = await auth();
    const e = await Email.create({
      userId: u.id, messageId: "9", subject: "Recordatorio de pago",
      from: "Facturación <no-reply@pay.com>", to:[u.email],
      date: new Date(), snippet: "Tu factura vence mañana", folder: "INBOX", flags: []
    });

    const sum = await request(app).post(`/api/emails/${e.id}/summarize`).set("Authorization", token);
    expect(sum.status).toBe(200);
    expect(sum.body.aiSummary).toBeDefined();

    const f1 = await request(app)
      .patch(`/api/emails/${e.id}/flags`).set("Authorization", token)
      .send({ flag: "Seen", value: true });
    expect(f1.status).toBe(200);
    expect(f1.body.flags).toContain("Seen");
  });
});

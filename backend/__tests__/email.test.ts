import request from "supertest";
import { app } from "../src/app";
import { startTestDB, stopTestDB } from "./setup";
import { User } from "../src/models/User";
import { Email } from "../src/models/Email";
import jwt from "jsonwebtoken";
import { config } from "../src/config";

function tokenFor(userId: string, email: string) {
  return jwt.sign({ id: userId, email }, config.jwtSecret, { expiresIn: "1h" });
}

beforeAll(startTestDB);
afterAll(stopTestDB);

describe("emails", () => {
  let token = ""; let userId = "";
  beforeAll(async () => {
    const u = await User.create({ email: "a@a.com", passwordHash: "x" });
    userId = u.id;
    token = `Bearer ${tokenFor(userId, u.email)}`;
    await Email.insertMany([
      { userId, messageId: "1", subject: "Factura PayPal", from: "PayPal <no-reply@paypal.com>", to:["a@a.com"], date:new Date(), snippet:"Tu pago ha sido recibido", folder:"INBOX", flags:[] },
      { userId, messageId: "2", subject: "Bienvenido", from: "Equipo <hello@site.com>", to:["a@a.com"], date:new Date(), snippet:"Gracias por registrarte", folder:"INBOX", flags:["Seen"] }
    ]);
  });

  it("list & search", async () => {
    const r1 = await request(app).get("/api/emails?limit=10").set("Authorization", token);
    expect(r1.status).toBe(200);
    expect(r1.body.items.length).toBeGreaterThan(0);

    const r2 = await request(app).get("/api/emails?q=Factura").set("Authorization", token);
    expect(r2.status).toBe(200);
  });

  it("detail", async () => {
    const list = await Email.findOne({ userId, messageId: "1" });
    const r = await request(app).get(`/api/emails/${list!.id}`).set("Authorization", token);
    expect(r.status).toBe(200);
    expect(r.body.subject).toMatch(/Factura/);
  });
});

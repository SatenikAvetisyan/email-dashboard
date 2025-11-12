import request from "supertest";
import { app } from "../src/app";
import { startTestDB, stopTestDB } from "./setup";

beforeAll(startTestDB);
afterAll(stopTestDB);

describe("auth", () => {
  it("register + login", async () => {
    const email = "test@example.com", password = "secret123";
    const r = await request(app).post("/api/auth/register").send({ email, password });
    expect(r.status).toBe(201);
    const l = await request(app).post("/api/auth/login").send({ email, password });
    expect(l.status).toBe(200);
    expect(l.body.token).toBeDefined();
  });

  it("protected without token -> 401", async () => {
    const res = await request(app).get("/api/emails");
    expect(res.status).toBe(401);
  });
});

import express from "express";
import cors from "cors";
import { config } from "./config";
import api from "./routes/index.ts";

export const app = express();
app.use(cors({ origin: config.clientOrigin }));
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api", api);
import { Router } from "express";

const api = Router();
// (las rutas reales se añaden en ramas siguientes)
api.get("/", (_req, res) => res.json({ api: "ok" }));

export default api;

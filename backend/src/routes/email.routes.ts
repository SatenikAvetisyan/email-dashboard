import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { syncInbox, search, detail, summarize, setFlag } from "../controllers/email.controller.js";

const r = Router();

r.post("/sync", auth, syncInbox);
r.get("/", auth, search);
r.get("/:id", auth, detail);
r.post("/:id/summarize", auth, summarize);
r.patch("/:id/flags", auth, setFlag);

export default r;
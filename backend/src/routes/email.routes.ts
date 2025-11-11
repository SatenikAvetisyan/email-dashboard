import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { syncInbox, search, detail } from "../controllers/email.controller.js";

const r = Router();

r.post("/sync", auth, syncInbox);
r.get("/", auth, search);
r.get("/:id", auth, detail);

export default r;
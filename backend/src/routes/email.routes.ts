import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { syncInbox, search } from "../controllers/email.controller.js";

const r = Router();

r.post("/sync", auth, syncInbox);
r.get("/", auth, search);

export default r;
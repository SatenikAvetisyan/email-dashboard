import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { syncInbox, listEmails } from "../controllers/email.controller.js";

const r = Router();

r.post("/sync", auth, syncInbox);
r.get("/", auth, listEmails);

export default r;
import { Router } from "express";
import authRoutes from "./auth.routes.js";
import emailRoutes from "./email.routes.js";

const api = Router();
api.use("/auth", authRoutes);
api.use("/emails", emailRoutes);

export default api;

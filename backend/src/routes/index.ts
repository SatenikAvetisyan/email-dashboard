import { Router } from "express";
import authRoutes from "./auth.routes";
import emailRoutes from "./email.routes";

const api = Router();
api.use("/auth", authRoutes);
api.use("/emails", emailRoutes);

export default api;

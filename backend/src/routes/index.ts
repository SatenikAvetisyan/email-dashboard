import { Router } from "express";
import authRoutes from "./auth.routes.js";

const api = Router();
api.use("/auth", authRoutes);

export default api;

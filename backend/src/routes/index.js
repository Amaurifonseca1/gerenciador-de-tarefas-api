import { Router } from "express";
import authRoutes from "./auth.routes.js";
import taskRoutes from "./task.routes.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { me } from "../controllers/me.controller.js";

const router = Router();

router.use(authRoutes);

router.get("/me", requireAuth, me);

router.use("/tasks", taskRoutes);

export default router;

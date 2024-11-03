//routes/index.ts

import { Router } from "express";
import {
  calculateFeed,
  getNutrientAnalysis,
} from "../controllers/feedController";
import swineRoutes from "./swineRoutes";
import authRoutes from "./authRoutes"; // Import auth routes
import { authenticateToken } from "../middleware/authMiddleware";
import userRoutes from "./userRoutes";
import formulationRoutes from "./formulationRoutes";

const router = Router();

router.use("/user", userRoutes);
router.use("/auth", authRoutes); // Register auth routes with /auth prefix
router.post("/calculate-feed", calculateFeed);
router.use("/swine", authenticateToken, swineRoutes); // Protect swine routes with authentication
router.get("/nutrient-analysis", getNutrientAnalysis);

router.use('/formulations', formulationRoutes); // All formulation routes under /formulations

export default router;

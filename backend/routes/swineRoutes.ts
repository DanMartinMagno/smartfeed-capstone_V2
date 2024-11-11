// backend/routes/swineRoutes.ts

import { Router } from "express";
import {
  getSwines,
  addSwine,
  getSwineWeights,
  addWeight,
  updateSwine,
  deleteSwine,
  deleteWeight,
  updateWeight,
} from "../controllers/swineController";
import { authenticateToken } from "../middleware/authMiddleware";

const router: Router = Router();

// Swine routes (ensure all routes use authenticateToken)
router.get("/", authenticateToken, getSwines);
router.post("/", authenticateToken, addSwine);
router.get("/:swineId/weights", authenticateToken, getSwineWeights);
router.post("/:swineId/weights", authenticateToken, addWeight);
router.put("/:swineId", authenticateToken, updateSwine);
router.delete("/:swineId", authenticateToken, deleteSwine);
router.delete("/:swineId/weights/:weightId", authenticateToken, deleteWeight);
router.put("/:swineId/weights/:weightId", authenticateToken, updateWeight);

export default router;

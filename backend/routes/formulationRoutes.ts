// routes/formulationRoutes.ts

import { Router } from "express";
import {
  saveFormulation,
  getFormulations,
} from "../controllers/formulationController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

router.post("/save", authenticateToken, saveFormulation);
router.get("/user-formulations", authenticateToken, getFormulations); // Ensure route is correct

export default router;

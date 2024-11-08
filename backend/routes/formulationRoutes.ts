// routes/formulationRoutes.ts

import { Router } from "express";
import {
  saveFormulation,
  getFormulations,
  deleteFormulation,
} from "../controllers/formulationController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

router.post("/save", authenticateToken, saveFormulation);
router.get("/user-formulations", authenticateToken, getFormulations); // Ensure route is correct
router.delete("/:id", authenticateToken, deleteFormulation);

export default router;

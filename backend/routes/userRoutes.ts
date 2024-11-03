// backend/routes/userRoutes.ts
import { Router } from "express";
import { changePassword, updateUser } from "../controllers/userController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

router.put("/update", authenticateToken, updateUser);
router.put("/change-password", authenticateToken, changePassword);
export default router;

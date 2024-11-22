// backend/routes/userRoutes.ts
import { Router } from "express";
import { changePassword, updateUser } from "../controllers/userController";
import { authenticateToken } from "../middleware/authMiddleware";
import { getUserProfile } from "../controllers/authController";

const router = Router();

router.put("/update", authenticateToken, updateUser);
router.put("/change-password", authenticateToken, changePassword);
router.get("/profile", authenticateToken, getUserProfile);
export default router;

// backend/middleware/authMiddleware.ts
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const JWT_SECRET = process.env.JWT_SECRET || "danmartinmagno12";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    console.warn("No token provided in request"); // Log missing token
    return res.status(401).json({ message: "Token not provided" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error("Token verification failed:", err); // Log verification failure
      return res
        .status(403)
        .json({ message: "Token verification failed", error: err });
    }

    if (typeof user === "object" && "userId" in user) {
      req.user = user as { userId: string };
      console.log("Token verified, user authenticated:", user.userId); // Log successful authentication
      next();
    } else {
      console.warn("Invalid token payload received"); // Log invalid payload
      res.status(403).json({ message: "Invalid token payload" });
    }
  });
};

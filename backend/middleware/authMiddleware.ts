// backend/middleware/authMiddleware.ts
import jwt, { JwtPayload } from "jsonwebtoken";
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
    return res.status(401).json({ message: "Token not provided" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token verification failed" });
    }

    if (user && typeof user === "object" && "userId" in user) {
      (req as any).user = { userId: user.userId };
      next();
    } else {
      res.status(403).json({ message: "Invalid token payload" });
    }
  });
};

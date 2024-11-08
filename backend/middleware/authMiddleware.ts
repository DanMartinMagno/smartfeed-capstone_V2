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
    console.warn("No token provided in request");
    return res.status(401).json({ message: "Token not provided" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      // Handle token expiration specifically
      if (err.name === "TokenExpiredError") {
        console.warn("Token expired");
        return res
          .status(403)
          .json({ message: "Token expired, please log in again." });
      }
      console.error("Token verification failed:", err);
      return res
        .status(403)
        .json({ message: "Token verification failed", error: err });
    }

    // Set the user ID on the request object for use in routes
    if (typeof user === "object" && "userId" in user) {
      req.user = user as { userId: string };
      next();
    } else {
      res.status(403).json({ message: "Invalid token payload" });
    }
  });
};

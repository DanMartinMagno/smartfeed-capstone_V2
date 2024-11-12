// backend/types/AuthenticatedRequest.ts
import { Request } from "express";

// AuthenticatedRequest requires `user` with `userId`
export interface AuthenticatedRequest extends Request {
  user: { userId: string };
}

// <reference types="jest" />
import { IUser } from "./models/user";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: IUser["_id"];
      };
    }
  }
}

import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/user";

const JWT_SECRET = process.env.JWT_SECRET || "danmartinmagno12";

const generateToken = (user: IUser) => {
  return jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });
};

export const signup = async (req: Request, res: Response) => {
  const { lastName, firstName, middleInitial, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const user = new User({
      lastName,
      firstName,
      middleInitial,
      email,
      password,
    });
    await user.save();

    const token = generateToken(user);
    res.status(201).json({ userId: user._id, token });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Error creating account", error });
  }
};

// backend/controllers/authController.ts

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found with email:", email);
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "30d",
    });
    res.json({ user, token });
  } catch (error) {
    console.error("Login error:", (error as Error).message);
    res
      .status(500)
      .json({ message: "Failed to login", error: (error as Error).message });
  }
};

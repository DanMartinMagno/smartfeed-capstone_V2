/// <reference path="../global.d.ts" />  //
import { Request, Response } from "express";
import User from "../models/user";
import bcrypt from "bcrypt";

export const updateUser = async (req: Request, res: Response) => {

  const { lastName, firstName, middleInitial, email } = req.body;

  if (!req.user || !req.user.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      { lastName, firstName, middleInitial, email },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error); // Log specific error details
    const errMessage = (error as Error).message;
    res
      .status(500)
      .json({ message: "Failed to update user", error: errMessage });
  }
};


export const changePassword = async (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body;

  if (!req.user || !req.user.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });


    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
 

    await User.findOneAndUpdate(
      { _id: req.user.userId },
      { $set: { password: hashedPassword } },
      { new: true, upsert: true }
    );

    res.json({
      message: "Password changed successfully. Please log in again.",
    });
  } catch (error) {
    console.error("Failed to change password:", error);
    res.status(500).json({ message: "Failed to change password", error });
  }
};

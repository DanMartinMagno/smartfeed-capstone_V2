// controllers/formulationController.ts

import { Request, Response } from "express";
import Formulation, { IFormulation } from "../models/formulation";

// Save a new formulation
export const saveFormulation = async (req: Request, res: Response) => {
  try {
    const {
      type,
      numSwine,
      ingredients,
      totalNutrients,
      name,
      description,
      expirationDate,
    } = req.body;
    const userId = req.user?.userId;

    // Check for required fields
    if (!userId || !type || !ingredients || !totalNutrients) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate total nutrients are non-zero
    if (Object.values(totalNutrients).every((value) => value === 0)) {
      return res
        .status(400)
        .json({ message: "Total nutrients cannot be zero" });
    }

    // Log expirationDate for debugging
    console.log("Received expirationDate:", expirationDate);

    // Validate expirationDate
    const expiration = new Date(expirationDate);
    if (isNaN(expiration.getTime())) {
      return res
        .status(400)
        .json({ message: "Invalid expiration date format" });
    }

    const newFormulation = new Formulation({
      userId,
      type,
      numSwine,
      ingredients,
      totalNutrients,
      name,
      description,
      expirationDate: expiration, // Use validated date
    });

    const savedFormulation = await newFormulation.save();
    res.status(201).json({
      message: "Formulation saved successfully",
      formulation: savedFormulation,
    });
  } catch (error) {
    console.error("Error saving formulation:", error);
    res.status(500).json({ message: "Failed to save formulation", error });
  }
};

// Get all saved formulations for a user
export const getFormulations = async (req: Request, res: Response) => {
  const { userId } = req.user!;

  try {
    const formulations = await Formulation.find({ userId });
    res.json(formulations);
  } catch (error) {
    console.error("Error retrieving formulations:", error);
    res.status(500).json({ message: "Error retrieving formulations", error });
  }
};

export const deleteFormulation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const formulation = await Formulation.findByIdAndDelete(id);
    if (!formulation) {
      return res.status(404).json({ message: "Formulation not found" });
    }
    res.status(200).json({ message: "Formulation deleted successfully" });
  } catch (error) {
    console.error("Error deleting formulation:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

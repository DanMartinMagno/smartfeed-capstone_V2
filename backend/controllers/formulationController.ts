// controllers/formulationController.ts

import { Request, Response } from "express";
import Formulation, { IFormulation } from "../models/formulation";

// Save a new formulation
// controllers/formulationController.ts

// Save a new formulation
export const saveFormulation = async (req: Request, res: Response) => {
  try {
    const {
      type,
      numSwine,
      ingredients, // Updated to 'ingredients' from 'selectedIngredients'
      totalNutrients,
      name,
      description,
    } = req.body;
    const userId = req.user?.userId;

    if (!userId || !type || !ingredients || !totalNutrients) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newFormulation = new Formulation({
      userId,
      type,
      numSwine,
      ingredients,
      totalNutrients,
      name,
      description,
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

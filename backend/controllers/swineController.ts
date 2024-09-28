import { Request, Response } from "express";
import Swine from "../models/swine";

const isError = (error: unknown): error is Error => {
  return (error as Error).message !== undefined;
};

export const getSwines = async (req: Request, res: Response): Promise<void> => {
  try {
    const swines = await Swine.find();
    res.json(swines);
  } catch (err) {
    if (isError(err)) {
      console.error("Error in getSwines:", err.message);
      res.status(500).json({ message: err.message });
    } else {
      console.error("Unknown error in getSwines");
      res.status(500).json({ message: "Unknown error" });
    }
  }
};

export const addSwine = async (req: Request, res: Response): Promise<void> => {
  const { id, weight, age } = req.body;

  try {
    // Normalize Swine ID by trimming and converting to lowercase
    const normalizedId = id.trim().toLowerCase();

    // Check if a Swine with the same normalized ID already exists
    const existingSwine = await Swine.findOne({ id: normalizedId });
    if (existingSwine) {
      res.status(400).json({ message: "ID already exists" });
      return;
    }

    // Create a new Swine entry with the normalized ID
    const swine = new Swine({
      id: normalizedId,
      weight,
      age,
      weights: [{ weight, date: new Date() }], // Include initial weight
    });

    const newSwine = await swine.save();
    res.status(201).json(newSwine);
  } catch (err) {
    if (isError(err)) {
      console.error("Error in addSwine:", err.message);
      res.status(400).json({ message: err.message });
    } else {
      console.error("Unknown error in addSwine");
      res.status(400).json({ message: "Unknown error" });
    }
  }
};

export const getSwineWeights = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { swineId } = req.params;

    // Normalize the Swine ID by trimming and converting to lowercase
    const normalizedId = swineId.trim().toLowerCase();

    const swine = await Swine.findOne({ id: normalizedId });
    if (!swine) {
      console.error(`Swine with id ${normalizedId} not found`);
      res.status(404).json({ message: "Swine not found" });
    } else {
      res.json(swine.weights);
    }
  } catch (err) {
    if (isError(err)) {
      console.error("Error in getSwineWeights:", err.message);
      res.status(500).json({ message: err.message });
    } else {
      console.error("Unknown error in getSwineWeights");
      res.status(500).json({ message: "Unknown error" });
    }
  }
};

export const addWeight = async (req: Request, res: Response): Promise<void> => {
  const { swineId } = req.params;
  const { date, weight } = req.body;

  if (!date || !weight) {
    res.status(400).json({ message: "Date and weight are required" });
    return;
  }

  try {
    const swine = await Swine.findOne({ id: swineId.trim() });
    if (!swine) {
      res.status(404).json({ message: "Swine not found" });
      return;
    }

    // If there are any existing weights, validate the new weight
    if (swine.weights.length > 0) {
      const latestWeightEntry = swine.weights[swine.weights.length - 1];

      // Ensure the new weight is greater than the latest recorded weight
      if (weight <= latestWeightEntry.weight) {
        res.status(400).json({
          message: `New weight (${weight} kg) must be greater than the latest weight (${latestWeightEntry.weight} kg).`,
        });
        return;
      }
    }

    // Add the new weight entry (no validation if there are no existing weights)
    swine.weights.push({ date, weight });
    await swine.save();
    res.json(swine);
  } catch (err) {
    if (isError(err)) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(400).json({ message: "Unknown error" });
    }
  }
};

export const deleteSwine = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { swineId } = req.params;

  try {
    // Normalize Swine ID by trimming and converting to lowercase
    const normalizedId = swineId.trim().toLowerCase();

    const swine = await Swine.findOneAndDelete({ id: normalizedId });
    if (!swine) {
      res.status(404).json({ message: "Swine not found" });
    } else {
      res.json({ message: "Swine deleted" });
    }
  } catch (err) {
    if (isError(err)) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(400).json({ message: "Unknown error" });
    }
  }
};

export const updateSwine = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { swineId } = req.params;
  const { weight, age } = req.body;

  try {
    const swine = await Swine.findOneAndUpdate(
      { id: swineId.trim() }, // Ensure there's no trailing whitespace
      { weight, age },
      { new: true, runValidators: true }
    );
    if (!swine) {
      res.status(404).json({ message: "Swine not found" });
    } else {
      res.json(swine);
    }
  } catch (err) {
    if (isError(err)) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(400).json({ message: "Unknown error" });
    }
  }
};

export const updateWeight = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { swineId, weightId } = req.params;
  const { weight } = req.body;

  try {
    const swine = await Swine.findOne({ id: swineId.trim() });
    if (!swine) {
      res.status(404).json({ message: "Swine not found" });
      return;
    }

    const weightEntry = swine.weights.id(weightId);
    if (!weightEntry) {
      res.status(404).json({ message: "Weight entry not found" });
      return;
    }

    // Prevent editing the last weight entry
    if (swine.weights.length === 1) {
      res.status(400).json({ message: "Cannot edit the last weight entry." });
      return;
    }

    weightEntry.weight = weight; // Update the weight
    const updatedSwine = await swine.save(); // Save the swine with the updated weight
    res.json(updatedSwine); // Return the updated swine object, including weights
  } catch (err) {
    if (isError(err)) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(400).json({ message: "Unknown error" });
    }
  }
};

export const deleteWeight = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { swineId, weightId } = req.params;

  try {
    const swine = await Swine.findOne({ id: swineId.trim() });
    if (!swine) {
      res.status(404).json({ message: "Swine not found" });
      return;
    }

    // Prevent deletion if there's only one weight entry
    if (swine.weights.length === 1) {
      res.status(400).json({ message: "Cannot delete the last weight entry." });
      return;
    }

    const weightEntry = swine.weights.id(weightId);
    if (!weightEntry) {
      res.status(404).json({ message: "Weight entry not found" });
      return;
    }

    weightEntry.remove(); // Remove the weight entry
    const updatedSwine = await swine.save(); // Save the swine without the deleted weight
    res.json(updatedSwine); // Return the updated swine object
  } catch (err) {
    if (isError(err)) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(400).json({ message: "Unknown error" });
    }
  }
};

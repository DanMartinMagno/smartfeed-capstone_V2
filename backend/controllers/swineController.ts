import { Request, Response } from "express";
import Swine from "../models/swine";

const isError = (error: unknown): error is Error => {
  return (error as Error).message !== undefined;
};

// Get all swines for the logged-in user
export const getSwines = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const userId = req.user?.userId;
  if (!userId) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const swines = await Swine.find({ userId });
    return res.json(swines);
  } catch (err) {
    console.error("Error in getSwines:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Add a new swine for the logged-in user
export const addSwine = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id, weight, age } = req.body;
  const userId = req.user?.userId; // Extract the logged-in user's ID

  if (!userId) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const normalizedId = id.trim().toLowerCase();

    const swine = new Swine({
      id: normalizedId,
      userId, // Associate the swine with the logged-in user
      weight,
      age,
      weights: [{ weight, date: new Date() }],
    });

    const newSwine = await swine.save();
    return res.status(201).json(newSwine); // Return the newly created swine
  } catch (err: unknown) {
    if (
      err instanceof Error &&
      (err as any).code === 11000 // MongoDB duplicate key error
    ) {
      // Handle duplicate key error
      return res.status(400).json({
        message: `Swine with ID "${id}" already exists.`,
      });
    }

    console.error("Error in addSwine:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get all weight entries for a specific swine belonging to the logged-in user
export const getSwineWeights = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { swineId } = req.params;
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const swine = await Swine.findOne({
      id: swineId.trim().toLowerCase(),
      userId,
    });
    if (!swine) {
      return res.status(404).json({ message: "Swine not found" });
    }
    return res.json(swine.weights);
  } catch (err) {
    console.error("Error in getSwineWeights:", err);
    return res
      .status(500)
      .json({ message: isError(err) ? err.message : "Unknown error" });
  }
};

// Add a new weight entry to a swine for the logged-in user
export const addWeight = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { swineId } = req.params;
  const { date, weight } = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  if (!date || !weight) {
    return res.status(400).json({ message: "Date and weight are required" });
  }

  try {
    const swine = await Swine.findOne({
      id: swineId.trim().toLowerCase(),
      userId,
    });
    if (!swine) {
      return res.status(404).json({ message: "Swine not found" });
    }

    // Add the new weight entry
    swine.weights.push({ date, weight });
    await swine.save();
    return res.json(swine);
  } catch (err) {
    console.error("Error in addWeight:", err);
    return res
      .status(500)
      .json({ message: isError(err) ? err.message : "Unknown error" });
  }
};

// Delete a swine owned by the logged-in user
export const deleteSwine = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { swineId } = req.params;
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const swine = await Swine.findOneAndDelete({
      id: swineId.trim().toLowerCase(),
      userId,
    });
    if (!swine) {
      return res.status(404).json({ message: "Swine not found" });
    }
    return res.json({ message: "Swine deleted" });
  } catch (err) {
    console.error("Error in deleteSwine:", err);
    return res
      .status(500)
      .json({ message: isError(err) ? err.message : "Unknown error" });
  }
};

// Update a swine's details for the logged-in user
export const updateSwine = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { swineId } = req.params;
  const { weight, age } = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const swine = await Swine.findOneAndUpdate(
      { id: swineId.trim().toLowerCase(), userId },
      { weight, age },
      { new: true, runValidators: true }
    );
    if (!swine) {
      return res.status(404).json({ message: "Swine not found" });
    }
    return res.json(swine);
  } catch (err) {
    console.error("Error in updateSwine:", err);
    return res
      .status(500)
      .json({ message: isError(err) ? err.message : "Unknown error" });
  }
};

// Update a specific weight entry for a swine owned by the logged-in user
export const updateWeight = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { swineId, weightId } = req.params;
  const { weight } = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const swine = await Swine.findOne({
      id: swineId.trim().toLowerCase(),
      userId,
    });
    if (!swine) {
      return res.status(404).json({ message: "Swine not found" });
    }

    const weightEntry = swine.weights.id(weightId);
    if (!weightEntry) {
      return res.status(404).json({ message: "Weight entry not found" });
    }

    // Update the weight entry
    weightEntry.weight = weight;
    const updatedSwine = await swine.save();
    return res.json(updatedSwine);
  } catch (err) {
    console.error("Error in updateWeight:", err);
    return res
      .status(500)
      .json({ message: isError(err) ? err.message : "Unknown error" });
  }
};

// Delete a specific weight entry from a swine owned by the logged-in user
export const deleteWeight = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { swineId, weightId } = req.params;
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const swine = await Swine.findOne({
      id: swineId.trim().toLowerCase(),
      userId,
    });
    if (!swine) {
      return res.status(404).json({ message: "Swine not found" });
    }

    // Prevent deletion if there's only one weight entry
    if (swine.weights.length === 1) {
      return res
        .status(400)
        .json({ message: "Cannot delete the last weight entry." });
    }

    const weightEntry = swine.weights.id(weightId);
    if (!weightEntry) {
      return res.status(404).json({ message: "Weight entry not found" });
    }

    weightEntry.remove(); // Remove the weight entry
    const updatedSwine = await swine.save(); // Save the swine without the deleted weight
    return res.json(updatedSwine); // Return the updated swine object
  } catch (err) {
    console.error("Error in deleteWeight:", err);
    return res
      .status(500)
      .json({ message: isError(err) ? err.message : "Unknown error" });
  }
};

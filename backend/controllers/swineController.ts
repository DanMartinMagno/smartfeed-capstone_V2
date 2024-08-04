import { Request, Response } from 'express';
import Swine from '../models/swine';

const isError = (error: unknown): error is Error => {
  return (error as Error).message !== undefined;
};

export const getSwines = async (req: Request, res: Response): Promise<void> => {
  try {
    const swines = await Swine.find();
    res.json(swines);
  } catch (err) {
    if (isError(err)) {
      console.error('Error in getSwines:', err.message);
      res.status(500).json({ message: err.message });
    } else {
      console.error('Unknown error in getSwines');
      res.status(500).json({ message: 'Unknown error' });
    }
  }
};

export const addSwine = async (req: Request, res: Response): Promise<void> => {
  const { id, weight, age } = req.body;
  const swine = new Swine({
    id,
    weight,
    age,
    weights: [{ weight, date: new Date() }] // Include initial weight
  });

  try {
    const newSwine = await swine.save();
    res.status(201).json(newSwine);
  } catch (err) {
    if (isError(err)) {
      console.error('Error in addSwine:', err.message);
      res.status(400).json({ message: err.message });
    } else {
      console.error('Unknown error in addSwine');
      res.status(400).json({ message: 'Unknown error' });
    }
  }
};

export const getSwineWeights = async (req: Request, res: Response): Promise<void> => {
  try {
    const { swineId } = req.params;
    const swine = await Swine.findOne({ id: swineId }); // Find by id field
    if (!swine) {
      console.error(`Swine with id ${swineId} not found`);
      res.status(404).json({ message: 'Swine not found' });
    } else {
      res.json(swine.weights);
    }
  } catch (err) {
    if (isError(err)) {
      console.error('Error in getSwineWeights:', err.message);
      res.status(500).json({ message: err.message });
    } else {
      console.error('Unknown error in getSwineWeights');
      res.status(500).json({ message: 'Unknown error' });
    }
  }
};

export const addWeight = async (req: Request, res: Response): Promise<void> => {
  const { swineId } = req.params;
  const { date, weight } = req.body;

  if (!date || !weight) {
    res.status(400).json({ message: 'Date and weight are required' });
    return;
  }

  try {
    const swine = await Swine.findOne({ id: swineId.trim() });
    if (!swine) {
      res.status(404).json({ message: 'Swine not found' });
      return;
    }

    swine.weights.push({ date, weight });
    await swine.save();
    res.json(swine);
  } catch (err) {
    if (isError(err)) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(400).json({ message: 'Unknown error' });
    }
  }
};



export const deleteSwine = async (req: Request, res: Response): Promise<void> => {
  const { swineId } = req.params;

  try {
    const swine = await Swine.findOneAndDelete({ id: swineId });
    if (!swine) {
      res.status(404).json({ message: 'Swine not found' });
    } else {
      res.json({ message: 'Swine deleted' });
    }
  } catch (err) {
    if (isError(err)) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(400).json({ message: 'Unknown error' });
    }
  }
};


export const updateSwine = async (req: Request, res: Response): Promise<void> => {
  const { swineId } = req.params;
  const { weight, age } = req.body;

  try {
    const swine = await Swine.findOneAndUpdate(
      { id: swineId.trim() }, // Ensure there's no trailing whitespace
      { weight, age },
      { new: true, runValidators: true }
    );
    if (!swine) {
      res.status(404).json({ message: 'Swine not found' });
    } else {
      res.json(swine);
    }
  } catch (err) {
    if (isError(err)) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(400).json({ message: 'Unknown error' });
    }
  }
};

export const deleteWeight = async (req: Request, res: Response): Promise<void> => {
  const { swineId } = req.params;
  const { date } = req.body;

  if (!date) {
    res.status(400).json({ message: 'Date is required' });
    return;
  }

  try {
    const swine = await Swine.findOne({ id: swineId.trim() });
    if (!swine) {
      res.status(404).json({ message: 'Swine not found' });
      return;
    }

    const weightDate = new Date(date);
    const weightIndex = swine.weights.findIndex(weightEntry => weightEntry.date.toISOString() === weightDate.toISOString());

    if (weightIndex === -1) {
      res.status(404).json({ message: 'Weight entry not found' });
      return;
    }

    swine.weights.splice(weightIndex, 1);
    await swine.save();
    res.json(swine);
  } catch (err) {
    console.error('Error deleting weight entry:', err);
    if (isError(err)) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(400).json({ message: 'Unknown error' });
    }
  }
};


export const updateWeight = async (req: Request, res: Response): Promise<void> => {
  const { swineId, weightId } = req.params;
  const { weight } = req.body;

  try {
    const swine = await Swine.findOne({ id: swineId.trim() });
    if (!swine) {
      res.status(404).json({ message: 'Swine not found' });
      return;
    }

    const weightEntry = swine.weights.id(weightId);
    if (!weightEntry) {
      res.status(404).json({ message: 'Weight entry not found' });
      return;
    }

    weightEntry.weight = weight;
    await swine.save();
    res.json(swine);
  } catch (err) {
    if (isError(err)) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(400).json({ message: 'Unknown error' });
    }
  }
};


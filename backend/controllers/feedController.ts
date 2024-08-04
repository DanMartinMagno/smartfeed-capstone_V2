import { Request, Response } from 'express';
import { feedFormulation, getNutrientRecommendations } from '../services/feedService';

export const calculateFeed = (req: Request, res: Response) => {
  const { selectedIngredients, type, numSwine } = req.body;
  try {
    if (!selectedIngredients || !type || !numSwine) {
      throw new Error('Missing required fields: selectedIngredients, type, and numSwine');
    }
    const result = feedFormulation(selectedIngredients, type, numSwine);
    res.json(result);
  } catch (error) {
    const err = error as Error;
    console.error('Error calculating feed formulation:', err.message, err.stack);
    res.status(500).json({ error: 'An error occurred while calculating the feed formulation.', details: err.message });
  }
};

export const getNutrientAnalysis = (req: Request, res: Response) => {
  const { type } = req.query;
  try {
    if (!type) {
      throw new Error('Missing required field: type');
    }
    const recommendations = getNutrientRecommendations(type as 'starter' | 'grower' | 'finisher');
    res.json(recommendations);
  } catch (error) {
    const err = error as Error;
    console.error('Error getting nutrient analysis:', err.message, err.stack);
    res.status(500).json({ error: 'An error occurred while getting the nutrient analysis.', details: err.message });
  }
};
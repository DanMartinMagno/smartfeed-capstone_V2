import { Router } from 'express';
import { 
  getSwines, 
  addSwine, 
  getSwineWeights, 
  addWeight, 
  updateSwine, 
  deleteSwine, 
  deleteWeight, 
  updateWeight 
} from '../controllers/swineController';

const router: Router = Router();

// Swine routes
router.get('/', getSwines);  // Fetch all swines
router.post('/', addSwine);  // Add a new swine
router.get('/:swineId/weights', getSwineWeights);  // Get all weight entries for a specific swine
router.post('/:swineId/weights', addWeight);  // Add a new weight entry for a swine
router.put('/:swineId', updateSwine);  // Update a specific swine
router.delete('/:swineId', deleteSwine);  // Delete a specific swine

// Weight routes within a swine
router.delete('/:swineId/weights/:weightId', deleteWeight);  // Delete a specific weight entry by its ID
router.put('/:swineId/weights/:weightId', updateWeight);  // Update a specific weight entry by its ID

export default router;

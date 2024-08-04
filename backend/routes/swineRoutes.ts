import { Router } from 'express';
import { getSwines, addSwine, getSwineWeights, addWeight, updateSwine, deleteSwine, deleteWeight, updateWeight } from '../controllers/swineController';

const router: Router = Router();

router.get('/', getSwines);
router.post('/', addSwine);
router.get('/:swineId/weights', getSwineWeights);
router.post('/:swineId/weights', addWeight);
router.put('/:swineId', updateSwine);
router.delete('/:swineId', deleteSwine);
router.delete('/:swineId/weights', deleteWeight);
router.put('/:swineId/weights/:weightId', updateWeight); // Add this route for updating a weight entry

export default router;

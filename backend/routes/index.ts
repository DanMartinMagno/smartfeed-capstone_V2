import { Router } from 'express';
import { calculateFeed, getNutrientAnalysis } from '../controllers/feedController';
import swineRoutes from './swineRoutes';

const router = Router();

router.post('/calculate-feed', calculateFeed);
router.use('/swine', swineRoutes); // Add this line
router.get('/nutrient-analysis', getNutrientAnalysis);

export default router;

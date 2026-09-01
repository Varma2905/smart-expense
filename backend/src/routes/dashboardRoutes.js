import express from 'express';
import {
  getDashboardSummary,
  getDashboardTrends,
  getDashboardCategories,
} from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/summary', getDashboardSummary);
router.get('/trends', getDashboardTrends);
router.get('/categories', getDashboardCategories);

export default router;

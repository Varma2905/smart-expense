import express from 'express';
import {
  getAnalyticsOverview,
  getAnalyticsCategories,
  getAnalyticsTrends,
} from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/overview', getAnalyticsOverview);
router.get('/categories', getAnalyticsCategories);
router.get('/trends', getAnalyticsTrends);

export default router;

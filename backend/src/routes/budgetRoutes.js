import express from 'express';
import {
  getBudgets,
  createOrUpdateBudget,
  updateBudget,
  deleteBudget,
} from '../controllers/budgetController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { budgetSchema } from '../utils/validators.js';

const router = express.Router();

router.use(protect);

router.route('/').get(getBudgets).post(validate(budgetSchema), createOrUpdateBudget);
router.route('/:id').put(updateBudget).delete(deleteBudget);

export default router;

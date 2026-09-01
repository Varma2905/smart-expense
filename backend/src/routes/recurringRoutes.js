import express from 'express';
import {
  getRecurring,
  createRecurring,
  updateRecurring,
  deleteRecurring,
} from '../controllers/recurringController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { recurringSchema } from '../utils/validators.js';

const router = express.Router();

router.use(protect);

router.route('/').get(getRecurring).post(validate(recurringSchema), createRecurring);
router.route('/:id').put(updateRecurring).delete(deleteRecurring);

export default router;

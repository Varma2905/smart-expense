import { RecurringTransaction } from '../models/RecurringTransaction.js';

// Helper to compute next occurrence date based on frequency
function calculateNextDate(startDate, frequency) {
  const start = new Date(startDate || Date.now());
  const next = new Date(start);

  switch (frequency) {
    case 'weekly':
      next.setDate(next.getDate() + 7);
      break;
    case 'monthly':
      next.setMonth(next.getMonth() + 1);
      break;
    case 'quarterly':
      next.setMonth(next.getMonth() + 3);
      break;
    case 'yearly':
      next.setFullYear(next.getFullYear() + 1);
      break;
    default:
      next.setMonth(next.getMonth() + 1);
  }
  return next;
}

// @desc    Get all recurring transactions for user
// @route   GET /api/recurring
export const getRecurring = async (req, res, next) => {
  try {
    const recurringList = await RecurringTransaction.find({ userId: req.user._id }).sort({ nextDate: 1 });

    res.json({
      success: true,
      data: recurringList,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new recurring transaction
// @route   POST /api/recurring
export const createRecurring = async (req, res, next) => {
  try {
    const { name, amount, type, category, frequency, startDate, active } = req.body;

    const start = startDate ? new Date(startDate) : new Date();
    const nextDate = calculateNextDate(start, frequency);

    const recurring = await RecurringTransaction.create({
      userId: req.user._id,
      name,
      amount,
      type,
      category,
      frequency,
      startDate: start,
      nextDate,
      active: active !== undefined ? active : true,
    });

    res.status(201).json({
      success: true,
      data: recurring,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a recurring transaction
// @route   PUT /api/recurring/:id
export const updateRecurring = async (req, res, next) => {
  try {
    let recurring = await RecurringTransaction.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!recurring) {
      return res.status(404).json({
        success: false,
        message: 'Recurring transaction not found',
      });
    }

    if (req.body.frequency || req.body.startDate) {
      const start = req.body.startDate || recurring.startDate;
      const freq = req.body.frequency || recurring.frequency;
      req.body.nextDate = calculateNextDate(start, freq);
    }

    recurring = await RecurringTransaction.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      data: recurring,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a recurring transaction
// @route   DELETE /api/recurring/:id
export const deleteRecurring = async (req, res, next) => {
  try {
    const recurring = await RecurringTransaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!recurring) {
      return res.status(404).json({
        success: false,
        message: 'Recurring transaction not found',
      });
    }

    res.json({
      success: true,
      message: 'Recurring transaction deleted successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};

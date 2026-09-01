import { Budget } from '../models/Budget.js';
import { getBudgetOverview } from '../services/financialCalculationService.js';

// @desc    Get user budgets and budget performance overview
// @route   GET /api/budgets
export const getBudgets = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const now = new Date();
    const m = month ? parseInt(month, 10) : now.getMonth() + 1;
    const y = year ? parseInt(year, 10) : now.getFullYear();

    const overview = await getBudgetOverview(req.user._id, m, y);

    res.json({
      success: true,
      data: overview,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create or update a budget limit for category/overall
// @route   POST /api/budgets
export const createOrUpdateBudget = async (req, res, next) => {
  try {
    const { category, amount, month, year } = req.body;

    const budget = await Budget.findOneAndUpdate(
      {
        userId: req.user._id,
        category,
        month,
        year,
      },
      { amount },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(201).json({
      success: true,
      data: budget,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing budget
// @route   PUT /api/budgets/:id
export const updateBudget = async (req, res, next) => {
  try {
    const { amount } = req.body;

    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { amount },
      { new: true, runValidators: true }
    );

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found',
      });
    }

    res.json({
      success: true,
      data: budget,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a budget
// @route   DELETE /api/budgets/:id
export const deleteBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found',
      });
    }

    res.json({
      success: true,
      message: 'Budget deleted successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};

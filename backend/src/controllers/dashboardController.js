import {
  getFinancialSummary,
  getTrends,
  getCategoryBreakdown,
  getBudgetOverview,
} from '../services/financialCalculationService.js';
import { Transaction } from '../models/Transaction.js';

// @desc    Get Dashboard KPI summary & budget overview
// @route   GET /api/dashboard/summary
export const getDashboardSummary = async (req, res, next) => {
  try {
    const summary = await getFinancialSummary(req.user._id);
    const budgetOverview = await getBudgetOverview(req.user._id);

    // Fetch 5 most recent transactions
    const recentTransactions = await Transaction.find({ userId: req.user._id })
      .sort({ date: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        kpi: summary,
        budget: budgetOverview,
        recentTransactions,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard spending overview trend chart
// @route   GET /api/dashboard/trends
export const getDashboardTrends = async (req, res, next) => {
  try {
    const { timeframe = '30d' } = req.query;
    const trends = await getTrends(req.user._id, timeframe);

    res.json({
      success: true,
      data: trends,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard category breakdown pie/donut chart
// @route   GET /api/dashboard/categories
export const getDashboardCategories = async (req, res, next) => {
  try {
    const { startDate, endDate, type = 'expense' } = req.query;
    const categories = await getCategoryBreakdown(req.user._id, startDate, endDate, type);

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

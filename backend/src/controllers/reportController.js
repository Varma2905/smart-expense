import {
  getFinancialSummary,
  getCategoryBreakdown,
  getBudgetOverview,
} from '../services/financialCalculationService.js';
import { Transaction } from '../models/Transaction.js';

// @desc    Get detailed report summary data
// @route   GET /api/reports/summary
export const getReportSummary = async (req, res, next) => {
  try {
    const { startDate, endDate, category, type } = req.query;

    const summary = await getFinancialSummary(req.user._id, startDate, endDate);
    const categoryBreakdown = await getCategoryBreakdown(req.user._id, startDate, endDate, type || 'expense');
    const budgetOverview = await getBudgetOverview(req.user._id);

    const query = { userId: req.user._id };
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    if (category) query.category = category;
    if (type) query.type = type;

    const transactions = await Transaction.find(query).sort({ date: -1 });

    res.json({
      success: true,
      data: {
        user: {
          name: req.user.name,
          email: req.user.email,
          currency: req.user.currency,
        },
        period: summary.period,
        kpi: summary,
        categoryBreakdown,
        budgetOverview,
        transactionCount: transactions.length,
        transactions,
      },
    });
  } catch (error) {
    next(error);
  }
};

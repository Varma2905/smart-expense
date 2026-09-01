import {
  getAnalyticsStats,
  getCategoryBreakdown,
  getTrends,
} from '../services/financialCalculationService.js';

// @desc    Get complete analytics overview & summary stats
// @route   GET /api/analytics/overview
export const getAnalyticsOverview = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const stats = await getAnalyticsStats(req.user._id, startDate, endDate);

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get analytics category distribution
// @route   GET /api/analytics/categories
export const getAnalyticsCategories = async (req, res, next) => {
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

// @desc    Get analytics trends over custom timeframe
// @route   GET /api/analytics/trends
export const getAnalyticsTrends = async (req, res, next) => {
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

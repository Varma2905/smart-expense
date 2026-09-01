import {
  getFinancialSummary,
  getCategoryBreakdown,
  getBudgetOverview,
  getAnalyticsStats,
} from '../services/financialCalculationService.js';
import { generateFinancialInsights } from '../services/aiInsightService.js';

// @desc    Generate AI financial insights based on backend calculations
// @route   POST /api/ai/insights
export const getAIInsights = async (req, res, next) => {
  try {
    const { query } = req.body;

    // STEP 1: Backend performs all financial aggregations
    const summary = await getFinancialSummary(req.user._id);
    const categories = await getCategoryBreakdown(req.user._id);
    const budget = await getBudgetOverview(req.user._id);
    const analytics = await getAnalyticsStats(req.user._id);

    const financialData = {
      summary,
      categories,
      budget,
      analytics,
    };

    // STEP 2: Pass calculated stats to AI Engine (Gemini API or intelligent rule fallback)
    const insightResult = await generateFinancialInsights(req.user, financialData, query);

    res.json({
      success: true,
      data: {
        provider: insightResult.provider,
        insight: insightResult.insight,
        stats: {
          totalIncome: summary.income,
          totalExpenses: summary.expenses,
          savings: summary.savings,
          savingsRate: summary.savingsRate,
          topCategory: analytics.topCategory,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

import mongoose from 'mongoose';
import { Transaction } from '../models/Transaction.js';
import { Budget } from '../models/Budget.js';

/**
 * Calculates overall financial stats: Balance, Income, Expenses, Savings, Savings Rate, and percentage changes vs previous period.
 */
export const getFinancialSummary = async (userId, startDate = null, endDate = null) => {
  const userObjectId = new mongoose.Types.ObjectId(userId);
  const now = new Date();

  // If no date range provided, default to current month
  const start = startDate ? new Date(startDate) : new Date(now.getFullYear(), now.getMonth(), 1);
  const end = endDate ? new Date(endDate) : new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  // Compute duration in ms to find previous comparison period
  const durationMs = end.getTime() - start.getTime();
  const prevStart = new Date(start.getTime() - durationMs - 1);
  const prevEnd = new Date(start.getTime() - 1);

  // Aggregation for current period
  const currentStats = await Transaction.aggregate([
    { $match: { userId: userObjectId, date: { $gte: start, $lte: end } } },
    {
      $group: {
        _id: '$type',
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
  ]);

  // Aggregation for previous period (for percentage change calculations)
  const prevStats = await Transaction.aggregate([
    { $match: { userId: userObjectId, date: { $gte: prevStart, $lte: prevEnd } } },
    {
      $group: {
        _id: '$type',
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
  ]);

  const currentIncome = currentStats.find((s) => s._id === 'income')?.total || 0;
  const currentExpenses = currentStats.find((s) => s._id === 'expense')?.total || 0;
  const currentBalance = currentIncome - currentExpenses;
  const currentSavings = Math.max(0, currentIncome - currentExpenses);
  const savingsRate = currentIncome > 0 ? Number(((currentSavings / currentIncome) * 100).toFixed(1)) : 0;

  const prevIncome = prevStats.find((s) => s._id === 'income')?.total || 0;
  const prevExpenses = prevStats.find((s) => s._id === 'expense')?.total || 0;
  const prevBalance = prevIncome - prevExpenses;
  const prevSavings = Math.max(0, prevIncome - prevExpenses);

  const calcChange = (curr, prev) => {
    if (prev === 0) return curr > 0 ? 100 : 0;
    return Number((((curr - prev) / prev) * 100).toFixed(1));
  };

  return {
    period: { start, end },
    balance: currentBalance,
    income: currentIncome,
    expenses: currentExpenses,
    savings: currentSavings,
    savingsRate,
    changes: {
      balance: calcChange(currentBalance, prevBalance),
      income: calcChange(currentIncome, prevIncome),
      expenses: calcChange(currentExpenses, prevExpenses),
      savings: calcChange(currentSavings, prevSavings),
    },
  };
};

/**
 * Gets spending over time trends (grouped by date) for charts.
 */
export const getTrends = async (userId, timeframe = '30d') => {
  const userObjectId = new mongoose.Types.ObjectId(userId);
  const now = new Date();
  let startDate = new Date();

  switch (timeframe) {
    case '7d':
      startDate.setDate(now.getDate() - 7);
      break;
    case '30d':
      startDate.setDate(now.getDate() - 30);
      break;
    case '3m':
      startDate.setMonth(now.getMonth() - 3);
      break;
    case '6m':
      startDate.setMonth(now.getMonth() - 6);
      break;
    case '1y':
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    default:
      startDate.setDate(now.getDate() - 30);
  }

  const result = await Transaction.aggregate([
    {
      $match: {
        userId: userObjectId,
        date: { $gte: startDate, $lte: now },
      },
    },
    {
      $group: {
        _id: {
          dateStr: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          type: '$type',
        },
        amount: { $sum: '$amount' },
      },
    },
    { $sort: { '_id.dateStr': 1 } },
  ]);

  // Transform into daily data objects with income, expense, savings
  const trendMap = {};
  result.forEach((item) => {
    const d = item._id.dateStr;
    if (!trendMap[d]) {
      trendMap[d] = { date: d, income: 0, expenses: 0, savings: 0 };
    }
    if (item._id.type === 'income') {
      trendMap[d].income = item.amount;
    } else {
      trendMap[d].expenses = item.amount;
    }
    trendMap[d].savings = Math.max(0, trendMap[d].income - trendMap[d].expenses);
  });

  return Object.values(trendMap).sort((a, b) => a.date.localeCompare(b.date));
};

/**
 * Gets expense breakdown by category with amounts and percentages.
 */
export const getCategoryBreakdown = async (userId, startDate = null, endDate = null, type = 'expense') => {
  const userObjectId = new mongoose.Types.ObjectId(userId);
  const now = new Date();
  const start = startDate ? new Date(startDate) : new Date(now.getFullYear(), now.getMonth(), 1);
  const end = endDate ? new Date(endDate) : new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const categories = await Transaction.aggregate([
    {
      $match: {
        userId: userObjectId,
        type: type,
        date: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: '$category',
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    { $sort: { total: -1 } },
  ]);

  const grandTotal = categories.reduce((acc, curr) => acc + curr.total, 0);

  return categories.map((cat) => ({
    category: cat._id,
    amount: cat.total,
    count: cat.count,
    percentage: grandTotal > 0 ? Number(((cat.total / grandTotal) * 100).toFixed(1)) : 0,
  }));
};

/**
 * Computes monthly budget overview and category status.
 */
export const getBudgetOverview = async (userId, month = null, year = null) => {
  const now = new Date();
  const m = month || now.getMonth() + 1;
  const y = year || now.getFullYear();

  const userObjectId = new mongoose.Types.ObjectId(userId);
  const startOfMonth = new Date(y, m - 1, 1);
  const endOfMonth = new Date(y, m, 0, 23, 59, 59);

  // Fetch budgets configured by user for this month
  const userBudgets = await Budget.find({ userId, month: m, year: y }).lean();

  // Aggregate current spending per category for this month
  const spending = await Transaction.aggregate([
    {
      $match: {
        userId: userObjectId,
        type: 'expense',
        date: { $gte: startOfMonth, $lte: endOfMonth },
      },
    },
    {
      $group: {
        _id: '$category',
        spent: { $sum: '$amount' },
      },
    },
  ]);

  const spendingMap = {};
  let totalSpent = 0;
  spending.forEach((item) => {
    spendingMap[item._id] = item.spent;
    totalSpent += item.spent;
  });

  // Calculate overall budget if set, or sum of category budgets
  const overallBudgetDoc = userBudgets.find((b) => b.category.toLowerCase() === 'overall');
  const overallLimit = overallBudgetDoc
    ? overallBudgetDoc.amount
    : userBudgets.reduce((sum, b) => sum + b.amount, 0);

  const overallStatus =
    overallLimit > 0
      ? totalSpent > overallLimit
        ? 'over_budget'
        : totalSpent / overallLimit >= 0.8
        ? 'near_limit'
        : 'under_budget'
      : 'no_budget';

  // Build category status array
  const categoryBudgets = userBudgets
    .filter((b) => b.category.toLowerCase() !== 'overall')
    .map((b) => {
      const spent = spendingMap[b.category] || 0;
      const remaining = Math.max(0, b.amount - spent);
      const percentageUsed = b.amount > 0 ? Number(((spent / b.amount) * 100).toFixed(1)) : 0;
      let status = 'under_budget';
      if (spent > b.amount) status = 'over_budget';
      else if (percentageUsed >= 80) status = 'near_limit';

      return {
        id: b._id,
        category: b.category,
        budget: b.amount,
        spent,
        remaining,
        percentageUsed,
        status,
      };
    });

  return {
    month: m,
    year: y,
    overall: {
      budget: overallLimit,
      spent: totalSpent,
      remaining: Math.max(0, overallLimit - totalSpent),
      percentageUsed: overallLimit > 0 ? Number(((totalSpent / overallLimit) * 100).toFixed(1)) : 0,
      status: overallStatus,
    },
    categories: categoryBudgets,
  };
};

/**
 * Gets advanced analytics stats for Analytics Page.
 */
export const getAnalyticsStats = async (userId, startDate = null, endDate = null) => {
  const userObjectId = new mongoose.Types.ObjectId(userId);
  const now = new Date();
  const start = startDate ? new Date(startDate) : new Date(now.getFullYear(), now.getMonth(), 1);
  const end = endDate ? new Date(endDate) : new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const daysCount = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));

  const txs = await Transaction.find({
    userId,
    date: { $gte: start, $lte: end },
  }).lean();

  const totalIncome = txs.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = txs.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const totalTransactions = txs.length;
  const avgTransactionAmount = totalTransactions > 0 ? (totalIncome + totalExpenses) / totalTransactions : 0;
  const avgDailySpending = totalExpenses / daysCount;

  // Find highest spending day
  const dailySpendMap = {};
  txs.filter((t) => t.type === 'expense').forEach((t) => {
    const dStr = new Date(t.date).toISOString().split('T')[0];
    dailySpendMap[dStr] = (dailySpendMap[dStr] || 0) + t.amount;
  });

  let highestSpendingDay = { date: 'N/A', amount: 0 };
  Object.entries(dailySpendMap).forEach(([dStr, amt]) => {
    if (amt > highestSpendingDay.amount) {
      highestSpendingDay = { date: dStr, amount: amt };
    }
  });

  // Find top expense category
  const categoryBreakdown = await getCategoryBreakdown(userId, start, end, 'expense');
  const topCategory = categoryBreakdown.length > 0 ? categoryBreakdown[0] : { category: 'None', amount: 0 };

  const savingsRate = totalIncome > 0 ? Number((((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(1)) : 0;

  return {
    totalIncome,
    totalExpenses,
    savings: Math.max(0, totalIncome - totalExpenses),
    savingsRate,
    avgDailySpending: Number(avgDailySpending.toFixed(2)),
    highestSpendingDay,
    topCategory: topCategory.category,
    topCategoryAmount: topCategory.amount,
    totalTransactions,
    avgTransactionAmount: Number(avgTransactionAmount.toFixed(2)),
  };
};

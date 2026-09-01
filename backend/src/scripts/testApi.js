import dotenv from 'dotenv';
import { connectDB, closeDB } from '../config/db.js';
import { User } from '../models/User.js';
import { Transaction } from '../models/Transaction.js';
import { Budget } from '../models/Budget.js';
import { RecurringTransaction } from '../models/RecurringTransaction.js';
import { getFinancialSummary, getTrends, getCategoryBreakdown, getBudgetOverview, getAnalyticsStats } from '../services/financialCalculationService.js';
import { generateFinancialInsights } from '../services/aiInsightService.js';

dotenv.config();

const testFullPipeline = async () => {
  try {
    console.log('--- [API Test Pipeline] Starting Test ---');
    await connectDB();

    let user = await User.findOne({ email: 'demo@smartexpense.com' });
    if (!user) {
      console.log('[Test] In-memory database empty. Populating demo data...');
      user = await User.create({
        name: 'Alex Morgan',
        email: 'demo@smartexpense.com',
        password: 'Password123!',
        currency: 'INR',
      });

      const now = new Date();
      await Budget.create({
        userId: user._id,
        category: 'overall',
        amount: 50000,
        month: now.getMonth() + 1,
        year: now.getFullYear(),
      });

      await Transaction.insertMany([
        { userId: user._id, type: 'income', amount: 85000, category: 'Salary', description: 'Tech Corp Salary', date: new Date(), paymentMethod: 'Bank Transfer' },
        { userId: user._id, type: 'expense', amount: 3200, category: 'Food', description: 'Organic Grocery Store', date: new Date(), paymentMethod: 'UPI' },
        { userId: user._id, type: 'expense', amount: 1200, category: 'Shopping', description: 'Amazon Order', date: new Date(), paymentMethod: 'Credit Card' },
        { userId: user._id, type: 'expense', amount: 450, category: 'Transport', description: 'Uber Ride', date: new Date(), paymentMethod: 'UPI' },
      ]);
    }

    console.log(`[Test] Found Demo User: ${user.name} (${user.email})`);

    // 1. KPI Financial Summary
    const summary = await getFinancialSummary(user._id);
    console.log('[Test] KPI Summary:');
    console.log(`  Balance: ${user.currency} ${summary.balance}`);
    console.log(`  Income:  ${user.currency} ${summary.income}`);
    console.log(`  Expense: ${user.currency} ${summary.expenses}`);
    console.log(`  Savings: ${user.currency} ${summary.savings} (${summary.savingsRate}%)`);

    // 2. Spending Trends
    const trends = await getTrends(user._id, '30d');
    console.log(`[Test] Trends Data Points: ${trends.length} days`);

    // 3. Category Breakdown
    const categories = await getCategoryBreakdown(user._id);
    console.log(`[Test] Expense Categories Count: ${categories.length}`);
    if (categories.length > 0) {
      console.log(`  Top Category: ${categories[0].category} (${categories[0].percentage}%)`);
    }

    // 4. Budget Overview
    const budget = await getBudgetOverview(user._id);
    console.log(`[Test] Budget Status: ${budget.overall.status} (Spent ${budget.overall.spent} / Limit ${budget.overall.budget})`);

    // 5. Analytics Stats
    const analytics = await getAnalyticsStats(user._id);
    console.log(`[Test] Avg Daily Spending: ${user.currency} ${analytics.avgDailySpending}`);
    console.log(`[Test] Total Transactions Count: ${analytics.totalTransactions}`);

    // 6. AI Insight Generation
    const aiInsight = await generateFinancialInsights(user, { summary, categories, budget, analytics });
    console.log(`[Test] AI Insight Engine Provider: ${aiInsight.provider}`);
    console.log('[Test] Generated Insight Snippet:');
    console.log(aiInsight.insight.slice(0, 180) + '...');

    console.log('--- [API Test Pipeline] ALL TESTS PASSED SUCCESSFULLY! ---');
    await closeDB();
    process.exit(0);
  } catch (err) {
    console.error('[Test Failure]', err);
    process.exit(1);
  }
};

testFullPipeline();

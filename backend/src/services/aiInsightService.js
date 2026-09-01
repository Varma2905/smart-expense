import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Generates financial insights using Gemini API if key is present,
 * or fallback rule-based intelligence if no API key is set.
 */
export const generateFinancialInsights = async (user, financialData, query = null) => {
  const apiKey = process.env.AI_API_KEY;

  if (apiKey && apiKey.trim().length > 0) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `
You are SmartExpense AI, an expert, encouraging financial advisor.
User Name: ${user.name}
Preferred Currency: ${user.currency || 'INR'}

Calculated Financial Summary (DO NOT RE-CALCULATE, ONLY INTERPRET):
- Total Income: ${user.currency} ${financialData.summary.income}
- Total Expenses: ${user.currency} ${financialData.summary.expenses}
- Net Savings: ${user.currency} ${financialData.summary.savings}
- Savings Rate: ${financialData.summary.savingsRate}%
- Top Expense Category: ${financialData.analytics.topCategory} (${user.currency} ${financialData.analytics.topCategoryAmount})
- Average Daily Spending: ${user.currency} ${financialData.analytics.avgDailySpending}
- Highest Spending Day: ${financialData.analytics.highestSpendingDay.date} (${user.currency} ${financialData.analytics.highestSpendingDay.amount})
- Budget Status: ${financialData.budget.overall.status} (Spent: ${financialData.budget.overall.spent} / ${financialData.budget.overall.budget})

User Prompt / Question: "${query || 'Provide a full financial health breakdown and actionable advice for me this month.'}"

Rules:
1. Provide concise, high-impact bullet points and structured advice.
2. Use markdown formatting with bolding and section headers.
3. Be professional, friendly, and practical.
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return {
        provider: 'Gemini AI',
        insight: response.text(),
      };
    } catch (err) {
      console.warn('[AI Service] Gemini API call failed, using rule-based insight engine:', err.message);
    }
  }

  // Fallback Rule-Based AI Engine
  return {
    provider: 'SmartExpense Built-in Rule Engine',
    insight: buildRuleBasedInsight(user, financialData, query),
  };
};

function buildRuleBasedInsight(user, data, query) {
  const { summary, budget, analytics, categories } = data;
  const curr = user.currency || 'INR';

  if (query && query.toLowerCase().includes('where did i spend the most')) {
    return `### 💡 Top Spending Analysis
Your highest expense category is **${analytics.topCategory}**, accounting for **${curr} ${analytics.topCategoryAmount.toLocaleString()}** in spending.
Your highest single spending day was **${analytics.highestSpendingDay.date}** with **${curr} ${analytics.highestSpendingDay.amount.toLocaleString()}** spent.

**Tip:** Consider setting a category budget for ${analytics.topCategory} in the Budgets section to cap unnecessary spending.`;
  }

  let insightText = `### 📊 Monthly Financial Health Breakdown for ${user.name}\n\n`;

  // Savings status
  if (summary.savingsRate >= 20) {
    insightText += `* **Great Savings Rate (${summary.savingsRate}%):** You saved **${curr} ${summary.savings.toLocaleString()}** this period. You are meeting standard recommended savings goals (20%+).\n`;
  } else if (summary.savingsRate > 0) {
    insightText += `* **Moderate Savings Rate (${summary.savingsRate}%):** You saved **${curr} ${summary.savings.toLocaleString()}**. Increasing your savings rate towards 20% will build a stronger emergency buffer.\n`;
  } else {
    insightText += `* **⚠️ Deficit / Low Savings Warning:** Your expenses (**${curr} ${summary.expenses.toLocaleString()}**) are close to or exceeding your income (**${curr} ${summary.income.toLocaleString()}**).\n`;
  }

  // Top Category
  if (categories && categories.length > 0) {
    const top = categories[0];
    insightText += `* **Primary Spending Driver:** **${top.category}** represents **${top.percentage}%** of total expenses (${curr} ${top.amount.toLocaleString()}).\n`;
  }

  // Budget status
  if (budget.overall.budget > 0) {
    if (budget.overall.status === 'over_budget') {
      insightText += `* **🚨 Budget Overlimit Alert:** You have exceeded your monthly budget by **${curr} ${(budget.overall.spent - budget.overall.budget).toLocaleString()}** (${budget.overall.percentageUsed}% used).\n`;
    } else if (budget.overall.status === 'near_limit') {
      insightText += `* **⚡ Budget Limit Warning:** You have used **${budget.overall.percentageUsed}%** of your monthly limit. You have **${curr} ${budget.overall.remaining.toLocaleString()}** remaining.\n`;
    } else {
      insightText += `* **✅ Healthy Budgeting:** You are comfortably within your monthly budget (**${budget.overall.percentageUsed}%** used).\n`;
    }
  }

  insightText += `\n### 🎯 Actionable Recommendations
1. **Pace Daily Expenses:** Your average daily expenditure is **${curr} ${analytics.avgDailySpending.toLocaleString()}**. Keeping daily discretionary spends under **${curr} ${(analytics.avgDailySpending * 0.85).toFixed(0)}** can boost monthly savings by 15%.
2. **Review Subscriptions & Recurring Costs:** Ensure all active recurring bills in your Recurring tab are still providing value.
3. **Emergency Fund:** Aim to maintain 3-6 months of expenses (**${curr} ${(summary.expenses * 3).toLocaleString()}**) in a high-yield liquid account.`;

  return insightText;
}

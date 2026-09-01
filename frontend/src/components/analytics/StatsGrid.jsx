import React from 'react';
import { Calendar, Tag, CreditCard, Percent, DollarSign, Award } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const StatsGrid = ({ stats, currency = 'INR' }) => {
  if (!stats) return null;

  const statItems = [
    {
      title: 'Average Daily Spend',
      value: formatCurrency(stats.avgDailySpending, currency),
      icon: DollarSign,
      color: 'text-brand-400 bg-brand-500/10 border-brand-500/20',
    },
    {
      title: 'Highest Spending Day',
      value: `${stats.highestSpendingDay?.date || 'N/A'} (${formatCurrency(stats.highestSpendingDay?.amount || 0, currency)})`,
      icon: Calendar,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    },
    {
      title: 'Top Expense Category',
      value: `${stats.topCategory || 'None'} (${formatCurrency(stats.topCategoryAmount || 0, currency)})`,
      icon: Tag,
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    },
    {
      title: 'Total Transactions',
      value: stats.totalTransactions || 0,
      icon: CreditCard,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    },
    {
      title: 'Avg Transaction Value',
      value: formatCurrency(stats.avgTransactionAmount, currency),
      icon: Award,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    },
    {
      title: 'Net Savings Rate',
      value: `${stats.savingsRate}%`,
      icon: Percent,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {statItems.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div key={idx} className="glass-card p-5 rounded-2xl border border-slate-800/80 flex items-center gap-4">
            <div className={`p-3 rounded-xl border ${item.color} shrink-0`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{item.title}</p>
              <p className="text-base font-extrabold text-white truncate mt-0.5">{item.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

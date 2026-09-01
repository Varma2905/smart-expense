import React from 'react';
import { NavLink } from 'react-router-dom';
import { PiggyBank, AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const BudgetOverviewCard = ({ budget, currency = 'INR' }) => {
  if (!budget || !budget.overall) return null;

  const { overall, categories = [] } = budget;

  let statusBadge = (
    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
      <CheckCircle2 className="w-3.5 h-3.5" /> Under Budget
    </span>
  );

  if (overall.status === 'over_budget') {
    statusBadge = (
      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse">
        <AlertTriangle className="w-3.5 h-3.5" /> Over Budget
      </span>
    );
  } else if (overall.status === 'near_limit') {
    statusBadge = (
      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
        <AlertTriangle className="w-3.5 h-3.5" /> Near Limit
      </span>
    );
  }

  const progressBarColor =
    overall.percentageUsed > 100
      ? 'bg-rose-500'
      : overall.percentageUsed >= 80
      ? 'bg-amber-500'
      : 'bg-emerald-500';

  return (
    <div className="glass-card p-6 rounded-2xl border border-slate-800/80 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <PiggyBank className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Monthly Budget Overview</h3>
            <p className="text-xs text-slate-400">Track monthly spending limit</p>
          </div>
        </div>

        {statusBadge}
      </div>

      {/* Main Budget Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm font-semibold">
          <span className="text-slate-300">
            Spent: <span className="text-white">{formatCurrency(overall.spent, currency)}</span>
          </span>
          <span className="text-slate-400">
            Budget: <span className="text-white">{formatCurrency(overall.budget, currency)}</span>
          </span>
        </div>

        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
          <div
            className={`h-full rounded-full transition-all duration-500 ${progressBarColor}`}
            style={{ width: `${Math.min(100, overall.percentageUsed)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
          <span>{overall.percentageUsed}% used</span>
          <span>Remaining: {formatCurrency(overall.remaining, currency)}</span>
        </div>
      </div>

      {/* Category Budgets Snapshot */}
      {categories.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-slate-800/60">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">Category Caps</span>
            <NavLink to="/budgets" className="text-xs font-semibold text-brand-400 hover:underline flex items-center gap-1">
              Manage Budgets <ChevronRight className="w-3.5 h-3.5" />
            </NavLink>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {categories.slice(0, 4).map((cat) => (
              <div key={cat.id} className="p-3 rounded-xl bg-navy-900/40 border border-slate-800/60 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-200">{cat.category}</span>
                  <span className={cat.percentageUsed >= 100 ? 'text-rose-400' : 'text-slate-400'}>
                    {cat.percentageUsed}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      cat.percentageUsed >= 100 ? 'bg-rose-500' : cat.percentageUsed >= 80 ? 'bg-amber-500' : 'bg-brand-500'
                    }`}
                    style={{ width: `${Math.min(100, cat.percentageUsed)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

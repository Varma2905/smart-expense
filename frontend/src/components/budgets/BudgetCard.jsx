import React from 'react';
import { Edit2, Trash2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const BudgetCard = ({ budget, currency = 'INR', onEdit, onDelete }) => {
  const { category, spent, remaining, percentageUsed, status, budget: limit } = budget;

  let statusBadge = (
    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
      <CheckCircle2 className="w-3 h-3" /> Under Budget
    </span>
  );

  if (status === 'over_budget') {
    statusBadge = (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse">
        <AlertTriangle className="w-3 h-3" /> Over Budget
      </span>
    );
  } else if (status === 'near_limit') {
    statusBadge = (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
        <AlertTriangle className="w-3 h-3" /> Near Limit
      </span>
    );
  }

  const progressBarColor =
    percentageUsed > 100 ? 'bg-rose-500' : percentageUsed >= 80 ? 'bg-amber-500' : 'bg-emerald-500';

  return (
    <div className="glass-card p-6 rounded-2xl border border-slate-800/80 space-y-4 hover:border-slate-700 transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h4 className="text-base font-bold text-white">{category}</h4>
        </div>
        <div className="flex items-center gap-2">
          {statusBadge}
          {onEdit && (
            <button onClick={() => onEdit(budget)} className="p-1 rounded-lg text-slate-400 hover:text-white">
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button onClick={() => onDelete(budget)} className="p-1 rounded-lg text-slate-400 hover:text-rose-400">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-slate-300">
            Spent: <span className="text-white">{formatCurrency(spent, currency)}</span>
          </span>
          <span className="text-slate-400">
            Limit: <span className="text-white">{formatCurrency(limit, currency)}</span>
          </span>
        </div>

        <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
          <div
            className={`h-full rounded-full transition-all duration-500 ${progressBarColor}`}
            style={{ width: `${Math.min(100, percentageUsed)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
          <span>{percentageUsed}% Used</span>
          <span>Remaining: {formatCurrency(remaining, currency)}</span>
        </div>
      </div>
    </div>
  );
};

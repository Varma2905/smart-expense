import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const StatCard = ({
  title,
  amount,
  change = 0,
  currency = 'INR',
  icon: Icon,
  color = 'indigo',
  subtitle = 'vs last month',
}) => {
  const isPositive = change >= 0;

  const colorVariants = {
    indigo: 'from-brand-500/20 to-brand-600/5 text-brand-400 border-brand-500/30',
    emerald: 'from-emerald-500/20 to-emerald-600/5 text-emerald-400 border-emerald-500/30',
    rose: 'from-rose-500/20 to-rose-600/5 text-rose-400 border-rose-500/30',
    purple: 'from-purple-500/20 to-purple-600/5 text-purple-400 border-purple-500/30',
    amber: 'from-amber-500/20 to-amber-600/5 text-amber-400 border-amber-500/30',
  };

  const badgeClass = isPositive
    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    : 'bg-rose-500/10 text-rose-400 border-rose-500/20';

  return (
    <div className="glass-card relative overflow-hidden p-6 rounded-2xl border transition-all duration-300 hover:translate-y-[-2px] hover:shadow-xl group">
      {/* Background Subtle Gradient Glow */}
      <div
        className={`absolute -right-10 -bottom-10 w-32 h-32 rounded-full bg-gradient-to-br ${
          colorVariants[color] || colorVariants.indigo
        } opacity-20 blur-2xl group-hover:opacity-30 transition-opacity`}
      />

      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-slate-400">{title}</span>
        {Icon && (
          <div className={`p-3 rounded-xl border bg-navy-900/60 ${colorVariants[color] || colorVariants.indigo}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-3xl font-extrabold text-white tracking-tight">
          {formatCurrency(amount, currency)}
        </h3>

        <div className="flex items-center gap-2 pt-1">
          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${badgeClass}`}>
            {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {Math.abs(change)}%
          </span>
          <span className="text-xs text-slate-400">{subtitle}</span>
        </div>
      </div>
    </div>
  );
};

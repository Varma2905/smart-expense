import React from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowUpRight, ArrowDownLeft, ChevronRight, CreditCard, ShoppingBag, Utensils, Zap, Bus, Stethoscope, GraduationCap, Plane, Tv, Briefcase } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

const getCategoryIcon = (category) => {
  switch (category) {
    case 'Food': return Utensils;
    case 'Shopping': return ShoppingBag;
    case 'Bills': return Zap;
    case 'Transport': return Bus;
    case 'Healthcare': return Stethoscope;
    case 'Education': return GraduationCap;
    case 'Travel': return Plane;
    case 'Subscriptions': return Tv;
    case 'Salary':
    case 'Freelance': return Briefcase;
    default: return CreditCard;
  }
};

export const RecentTransactions = ({ transactions = [], currency = 'INR' }) => {
  return (
    <div className="glass-card p-6 rounded-2xl border border-slate-800/80 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">Recent Transactions</h3>
          <p className="text-xs text-slate-400">Latest financial activities</p>
        </div>

        <NavLink
          to="/transactions"
          className="text-xs font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1 group transition-colors"
        >
          View all transactions
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </NavLink>
      </div>

      {transactions.length === 0 ? (
        <div className="py-12 text-center text-sm text-slate-400">No recent transactions recorded</div>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx) => {
            const Icon = getCategoryIcon(tx.category);
            const isIncome = tx.type === 'income';

            return (
              <div
                key={tx._id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-navy-900/50 border border-slate-800/60 hover:bg-slate-800/40 transition-all duration-200"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`p-2.5 rounded-xl border shrink-0 ${
                      isIncome
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{tx.description}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700/60 text-[10px] font-medium">
                        {tx.category}
                      </span>
                      <span>•</span>
                      <span>{formatDate(tx.date)}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p
                    className={`text-sm font-bold flex items-center justify-end gap-1 ${
                      isIncome ? 'text-emerald-400' : 'text-slate-100'
                    }`}
                  >
                    {isIncome ? (
                      <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <ArrowDownLeft className="w-3.5 h-3.5 text-rose-400" />
                    )}
                    {isIncome ? '+' : '-'}{formatCurrency(tx.amount, currency)}
                  </p>
                  <span className="text-[10px] text-slate-400 font-medium">{tx.paymentMethod || 'UPI'}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

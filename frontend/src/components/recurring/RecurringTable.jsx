import React from 'react';
import { Edit2, Trash2, Calendar, Repeat, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const RecurringTable = ({
  recurringList = [],
  onToggleActive,
  onEdit,
  onDelete,
  currency = 'INR',
}) => {
  return (
    <div className="glass-card rounded-2xl border border-slate-800/80 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-navy-900/80 border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Recurring Item</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Frequency</th>
              <th className="px-6 py-4">Next Due Date</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/60">
            {recurringList.map((item) => {
              const isIncome = item.type === 'income';
              return (
                <tr key={item._id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2.5 rounded-xl border shrink-0 ${
                          isIncome
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                        }`}
                      >
                        <Repeat className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-white">{item.name}</p>
                        <p className="text-xs text-slate-400 capitalize">{item.type}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700/60 text-xs font-semibold text-slate-300">
                      {item.category}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-lg bg-brand-500/10 border border-brand-500/20 text-xs font-bold text-brand-300 capitalize">
                      {item.frequency}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-xs font-medium text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {formatDate(item.nextDate)}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className={`font-extrabold ${isIncome ? 'text-emerald-400' : 'text-slate-100'}`}>
                      {isIncome ? '+' : '-'}{formatCurrency(item.amount, currency)}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => onToggleActive(item)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                        item.active
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                          : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {item.active ? 'Active' : 'Paused'}
                    </button>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => onEdit(item)} className="p-1.5 rounded-lg text-slate-400 hover:text-white">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => onDelete(item)} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

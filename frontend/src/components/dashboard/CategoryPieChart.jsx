import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { formatCurrency } from '../../utils/formatters';
import { CATEGORY_COLORS } from '../../constants/constants';

export const CategoryPieChart = ({ data = [], currency = 'INR' }) => {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="glass-card p-3 rounded-xl border border-slate-700/80 shadow-xl text-xs space-y-1">
          <p className="font-bold text-white flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: CATEGORY_COLORS[item.category] || '#64748b' }}
            />
            {item.category}
          </p>
          <p className="text-slate-300">
            Amount: <span className="font-bold text-white">{formatCurrency(item.amount, currency)}</span>
          </p>
          <p className="text-slate-400">
            Share: <span className="font-semibold text-brand-400">{item.percentage}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card p-6 rounded-2xl border border-slate-800/80 space-y-4">
      <div>
        <h3 className="text-lg font-bold text-white">Expense Categories</h3>
        <p className="text-xs text-slate-400">Category spending breakdown</p>
      </div>

      {data.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-sm text-slate-400">
          No category data available
        </div>
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={4}
                dataKey="amount"
                nameKey="category"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CATEGORY_COLORS[entry.category] || '#64748b'}
                    stroke="rgba(15, 23, 42, 0.8)"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Category Legends */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/60 max-h-28 overflow-y-auto">
        {data.slice(0, 6).map((cat) => (
          <div key={cat.category} className="flex items-center justify-between text-xs p-1.5 rounded-lg hover:bg-slate-800/40">
            <div className="flex items-center gap-2 truncate">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: CATEGORY_COLORS[cat.category] || '#64748b' }}
              />
              <span className="text-slate-300 font-medium truncate">{cat.category}</span>
            </div>
            <span className="text-slate-400 font-semibold">{cat.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

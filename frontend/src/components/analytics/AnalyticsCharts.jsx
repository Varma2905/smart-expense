import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import { formatCurrency } from '../../utils/formatters';
import { CATEGORY_COLORS } from '../../constants/constants';

export const AnalyticsCharts = ({ trendsData = [], categoriesData = [], currency = 'INR' }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Chart 1: Income vs Expense Comparison Bar Chart */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800/80 space-y-4">
        <div>
          <h3 className="text-base font-bold text-white">Income vs Expense Comparison</h3>
          <p className="text-xs text-slate-400">Cashflow breakdown across time</p>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trendsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="date" stroke="#64748b" fontSize={10} />
              <YAxis stroke="#64748b" fontSize={10} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(val) => formatCurrency(val, currency)}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
              />
              <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} name="Income" />
              <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Top Expense Categories Horizontal Bar Chart */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800/80 space-y-4">
        <div>
          <h3 className="text-base font-bold text-white">Top Expense Categories</h3>
          <p className="text-xs text-slate-400">Category spending comparison</p>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={categoriesData.slice(0, 7)}
              margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
              <XAxis type="number" stroke="#64748b" fontSize={10} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <YAxis dataKey="category" type="category" stroke="#64748b" fontSize={11} width={80} />
              <Tooltip
                formatter={(val) => formatCurrency(val, currency)}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
              />
              <Bar dataKey="amount" radius={[0, 6, 6, 0]}>
                {categoriesData.slice(0, 7).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.category] || '#6366f1'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

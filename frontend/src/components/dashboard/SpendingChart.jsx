import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const SpendingChart = ({ data = [], currency = 'INR', onTimeframeChange }) => {
  const [timeframe, setTimeframe] = useState('30d');

  const timeframes = [
    { label: '7D', value: '7d' },
    { label: '30D', value: '30d' },
    { label: '3M', value: '3m' },
    { label: '6M', value: '6m' },
    { label: '1Y', value: '1y' },
  ];

  const handleSelect = (tf) => {
    setTimeframe(tf);
    if (onTimeframeChange) onTimeframeChange(tf);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-4 rounded-xl border border-slate-700/80 shadow-2xl text-xs space-y-2">
          <p className="font-bold text-slate-300 border-b border-slate-800 pb-1">{formatDate(label)}</p>
          <p className="text-emerald-400 font-semibold flex items-center justify-between gap-4">
            <span>Income:</span>
            <span>{formatCurrency(payload[0]?.value || 0, currency)}</span>
          </p>
          <p className="text-rose-400 font-semibold flex items-center justify-between gap-4">
            <span>Expenses:</span>
            <span>{formatCurrency(payload[1]?.value || 0, currency)}</span>
          </p>
          <p className="text-purple-400 font-semibold flex items-center justify-between gap-4 pt-1 border-t border-slate-800">
            <span>Savings:</span>
            <span>{formatCurrency((payload[0]?.value || 0) - (payload[1]?.value || 0), currency)}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card p-6 rounded-2xl border border-slate-800/80 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white">Spending & Income Trends</h3>
          <p className="text-xs text-slate-400">Cashflow overview across selected period</p>
        </div>

        {/* Timeframe Selector Pills */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-navy-900 border border-slate-800">
          {timeframes.map((tf) => (
            <button
              key={tf.value}
              onClick={() => handleSelect(tf.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                timeframe === tf.value
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />

            <XAxis
              dataKey="date"
              tickFormatter={(str) => {
                const date = new Date(str);
                return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`;
              }}
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
            />

            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v)}
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="income"
              stroke="#10b981"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#incomeGradient)"
            />

            <Area
              type="monotone"
              dataKey="expenses"
              stroke="#ef4444"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#expenseGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

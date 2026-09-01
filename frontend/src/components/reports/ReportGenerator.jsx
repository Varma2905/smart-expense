import React from 'react';
import { Download, FileText, Filter, Calendar } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../../constants/constants';

export const ReportGenerator = ({
  filters,
  onFilterChange,
  reportData,
  onExportCSV,
  onExportPDF,
  loading = false,
}) => {
  const allCategories = Array.from(new Set([...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES]));

  return (
    <div className="space-y-6">
      {/* Filters & Actions Bar */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800/80 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white">Generate Custom Report</h3>
            <p className="text-xs text-slate-400">Select criteria and export clean CSV or PDF reports</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onExportCSV}
              disabled={!reportData || loading}
              className="px-4 py-2.5 rounded-xl border border-slate-700 bg-navy-900/80 hover:bg-slate-800 text-slate-200 text-xs font-bold transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              Export CSV
            </button>
            <button
              onClick={onExportPDF}
              disabled={!reportData || loading}
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-600/30 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <FileText className="w-4 h-4" />
              Export PDF Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-800">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Start Date</label>
            <input
              type="date"
              value={filters.startDate || ''}
              onChange={(e) => onFilterChange('startDate', e.target.value)}
              className="w-full px-3 py-2 rounded-xl glass-input text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">End Date</label>
            <input
              type="date"
              value={filters.endDate || ''}
              onChange={(e) => onFilterChange('endDate', e.target.value)}
              className="w-full px-3 py-2 rounded-xl glass-input text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Category Filter</label>
            <select
              value={filters.category || ''}
              onChange={(e) => onFilterChange('category', e.target.value)}
              className="w-full px-3 py-2 rounded-xl glass-input text-xs font-medium bg-navy-900"
            >
              <option value="">All Categories</option>
              {allCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Transaction Type</label>
            <select
              value={filters.type || ''}
              onChange={(e) => onFilterChange('type', e.target.value)}
              className="w-full px-3 py-2 rounded-xl glass-input text-xs font-medium bg-navy-900"
            >
              <option value="">All Types</option>
              <option value="expense">Expenses Only</option>
              <option value="income">Income Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Report Live Preview Summary Card */}
      {reportData && (
        <div className="glass-card p-6 rounded-2xl border border-slate-800/80 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-bold text-brand-400 uppercase tracking-widest">Financial Summary</span>
              <h3 className="text-xl font-extrabold text-white mt-1">
                Statement for {reportData.user?.name}
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold">
              {reportData.transactionCount} Transactions Logged
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 space-y-1">
              <span className="text-xs font-semibold">Total Income</span>
              <p className="text-xl font-bold">{formatCurrency(reportData.kpi?.income, reportData.user?.currency)}</p>
            </div>
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 space-y-1">
              <span className="text-xs font-semibold">Total Expenses</span>
              <p className="text-xl font-bold">{formatCurrency(reportData.kpi?.expenses, reportData.user?.currency)}</p>
            </div>
            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 space-y-1">
              <span className="text-xs font-semibold">Net Savings</span>
              <p className="text-xl font-bold">{formatCurrency(reportData.kpi?.savings, reportData.user?.currency)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

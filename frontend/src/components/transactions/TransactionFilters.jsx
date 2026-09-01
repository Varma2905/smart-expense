import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES, PAYMENT_METHODS } from '../../constants/constants';

export const TransactionFilters = ({ filters, onFilterChange, onReset }) => {
  const allCategories = Array.from(new Set([...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES]));

  return (
    <div className="glass-card p-4 rounded-2xl border border-slate-800/80 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Search */}
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search description or category..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs font-medium"
          />
        </div>

        {/* Type Filter */}
        <div>
          <select
            value={filters.type || ''}
            onChange={(e) => onFilterChange('type', e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl glass-input text-xs font-medium bg-navy-900"
          >
            <option value="">All Types</option>
            <option value="expense">Expenses</option>
            <option value="income">Income</option>
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <select
            value={filters.category || ''}
            onChange={(e) => onFilterChange('category', e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl glass-input text-xs font-medium bg-navy-900"
          >
            <option value="">All Categories</option>
            {allCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Payment Method Filter */}
        <div>
          <select
            value={filters.paymentMethod || ''}
            onChange={(e) => onFilterChange('paymentMethod', e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl glass-input text-xs font-medium bg-navy-900"
          >
            <option value="">All Payment Methods</option>
            {PAYMENT_METHODS.map((pm) => (
              <option key={pm} value={pm}>
                {pm}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1 text-xs">
        <span className="text-slate-400 font-medium">Filter transactions by criteria</span>
        <button
          onClick={onReset}
          className="text-slate-400 hover:text-white flex items-center gap-1.5 font-semibold transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Filters
        </button>
      </div>
    </div>
  );
};

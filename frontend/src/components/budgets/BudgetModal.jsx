import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { EXPENSE_CATEGORIES } from '../../constants/constants';

export const BudgetModal = ({ isOpen, onClose, onSubmit, initialData = null, loading = false }) => {
  const now = new Date();
  const [formData, setFormData] = useState({
    category: 'overall',
    amount: '',
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        category: initialData.category || 'overall',
        amount: initialData.budget || initialData.amount || '',
        month: initialData.month || now.getMonth() + 1,
        year: initialData.year || now.getFullYear(),
      });
    } else {
      setFormData({
        category: 'overall',
        amount: '',
        month: now.getMonth() + 1,
        year: now.getFullYear(),
      });
    }
    setError('');
  }, [initialData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || Number(formData.amount) <= 0) {
      setError('Please enter a valid positive budget amount');
      return;
    }
    onSubmit({
      ...formData,
      amount: Number(formData.amount),
      month: Number(formData.month),
      year: Number(formData.year),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Update Budget Limit' : 'Set Monthly Budget'}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Category *</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl glass-input text-sm font-medium bg-navy-900"
          >
            <option value="overall">Overall Monthly Budget</option>
            {EXPENSE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat} Category
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Budget Limit Amount *</label>
          <input
            type="number"
            step="1"
            placeholder="e.g. 10000"
            value={formData.amount}
            onChange={(e) => {
              setFormData({ ...formData, amount: e.target.value });
              setError('');
            }}
            className="w-full px-4 py-2.5 rounded-xl glass-input text-sm font-semibold"
          />
          {error && <p className="text-xs text-rose-400 mt-1 font-medium">{error}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Month</label>
            <select
              value={formData.month}
              onChange={(e) => setFormData({ ...formData, month: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl glass-input text-sm font-medium bg-navy-900"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  {new Date(0, m - 1).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Year</label>
            <select
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl glass-input text-sm font-medium bg-navy-900"
            >
              {[2024, 2025, 2026, 2027].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold shadow-lg shadow-brand-600/30"
          >
            {loading ? 'Saving...' : 'Set Budget'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

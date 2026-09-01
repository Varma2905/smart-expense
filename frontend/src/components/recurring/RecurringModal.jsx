import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES, RECURRING_FREQUENCIES } from '../../constants/constants';

export const RecurringModal = ({ isOpen, onClose, onSubmit, initialData = null, loading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    type: 'expense',
    category: 'Bills',
    frequency: 'monthly',
    startDate: new Date().toISOString().split('T')[0],
    active: true,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        amount: initialData.amount || '',
        type: initialData.type || 'expense',
        category: initialData.category || 'Bills',
        frequency: initialData.frequency || 'monthly',
        startDate: initialData.startDate
          ? new Date(initialData.startDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        active: initialData.active !== undefined ? initialData.active : true,
      });
    } else {
      setFormData({
        name: '',
        amount: '',
        type: 'expense',
        category: 'Bills',
        frequency: 'monthly',
        startDate: new Date().toISOString().split('T')[0],
        active: true,
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleTypeToggle = (type) => {
    const defaultCat = type === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0];
    setFormData((prev) => ({ ...prev, type, category: defaultCat }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Name is required';
    if (!formData.amount || Number(formData.amount) <= 0) errs.amount = 'Amount must be greater than 0';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      ...formData,
      amount: Number(formData.amount),
    });
  };

  const categories = formData.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Recurring Transaction' : 'Add Recurring Transaction'}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type Toggle */}
        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-xl bg-navy-900 border border-slate-800">
          <button
            type="button"
            onClick={() => handleTypeToggle('expense')}
            className={`py-2 rounded-lg text-sm font-semibold transition-all ${
              formData.type === 'expense' ? 'bg-rose-600 text-white' : 'text-slate-400'
            }`}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => handleTypeToggle('income')}
            className={`py-2 rounded-lg text-sm font-semibold transition-all ${
              formData.type === 'income' ? 'bg-emerald-600 text-white' : 'text-slate-400'
            }`}
          >
            Income
          </button>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Item Name *</label>
          <input
            type="text"
            name="name"
            placeholder="e.g. Netflix Subscription, Apartment Rent"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
          />
          {errors.name && <p className="text-xs text-rose-400 mt-1">{errors.name}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Amount *</label>
            <input
              type="number"
              name="amount"
              step="0.01"
              placeholder="0.00"
              value={formData.amount}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl glass-input text-sm font-semibold"
            />
            {errors.amount && <p className="text-xs text-rose-400 mt-1">{errors.amount}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl glass-input text-sm font-medium bg-navy-900"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Frequency</label>
            <select
              name="frequency"
              value={formData.frequency}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl glass-input text-sm font-medium bg-navy-900"
            >
              {RECURRING_FREQUENCIES.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
            />
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
            {loading ? 'Saving...' : 'Save Recurring Item'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

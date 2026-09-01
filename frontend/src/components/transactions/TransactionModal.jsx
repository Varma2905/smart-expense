import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES, PAYMENT_METHODS } from '../../constants/constants';

export const TransactionModal = ({ isOpen, onClose, onSubmit, initialData = null, loading = false }) => {
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: 'Food',
    description: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'UPI',
    notes: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        type: initialData.type || 'expense',
        amount: initialData.amount || '',
        category: initialData.category || 'Food',
        description: initialData.description || '',
        date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        paymentMethod: initialData.paymentMethod || 'UPI',
        notes: initialData.notes || '',
      });
    } else {
      setFormData({
        type: 'expense',
        amount: '',
        category: 'Food',
        description: '',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'UPI',
        notes: '',
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
    if (!formData.amount || Number(formData.amount) <= 0) {
      errs.amount = 'Amount must be greater than 0';
    }
    if (!formData.description.trim()) {
      errs.description = 'Description is required';
    }
    if (!formData.category) {
      errs.category = 'Category is required';
    }
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
      title={initialData ? 'Edit Transaction' : 'Add New Transaction'}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Income / Expense Type Toggle */}
        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-xl bg-navy-900 border border-slate-800">
          <button
            type="button"
            onClick={() => handleTypeToggle('expense')}
            className={`py-2 rounded-lg text-sm font-semibold transition-all ${
              formData.type === 'expense'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => handleTypeToggle('income')}
            className={`py-2 rounded-lg text-sm font-semibold transition-all ${
              formData.type === 'income'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Income
          </button>
        </div>

        {/* Amount & Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            {errors.amount && <p className="text-xs text-rose-400 mt-1 font-medium">{errors.amount}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Date *</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
            />
          </div>
        </div>

        {/* Category & Payment Method */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl glass-input text-sm font-medium bg-navy-900"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-navy-900 text-white">
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-xs text-rose-400 mt-1 font-medium">{errors.category}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Payment Method</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl glass-input text-sm font-medium bg-navy-900"
            >
              {PAYMENT_METHODS.map((method) => (
                <option key={method} value={method} className="bg-navy-900 text-white">
                  {method}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Description *</label>
          <input
            type="text"
            name="description"
            placeholder="e.g. Grocery shopping at Supermarket"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
          />
          {errors.description && <p className="text-xs text-rose-400 mt-1 font-medium">{errors.description}</p>}
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Notes (Optional)</label>
          <textarea
            name="notes"
            rows="2"
            placeholder="Additional details..."
            value={formData.notes}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl glass-input text-sm resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold shadow-lg shadow-brand-600/30 transition-all flex items-center gap-2"
          >
            {loading ? 'Saving...' : initialData ? 'Update Transaction' : 'Save Transaction'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

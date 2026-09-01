import React, { useState, useEffect, useCallback } from 'react';
import { Plus, PiggyBank } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { BudgetCard } from '../components/budgets/BudgetCard';
import { BudgetModal } from '../components/budgets/BudgetModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { EmptyState } from '../components/common/EmptyState';
import { CardSkeleton } from '../components/common/LoadingSkeleton';
import { budgetService } from '../services/budgetService';
import { formatCurrency } from '../utils/formatters';

export const Budgets = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const [budgetOverview, setBudgetOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const [deleteBudgetDoc, setDeleteBudgetDoc] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchBudgets = useCallback(async () => {
    try {
      setLoading(true);
      const res = await budgetService.getBudgets(month, year);
      if (res.success && res.data) {
        setBudgetOverview(res.data);
      }
    } catch (err) {
      showToast(err.message || 'Failed to load budgets', 'error');
    } finally {
      setLoading(false);
    }
  }, [month, year, showToast]);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const handleOpenAddModal = () => {
    setSelectedBudget(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (b) => {
    setSelectedBudget(b);
    setIsModalOpen(true);
  };

  const handleSubmitModal = async (formData) => {
    try {
      setModalLoading(true);
      await budgetService.createOrUpdateBudget(formData);
      showToast('Budget saved successfully', 'success');
      setIsModalOpen(false);
      fetchBudgets();
    } catch (err) {
      showToast(err.message || 'Failed to save budget', 'error');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteBudgetDoc) return;
    try {
      setDeleteLoading(true);
      await budgetService.deleteBudget(deleteBudgetDoc.id);
      showToast('Budget removed', 'success');
      setDeleteBudgetDoc(null);
      fetchBudgets();
    } catch (err) {
      showToast(err.message || 'Delete failed', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const currency = user?.currency || 'INR';

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Budget Planning</h2>
          <p className="text-xs text-slate-400">Set spending limits and prevent overspending</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="px-3 py-2.5 rounded-xl glass-input text-xs font-medium bg-navy-900"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {new Date(0, m - 1).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>

          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="px-3 py-2.5 rounded-xl glass-input text-xs font-medium bg-navy-900"
          >
            {[2024, 2025, 2026, 2027].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          <button
            onClick={handleOpenAddModal}
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-600/30 transition-all flex items-center gap-2"
          >
            <Plus className="w-4.5 h-4.5" />
            Set Budget Limit
          </button>
        </div>
      </div>

      {/* Main Overall Month Progress Banner */}
      {loading ? (
        <CardSkeleton />
      ) : budgetOverview?.overall ? (
        <div className="glass-card p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3.5 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <PiggyBank className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Overall Month Cap</span>
                <h3 className="text-2xl font-extrabold text-white">
                  {formatCurrency(budgetOverview.overall.spent, currency)} /{' '}
                  <span className="text-slate-400">{formatCurrency(budgetOverview.overall.budget, currency)}</span>
                </h3>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-semibold text-slate-400">Remaining Buffer</span>
              <p className="text-xl font-bold text-emerald-400">
                {formatCurrency(budgetOverview.overall.remaining, currency)}
              </p>
            </div>
          </div>

          <div className="w-full h-3.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                budgetOverview.overall.percentageUsed > 100
                  ? 'bg-rose-500'
                  : budgetOverview.overall.percentageUsed >= 80
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, budgetOverview.overall.percentageUsed)}%` }}
            />
          </div>
        </div>
      ) : null}

      {/* Category Budgets Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : budgetOverview?.categories?.length === 0 ? (
        <EmptyState
          title="No Category Budgets Configured"
          description="Create specific category spending caps to receive warnings before you overspend."
          actionLabel="+ Set Category Budget"
          onAction={handleOpenAddModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgetOverview?.categories?.map((b) => (
            <BudgetCard
              key={b.id}
              budget={b}
              currency={currency}
              onEdit={handleOpenEditModal}
              onDelete={(item) => setDeleteBudgetDoc(item)}
            />
          ))}
        </div>
      )}

      {/* Create / Edit Budget Modal */}
      <BudgetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitModal}
        initialData={selectedBudget}
        loading={modalLoading}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteBudgetDoc}
        onClose={() => setDeleteBudgetDoc(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Budget Limit"
        message={`Are you sure you want to remove the budget cap for "${deleteBudgetDoc?.category}"?`}
        loading={deleteLoading}
      />
    </div>
  );
};

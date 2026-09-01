import React, { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { RecurringTable } from '../components/recurring/RecurringTable';
import { RecurringModal } from '../components/recurring/RecurringModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { EmptyState } from '../components/common/EmptyState';
import { TableSkeleton } from '../components/common/LoadingSkeleton';
import { recurringService } from '../services/recurringService';

export const Recurring = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [recurringList, setRecurringList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const [deleteItem, setDeleteItem] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchRecurring = useCallback(async () => {
    try {
      setLoading(true);
      const res = await recurringService.getRecurring();
      if (res.success && res.data) {
        setRecurringList(res.data);
      }
    } catch (err) {
      showToast(err.message || 'Failed to fetch recurring transactions', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchRecurring();
  }, [fetchRecurring]);

  const handleToggleActive = async (item) => {
    try {
      await recurringService.updateRecurring(item._id, { active: !item.active });
      showToast(`Recurring item ${!item.active ? 'activated' : 'paused'}`, 'info');
      fetchRecurring();
    } catch (err) {
      showToast(err.message || 'Toggle failed', 'error');
    }
  };

  const handleOpenAddModal = () => {
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleSubmitModal = async (formData) => {
    try {
      setModalLoading(true);
      if (selectedItem) {
        await recurringService.updateRecurring(selectedItem._id, formData);
        showToast('Recurring transaction updated', 'success');
      } else {
        await recurringService.createRecurring(formData);
        showToast('Recurring transaction created', 'success');
      }
      setIsModalOpen(false);
      fetchRecurring();
    } catch (err) {
      showToast(err.message || 'Failed to save recurring item', 'error');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteItem) return;
    try {
      setDeleteLoading(true);
      await recurringService.deleteRecurring(deleteItem._id);
      showToast('Recurring transaction removed', 'success');
      setDeleteItem(null);
      fetchRecurring();
    } catch (err) {
      showToast(err.message || 'Delete failed', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const currency = user?.currency || 'INR';

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Recurring Transactions</h2>
          <p className="text-xs text-slate-400">Automate trackings for subscriptions, salaries, rent, and utility bills</p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-600/30 transition-all flex items-center gap-2"
        >
          <Plus className="w-4.5 h-4.5" />
          Add Recurring Item
        </button>
      </div>

      {loading ? (
        <TableSkeleton rows={5} />
      ) : recurringList.length === 0 ? (
        <EmptyState
          title="No Recurring Transactions"
          description="Schedule automated entries for monthly rent, salary, subscriptions, or utility payments."
          actionLabel="+ Add Recurring Item"
          onAction={handleOpenAddModal}
        />
      ) : (
        <RecurringTable
          recurringList={recurringList}
          onToggleActive={handleToggleActive}
          onEdit={handleOpenEditModal}
          onDelete={(item) => setDeleteItem(item)}
          currency={currency}
        />
      )}

      {/* Modal */}
      <RecurringModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitModal}
        initialData={selectedItem}
        loading={modalLoading}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Recurring Item"
        message={`Are you sure you want to remove "${deleteItem?.name}"?`}
        loading={deleteLoading}
      />
    </div>
  );
};

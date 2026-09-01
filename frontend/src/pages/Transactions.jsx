import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { TransactionFilters } from '../components/transactions/TransactionFilters';
import { TransactionTable } from '../components/transactions/TransactionTable';
import { TransactionModal } from '../components/transactions/TransactionModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { EmptyState } from '../components/common/EmptyState';
import { TableSkeleton } from '../components/common/LoadingSkeleton';
import { transactionService } from '../services/transactionService';
import { exportToCSV } from '../utils/exportUtils';

export const Transactions = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: '',
    type: '',
    category: '',
    paymentMethod: '',
    page: 1,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const [deleteTx, setDeleteTx] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await transactionService.getTransactions(filters);
      if (res.success && res.data) {
        setTransactions(res.data.transactions);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      showToast(err.message || 'Failed to fetch transactions', 'error');
    } finally {
      setLoading(false);
    }
  }, [filters, showToast]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleResetFilters = () => {
    setFilters({ search: '', type: '', category: '', paymentMethod: '', page: 1 });
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handleOpenAddModal = () => {
    setSelectedTx(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (tx) => {
    setSelectedTx(tx);
    setIsModalOpen(true);
  };

  const handleSubmitModal = async (formData) => {
    try {
      setModalLoading(true);
      if (selectedTx) {
        await transactionService.updateTransaction(selectedTx._id, formData);
        showToast('Transaction updated successfully', 'success');
      } else {
        await transactionService.createTransaction(formData);
        showToast('Transaction added successfully', 'success');
      }
      setIsModalOpen(false);
      fetchTransactions();
    } catch (err) {
      showToast(err.message || 'Operation failed', 'error');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTx) return;
    try {
      setDeleteLoading(true);
      await transactionService.deleteTransaction(deleteTx._id);
      showToast('Transaction deleted', 'success');
      setDeleteTx(null);
      fetchTransactions();
    } catch (err) {
      showToast(err.message || 'Delete failed', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleExport = () => {
    if (!transactions.length) return;
    const exportRows = transactions.map((t) => ({
      ID: t._id,
      Description: t.description,
      Type: t.type,
      Category: t.category,
      Amount: t.amount,
      Date: t.date,
      PaymentMethod: t.paymentMethod || 'UPI',
      Notes: t.notes || '',
    }));
    exportToCSV(`SmartExpense_Transactions_${new Date().toISOString().split('T')[0]}`, exportRows);
    showToast('Exported CSV file!', 'success');
  };

  const currency = user?.currency || 'INR';

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Transactions</h2>
          <p className="text-xs text-slate-400">View, search, filter, and manage all records</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            disabled={!transactions.length}
            className="px-4 py-2.5 rounded-xl border border-slate-700 glass-card text-slate-200 hover:bg-slate-800 text-xs font-bold transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            Export CSV
          </button>

          <button
            onClick={handleOpenAddModal}
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-600/30 transition-all flex items-center gap-2"
          >
            <Plus className="w-4.5 h-4.5" />
            Add Transaction
          </button>
        </div>
      </div>

      {/* Filter Component */}
      <TransactionFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Transactions List */}
      {loading ? (
        <TableSkeleton rows={8} />
      ) : transactions.length === 0 ? (
        <EmptyState
          title="No transactions found"
          description="No transactions match your search filters or date selection."
          actionLabel="+ Add Transaction"
          onAction={handleOpenAddModal}
        />
      ) : (
        <TransactionTable
          transactions={transactions}
          pagination={pagination}
          onPageChange={handlePageChange}
          onEdit={handleOpenEditModal}
          onDelete={(tx) => setDeleteTx(tx)}
          currency={currency}
        />
      )}

      {/* Add / Edit Transaction Drawer Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitModal}
        initialData={selectedTx}
        loading={modalLoading}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={!!deleteTx}
        onClose={() => setDeleteTx(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Transaction"
        message={`Are you sure you want to delete "${deleteTx?.description}"? This action cannot be undone.`}
        loading={deleteLoading}
      />
    </div>
  );
};

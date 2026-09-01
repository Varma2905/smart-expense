import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { KPISection } from '../components/dashboard/KPISection';
import { SpendingChart } from '../components/dashboard/SpendingChart';
import { CategoryPieChart } from '../components/dashboard/CategoryPieChart';
import { RecentTransactions } from '../components/dashboard/RecentTransactions';
import { BudgetOverviewCard } from '../components/dashboard/BudgetOverviewCard';
import { TransactionModal } from '../components/transactions/TransactionModal';
import { CardSkeleton, ChartSkeleton, TableSkeleton } from '../components/common/LoadingSkeleton';
import API from '../services/api';
import { transactionService } from '../services/transactionService';

export const Dashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [summaryData, setSummaryData] = useState(null);
  const [trendsData, setTrendsData] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const fetchDashboardData = useCallback(async (timeframe = '30d') => {
    try {
      setLoading(true);
      const [summaryRes, trendsRes, categoriesRes] = await Promise.all([
        API.get('/dashboard/summary'),
        API.get(`/dashboard/trends?timeframe=${timeframe}`),
        API.get('/dashboard/categories'),
      ]);

      if (summaryRes.success) setSummaryData(summaryRes.data);
      if (trendsRes.success) setTrendsData(trendsRes.data);
      if (categoriesRes.success) setCategoriesData(categoriesRes.data);
    } catch (err) {
      console.error('[Dashboard Error]', err);
      showToast(err.message || 'Failed to load dashboard statistics', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchDashboardData('30d');
  }, [fetchDashboardData]);

  const handleTimeframeChange = async (tf) => {
    try {
      const res = await API.get(`/dashboard/trends?timeframe=${tf}`);
      if (res.success) setTrendsData(res.data);
    } catch (err) {
      showToast('Could not update trend timeframe', 'error');
    }
  };

  const handleCreateTransaction = async (formData) => {
    try {
      setModalLoading(true);
      const res = await transactionService.createTransaction(formData);
      if (res.success) {
        showToast('Transaction added successfully!', 'success');
        setIsAddModalOpen(false);
        fetchDashboardData('30d');
      }
    } catch (err) {
      showToast(err.message || 'Failed to create transaction', 'error');
    } finally {
      setModalLoading(false);
    }
  };

  const currency = user?.currency || 'INR';

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top Banner Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Financial Overview</h2>
          <p className="text-xs text-slate-400">Real-time statistics and budget progress</p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/ai-insights"
            className="px-4 py-2.5 rounded-xl glass-card hover:bg-slate-800/80 border border-indigo-500/30 text-indigo-300 text-xs font-bold transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            AI Insights
          </a>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-600/30 transition-all flex items-center gap-2"
          >
            <Plus className="w-4.5 h-4.5" />
            Add Transaction
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : (
        <KPISection kpi={summaryData?.kpi} currency={currency} />
      )}

      {/* Main Charts & Overview Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {loading ? (
            <ChartSkeleton />
          ) : (
            <SpendingChart
              data={trendsData}
              currency={currency}
              onTimeframeChange={handleTimeframeChange}
            />
          )}
        </div>

        <div>
          {loading ? <ChartSkeleton /> : <CategoryPieChart data={categoriesData} currency={currency} />}
        </div>
      </div>

      {/* Recent Transactions & Budget Overview Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          <>
            <TableSkeleton rows={4} />
            <ChartSkeleton />
          </>
        ) : (
          <>
            <RecentTransactions
              transactions={summaryData?.recentTransactions || []}
              currency={currency}
            />
            <BudgetOverviewCard budget={summaryData?.budget} currency={currency} />
          </>
        )}
      </div>

      {/* Add Transaction Drawer Modal */}
      <TransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateTransaction}
        loading={modalLoading}
      />
    </div>
  );
};

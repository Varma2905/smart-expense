import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { StatsGrid } from '../components/analytics/StatsGrid';
import { AnalyticsCharts } from '../components/analytics/AnalyticsCharts';
import { CardSkeleton, ChartSkeleton } from '../components/common/LoadingSkeleton';
import { analyticsService } from '../services/analyticsService';

export const Analytics = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [timeframe, setTimeframe] = useState('30d');
  const [stats, setStats] = useState(null);
  const [trendsData, setTrendsData] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const [overviewRes, trendsRes, categoriesRes] = await Promise.all([
        analyticsService.getOverview(),
        analyticsService.getTrends({ timeframe }),
        analyticsService.getCategories(),
      ]);

      if (overviewRes.success) setStats(overviewRes.data);
      if (trendsRes.success) setTrendsData(trendsRes.data);
      if (categoriesRes.success) setCategoriesData(categoriesRes.data);
    } catch (err) {
      showToast(err.message || 'Failed to fetch analytics', 'error');
    } finally {
      setLoading(false);
    }
  }, [timeframe, showToast]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const timeframes = [
    { label: '7 Days', value: '7d' },
    { label: '30 Days', value: '30d' },
    { label: '3 Months', value: '3m' },
    { label: '6 Months', value: '6m' },
    { label: '1 Year', value: '1y' },
  ];

  const currency = user?.currency || 'INR';

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Financial Analytics</h2>
          <p className="text-xs text-slate-400">Deep aggregated metrics and comparative chart analysis</p>
        </div>

        <div className="flex items-center gap-1 p-1 rounded-xl bg-navy-900 border border-slate-800">
          {timeframes.map((tf) => (
            <button
              key={tf.value}
              onClick={() => setTimeframe(tf.value)}
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

      {/* Aggregated Stats Metrics */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : (
        <StatsGrid stats={stats} currency={currency} />
      )}

      {/* Multi-Chart Section */}
      {loading ? (
        <ChartSkeleton />
      ) : (
        <AnalyticsCharts
          trendsData={trendsData}
          categoriesData={categoriesData}
          currency={currency}
        />
      )}
    </div>
  );
};

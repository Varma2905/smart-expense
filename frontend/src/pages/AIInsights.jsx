import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '../context/ToastContext';
import { AIInsightCard } from '../components/ai/AIInsightCard';
import { CardSkeleton } from '../components/common/LoadingSkeleton';
import { aiService } from '../services/aiService';

export const AIInsights = () => {
  const { showToast } = useToast();

  const [insightData, setInsightData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAIInsights = useCallback(async (query = null) => {
    try {
      setLoading(true);
      const res = await aiService.getInsights(query);
      if (res.success && res.data) {
        setInsightData(res.data);
      }
    } catch (err) {
      showToast(err.message || 'Failed to fetch AI insights', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchAIInsights();
  }, [fetchAIInsights]);

  const handleAskAI = (query) => {
    fetchAIInsights(query);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">AI Financial Insights</h2>
        <p className="text-xs text-slate-400">
          Smart AI advisor offering practical explanations and advice from your calculated financial metrics
        </p>
      </div>

      {loading && !insightData ? (
        <CardSkeleton />
      ) : (
        <AIInsightCard
          insightData={insightData}
          onAskAI={handleAskAI}
          loading={loading}
        />
      )}
    </div>
  );
};

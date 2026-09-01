import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '../context/ToastContext';
import { ReportGenerator } from '../components/reports/ReportGenerator';
import { CardSkeleton } from '../components/common/LoadingSkeleton';
import { reportService } from '../services/reportService';
import { exportToCSV, exportToPDF } from '../utils/exportUtils';

export const Reports = () => {
  const { showToast } = useToast();

  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    category: '',
    type: '',
  });

  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReport = useCallback(async () => {
    try {
      setLoading(true);
      const res = await reportService.getReportSummary(filters);
      if (res.success && res.data) {
        setReportData(res.data);
      }
    } catch (err) {
      showToast(err.message || 'Failed to fetch report summary', 'error');
    } finally {
      setLoading(false);
    }
  }, [filters, showToast]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleExportCSV = () => {
    if (!reportData || !reportData.transactions) return;
    const rows = reportData.transactions.map((t) => ({
      Date: t.date,
      Description: t.description,
      Category: t.category,
      Type: t.type,
      PaymentMethod: t.paymentMethod || 'UPI',
      Amount: t.amount,
    }));
    exportToCSV(`SmartExpense_Report_${new Date().toISOString().split('T')[0]}`, rows);
    showToast('Exported CSV report!', 'success');
  };

  const handleExportPDF = () => {
    if (!reportData) return;
    exportToPDF(reportData);
    showToast('Exported PDF report!', 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">Financial Reports</h2>
        <p className="text-xs text-slate-400">Generate, view, and export formatted statements in PDF or CSV format</p>
      </div>

      {loading ? (
        <CardSkeleton />
      ) : (
        <ReportGenerator
          filters={filters}
          onFilterChange={handleFilterChange}
          reportData={reportData}
          onExportCSV={handleExportCSV}
          onExportPDF={handleExportPDF}
          loading={loading}
        />
      )}
    </div>
  );
};

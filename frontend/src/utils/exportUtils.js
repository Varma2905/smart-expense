import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { formatCurrency, formatDate } from './formatters';

export const exportToCSV = (filename, rows) => {
  if (!rows || !rows.length) return;
  const separator = ',';
  const keys = Object.keys(rows[0]);
  const csvContent =
    keys.join(separator) +
    '\n' +
    rows
      .map((row) => {
        return keys
          .map((k) => {
            let cell = row[k] === null || row[k] === undefined ? '' : row[k];
            cell = cell instanceof Date ? cell.toISOString() : cell.toString();
            cell = cell.replace(/"/g, '""');
            if (cell.search(/("|,|\n)/g) >= 0) {
              cell = `"${cell}"`;
            }
            return cell;
          })
          .join(separator);
      })
      .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const exportToPDF = (reportData) => {
  const doc = new jsPDF();
  const { user, kpi, categoryBreakdown, transactions, period } = reportData;
  const currency = user?.currency || 'INR';

  // Title & Header
  doc.setFontSize(22);
  doc.setTextColor(79, 70, 229); // Brand color
  doc.text('SmartExpense Financial Report', 14, 20);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated for: ${user?.name || 'User'} (${user?.email})`, 14, 28);
  doc.text(`Report Period: ${formatDate(period?.start)} to ${formatDate(period?.end)}`, 14, 34);

  // Financial KPI Summary Box
  doc.setDrawColor(220);
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(14, 40, 182, 26, 3, 3, 'FD');

  doc.setFontSize(11);
  doc.setTextColor(50);
  doc.text(`Total Income: ${formatCurrency(kpi?.income || 0, currency)}`, 20, 50);
  doc.text(`Total Expenses: ${formatCurrency(kpi?.expenses || 0, currency)}`, 75, 50);
  doc.text(`Net Savings: ${formatCurrency(kpi?.savings || 0, currency)}`, 140, 50);

  doc.text(`Savings Rate: ${kpi?.savingsRate || 0}%`, 20, 60);

  // Category Breakdown Table
  doc.setFontSize(14);
  doc.setTextColor(30);
  doc.text('Expense Category Breakdown', 14, 76);

  const catRows = (categoryBreakdown || []).map((cat) => [
    cat.category,
    `${cat.percentage}%`,
    formatCurrency(cat.amount, currency),
  ]);

  doc.autoTable({
    startY: 80,
    head: [['Category', 'Percentage', 'Total Amount']],
    body: catRows,
    theme: 'striped',
    headStyles: { fillColor: [79, 70, 229] },
  });

  // Recent Transactions Table
  const finalY = doc.lastAutoTable.finalY || 130;
  doc.setFontSize(14);
  doc.setTextColor(30);
  doc.text('Transactions Log', 14, finalY + 14);

  const txRows = (transactions || []).slice(0, 30).map((tx) => [
    formatDate(tx.date),
    tx.description,
    tx.category,
    tx.type.toUpperCase(),
    tx.paymentMethod || 'UPI',
    formatCurrency(tx.amount, currency),
  ]);

  doc.autoTable({
    startY: finalY + 18,
    head: [['Date', 'Description', 'Category', 'Type', 'Method', 'Amount']],
    body: txRows,
    theme: 'grid',
    headStyles: { fillColor: [30, 41, 59] },
  });

  doc.save(`SmartExpense_Report_${formatDate(new Date())}.pdf`);
};

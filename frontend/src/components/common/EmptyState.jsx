import React from 'react';
import { FolderOpen } from 'lucide-react';

export const EmptyState = ({
  title = 'No records found',
  description = 'Start tracking your spending by adding your first record.',
  actionLabel,
  onAction,
  icon: Icon = FolderOpen,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center glass-card rounded-2xl border border-dashed border-slate-800 my-4">
      <div className="p-4 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400 mb-4">
        <Icon className="w-8 h-8" />
      </div>

      <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
      <p className="text-sm text-slate-400 max-w-sm mb-6 leading-relaxed">{description}</p>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-medium text-sm transition-all shadow-lg shadow-brand-600/25 flex items-center gap-2"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

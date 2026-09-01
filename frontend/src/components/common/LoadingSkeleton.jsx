import React from 'react';

export const CardSkeleton = () => (
  <div className="glass-card p-6 rounded-2xl border border-slate-800 animate-skeleton">
    <div className="flex items-center justify-between mb-4">
      <div className="h-4 w-28 bg-slate-800 rounded-md" />
      <div className="h-10 w-10 bg-slate-800 rounded-xl" />
    </div>
    <div className="h-8 w-40 bg-slate-800 rounded-md mb-3" />
    <div className="h-4 w-24 bg-slate-800 rounded-md" />
  </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4 animate-skeleton">
    <div className="h-6 w-48 bg-slate-800 rounded-md mb-6" />
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-center justify-between py-3 border-b border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-slate-800" />
          <div className="space-y-2">
            <div className="h-4 w-36 bg-slate-800 rounded-md" />
            <div className="h-3 w-24 bg-slate-800 rounded-md" />
          </div>
        </div>
        <div className="h-5 w-24 bg-slate-800 rounded-md" />
      </div>
    ))}
  </div>
);

export const ChartSkeleton = () => (
  <div className="glass-card p-6 rounded-2xl border border-slate-800 animate-skeleton h-80 flex flex-col justify-between">
    <div className="flex items-center justify-between">
      <div className="h-5 w-40 bg-slate-800 rounded-md" />
      <div className="h-8 w-32 bg-slate-800 rounded-lg" />
    </div>
    <div className="h-48 w-full bg-slate-800/50 rounded-xl" />
  </div>
);

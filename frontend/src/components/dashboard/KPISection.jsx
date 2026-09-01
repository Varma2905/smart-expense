import React from 'react';
import { Wallet, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';
import { StatCard } from '../common/StatCard';

export const KPISection = ({ kpi, currency = 'INR' }) => {
  if (!kpi) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Balance"
        amount={kpi.balance}
        change={kpi.changes?.balance || 0}
        currency={currency}
        icon={Wallet}
        color="indigo"
      />

      <StatCard
        title="Total Income"
        amount={kpi.income}
        change={kpi.changes?.income || 0}
        currency={currency}
        icon={TrendingUp}
        color="emerald"
      />

      <StatCard
        title="Total Expenses"
        amount={kpi.expenses}
        change={kpi.changes?.expenses || 0}
        currency={currency}
        icon={TrendingDown}
        color="rose"
      />

      <StatCard
        title="Net Savings"
        amount={kpi.savings}
        change={kpi.changes?.savings || 0}
        currency={currency}
        icon={PiggyBank}
        color="purple"
        subtitle={`Savings Rate: ${kpi.savingsRate || 0}%`}
      />
    </div>
  );
};


'use client';

import * as React from 'react';
import StatCard from '@/components/dashboard/stat-card';
import { DollarSign, TrendingUp, TrendingDown, Users } from 'lucide-react';
import type { FinancialSummary } from '@/app/financeiro/actions';

interface FinanceiroStatCardsProps {
  summary: FinancialSummary;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export default function FinanceiroStatCards({ summary }: FinanceiroStatCardsProps) {
  const pendingAmount = summary.transactions
    .filter(t => t.status === 'pendente' || t.status === 'vencido')
    .reduce((acc, t) => acc + (t.amount || 0), 0);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <StatCard 
        title="Receita do Mês"
        value={formatCurrency(summary.totalRevenue)}
        change=""
        changeType="increase"
        period=""
        icon={DollarSign}
        iconBgColor="bg-green-100"
        iconColor="text-green-600"
      />
      <StatCard 
        title="Despesas do Mês"
        value={formatCurrency(summary.totalExpenses)}
        change=""
        changeType="increase"
        period=""
        icon={TrendingDown}
        iconBgColor="bg-red-100"
        iconColor="text-red-600"
      />
      <StatCard 
        title="Lucro Líquido"
        value={formatCurrency(summary.netFlow)}
        change=""
        changeType="increase"
        period=""
        icon={TrendingUp}
        iconBgColor="bg-blue-100"
        iconColor="text-blue-600"
      />
      <StatCard 
        title="Inadimplência"
        value={formatCurrency(pendingAmount)}
        change=""
        changeType="decrease"
        period=""
        icon={Users}
        iconBgColor="bg-yellow-100"
        iconColor="text-yellow-600"
      />
    </div>
  );
}

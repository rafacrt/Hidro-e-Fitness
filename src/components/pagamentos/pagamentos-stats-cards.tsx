
'use client';

import StatCard from '@/components/dashboard/stat-card';
import { CheckCircle2, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import type { PaymentStats } from '@/app/pagamentos/actions';

interface PagamentosStatsCardsProps {
  stats: PaymentStats;
}

export default function PagamentosStatsCards({ stats }: PagamentosStatsCardsProps) {
  const approvalRate = stats.totalCount > 0 ? (stats.approvedVolume / stats.totalVolume) * 100 : 0;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <StatCard 
        title="Pagamentos Processados"
        value={stats.totalCount.toString()}
        change=""
        changeType="increase"
        period="no período"
        icon={CheckCircle2}
        iconBgColor="bg-green-100"
        iconColor="text-green-600"
      />
      <StatCard 
        title="Taxa de Aprovação"
        value={`${approvalRate.toFixed(1)}%`}
        change=""
        changeType="increase"
        period="dos pagamentos"
        icon={TrendingUp}
        iconBgColor="bg-blue-100"
        iconColor="text-blue-600"
      />
       <StatCard 
        title="Cobranças Pendentes"
        value={stats.pendingVolume.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        change=""
        changeType="increase"
        period=""
        icon={Clock}
        iconBgColor="bg-yellow-100"
        iconColor="text-yellow-600"
      />
      <StatCard 
        title="Vencidos"
        value={stats.overdueVolume.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        change=""
        changeType="increase"
        period=""
        icon={AlertCircle}
        iconBgColor="bg-red-100"
        iconColor="text-red-600"
      />
    </div>
  );
}

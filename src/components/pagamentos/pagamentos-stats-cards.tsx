import StatCard from '@/components/dashboard/stat-card';
import { CheckCircle2, TrendingUp, Clock, AlertCircle } from 'lucide-react';

export default function PagamentosStatsCards() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <StatCard 
        title="Pagamentos Processados"
        value="342"
        change="+18 vs mês anterior"
        changeType="increase"
        period=""
        icon={CheckCircle2}
        iconBgColor="bg-green-100"
        iconColor="text-green-600"
      />
      <StatCard 
        title="Taxa de Aprovação"
        value="96.8%"
        change="+2.1% vs mês anterior"
        changeType="increase"
        period=""
        icon={TrendingUp}
        iconBgColor="bg-blue-100"
        iconColor="text-blue-600"
      />
      <StatCard 
        title="Tempo Médio"
        value="28s"
        change="-5s vs mês anterior"
        changeType="decrease"
        period=""
        icon={Clock}
        iconBgColor="bg-yellow-100"
        iconColor="text-yellow-600"
      />
      <StatCard 
        title="Cobranças Pendentes"
        value="23"
        change="+8 vs mês anterior"
        changeType="increase"
        period=""
        icon={AlertCircle}
        iconBgColor="bg-red-100"
        iconColor="text-red-600"
      />
    </div>
  );
}

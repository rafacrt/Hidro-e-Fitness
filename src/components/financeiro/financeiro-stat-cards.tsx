
import StatCard from '@/components/dashboard/stat-card';
import { DollarSign, TrendingUp, TrendingDown, Users } from 'lucide-react';

export default function FinanceiroStatCards() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <StatCard 
        title="Receita do Mês"
        value="R$ 42.500"
        change="+8% vs mês anterior"
        changeType="increase"
        period=""
        icon={DollarSign}
        iconBgColor="bg-green-100"
        iconColor="text-green-600"
      />
      <StatCard 
        title="Despesas do Mês"
        value="R$ 18.200"
        change="+5% vs mês anterior"
        changeType="increase"
        period=""
        icon={TrendingDown}
        iconBgColor="bg-red-100"
        iconColor="text-red-600"
      />
      <StatCard 
        title="Lucro Líquido"
        value="R$ 24.300"
        change="+12% vs mês anterior"
        changeType="increase"
        period=""
        icon={TrendingUp}
        iconBgColor="bg-blue-100"
        iconColor="text-blue-600"
      />
      <StatCard 
        title="Inadimplência"
        value="R$ 1.850"
        change="-3% vs mês anterior"
        changeType="decrease"
        period=""
        icon={Users}
        iconBgColor="bg-yellow-100"
        iconColor="text-yellow-600"
      />
    </div>
  );
}

import StatCard from '@/components/dashboard/stat-card';
import { Wrench, AlertTriangle, CalendarCheck, TrendingUp } from 'lucide-react';

export default function ManutencaoStats() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <StatCard 
        title="Equipamentos Ativos"
        value="24"
        change="+2 vs mês anterior"
        changeType="increase"
        period=""
        icon={Wrench}
        iconBgColor="bg-blue-100"
        iconColor="text-blue-600"
      />
      <StatCard 
        title="Manutenções Pendentes"
        value="3"
        change="-2 vs mês anterior"
        changeType="decrease"
        period=""
        icon={AlertTriangle}
        iconBgColor="bg-yellow-100"
        iconColor="text-yellow-600"
      />
      <StatCard 
        title="Manutenções Este Mês"
        value="12"
        change="+4 vs mês anterior"
        changeType="increase"
        period=""
        icon={CalendarCheck}
        iconBgColor="bg-green-100"
        iconColor="text-green-600"
      />
      <StatCard 
        title="Custo Mensal"
        value="R$ 2.850"
        change="-15% vs mês anterior"
        changeType="decrease"
        period=""
        icon={TrendingUp}
        iconBgColor="bg-red-100"
        iconColor="text-red-600"
      />
    </div>
  );
}

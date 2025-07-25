import StatCard from '@/components/dashboard/stat-card';
import { Dumbbell, Users, DollarSign } from 'lucide-react';

export default function ModalitiesStatCards() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <StatCard 
        title="Total de Modalidades"
        value="7"
        change="+2 vs mês anterior"
        changeType="increase"
        period=""
        icon={Dumbbell}
        iconBgColor="bg-cyan-100"
        iconColor="text-cyan-600"
      />
      <StatCard 
        title="Alunos Ativos"
        value="342"
        change="+12 vs mês anterior"
        changeType="increase"
        period=""
        icon={Users}
        iconBgColor="bg-blue-100"
        iconColor="text-blue-600"
      />
      <StatCard 
        title="Receita Mensal"
        value="R$ 58.500"
        change="+8% vs mês anterior"
        changeType="increase"
        period=""
        icon={DollarSign}
        iconBgColor="bg-yellow-100"
        iconColor="text-yellow-600"
      />
    </div>
  );
}

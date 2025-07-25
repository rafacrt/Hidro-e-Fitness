import StatCard from '@/components/dashboard/stat-card';
import { Users, Calendar, Percent, TrendingUp } from 'lucide-react';

export default function TurmasStatCards() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <StatCard 
        title="Turmas Ativas"
        value="24"
        change="+2 vs semana anterior"
        changeType="increase"
        period=""
        icon={Calendar}
        iconBgColor="bg-cyan-100"
        iconColor="text-cyan-600"
      />
      <StatCard 
        title="Alunos Matriculados"
        value="342"
        change="+12 vs semana anterior"
        changeType="increase"
        period=""
        icon={Users}
        iconBgColor="bg-blue-100"
        iconColor="text-blue-600"
      />
      <StatCard 
        title="Taxa de Ocupação"
        value="87%"
        change="+3% vs semana anterior"
        changeType="increase"
        period=""
        icon={Percent}
        iconBgColor="bg-green-100"
        iconColor="text-green-600"
      />
      <StatCard 
        title="Aulas Hoje"
        value="16"
        change="+8 vs semana anterior"
        changeType="increase"
        period=""
        icon={TrendingUp}
        iconBgColor="bg-yellow-100"
        iconColor="text-yellow-600"
      />
    </div>
  );
}

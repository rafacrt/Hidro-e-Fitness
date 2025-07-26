import StatCard from '@/components/dashboard/stat-card';
import { Percent, Users, XCircle, Activity } from 'lucide-react';

export default function FrequenciaStatsCards() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <StatCard 
        title="Taxa de Presença Geral"
        value="87.5%"
        change="+2.3% Média dos últimos 30 dias"
        changeType="increase"
        period=""
        icon={Percent}
        iconBgColor="bg-green-100"
        iconColor="text-green-600"
      />
      <StatCard 
        title="Alunos Presentes Hoje"
        value="156"
        change="+12 De 178 alunos programados"
        changeType="increase"
        period=""
        icon={Users}
        iconBgColor="bg-blue-100"
        iconColor="text-blue-600"
      />
      <StatCard 
        title="Faltas Não Justificadas"
        value="18"
        change="-5 Redução de 22% vs ontem"
        changeType="decrease"
        period=""
        icon={XCircle}
        iconBgColor="bg-red-100"
        iconColor="text-red-600"
      />
      <StatCard 
        title="Aulas Realizadas"
        value="24"
        change="0 De 24 aulas programadas"
        changeType="increase"
        period=""
        icon={Activity}
        iconBgColor="bg-yellow-100"
        iconColor="text-yellow-600"
      />
    </div>
  );
}


'use client';

import StatCard from '@/components/dashboard/stat-card';
import { Percent, Users, XCircle, Activity } from 'lucide-react';
import type { AttendanceStats } from '@/app/frequencia/actions';

interface FrequenciaStatsCardsProps {
  stats: AttendanceStats;
}

export default function FrequenciaStatsCards({ stats }: FrequenciaStatsCardsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <StatCard 
        title="Taxa de Presença Geral"
        value={`${stats.generalRate.toFixed(1)}%`}
        change="Média dos últimos 30 dias"
        changeType="increase"
        period=""
        icon={Percent}
        iconBgColor="bg-green-100"
        iconColor="text-green-600"
      />
      <StatCard 
        title="Alunos Presentes Hoje"
        value={stats.presentToday.toString()}
        change={`De ${stats.totalScheduledToday} alunos programados`}
        changeType="increase"
        period=""
        icon={Users}
        iconBgColor="bg-blue-100"
        iconColor="text-blue-600"
      />
      <StatCard 
        title="Faltas Não Justificadas"
        value={stats.absentToday.toString()}
        change="hoje"
        changeType="decrease"
        period=""
        icon={XCircle}
        iconBgColor="bg-red-100"
        iconColor="text-red-600"
      />
      <StatCard 
        title="Aulas Realizadas"
        value="0" // This would require more complex logic to determine completed classes
        change={`De ${stats.classesToday} aulas programadas`}
        changeType="increase"
        period=""
        icon={Activity}
        iconBgColor="bg-yellow-100"
        iconColor="text-yellow-600"
      />
    </div>
  );
}

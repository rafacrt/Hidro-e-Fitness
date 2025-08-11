
'use client';

import StatCard from '@/components/dashboard/stat-card';
import { Dumbbell, Users, DollarSign, Activity } from 'lucide-react';
import type { Database } from '@/lib/database.types';

type Modality = Database['public']['Tables']['modalities']['Row'];

interface ModalitiesStatCardsProps {
  modalities: Modality[];
}

export default function ModalitiesStatCards({ modalities }: ModalitiesStatCardsProps) {
  // NOTE: Total de Alunos e Receita Total são mockados por enquanto, pois exigem junções complexas.
  const totalModalities = modalities.length;
  const activeModalities = modalities.length; // Assuming all are active as there's no status field
  const totalStudents = 266; // Mock
  const totalRevenue = 46600; // Mock

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <StatCard 
        title="Total de Modalidades"
        value={totalModalities.toString()}
        change=""
        changeType="increase"
        period=""
        icon={Dumbbell}
        iconBgColor="bg-cyan-100"
        iconColor="text-cyan-600"
      />
      <StatCard 
        title="Modalidades Ativas"
        value={activeModalities.toString()}
        change=""
        changeType="increase"
        period=""
        icon={Activity}
        iconBgColor="bg-green-100"
        iconColor="text-green-600"
      />
      <StatCard 
        title="Total de Alunos"
        value={totalStudents.toString()}
        change="(mock)"
        changeType="increase"
        period=""
        icon={Users}
        iconBgColor="bg-orange-100"
        iconColor="text-orange-600"
      />
      <StatCard 
        title="Receita Total"
        value={totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        change="(mock)"
        changeType="increase"
        period=""
        icon={DollarSign}
        iconBgColor="bg-yellow-100"
        iconColor="text-yellow-600"
      />
    </div>
  );
}

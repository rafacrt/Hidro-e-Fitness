import StatCard from '@/components/dashboard/stat-card';
import { Dumbbell, Users, DollarSign, Activity } from 'lucide-react';

export default function ModalitiesStatCards() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <StatCard 
        title="Total de Modalidades"
        value="5"
        change=""
        changeType="increase"
        period=""
        icon={Dumbbell}
        iconBgColor="bg-cyan-100"
        iconColor="text-cyan-600"
      />
      <StatCard 
        title="Modalidades Ativas"
        value="4"
        change=""
        changeType="increase"
        period=""
        icon={Activity}
        iconBgColor="bg-green-100"
        iconColor="text-green-600"
      />
      <StatCard 
        title="Total de Alunos"
        value="266"
        change=""
        changeType="increase"
        period=""
        icon={Users}
        iconBgColor="bg-orange-100"
        iconColor="text-orange-600"
      />
      <StatCard 
        title="Receita Total"
        value="R$ 46.600"
        change=""
        changeType="increase"
        period=""
        icon={DollarSign}
        iconBgColor="bg-yellow-100"
        iconColor="text-yellow-600"
      />
    </div>
  );
}

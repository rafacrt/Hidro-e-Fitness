
import StatCard from '@/components/dashboard/stat-card';
import { Users, Calendar, Percent, TrendingUp } from 'lucide-react';
import type { Database } from '@/lib/database.types';

type ClassRow = Database['public']['Tables']['classes']['Row'];

interface TurmasStatCardsProps {
  classes: ClassRow[];
}

export default function TurmasStatCards({ classes }: TurmasStatCardsProps) {
  const activeClasses = classes.filter(c => c.status === 'ativa').length;
  // The following need real enrollment data to be calculated properly
  const enrolledStudents = 0; // Mock
  const totalCapacity = classes.reduce((sum, cls) => sum + (cls.max_students || 0), 0);
  const occupancyRate = totalCapacity > 0 ? (enrolledStudents / totalCapacity) * 100 : 0;
  const today = new Date().toLocaleString('pt-BR', { weekday: 'long' });
  const classesToday = classes.filter(cls => cls.days_of_week.some(day => day.toLowerCase() === today.toLowerCase())).length;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <StatCard 
        title="Turmas Ativas"
        value={activeClasses.toString()}
        change=""
        changeType="increase"
        period=""
        icon={Calendar}
        iconBgColor="bg-cyan-100"
        iconColor="text-cyan-600"
      />
      <StatCard 
        title="Alunos Matriculados"
        value={enrolledStudents.toString()}
        change="(mock)"
        changeType="increase"
        period=""
        icon={Users}
        iconBgColor="bg-blue-100"
        iconColor="text-blue-600"
      />
      <StatCard 
        title="Taxa de Ocupação"
        value={`${occupancyRate.toFixed(0)}%`}
        change="(mock)"
        changeType="increase"
        period=""
        icon={Percent}
        iconBgColor="bg-green-100"
        iconColor="text-green-600"
      />
      <StatCard 
        title="Aulas Hoje"
        value={classesToday.toString()}
        change=""
        changeType="increase"
        period=""
        icon={TrendingUp}
        iconBgColor="bg-yellow-100"
        iconColor="text-yellow-600"
      />
    </div>
  );
}

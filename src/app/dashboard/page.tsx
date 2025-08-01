
import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import StatCard from '@/components/dashboard/stat-card';
import UpcomingClasses from '@/components/dashboard/upcoming-classes';
import QuickActions from '@/components/dashboard/quick-actions';
import { Users, Calendar, DollarSign, Percent } from 'lucide-react';
import { getAcademySettings, getUserProfile } from '../configuracoes/actions';
import { getDashboardStats, getUpcomingClasses } from './actions';
import { unstable_noStore as noStore } from 'next/cache';

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
};

export default async function DashboardPage() {
  noStore();
  const [academySettings, userProfile, stats, upcomingClasses] = await Promise.all([
    getAcademySettings(),
    getUserProfile(),
    getDashboardStats(),
    getUpcomingClasses()
  ]);

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <Sidebar settings={academySettings} />
      <div className="flex flex-col w-0 flex-1">
        <Header settings={academySettings} userProfile={userProfile} />
        <main className="flex-1 p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">Visão geral do sistema {academySettings?.name || 'Hidro Fitness'}</p>
            </div>
            <div className="text-sm text-muted-foreground">
              {new Date().toLocaleString('pt-BR')}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard 
              title="Alunos Ativos"
              value={stats.activeStudents.toString()}
              change=""
              changeType="increase"
              period=""
              icon={Users}
              iconBgColor="bg-cyan-100"
              iconColor="text-cyan-600"
            />
            <StatCard 
              title="Turmas Hoje"
              value={stats.classesToday.toString()}
              change=""
              changeType="increase"
              period=""
              icon={Calendar}
              iconBgColor="bg-blue-100"
              iconColor="text-blue-600"
            />
            <StatCard 
              title="Receita Mensal"
              value={formatCurrency(stats.monthlyRevenue)}
              change=""
              changeType="increase"
              period="(mock)"
              icon={DollarSign}
              iconBgColor="bg-green-100"
              iconColor="text-green-600"
            />
            <StatCard 
              title="Taxa de Presença"
              value={`${stats.attendanceRate}%`}
              change=""
              changeType="increase"
              period="(mock)"
              icon={Percent}
              iconBgColor="bg-yellow-100"
              iconColor="text-yellow-600"
            />
          </div>

          <div className="grid grid-cols-1 gap-6">
            <UpcomingClasses classes={upcomingClasses} />
          </div>
          
          <QuickActions />

        </main>
      </div>
    </div>
  );
}

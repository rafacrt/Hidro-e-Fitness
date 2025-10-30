
import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import StatCard from '@/components/dashboard/stat-card';
import UpcomingClasses from '@/components/dashboard/upcoming-classes';
import ActiveStudents from '@/components/dashboard/active-students';
import QuickActions from '@/components/dashboard/quick-actions';
import { Users, Calendar, DollarSign, Percent } from 'lucide-react';
import { getAcademySettings, getUserProfile } from '../configuracoes/actions';
import { getDashboardStats, getUpcomingClasses, getActiveStudents } from './actions';
import { unstable_noStore as noStore } from 'next/cache';
import { NavContent } from '@/components/layout/nav-content';

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
};

export default async function DashboardPage() {
  noStore();
  const [academySettings, userProfile, stats, upcomingClasses, activeStudents] = await Promise.all([
    getAcademySettings(),
    getUserProfile(),
    getDashboardStats(),
    getUpcomingClasses(),
    getActiveStudents()
  ]);

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <Sidebar>
        <NavContent settings={academySettings} />
      </Sidebar>
      <div className="flex flex-col w-0 flex-1">
        <Header settings={academySettings} userProfile={userProfile} />
        <main className="flex-1 p-4 md:p-6 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
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
              period=""
              icon={DollarSign}
              iconBgColor="bg-green-100"
              iconColor="text-green-600"
            />
            <StatCard 
              title="Taxa de Presença"
              value={`${stats.attendanceRate.toFixed(1)}%`}
              change="este mês"
              changeType="increase"
              period=""
              icon={Percent}
              iconBgColor="bg-yellow-100"
              iconColor="text-yellow-600"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <UpcomingClasses classes={upcomingClasses} />
            <ActiveStudents students={activeStudents} />
          </div>

          <QuickActions />

        </main>
      </div>
    </div>
  );
}

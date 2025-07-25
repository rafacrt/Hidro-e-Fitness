import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import StatCard from '@/components/dashboard/stat-card';
import UpcomingClasses from '@/components/dashboard/upcoming-classes';
import RecentPayments from '@/components/dashboard/recent-payments';
import QuickActions from '@/components/dashboard/quick-actions';
import { Users, Calendar, DollarSign, Percent } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <Sidebar />
      <div className="flex flex-col w-0 flex-1">
        <Header />
        <main className="flex-1 p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">Visão geral do sistema Hidro Fitness</p>
            </div>
            <div className="text-sm text-muted-foreground">
              Última atualização: 25/07/2025, 20:40:45
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard 
              title="Alunos Ativos"
              value="342"
              change="+12%"
              changeType="increase"
              period="vs mês anterior"
              icon={Users}
              iconBgColor="bg-cyan-100"
              iconColor="text-cyan-600"
            />
            <StatCard 
              title="Turmas Hoje"
              value="18"
              change="+2%"
              changeType="increase"
              period="vs mês anterior"
              icon={Calendar}
              iconBgColor="bg-blue-100"
              iconColor="text-blue-600"
            />
            <StatCard 
              title="Receita Mensal"
              value="R$ 42.500"
              change="+8%"
              changeType="increase"
              period="vs mês anterior"
              icon={DollarSign}
              iconBgColor="bg-green-100"
              iconColor="text-green-600"
            />
            <StatCard 
              title="Taxa de Presença"
              value="87%"
              change="+3%"
              changeType="increase"
              period="vs mês anterior"
              icon={Percent}
              iconBgColor="bg-yellow-100"
              iconColor="text-yellow-600"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <UpcomingClasses />
            </div>
            <div>
              <RecentPayments />
            </div>
          </div>
          
          <QuickActions />

        </main>
      </div>
    </div>
  );
}

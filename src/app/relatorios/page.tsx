
'use client';

import * as React from 'react';
import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import { Button } from '@/components/ui/button';
import { Download, Filter } from 'lucide-react';
import RelatoriosFilters from '@/components/relatorios/relatorios-filters';
import RelatoriosStats from '@/components/relatorios/relatorios-stats';
import RelatoriosMaisUtilizados from '@/components/relatorios/relatorios-mais-utilizados';
import AtividadeRecente from '@/components/relatorios/atividade-recente';
import AcoesRapidasRelatorios from '@/components/relatorios/acoes-rapidas-relatorios';
import ResumoPerformance from '@/components/relatorios/resumo-performance';
import { getMostUsedReports, getRecentActivities, getReportStats } from './actions';
import { getAcademySettings, getUserProfile } from '../configuracoes/actions';
import type { Database } from '@/lib/database.types';
import PlaceholderContent from '@/components/relatorios/placeholder-content';
import FinanceiroReport from '@/components/relatorios/financeiro-report';
import AlunosReport from '@/components/relatorios/alunos-report';
import FrequenciaReport from '@/components/relatorios/frequencia-report';
import PerformanceReport from '@/components/relatorios/performance-report';
import PersonalizadosReport from '@/components/relatorios/personalizados-report';
import { NavContent } from '@/components/layout/nav-content';

type AcademySettings = Database['public']['Tables']['academy_settings']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];
type Report = Database['public']['Tables']['reports']['Row'];
type Activity = {
  title: string;
  author: string;
  time: string;
  icon: 'File' | 'Download' | 'BarChart2' | 'Eye';
};
type ReportStats = {
  generatedReports: number;
  totalRevenue: number;
  activeStudents: number;
  attendanceRate: number;
};
export type ActiveTab = "Visão Geral" | "Financeiro" | "Alunos" | "Frequência" | "Performance" | "Personalizados";


export default function RelatoriosPage() {
  const [activeTab, setActiveTab] = React.useState<ActiveTab>("Visão Geral");
  const [settings, setSettings] = React.useState<AcademySettings | null>(null);
  const [userProfile, setUserProfile] = React.useState<Profile | null>(null);
  const [stats, setStats] = React.useState<ReportStats | null>(null);
  const [mostUsedReports, setMostUsedReports] = React.useState<Report[]>([]);
  const [recentActivities, setRecentActivities] = React.useState<Activity[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [
        fetchedSettings,
        fetchedUserProfile,
        fetchedStats,
        fetchedMostUsed,
        fetchedActivities,
      ] = await Promise.all([
        getAcademySettings(),
        getUserProfile(),
        getReportStats(),
        getMostUsedReports(),
        getRecentActivities(),
      ]);
      setSettings(fetchedSettings);
      setUserProfile(fetchedUserProfile);
      setStats(fetchedStats);
      setMostUsedReports(fetchedMostUsed);
      setRecentActivities(fetchedActivities as Activity[]);
      setLoading(false);
    }
    loadData();
  }, []);

  const renderContent = () => {
    if (loading) {
      return <p>Carregando...</p>
    }

    if (!stats) {
        return <p>Não foi possível carregar os dados.</p>
    }

    switch (activeTab) {
        case 'Visão Geral':
            return (
                <div className="space-y-6">
                    <RelatoriosStats stats={stats} />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <RelatoriosMaisUtilizados reports={mostUsedReports} />
                        <AtividadeRecente activities={recentActivities} />
                    </div>
                    <AcoesRapidasRelatorios />
                    <ResumoPerformance />
                </div>
            );
        case 'Financeiro':
            return <FinanceiroReport />;
        case 'Alunos':
            return <AlunosReport />;
        case 'Frequência':
            return <FrequenciaReport />;
        case 'Performance':
            return <PerformanceReport />;
        case 'Personalizados':
            return <PersonalizadosReport />;
        default:
            return <PlaceholderContent title={activeTab} />;
    }
  }

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <Sidebar>
        <NavContent settings={settings} />
      </Sidebar>
      <div className="flex flex-col w-0 flex-1">
        <Header settings={settings} userProfile={userProfile} />
        <main className="flex-1 p-4 md:p-6 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold">Relatórios</h1>
              <p className="text-muted-foreground">Análises e relatórios completos da academia</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Button variant="outline" className="w-full">
                <Filter className="mr-2 h-4 w-4" />
                Filtros
              </Button>
              <Button className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
            </div>
          </div>
          
          <RelatoriosFilters activeTab={activeTab} setActiveTab={setActiveTab} />
          
          {renderContent()}

        </main>
      </div>
    </div>
  );
}

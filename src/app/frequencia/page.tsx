
'use client';

import * as React from 'react';
import { Suspense } from 'react';
import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import { Button } from '@/components/ui/button';
import { Download, PlusCircle } from 'lucide-react';
import FrequenciaFilters from '@/components/frequencia/frequencia-filters';
import FrequenciaStatsCards from '@/components/frequencia/frequencia-stats-cards';
import AcoesRapidasFrequencia from '@/components/frequencia/acoes-rapidas-frequencia';
import { getAcademySettings, getUserProfile } from '../configuracoes/actions';
import PlaceholderContent from '@/components/relatorios/placeholder-content';
import AulasDeHojeFrequencia from '@/components/frequencia/aulas-de-hoje-frequencia';
import AlunosBaixaFrequencia from '@/components/frequencia/alunos-baixa-frequencia';
import FrequenciaPorModalidade from '@/components/frequencia/frequencia-por-modalidade';
import { getUpcomingClasses } from '../dashboard/actions';
import ControlePresencaTab from '@/components/frequencia/controle-presenca-tab';
import { MarkAttendanceDialog } from '@/components/frequencia/mark-attendance-dialog';
import { getAttendanceStats, type AttendanceStats } from './actions';
import { NavContent } from '@/components/layout/nav-content';
import type { Database } from '@/lib/database.types';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

type AcademySettings = Database['public']['Tables']['academy_settings']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];
type ClassRow = Database['public']['Tables']['classes']['Row'];
type Instructor = Database['public']['Tables']['instructors']['Row'];
type UpcomingClass = ClassRow & { instructors: Pick<Instructor, 'name'> | null };


export type ActiveTabFrequencia = "Visão Geral" | "Controle de Presença" | "Histórico";

function FrequenciaContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = (searchParams?.get('tab') || "Visão Geral") as ActiveTabFrequencia;
  
  const [settings, setSettings] = React.useState<AcademySettings | null>(null);
  const [userProfile, setUserProfile] = React.useState<Profile | null>(null);
  const [upcomingClasses, setUpcomingClasses] = React.useState<UpcomingClass[]>([]);
  const [stats, setStats] = React.useState<AttendanceStats | null>(null);
  const [loading, setLoading] = React.useState(true);

  const loadData = React.useCallback(async () => {
    setLoading(true);
    try {
      const [settingsData, profileData, classesData, statsData] = await Promise.all([
        getAcademySettings(),
        getUserProfile(),
        getUpcomingClasses(),
        getAttendanceStats(),
      ]);
      setSettings(settingsData);
      setUserProfile(profileData);
      setUpcomingClasses(classesData);
      setStats(statsData);
    } catch (error) {
        console.error("Failed to load frequency data", error);
    } finally {
        setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);
  
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
              <h1 className="text-2xl font-bold">Frequência</h1>
              <p className="text-muted-foreground">Controle completo de presença e assiduidade</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Button variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
               <MarkAttendanceDialog classes={upcomingClasses} onSuccess={loadData}>
                <Button className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Marcar Presença
                </Button>
              </MarkAttendanceDialog>
            </div>
          </div>
          
          <FrequenciaFilters activeTab={activeTab} />

          {loading && (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}

          {!loading && stats && activeTab === 'Visão Geral' && (
            <div className="space-y-6">
              <FrequenciaStatsCards stats={stats} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AulasDeHojeFrequencia classes={upcomingClasses} />
                <FrequenciaPorModalidade />
              </div>
              <AlunosBaixaFrequencia />
              <AcoesRapidasFrequencia classes={upcomingClasses} onSuccess={loadData} />
            </div>
          )}

          {!loading && activeTab === 'Controle de Presença' && (
            <ControlePresencaTab classes={upcomingClasses} />
          )}

          {!loading && activeTab === 'Histórico' && (
            <PlaceholderContent title="Histórico de Frequência" />
          )}

        </main>
      </div>
    </div>
  );
}

export default function FrequenciaPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    }>
      <FrequenciaContent />
    </Suspense>
  );
}

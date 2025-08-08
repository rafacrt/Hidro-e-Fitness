
import { unstable_noStore as noStore } from 'next/cache';
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
import { getAttendanceStats } from './actions';

export type ActiveTabFrequencia = "Visão Geral" | "Controle de Presença" | "Histórico";

export default async function FrequenciaPage({
  searchParams,
}: {
  searchParams?: {
    tab?: string;
  };
}) {
  noStore();
  const activeTab = (searchParams?.tab || "Visão Geral") as ActiveTabFrequencia;
  
  const [settings, userProfile, upcomingClasses, stats] = await Promise.all([
    getAcademySettings(),
    getUserProfile(),
    getUpcomingClasses(),
    getAttendanceStats(),
  ]);
  
  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <Sidebar settings={settings} />
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
               <MarkAttendanceDialog classes={upcomingClasses}>
                <Button className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Marcar Presença
                </Button>
              </MarkAttendanceDialog>
            </div>
          </div>
          
          <FrequenciaFilters activeTab={activeTab} />

          {activeTab === 'Visão Geral' && (
            <div className="space-y-6">
              <FrequenciaStatsCards stats={stats} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AulasDeHojeFrequencia classes={upcomingClasses} />
                <FrequenciaPorModalidade />
              </div>
              <AlunosBaixaFrequencia />
              <AcoesRapidasFrequencia classes={upcomingClasses} />
            </div>
          )}

          {activeTab === 'Controle de Presença' && (
            <ControlePresencaTab classes={upcomingClasses} />
          )}

          {activeTab === 'Histórico' && (
            <PlaceholderContent title="Histórico de Frequência" />
          )}

        </main>
      </div>
    </div>
  );
}

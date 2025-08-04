
'use client';

import * as React from 'react';
import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import TurmasFilters from '@/components/turmas/turmas-filters';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search } from 'lucide-react';
import RelatoriosTurmasCards from '@/components/turmas/relatorios-turmas-cards';
import FiltrosRelatorioTurmas from '@/components/turmas/filtros-relatorio-turmas';
import { Card, CardContent } from '@/components/ui/card';
import OcupacaoModalidade from '@/components/turmas/ocupacao-modalidade';
import OcupacaoHorario from '@/components/turmas/ocupacao-horario';
import TurmasStatCards from '@/components/turmas/turmas-stat-cards';
import AulasDeHoje from '@/components/turmas/aulas-de-hoje';
import AcoesRapidasTurmas from '@/components/turmas/acoes-rapidas-turmas';
import ScheduleGrid from '@/components/turmas/schedule-grid';
import ManageClassesStatCards from '@/components/turmas/manage-classes-stat-cards';
import ManageClassesFilters from '@/components/turmas/manage-classes-filters';
import ManageClassesTable from '@/components/turmas/manage-classes-table';
import ManageClassesQuickActions from '@/components/turmas/manage-classes-quick-actions';
import AttendanceStatCards from '@/components/turmas/attendance-stat-cards';
import AttendanceFilters from '@/components/turmas/attendance-filters';
import AttendanceTable from '@/components/turmas/attendance-table';
import AttendanceBatchActions from '@/components/turmas/attendance-batch-actions';
import FrequenciaPorModalidadeReport from '@/components/turmas/frequencia-por-modalidade-report';
import TendenciaMensalReport from '@/components/turmas/tendencia-mensal-report';
import ReceitaPorModalidadePerformance from '@/components/turmas/receita-por-modalidade-performance';
import RentabilidadePerformance from '@/components/turmas/rentabilidade-performance';
import DistribuicaoPorDiaSemana from '@/components/turmas/distribuicao-por-dia-semana';
import DistribuicaoPorPeriodoDia from '@/components/turmas/distribuicao-por-periodo-dia';
import PlaceholderReport from '@/components/turmas/placeholder-report';
import { AddClassForm } from '@/components/turmas/add-class-form';
import { SearchClassDialog } from '@/components/turmas/search-class-dialog';
import { getClasses } from './actions';
import { unstable_noStore as noStore } from 'next/cache';
import type { Database } from '@/lib/database.types';
import { getAcademySettings } from '../configuracoes/actions';

type AcademySettings = Database['public']['Tables']['academy_settings']['Row'];
type Instructor = Database['public']['Tables']['instructors']['Row'];
type Modality = Database['public']['Tables']['modalities']['Row'];
type ClassRow = Database['public']['Tables']['classes']['Row'] & { instructors: Pick<Instructor, 'name'> | null } & { modalities: Pick<Modality, 'name'> | null };

type ActiveTab = "Visão Geral" | "Grade de Horários" | "Gerenciar Turmas" | "Controle de Presença" | "Relatórios";
type ActiveReport = 'ocupacao' | 'frequencia' | 'performance' | 'horarios' | null;

export default function TurmasPage() {
  noStore();
  const [activeTab, setActiveTab] = React.useState<ActiveTab>("Gerenciar Turmas");
  const [activeReport, setActiveReport] = React.useState<ActiveReport>(null);
  const [classes, setClasses] = React.useState<ClassRow[]>([]);
  const [settings, setSettings] = React.useState<AcademySettings | null>(null);

  React.useEffect(() => {
    async function loadData() {
      const [fetchedClasses, fetchedSettings] = await Promise.all([
        getClasses(),
        getAcademySettings()
      ]);
      setClasses(fetchedClasses);
      setSettings(fetchedSettings);
    }
    loadData();
  }, [activeTab]);


  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <Sidebar settings={settings} />
      <div className="flex flex-col w-0 flex-1">
        <Header settings={settings} />
        <main className="flex-1 p-4 md:p-6 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold">Turmas</h1>
              <p className="text-muted-foreground">Gestão completa de turmas e horários</p>
            </div>
            <div className='flex gap-2 w-full md:w-auto'>
                <SearchClassDialog>
                  <Button variant="outline" className="w-full">
                      <Search className="mr-2 h-4 w-4" />
                      Buscar
                  </Button>
                </SearchClassDialog>
                <AddClassForm>
                  <Button className="w-full">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Nova
                  </Button>
                </AddClassForm>
            </div>
          </div>
          
          <TurmasFilters activeTab={activeTab} setActiveTab={setActiveTab} />
          
          {activeTab === 'Visão Geral' && (
            <div className="space-y-6">
              <TurmasStatCards />
              <AulasDeHoje />
              <AcoesRapidasTurmas />
            </div>
          )}

          {activeTab === 'Grade de Horários' && (
            <ScheduleGrid />
          )}
          
          {activeTab === 'Gerenciar Turmas' && (
            <div className='space-y-6'>
              <ManageClassesStatCards />
              <ManageClassesFilters />
              <ManageClassesTable classes={classes} />
              <ManageClassesQuickActions />
            </div>
          )}

          {activeTab === 'Controle de Presença' && (
             <div className="space-y-6">
                <AttendanceStatCards />
                <AttendanceFilters />
                <AttendanceTable />
                <AttendanceBatchActions />
             </div>
          )}

          {activeTab === 'Relatórios' && (
            <div className="space-y-6">
              <RelatoriosTurmasCards activeCard={activeReport} setActiveCard={setActiveReport} />
              <FiltrosRelatorioTurmas />
              <Card>
                <CardContent className="p-6">
                  {activeReport === null && <PlaceholderReport />}
                  {activeReport && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {activeReport === 'ocupacao' && (
                        <>
                          <OcupacaoModalidade />
                          <OcupacaoHorario />
                        </>
                      )}
                      {activeReport === 'frequencia' && (
                        <>
                          <FrequenciaPorModalidadeReport />
                          <TendenciaMensalReport />
                        </>
                      )}
                      {activeReport === 'performance' && (
                        <>
                          <ReceitaPorModalidadePerformance />
                          <RentabilidadePerformance />
                        </>
                      )}
                      {activeReport === 'horarios' && (
                        <>
                          <DistribuicaoPorDiaSemana />
                          <DistribuicaoPorPeriodoDia />
                        </>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

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

type ActiveTab = "Visão Geral" | "Grade de Horários" | "Gerenciar Turmas" | "Controle de Presença" | "Relatórios";

export default function TurmasPage() {
  const [activeTab, setActiveTab] = React.useState<ActiveTab>("Gerenciar Turmas");

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <Sidebar />
      <div className="flex flex-col w-0 flex-1">
        <Header />
        <main className="flex-1 p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Turmas</h1>
              <p className="text-muted-foreground">Gestão completa de turmas e horários</p>
            </div>
            <div className='flex gap-2'>
                <Button variant="outline">
                    <Search className="mr-2 h-4 w-4" />
                    Buscar Turma
                </Button>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Nova Turma
                </Button>
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
              <ManageClassesTable />
              <ManageClassesQuickActions />
            </div>
          )}

          {activeTab === 'Relatórios' && (
            <div className="space-y-6">
              <RelatoriosTurmasCards />
              <FiltrosRelatorioTurmas />
              <Card>
                <CardContent className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <OcupacaoModalidade />
                  <OcupacaoHorario />
                </CardContent>
              </Card>
            </div>
          )}

          {(activeTab !== 'Visão Geral' && activeTab !== 'Relatórios' && activeTab !== 'Grade de Horários' && activeTab !== 'Gerenciar Turmas') && (
            <Card>
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-semibold">Em Desenvolvimento</h3>
                <p className="text-muted-foreground">A funcionalidade para "{activeTab}" está em desenvolvimento e será disponibilizada em breve.</p>
              </CardContent>
            </Card>
          )}

        </main>
      </div>
    </div>
  );
}

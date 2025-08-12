
'use client';

import * as React from 'react';
import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import TurmasFilters from '@/components/turmas/turmas-filters';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
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
import { AddClassForm } from '@/components/turmas/add-class-form';
import { getClasses } from './actions';
import type { Database } from '@/lib/database.types';
import { getAcademySettings, getUserProfile } from '../configuracoes/actions';
import { NavContent } from '@/components/layout/nav-content';

type AcademySettings = Database['public']['Tables']['academy_settings']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];
type Instructor = Database['public']['Tables']['instructors']['Row'];
type Modality = Database['public']['Tables']['modalities']['Row'];
type ClassRow = Database['public']['Tables']['classes']['Row'] & { instructors: Pick<Instructor, 'name'> | null } & { modalities: Pick<Modality, 'name'> | null };

type ActiveTab = "Visão Geral" | "Grade de Horários" | "Gerenciar Turmas" | "Controle de Presença";

export default function TurmasPage() {
  const [activeTab, setActiveTab] = React.useState<ActiveTab>("Visão Geral");
  const [classes, setClasses] = React.useState<ClassRow[]>([]);
  const [settings, setSettings] = React.useState<AcademySettings | null>(null);
  const [userProfile, setUserProfile] = React.useState<Profile | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [fetchedClasses, fetchedSettings, fetchedProfile] = await Promise.all([
        getClasses(),
        getAcademySettings(),
        getUserProfile(),
      ]);
      setClasses(fetchedClasses);
      setSettings(fetchedSettings);
      setUserProfile(fetchedProfile);
      setLoading(false);
    }
    loadData();
  }, []);


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
              <h1 className="text-2xl font-bold">Turmas</h1>
              <p className="text-muted-foreground">Gestão completa de turmas e horários</p>
            </div>
            <div className='flex gap-2 w-full md:w-auto'>
                <AddClassForm>
                  <Button className="w-full">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Nova
                  </Button>
                </AddClassForm>
            </div>
          </div>
          
          <TurmasFilters activeTab={activeTab} setActiveTab={setActiveTab} />
          
          {loading && <p>Carregando...</p>}

          {!loading && activeTab === 'Visão Geral' && (
            <div className="space-y-6">
              <TurmasStatCards classes={classes} />
              <AulasDeHoje classes={classes} />
              <AcoesRapidasTurmas />
            </div>
          )}

          {!loading && activeTab === 'Grade de Horários' && (
            <ScheduleGrid classes={classes} />
          )}
          
          {!loading && activeTab === 'Gerenciar Turmas' && (
            <div className='space-y-6'>
              <ManageClassesStatCards classes={classes} />
              <ManageClassesFilters />
              <ManageClassesTable classes={classes} />
              <ManageClassesQuickActions />
            </div>
          )}

          {!loading && activeTab === 'Controle de Presença' && (
             <div className="space-y-6">
                <AttendanceStatCards />
                <AttendanceFilters />
                <AttendanceTable />
                <AttendanceBatchActions />
             </div>
          )}

        </main>
      </div>
    </div>
  );
}

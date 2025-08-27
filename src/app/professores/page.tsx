'use client';

import * as React from 'react';
import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2 } from 'lucide-react';
import ProfessoresTable from '@/components/professores/professores-table';
import ProfessoresStats from '@/components/professores/professores-stats';
import ProfessoresFilters from '@/components/professores/professores-filters';
import { AddProfessorForm } from '@/components/professores/add-professor-form';
import { getInstructors } from './actions';
import { getAcademySettings, getUserProfile } from '../configuracoes/actions';
import { NavContent } from '@/components/layout/nav-content';
import type { Database } from '@/lib/database.types';

type Instructor = Database['public']['Tables']['instructors']['Row'];
type AcademySettings = Database['public']['Tables']['academy_settings']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

export default function ProfessoresPage() {
  const [instructors, setInstructors] = React.useState<Instructor[]>([]);
  const [academySettings, setAcademySettings] = React.useState<AcademySettings | null>(null);
  const [userProfile, setUserProfile] = React.useState<Profile | null>(null);
  const [loading, setLoading] = React.useState(true);

  const loadData = React.useCallback(async () => {
    setLoading(true);
    try {
      const [
        instructorsData,
        settingsData,
        profileData,
      ] = await Promise.all([
        getInstructors(),
        getAcademySettings(),
        getUserProfile(),
      ]);
      setInstructors(instructorsData);
      setAcademySettings(settingsData);
      setUserProfile(profileData);
    } catch (error) {
      console.error("Failed to load data for Professores page", error);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);
  
  const handleSuccess = () => {
    loadData();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen w-full bg-background text-foreground">
        <Sidebar>
          <NavContent settings={academySettings} />
        </Sidebar>
        <div className="flex flex-col w-0 flex-1">
          <Header settings={academySettings} userProfile={userProfile} />
          <main className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <Sidebar>
        <NavContent settings={academySettings} />
      </Sidebar>
      <div className="flex flex-col w-0 flex-1">
        <Header settings={academySettings} userProfile={userProfile} />
        <main className="flex-1 p-4 md:p-6 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold">Professores</h1>
              <p className="text-muted-foreground">Gerencie todos os professores da academia</p>
            </div>
            <AddProfessorForm onSuccess={handleSuccess}>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Novo Professor
              </Button>
            </AddProfessorForm>
          </div>

          <ProfessoresStats instructors={instructors} />
          <ProfessoresFilters />
          <ProfessoresTable instructors={instructors} onSuccess={handleSuccess} />

        </main>
      </div>
    </div>
  );
}

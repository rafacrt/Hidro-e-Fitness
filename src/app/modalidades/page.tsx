
'use client';

import * as React from 'react';
import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import ModalitiesStatCards from '@/components/modalidades/modalities-stat-cards';
import ModalitiesFilters from '@/components/modalidades/modalities-filters';
import ModalitiesTable from '@/components/modalidades/modalities-table';
import QuickActionsModalities from '@/components/modalidades/quick-actions-modalities';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2 } from 'lucide-react';
import TableFilters from '@/components/modalidades/table-filters';
import { getModalities, getModalitiesStats, getPlans } from './actions';
import { AddModalityForm } from '@/components/modalidades/add-modality-form';
import type { Database } from '@/lib/database.types';
import { getAcademySettings, getUserProfile } from '../configuracoes/actions';
import { NavContent } from '@/components/layout/nav-content';
import PlanosPrecosTab from '@/components/modalidades/planos-precos-tab';
import { useRouter } from 'next/navigation';

type AcademySettings = Database['public']['Tables']['academy_settings']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];
type Modality = Database['public']['Tables']['modalities']['Row'];
type Plan = Database['public']['Tables']['plans']['Row'] & { modalities: Pick<Modality, 'name'> | null };


export type ActiveTabModalities = "Visão Geral" | "Gerenciar Modalidades" | "Preços e Planos";

export default function ModalidadesPage() {
  const [modalities, setModalities] = React.useState<Modality[]>([]);
  const [plans, setPlans] = React.useState<Plan[]>([]);
  const [settings, setSettings] = React.useState<AcademySettings | null>(null);
  const [userProfile, setUserProfile] = React.useState<Profile | null>(null);
  const [activeTab, setActiveTab] = React.useState<ActiveTabModalities>("Visão Geral");
  const [stats, setStats] = React.useState<{ totalStudents: number, totalRevenue: number }>({ totalStudents: 0, totalRevenue: 0 });
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();

  const loadData = React.useCallback(async () => {
    setLoading(true);
    try {
      const [
        fetchedModalities,
        fetchedPlans,
        fetchedSettings,
        fetchedProfile,
        fetchedStats,
      ] = await Promise.all([
        getModalities(),
        getPlans(),
        getAcademySettings(),
        getUserProfile(),
        getModalitiesStats(),
      ]);
      setModalities(fetchedModalities);
      setPlans(fetchedPlans);
      setSettings(fetchedSettings);
      setUserProfile(fetchedProfile);
      setStats(fetchedStats);
    } catch (error) {
        console.error("Failed to load modalities data", error);
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

  const renderContent = () => {
    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    switch (activeTab) {
      case 'Gerenciar Modalidades':
        return (
          <>
            <TableFilters />
            <ModalitiesTable modalities={modalities} onSuccess={handleSuccess} />
          </>
        );
      case 'Visão Geral':
          return (
            <div className="space-y-6">
              <ModalitiesStatCards modalities={modalities} stats={stats} />
              <QuickActionsModalities setActiveTab={setActiveTab} />
            </div>
          );
      case 'Preços e Planos':
          return <PlanosPrecosTab modalities={modalities} plans={plans} onSuccess={handleSuccess} />;
      default:
        return <p>Selecione uma aba</p>;
    }
  };


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
              <h1 className="text-2xl font-bold">Modalidades</h1>
              <p className="text-muted-foreground">Gestão completa de modalidades e atividades</p>
            </div>
            <div className='flex gap-2 w-full md:w-auto'>
                <AddModalityForm onSuccess={handleSuccess}>
                    <Button className="w-full">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Nova Modalidade
                    </Button>
                </AddModalityForm>
            </div>
          </div>
          
          <ModalitiesFilters activeTab={activeTab} setActiveTab={setActiveTab} />
          
          {renderContent()}

        </main>
      </div>
    </div>
  );
}

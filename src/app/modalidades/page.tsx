
'use client';

import * as React from 'react';
import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import ModalitiesStatCards from '@/components/modalidades/modalities-stat-cards';
import ModalitiesFilters from '@/components/modalidades/modalities-filters';
import ModalitiesTable from '@/components/modalidades/modalities-table';
import QuickActionsModalities from '@/components/modalidades/quick-actions-modalities';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search } from 'lucide-react';
import TableFilters from '@/components/modalidades/table-filters';
import { getModalities } from './actions';
import { AddModalityForm } from '@/components/modalidades/add-modality-form';
import type { Database } from '@/lib/database.types';
import { getAcademySettings, getUserProfile } from '../configuracoes/actions';
import { NavContent } from '@/components/layout/nav-content';
import PlanosPrecosTab from '@/components/modalidades/planos-precos-tab';

type AcademySettings = Database['public']['Tables']['academy_settings']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];
type Modality = Database['public']['Tables']['modalities']['Row'];

export type ActiveTabModalities = "Visão Geral" | "Gerenciar Modalidades" | "Preços e Planos";

export default function ModalidadesPage() {
  const [modalities, setModalities] = React.useState<Modality[]>([]);
  const [settings, setSettings] = React.useState<AcademySettings | null>(null);
  const [userProfile, setUserProfile] = React.useState<Profile | null>(null);
  const [activeTab, setActiveTab] = React.useState<ActiveTabModalities>("Visão Geral");

  React.useEffect(() => {
    async function loadData() {
      const [
        fetchedModalities,
        fetchedSettings,
        fetchedProfile
      ] = await Promise.all([
        getModalities(),
        getAcademySettings(),
        getUserProfile()
      ]);
      setModalities(fetchedModalities);
      setSettings(fetchedSettings);
      setUserProfile(fetchedProfile);
    }
    loadData();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'Gerenciar Modalidades':
        return (
          <>
            <TableFilters />
            <ModalitiesTable modalities={modalities} />
            <QuickActionsModalities />
          </>
        );
      case 'Visão Geral':
          return <ModalitiesStatCards modalities={modalities} />;
      case 'Preços e Planos':
          return <PlanosPrecosTab />;
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
                <Button variant="outline" className="w-full">
                    <Search className="mr-2 h-4 w-4" />
                    Buscar
                </Button>
                <AddModalityForm>
                    <Button className="w-full">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Nova
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

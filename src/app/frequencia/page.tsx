
'use client';

import * as React from 'react';
import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import { Button } from '@/components/ui/button';
import { Download, PlusCircle } from 'lucide-react';
import FrequenciaFilters from '@/components/frequencia/frequencia-filters';
import FrequenciaStatsCards from '@/components/frequencia/frequencia-stats-cards';
import AcoesRapidasFrequencia from '@/components/frequencia/acoes-rapidas-frequencia';
import { getAcademySettings, getUserProfile } from '../configuracoes/actions';
import type { Database } from '@/lib/database.types';
import PlaceholderContent from '@/components/relatorios/placeholder-content';

type AcademySettings = Database['public']['Tables']['academy_settings']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];
export type ActiveTabFrequencia = "Visão Geral" | "Controle de Presença" | "Histórico";

export default function FrequenciaPage() {
  const [settings, setSettings] = React.useState<AcademySettings | null>(null);
  const [userProfile, setUserProfile] = React.useState<Profile | null>(null);
  const [activeTab, setActiveTab] = React.useState<ActiveTabFrequencia>("Visão Geral");

  React.useEffect(() => {
    async function loadData() {
      const [academySettings, profile] = await Promise.all([
        getAcademySettings(),
        getUserProfile()
      ]);
      setSettings(academySettings);
      setUserProfile(profile);
    }
    loadData();
  }, []);
  
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
              <Button className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" />
                Marcar Presença
              </Button>
            </div>
          </div>
          
          <FrequenciaFilters activeTab={activeTab} setActiveTab={setActiveTab} />

          {activeTab === 'Visão Geral' && (
            <>
              <FrequenciaStatsCards />
              <AcoesRapidasFrequencia />
            </>
          )}

          {activeTab === 'Controle de Presença' && (
            <PlaceholderContent title="Controle de Presença" />
          )}

          {activeTab === 'Histórico' && (
            <PlaceholderContent title="Histórico de Frequência" />
          )}

        </main>
      </div>
    </div>
  );
}

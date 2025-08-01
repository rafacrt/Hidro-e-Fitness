
'use client';

import * as React from 'react';
import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import ManutencaoFilters from '@/components/manutencao/manutencao-filters';
import ManutencaoStats from '@/components/manutencao/manutencao-stats';
import ManutencaoUrgente from '@/components/manutencao/manutencao-urgente';
import AtividadesRecentesManutencao from '@/components/manutencao/atividades-recentes-manutencao';
import StatusEquipamentos from '@/components/manutencao/status-equipamentos';
import AcoesRapidasManutencao from '@/components/manutencao/acoes-rapidas-manutencao';
import { AddManutencaoForm } from '@/components/manutencao/add-manutencao-form';
import EquipamentosTab from '@/components/manutencao/equipamentos-tab';
import AgendamentosTab from '@/components/manutencao/agendamentos-tab';
import ProdutosQuimicosTab from '@/components/manutencao/produtos-quimicos-tab';
import RelatoriosManutencaoTab from '@/components/manutencao/relatorios-manutencao-tab';
import type { Database } from '@/lib/database.types';
import { getEquipments, getMaintenances } from './actions';
import { getAcademySettings } from '../configuracoes/actions';

type AcademySettings = Database['public']['Tables']['academy_settings']['Row'];
type Equipment = Database['public']['Tables']['equipments']['Row'];
type Maintenance = Database['public']['Tables']['maintenance_schedules']['Row'] & { equipments: Pick<Equipment, 'name'> | null };

type ActiveTab = "Visão Geral" | "Equipamentos" | "Agendamentos" | "Produtos Químicos" | "Relatórios";

export default function ManutencaoPage() {
  const [activeTab, setActiveTab] = React.useState<ActiveTab>("Equipamentos");
  const [equipments, setEquipments] = React.useState<Equipment[]>([]);
  const [maintenances, setMaintenances] = React.useState<Maintenance[]>([]);
  const [settings, setSettings] = React.useState<AcademySettings | null>(null);

  React.useEffect(() => {
    async function loadData() {
      const academySettings = await getAcademySettings();
      setSettings(academySettings);
      
      if (activeTab === 'Equipamentos') {
        const fetchedEquipments = await getEquipments();
        setEquipments(fetchedEquipments);
      }
      if (activeTab === 'Agendamentos') {
        const [fetchedEquipments, fetchedMaintenances] = await Promise.all([
          getEquipments(),
          getMaintenances()
        ]);
        setEquipments(fetchedEquipments);
        setMaintenances(fetchedMaintenances);
      }
    }
    loadData();
  }, [activeTab]);


  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <Sidebar settings={settings} />
      <div className="flex flex-col w-0 flex-1">
        <Header settings={settings} />
        <main className="flex-1 p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Manutenção</h1>
              <p className="text-muted-foreground">Gestão completa de equipamentos e manutenção</p>
            </div>
            <div className="flex gap-2">
              <AddManutencaoForm equipments={equipments}>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Nova Manutenção
                </Button>
              </AddManutencaoForm>
            </div>
          </div>
          
          <ManutencaoFilters activeTab={activeTab} setActiveTab={setActiveTab} />

          {activeTab === 'Visão Geral' && (
            <div className="space-y-6">
              <ManutencaoStats />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ManutencaoUrgente />
                <AtividadesRecentesManutencao />
              </div>
              <StatusEquipamentos />
              <AcoesRapidasManutencao />
            </div>
          )}

          {activeTab === 'Equipamentos' && <EquipamentosTab equipments={equipments} />}

          {activeTab === 'Agendamentos' && <AgendamentosTab maintenances={maintenances} equipments={equipments} />}
          
          {activeTab === 'Produtos Químicos' && <ProdutosQuimicosTab />}

          {activeTab === 'Relatórios' && <RelatoriosManutencaoTab />}

        </main>
      </div>
    </div>
  );
}

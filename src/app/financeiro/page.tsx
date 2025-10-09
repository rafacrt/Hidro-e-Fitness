
'use client';

import * as React from 'react';
import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import { Button } from '@/components/ui/button';
import { PlusCircle, Upload } from 'lucide-react';
import FiltrosFinanceiro from '@/components/financeiro/filtros-financeiro';
import FinanceiroStatCards from '@/components/financeiro/financeiro-stat-cards';
import AcoesRapidasFinanceiro from '@/components/financeiro/acoes-rapidas-financeiro';
import { AddTransacaoDialog } from '@/components/financeiro/add-transacao-dialog';
import { ExportFinanceiroDialog } from '@/components/financeiro/export-financeiro-dialog';
import RecebimentosTab from '@/components/financeiro/recebimentos-tab';
import PagamentosTab from '@/components/financeiro/pagamentos-tab';
import FluxoDeCaixaTab from '@/components/financeiro/fluxo-de-caixa-tab';
import MetodosPagamentoTab from '@/components/pagamentos/metodos-pagamento-tab';
import PlanosPrecosTab from '@/components/modalidades/planos-precos-tab';
import type { Database } from '@/lib/database.types';
import { getAcademySettings, getUserProfile } from '../configuracoes/actions';
import { NavContent } from '@/components/layout/nav-content';
import { getFinancialSummary, getTransactions, type FinancialSummary } from './actions';
import { getModalities, getPlans } from '../modalidades/actions';
import { Loader2 } from 'lucide-react';
import TransacoesRecentesTable from '@/components/financeiro/transacoes-recentes-table';

type AcademySettings = Database['public']['Tables']['academy_settings']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];
type Payment = Database['public']['Tables']['payments']['Row'];
type Modality = Database['public']['Tables']['modalities']['Row'];
type Plan = Database['public']['Tables']['plans']['Row'] & { modalities: Pick<Modality, 'name'> | null };

type ActiveTab = "Visão Geral" | "Recebimentos" | "Pagamentos" | "Fluxo de Caixa" | "Métodos de Pagamento" | "Planos e Preços";

export default function FinanceiroPage() {
  const [activeTab, setActiveTab] = React.useState<ActiveTab>("Visão Geral");
  const [settings, setSettings] = React.useState<AcademySettings | null>(null);
  const [userProfile, setUserProfile] = React.useState<Profile | null>(null);
  const [recebimentos, setRecebimentos] = React.useState<Payment[]>([]);
  const [pagamentos, setPagamentos] = React.useState<Payment[]>([]);
  const [summary, setSummary] = React.useState<FinancialSummary | null>(null);
  const [modalities, setModalities] = React.useState<Modality[]>([]);
  const [plans, setPlans] = React.useState<Plan[]>([]);
  const [loading, setLoading] = React.useState(true);

  const loadData = React.useCallback(async () => {
    setLoading(true);
    try {
      const [
        academySettings, 
        profile, 
        receitasData, 
        despesasData, 
        financialSummary,
        modalitiesData,
        plansData,
      ] = await Promise.all([
        getAcademySettings(), 
        getUserProfile(),
        getTransactions('receita'),
        getTransactions('despesa'),
        getFinancialSummary(),
        getModalities(),
        getPlans(),
      ]);
      setSettings(academySettings);
      setUserProfile(profile);
      setRecebimentos(receitasData);
      setModalities(modalitiesData);
      setPlans(plansData);
      setPagamentos(despesasData);
      setSummary(financialSummary);
    } catch (error) {
      console.error("Failed to load financial data", error);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      );
    }

    switch(activeTab) {
      case 'Visão Geral':
        return summary && (
          <div className="space-y-6">
            <FinanceiroStatCards summary={summary} />
            <TransacoesRecentesTable transactions={summary.transactions} onSuccess={loadData} />
            <AcoesRapidasFinanceiro onSuccess={loadData} />
          </div>
        );
      case 'Recebimentos':
        return <RecebimentosTab recebimentos={recebimentos} />;
      case 'Pagamentos':
        return <PagamentosTab pagamentos={pagamentos} />;
      case 'Fluxo de Caixa':
        return summary && <FluxoDeCaixaTab summary={summary} />;
      case 'Métodos de Pagamento':
        return <MetodosPagamentoTab />;
      case 'Planos e Preços':
        return <PlanosPrecosTab modalities={modalities} plans={plans} onSuccess={loadData} />;
      default:
        return null;
    }
  }

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
              <h1 className="text-2xl font-bold">Financeiro</h1>
              <p className="text-muted-foreground">Gestão completa das finanças, planos e pagamentos da academia</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <ExportFinanceiroDialog>
                <Button variant="outline" className="w-full">
                  <Upload className="mr-2 h-4 w-4" />
                  Exportar
                </Button>
              </ExportFinanceiroDialog>
              <AddTransacaoDialog onSuccess={loadData}>
                <Button className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Nova Transação
                </Button>
              </AddTransacaoDialog>
            </div>
          </div>
          
          <FiltrosFinanceiro activeTab={activeTab} setActiveTab={setActiveTab} />

          {renderContent()}

        </main>
      </div>
    </div>
  );
}

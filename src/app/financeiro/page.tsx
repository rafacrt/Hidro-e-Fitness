
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
import type { Database } from '@/lib/database.types';
import { getAcademySettings, getUserProfile } from '../configuracoes/actions';
import { NavContent } from '@/components/layout/nav-content';
import { getFinancialSummary, getTransactions, type FinancialSummary } from './actions';
import { Loader2 } from 'lucide-react';
import { mockPayments } from '@/lib/mock-data';

type AcademySettings = Database['public']['Tables']['academy_settings']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];
type Payment = Database['public']['Tables']['payments']['Row'];

type ActiveTab = "Visão Geral" | "Recebimentos" | "Pagamentos" | "Fluxo de Caixa";

export default function FinanceiroPage() {
  const [activeTab, setActiveTab] = React.useState<ActiveTab>("Visão Geral");
  const [settings, setSettings] = React.useState<AcademySettings | null>(null);
  const [userProfile, setUserProfile] = React.useState<Profile | null>(null);
  const [recebimentos, setRecebimentos] = React.useState<Payment[]>([]);
  const [pagamentos, setPagamentos] = React.useState<Payment[]>([]);
  const [summary, setSummary] = React.useState<FinancialSummary | null>(null);
  const [loading, setLoading] = React.useState(true);

  const loadData = React.useCallback(async () => {
    setLoading(true);
    const [academySettings, profile, receitasData, despesasData, financialSummary] = await Promise.all([
      getAcademySettings(), 
      getUserProfile(),
      getTransactions('receita'),
      getTransactions('despesa'),
      getFinancialSummary(),
    ]);
    setSettings(academySettings);
    setUserProfile(profile);
    setRecebimentos(receitasData);
    
    if (process.env.NODE_ENV === 'development' && despesasData.length === 0) {
      setPagamentos(mockPayments);
    } else {
      setPagamentos(despesasData);
    }
    
    setSummary(financialSummary);
    setLoading(false);
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

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
              <p className="text-muted-foreground">Gestão completa das finanças da academia</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <ExportFinanceiroDialog>
                <Button variant="outline" className="w-full">
                  <Upload className="mr-2 h-4 w-4" />
                  Exportar
                </Button>
              </ExportFinanceiroDialog>
              <AddTransacaoDialog>
                <Button className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Nova Transação
                </Button>
              </AddTransacaoDialog>
            </div>
          </div>
          
          <FiltrosFinanceiro activeTab={activeTab} setActiveTab={setActiveTab} />

          {loading && (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}

          {!loading && activeTab === 'Visão Geral' && summary && (
            <div className="space-y-6">
              <FinanceiroStatCards summary={summary} />
              <AcoesRapidasFinanceiro />
            </div>
          )}

          {!loading && activeTab === 'Recebimentos' && <RecebimentosTab recebimentos={recebimentos} />}
          
          {!loading && activeTab === 'Pagamentos' && <PagamentosTab pagamentos={pagamentos} />}

          {!loading && activeTab === 'Fluxo de Caixa' && summary && <FluxoDeCaixaTab summary={summary} />}

        </main>
      </div>
    </div>
  );
}

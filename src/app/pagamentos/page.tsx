
'use client';

import * as React from 'react';
import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import { Button } from '@/components/ui/button';
import { Download, PlusCircle } from 'lucide-react';
import PagamentosFilters from '@/components/pagamentos/pagamentos-filters';
import PagamentosStatsCards from '@/components/pagamentos/pagamentos-stats-cards';
import PerformanceMetodos from '@/components/pagamentos/performance-metodos';
import TransacoesRecentes from '@/components/pagamentos/transacoes-recentes';
import CobrancasPendentes from '@/components/pagamentos/cobrancas-pendentes';
import AcoesRapidasPagamentos from '@/components/pagamentos/acoes-rapidas-pagamentos';
import { AddPaymentForm } from '@/components/pagamentos/add-payment-form';
import PlanosPrecosStats from '@/components/pagamentos/planos-precos-stats';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PlanosList from '@/components/pagamentos/planos-list';
import PlanosPrecosActions from '@/components/pagamentos/planos-precos-actions';
import HistoricoStatsCards from '@/components/pagamentos/historico-stats-cards';
import HistoricoFilters from '@/components/pagamentos/historico-filters';
import HistoricoTable from '@/components/pagamentos/historico-table';
import HistoricoTablePagination from '@/components/pagamentos/historico-table-pagination';
import RelatoriosPagamentosCards from '@/components/pagamentos/relatorios-pagamentos-cards';
import FiltrosRelatorioPagamentos from '@/components/pagamentos/filtros-relatorio-pagamentos';
import ReceitaPorMetodoReport from '@/components/pagamentos/receita-por-metodo-report';
import EvolucaoMensalReport from '@/components/pagamentos/evolucao-mensal-report';
import ReceitaPorPlanoReport from '@/components/pagamentos/receita-por-plano-report';
import { Card, CardContent } from '@/components/ui/card';
import MetodosPagamentoTab from '@/components/pagamentos/metodos-pagamento-tab';

type ActiveTab = "Visão Geral" | "Métodos de Pagamento" | "Planos e Preços" | "Histórico" | "Relatórios";

export default function PagamentosPage() {
  const [activeTab, setActiveTab] = React.useState<ActiveTab>("Métodos de Pagamento");

  const renderHeaderButtons = () => {
    switch (activeTab) {
      case 'Planos e Preços':
        return (
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Plano
          </Button>
        );
      case 'Histórico':
      case 'Relatórios':
      case 'Métodos de Pagamento':
         return (
            <div className='flex gap-2'>
                <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Exportar
                </Button>
                 <AddPaymentForm>
                    <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Novo Pagamento
                    </Button>
                </AddPaymentForm>
            </div>
         )
      default:
        return (
          <AddPaymentForm>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Pagamento
            </Button>
          </AddPaymentForm>
        );
    }
  }

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <Sidebar />
      <div className="flex flex-col w-0 flex-1">
        <Header />
        <main className="flex-1 p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Pagamentos</h1>
              <p className="text-muted-foreground">Gestão completa de pagamentos e cobrança</p>
            </div>
            <div className="flex gap-2">
              {renderHeaderButtons()}
            </div>
          </div>
          
          <PagamentosFilters activeTab={activeTab} setActiveTab={setActiveTab} />
          
          {activeTab === 'Visão Geral' && (
            <div className="space-y-6">
              <PagamentosStatsCards />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <PerformanceMetodos />
                </div>
                <div>
                  <TransacoesRecentes />
                </div>
              </div>
              <CobrancasPendentes />
              <AcoesRapidasPagamentos />
            </div>
          )}

          {activeTab === 'Métodos de Pagamento' && <MetodosPagamentoTab />}

          {activeTab === 'Planos e Preços' && (
            <div className="space-y-6">
              <PlanosPrecosStats />
              <div className='flex items-center justify-between'>
                <Select defaultValue="all">
                  <SelectTrigger className="w-full md:w-[220px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as Modalidades</SelectItem>
                    <SelectItem value="natacao">Natação</SelectItem>
                    <SelectItem value="hidro">Hidroginástica</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <PlanosList />
              <PlanosPrecosActions />
            </div>
          )}

          {activeTab === 'Histórico' && (
            <div className="space-y-6">
              <HistoricoStatsCards />
              <HistoricoFilters />
              <HistoricoTable />
              <HistoricoTablePagination />
            </div>
          )}

          {activeTab === 'Relatórios' && (
            <div className="space-y-6">
              <RelatoriosPagamentosCards />
              <FiltrosRelatorioPagamentos />
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                <ReceitaPorMetodoReport />
                <EvolucaoMensalReport />
              </div>
              <ReceitaPorPlanoReport />
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

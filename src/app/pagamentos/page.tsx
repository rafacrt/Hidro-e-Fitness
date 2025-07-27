
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

type ActiveTab = "Visão Geral" | "Métodos de Pagamento" | "Planos e Preços" | "Histórico" | "Relatórios";

export default function PagamentosPage() {
  const [activeTab, setActiveTab] = React.useState<ActiveTab>("Planos e Preços");

  const renderHeaderButtons = () => {
    switch (activeTab) {
      case 'Planos e Preços':
        return (
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Plano
          </Button>
        );
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

        </main>
      </div>
    </div>
  );
}


'use client';

import * as React from 'react';
import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import { Button } from '@/components/ui/button';
import { PlusCircle, Upload } from 'lucide-react';
import FiltrosFinanceiro from '@/components/financeiro/filtros-financeiro';
import CardsRelatorios from '@/components/financeiro/cards-relatorios';
import FiltrosRelatorio from '@/components/financeiro/filtros-relatorio';
import { Card, CardContent } from '@/components/ui/card';
import ReceitaPorModalidade from '@/components/financeiro/receita-por-modalidade';
import FormaDePagamento from '@/components/financeiro/forma-de-pagamento';
import EvolucaoMensal from '@/components/financeiro/evolucao-mensal';
import FinanceiroStatCards from '@/components/financeiro/financeiro-stat-cards';
import VisaoGeralCharts from '@/components/financeiro/visao-geral-charts';
import AcoesRapidasFinanceiro from '@/components/financeiro/acoes-rapidas-financeiro';
import PlaceholderContent from '@/components/financeiro/placeholder-content';
import { AddTransacaoDialog } from '@/components/financeiro/add-transacao-dialog';
import { ExportFinanceiroDialog } from '@/components/financeiro/export-financeiro-dialog';
import RecebimentosTab from '@/components/financeiro/recebimentos-tab';

type ActiveTab = "Visão Geral" | "Recebimentos" | "Pagamentos" | "Fluxo de Caixa" | "Relatórios";

export default function FinanceiroPage() {
  const [activeTab, setActiveTab] = React.useState<ActiveTab>("Recebimentos");

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <Sidebar />
      <div className="flex flex-col w-0 flex-1">
        <Header />
        <main className="flex-1 p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Financeiro</h1>
              <p className="text-muted-foreground">Gestão completa das finanças da academia</p>
            </div>
            <div className="flex gap-2">
              <ExportFinanceiroDialog>
                <Button variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Exportar
                </Button>
              </ExportFinanceiroDialog>
              <AddTransacaoDialog>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Nova Transação
                </Button>
              </AddTransacaoDialog>
            </div>
          </div>
          
          <FiltrosFinanceiro activeTab={activeTab} setActiveTab={setActiveTab} />

          {activeTab === 'Visão Geral' && (
            <div className="space-y-6">
              <FinanceiroStatCards />
              <VisaoGeralCharts />
              <AcoesRapidasFinanceiro />
            </div>
          )}

          {activeTab === 'Recebimentos' && <RecebimentosTab />}

          {activeTab === 'Relatórios' && (
            <div className="space-y-6">
              <CardsRelatorios />
              <FiltrosRelatorio />
              <Card>
                <CardContent className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <ReceitaPorModalidade />
                  <FormaDePagamento />
                </CardContent>
              </Card>
              <EvolucaoMensal />
            </div>
          )}

          {activeTab === 'Pagamentos' && <PlaceholderContent title="Pagamentos" />}
          {activeTab === 'Fluxo de Caixa' && <PlaceholderContent title="Fluxo de Caixa" />}

        </main>
      </div>
    </div>
  );
}

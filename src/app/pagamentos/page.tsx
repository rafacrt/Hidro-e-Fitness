
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

export default function PagamentosPage() {
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
              <AddPaymentForm>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Novo Pagamento
                </Button>
              </AddPaymentForm>
            </div>
          </div>
          
          <PagamentosFilters />
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

        </main>
      </div>
    </div>
  );
}

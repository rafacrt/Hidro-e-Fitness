
import { Card, CardContent } from '@/components/ui/card';
import CardsRelatorios from '@/components/financeiro/cards-relatorios';
import EvolucaoMensal from '@/components/financeiro/evolucao-mensal';
import FiltrosRelatorio from '@/components/financeiro/filtros-relatorio';
import FormaDePagamento from '@/components/financeiro/forma-de-pagamento';
import ReceitaPorModalidade from '@/components/financeiro/receita-por-modalidade';

export default function FinanceiroReport() {
  return (
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
  );
}

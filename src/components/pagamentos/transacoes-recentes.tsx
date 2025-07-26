import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';

const transactions = [
  { name: 'Maria Santos Silva', modality: 'Natação Adulto', time: '2 min atrás', method: 'PIX', amount: 'R$ 180,00', status: 'Aprovado' },
  { name: 'João Pedro Costa', modality: 'Hidroginástica', time: '5 min atrás', method: 'Cartão de Crédito', amount: 'R$ 160,00', status: 'Processando' },
  { name: 'Ana Clara Oliveira', modality: 'Natação Infantil', time: '8 min atrás', method: 'PIX', amount: 'R$ 150,00', status: 'Aprovado' },
  { name: 'Carlos Eduardo Lima', modality: 'Funcional Aquático', time: '12 min atrás', method: 'Link de Pagamento', amount: 'R$ 220,00', status: 'Pendente' },
];

const statusStyles: { [key: string]: string } = {
  Aprovado: 'bg-green-100 text-green-800 border-green-200',
  Processando: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Pendente: 'bg-orange-100 text-orange-800 border-orange-200',
};

export default function TransacoesRecentes() {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Transações Recentes</CardTitle>
        <Button variant="link" className="text-sm">Ver todas</Button>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {transactions.map((transaction, index) => (
            <li key={index}>
              {index > 0 && <Separator className="mb-4" />}
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{transaction.name}</p>
                  <p className="text-sm text-muted-foreground">{transaction.modality}</p>
                  <p className="text-xs text-muted-foreground mt-1">{transaction.time} · {transaction.method}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{transaction.amount}</p>
                  <Badge variant="outline" className={cn('mt-1 font-medium', statusStyles[transaction.status])}>
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

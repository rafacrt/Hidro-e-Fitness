import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';

const payments = [
  { name: 'Maria Santos', date: '14/01/2024', amount: 'R$ 180,00', status: 'Pago' },
  { name: 'João Silva', date: '09/01/2024', amount: 'R$ 160,00', status: 'Vencido' },
  { name: 'Ana Costa', date: '19/01/2024', amount: 'R$ 200,00', status: 'Pendente' },
];

const statusStyles = {
  Pago: 'bg-green-100 text-green-800',
  Vencido: 'bg-red-100 text-red-800',
  Pendente: 'bg-yellow-100 text-yellow-800',
};

export default function RecentPayments() {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Pagamentos Recentes</CardTitle>
        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-100">
            <DollarSign className="h-4 w-4 text-green-600" />
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {payments.map((payment, index) => (
            <li key={index}>
              {index > 0 && <Separator className="mb-4" />}
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{payment.name}</p>
                  <p className="text-sm text-muted-foreground">{payment.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{payment.amount}</p>
                  <Badge className={cn('mt-1 font-normal', statusStyles[payment.status as keyof typeof statusStyles])}>
                    {payment.status}
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

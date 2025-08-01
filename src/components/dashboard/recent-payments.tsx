
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Receipt } from 'lucide-react';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';
import type { Database } from '@/lib/database.types';
import { format } from 'date-fns';

type Payment = Database['public']['Tables']['payments']['Row'] & { students: Pick<Database['public']['Tables']['students']['Row'], 'name'> | null };

interface RecentPaymentsProps {
  payments: Payment[];
}

const statusStyles: { [key: string]: string } = {
  pago: 'bg-green-100 text-green-800',
  vencido: 'bg-red-100 text-red-800',
  pendente: 'bg-yellow-100 text-yellow-800',
};

const formatCurrency = (value: number | null) => {
    if (value === null) return 'N/A';
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
};

export default function RecentPayments({ payments }: RecentPaymentsProps) {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Pagamentos Recentes</CardTitle>
        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-100">
            <DollarSign className="h-4 w-4 text-green-600" />
        </div>
      </CardHeader>
      <CardContent>
        {payments.length > 0 ? (
            <ul className="space-y-4">
            {payments.map((payment, index) => (
                <li key={index}>
                {index > 0 && <Separator className="mb-4" />}
                <div className="flex justify-between items-center">
                    <div>
                    <p className="font-medium">{payment.students?.name || 'Aluno não identificado'}</p>
                    <p className="text-sm text-muted-foreground">{payment.paid_at ? format(new Date(payment.paid_at), 'dd/MM/yyyy') : 'Data pendente'}</p>
                    </div>
                    <div className="text-right">
                    <p className="font-semibold">{formatCurrency(payment.amount)}</p>
                    <Badge className={cn('mt-1 font-normal capitalize', statusStyles[payment.status as keyof typeof statusStyles])}>
                        {payment.status}
                    </Badge>
                    </div>
                </div>
                </li>
            ))}
            </ul>
        ) : (
             <div className="text-center text-muted-foreground py-10">
                <Receipt className="mx-auto h-12 w-12 mb-4" />
                <p>Nenhum pagamento recente encontrado.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}

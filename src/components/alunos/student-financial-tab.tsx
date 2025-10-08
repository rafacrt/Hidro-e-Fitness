
'use client';

import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { getPendingPayments } from '@/app/financeiro/actions';
import type { Database } from '@/lib/database.types';
import { Badge } from '../ui/badge';
import { format } from 'date-fns';

type Payment = Database['public']['Tables']['payments']['Row'];

interface StudentFinancialTabProps {
  studentId: string;
}

const formatCurrency = (value: number | null) => {
    if (value === null) return 'N/A';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
};

const statusConfig: { [key: string]: { text: string, className: string } } = {
  pago: { text: 'Pago', className: 'bg-green-100 text-green-800 border-green-200' },
  pendente: { text: 'Pendente', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  vencido: { text: 'Vencido', className: 'bg-red-100 text-red-800 border-red-200' },
};

export default function StudentFinancialTab({ studentId }: StudentFinancialTabProps) {
  const [loading, setLoading] = React.useState(true);
  const [pendingPayments, setPendingPayments] = React.useState<Payment[]>([]);

  const loadPendingPayments = React.useCallback(async () => {
    setLoading(true);
    const payments = await getPendingPayments(studentId);
    setPendingPayments(payments);
    setLoading(false);
  }, [studentId]);

  React.useEffect(() => {
    loadPendingPayments();
  }, [loadPendingPayments]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  return (
    <div className="py-4 max-h-[60vh] overflow-y-auto pr-2 space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Cobranças Pendentes</CardTitle>
                <CardDescription>Cobranças com status "Pendente" ou "Vencido" para este aluno.</CardDescription>
            </CardHeader>
            <CardContent>
                {pendingPayments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-8">
                        <p className="font-semibold">Nenhuma cobrança pendente</p>
                        <p className="text-sm">Este aluno está com os pagamentos em dia.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {pendingPayments.map(payment => {
                            const statusInfo = statusConfig[payment.status] || statusConfig.pendente;
                            return (
                                <div key={payment.id} className="p-4 border rounded-lg flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold">{payment.description}</p>
                                        <p className="text-sm text-muted-foreground capitalize">
                                            Vence em: {format(new Date(payment.due_date), 'dd/MM/yyyy')}
                                        </p>
                                    </div>
                                    <div className='text-right'>
                                      <p className="font-bold text-lg">{formatCurrency(payment.amount)}</p>
                                      <Badge variant="outline" className={statusInfo.className}>
                                        {statusInfo.text}
                                      </Badge>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    </div>
  );
}

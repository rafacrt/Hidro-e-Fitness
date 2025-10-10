
'use client';

import * as React from 'react';
import { Loader2, ExternalLink, CreditCard } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { getAllStudentPayments } from '@/app/financeiro/actions';
import type { Database } from '@/lib/database.types';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { Separator } from '../ui/separator';

type Payment = Database['public']['Tables']['payments']['Row'];

interface StudentFinancialTabProps {
  studentId: string;
  studentName?: string;
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

export default function StudentFinancialTab({ studentId, studentName }: StudentFinancialTabProps) {
  const [loading, setLoading] = React.useState(true);
  const [allPayments, setAllPayments] = React.useState<Payment[]>([]);
  const router = useRouter();

  const loadPayments = React.useCallback(async () => {
    setLoading(true);
    const payments = await getAllStudentPayments(studentId);
    setAllPayments(payments);
    setLoading(false);
  }, [studentId]);

  React.useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  const handleGoToCaixa = () => {
    // Navigate to caixa page with student pre-selected
    router.push(`/caixa?studentId=${studentId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const pendingPayments = allPayments.filter(p => p.status === 'pendente' || p.status === 'vencido');
  const paidPayments = allPayments.filter(p => p.status === 'pago');

  return (
    <div className="py-4 max-h-[60vh] overflow-y-auto pr-2 space-y-6">
        <Card>
            <CardHeader className="flex-row items-center justify-between">
                <div>
                    <CardTitle>Cobranças Pendentes</CardTitle>
                    <CardDescription>Cobranças com status "Pendente" ou "Vencido"</CardDescription>
                </div>
                {pendingPayments.length > 0 && (
                    <Button onClick={handleGoToCaixa} size="sm">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Ir para Caixa
                    </Button>
                )}
            </CardHeader>
            <CardContent>
                {pendingPayments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-8">
                        <p className="font-semibold">Nenhuma cobrança pendente</p>
                        <p className="text-sm">Este aluno está com os pagamentos em dia.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {pendingPayments.map(payment => {
                            const statusInfo = statusConfig[payment.status] || statusConfig.pendente;
                            return (
                                <div
                                    key={payment.id}
                                    className="p-4 border rounded-lg flex justify-between items-center hover:bg-accent cursor-pointer transition-colors"
                                    onClick={handleGoToCaixa}
                                >
                                    <div>
                                        <p className="font-semibold">{payment.description}</p>
                                        <p className="text-sm text-muted-foreground">
                                            Vence em: {format(new Date(payment.due_date), 'dd/MM/yyyy')}
                                        </p>
                                    </div>
                                    <div className='text-right flex items-center gap-2'>
                                      <div>
                                        <p className="font-bold text-lg">{formatCurrency(payment.amount)}</p>
                                        <Badge variant="outline" className={statusInfo.className}>
                                          {statusInfo.text}
                                        </Badge>
                                      </div>
                                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Histórico de Pagamentos</CardTitle>
                <CardDescription>Todos os pagamentos já realizados</CardDescription>
            </CardHeader>
            <CardContent>
                {paidPayments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-8">
                        <p className="font-semibold">Nenhum pagamento registrado</p>
                        <p className="text-sm">Ainda não há pagamentos realizados.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {paidPayments.map(payment => {
                            const statusInfo = statusConfig[payment.status] || statusConfig.pago;
                            return (
                                <div key={payment.id} className="p-4 border rounded-lg flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold">{payment.description}</p>
                                        <p className="text-sm text-muted-foreground">
                                            Pago em: {payment.paid_at ? format(new Date(payment.paid_at), 'dd/MM/yyyy') : 'N/A'}
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


'use client';

import * as React from 'react';
import { Loader2, CreditCard, Calendar, DollarSign, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { getAllStudentPayments } from '@/app/financeiro/actions';
import { syncStudentPlanPayments } from '@/app/alunos/actions';
import type { Database } from '@/lib/database.types';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

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

const statusConfig: { [key: string]: { text: string, className: string, rowClassName: string } } = {
  pago: {
    text: 'Pago',
    className: 'bg-green-100 text-green-800 border-green-200',
    rowClassName: 'bg-green-50/50'
  },
  pendente: {
    text: 'Pendente',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    rowClassName: 'bg-yellow-50/50'
  },
  vencido: {
    text: 'Vencido',
    className: 'bg-red-100 text-red-800 border-red-200',
    rowClassName: 'bg-red-50/50'
  },
};

export default function StudentFinancialTab({ studentId, studentName }: StudentFinancialTabProps) {
  const [loading, setLoading] = React.useState(true);
  const [syncing, setSyncing] = React.useState(false);
  const [allPayments, setAllPayments] = React.useState<Payment[]>([]);
  const router = useRouter();
  const { toast } = useToast();

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

  const handleSyncPayments = async () => {
    setSyncing(true);
    try {
      const result = await syncStudentPlanPayments(studentId);
      if (result.success) {
        toast({ title: 'Sucesso!', description: result.message });
        await loadPayments(); // Reload payments
      } else {
        toast({ title: 'Erro', description: result.message, variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Erro', description: 'Erro ao sincronizar cobranças.', variant: 'destructive' });
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const hasPendingPayments = allPayments.some(p => p.status === 'pendente' || p.status === 'vencido');

  return (
    <div className="py-4 max-h-[60vh] overflow-y-auto pr-2 space-y-4">
        <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        Pagamentos e Cobranças
                    </CardTitle>
                    <CardDescription>Histórico completo de pagamentos do aluno</CardDescription>
                </div>
                {hasPendingPayments && (
                    <Button onClick={handleGoToCaixa} size="sm" className="gap-2">
                        <CreditCard className="h-4 w-4" />
                        Efetuar Pagamento
                    </Button>
                )}
            </CardHeader>
            <CardContent>
                {allPayments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-12">
                        <Calendar className="h-12 w-12 mb-4 opacity-50" />
                        <p className="font-semibold text-lg">Nenhum pagamento registrado</p>
                        <p className="text-sm mb-4">Ainda não há cobranças para este aluno.</p>
                        <Button
                            onClick={handleSyncPayments}
                            disabled={syncing}
                            variant="outline"
                            size="sm"
                            className="gap-2"
                        >
                            {syncing ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Sincronizando...
                                </>
                            ) : (
                                <>
                                    <RefreshCw className="h-4 w-4" />
                                    Gerar Cobranças dos Planos
                                </>
                            )}
                        </Button>
                    </div>
                ) : (
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Descrição</TableHead>
                                    <TableHead className="text-center">Valor</TableHead>
                                    <TableHead className="text-center">Vencimento</TableHead>
                                    <TableHead className="text-center">Status</TableHead>
                                    <TableHead className="text-center">Data Pagamento</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {allPayments.map(payment => {
                                    const statusInfo = statusConfig[payment.status] || statusConfig.pendente;
                                    const dueDate = new Date(payment.due_date);
                                    const monthYear = format(dueDate, 'MMM/yyyy', { locale: ptBR });

                                    return (
                                        <TableRow
                                            key={payment.id}
                                            className={cn(statusInfo.rowClassName)}
                                        >
                                            <TableCell className="font-medium">
                                                {payment.description}
                                            </TableCell>
                                            <TableCell className="text-center font-semibold">
                                                {formatCurrency(payment.amount)}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex flex-col items-center">
                                                    <span className="capitalize font-medium">{monthYear}</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {format(dueDate, 'dd/MM/yyyy')}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant="outline" className={statusInfo.className}>
                                                    {statusInfo.text}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {payment.paid_at ? (
                                                    <span className="text-sm">
                                                        {format(new Date(payment.paid_at), 'dd/MM/yyyy')}
                                                    </span>
                                                ) : (
                                                    <span className="text-sm text-muted-foreground">-</span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    </div>
  );
}
